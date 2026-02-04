import { getUserIdFromRequest } from '../../lib/auth.js';
import { createPaymentPreference } from '../../lib/mercadopago.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const userId = getUserIdFromRequest(req);

    if (!userId) {
      return res.status(401).json({ error: 'Não autenticado' });
    }

    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Itens do carrinho são obrigatórios' });
    }

    // Validar estrutura dos itens
    for (const item of items) {
      if (!item.name || !item.price || !item.quantity) {
        return res.status(400).json({ error: 'Cada item deve ter name, price e quantity' });
      }
    }

    const preference = await createPaymentPreference(items, userId);

    return res.status(200).json({
      success: true,
      preference_id: preference.id,
      init_point: preference.init_point,
      sandbox_init_point: preference.sandbox_init_point
    });
  } catch (error) {
    console.error('Erro ao criar pagamento:', error);
    return res.status(500).json({ 
      error: error.message || 'Erro ao criar preferência de pagamento' 
    });
  }
}
