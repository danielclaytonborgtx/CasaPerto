-- Script para adicionar política de exclusão de mensagens

-- Política para permitir que usuários deletem suas próprias mensagens
CREATE POLICY "Usuários podem deletar suas próprias mensagens" ON messages
    FOR DELETE
    TO authenticated
    USING (
        sender_id = auth.uid() OR 
        receiver_id = auth.uid()
    );

-- Verificar políticas existentes
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies 
WHERE tablename = 'messages'
ORDER BY policyname;

