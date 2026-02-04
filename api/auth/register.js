import { registerUser, generateToken } from '../../lib/auth.js';
import { createLead } from '../../lib/database.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password, nome, telefone } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Email inválido' });
    }

    // Validar senha (mínimo 6 caracteres)
    if (password.length < 6) {
      return res.status(400).json({ error: 'Senha deve ter no mínimo 6 caracteres' });
    }

    // Registrar usuário
    const user = await registerUser(email, password);

    // Criar lead se nome e telefone foram fornecidos
    if (nome || telefone) {
      createLead({
        nome: nome || '',
        email,
        telefone: telefone || '',
        origem: 'cadastro_gerador'
      });
    }

    // Gerar token
    const token = generateToken(user.id);

    return res.status(201).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        tentativas_restantes: user.tentativas_restantes
      },
      token
    });
  } catch (error) {
    console.error('Erro no registro:', error);
    return res.status(400).json({ error: error.message || 'Erro ao registrar usuário' });
  }
}
