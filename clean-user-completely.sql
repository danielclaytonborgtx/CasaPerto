-- Script para limpar completamente o usuário
-- Execute este script no SQL Editor do Supabase

-- 1. Deletar usuário da tabela users
DELETE FROM users WHERE email = 'danielclaitul@gmail.com';

-- 2. Verificar se foi deletado
SELECT 
  'Users remaining:' as info,
  COUNT(*) as total_users
FROM users;

-- 3. Verificar se RLS está desabilitado
SELECT 
  'RLS Status:' as info,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'users';

-- 4. Status da limpeza
SELECT 'User cleaned from database!' as status;
