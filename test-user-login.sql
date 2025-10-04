-- Script para testar se o usuário existe e verificar RLS
-- Execute este script no SQL Editor do Supabase

-- 1. Verificar se o usuário existe na tabela users
SELECT 
  'User exists in database:' as info,
  id,
  name,
  email,
  username,
  created_at
FROM users 
WHERE email = 'danielclaitul@gmail.com';

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

-- 4. Testar se conseguimos buscar o usuário
SELECT 
  'Can query user:' as info,
  COUNT(*) as user_count
FROM users 
WHERE email = 'danielclaitul@gmail.com';

-- 5. Status do teste
SELECT 'User login test completed!' as status;
