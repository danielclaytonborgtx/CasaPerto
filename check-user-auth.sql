-- Script para verificar usuários no Supabase Auth
-- Execute este script no SQL Editor do Supabase

-- 1. Verificar usuários na tabela users
SELECT 
  id,
  name,
  email,
  username,
  created_at
FROM users 
ORDER BY created_at DESC 
LIMIT 5;

-- 2. Verificar se RLS está desabilitado
SELECT 
  schemaname, 
  tablename, 
  rowsecurity 
FROM pg_tables 
WHERE tablename = 'users';

-- 3. Verificar políticas RLS
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'users';

-- 4. Status da verificação
SELECT 'User verification completed!' as status;
