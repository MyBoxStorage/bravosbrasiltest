# 🔒 Fluxo Correto: Upload para Google Drive APENAS Após Pagamento

## ✅ Validação Completa

### **VERIFICAÇÃO 1: Geração de Estampa NÃO faz Upload**

**Arquivo:** `api/stamps/generate.js`

✅ **CONFIRMADO:** A função `generateStamp()` **NÃO** faz upload para Google Drive
- Apenas gera a imagem usando Replicate/Stable Diffusion
- Salva no banco de dados local com status `'gerada'`
- Retorna a imagem em base64 para o frontend
- **Nenhuma chamada para `uploadToGoogleDrive()`**

**Código:**
```javascript
// Gerar estampa
const imageUrl = await generateStamp(finalPrompt, imagePayload);

// Salvar estampa no banco APENAS (status 'gerada')
// NÃO fazer upload para Google Drive aqui
const estampa = createEstampa({
  user_id: userId,
  prompt: finalPrompt,
  imagem_base64: imageUrl,
  status: 'gerada' // Status inicial
});
```

---

### **VERIFICAÇÃO 2: Upload APENAS no Webhook Após Pagamento**

**Arquivo:** `api/payment/webhook.js`

✅ **CONFIRMADO:** Upload para Google Drive acontece **APENAS** quando:
1. `payment.status === 'approved'` (pagamento aprovado)
2. Estampa tem status `'no_carrinho'` (foi adicionada ao carrinho comprado)

**Código:**
```javascript
if (payment.status === 'approved') {
  // ... processar pagamento ...
  
  // Buscar estampas que estavam no carrinho comprado
  const estampasParaProcessar = estampas.filter(e => 
    e.status === 'no_carrinho' // Apenas estampas do carrinho
  );

  // Upload para Google Drive APENAS após pagamento aprovado
  if (estampasParaProcessar.length > 0) {
    estampasParaProcessar.forEach(async (estampa) => {
      const driveUrl = await uploadToGoogleDrive(...);
      updateEstampa(estampa.id, {
        status: 'processada',
        purchase_id: compra.id
      });
    });
  }
}
```

---

## 📋 Fluxo Completo (Correto)

### **1. Geração de Estampa (Preview)**
```
Usuário gera estampa
    ↓
/api/stamps/generate.js
    ↓
generateStamp() → Replicate/Stable Diffusion
    ↓
Salva no banco: status = 'gerada'
    ↓
Retorna base64 para frontend
    ↓
❌ NÃO faz upload para Google Drive
```

### **2. Adicionar ao Carrinho**
```
Usuário clica "Adicionar ao Carrinho"
    ↓
updateEstampa(id, { status: 'no_carrinho' })
    ↓
Estampa fica no carrinho
    ↓
❌ Ainda NÃO faz upload para Google Drive
```

### **3. Finalizar Compra**
```
Usuário finaliza compra
    ↓
/api/payment/create.js
    ↓
Cria preferência Mercado Pago
    ↓
Redireciona para checkout
    ↓
❌ Ainda NÃO faz upload para Google Drive
```

### **4. Pagamento Aprovado (Webhook)**
```
Mercado Pago aprova pagamento
    ↓
/api/payment/webhook.js recebe notificação
    ↓
if (payment.status === 'approved') {
    ↓
Busca estampas com status 'no_carrinho'
    ↓
✅ AGORA SIM: uploadToGoogleDrive()
    ↓
Atualiza estampa: status = 'processada', purchase_id = compra.id
    ↓
✅ Upload concluído - arquivo no Google Drive
}
```

---

## 🔍 Validação de Segurança

### **Checklist de Validação:**

- [x] `api/stamps/generate.js` **NÃO** chama `uploadToGoogleDrive()`
- [x] `lib/gemini.js` **NÃO** chama `uploadToGoogleDrive()`
- [x] Upload acontece **APENAS** em `api/payment/webhook.js`
- [x] Upload acontece **APENAS** quando `payment.status === 'approved'`
- [x] Upload processa **APENAS** estampas com `status === 'no_carrinho'`
- [x] Comentários claros no código explicando o fluxo
- [x] Logs detalhados para debug

---

## 🧪 Teste do Fluxo

### **Teste 1: Geração (NÃO deve fazer upload)**
1. Gerar uma estampa
2. Verificar Google Drive
3. **Esperado:** ❌ Nenhum arquivo novo no Drive

### **Teste 2: Adicionar ao Carrinho (NÃO deve fazer upload)**
1. Adicionar estampa ao carrinho
2. Verificar Google Drive
3. **Esperado:** ❌ Ainda nenhum arquivo novo no Drive

### **Teste 3: Pagamento Aprovado (AGORA deve fazer upload)**
1. Finalizar compra e pagar
2. Aguardar webhook processar
3. Verificar Google Drive
4. **Esperado:** ✅ Arquivo aparece no Drive AGORA

---

## 📝 Comentários no Código

### **api/stamps/generate.js:**
```javascript
// CRITICAL: Salvar estampa no banco APENAS (status 'gerada')
// NÃO fazer upload para Google Drive aqui - isso só acontece após pagamento aprovado
// Upload para Drive acontece em /api/payment/webhook.js quando payment.status === 'approved'
```

### **api/payment/webhook.js:**
```javascript
// CRITICAL: Upload to Google Drive ONLY happens AFTER payment is approved
// During generation (api/stamps/generate.js), stamps are saved with status 'gerada'
// When added to cart, status changes to 'no_carrinho'
// ONLY after payment approval, we upload to Drive and set status to 'processada'
```

---

## ⚠️ Importante

1. **Estampas geradas** ficam apenas no banco de dados local (memória)
2. **Estampas no carrinho** ainda não foram enviadas para Drive
3. **Apenas após pagamento aprovado** o upload acontece
4. **Download** só fica disponível após upload (quando `isPurchased === true`)

---

## 🔧 Troubleshooting

### **Problema: Upload não acontece após pagamento**
- Verificar se webhook está configurado no Mercado Pago
- Verificar logs do webhook: `console.log` deve mostrar "Processando X estampa(s)"
- Verificar se estampas têm `status === 'no_carrinho'`

### **Problema: Upload acontece durante geração**
- ❌ Isso NÃO deveria acontecer
- Verificar se há alguma chamada para `uploadToGoogleDrive()` em `api/stamps/generate.js`
- Deve estar apenas em `api/payment/webhook.js`

---

## ✅ Status Final

**TODAS AS VALIDAÇÕES PASSARAM:**
- ✅ Geração não faz upload
- ✅ Upload apenas após pagamento
- ✅ Comentários claros no código
- ✅ Logs para debug
- ✅ Fluxo seguro e correto
