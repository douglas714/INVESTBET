# 🚀 Instruções de Deploy - InvestPro Capital

## 📋 Pré-requisitos

- Conta no [Supabase](https://supabase.com) (gratuita)
- Conta no [Render](https://render.com) ou similar (gratuita)
- Git instalado localmente

## 🗄️ Passo 1: Configurar Banco de Dados (Supabase)

### 1.1 Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Clique em "Start your project"
3. Faça login ou crie uma conta
4. Clique em "New Project"
5. Escolha uma organização
6. Preencha:
   - **Name:** investpro-capital
   - **Database Password:** (anote esta senha)
   - **Region:** South America (São Paulo) - para melhor latência
7. Clique em "Create new project"
8. Aguarde a criação (2-3 minutos)

### 1.2 Configurar Banco de Dados

1. No painel do Supabase, vá em **SQL Editor**
2. Clique em "New query"
3. Copie todo o conteúdo do arquivo `supabase_setup.sql`
4. Cole no editor e clique em "Run"
5. Verifique se todas as operações foram executadas com sucesso

### 1.3 Obter Credenciais

1. Vá em **Settings** > **API**
2. Anote os seguintes valores:
   - **Project URL** (ex: https://abc123.supabase.co)
   - **anon public** key (chave longa que começa com "eyJ...")

## 🌐 Passo 2: Deploy da Aplicação (Render)

### 2.1 Preparar Código

1. Faça upload do projeto para GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - InvestPro Capital"
   git branch -M main
   git remote add origin https://github.com/SEU_USUARIO/investpro-capital.git
   git push -u origin main
   ```

### 2.2 Configurar Render

1. Acesse [render.com](https://render.com)
2. Faça login ou crie uma conta
3. Clique em "New +" > "Web Service"
4. Conecte seu repositório GitHub
5. Selecione o repositório do projeto
6. Configure:
   - **Name:** investpro-capital
   - **Environment:** Python 3
   - **Build Command:** 
     ```bash
     pip install -r requirements.txt && cd frontend && npm install && npm run build && cd ..
     ```
   - **Start Command:** 
     ```bash
     python src/main.py
     ```

### 2.3 Configurar Variáveis de Ambiente

No Render, vá em **Environment** e adicione:

```
SUPABASE_URL=https://SEU_PROJETO.supabase.co
SUPABASE_KEY=SUA_CHAVE_PUBLICA_AQUI
FLASK_ENV=production
SECRET_KEY=asdf#FGSgvasgf$5$WGT
```

**⚠️ IMPORTANTE:** Substitua pelos valores reais do seu Supabase!

### 2.4 Fazer Deploy

1. Clique em "Create Web Service"
2. Aguarde o build e deploy (5-10 minutos)
3. Sua aplicação estará disponível em: `https://investpro-capital.onrender.com`

## ✅ Passo 3: Testar a Aplicação

### 3.1 Teste Básico

1. Acesse a URL da aplicação
2. Verifique se a página de login carrega
3. Teste o login de admin:
   - **Email:** admin@investapp.com
   - **Senha:** admin123

### 3.2 Teste de Registro

1. Clique em "Criar conta"
2. Preencha um formulário de teste
3. Verifique se o usuário foi criado
4. Faça login como admin
5. Vá no painel administrativo
6. Verifique se o usuário aparece na lista

## 🔧 Passo 4: Configurações Adicionais

### 4.1 Domínio Personalizado (Opcional)

No Render:
1. Vá em **Settings** > **Custom Domains**
2. Adicione seu domínio
3. Configure DNS conforme instruções

### 4.2 SSL/HTTPS

- O Render fornece SSL automático
- Não é necessária configuração adicional

### 4.3 Backup do Banco

O Supabase faz backup automático, mas você pode:
1. Ir em **Settings** > **Database**
2. Fazer backup manual se necessário

## 🚨 Solução de Problemas

### Erro: "Supabase não conectado"

1. Verifique as variáveis de ambiente no Render
2. Confirme se a URL e chave estão corretas
3. Teste a conexão no SQL Editor do Supabase

### Erro: "Build failed"

1. Verifique se o `requirements.txt` está correto
2. Confirme se o Node.js está disponível no build
3. Veja os logs detalhados no Render

### Erro: "Usuários não aparecem"

1. Verifique se o script SQL foi executado
2. Confirme se a tabela `profiles` existe
3. Teste criar usuário diretamente no Supabase

### Erro: "Login não funciona"

1. Verifique se o Supabase Auth está habilitado
2. Confirme as políticas RLS
3. Teste as credenciais de admin

## 📞 Suporte

Se encontrar problemas:

1. **Logs do Render:** Vá em **Logs** para ver erros detalhados
2. **Supabase Logs:** Vá em **Logs** > **API** para ver requisições
3. **Browser Console:** Abra F12 para ver erros do frontend

## 🎯 Próximos Passos

Após o deploy bem-sucedido:

1. **Configurar usuário admin real** (trocar senha padrão)
2. **Personalizar layout** se necessário
3. **Configurar backup regular** dos dados
4. **Monitorar performance** da aplicação
5. **Configurar domínio personalizado**

## 📋 Checklist de Deploy

- [ ] Projeto criado no Supabase
- [ ] Script SQL executado com sucesso
- [ ] Credenciais anotadas (URL e Key)
- [ ] Código enviado para GitHub
- [ ] Web Service criado no Render
- [ ] Variáveis de ambiente configuradas
- [ ] Build executado com sucesso
- [ ] Aplicação acessível via URL
- [ ] Login de admin funcionando
- [ ] Registro de usuário funcionando
- [ ] Painel admin mostrando usuários
- [ ] Sincronização funcionando

---

**🎉 Parabéns! Sua aplicação está no ar com sincronização funcional!**

