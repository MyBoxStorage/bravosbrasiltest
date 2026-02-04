# ✅ CHECKLIST RÁPIDA - CONFIGURAÇÕES MANUAIS

## 🚀 CONFIGURAÇÕES OBRIGATÓRIAS (FAZER AGORA)

### 1. Variáveis de Ambiente no Vercel
**Onde:** Vercel Dashboard → Settings → Environment Variables

```bash
✅ GEMINI_API_KEY              → https://ai.google.dev/
✅ MERCADOPAGO_ACCESS_TOKEN    → https://www.mercadopago.com.br/developers
✅ JWT_SECRET                  → Gerar string aleatória (32+ caracteres)
✅ SITE_URL                    → https://bravos-brasil-r24o.vercel.app
```

### 2. Google Gemini API
- [ ] Criar conta em: https://ai.google.dev/
- [ ] Gerar API Key em: https://makersuite.google.com/app/apikey
- [ ] Adicionar no Vercel como `GEMINI_API_KEY`
- [ ] Ativar faturamento (se necessário)

### 3. Mercado Pago
- [ ] Criar aplicação em: https://www.mercadopago.com.br/developers
- [ ] Copiar Access Token (Production)
- [ ] Adicionar no Vercel como `MERCADOPAGO_ACCESS_TOKEN`
- [ ] Configurar webhook: `https://bravos-brasil-r24o.vercel.app/api/payment/webhook`

### 4. JWT Secret
- [ ] Gerar string aleatória (use: https://randomkeygen.com/)
- [ ] Adicionar no Vercel como `JWT_SECRET`

---

## 🔵 CONFIGURAÇÕES OPCIONAIS (FAZER DEPOIS)

### 5. Google Drive (Upload Automático)
- [ ] Criar projeto no Google Cloud
- [ ] Ativar Google Drive API
- [ ] Criar credenciais OAuth 2.0
- [ ] Obter Refresh Token
- [ ] Adicionar no Vercel:
  - `GOOGLE_DRIVE_CLIENT_ID`
  - `GOOGLE_DRIVE_CLIENT_SECRET`
  - `GOOGLE_DRIVE_REFRESH_TOKEN`

---

## ⚠️ CRÍTICO - ANTES DE PRODUÇÃO

### 6. Banco de Dados Real
**ATENÇÃO:** Sistema atual usa banco em memória (dados são perdidos ao reiniciar)

**OPÇÕES:**
- [ ] **Supabase** (Recomendado): https://supabase.com/
- [ ] **MongoDB Atlas**: https://www.mongodb.com/cloud/atlas
- [ ] **Firebase Firestore**: https://firebase.google.com/
- [ ] **Neon**: https://neon.tech/

**AÇÃO:** Modificar `lib/database.js` para usar banco real

---

## 📋 RESUMO POR PRIORIDADE

### 🔴 URGENTE (Fazer Primeiro)
1. `GEMINI_API_KEY` - Para gerar estampas
2. `MERCADOPAGO_ACCESS_TOKEN` - Para receber pagamentos
3. `JWT_SECRET` - Para autenticação
4. Webhook do Mercado Pago - Para notificações de pagamento

### 🟡 IMPORTANTE (Fazer Antes de Produção)
5. Banco de dados real - Substituir banco em memória
6. `SITE_URL` - Para callbacks e webhooks

### 🟢 OPCIONAL (Pode Fazer Depois)
7. Google Drive - Upload automático de estampas

---

## 📖 DOCUMENTAÇÃO COMPLETA

Para instruções detalhadas, consulte: **`CONFIGURACOES_MANUAIS.md`**

---

## 🆘 AJUDA RÁPIDA

- **Google Gemini:** https://ai.google.dev/docs
- **Mercado Pago:** https://www.mercadopago.com.br/developers/pt/docs
- **Vercel:** https://vercel.com/docs

---

**Última atualização:** 2024
