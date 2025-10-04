-- Script para corrigir as políticas RLS da tabela teams
-- Execute este script no SQL Editor do Supabase

-- Remover políticas existentes se houver
DROP POLICY IF EXISTS "Users can create teams" ON teams;
DROP POLICY IF EXISTS "Users can view teams they belong to" ON teams;
DROP POLICY IF EXISTS "Team creators can update their teams" ON teams;

-- Criar políticas mais permissivas para desenvolvimento
CREATE POLICY "Allow all operations on teams" ON teams
  FOR ALL USING (true) WITH CHECK (true);

-- Verificar se as políticas foram criadas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'teams';
