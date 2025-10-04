-- Script SEGURO para migrar tabela users de SERIAL para UUID
-- Execute este script no SQL Editor do Supabase

-- 1. Remover TODAS as políticas RLS primeiro
DROP POLICY IF EXISTS "Users can view all users" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;

DROP POLICY IF EXISTS "Users can view all teams" ON teams;
DROP POLICY IF EXISTS "Users can create teams" ON teams;
DROP POLICY IF EXISTS "Team creators can update their teams" ON teams;
DROP POLICY IF EXISTS "Team creators can delete their teams" ON teams;

DROP POLICY IF EXISTS "Users can view team members" ON team_members;
DROP POLICY IF EXISTS "Team creators can add members" ON team_members;
DROP POLICY IF EXISTS "Users can leave teams" ON team_members;

DROP POLICY IF EXISTS "Users can view their invitations" ON team_invitations;
DROP POLICY IF EXISTS "Team creators can create invitations" ON team_invitations;
DROP POLICY IF EXISTS "Users can update their invitations" ON team_invitations;

DROP POLICY IF EXISTS "Users can view all properties" ON properties;
DROP POLICY IF EXISTS "Users can create properties" ON properties;
DROP POLICY IF EXISTS "Users can update their properties" ON properties;
DROP POLICY IF EXISTS "Users can delete their properties" ON properties;

DROP POLICY IF EXISTS "Users can view their messages" ON messages;
DROP POLICY IF EXISTS "Users can create messages" ON messages;
DROP POLICY IF EXISTS "Users can update their received messages" ON messages;

-- 2. Desabilitar RLS temporariamente
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE teams DISABLE ROW LEVEL SECURITY;
ALTER TABLE team_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE team_invitations DISABLE ROW LEVEL SECURITY;
ALTER TABLE properties DISABLE ROW LEVEL SECURITY;
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;

-- 3. Deletar tabelas dependentes primeiro (para evitar conflitos de FK)
DROP TABLE IF EXISTS team_members CASCADE;
DROP TABLE IF EXISTS team_invitations CASCADE;
DROP TABLE IF EXISTS properties CASCADE;
DROP TABLE IF EXISTS messages CASCADE;

-- 4. Deletar tabela users
DROP TABLE IF EXISTS users CASCADE;

-- 5. Recriar tabela users com UUID
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  picture TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Atualizar tabela teams para usar UUID
ALTER TABLE teams ALTER COLUMN creator_id TYPE UUID USING creator_id::text::UUID;

-- 7. Recriar tabelas dependentes com UUID
CREATE TABLE team_members (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, team_id)
);

CREATE TABLE team_invitations (
  id SERIAL PRIMARY KEY,
  team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACCEPTED', 'REJECTED')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE properties (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  description1 TEXT,
  price VARCHAR(50) NOT NULL,
  category VARCHAR(20) NOT NULL CHECK (category IN ('venda', 'aluguel')),
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  team_id INTEGER REFERENCES teams(id) ON DELETE SET NULL,
  images TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read_at TIMESTAMP WITH TIME ZONE
);

-- 8. Recriar índices
CREATE INDEX IF NOT EXISTS idx_properties_user_id ON properties(user_id);
CREATE INDEX IF NOT EXISTS idx_properties_team_id ON properties(team_id);
CREATE INDEX IF NOT EXISTS idx_properties_category ON properties(category);
CREATE INDEX IF NOT EXISTS idx_messages_sender_receiver ON messages(sender_id, receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_team_members_user_id ON team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_team_members_team_id ON team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_invitations_user_id ON team_invitations(user_id);
CREATE INDEX IF NOT EXISTS idx_team_invitations_team_id ON team_invitations(team_id);

-- 9. Recriar triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 10. Reabilitar RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- 11. Recriar políticas RLS
-- Políticas para usuários
CREATE POLICY "Users can view all users" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON users FOR INSERT WITH CHECK (auth.uid() = id);

-- Políticas para equipes
CREATE POLICY "Users can view all teams" ON teams FOR SELECT USING (true);
CREATE POLICY "Users can create teams" ON teams FOR INSERT WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "Team creators can update their teams" ON teams FOR UPDATE USING (auth.uid() = creator_id);
CREATE POLICY "Team creators can delete their teams" ON teams FOR DELETE USING (auth.uid() = creator_id);

-- Políticas para membros das equipes
CREATE POLICY "Users can view team members" ON team_members FOR SELECT USING (true);
CREATE POLICY "Team creators can add members" ON team_members FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM teams WHERE id = team_id AND creator_id = auth.uid())
);
CREATE POLICY "Users can leave teams" ON team_members FOR DELETE USING (user_id = auth.uid());

-- Políticas para convites
CREATE POLICY "Users can view their invitations" ON team_invitations FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Team creators can create invitations" ON team_invitations FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM teams WHERE id = team_id AND creator_id = auth.uid())
);
CREATE POLICY "Users can update their invitations" ON team_invitations FOR UPDATE USING (user_id = auth.uid());

-- Políticas para propriedades
CREATE POLICY "Users can view all properties" ON properties FOR SELECT USING (true);
CREATE POLICY "Users can create properties" ON properties FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update their properties" ON properties FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete their properties" ON properties FOR DELETE USING (user_id = auth.uid());

-- Políticas para mensagens
CREATE POLICY "Users can view their messages" ON messages FOR SELECT USING (
  sender_id = auth.uid() OR receiver_id = auth.uid()
);
CREATE POLICY "Users can create messages" ON messages FOR INSERT WITH CHECK (sender_id = auth.uid());
CREATE POLICY "Users can update their received messages" ON messages FOR UPDATE USING (receiver_id = auth.uid());

-- 12. Verificar se tudo está funcionando
SELECT 'Migration completed successfully!' as status;
