# 🔍 Diagnóstico: Login com Google OAuth

## ❌ PROBLEMA IDENTIFICADO

As variáveis de ambiente necessárias para o Google OAuth **NÃO estão configuradas** no `.env.local`.

---

## 📋 O QUE ESTÁ FALTANDO

### Variáveis Obrigatórias:

1. **GOOGLE_CLIENT_ID** - ID do cliente OAuth do Google
2. **GOOGLE_CLIENT_SECRET** - Secret do cliente OAuth do Google  
3. **GOOGLE_REDIRECT_URI** - URL de callback após autenticação
4. **SITE_URL** - URL base do site

---

## 🔧 SOLUÇÃO PASSO A PASSO

### PASSO 1: Criar/Configurar Projeto no Google Cloud Console

1. **Acesse:** https://console.cloud.google.com/
2. **Crie um novo projeto** ou selecione um existente
3. **Nome do projeto:** `Bravos Brasil` (ou outro nome)

### PASSO 2: Habilitar APIs Necessárias

1. Vá em **APIs & Services** → **Library**
2. Procure por **"Google+ API"** ou **"Google Identity Services"**
3. Clique em **Enable**

### PASSO 3: Configurar Tela de Consentimento OAuth

1. Vá em **APIs & Services** → **OAuth consent screen**
2. Selecione **External** (para usuários externos)
3. Preencha:
   - **App name:** Bravos Brasil
   - **User support email:** seu email
   - **Developer contact:** seu email
4. Clique em **Save and Continue**
5. Na tela de **Scopes**, clique em **Save and Continue**
6. Na tela de **Test users**, adicione seu email (opcional para teste)
7. Clique em **Save and Continue**

### PASSO 4: Criar Credenciais OAuth 2.0

1. Vá em **APIs & Services** → **Credentials**
2. Clique em **+ CREATE CREDENTIALS** → **OAuth client ID**
3. Configure:
   - **Application type:** Web application
   - **Name:** Bravos Brasil Web Client
   - **Authorized JavaScript origins:**
     ```
     http://localhost:3000
     ```
   - **Authorized redirect URIs:**
     ```
     http://localhost:3000/api/auth/google/callback
     ```
4. Clique em **Create**
5. **COPIE o Client ID e Client Secret** (você precisará deles!)

### PASSO 5: Adicionar Variáveis no .env.local

Abra o arquivo `.env.local` na raiz do projeto e adicione:

```env
# Google OAuth
GOOGLE_CLIENT_ID=seu-client-id-aqui.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=seu-client-secret-aqui
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback

# Site URL
SITE_URL=http://localhost:3000

# JWT Secret (se ainda não tiver)
JWT_SECRET=sua-chave-secreta-jwt-aqui
```

**⚠️ IMPORTANTE:**
- Substitua `seu-client-id-aqui.apps.googleusercontent.com` pelo Client ID real
- Substitua `seu-client-secret-aqui` pelo Client Secret real
- O `GOOGLE_REDIRECT_URI` deve ser **exatamente** igual ao configurado no Google Cloud Console

### PASSO 6: Reiniciar o Servidor

Após adicionar as variáveis:

1. **Pare o servidor** (Ctrl+C no terminal)
2. **Inicie novamente:**
   ```bash
   npm run dev
   ```

### PASSO 7: Testar

1. Acesse: http://localhost:3000
2. Clique em qualquer ação que exija login
3. No modal de login, clique em **"Continuar com Google"**
4. Você será redirecionado para o Google
5. Faça login com sua conta Google
6. Você será redirecionado de volta para o site
7. Deve aparecer: **"✅ Login com Google realizado com sucesso!"**

---

## 🐛 TROUBLESHOOTING

### Erro: "redirect_uri_mismatch"

**Causa:** A URL de callback no `.env.local` não corresponde à URL configurada no Google Cloud Console.

**Solução:**
1. Verifique se `GOOGLE_REDIRECT_URI` no `.env.local` é exatamente:
   ```
   http://localhost:3000/api/auth/google/callback
   ```
2. Verifique se no Google Cloud Console está configurado:
   ```
   http://localhost:3000/api/auth/google/callback
   ```
3. URLs devem ser **idênticas** (incluindo http/https, porta, caminho completo)

### Erro: "invalid_client"

**Causa:** Client ID ou Client Secret incorretos.

**Solução:**
1. Verifique se copiou o Client ID e Secret corretamente
2. Verifique se não há espaços extras ou caracteres especiais
3. Regenerar credenciais no Google Cloud Console se necessário

### Erro: "access_denied"

**Causa:** Usuário cancelou a autenticação ou não deu permissão.

**Solução:**
- Normal, usuário pode tentar novamente
- Verifique se a tela de consentimento está configurada corretamente

### Variáveis não estão sendo carregadas

**Causa:** O Vercel Dev pode não estar carregando o `.env.local` automaticamente.

**Solução:**
1. Verifique se o arquivo está na **raiz do projeto** (mesmo nível que `package.json`)
2. Verifique se o nome do arquivo é exatamente `.env.local` (com ponto no início)
3. Reinicie o servidor após adicionar/modificar variáveis
4. Verifique se as variáveis estão sendo carregadas:
   ```bash
   node test-google-auth.js
   ```

### Botão "Continuar com Google" não aparece

**Causa:** JavaScript não carregou ou há erro no console.

**Solução:**
1. Abra o DevTools (F12)
2. Verifique erros no Console
3. Verifique se o botão está no HTML (inspecionar elemento)
4. Recarregue a página

---

## ✅ CHECKLIST DE VALIDAÇÃO

Antes de testar, verifique:

- [ ] Projeto criado no Google Cloud Console
- [ ] Google+ API habilitada
- [ ] Tela de consentimento OAuth configurada
- [ ] Credenciais OAuth 2.0 criadas
- [ ] Client ID copiado
- [ ] Client Secret copiado
- [ ] URLs de redirect configuradas no Google Cloud Console
- [ ] `.env.local` criado na raiz do projeto
- [ ] `GOOGLE_CLIENT_ID` adicionado no `.env.local`
- [ ] `GOOGLE_CLIENT_SECRET` adicionado no `.env.local`
- [ ] `GOOGLE_REDIRECT_URI` adicionado no `.env.local`
- [ ] `SITE_URL` adicionado no `.env.local`
- [ ] Servidor reiniciado após adicionar variáveis
- [ ] Teste executado com sucesso

---

## 📝 RESUMO

**O que falta:**
1. ✅ Código implementado (já está feito)
2. ❌ Configurar projeto no Google Cloud Console
3. ❌ Criar credenciais OAuth 2.0
4. ❌ Adicionar variáveis no `.env.local`
5. ❌ Reiniciar servidor

**Próximo passo:** Siga o **PASSO 1** acima e configure o Google Cloud Console!
