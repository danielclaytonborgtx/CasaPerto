-- Adicionar coluna bio na tabela users
ALTER TABLE users ADD COLUMN bio TEXT;

-- Comentário para documentar a coluna
COMMENT ON COLUMN users.bio IS 'Biografia do usuário';

-- Opcional: Adicionar uma constraint para limitar o tamanho da bio
ALTER TABLE users ADD CONSTRAINT check_bio_length CHECK (LENGTH(bio) <= 500);
