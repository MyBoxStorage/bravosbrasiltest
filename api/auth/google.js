// Google OAuth - Iniciar fluxo de autenticação
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get environment variables
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || 
      `${process.env.SITE_URL || 'http://localhost:3000'}/api/auth/google/callback`;

    if (!clientId) {
      console.error('❌ GOOGLE_CLIENT_ID not configured');
      return res.status(500).json({ 
        error: 'Google OAuth not configured',
        message: 'GOOGLE_CLIENT_ID missing in environment variables'
      });
    }

    // Build Google OAuth URL
    const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    
    googleAuthUrl.searchParams.append('client_id', clientId);
    googleAuthUrl.searchParams.append('redirect_uri', redirectUri);
    googleAuthUrl.searchParams.append('response_type', 'code');
    googleAuthUrl.searchParams.append('scope', 'openid email profile');
    googleAuthUrl.searchParams.append('access_type', 'offline');
    googleAuthUrl.searchParams.append('prompt', 'consent');

    console.log('🔐 Redirecting to Google OAuth');
    console.log('📍 Redirect URI:', redirectUri);

    // Redirect user to Google
    return res.redirect(googleAuthUrl.toString());

  } catch (error) {
    console.error('❌ Error initiating Google OAuth:', error);
    return res.status(500).json({ 
      error: 'Failed to initiate Google authentication',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
