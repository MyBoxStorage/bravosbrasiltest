import { createLead, getAllLeads } from '../lib/database.js';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { nome, email, telefone, origem } = req.body;

      if (!email) {
        return res.status(400).json({ error: 'Email é obrigatório' });
      }

      const lead = createLead({
        nome: nome || '',
        email,
        telefone: telefone || '',
        origem: origem || 'site'
      });

      return res.status(201).json({
        success: true,
        lead: {
          id: lead.id,
          nome: lead.nome,
          email: lead.email,
          telefone: lead.telefone,
          origem: lead.origem,
          data_cadastro: lead.data_cadastro
        }
      });
    } catch (error) {
      console.error('Erro ao criar lead:', error);
      return res.status(500).json({ error: 'Erro ao criar lead' });
    }
  }

  if (req.method === 'GET') {
    try {
      // TODO: Adicionar autenticação para admin
      const leads = getAllLeads();
      return res.status(200).json({
        success: true,
        leads,
        total: leads.length
      });
    } catch (error) {
      console.error('Erro ao buscar leads:', error);
      return res.status(500).json({ error: 'Erro ao buscar leads' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
