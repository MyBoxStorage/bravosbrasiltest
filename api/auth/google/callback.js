// Google OAuth - Callback após autenticação
import { generateToken } from '../../../lib/auth.js';
import { getUserByEmail, createUser, updateUser } from '../../../lib/database.js';
import { createLead } from '../../../lib/database.js';

export default async function handler(req, res) {
  console.log('🔵 [GOOGLE CALLBACK] Endpoint chamado - Method:', req.method);
  console.log('📥 Query params:', req.query);

  if (req.method !== 'GET') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      allowedMethods: ['GET']
    });
  }

  try {
    const { code, error, state } = req.query;

    // Verificar se houve erro do Google
    if (error) {
      console.error('❌ Google OAuth retornou erro:', error);
      return res.redirect(`/?auth_error=${encodeURIComponent(error)}`);
    }

    if (!code) {
      console.error('❌ Código de autorização não recebido');
      return res.redirect(`/?auth_error=${encodeURIComponent('Código de autorização não recebido')}`);
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${process.env.SITE_URL || 'http://localhost:3000'}/api/auth/google/callback`;

    if (!clientId || !clientSecret) {
      console.error('❌ Google OAuth não configurado (faltam credenciais)');
      return res.redirect(`/?auth_error=${encodeURIComponent('Configuração OAuth incompleta')}`);
    }

    console.log('🔄 Trocando código por token de acesso...');

    // Trocar código por token de acesso
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code: code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code'
      })
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error('❌ Erro ao trocar código por token:', errorData);
      return res.redirect(`/?auth_error=${encodeURIComponent('Erro ao autenticar com Google')}`);
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      console.error('❌ Token de acesso não recebido');
      return res.redirect(`/?auth_error=${encodeURIComponent('Token de acesso não recebido')}`);
    }

    console.log('✅ Token de acesso recebido');

    // Buscar informações do usuário no Google
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!userInfoResponse.ok) {
      console.error('❌ Erro ao buscar informações do usuário');
      return res.redirect(`/?auth_error=${encodeURIComponent('Erro ao buscar informações do usuário')}`);
    }

    const googleUser = await userInfoResponse.json();
    console.log('👤 Usuário do Google:', googleUser.email);

    // Verificar se usuário já existe
    let user = getUserByEmail(googleUser.email);

    if (!user) {
      // Criar novo usuário
      console.log('📝 Criando novo usuário do Google:', googleUser.email);
      
      user = createUser({
        nome: googleUser.name || googleUser.given_name || 'Usuário Google',
        email: googleUser.email,
        senha_hash: null, // Sem senha para login OAuth
        telefone: null,
        tentativas_restantes: 10,
        google_id: googleUser.id,
        avatar_url: googleUser.picture
      });

      // Criar lead
      createLead({
        nome: user.nome,
        email: user.email,
        telefone: '',
        origem: 'google_oauth'
      });

      console.log('✅ Usuário criado:', user.id);
    } else {
      // Atualizar informações do Google se necessário
      if (!user.google_id) {
        user = updateUser(user.id, {
          google_id: googleUser.id,
          avatar_url: googleUser.picture
        });
      }
      console.log('✅ Usuário existente encontrado:', user.id);
    }

    // Gerar JWT token
    const token = generateToken(user.id);

    console.log('✅ Token JWT gerado para:', user.email);

    // Redirecionar para frontend com token
    // O frontend vai pegar o token da URL e salvar no localStorage
    const frontendUrl = `${process.env.SITE_URL || 'http://localhost:3000'}/?google_auth_success=true&token=${encodeURIComponent(token)}`;
    
    return res.redirect(frontendUrl);

  } catch (error) {
    console.error('❌ Erro no callback do Google OAuth:', error);
    
    return res.redirect(`/?auth_error=${encodeURIComponent('Erro ao processar autenticação Google')}`);
  }
}
