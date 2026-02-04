// Mercado Pago integration
// Using Mercado Pago SDK

let mercadopago = null;

export function initMercadoPago() {
  if (!mercadopago && typeof require !== 'undefined') {
    try {
      mercadopago = require('mercadopago');
      mercadopago.configure({
        access_token: process.env.MERCADOPAGO_ACCESS_TOKEN
      });
    } catch (error) {
      console.error('Erro ao inicializar Mercado Pago:', error);
    }
  }
  return mercadopago;
}

export async function createPaymentPreference(items, userId, backUrls) {
  initMercadoPago();
  
  if (!mercadopago) {
    throw new Error('Mercado Pago não configurado');
  }

  const preference = {
    items: items.map(item => ({
      title: item.name,
      quantity: item.quantity,
      unit_price: item.price,
      picture_url: item.image
    })),
    payer: {
      email: '', // Será preenchido no checkout
    },
    back_urls: backUrls || {
      success: `${process.env.SITE_URL || 'https://bravos-brasil-r24o.vercel.app'}/pagamento/sucesso`,
      failure: `${process.env.SITE_URL || 'https://bravos-brasil-r24o.vercel.app'}/pagamento/erro`,
      pending: `${process.env.SITE_URL || 'https://bravos-brasil-r24o.vercel.app'}/pagamento/pendente`
    },
    auto_return: 'approved',
    external_reference: userId, // Para identificar o usuário no webhook
    notification_url: `${process.env.SITE_URL || 'https://bravos-brasil-r24o.vercel.app'}/api/payment/webhook`,
    statement_descriptor: 'BRAVOS BRASIL'
  };

  try {
    const response = await mercadopago.preferences.create(preference);
    return response.body;
  } catch (error) {
    console.error('Erro ao criar preferência de pagamento:', error);
    throw error;
  }
}

export async function getPayment(paymentId) {
  initMercadoPago();
  
  if (!mercadopago) {
    throw new Error('Mercado Pago não configurado');
  }

  try {
    const response = await mercadopago.payment.findById(paymentId);
    return response.body;
  } catch (error) {
    console.error('Erro ao buscar pagamento:', error);
    throw error;
  }
}
