# 🌐 Servidor Local - Informações de Acesso

## Servidor em Execução

O servidor está rodando localmente. Acesse:

**URL Principal:** http://localhost:3000

---

## ⚠️ Nota Importante sobre API Routes

As rotas da API (`/api/*`) precisam do **Vercel Dev** para funcionar corretamente, pois são Serverless Functions.

### Opção 1: Usar Vercel Dev (Recomendado)

```bash
cd C:\Users\pc\backup-verdeouro\bravos-brasil
npx vercel dev
```

Isso iniciará o servidor com suporte completo às API routes.

**Acesse:** http://localhost:3000

### Opção 2: Servidor HTTP Simples (Apenas Frontend)

Se estiver usando `serve` ou `http-server`, apenas o frontend funcionará. As chamadas de API falharão.

---

## 🔧 Variáveis de Ambiente Locais

Para testar localmente, crie um arquivo `.env.local` na raiz do projeto:

```env
GEMINI_API_KEY=sua-chave-aqui
MERCADOPAGO_ACCESS_TOKEN=seu-token-aqui
JWT_SECRET=sua-chave-secreta-aqui
GOOGLE_DRIVE_CLIENT_ID=opcional
GOOGLE_DRIVE_CLIENT_SECRET=opcional
GOOGLE_DRIVE_REFRESH_TOKEN=opcional
SITE_URL=http://localhost:3000
```

---

## 📝 Comandos Úteis

### Parar o servidor
Pressione `Ctrl+C` no terminal onde o servidor está rodando.

### Reiniciar o servidor
```bash
npm run dev
# ou
npx vercel dev
```

---

## ✅ Funcionalidades Disponíveis Localmente

- ✅ Frontend completo (HTML, CSS, JS)
- ✅ Gerador de estampas (interface)
- ⚠️ API routes (precisam de Vercel Dev ou deploy)
- ⚠️ Autenticação (precisa de backend funcionando)
- ⚠️ Geração de estampas (precisa de GEMINI_API_KEY)

---

## 🚀 Para Testar Tudo

1. Configure variáveis de ambiente no `.env.local`
2. Inicie com `npx vercel dev`
3. Acesse http://localhost:3000
4. Teste o fluxo completo
