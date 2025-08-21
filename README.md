# InvestPro Capital - Versão Corrigida

## 🚀 Sobre o Projeto

Esta é a versão corrigida do InvestPro Capital, uma plataforma de investimentos com sincronização funcional entre cadastros de usuários e painel administrativo.

## ✅ Problemas Corrigidos

### 1. **Sincronização de Dados**
- ✅ Integração com Supabase para banco de dados em tempo real
- ✅ Autenticação unificada entre frontend e backend
- ✅ Sincronização automática entre cadastros e painel admin

### 2. **Arquitetura Melhorada**
- ✅ Backend Flask unificado com frontend React
- ✅ API RESTful com autenticação JWT
- ✅ CORS configurado para comunicação frontend-backend

### 3. **Funcionalidades Implementadas**
- ✅ Sistema de login/registro funcional
- ✅ Dashboard do usuário com dados em tempo real
- ✅ Painel administrativo completo
- ✅ Gerenciamento de lucros para todos os usuários
- ✅ Listagem e edição de usuários cadastrados

## 🛠️ Tecnologias Utilizadas

### Frontend
- React 18 com Vite
- Tailwind CSS para estilização
- Shadcn/ui para componentes
- React Router para navegação
- Lucide React para ícones

### Backend
- Flask (Python)
- Supabase para banco de dados
- JWT para autenticação
- Flask-CORS para comunicação
- Python-dotenv para variáveis de ambiente

## 📦 Estrutura do Projeto

```
investpro-unified/
├── frontend/                 # Aplicação React
│   ├── src/
│   │   ├── components/      # Componentes React
│   │   ├── assets/          # Imagens e recursos
│   │   └── main.jsx         # Ponto de entrada
│   ├── package.json
│   └── vite.config.js
├── src/                     # Backend Flask
│   ├── routes/              # Rotas da API
│   │   ├── auth.py         # Autenticação
│   │   └── user.py         # Gerenciamento de usuários
│   ├── static/             # Frontend buildado
│   └── main.py             # Servidor Flask
├── requirements.txt         # Dependências Python
├── .env.example            # Exemplo de variáveis de ambiente
└── README.md               # Esta documentação
```

## 🔧 Configuração e Instalação

### 1. **Configurar Supabase**

1. Crie uma conta no [Supabase](https://supabase.com)
2. Crie um novo projeto
3. Vá em Settings > API para obter as credenciais
4. Execute o SQL abaixo para criar a tabela de perfis:

```sql
-- Criar tabela de perfis
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE,
  name TEXT,
  email TEXT,
  phone TEXT,
  cpf TEXT,
  balance DECIMAL(10,2) DEFAULT 0.00,
  monthly_profit DECIMAL(5,2) DEFAULT 0.00,
  accumulated_profit DECIMAL(5,2) DEFAULT 0.00,
  is_admin BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Política para permitir que usuários vejam apenas seus próprios dados
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Política para permitir que usuários atualizem apenas seus próprios dados
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Política para permitir inserção de novos perfis
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Função para criar perfil automaticamente após registro
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para executar a função após criação de usuário
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 2. **Configurar Variáveis de Ambiente**

1. Copie o arquivo `.env.example` para `.env`:
```bash
cp .env.example .env
```

2. Edite o arquivo `.env` com suas credenciais do Supabase:
```env
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_KEY=sua-chave-publica-aqui
FLASK_ENV=development
SECRET_KEY=asdf#FGSgvasgf$5$WGT
```

### 3. **Instalar Dependências**

```bash
# Ativar ambiente virtual
source venv/bin/activate

# Instalar dependências Python
pip install -r requirements.txt

# Instalar dependências do frontend
cd frontend
pnpm install
cd ..
```

### 4. **Build e Execução**

```bash
# Fazer build do frontend
cd frontend
pnpm run build
cd ..

# Executar o servidor
python src/main.py
```

O servidor estará disponível em: `http://localhost:5001`

## 👤 Credenciais de Teste

### Administrador
- **Email:** admin@investapp.com
- **Senha:** admin123

## 🎯 Funcionalidades Principais

### Para Usuários
- ✅ Registro de nova conta
- ✅ Login seguro
- ✅ Dashboard personalizado
- ✅ Visualização de saldo e lucros
- ✅ Perfil do usuário

### Para Administradores
- ✅ Painel administrativo completo
- ✅ Visualização de todos os usuários cadastrados
- ✅ Edição de dados dos usuários
- ✅ Atualização de lucros em massa
- ✅ Exclusão de usuários
- ✅ Filtros e busca

## 🔄 Como Funciona a Sincronização

1. **Registro de Usuário:**
   - Usuário preenche formulário no frontend
   - Dados são enviados para API Flask
   - Flask cria usuário no Supabase Auth
   - Perfil é criado automaticamente na tabela `profiles`

2. **Login:**
   - Credenciais são verificadas no Supabase
   - JWT token é gerado pelo Flask
   - Dados do perfil são carregados da tabela `profiles`

3. **Painel Admin:**
   - Admin faz login com credenciais especiais
   - API busca todos os usuários da tabela `profiles`
   - Dados são exibidos em tempo real
   - Alterações são sincronizadas imediatamente

## 🚀 Deploy

### Render.com (Recomendado)

1. Faça push do código para GitHub
2. Conecte o repositório no Render
3. Configure as variáveis de ambiente
4. Deploy automático será feito

### Outras Plataformas

O projeto é compatível com:
- Heroku
- Railway
- DigitalOcean App Platform
- AWS Elastic Beanstalk

## 🔧 Desenvolvimento

### Executar em Modo de Desenvolvimento

```bash
# Terminal 1 - Backend
source venv/bin/activate
python src/main.py

# Terminal 2 - Frontend (opcional, para desenvolvimento)
cd frontend
pnpm run dev
```

### Estrutura da API

```
GET  /api/users          # Listar usuários (admin)
POST /api/users          # Criar usuário (admin)
GET  /api/users/:id      # Buscar usuário
PUT  /api/users/:id      # Atualizar usuário
DELETE /api/users/:id    # Deletar usuário (admin)

POST /api/auth/login     # Login
POST /api/auth/register  # Registro
POST /api/auth/verify    # Verificar token
```

## 📝 Notas Importantes

1. **Segurança:** Todas as rotas da API são protegidas com autenticação JWT
2. **CORS:** Configurado para permitir comunicação frontend-backend
3. **Banco de Dados:** Supabase fornece backup automático e escalabilidade
4. **Responsivo:** Interface funciona em desktop e mobile
5. **Produção:** Remova `debug=True` do Flask para produção

## 🆘 Suporte

Se encontrar problemas:

1. Verifique se as variáveis de ambiente estão corretas
2. Confirme se o Supabase está configurado corretamente
3. Verifique os logs do servidor Flask
4. Teste as rotas da API diretamente

## 📄 Licença

Este projeto é propriedade do cliente e deve ser usado conforme acordado.

---

**Desenvolvido com ❤️ para resolver problemas de sincronização de dados**

