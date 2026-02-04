# Configuração de Variáveis de Ambiente

Este documento lista todas as variáveis de ambiente necessárias para o funcionamento completo do sistema.

## Variáveis Obrigatórias

### Gemini API
```
GEMINI_API_KEY=sua-chave-api-gemini-aqui
```
- Obtida em: https://ai.google.dev/
- Necessária para gerar estampas com IA

### Mercado Pago
```
MERCADOPAGO_ACCESS_TOKEN=seu-access-token-mercadopago
```
- Obtida em: https://www.mercadopago.com.br/developers
- Necessária para processar pagamentos

### JWT Secret
```
JWT_SECRET=seu-secret-jwt-super-seguro-aqui
```
- Gere uma string aleatória e segura
- Usada para assinar tokens de autenticação

### Google Drive (Opcional - para upload automático)
```
GOOGLE_DRIVE_CLIENT_ID=seu-client-id
GOOGLE_DRIVE_CLIENT_SECRET=seu-client-secret
GOOGLE_DRIVE_REFRESH_TOKEN=seu-refresh-token
```
- Obtidos em: https://console.cloud.google.com/
- Necessários apenas se quiser upload automático para Google Drive

### Site URL (Opcional)
```
SITE_URL=https://bravos-brasil-r24o.vercel.app
```
- URL base do site
- Usada para webhooks e callbacks do Mercado Pago

## Como Configurar no Vercel

1. Acesse seu projeto no Vercel
2. Vá em **Settings** > **Environment Variables**
3. Adicione cada variável acima
4. Faça um novo deploy

## Banco de Dados

Atualmente o sistema usa um banco de dados em memória (Map) para MVP.

**Para produção, recomenda-se:**
- PostgreSQL (via Supabase, Neon, ou próprio)
- MongoDB (via MongoDB Atlas)
- Firebase Firestore

Atualize o arquivo `lib/database.js` para usar o banco de dados escolhido.

## Notas de Segurança

- **NUNCA** commite variáveis de ambiente no Git
- Use sempre variáveis de ambiente do Vercel
- Rotacione secrets regularmente
- Use diferentes credenciais para desenvolvimento e produção
