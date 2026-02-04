import { getPayment } from '../../lib/mercadopago.js';
import { getUserById, updateUser, getCompraByPedidoId, createCompra, updateCompra, getEstampasByUserId, updateEstampa } from '../../lib/database.js';
import { uploadToGoogleDrive } from '../../lib/googledrive.js';

// Lógica para completar tentativas até 10
function liberarTentativasAposCompra(userId) {
  const user = getUserById(userId);
  if (!user) {
    return null;
  }

  const tentativasAtuais = user.tentativas_restantes || 0;
  const tentativasParaAdicionar = Math.max(0, 10 - tentativasAtuais);

  if (tentativasParaAdicionar > 0) {
    updateUser(userId, { tentativas_restantes: 10 });
    
    return {
      tentativas_antes: tentativasAtuais,
      tentativas_adicionadas: tentativasParaAdicionar,
      tentativas_depois: 10
    };
  }

  return {
    tentativas_antes: tentativasAtuais,
    tentativas_adicionadas: 0,
    tentativas_depois: tentativasAtuais
  };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { type, data } = req.body;

    // Mercado Pago envia diferentes tipos de notificações
    if (type === 'payment') {
      const paymentId = data.id;
      
      // Buscar detalhes do pagamento
      const payment = await getPayment(paymentId);
      
      if (payment.status === 'approved') {
        const userId = payment.external_reference;
        
        if (!userId) {
          console.error('Payment sem external_reference (userId)');
          return res.status(400).json({ error: 'Payment sem userId' });
        }

        // Verificar se compra já foi processada
        const compraExistente = getCompraByPedidoId(paymentId.toString());
        
        if (compraExistente && compraExistente.status_pagamento === 'approved') {
          // Já processado
          return res.status(200).json({ success: true, message: 'Compra já processada' });
        }

        // Criar/atualizar registro de compra
        const compraData = {
          user_id: userId,
          pedido_id_mercadopago: paymentId.toString(),
          valor: payment.transaction_amount,
          status_pagamento: 'approved',
          tentativas_antes: getUserById(userId)?.tentativas_restantes || 0
        };

        let compra;
        if (compraExistente) {
          compra = updateCompra(compraExistente.id, {
            ...compraData,
            data_confirmacao: new Date().toISOString()
          });
        } else {
          compra = createCompra(compraData);
        }

        // Liberar tentativas (completar até 10)
        const tentativasInfo = liberarTentativasAposCompra(userId);
        
        if (compra) {
          updateCompra(compra.id, {
            tentativas_antes: tentativasInfo.tentativas_antes,
            tentativas_adicionadas: tentativasInfo.tentativas_adicionadas,
            tentativas_depois: tentativasInfo.tentativas_depois
          });
        }

        // Buscar estampas do usuário que estão no carrinho/compradas
        const estampas = getEstampasByUserId(userId);
        const estampasParaProcessar = estampas.filter(e => 
          e.status === 'no_carrinho' || e.status === 'gerada'
        );

        // Upload para Google Drive (assíncrono, não bloqueia resposta)
        if (estampasParaProcessar.length > 0) {
          estampasParaProcessar.forEach(async (estampa) => {
            try {
              if (estampa.imagem_base64) {
                const driveUrl = await uploadToGoogleDrive(
                  estampa.imagem_base64,
                  `estampa_${estampa.id}_${Date.now()}.png`,
                  userId
                );
                
                // Atualizar estampa com URL do Drive
                updateEstampa(estampa.id, {
                  imagem_url: driveUrl,
                  status: 'processada',
                  purchase_id: compra.id
                });
                
                console.log(`Estampa ${estampa.id} enviada para Google Drive: ${driveUrl}`);
              }
            } catch (error) {
              console.error(`Erro ao fazer upload da estampa ${estampa.id}:`, error);
            }
          });
        }

        return res.status(200).json({ 
          success: true, 
          message: 'Pagamento processado com sucesso',
          tentativas_liberadas: tentativasInfo
        });
      }
    }

    return res.status(200).json({ success: true, message: 'Webhook recebido' });
  } catch (error) {
    console.error('Erro no webhook:', error);
    return res.status(500).json({ error: 'Erro ao processar webhook' });
  }
}
