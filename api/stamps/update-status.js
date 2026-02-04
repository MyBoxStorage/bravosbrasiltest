import { getUserIdFromRequest } from '../../lib/auth.js';
import { getEstampaById, updateEstampa } from '../../lib/database.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const userId = getUserIdFromRequest(req);

    if (!userId) {
      return res.status(401).json({ error: 'Não autenticado' });
    }

    const { estampaId, status } = req.body;

    if (!estampaId || !status) {
      return res.status(400).json({ error: 'ID da estampa e status são obrigatórios' });
    }

    const estampa = getEstampaById(estampaId);

    if (!estampa) {
      return res.status(404).json({ error: 'Estampa não encontrada' });
    }

    // Verificar se a estampa pertence ao usuário
    if (estampa.user_id !== userId) {
      return res.status(403).json({ error: 'Você não tem permissão para atualizar esta estampa' });
    }

    const updated = updateEstampa(estampaId, { status });

    return res.status(200).json({
      success: true,
      estampa: updated
    });
  } catch (error) {
    console.error('Erro ao atualizar status da estampa:', error);
    return res.status(500).json({ error: 'Erro ao atualizar status da estampa' });
  }
}
