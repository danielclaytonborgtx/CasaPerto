-- Script para DESABILITAR RLS temporariamente na tabela users
-- Execute este script no SQL Editor do Supabase

-- 1. Desabilitar RLS na tabela users
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- 2. Verificar se foi desabilitado
SELECT 
  schemaname, 
  tablename, 
  rowsecurity 
FROM pg_tables 
WHERE tablename = 'users';

-- 3. Confirmar desabilitação
SELECT 'RLS disabled successfully for users table!' as status;
