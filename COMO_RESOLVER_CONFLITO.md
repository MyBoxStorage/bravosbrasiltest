# 🔧 Como Resolver o Conflito do .env.local

## 📋 Situação

Você tem um conflito de merge no arquivo `.env.local` com duas versões:
- **Esquerda (Current)**: Apenas 3 linhas com `VERCEL_OIDC_TOKEN`
- **Direita (Incoming)**: Versão completa com todas as variáveis

## ✅ Solução: Aceitar a Versão Completa (Direita)

### Passo a Passo no Cursor:

1. **No editor de conflito, você verá:**
   ```
   <<<<<<< .env.local (Current)
   # Created by Vercel CLI
   VERCEL_OIDC_TOKEN="..."
   =======
   # Versão completa com todas as variáveis
   ...
   >>>>>>> .env.local (Incoming)
   ```

2. **Para aceitar a versão completa:**
   - **Opção A**: Clique no botão **"Accept Incoming"** ou **"Accept Right"**
   - **Opção B**: Delete manualmente as linhas da versão esquerda (Current) e os marcadores de conflito
   - **Opção C**: Use o comando do Cursor: `Ctrl+Shift+P` → "Accept Incoming Change"

3. **O que manter:**
   - ✅ Toda a versão direita (Incoming) - versão completa
   - ❌ Deletar: Linhas `<<<<<<<`, `=======`, `>>>>>>>` e a versão esquerda (3 linhas)

4. **Resultado final:**
   O arquivo deve ter todas as variáveis da versão completa, incluindo:
   - `REPLICATE_API_TOKEN`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `GOOGLE_REDIRECT_URI`
   - `SITE_URL`
   - `GOOGLE_DRIVE_*` (opcionais)
   - `VERCEL_OIDC_TOKEN`

## 🎯 Após Resolver

1. **Salve o arquivo** (Ctrl+S)
2. **Verifique se não há mais marcadores de conflito**
3. **Reinicie o servidor:**
   ```bash
   npm run dev
   ```

## ⚠️ Importante

- A versão esquerda (3 linhas) **NÃO é necessária**
- O `VERCEL_OIDC_TOKEN` já está incluído na versão completa
- Mantenha apenas a versão completa (direita)
