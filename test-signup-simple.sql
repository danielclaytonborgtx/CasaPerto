-- Script simples para testar SignUp
-- Execute este script no SQL Editor do Supabase

-- 1. Verificar se a tabela users existe
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'users'
ORDER BY ordinal_position;

-- 2. Verificar políticas RLS
SELECT policyname, permissive, roles, cmd 
FROM pg_policies 
WHERE tablename = 'users';

-- 3. Desabilitar RLS temporariamente (CUIDADO: só para teste!)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- 4. Testar inserção manual
INSERT INTO users (id, name, email, username, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'Teste Manual',
  'teste@teste.com',
  'teste123',
  NOW(),
  NOW()
);

-- 5. Verificar se inseriu
SELECT * FROM users WHERE email = 'teste@teste.com';

-- 6. Limpar teste
DELETE FROM users WHERE email = 'teste@teste.com';

-- 7. Reabilitar RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
