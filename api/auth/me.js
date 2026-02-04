import { verifyToken } from '../../lib/auth.js';
import { getUserById } from '../../lib/database.js';

export default async function handler(req, res) {
  // Debug log to verify endpoint is being called
  console.log('🔵 [ME] Endpoint chamado - Method:', req.method, 'URL:', req.url);
  
  // Only accept GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      allowedMethods: ['GET']
    });
  }

  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Token não fornecido'
      });
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix

    // Verify token
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return res.status(401).json({ 
        error: 'Token inválido ou expirado'
      });
    }

    // Get user ID from token (can be userId or id)
    const userId = decoded.userId || decoded.id;
    
    if (!userId) {
      return res.status(401).json({ 
        error: 'Token inválido'
      });
    }

    // Get user from database
    const user = getUserById(userId);
    
    if (!user) {
      return res.status(404).json({ 
        error: 'Usuário não encontrado'
      });
    }

    // Return user data (without password)
    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        nome: user.nome || '',
        email: user.email,
        telefone: user.telefone || null,
        tentativas_restantes: user.tentativas_restantes || 10
      }
    });

  } catch (error) {
    console.error('❌ Erro ao verificar token:', error);
    
    return res.status(401).json({ 
      error: 'Token inválido',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
