-- Script para adicionar coluna de foto de perfil na tabela users
-- Execute este script no SQL Editor do Supabase

-- Adicionar coluna profile_picture na tabela users
ALTER TABLE users 
ADD COLUMN profile_picture TEXT;

-- Adicionar comentário para documentar a coluna
COMMENT ON COLUMN users.profile_picture IS 'URL da foto de perfil do usuário';

-- Opcional: Adicionar índice para melhor performance em consultas
CREATE INDEX IF NOT EXISTS idx_users_profile_picture ON users(profile_picture) WHERE profile_picture IS NOT NULL;

-- Verificar se a coluna foi criada corretamente
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users' AND column_name = 'profile_picture';
