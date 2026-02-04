# ⚙️ CONFIGURAÇÕES MANUAIS NECESSÁRIAS

Este documento lista **TODAS** as configurações que você precisa fazer manualmente para o sistema funcionar completamente.

---

## 📋 ÍNDICE

1. [Variáveis de Ambiente (Vercel)](#1-variáveis-de-ambiente-vercel)
2. [Google Gemini API](#2-google-gemini-api)
3. [Mercado Pago](#3-mercado-pago)
4. [Google Drive (Opcional)](#4-google-drive-opcional)
5. [JWT Secret](#5-jwt-secret)
6. [Webhook do Mercado Pago](#6-webhook-do-mercado-pago)
7. [Banco de Dados (Produção)](#7-banco-de-dados-produção)

---

## 1. VARIÁVEIS DE AMBIENTE (VERCEL)

### 📍 Onde configurar:
- Vercel Dashboard → Seu Projeto → **Settings** → **Environment Variables**

### ✅ Variáveis Obrigatórias:

```bash
# 1. Google Gemini API
GEMINI_API_KEY=sua-chave-api-gemini-aqui

# 2. Mercado Pago
MERCADOPAGO_ACCESS_TOKEN=seu-access-token-mercadopago

# 3. JWT Secret (gerar uma string aleatória)
JWT_SECRET=seu-secret-jwt-super-seguro-aqui

# 4. URL do Site (opcional, mas recomendado)
SITE_URL=https://bravos-brasil-r24o.vercel.app
```

### 🔵 Variáveis Opcionais (Google Drive):

```bash
# Apenas se quiser upload automático para Google Drive
GOOGLE_DRIVE_CLIENT_ID=seu-client-id
GOOGLE_DRIVE_CLIENT_SECRET=seu-client-secret
GOOGLE_DRIVE_REFRESH_TOKEN=seu-refresh-token
```

### 📝 Instruções:
1. Acesse: https://vercel.com/dashboard
2. Selecione seu projeto **bravos-brasil**
3. Vá em **Settings** → **Environment Variables**
4. Clique em **Add New**
5. Adicione cada variável acima
6. **IMPORTANTE:** Selecione os ambientes (Production, Preview, Development)
7. Faça um novo deploy após adicionar todas

---

## 2. GOOGLE GEMINI API

### 🎯 Objetivo:
Gerar estampas usando Inteligência Artificial

### 📍 Onde obter:
- **URL:** https://ai.google.dev/
- **Console:** https://makersuite.google.com/app/apikey

### 📝 Passo a Passo:

1. **Acesse o Google AI Studio:**
   - Vá em: https://makersuite.google.com/app/apikey
   - Faça login com sua conta Google

2. **Crie uma API Key:**
   - Clique em **"Create API Key"**
   - Selecione ou crie um projeto Google Cloud
   - Copie a chave gerada

3. **Configure no Vercel:**
   - Adicione como: `GEMINI_API_KEY`
   - Valor: Cole a chave copiada

4. **Ative o faturamento (se necessário):**
   - Alguns modelos podem exigir faturamento ativado
   - Acesse: https://console.cloud.google.com/billing

### ⚠️ Importante:
- A API tem limites de uso gratuito
- Monitore o uso em: https://console.cloud.google.com/apis/dashboard
- Modelo usado: `gemini-3-pro-image-preview`

---

## 3. MERCADO PAGO

### 🎯 Objetivo:
Processar pagamentos dos clientes

### 📍 Onde obter:
- **URL:** https://www.mercadopago.com.br/developers
- **Dashboard:** https://www.mercadopago.com.br/developers/panel

### 📝 Passo a Passo:

1. **Acesse o Mercado Pago Developers:**
   - Vá em: https://www.mercadopago.com.br/developers
   - Faça login com sua conta Mercado Pago

2. **Crie uma Aplicação:**
   - Clique em **"Criar aplicação"**
   - Nome: `BRAVOS BRASIL`
   - Descrição: `E-commerce de camisetas personalizadas`
   - Salve

3. **Obtenha o Access Token:**
   - Na página da aplicação, vá em **"Credenciais"**
   - Copie o **"Access Token"** (Production ou Test)
   - ⚠️ Use **Production** para ambiente real

4. **Configure no Vercel:**
   - Adicione como: `MERCADOPAGO_ACCESS_TOKEN`
   - Valor: Cole o Access Token copiado

5. **Configure o Webhook (veja seção 6):**
   - URL do webhook: `https://bravos-brasil-r24o.vercel.app/api/payment/webhook`
   - Configure no painel do Mercado Pago

### ⚠️ Importante:
- Use **Production Token** para receber pagamentos reais
- Use **Test Token** apenas para testes
- Mantenha o token seguro (não compartilhe)

---

## 4. GOOGLE DRIVE (OPCIONAL)

### 🎯 Objetivo:
Upload automático de estampas geradas para Google Drive

### 📍 Onde obter:
- **Console:** https://console.cloud.google.com/
- **API:** Google Drive API

### 📝 Passo a Passo:

1. **Crie um Projeto no Google Cloud:**
   - Acesse: https://console.cloud.google.com/
   - Clique em **"Criar Projeto"**
   - Nome: `BRAVOS BRASIL Drive`

2. **Ative a Google Drive API:**
   - No menu lateral, vá em **"APIs e Serviços"** → **"Biblioteca"**
   - Procure por **"Google Drive API"**
   - Clique em **"Ativar"**

3. **Crie Credenciais OAuth 2.0:**
   - Vá em **"APIs e Serviços"** → **"Credenciais"**
   - Clique em **"Criar Credenciais"** → **"ID do cliente OAuth"**
   - Tipo: **"Aplicativo da Web"**
   - Nome: `BRAVOS BRASIL Drive`
   - **URIs de redirecionamento autorizados:** 
     - Adicione: `http://localhost:3000` (para testes)
     - Adicione: `https://bravos-brasil-r24o.vercel.app` (produção)
   - Clique em **"Criar"**
   - **Copie o Client ID e Client Secret**

4. **Obtenha o Refresh Token:**
   - Use a ferramenta OAuth 2.0 Playground: https://developers.google.com/oauthplayground/
   - Configure:
     - **OAuth flow:** Authorization Code
     - **OAuth endpoints:** Google Drive API v3
     - **Scope:** `https://www.googleapis.com/auth/drive.file`
   - Autorize e obtenha o Refresh Token

5. **Configure no Vercel:**
   - Adicione:
     - `GOOGLE_DRIVE_CLIENT_ID` = Client ID copiado
     - `GOOGLE_DRIVE_CLIENT_SECRET` = Client Secret copiado
     - `GOOGLE_DRIVE_REFRESH_TOKEN` = Refresh Token obtido

### ⚠️ Importante:
- Esta configuração é **OPCIONAL**
- Se não configurar, as estampas não serão enviadas automaticamente para o Drive
- O sistema continuará funcionando normalmente

---

## 5. JWT SECRET

### 🎯 Objetivo:
Assinar tokens de autenticação de forma segura

### 📝 Passo a Passo:

1. **Gere uma string aleatória segura:**
   - Use um gerador online: https://randomkeygen.com/
   - Ou use este comando no terminal:
     ```bash
     node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
     ```
   - Ou gere manualmente: string aleatória de pelo menos 32 caracteres

2. **Configure no Vercel:**
   - Adicione como: `JWT_SECRET`
   - Valor: Cole a string gerada

### ⚠️ Importante:
- **NUNCA** compartilhe este secret
- Use um secret diferente para produção e desenvolvimento
- Mantenha backup seguro deste valor

---

## 6. WEBHOOK DO MERCADO PAGO

### 🎯 Objetivo:
Receber notificações de pagamentos aprovados automaticamente

### 📝 Passo a Passo:

1. **Acesse o Painel do Mercado Pago:**
   - Vá em: https://www.mercadopago.com.br/developers/panel
   - Selecione sua aplicação

2. **Configure o Webhook:**
   - Vá em **"Webhooks"** ou **"Notificações"**
   - URL do webhook: `https://bravos-brasil-r24o.vercel.app/api/payment/webhook`
   - Eventos a receber:
     - ✅ `payment`
     - ✅ `merchant_order`
   - Salve

3. **Teste o Webhook:**
   - Use a ferramenta de teste do Mercado Pago
   - Ou faça um pagamento de teste
   - Verifique os logs no Vercel

### ⚠️ Importante:
- O webhook deve estar acessível publicamente
- Use HTTPS (obrigatório)
- O endpoint já está implementado em: `/api/payment/webhook.js`

---

## 7. BANCO DE DADOS (PRODUÇÃO)

### 🎯 Situação Atual:
- O sistema usa um banco de dados **em memória** (Map) para MVP
- **Dados são perdidos** quando o servidor reinicia
- Funciona para testes, mas **NÃO para produção**

### ⚠️ AÇÃO NECESSÁRIA:

Você **DEVE** migrar para um banco de dados real antes de ir para produção.

### 📋 Opções Recomendadas:

#### **Opção 1: Supabase (PostgreSQL) - RECOMENDADO**
- **URL:** https://supabase.com/
- **Gratuito até:** 500MB de banco
- **Vantagens:** Fácil setup, dashboard visual, API REST automática
- **Arquivo a modificar:** `lib/database.js`

#### **Opção 2: MongoDB Atlas**
- **URL:** https://www.mongodb.com/cloud/atlas
- **Gratuito até:** 512MB de banco
- **Vantagens:** NoSQL, flexível, fácil integração
- **Arquivo a modificar:** `lib/database.js`

#### **Opção 3: Firebase Firestore**
- **URL:** https://firebase.google.com/
- **Gratuito até:** 1GB de armazenamento
- **Vantagens:** Real-time, fácil integração
- **Arquivo a modificar:** `lib/database.js`

#### **Opção 4: Neon (PostgreSQL)**
- **URL:** https://neon.tech/
- **Gratuito até:** 3GB de banco
- **Vantagens:** PostgreSQL serverless, rápido
- **Arquivo a modificar:** `lib/database.js`

### 📝 Passo a Passo (Supabase - Exemplo):

1. **Crie conta no Supabase:**
   - Acesse: https://supabase.com/
   - Crie um novo projeto

2. **Obtenha as credenciais:**
   - Vá em **Settings** → **API**
   - Copie:
     - `URL` (Project URL)
     - `anon key` (anon public key)
     - `service_role key` (service_role secret key)

3. **Crie as tabelas:**
   - Vá em **SQL Editor**
   - Execute os scripts SQL para criar as tabelas:
     - `users`
     - `leads`
     - `estampas`
     - `compras`

4. **Configure no Vercel:**
   - Adicione:
     - `SUPABASE_URL` = Project URL
     - `SUPABASE_ANON_KEY` = anon public key
     - `SUPABASE_SERVICE_KEY` = service_role secret key

5. **Atualize o código:**
   - Modifique `lib/database.js` para usar Supabase
   - Ou crie um novo arquivo `lib/database-supabase.js`

### ⚠️ Importante:
- **NÃO use o banco em memória em produção**
- Faça backup regular dos dados
- Configure índices nas tabelas para performance

---

## ✅ CHECKLIST FINAL

Antes de colocar em produção, verifique:

- [ ] `GEMINI_API_KEY` configurada no Vercel
- [ ] `MERCADOPAGO_ACCESS_TOKEN` configurado (Production Token)
- [ ] `JWT_SECRET` configurado (string aleatória segura)
- [ ] `SITE_URL` configurada (URL do site em produção)
- [ ] Webhook do Mercado Pago configurado
- [ ] Banco de dados real configurado (NÃO use em memória)
- [ ] `GOOGLE_DRIVE_*` configurado (se quiser upload automático)
- [ ] Testes de pagamento realizados
- [ ] Testes de geração de estampas realizados
- [ ] Logs do Vercel verificados (sem erros)

---

## 🆘 SUPORTE

Se tiver dúvidas sobre alguma configuração:

1. **Google Gemini:** https://ai.google.dev/docs
2. **Mercado Pago:** https://www.mercadopago.com.br/developers/pt/docs
3. **Google Drive API:** https://developers.google.com/drive/api
4. **Vercel:** https://vercel.com/docs

---

## 📝 NOTAS FINAIS

- Todas as variáveis de ambiente devem ser configuradas no **Vercel**
- Use **Production** tokens para ambiente real
- Use **Test** tokens apenas para desenvolvimento
- Mantenha todas as credenciais **seguras** e **privadas**
- **NUNCA** commite variáveis de ambiente no Git
- Faça backup das configurações importantes

---

**Última atualização:** 2024
**Versão do sistema:** 1.0.0
