-- Script para corrigir a tabela team_members
-- Execute este script no SQL Editor do Supabase

-- Adicionar coluna role na tabela team_members
ALTER TABLE team_members 
ADD COLUMN role VARCHAR(50) DEFAULT 'MEMBER';

-- Verificar se a coluna foi adicionada
SELECT column_name, data_type, column_default
FROM information_schema.columns 
WHERE table_name = 'team_members' AND column_name = 'role';
