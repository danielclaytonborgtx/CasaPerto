-- Script para atualizar a foto de perfil de um usuário
-- Substitua 'USER_ID' pelo ID do usuário e 'IMAGE_URL' pela URL da imagem

-- Exemplo de como atualizar a foto de perfil de um usuário
UPDATE users 
SET profile_picture = 'https://exemplo.com/caminho/para/imagem.jpg'
WHERE id = 'USER_ID_AQUI';

-- Para verificar se a atualização funcionou
SELECT id, name, username, profile_picture 
FROM users 
WHERE id = 'USER_ID_AQUI';

-- Para listar todos os usuários com suas fotos de perfil
SELECT id, name, username, profile_picture 
FROM users 
ORDER BY name;
