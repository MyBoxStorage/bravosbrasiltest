// Google OAuth - Iniciar fluxo de autenticação
export default async function handler(req, res) {
  console.log('🔵 [GOOGLE AUTH] Endpoint chamado - Method:', req.method);

  if (req.method !== 'GET') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      allowedMethods: ['GET']
    });
  }

  try {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${process.env.SITE_URL || 'http://localhost:3000'}/api/auth/google/callback`;
    
    if (!clientId) {
      console.error('❌ GOOGLE_CLIENT_ID não configurado');
      return res.status(500).json({ 
        error: 'Google OAuth não configurado. Contate o suporte.'
      });
    }

    // Gerar state para segurança (prevenir CSRF)
    const state = Buffer.from(JSON.stringify({
      timestamp: Date.now(),
      random: Math.random().toString(36)
    })).toString('base64');

    // Parâmetros OAuth 2.0
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'offline',
      prompt: 'consent',
      state: state
    });

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

    console.log('🔗 Redirecionando para Google OAuth:', authUrl.substring(0, 100) + '...');

    // Redirecionar para Google
    return res.redirect(authUrl);

  } catch (error) {
    console.error('❌ Erro ao iniciar Google OAuth:', error);
    
    return res.status(500).json({ 
      error: 'Erro ao iniciar autenticação com Google',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
