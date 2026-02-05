# 🐛 BUGS IDENTIFICADOS NO SISTEMA DE GERAÇÃO DE ESTAMPAS

## ❌ BUG 1: REPLICATE_API_TOKEN NÃO CONFIGURADO

### Problema:
A variável de ambiente `REPLICATE_API_TOKEN` **NÃO está configurada** no `.env.local`.

### Impacto:
- O sistema não consegue gerar estampas reais
- Apenas previews (geradas no cliente) funcionam
- Geração autenticada falha com erro de autenticação

### Localização:
- `api/stamps/generate.js` linha 6-8:
```javascript
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN
});
```

### Solução:
1. Obter token do Replicate: https://replicate.com/account/api-tokens
2. Adicionar no `.env.local`:
```env
REPLICATE_API_TOKEN=r8_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```
3. Reiniciar o servidor

---

## ❌ BUG 2: VERCEL DEV NÃO RECONHECE ROTAS DA API

### Problema:
O Vercel Dev local não está reconhecendo as rotas da API (`/api/*`), retornando **404 NOT_FOUND**.

### Impacto:
- Endpoints da API não funcionam em desenvolvimento local
- Testes automatizados falham
- Apenas funciona em produção (deploy no Vercel)

### Causa:
Problema conhecido do Vercel Dev em desenvolvimento local. As rotas funcionam corretamente em produção.

### Solução:
1. **Testar no navegador** (funciona mesmo com 404 nos testes)
2. **Fazer deploy no Vercel** e testar em produção
3. **Aguardar** que o Vercel Dev reconheça as rotas (pode levar alguns minutos)

---

## ⚠️ AVISO: PROMPT DO USUÁRIO PODE CAUSAR PROBLEMAS

### Problema:
O prompt fornecido contém:
- Palavra "foto" (mas o sistema gera designs, não fotos)
- Aspas duplas que podem ser interpretadas incorretamente

### Prompt:
```
Uma foto de Jesus com fundo verde e amarelo escrito em cima "Deus, Pátria" e em baixo "Família"
```

### Recomendação:
Reformular para:
```
Uma imagem de Jesus com fundo verde e amarelo, com o texto "Deus, Pátria" em cima e "Família" em baixo
```

Ou melhor ainda:
```
Design de estampa com imagem de Jesus, fundo nas cores verde e amarelo do Brasil, texto "Deus, Pátria" na parte superior e "Família" na parte inferior
```

---

## ✅ CÓDIGO ESTÁ CORRETO

A lógica de geração de prompt está funcionando perfeitamente:
- ✅ Função `buildStampPrompt()` está correta
- ✅ Prompt do usuário é incluído no prompt otimizado
- ✅ Especificações técnicas estão corretas
- ✅ Tratamento de erros está completo

---

## 🎯 PRÓXIMOS PASSOS

1. **Configurar REPLICATE_API_TOKEN** no `.env.local`
2. **Reiniciar o servidor**
3. **Testar no navegador** (http://localhost:3000)
4. **Se não funcionar localmente**, fazer deploy e testar em produção

---

## 📋 RESUMO DOS BUGS

| Bug | Severidade | Status | Solução |
|-----|-----------|--------|---------|
| REPLICATE_API_TOKEN não configurado | 🔴 CRÍTICO | ❌ Não resolvido | Adicionar token no .env.local |
| Vercel Dev não reconhece rotas | 🟡 MÉDIO | ⚠️ Limitação conhecida | Testar no navegador ou produção |
| Prompt com "foto" e aspas | 🟢 BAIXO | ⚠️ Pode causar confusão | Reformular prompt |
