import { getUserIdFromRequest } from '../../../lib/auth.js';
import { getEstampaById } from '../../../lib/database.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const userId = getUserIdFromRequest(req);

    if (!userId) {
      return res.status(401).json({ error: 'Não autenticado' });
    }

    // Get estampa ID from URL
    const estampaId = req.query.id;

    if (!estampaId) {
      return res.status(400).json({ error: 'ID da estampa é obrigatório' });
    }

    const estampa = getEstampaById(estampaId);

    if (!estampa) {
      return res.status(404).json({ error: 'Estampa não encontrada' });
    }

    // Verificar se a estampa pertence ao usuário
    if (estampa.user_id !== userId) {
      return res.status(403).json({ error: 'Você não tem permissão para acessar esta estampa' });
    }

    return res.status(200).json({
      success: true,
      estampa: {
        id: estampaId,
        ...estampa
      }
    });
  } catch (error) {
    console.error('Erro ao buscar estampa:', error);
    return res.status(500).json({ error: 'Erro ao buscar estampa' });
  }
}
