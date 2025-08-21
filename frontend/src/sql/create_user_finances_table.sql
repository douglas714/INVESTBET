-- Script SQL para criar a tabela user_finances no Supabase
-- Execute este script no SQL Editor do Supabase

-- Criar a tabela user_finances
CREATE TABLE IF NOT EXISTS user_finances (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    balance DECIMAL(15,2) DEFAULT 0.00 NOT NULL,
    monthly_profit DECIMAL(15,2) DEFAULT 0.00 NOT NULL,
    accumulated_profit DECIMAL(15,2) DEFAULT 0.00 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    -- Garantir que cada usuário tenha apenas um registro
    UNIQUE(user_id)
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_user_finances_user_id ON user_finances(user_id);
CREATE INDEX IF NOT EXISTS idx_user_finances_updated_at ON user_finances(updated_at);

-- Criar função para atualizar o campo updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Criar trigger para atualizar updated_at automaticamente
DROP TRIGGER IF EXISTS update_user_finances_updated_at ON user_finances;
CREATE TRIGGER update_user_finances_updated_at
    BEFORE UPDATE ON user_finances
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Habilitar Row Level Security (RLS)
ALTER TABLE user_finances ENABLE ROW LEVEL SECURITY;

-- Criar políticas de segurança
-- Usuários podem ver apenas seus próprios dados
CREATE POLICY "Users can view own financial data" ON user_finances
    FOR SELECT USING (auth.uid() = user_id);

-- Usuários podem inserir apenas seus próprios dados
CREATE POLICY "Users can insert own financial data" ON user_finances
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Usuários podem atualizar apenas seus próprios dados
CREATE POLICY "Users can update own financial data" ON user_finances
    FOR UPDATE USING (auth.uid() = user_id);

-- Usuários podem deletar apenas seus próprios dados
CREATE POLICY "Users can delete own financial data" ON user_finances
    FOR DELETE USING (auth.uid() = user_id);

-- Comentários para documentação
COMMENT ON TABLE user_finances IS 'Tabela para armazenar dados financeiros dos usuários';
COMMENT ON COLUMN user_finances.id IS 'Identificador único do registro';
COMMENT ON COLUMN user_finances.user_id IS 'Referência ao usuário na tabela auth.users';
COMMENT ON COLUMN user_finances.balance IS 'Saldo atual disponível para investimentos';
COMMENT ON COLUMN user_finances.monthly_profit IS 'Lucro obtido no mês atual';
COMMENT ON COLUMN user_finances.accumulated_profit IS 'Lucro total acumulado desde o início';
COMMENT ON COLUMN user_finances.created_at IS 'Data e hora de criação do registro';
COMMENT ON COLUMN user_finances.updated_at IS 'Data e hora da última atualização';

-- Inserir dados de exemplo (opcional - remover em produção)
-- INSERT INTO user_finances (user_id, balance, monthly_profit, accumulated_profit)
-- VALUES 
--     ('user-uuid-here', 10000.00, 1500.00, 25000.00);

-- Verificar se a tabela foi criada corretamente
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'user_finances'
ORDER BY ordinal_position;

