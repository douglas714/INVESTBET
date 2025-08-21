# 🚀 INSTRUÇÕES DE DEPLOY - INVESTPRO CAPITAL

## 📋 PRÉ-REQUISITOS

### 1. Configuração do Supabase
- ✅ Projeto criado no Supabase
- ✅ Script SQL executado (`supabase_setup_fixed.sql`)
- ✅ Credenciais anotadas:
  - URL: `https://cvjeoxneffctybjspjcs.supabase.co`
  - ANON KEY: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 2. Dependências
- Python 3.8+
- Node.js 18+
- npm ou yarn

## 🔧 CONFIGURAÇÃO LOCAL

### 1. Clonar e Configurar
```bash
# Clonar repositório
git clone <repository-url>
cd investpro-unified

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas credenciais do Supabase
```

### 2. Backend
```bash
# Instalar dependências
pip install -r requirements.txt

# Executar servidor
python src/main_fixed.py
```

### 3. Frontend
```bash
# Navegar para pasta do frontend
cd frontend

# Instalar dependências
npm install --legacy-peer-deps

# Build para produção
npm run build
```

## 🌐 DEPLOY NO RENDER

### 1. Preparação
- Fazer push do código para GitHub
- Certificar-se que `requirements.txt` está na raiz
- Verificar se `src/main_fixed.py` está configurado

### 2. Configuração no Render
1. Criar novo Web Service
2. Conectar repositório GitHub
3. Configurar:
   - **Build Command:** `pip install -r requirements.txt && cd frontend && npm install --legacy-peer-deps && npm run build`
   - **Start Command:** `python src/main_fixed.py`
   - **Environment:** Python 3

### 3. Variáveis de Ambiente
```env
SUPABASE_URL=https://cvjeoxneffctybjspjcs.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2amVveG5lZmZjdHlianNwamNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyNDk0MTIsImV4cCI6MjA3MDgyNTQxMn0.cIcP88hAcjbs-9Q5NRjuK_aInUeikPjwQl3s3Ukj528
FLASK_ENV=production
SECRET_KEY=asdf#FGSgvasgf$5$WGT
PORT=5001
```

## 🔍 VERIFICAÇÃO PÓS-DEPLOY

### 1. Testes Básicos
- [ ] Aplicação carrega na URL do Render
- [ ] Login admin funciona (admin@investapp.com / admin123)
- [ ] Painel administrativo acessível
- [ ] Lista de usuários carrega

### 2. Testes de Sincronização
- [ ] Criar novo usuário
- [ ] Verificar se aparece no painel admin
- [ ] Editar usuário no painel
- [ ] Verificar sincronização

### 3. Endpoints de Saúde
```bash
# Testar API
curl https://seu-app.onrender.com/api/health

# Testar banco
curl https://seu-app.onrender.com/api/test-db
```

## 🐛 TROUBLESHOOTING

### Problema: Build falha
**Solução:**
```bash
# Limpar cache npm
npm cache clean --force

# Reinstalar dependências
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### Problema: Supabase não conecta
**Verificar:**
1. Variáveis de ambiente corretas
2. URL e chave válidas
3. Projeto Supabase ativo

### Problema: Usuários não aparecem
**Verificar:**
1. Script SQL executado
2. Tabela `profiles` existe
3. Políticas RLS configuradas

## 📁 ESTRUTURA DE ARQUIVOS

```
investpro-unified/
├── src/
│   ├── main_fixed.py          # ✅ Servidor principal
│   ├── routes/
│   │   ├── auth_fixed.py      # ✅ Autenticação
│   │   └── user_fixed.py      # ✅ Usuários
│   └── static/                # ✅ Frontend buildado
├── frontend/
│   ├── src/
│   │   ├── App_fixed.jsx      # ✅ App principal
│   │   └── components/
│   │       ├── AdminPanel_fixed.jsx    # ✅ Painel admin
│   │       └── RegisterPage_fixed.jsx  # ✅ Registro
│   ├── package.json
│   └── vite.config.js
├── .env                       # ✅ Variáveis de ambiente
├── requirements.txt           # ✅ Dependências Python
├── supabase_setup_fixed.sql   # ✅ Script do banco
├── PLAYBOOK_SINCRONIZACAO.md  # ✅ Documentação completa
└── DEPLOY_INSTRUCTIONS_UPDATED.md
```

## 🎯 CREDENCIAIS DE TESTE

### Admin
- **Email:** admin@investapp.com
- **Senha:** admin123

### Usuários de Teste (já cadastrados)
- Ana Costa (ana@email.com)
- Carlos Oliveira (carlos@email.com)
- Maria Santos (maria@email.com)
- João Silva (joao@email.com)

## 📊 MONITORAMENTO

### Logs Importantes
- Conexão com Supabase
- Erros de autenticação
- Operações CRUD
- Falhas de validação

### Métricas de Sucesso
- ✅ Tempo de resposta < 2s
- ✅ 100% sincronização
- ✅ 0% perda de dados
- ✅ Uptime > 99%

---

**🎉 Sistema pronto para produção com sincronização completa!**

*Última atualização: Agosto 2025*

