-- Script para testar login e verificar dados
-- Execute este script no SQL Editor do Supabase

-- 1. Verificar todos os usuários na tabela users
SELECT 
  'Users in database:' as info,
  COUNT(*) as total_users
FROM users;

-- 2. Mostrar detalhes dos usuários
SELECT 
  id,
  name,
  email,
  username,
  created_at
FROM users 
ORDER BY created_at DESC;

-- 3. Verificar se há problemas de RLS
SELECT 
  'RLS Status:' as info,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'users';

-- 4. Verificar políticas ativas
SELECT 
  'Active Policies:' as info,
  policyname,
  cmd,
  permissive
FROM pg_policies 
WHERE tablename = 'users';

-- 5. Teste de inserção (simulação)
SELECT 'Database check completed!' as status;
