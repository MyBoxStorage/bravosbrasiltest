import Replicate from 'replicate';
import { getUserIdFromRequest } from '../../lib/auth.js';
import { getUserById, updateUser, createEstampa } from '../../lib/database.js';

// Inicializa Replicate com o token da API
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN
});

// Constrói um prompt otimizado para estampa de camiseta
function buildStampPrompt(userPrompt) {
  let optimized = 'Create a professional silk screen print design for t-shirt. ';
  
  // Entrada criativa do usuário
  optimized += 'Design concept: ' + userPrompt + '. ';
  
  // Estilo patriótico brasileiro
  optimized += 'Theme: Brazilian patriotic design with national identity. ';
  optimized += 'Colors: Use vibrant Brazilian colors - green (#00843D), yellow (#FFCC29), blue (#002776), and white. ';
  
  // Especificações técnicas para silk screen
  optimized += 'Style: Bold graphic design, vector art aesthetic, high contrast, clean lines, iconic minimalist approach. ';
  optimized += 'Composition: Centered and well-balanced, print-ready quality, suitable for screen printing on fabric. ';
  optimized += 'Format: Flat design, no complex gradients, solid colors, sharp edges, vintage poster style. ';
  
  // O que evitar
  optimized += 'Avoid: Photorealistic details, complex shadows, small intricate text, gradients that cannot be screen printed, 3D effects, low contrast elements. ';
  
  // Qualidade final
  optimized += 'Quality: Professional, iconic, memorable, suitable for patriotic Brazilian t-shirt merchandise.';
  
  return optimized;
}

export default async function handler(req, res) {
  // Apenas POST é permitido
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      message: 'Use o método POST para gerar estampas'
    });
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

    const { prompt, image } = req.body;

    if ((!prompt || !prompt.trim()) && !image) {
      return res.status(400).json({ 
        error: 'Prompt ou imagem é obrigatório',
        message: 'Descreva sua ideia para a estampa ou envie uma imagem de referência'
      });
    }

    const userPrompt = (prompt || '').substring(0, 500);

    console.log('═══════════════════════════════════════════');
    console.log('🎨 INICIANDO GERAÇÃO DE ESTAMPA');
    console.log('═══════════════════════════════════════════');
    console.log('📝 Prompt do usuário:', userPrompt);
    console.log('📷 Imagem de referência:', image ? 'SIM (enviada)' : 'NÃO');
    console.log('⏰ Timestamp:', new Date().toISOString());

    // Construir prompt otimizado
    const optimizedPrompt = buildStampPrompt(userPrompt);
    console.log('✨ Prompt otimizado:', optimizedPrompt.substring(0, 150) + '...');

    // Montar input para FLUX-2-PRO
    const input = {
      prompt: optimizedPrompt,
      aspect_ratio: '1:1',
      output_format: 'png',
      output_quality: 100,
      safety_tolerance: 5, // Máxima tolerância - permite conteúdo patriótico/político
      seed: null
    };

    // Se houver imagem de referência, adiciona ao input
    if (image && image.data) {
      console.log('📸 Adicionando imagem de referência ao input');
      
      const mimeType = image.mimeType || 'image/png';
      input.image = `data:${mimeType};base64,${image.data}`;
      input.prompt_strength = 0.85; // Maior peso para o prompt, mantendo características da imagem
      
      console.log('🎚️ Prompt strength: 0.85 (forte influência do prompt)');
    }

    console.log('🚀 Chamando FLUX-2-PRO via Replicate...');

    const output = await replicate.run('black-forest-labs/flux-2-pro', { input });

    if (!output) {
      console.error('❌ ERRO: Nenhum output recebido do modelo');
      throw new Error('O modelo não retornou nenhuma imagem. Tente novamente.');
    }

    console.log('✅ SUCESSO: Imagem gerada!');
    console.log('🔗 Tipo de output:', typeof output);

    // Output pode ser string ou array de URLs
    let imageUrl;
    if (typeof output === 'string') {
      imageUrl = output;
    } else if (output.url) {
      imageUrl = output.url;
    } else if (Array.isArray(output) && output[0]) {
      imageUrl = output[0];
    } else {
      console.error('❌ Formato de output inesperado:', output);
      throw new Error('Formato de resposta inválido do modelo de imagem');
    }

    console.log('🖼️ URL da imagem (Replicate):', String(imageUrl).substring(0, 120) + '...');

    // Baixar imagem e converter para base64 (data URL) para manter compatibilidade com o restante do sistema
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error(`Erro ao baixar imagem gerada: ${imageResponse.statusText}`);
    }

    const imageBuffer = await imageResponse.arrayBuffer();
    const base64Image = Buffer.from(imageBuffer).toString('base64');
    const dataUrl = `data:image/png;base64,${base64Image}`;

    console.log('✅ Imagem convertida para base64 data URL');
    console.log('═══════════════════════════════════════════');

    // Decrementar tentativas
    const novasTentativas = Math.max(0, tentativasRestantes - 1);
    updateUser(userId, { tentativas_restantes: novasTentativas });

    // Salvar estampa no \"banco\" (em memória) com status inicial 'gerada'
    const estampa = createEstampa({
      user_id: userId,
      prompt: userPrompt,
      imagem_base64: dataUrl,
      status: 'gerada'
    });

    return res.status(200).json({
      success: true,
      imageUrl: dataUrl,
      prompt: userPrompt,
      tentativas_restantes: novasTentativas,
      estampa_id: estampa.id,
      model: 'flux-2-pro'
    });
  } catch (error) {
    console.error('═══════════════════════════════════════════');
    console.error('❌ ERRO NA GERAÇÃO DE IMAGEM');
    console.error('═══════════════════════════════════════════');
    console.error('Tipo:', error.name);
    console.error('Mensagem:', error.message);
    console.error('Stack:', error.stack);
    console.error('═══════════════════════════════════════════');
    
    let errorMessage = 'Erro ao gerar imagem';

    if (error.message.includes('NSFW') || error.message.includes('safety') || error.message.includes('content policy')) {
      errorMessage = 'O conteúdo foi filtrado pelos sistemas de segurança. Tente reformular sua descrição de forma mais genérica ou simbólica.';
    } else if (error.message.includes('rate limit') || error.message.includes('quota') || error.message.includes('too many')) {
      errorMessage = 'Limite de requisições atingido. Aguarde alguns segundos e tente novamente.';
    } else if (error.message.includes('authentication') || error.message.includes('401') || error.message.includes('unauthorized')) {
      errorMessage = 'Erro de autenticação com o serviço de IA. Verifique o token REPLICATE_API_TOKEN ou contate o suporte.';
    } else if (error.message.includes('timeout') || error.message.includes('timed out')) {
      errorMessage = 'A geração demorou muito tempo. Tente novamente com uma descrição mais simples.';
    } else if (error.message.includes('Invalid') || error.message.includes('invalid')) {
      errorMessage = 'Dados inválidos enviados. Verifique sua descrição e tente novamente.';
    } else {
      errorMessage = error.message || 'Erro inesperado ao gerar imagem. Tente novamente.';
    }

    return res.status(500).json({
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? {
        originalError: error.message,
        stack: error.stack
      } : undefined
    });
  }
}
