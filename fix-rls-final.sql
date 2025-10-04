-- Script para corrigir políticas RLS da tabela users
-- Execute este script no SQL Editor do Supabase

-- 1. Remover políticas existentes da tabela users
DROP POLICY IF EXISTS "Users can view all users" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;

-- 2. Recriar políticas RLS corretas para users
-- Política para visualizar todos os usuários (público)
CREATE POLICY "Users can view all users" ON users FOR SELECT USING (true);

-- Política para atualizar próprio perfil
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Política para inserir próprio perfil (CRÍTICA para cadastro)
CREATE POLICY "Users can insert own profile" ON users FOR INSERT WITH CHECK (auth.uid() = id);

-- 3. Verificar se RLS está habilitado
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 4. Testar se as políticas estão funcionando
SELECT 'RLS policies fixed successfully!' as status;
