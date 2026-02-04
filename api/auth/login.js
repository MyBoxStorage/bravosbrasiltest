import { comparePassword, generateToken } from '../../lib/auth.js';
import { getUserByEmail } from '../../lib/database.js';

export default async function handler(req, res) {
  // Debug log to verify endpoint is being called
  console.log('🔵 [LOGIN] Endpoint chamado - Method:', req.method, 'URL:', req.url);
  
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      allowedMethods: ['POST']
    });
  }

  try {
    // Frontend sends: email, senha
    const { email, senha } = req.body;

    // Validate required fields
    if (!email || !senha) {
      return res.status(400).json({ 
        error: 'Email e senha são obrigatórios'
      });
    }

    console.log('🔐 Tentativa de login:', email);

    // Get user from database
    const user = getUserByEmail(email);
    
    if (!user) {
      console.log('⚠️ Usuário não encontrado:', email);
      return res.status(401).json({ 
        error: 'Email ou senha incorretos'
      });
    }

    // Verify password (check both senha_hash and senha for compatibility)
    const passwordHash = user.senha_hash || user.senha;
    if (!passwordHash) {
      console.log('⚠️ Usuário sem senha cadastrada:', email);
      return res.status(401).json({ 
        error: 'Email ou senha incorretos'
      });
    }

    const isPasswordValid = await comparePassword(senha, passwordHash);
    
    if (!isPasswordValid) {
      console.log('⚠️ Senha incorreta para:', email);
      return res.status(401).json({ 
        error: 'Email ou senha incorretos'
      });
    }

    console.log('✅ Login bem-sucedido:', email);

    // Generate JWT token
    const token = generateToken(user.id);

    // Return success with token and user data
    return res.status(200).json({
      success: true,
      message: 'Login realizado com sucesso',
      token: token,
      user: {
        id: user.id,
        nome: user.nome || '',
        email: user.email,
        telefone: user.telefone || null,
        tentativas_restantes: user.tentativas_restantes || 10
      }
    });

  } catch (error) {
    console.error('❌ Erro no login:', error);
    
    return res.status(500).json({ 
      error: 'Erro ao fazer login. Tente novamente.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
