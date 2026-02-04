# 🚀 Quick Start - Gerador de Estampas BRAVOS BRASIL

## Implementação Completa ✅

Todas as funcionalidades foram implementadas e estão prontas para uso.

---

## ⚡ Início Rápido

### 1. Instalar Dependências
```bash
cd C:\Users\pc\backup-verdeouro\bravos-brasil
npm install
```

### 2. Configurar Variáveis de Ambiente no Vercel

Acesse: Vercel Dashboard > Seu Projeto > Settings > Environment Variables

Adicione:
- `GEMINI_API_KEY` - Sua chave da API Gemini
- `MERCADOPAGO_ACCESS_TOKEN` - Token do Mercado Pago
- `JWT_SECRET` - String aleatória segura (ex: `openssl rand -hex 32`)
- `GOOGLE_DRIVE_CLIENT_ID` (opcional)
- `GOOGLE_DRIVE_CLIENT_SECRET` (opcional)
- `GOOGLE_DRIVE_REFRESH_TOKEN` (opcional)
- `SITE_URL` (opcional) - URL do seu site

### 3. Deploy
```bash
git add .
git commit -m "feat: integração gerador de estampas completa"
git push
```

O Vercel fará o deploy automaticamente.

---

## 📍 Onde Está o Gerador?

O gerador aparece **imediatamente após a seção Hero**, antes da seção de Produtos.

---

## 🔑 Funcionalidades Principais

1. **Login/Cadastro** - Botão no navbar (desktop) ou menu mobile
2. **Gerar Estampa** - Seção após Hero
3. **Ver Tentativas** - Contador visível quando logado
4. **Adicionar ao Carrinho** - Após gerar estampa
5. **Finalizar Compra** - Redireciona para Mercado Pago
6. **Liberação Automática** - Tentativas completadas após pagamento aprovado

---

## 🧪 Testar Localmente

```bash
npm run dev
```

Acesse: http://localhost:3000

---

## 📝 Notas

- Banco de dados atual é em memória (dados perdidos ao reiniciar)
- Para produção, substitua `lib/database.js` por banco real
- Google Drive é opcional (funciona sem ele)

---

## ✅ Tudo Pronto!

A implementação está completa. Configure as variáveis de ambiente e faça o deploy!
