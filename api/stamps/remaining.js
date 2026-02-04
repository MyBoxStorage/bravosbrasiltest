import { getUserIdFromRequest } from '../../lib/auth.js';
import { getUserById } from '../../lib/database.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const userId = getUserIdFromRequest(req);

    if (!userId) {
      return res.status(401).json({ error: 'Não autenticado' });
    }

    const user = getUserById(userId);

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    return res.status(200).json({
      success: true,
      tentativas_restantes: user.tentativas_restantes || 10
    });
  } catch (error) {
    console.error('Erro ao buscar tentativas:', error);
    return res.status(500).json({ error: 'Erro ao buscar tentativas restantes' });
  }
}
