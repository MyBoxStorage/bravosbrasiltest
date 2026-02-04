import { hashPassword, generateToken } from '../../lib/auth.js';
import { createUser, getUserByEmail } from '../../lib/database.js';
import { createLead } from '../../lib/database.js';

export default async function handler(req, res) {
  // Debug log to verify endpoint is being called
  console.log('🔵 [REGISTER] Endpoint chamado - Method:', req.method, 'URL:', req.url);
  
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      allowedMethods: ['POST']
    });
  }

  try {
    // Frontend sends: nome, email, senha, telefone
    const { nome, email, senha, telefone } = req.body;

    // Validate required fields
    if (!nome || !email || !senha) {
      return res.status(400).json({ 
        error: 'Campos obrigatórios faltando',
        required: ['nome', 'email', 'senha']
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: 'Email inválido'
      });
    }

    // Validate password length
    if (senha.length < 6) {
      return res.status(400).json({ 
        error: 'A senha deve ter no mínimo 6 caracteres'
      });
    }

    console.log('📝 Tentando registrar novo usuário:', email);

    // Check if user already exists
    const existingUser = getUserByEmail(email);
    if (existingUser) {
      console.log('⚠️ Email já cadastrado:', email);
      return res.status(409).json({ 
        error: 'Este email já está cadastrado. Faça login.'
      });
    }

    // Hash password
    const senha_hash = await hashPassword(senha);

    // Create user in database
    const newUser = createUser({
      nome: nome.trim(),
      email: email.trim().toLowerCase(),
      senha_hash: senha_hash,
      telefone: telefone ? telefone.trim() : null,
      tentativas_restantes: 10 // Initial free attempts
    });

    console.log('✅ Usuário criado com sucesso:', newUser.id);

    // Create lead if nome or telefone provided
    if (nome || telefone) {
      createLead({
        nome: nome || '',
        email,
        telefone: telefone || '',
        origem: 'cadastro_gerador'
      });
    }

    // Generate JWT token
    const token = generateToken(newUser.id);

    // Return success with token and user data
    return res.status(201).json({
      success: true,
      message: 'Conta criada com sucesso',
      token: token,
      user: {
        id: newUser.id,
        nome: newUser.nome,
        email: newUser.email,
        telefone: newUser.telefone,
        tentativas_restantes: newUser.tentativas_restantes || 10
      }
    });

  } catch (error) {
    console.error('❌ Erro no registro:', error);
    
    return res.status(500).json({ 
      error: 'Erro ao criar conta. Tente novamente.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
