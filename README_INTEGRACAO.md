# Integração Gerador de Estampas - BRAVOS BRASIL

## Resumo da Implementação

Sistema completo de geração de estampas com IA integrado ao site BRAVOS BRASIL.

## Funcionalidades Implementadas

### ✅ Backend
- Sistema de autenticação (JWT)
- API de geração de estampas (Gemini AI)
- Sistema de tentativas (10 por conta)
- Integração Mercado Pago
- Webhook de pagamento
- Sistema de leads
- Upload para Google Drive (após compra)

### ✅ Frontend
- Gerador de estampas após Hero Section
- Modal de login/cadastro
- Contador de tentativas em tempo real
- Integração com carrinho
- Design consistente com BRAVOS BRASIL
- Suporte a dark mode
- Responsivo mobile

## Estrutura de Arquivos

```
bravos-brasil/
├── api/
│   ├── auth/
│   │   ├── register.js
│   │   ├── login.js
│   │   └── me.js
│   ├── stamps/
│   │   ├── generate.js
│   │   └── remaining.js
│   ├── payment/
│   │   ├── create.js
│   │   └── webhook.js
│   └── leads.js
├── lib/
│   ├── auth.js
│   ├── database.js
│   ├── gemini.js
│   ├── mercadopago.js
│   ├── googledrive.js
│   └── constants.js
├── index.html (modificado)
├── package.json (atualizado)
└── vercel.json (atualizado)
```

## Fluxo de Uso

1. **Usuário acessa o site**
2. **Vê o gerador após Hero Section**
3. **Faz login/cadastro** (se não estiver logado)
4. **Gera estampa** (usa 1 tentativa)
5. **Adiciona ao carrinho** (se gostar)
6. **Finaliza compra** (via Mercado Pago)
7. **Pagamento aprovado** → Webhook libera tentativas (completa até 10)
8. **Estampa enviada para Google Drive** (automaticamente)

## Sistema de Tentativas

- **Inicial:** 10 tentativas por conta
- **Após compra:** Completa até 10 (não adiciona 10, mas completa)
  - Exemplo: Se tem 6 restantes → adiciona 4 → Total = 10
  - Exemplo: Se tem 0 → adiciona 10 → Total = 10

## Próximos Passos

1. Configurar variáveis de ambiente no Vercel (ver ENV_SETUP.md)
2. Testar fluxo completo
3. Substituir banco em memória por banco real (opcional)
4. Configurar Google Drive API (se quiser upload automático)

## Notas Importantes

- O banco de dados atual é em memória (Map) - dados são perdidos ao reiniciar
- Para produção, substitua `lib/database.js` por conexão real
- Todas as API keys devem estar nas variáveis de ambiente do Vercel
- Webhook do Mercado Pago deve apontar para: `https://seu-site.com/api/payment/webhook`
