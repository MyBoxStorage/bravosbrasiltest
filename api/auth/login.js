import { authenticateUser, generateToken } from '../../lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    const user = await authenticateUser(email, password);

    if (!user) {
      return res.status(401).json({ error: 'Email ou senha inválidos' });
    }

    const token = generateToken(user.id);

    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        tentativas_restantes: user.tentativas_restantes
      },
      token
    });
  } catch (error) {
    console.error('Erro no login:', error);
    return res.status(500).json({ error: 'Erro ao fazer login' });
  }
}
