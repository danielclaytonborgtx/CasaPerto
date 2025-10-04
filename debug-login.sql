-- Script para debugar problemas de login
-- Execute este script no SQL Editor do Supabase

-- 1. Verificar usuário na tabela users
SELECT 
  'User in database:' as info,
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

-- 4. Verificar se há problemas de encoding
SELECT 
  'Email encoding check:' as info,
  email,
  LENGTH(email) as email_length,
  ASCII(SUBSTRING(email, 1, 1)) as first_char_ascii
FROM users 
WHERE email = 'danielclaitul@gmail.com';

-- 5. Status da verificação
SELECT 'Login debug completed!' as status;
