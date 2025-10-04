-- Script para corrigir as políticas RLS da tabela team_members
-- Execute este script no SQL Editor do Supabase

-- Remover políticas existentes se houver
DROP POLICY IF EXISTS "Users can view team members of their teams" ON team_members;
DROP POLICY IF EXISTS "Team creators can add members" ON team_members;

-- Criar política permissiva para desenvolvimento
CREATE POLICY "Allow all operations on team_members" ON team_members
  FOR ALL USING (true) WITH CHECK (true);

-- Verificar se as políticas foram criadas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'team_members';
