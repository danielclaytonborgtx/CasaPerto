-- Corrigir políticas RLS para permitir criação de usuários
-- Execute este script no SQL Editor do Supabase

-- 1. Desabilitar temporariamente RLS para teste
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- 2. Recriar políticas mais permissivas
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 3. Política para permitir inserção de novos usuários
CREATE POLICY "Allow user creation" ON users
  FOR INSERT
  WITH CHECK (true);

-- 4. Política para permitir leitura de todos os usuários
CREATE POLICY "Allow user read" ON users
  FOR SELECT
  USING (true);

-- 5. Política para permitir atualização do próprio perfil
CREATE POLICY "Allow user update own profile" ON users
  FOR UPDATE
  USING (auth.uid()::text = id::text);

-- 6. Verificar se as políticas foram criadas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'users';

-- 7. Testar inserção manual (opcional)
-- INSERT INTO users (id, name, email, username) 
-- VALUES ('test-id', 'Test User', 'test@example.com', 'testuser');

-- 8. Se ainda houver problemas, desabilitar RLS temporariamente:
-- ALTER TABLE users DISABLE ROW LEVEL SECURITY;
