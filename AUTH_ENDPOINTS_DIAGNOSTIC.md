# 🔍 Diagnóstico: Endpoints de Autenticação (404)

## ✅ Status Atual

### Arquivos Verificados:
- ✅ `/api/auth/register.js` - EXISTE (3065 bytes)
- ✅ `/api/auth/login.js` - EXISTE (2467 bytes)  
- ✅ `/api/auth/me.js` - EXISTE (2006 bytes)
- ✅ `/lib/auth.js` - EXISTE
- ✅ `/lib/database.js` - EXISTE

### Dependências Instaladas:
- ✅ `bcryptjs@2.4.3`
- ✅ `jsonwebtoken@9.0.3`
- ✅ `replicate@0.34.1`

### Estrutura do Vercel:
```json
{
  "builds": [
    {
      "src": "api/**/*.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    }
  ]
}
```

---

## 🔧 Possíveis Causas do 404

### 1. Servidor de Desenvolvimento Não Iniciado
**Solução:**
```bash
npm run dev
```

### 2. Cache do Navegador
**Solução:**
- Limpar cache do navegador
- Testar em aba anônima
- Hard refresh (Ctrl+Shift+R)

### 3. Vercel Não Reconhecendo Arquivos
**Solução:**
- Verificar se `vercel.json` está na raiz
- Verificar se estrutura de diretórios está correta
- Reiniciar servidor de desenvolvimento

### 4. Problema com Imports
**Solução:**
- Verificar se todos os imports estão corretos
- Verificar se `lib/auth.js` e `lib/database.js` existem

---

## 🧪 Teste Local

### Teste 1: Verificar se servidor está rodando
```bash
npm run dev
```

Deve mostrar:
```
> verde-ouro-co@1.0.0 dev
> vercel dev --yes

Vercel CLI 32.x.x
...
Ready! Available at http://localhost:3000
```

### Teste 2: Testar endpoint de registro
No console do navegador (F12):
```javascript
fetch('http://localhost:3000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    nome: 'Teste',
    email: 'teste@test.com',
    senha: '123456'
  })
})
.then(r => r.json())
.then(console.log)
.catch(console.error);
```

**Esperado:**
```json
{
  "success": true,
  "token": "eyJhbGc...",
  "user": { ... }
}
```

**Se retornar 404:**
- Verificar se servidor está rodando
- Verificar console do servidor para erros
- Verificar se arquivo existe em `api/auth/register.js`

---

## 🔍 Logs de Debug Adicionados

Adicionei logs no início de cada handler:
- `🔵 [REGISTER] Endpoint chamado`
- `🔵 [LOGIN] Endpoint chamado`
- `🔵 [ME] Endpoint chamado`

**Se esses logs NÃO aparecerem no console do servidor:**
- O endpoint não está sendo chamado
- Problema de roteamento do Vercel
- Arquivo não está sendo reconhecido

**Se esses logs APARECEREM mas ainda retornar 404:**
- Problema interno no handler
- Erro de import
- Erro de sintaxe

---

## 📋 Checklist de Validação

- [x] Arquivos existem em `/api/auth/`
- [x] Dependências instaladas
- [x] `vercel.json` configurado
- [x] Logs de debug adicionados
- [x] `getUserByEmail` com case-insensitive
- [ ] Servidor de desenvolvimento rodando
- [ ] Teste local funcionando
- [ ] Logs aparecem no console

---

## 🚀 Próximos Passos

1. **Iniciar servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

2. **Testar endpoint no navegador:**
   - Abrir DevTools (F12)
   - Console → Executar teste acima

3. **Verificar logs do servidor:**
   - Procurar por `🔵 [REGISTER]` ou `🔵 [LOGIN]`
   - Se aparecer, endpoint está sendo chamado
   - Se não aparecer, problema de roteamento

4. **Se ainda 404:**
   - Verificar estrutura de diretórios
   - Verificar `vercel.json`
   - Tentar reiniciar servidor

---

## 💡 Solução Alternativa: Verificar URL

O frontend pode estar chamando URL errada. Verificar em `index.html`:

**Correto:**
```javascript
fetch('/api/auth/register', { ... })
```

**Errado:**
```javascript
fetch('api/auth/register', { ... })  // Sem barra inicial
fetch('/api/auth/register/', { ... }) // Com barra final
```
