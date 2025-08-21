-- =====================================================
<<<<<<< HEAD
-- SCRIPT DE CONFIGURAÇÃO DO SUPABASE
-- InvestPro Capital - Versão Corrigida
-- =====================================================

-- 1. Criar tabela de perfis dos usuários
CREATE TABLE profiles (
=======
-- SCRIPT DE CONFIGURAÇÃO DO SUPABASE - VERSÃO CORRIGIDA
-- InvestPro Capital - Problemas de Sincronização Resolvidos
-- =====================================================

-- 1. Criar tabela de perfis dos usuários
CREATE TABLE IF NOT EXISTS profiles (
>>>>>>> 68048ee0f45367395ea451b64aeb27cb26493f1f
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

-- 2. Habilitar Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

<<<<<<< HEAD
-- 3. Políticas de segurança
=======
-- 3. Remover políticas existentes (se houver)
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can delete profiles" ON profiles;

-- 4. Políticas de segurança corrigidas
>>>>>>> 68048ee0f45367395ea451b64aeb27cb26493f1f

-- Política para permitir que usuários vejam apenas seus próprios dados
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Política para permitir que usuários atualizem apenas seus próprios dados
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Política para permitir inserção de novos perfis
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

<<<<<<< HEAD
-- Política para administradores (opcional - para acesso total via dashboard)
-- Descomente as linhas abaixo se quiser que admins tenham acesso total via RLS
=======
-- Política para administradores - acesso total via RLS
>>>>>>> 68048ee0f45367395ea451b64aeb27cb26493f1f
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Admins can update all profiles" ON profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Admins can delete profiles" ON profiles
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

<<<<<<< HEAD
-- 4. Função para criar perfil automaticamente após registro
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, username)
=======
-- 5. Função para criar perfil automaticamente após registro
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, username, phone, cpf)
>>>>>>> 68048ee0f45367395ea451b64aeb27cb26493f1f
  VALUES (
    NEW.id, 
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
<<<<<<< HEAD
    COALESCE(NEW.raw_user_meta_data->>'username', NEW.email)
=======
    COALESCE(NEW.raw_user_meta_data->>'username', NEW.email),
    NEW.raw_user_meta_data->>'phone', -- Adicionar phone
    NEW.raw_user_meta_data->>'cpf'    -- Adicionar cpf
>>>>>>> 68048ee0f45367395ea451b64aeb27cb26493f1f
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

<<<<<<< HEAD
-- 5. Trigger para executar a função após criação de usuário
=======
-- 6. Trigger para executar a função após criação de usuário
>>>>>>> 68048ee0f45367395ea451b64aeb27cb26493f1f
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

<<<<<<< HEAD
-- 6. Função para atualizar timestamp de updated_at
=======
-- 7. Função para atualizar timestamp de updated_at
>>>>>>> 68048ee0f45367395ea451b64aeb27cb26493f1f
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

<<<<<<< HEAD
-- 7. Trigger para atualizar updated_at automaticamente
=======
-- 8. Trigger para atualizar updated_at automaticamente
DROP TRIGGER IF EXISTS handle_profiles_updated_at ON profiles;
>>>>>>> 68048ee0f45367395ea451b64aeb27cb26493f1f
CREATE TRIGGER handle_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

<<<<<<< HEAD
-- 8. Inserir usuário administrador padrão (opcional)
-- Descomente e ajuste conforme necessário
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role
) VALUES (
  gen_random_uuid(),
  'admin@investapp.com',
  crypt('admin123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"name": "Administrador", "username": "admin"}',
  false,
  'authenticated'
);

-- 9. Índices para melhor performance
=======
-- 9. Criar usuário administrador padrão
-- Primeiro, verificar se já existe
DO $$
DECLARE
    admin_user_id UUID;
BEGIN
    -- Verificar se o usuário admin já existe
    SELECT id INTO admin_user_id FROM auth.users WHERE email = 'admin@investapp.com';
    
    IF admin_user_id IS NULL THEN
        -- Criar usuário admin se não existir
        INSERT INTO auth.users (
            id,
            instance_id,
            email,
            encrypted_password,
            email_confirmed_at,
            created_at,
            updated_at,
            raw_app_meta_data,
            raw_user_meta_data,
            is_super_admin,
            role,
            aud,
            confirmation_token,
            email_confirmed_at
        ) VALUES (
            gen_random_uuid(),
            '00000000-0000-0000-0000-000000000000',
            'admin@investapp.com',
            crypt('admin123', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW(),
            '{"provider": "email", "providers": ["email"]}',
            '{"name": "Administrador", "username": "admin"}',
            false,
            'authenticated',
            'authenticated',
            '',
            NOW()
        ) RETURNING id INTO admin_user_id;
        
        -- Criar perfil do admin
        INSERT INTO public.profiles (
            id,
            username,
            name,
            email,
            balance,
            monthly_profit,
            accumulated_profit,
            is_admin,
            status
        ) VALUES (
            admin_user_id,
            'admin',
            'Administrador',
            'admin@investapp.com',
            50000.00,
            5.2,
            15.8,
            true,
            'active'
        );
        
        RAISE NOTICE 'Usuário administrador criado com sucesso!';
    ELSE
        -- Atualizar perfil do admin se já existir
        UPDATE public.profiles SET
            is_admin = true,
            name = 'Administrador',
            username = 'admin',
            balance = 50000.00,
            monthly_profit = 5.2,
            accumulated_profit = 15.8,
            status = 'active'
        WHERE id = admin_user_id;
        
        RAISE NOTICE 'Perfil do administrador atualizado!';
    END IF;
END $$;

-- 10. Índices para melhor performance
>>>>>>> 68048ee0f45367395ea451b64aeb27cb26493f1f
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_status ON profiles(status);
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON profiles(is_admin);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON profiles(created_at);

<<<<<<< HEAD
-- 10. Comentários nas colunas para documentação
=======
-- 11. Comentários nas colunas para documentação
>>>>>>> 68048ee0f45367395ea451b64aeb27cb26493f1f
COMMENT ON TABLE profiles IS 'Perfis dos usuários da plataforma InvestPro Capital';
COMMENT ON COLUMN profiles.id IS 'ID do usuário (referência para auth.users)';
COMMENT ON COLUMN profiles.username IS 'Nome de usuário único';
COMMENT ON COLUMN profiles.name IS 'Nome completo do usuário';
COMMENT ON COLUMN profiles.email IS 'Email do usuário';
COMMENT ON COLUMN profiles.phone IS 'Telefone do usuário';
COMMENT ON COLUMN profiles.cpf IS 'CPF do usuário';
COMMENT ON COLUMN profiles.balance IS 'Saldo disponível para investimento';
COMMENT ON COLUMN profiles.monthly_profit IS 'Percentual de lucro mensal';
COMMENT ON COLUMN profiles.accumulated_profit IS 'Percentual de lucro acumulado';
COMMENT ON COLUMN profiles.is_admin IS 'Indica se o usuário é administrador';
COMMENT ON COLUMN profiles.status IS 'Status do usuário (active, inactive, etc.)';
COMMENT ON COLUMN profiles.created_at IS 'Data de criação do perfil';
COMMENT ON COLUMN profiles.updated_at IS 'Data da última atualização';

<<<<<<< HEAD
=======
-- 12. Habilitar realtime para sincronização automática
ALTER PUBLICATION supabase_realtime ADD TABLE profiles;

>>>>>>> 68048ee0f45367395ea451b64aeb27cb26493f1f
-- =====================================================
-- INSTRUÇÕES DE USO:
-- 
-- 1. Copie e cole este script no SQL Editor do Supabase
-- 2. Execute o script completo
-- 3. Verifique se todas as tabelas e funções foram criadas
-- 4. Configure as variáveis de ambiente no seu projeto
-- 5. Teste o registro de um novo usuário
-- 
<<<<<<< HEAD
-- NOTAS IMPORTANTES:
-- - Este script é idempotente (pode ser executado múltiplas vezes)
-- - As políticas RLS garantem segurança dos dados
-- - O trigger cria automaticamente o perfil após registro
-- - Os índices melhoram a performance das consultas
-- =====================================================

=======
-- MELHORIAS IMPLEMENTADAS:
-- - Trigger automático para criação de perfil
-- - Políticas RLS corrigidas para admins
-- - Usuário admin criado automaticamente
-- - Realtime habilitado para sincronização
-- - Índices para melhor performance
-- - Tratamento de erros melhorado
-- =====================================================



>>>>>>> 68048ee0f45367395ea451b64aeb27cb26493f1f
