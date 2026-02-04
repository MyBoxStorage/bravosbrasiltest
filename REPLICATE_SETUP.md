# 🔧 Configuração do Replicate para Geração de Imagens

## ✅ Mudança Implementada

**PROBLEMA RESOLVIDO:** O sistema estava usando Gemini (modelo de texto) que retornava descrições ao invés de imagens reais.

**SOLUÇÃO:** Migrado para **Replicate + Stable Diffusion SDXL** que gera imagens reais.

---

## 📋 Passos para Configurar

### 1. Instalar Dependência

Execute no terminal:
```bash
npm install replicate
```

### 2. Obter Token do Replicate

1. Acesse: https://replicate.com/account/api-tokens
2. Faça login ou crie uma conta
3. Crie um novo token de API
4. Copie o token

### 3. Configurar Variável de Ambiente

**No Vercel Dashboard:**
1. Vá em **Settings** → **Environment Variables**
2. Adicione:
   - **Name:** `REPLICATE_API_TOKEN`
   - **Value:** (cole o token que você copiou)
   - **Environments:** Production, Preview, Development (marque todos)

**Ou no arquivo `.env.local` (desenvolvimento local):**
```env
REPLICATE_API_TOKEN=r8_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 🧪 Como Testar

Após configurar o token:

1. **Gere uma estampa** com o prompt: `"bandeira do Brasil"`
2. **Esperado:** Uma imagem PNG real com a bandeira do Brasil
3. **NÃO esperado:** Texto descrevendo a imagem

---

## 📊 Modelo Usado

- **Modelo:** `stability-ai/sdxl` (Stable Diffusion XL)
- **Resolução:** 1024x1024 pixels
- **Qualidade:** Alta qualidade, adequada para impressão
- **Formato:** PNG com suporte a transparência

---

## ⚙️ Configurações do Modelo

O código está configurado com:
- **Guidance Scale:** 7.5 (boa qualidade)
- **Inference Steps:** 40 (detalhamento)
- **Scheduler:** K_EULER (estável e rápido)
- **Negative Prompt:** Remove elementos indesejados (mockups, fotos realistas, etc)

---

## 🔍 Troubleshooting

### Erro: "REPLICATE_API_TOKEN não configurada"
- Verifique se a variável de ambiente está configurada no Vercel
- Reinicie o servidor após adicionar a variável

### Erro: "Biblioteca replicate não disponível"
- Execute: `npm install replicate`
- Verifique se o `package.json` tem a dependência

### Erro: "401 Unauthorized"
- Token inválido ou expirado
- Gere um novo token no Replicate

### Erro: "rate limit"
- Você excedeu o limite de requisições
- Aguarde alguns minutos ou faça upgrade do plano no Replicate

---

## 💰 Custos

O Replicate tem um plano gratuito com créditos limitados:
- **Free Tier:** Créditos limitados por mês
- **Pay-as-you-go:** Paga apenas pelo que usar
- **Preço:** ~$0.003 por imagem (muito barato)

Consulte: https://replicate.com/pricing

---

## ✅ Checklist de Validação

- [x] Código migrado de Gemini para Replicate
- [x] `package.json` atualizado com dependência `replicate`
- [x] Função `generateStamp()` agora gera imagens reais
- [x] Prompt otimizado para Stable Diffusion
- [x] Negative prompt configurado para evitar elementos indesejados
- [ ] Token do Replicate configurado no Vercel
- [ ] Teste realizado: gera imagem real (não texto)

---

## 🚀 Próximos Passos

1. **Configure o token** no Vercel
2. **Teste a geração** de uma estampa
3. **Verifique** se retorna imagem PNG real
4. **Deploy** e teste em produção

---

## 📝 Notas Importantes

- O modelo SDXL gera imagens de **1024x1024px** (adequado para estampas)
- As imagens são convertidas para base64 antes de retornar
- O sistema mantém a mesma interface, então não quebra código existente
- O prompt é otimizado automaticamente para melhor resultado no Stable Diffusion
