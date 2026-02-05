// Teste direto de geração de estampa - simulando navegador
const http = require('http');

console.log('🧪 TESTE DIRETO: Geração de Estampa\n');
console.log('═══════════════════════════════════════════');
console.log('Prompt: "Uma foto de Jesus com fundo verde e amarelo escrito em cima "Deus, Pátria" e em baixo "Família"');
console.log('═══════════════════════════════════════════\n');

// Simular requisição do frontend para gerar estampa
// O frontend faz preview sem login primeiro
const prompt = 'Uma foto de Jesus com fundo verde e amarelo escrito em cima "Deus, Pátria" e em baixo "Família"';

console.log('📝 PASSO 1: Verificando se o servidor está rodando...\n');

// Primeiro, verificar se o servidor está rodando
const checkServer = http.get('http://localhost:3000', (res) => {
  console.log(`✅ Servidor respondendo (Status: ${res.statusCode})\n`);
  
  console.log('📝 PASSO 2: Tentando gerar estampa via API (sem autenticação - preview mode)...\n');
  console.log('⚠️  Nota: O sistema permite 1 preview sem login por dispositivo\n');
  
  // Tentar gerar estampa diretamente (mesmo sem auth, para ver o erro)
  const generateData = JSON.stringify({
    prompt: prompt
  });

  const generateOptions = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/stamps/generate',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(generateData),
      'User-Agent': 'Test-Script/1.0'
    }
  };

  const generateReq = http.request(generateOptions, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      console.log(`📊 Status Code: ${res.statusCode}`);
      console.log(`📋 Headers:`, JSON.stringify(res.headers, null, 2));
      
      if (res.statusCode === 401) {
        console.log('\n✅ Comportamento esperado: Requer autenticação');
        console.log('📝 Agora vamos criar um usuário e fazer login...\n');
        createUserAndGenerate();
      } else if (res.statusCode === 404) {
        console.log('\n❌ ERRO: Endpoint não encontrado (404)');
        console.log('🔍 Isso indica que o Vercel Dev não está reconhecendo as rotas da API');
        console.log('\n📋 Response:', data);
        console.log('\n💡 SOLUÇÃO: Teste diretamente no navegador em http://localhost:3000');
        process.exit(1);
      } else if (res.statusCode === 200 || res.statusCode === 201) {
        try {
          const response = JSON.parse(data);
          console.log('\n✅ SUCESSO! Estampa gerada!\n');
          console.log('📋 Resposta completa:');
          console.log(JSON.stringify(response, null, 2));
          
          if (response.estampa?.imageUrl || response.imageUrl) {
            const imageUrl = response.estampa?.imageUrl || response.imageUrl;
            console.log('\n🖼️  Imagem gerada!');
            console.log('   URL:', imageUrl.substring(0, 200) + '...');
            console.log('\n✅ TESTE CONCLUÍDO COM SUCESSO!');
          }
        } catch (e) {
          console.log('\n⚠️  Resposta não é JSON:');
          console.log(data.substring(0, 500));
        }
        process.exit(0);
      } else {
        console.log('\n⚠️  Status inesperado');
        console.log('📋 Response:', data);
        process.exit(1);
      }
    });
  });

  generateReq.on('error', (error) => {
    console.error('❌ Erro na requisição:', error.message);
    console.log('\n💡 Certifique-se de que o servidor está rodando em http://localhost:3000');
    process.exit(1);
  });

  generateReq.write(generateData);
  generateReq.end();
});

checkServer.on('error', (error) => {
  console.error('❌ Servidor não está respondendo:', error.message);
  console.log('\n💡 Inicie o servidor com: npm run dev');
  process.exit(1);
});

function createUserAndGenerate() {
  console.log('📝 Criando usuário de teste...\n');
  
  const registerData = JSON.stringify({
    nome: 'Teste Usuario',
    email: `teste${Date.now()}@teste.com`, // Email único
    senha: 'senha123',
    telefone: '11999999999'
  });

  const registerOptions = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth/register',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(registerData)
    }
  };

  const registerReq = http.request(registerOptions, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      if (res.statusCode === 201 || res.statusCode === 200) {
        try {
          const response = JSON.parse(data);
          const token = response.token || response.data?.token;
          if (token) {
            console.log('✅ Usuário criado e autenticado');
            console.log('🔑 Token recebido\n');
            generateWithAuth(token);
          } else {
            console.log('⚠️  Token não recebido, tentando login...\n');
            // Extrair email do response ou usar o que foi enviado
            const email = JSON.parse(registerData).email;
            loginAndGenerate(email);
          }
        } catch (e) {
          console.log('⚠️  Resposta não é JSON, tentando login...\n');
          const email = JSON.parse(registerData).email;
          loginAndGenerate(email);
        }
      } else if (res.statusCode === 409) {
        console.log('⚠️  Usuário já existe, tentando login...\n');
        const email = JSON.parse(registerData).email;
        loginAndGenerate(email);
      } else if (res.statusCode === 404) {
        console.log('❌ ERRO: Endpoint /api/auth/register não encontrado (404)');
        console.log('🔍 O Vercel Dev não está reconhecendo as rotas da API');
        console.log('\n📋 Response:', data);
        process.exit(1);
      } else {
        console.log('❌ Erro ao criar usuário:', res.statusCode);
        console.log('📋 Response:', data);
        process.exit(1);
      }
    });
  });

  registerReq.on('error', (error) => {
    console.error('❌ Erro na requisição:', error.message);
    process.exit(1);
  });

  registerReq.write(registerData);
  registerReq.end();
}

function loginAndGenerate(email) {
  const loginData = JSON.stringify({
    email: email,
    senha: 'senha123'
  });

  const loginOptions = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(loginData)
    }
  };

  const loginReq = http.request(loginOptions, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      if (res.statusCode === 200) {
        try {
          const response = JSON.parse(data);
          const token = response.token || response.data?.token;
          if (token) {
            console.log('✅ Login realizado');
            console.log('🔑 Token recebido\n');
            generateWithAuth(token);
          } else {
            console.log('❌ Token não recebido no login');
            console.log('📋 Response:', data);
            process.exit(1);
          }
        } catch (e) {
          console.log('❌ Erro ao processar resposta de login');
          console.log('📋 Response:', data);
          process.exit(1);
        }
      } else if (res.statusCode === 404) {
        console.log('❌ ERRO: Endpoint /api/auth/login não encontrado (404)');
        console.log('🔍 O Vercel Dev não está reconhecendo as rotas da API');
        process.exit(1);
      } else {
        console.log('❌ Erro no login:', res.statusCode);
        console.log('📋 Response:', data);
        process.exit(1);
      }
    });
  });

  loginReq.on('error', (error) => {
    console.error('❌ Erro na requisição:', error.message);
    process.exit(1);
  });

  loginReq.write(loginData);
  loginReq.end();
}

function generateWithAuth(token) {
  console.log('🎨 Gerando estampa com autenticação...\n');
  console.log(`📝 Prompt: "${prompt}"\n`);

  const generateData = JSON.stringify({
    prompt: prompt
  });

  const generateOptions = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/stamps/generate',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Content-Length': Buffer.byteLength(generateData)
    }
  };

  const generateReq = http.request(generateOptions, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      console.log(`📊 Status Code: ${res.statusCode}`);
      
      if (res.statusCode === 200 || res.statusCode === 201) {
        try {
          const response = JSON.parse(data);
          console.log('\n✅ SUCESSO! Estampa gerada!\n');
          console.log('📋 Detalhes:');
          console.log('   - ID:', response.estampa?.id || response.id || 'N/A');
          console.log('   - Prompt usado:', response.prompt || response.estampa?.prompt || 'N/A');
          console.log('   - Tentativas restantes:', response.tentativas_restantes || response.estampa?.tentativas_restantes || 'N/A');
          
          if (response.estampa?.imageUrl || response.imageUrl) {
            const imageUrl = response.estampa?.imageUrl || response.imageUrl;
            console.log('   - Imagem gerada: ✅');
            console.log('   - URL:', imageUrl.substring(0, 150) + '...');
            console.log('\n✅ TESTE CONCLUÍDO COM SUCESSO!');
            console.log('🖼️  A estampa foi gerada com sucesso via Replicate FLUX-2-PRO');
          } else {
            console.log('   - Imagem: ❌ Não encontrada na resposta');
            console.log('\n⚠️  BUG IDENTIFICADO: Imagem não retornada na resposta');
            console.log('📋 Resposta completa:', JSON.stringify(response, null, 2));
          }
        } catch (e) {
          console.log('❌ Erro ao processar resposta JSON');
          console.log('📋 Response (primeiros 500 chars):', data.substring(0, 500));
          console.log('\n⚠️  BUG IDENTIFICADO: Resposta não é JSON válido');
        }
      } else {
        console.log('\n❌ ERRO ao gerar estampa!');
        console.log('Status:', res.statusCode);
        
        try {
          const errorResponse = JSON.parse(data);
          console.log('\n📋 Detalhes do erro:');
          console.log('   - Erro:', errorResponse.error || 'Desconhecido');
          console.log('   - Mensagem:', errorResponse.message || 'N/A');
          console.log('\n⚠️  BUG IDENTIFICADO:', errorResponse.error || 'Erro desconhecido');
        } catch (e) {
          console.log('📋 Response:', data);
        }
      }
      
      console.log('\n═══════════════════════════════════════════\n');
      process.exit(0);
    });
  });

  generateReq.on('error', (error) => {
    console.error('❌ Erro na requisição:', error.message);
    process.exit(1);
  });

  generateReq.write(generateData);
  generateReq.end();
}
