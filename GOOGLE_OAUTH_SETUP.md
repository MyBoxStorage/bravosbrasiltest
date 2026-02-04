# 🔐 Configuração de Autenticação com Google OAuth

## ✅ Implementação Completa

A autenticação com Google OAuth foi implementada com sucesso! Agora os usuários podem fazer login usando sua conta Google.

---

## 📋 Arquivos Criados/Modificados

### Backend:
- ✅ `/api/auth/google.js` - Inicia o fluxo OAuth
- ✅ `/api/auth/google/callback.js` - Processa o callback do Google

### Frontend:
- ✅ Botão "Continuar com Google" adicionado ao modal de login
- ✅ Função `loginWithGoogle()` implementada
- ✅ Processamento automático do callback após autenticação

---

## 🔧 Configuração Necessária

### 1. Criar Projeto no Google Cloud Console

1. Acesse: https://console.cloud.google.com/
2. Crie um novo projeto ou selecione um existente
3. Nome do projeto: `Bravos Brasil` (ou outro nome de sua escolha)

### 2. Habilitar Google+ API

1. No menu lateral, vá em **APIs & Services** → **Library**
2. Procure por "Google+ API" ou "Google Identity Services"
3. Clique em **Enable**

### 3. Criar Credenciais OAuth 2.0

1. Vá em **APIs & Services** → **Credentials**
2. Clique em **+ CREATE CREDENTIALS** → **OAuth client ID**
3. Se solicitado, configure a tela de consentimento:
   - **User Type**: External (para usuários externos)
   - **App name**: Bravos Brasil
   - **User support email**: seu email
   - **Developer contact**: seu email
   - Salve e continue

4. Configure o OAuth client:
   - **Application type**: Web application
   - **Name**: Bravos Brasil Web Client
   - **Authorized JavaScript origins**:
     ```
     http://localhost:3000
     https://seu-dominio.vercel.app
     ```
   - **Authorized redirect URIs**:
     ```
     http://localhost:3000/api/auth/google/callback
     https://seu-dominio.vercel.app/api/auth/google/callback
     ```
   - Clique em **Create**

5. **Copie o Client ID e Client Secret** (você precisará deles!)

---

## 🔑 Variáveis de Ambiente

### Local (.env.local):

```env
# Google OAuth
GOOGLE_CLIENT_ID=seu-client-id-aqui.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=seu-client-secret-aqui
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback

# Site URL (para produção)
SITE_URL=http://localhost:3000

# JWT Secret (já deve existir)
JWT_SECRET=seu-jwt-secret-aqui
```

### Vercel (Dashboard → Settings → Environment Variables):

Adicione as seguintes variáveis:

| Variável | Valor | Ambiente |
|----------|-------|----------|
| `GOOGLE_CLIENT_ID` | `seu-client-id.apps.googleusercontent.com` | Production, Preview, Development |
| `GOOGLE_CLIENT_SECRET` | `seu-client-secret` | Production, Preview, Development |
| `GOOGLE_REDIRECT_URI` | `https://seu-dominio.vercel.app/api/auth/google/callback` | Production, Preview, Development |
| `SITE_URL` | `https://seu-dominio.vercel.app` | Production, Preview, Development |

**⚠️ IMPORTANTE:**
- Use URLs diferentes para desenvolvimento e produção
- O `GOOGLE_REDIRECT_URI` deve corresponder exatamente ao que está configurado no Google Cloud Console
- O `SITE_URL` deve ser a URL base do seu site (sem barra final)

---

## 🧪 Teste Local

1. **Configure as variáveis de ambiente:**
   ```bash
   # Crie/edite .env.local
   GOOGLE_CLIENT_ID=seu-client-id
   GOOGLE_CLIENT_SECRET=seu-client-secret
   GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback
   SITE_URL=http://localhost:3000
   ```

2. **Inicie o servidor:**
   ```bash
   npm run dev
   ```

3. **Teste o fluxo:**
   - Abra http://localhost:3000
   - Clique em "Gerar Estampa" ou qualquer ação que exija login
   - No modal de login, clique em "Continuar com Google"
   - Você será redirecionado para o Google
   - Faça login com sua conta Google
   - Você será redirecionado de volta para o site
   - Deve aparecer: "✅ Login com Google realizado com sucesso!"

---

## 🚀 Deploy no Vercel

1. **Configure as variáveis de ambiente no Vercel:**
   - Vá em **Settings** → **Environment Variables**
   - Adicione todas as variáveis listadas acima
   - Use a URL de produção para `GOOGLE_REDIRECT_URI` e `SITE_URL`

2. **Atualize o Google Cloud Console:**
   - Adicione a URL de produção nas **Authorized redirect URIs**
   - Exemplo: `https://seu-dominio.vercel.app/api/auth/google/callback`

3. **Faça deploy:**
   ```bash
   git add .
   git commit -m "feat: adicionar autenticação com Google OAuth"
   git push origin main
   ```

4. **Teste em produção:**
   - Acesse seu site em produção
   - Teste o login com Google
   - Verifique se funciona corretamente

---

## 🔍 Troubleshooting

### Erro: "redirect_uri_mismatch"
**Causa:** A URL de callback não está configurada corretamente no Google Cloud Console.

**Solução:**
1. Verifique se a URL no Google Cloud Console corresponde exatamente à URL em `GOOGLE_REDIRECT_URI`
2. URLs devem ser idênticas (incluindo http/https, porta, caminho completo)

### Erro: "invalid_client"
**Causa:** Client ID ou Client Secret incorretos.

**Solução:**
1. Verifique se as variáveis de ambiente estão configuradas corretamente
2. Verifique se não há espaços extras ou caracteres especiais
3. Regenerar credenciais no Google Cloud Console se necessário

### Erro: "access_denied"
**Causa:** Usuário cancelou a autenticação ou não deu permissão.

**Solução:**
- Normal, usuário pode tentar novamente
- Verifique se a tela de consentimento está configurada corretamente

### Botão não aparece no modal
**Causa:** JavaScript não carregou ou há erro no console.

**Solução:**
1. Abra o DevTools (F12)
2. Verifique erros no Console
3. Verifique se o botão está no HTML (inspecionar elemento)
4. Recarregue a página

### Redirecionamento não funciona
**Causa:** Problema com a URL de callback ou variáveis de ambiente.

**Solução:**
1. Verifique os logs do servidor (Vercel Functions)
2. Verifique se `GOOGLE_REDIRECT_URI` está correto
3. Verifique se `SITE_URL` está configurado

---

## 📝 Fluxo de Autenticação

1. **Usuário clica em "Continuar com Google"**
   - Frontend redireciona para `/api/auth/google`

2. **Backend inicia OAuth**
   - Gera URL de autorização do Google
   - Redireciona usuário para Google

3. **Usuário autentica no Google**
   - Google mostra tela de consentimento
   - Usuário autoriza acesso

4. **Google redireciona de volta**
   - Google envia código de autorização para `/api/auth/google/callback`

5. **Backend processa callback**
   - Troca código por token de acesso
   - Busca informações do usuário no Google
   - Cria ou atualiza usuário no banco de dados
   - Gera JWT token
   - Redireciona para frontend com token na URL

6. **Frontend processa token**
   - Extrai token da URL
   - Salva no localStorage
   - Autentica usuário
   - Mostra mensagem de sucesso

---

## ✅ Checklist de Validação

- [x] Endpoints criados (`/api/auth/google` e `/api/auth/google/callback`)
- [x] Botão "Continuar com Google" adicionado ao modal
- [x] Função `loginWithGoogle()` implementada
- [x] Processamento de callback implementado
- [ ] Google Cloud Console configurado
- [ ] Credenciais OAuth criadas
- [ ] Variáveis de ambiente configuradas (local)
- [ ] Variáveis de ambiente configuradas (Vercel)
- [ ] Teste local realizado com sucesso
- [ ] Deploy em produção realizado
- [ ] Teste em produção realizado com sucesso

---

## 🎉 Pronto!

A autenticação com Google está implementada e pronta para uso. Basta configurar as credenciais no Google Cloud Console e as variáveis de ambiente!

**Próximos passos:**
1. Configure o Google Cloud Console
2. Adicione as variáveis de ambiente
3. Teste localmente
4. Faça deploy e teste em produção
