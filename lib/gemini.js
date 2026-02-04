// Image generation using Replicate (Stable Diffusion)
// CRITICAL FIX: Migrated from Gemini text model to actual image generation model
import { phrases } from './constants.js';

let Replicate = null;

function initReplicate() {
  if (!Replicate && typeof require !== 'undefined') {
    try {
      Replicate = require('replicate').default || require('replicate');
    } catch (error) {
      console.error('Erro ao carregar replicate:', error);
    }
  }
  return Replicate;
}

const getBasePrompt = (userRequest, hasImage) => {
  const imageInstructions = `
  - **CENTRAL ELEMENT:** Use the uploaded image as the central element. Enhance it by integrating it seamlessly into the design. Apply the following effects while preserving the subject's features: subtle Brazilian flag overlays, green/yellow paint splashes, dramatic lighting, halo/glow effects, or distressed textures.
  `;
  const textInstructions = `
  - **CENTRAL ELEMENT:** The design must be built around a powerful Brazilian patriotic symbol. Examples include: a beautifully rendered, waving Brazilian flag; the national coat of arms; the silhouette of the map of Brazil; or an abstract representation of national pride using green and yellow elements.
  `;

  return `
    GENERATE A HIGH-RESOLUTION T-SHIRT DESIGN FOR DTF PRINTING.

    **CRITICAL OUTPUT REQUIREMENTS:**
    1.  **FORMAT:** Transparent PNG, 300 DPI, 4500px width x 5400px height.
    2.  **BACKGROUND:** MUST be 100% transparent. Preserve the alpha channel.
    3.  **CONTENT:** Generate ONLY the isolated design graphic.
    4.  **PROHIBITED:** ABSOLUTELY NO mockups on t-shirts, NO folded shirts, NO models wearing shirts, NO plain backgrounds, NO watermarks.
    5.  **QUALITY:** Vector-like sharpness with clean, anti-aliased edges. Vibrant colors. No compression artifacts.

    **AESTHETIC & THEME GUIDELINES:**
    - **THEME:** Patriotic designs for a Brazilian audience.
    - **STYLE:** Heroic, motivational, strong, epic.
    - **COLOR PALETTE:** Dominant colors are Brazilian flag green (#00843D) and yellow (#FFCC29). Use white and black for accents. ABSOLUTELY NO RED color.
    ${hasImage ? imageInstructions : textInstructions}
    - **INTEGRATED BACKGROUND EFFECTS (within the design itself):**
      - Waving or distressed Brazilian flag texture.
      - Green and yellow paint splashes or drips.
      - Dramatic lighting, sun rays, or a subtle glow effect.
      - Wisps of smoke.
      - Torn flag effect revealing text.
    - **TYPOGRAPHY:**
      - **FONT:** Bold, impactful, strong sans-serif or military stencil-style fonts.
      - **LANGUAGE:** 100% correct Brazilian Portuguese (PT-BR).
      - **TEXT:** All text should be uppercase or title case. Use high contrast (e.g., yellow on green, white on dark). Add a subtle drop shadow or outline for maximum readability.
      - **ALLOWED PHRASES:** If text is needed, use a phrase from this list: ${phrases.join(', ')}.

    **USER REQUEST:**
    "${userRequest}"

    Create a new, completely original design based on these instructions.
  `;
};

export async function generateStamp(userPrompt, image = null) {
  const apiToken = process.env.REPLICATE_API_TOKEN;
  if (!apiToken) {
    throw new Error('REPLICATE_API_TOKEN não configurada. Configure a variável de ambiente REPLICATE_API_TOKEN com seu token do Replicate.');
  }

  const ReplicateClass = initReplicate();
  if (!ReplicateClass) {
    throw new Error('Biblioteca replicate não disponível. Execute: npm install replicate');
  }

  const replicate = new ReplicateClass({
    auth: apiToken
  });

  // Build optimized prompt for Brazilian patriotic stamp design
  const fullPrompt = getBasePrompt(userPrompt, !!image);
  
  // Convert to Stable Diffusion optimized prompt
  const optimizedPrompt = buildStableDiffusionPrompt(fullPrompt, userPrompt);

  try {
    console.log('Generating image with Replicate Stable Diffusion...');
    console.log('Optimized prompt:', optimizedPrompt.substring(0, 200) + '...');

    // Use SDXL model for high quality image generation
    const output = await replicate.run(
      "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
      {
        input: {
          prompt: optimizedPrompt,
          negative_prompt: "photograph, realistic photo, photorealistic, blurry, low quality, watermark, text overlay, mockup, t-shirt mockup, folded shirt, person wearing shirt, gradient that can't be screen printed, small text, unreadable text, red color",
          width: 1024,
          height: 1024,
          num_outputs: 1,
          guidance_scale: 7.5,
          num_inference_steps: 40,
          scheduler: "K_EULER"
        }
      }
    );

    if (!output || !Array.isArray(output) || output.length === 0) {
      console.error('Replicate returned no images:', output);
      throw new Error('Não foi possível gerar a imagem. A API não retornou resultados.');
    }

    // Replicate returns URL, we need to fetch and convert to base64
    const imageUrl = output[0];
    console.log('Image generated at URL:', imageUrl);

    // Fetch image from URL and convert to base64
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error(`Erro ao baixar imagem gerada: ${imageResponse.statusText}`);
    }

    const imageBuffer = await imageResponse.arrayBuffer();
    const base64Image = Buffer.from(imageBuffer).toString('base64');
    
    return `data:image/png;base64,${base64Image}`;

  } catch (error) {
    console.error('Erro ao gerar estampa:', error);
    
    // Provide helpful error messages
    if (error.message.includes('401') || error.message.includes('Unauthorized')) {
      throw new Error('Token do Replicate inválido. Verifique a variável REPLICATE_API_TOKEN.');
    }
    
    if (error.message.includes('rate limit')) {
      throw new Error('Limite de requisições excedido. Tente novamente em alguns minutos.');
    }
    
    throw error;
  }
}

// Build optimized prompt for Stable Diffusion
function buildStableDiffusionPrompt(basePrompt, userPrompt) {
  // Start with user's specific request (most important)
  let optimized = `${userPrompt}, `;
  
  // Add style specifications for silk screen printing
  optimized += `professional silk screen print design for t-shirt, `;
  optimized += `bold graphic style, high contrast, vector art style, `;
  optimized += `Brazilian patriotic colors (green #00843D, yellow #FFCC29, blue #002776), `;
  optimized += `centered composition, print-ready design, clean lines, `;
  optimized += `heroic and epic style, strong typography, `;
  optimized += `suitable for DTF printing, transparent background preferred, `;
  optimized += `no gradients, solid colors, sharp edges, `;
  optimized += `isolated design graphic, no mockups, no watermarks`;
  
  return optimized;
}
