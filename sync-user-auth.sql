-- Script para sincronizar usuário entre tabela users e Supabase Auth
-- Execute este script no SQL Editor do Supabase

-- 1. Verificar usuários na tabela users
SELECT 
  'Users in database:' as info,
  id,
  name,
  email,
  username,
  created_at
FROM users 
ORDER BY created_at DESC;

-- 2. Verificar se RLS está desabilitado
SELECT 
  'RLS Status:' as info,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'users';

-- 3. Verificar políticas RLS
SELECT 
  'RLS Policies:' as info,
  policyname,
  cmd,
  permissive
FROM pg_policies 
WHERE tablename = 'users';

-- 4. Status da verificação
SELECT 'User sync check completed!' as status;
