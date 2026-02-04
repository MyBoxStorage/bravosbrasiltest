// Google OAuth - Callback após autenticação
import { generateToken } from '../../../lib/auth.js';
import { getUserByEmail, createUser, updateUser } from '../../../lib/database.js';
import { createLead } from '../../../lib/database.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { code, error, error_description } = req.query;

    // Check if user denied access
    if (error) {
      console.log('⚠️ User denied Google OAuth:', error_description);
      return res.redirect('/?error=google_auth_denied');
    }

    // Validate authorization code
    if (!code) {
      return res.redirect('/?error=no_auth_code');
    }

    console.log('🔐 Received authorization code from Google');

    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code: code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI || 
          `${process.env.SITE_URL || 'http://localhost:3000'}/api/auth/google/callback`,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error('❌ Token exchange failed:', errorData);
      return res.redirect('/?error=token_exchange_failed');
    }

    const tokens = await tokenResponse.json();
    console.log('✅ Received access token from Google');

    // Get user info from Google
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });

    if (!userInfoResponse.ok) {
      console.error('❌ Failed to get user info from Google');
      return res.redirect('/?error=user_info_failed');
    }

    const googleUser = await userInfoResponse.json();
    console.log('👤 Google user:', googleUser.email);

    // Check if user exists in database
    let user = getUserByEmail(googleUser.email);

    if (!user) {
      // Create new user
      console.log('📝 Creating new user from Google account');
      user = createUser({
        nome: googleUser.name || googleUser.given_name || 'Usuário Google',
        email: googleUser.email,
        senha_hash: null, // No password for OAuth users
        telefone: null,
        tentativas_restantes: 10,
        google_id: googleUser.id,
        avatar_url: googleUser.picture,
        auth_provider: 'google'
      });

      // Create lead
      createLead({
        nome: user.nome,
        email: user.email,
        telefone: '',
        origem: 'google_oauth'
      });
    } else {
      // Update existing user with Google info if not already set
      if (!user.google_id) {
        console.log('🔄 Linking Google account to existing user');
        user = updateUser(user.id, { 
          google_id: googleUser.id, 
          avatar_url: googleUser.picture,
          auth_provider: 'google'
        });
      }
    }

    // Generate JWT token
    const jwtToken = generateToken(user.id);

    console.log('✅ Google OAuth successful, redirecting with token');

    // Redirect to home page with token in URL
    // Frontend will extract token and save to localStorage
    return res.redirect(`/?auth_token=${jwtToken}&auth_method=google`);

  } catch (error) {
    console.error('❌ Google OAuth callback error:', error);
    return res.redirect('/?error=google_auth_failed');
  }
}
