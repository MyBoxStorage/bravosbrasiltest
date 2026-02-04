// Gemini AI integration
import { phrases } from './constants.js';

let GoogleGenAI = null;
let HarmCategory = null;
let HarmBlockThreshold = null;

function initGemini() {
  if (!GoogleGenAI && typeof require !== 'undefined') {
    try {
      const genai = require('@google/genai');
      GoogleGenAI = genai.GoogleGenAI;
      HarmCategory = genai.HarmCategory;
      HarmBlockThreshold = genai.HarmBlockThreshold;
    } catch (error) {
      console.error('Erro ao carregar @google/genai:', error);
    }
  }
  return { GoogleGenAI, HarmCategory, HarmBlockThreshold };
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
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY não configurada');
  }

  const { GoogleGenAI: GenAI, HarmCategory: HC, HarmBlockThreshold: HBT } = initGemini();
  
  if (!GenAI) {
    throw new Error('Biblioteca @google/genai não disponível');
  }

  const ai = new GenAI({ apiKey });
  
  const fullPrompt = getBasePrompt(userPrompt, !!image);
  const parts = [{ text: fullPrompt }];

  if (image) {
    parts.push({
      inlineData: {
        data: image.data,
        mimeType: image.mimeType,
      },
    });
  }

  const safetySettings = [
    {
      category: HC.HARM_CATEGORY_HARASSMENT,
      threshold: HBT.BLOCK_ONLY_HIGH,
    },
    {
      category: HC.HARM_CATEGORY_HATE_SPEECH,
      threshold: HBT.BLOCK_ONLY_HIGH,
    },
    {
      category: HC.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HBT.BLOCK_ONLY_HIGH,
    },
    {
      category: HC.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HBT.BLOCK_ONLY_HIGH,
    },
  ];

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: { parts },
      config: {
        imageConfig: {
          aspectRatio: "3:4",
          imageSize: "4K"
        }
      },
      safetySettings
    });

    if (!response.candidates || response.candidates.length === 0) {
      if (response.promptFeedback?.blockReason) {
        throw new Error(`A geração foi bloqueada pela política de segurança. Motivo: ${response.promptFeedback.blockReason}. Por favor, tente um prompt com termos diferentes.`);
      }
      throw new Error("A API não retornou nenhum resultado. Isso pode acontecer se o prompt for muito complexo ou violar as políticas de uso.");
    }

    const candidate = response.candidates[0];

    if (candidate.finishReason === 'SAFETY') {
      throw new Error("O conteúdo solicitado não pôde ser gerado devido às políticas de segurança. Por favor, tente um prompt diferente.");
    }

    for (const part of candidate.content.parts) {
      if (part.inlineData) {
        const base64Data = part.inlineData.data;
        return `data:image/png;base64,${base64Data}`;
      }
    }

    const textResponse = candidate.content.parts.map(p => p.text).join('\n').trim();
    if (textResponse) {
      throw new Error(`A API não gerou uma imagem e respondeu com texto: "${textResponse.substring(0, 100)}..."`);
    }

    throw new Error("Não foi possível encontrar dados de imagem na resposta da API. A resposta pode estar vazia ou em um formato inesperado.");
  } catch (error) {
    console.error('Erro ao gerar estampa:', error);
    throw error;
  }
}
