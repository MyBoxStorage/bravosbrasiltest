import { getUserIdFromRequest } from '../../lib/auth.js';
import { getUserById, updateUser, createEstampa } from '../../lib/database.js';
import { generateStamp } from '../../lib/gemini.js';
import { phrases } from '../../lib/constants.js';

// Helper para detectar prompt genérico
function isGenericPrompt(prompt, hasImage) {
  const genericWords = ['gere', 'crie', 'nova', 'design', 'estampa'];
  const isGeneric = genericWords.some(word => 
    prompt.toLowerCase().includes(word)
  ) && prompt.length < 20 && !hasImage;
  return isGeneric;
}

// Otimizar prompt para evitar bloqueios de segurança
function optimizePromptForSafety(userPrompt) {
  if (!userPrompt) return userPrompt;
  
  let optimized = userPrompt
    // Remover nomes políticos explícitos
    .replace(/bolsonaro/gi, 'líder patriota')
    .replace(/lula/gi, 'figura política')
    .replace(/pt\b|psol\b|psl\b|pl\b/gi, 'partido político')
    .replace(/partido dos trabalhadores/gi, 'movimento político')
    .replace(/partido socialista/gi, 'movimento político');
  
  // Adicionar enquadramento artístico se não tiver
  if (!optimized.toLowerCase().includes('artístic') && 
      !optimized.toLowerCase().includes('composição') &&
      !optimized.toLowerCase().includes('ilustração')) {
    optimized = `composição artística patriótica brasileira: ${optimized}`;
  }
  
  // Adicionar descritor de estilo para tornar mais "arte" que "político"
  if (!optimized.toLowerCase().includes('estilo') &&
      !optimized.toLowerCase().includes('simbólic')) {
    optimized += ', estilo ilustração conceitual, interpretação simbólica';
  }
  
  return optimized;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
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

    // Verificar tentativas restantes
    const tentativasRestantes = user.tentativas_restantes || 10;
    if (tentativasRestantes <= 0) {
      return res.status(403).json({ 
        error: 'Você não tem mais tentativas. Faça uma compra para ganhar mais tentativas!' 
      });
    }

    const { prompt: userPrompt, image } = req.body;

    if (!userPrompt && !image) {
      return res.status(400).json({ error: 'Prompt ou imagem é obrigatório' });
    }

    // Limitar prompt a 500 caracteres
    let finalPrompt = (userPrompt || '').substring(0, 500);
    
    // Sistema de prompts inteligente
    if (isGenericPrompt(finalPrompt, !!image)) {
      finalPrompt = phrases[Math.floor(Math.random() * phrases.length)];
    }
    
    // Otimizar prompt para evitar bloqueios de segurança (conteúdo político/patriótico)
    finalPrompt = optimizePromptForSafety(finalPrompt);

    // Preparar imagem se fornecida
    let imagePayload = null;
    if (image) {
      imagePayload = {
        data: image.data,
        mimeType: image.mimeType || 'image/png'
      };
    }

    // Gerar estampa
    const imageUrl = await generateStamp(finalPrompt, imagePayload);

    // Decrementar tentativas
    const novasTentativas = Math.max(0, tentativasRestantes - 1);
    updateUser(userId, { tentativas_restantes: novasTentativas });

    // Salvar estampa no banco
    const estampa = createEstampa({
      user_id: userId,
      prompt: finalPrompt,
      imagem_base64: imageUrl,
      status: 'gerada'
    });

    return res.status(200).json({
      success: true,
      imageUrl,
      prompt: finalPrompt,
      tentativas_restantes: novasTentativas,
      estampa_id: estampa.id
    });
  } catch (error) {
    console.error('Erro ao gerar estampa:', error);
    return res.status(500).json({ 
      error: error.message || 'Erro ao gerar estampa. Tente novamente.' 
    });
  }
}
