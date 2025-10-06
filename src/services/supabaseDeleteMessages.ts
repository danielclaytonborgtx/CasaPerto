import { supabase } from '../lib/supabase';

export const supabaseDeleteMessages = {
  // Deletar todas as mensagens entre dois usuários
  async deleteConversationBetweenUsers(userId1: string, userId2: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .or(`and(sender_id.eq.${userId1},receiver_id.eq.${userId2}),and(sender_id.eq.${userId2},receiver_id.eq.${userId1})`);

      if (error) {
        console.error('Erro ao deletar mensagens entre usuários:', error.message);
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Erro ao deletar mensagens:', error);
      throw error;
    }
  },

  // Deletar todas as mensagens entre usuário e visitante
  async deleteConversationWithVisitor(userId: string, visitorId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .or(`and(visitor_sender_id.eq.${visitorId},receiver_id.eq.${userId}),and(sender_id.eq.${userId},visitor_receiver_id.eq.${visitorId})`);

      if (error) {
        console.error('Erro ao deletar mensagens com visitante:', error.message);
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Erro ao deletar mensagens com visitante:', error);
      throw error;
    }
  },

  // Deletar conversa (detecta automaticamente se é usuário ou visitante)
  async deleteConversation(currentUserId: string, conversationId: string, isVisitor: boolean): Promise<void> {
    try {
      if (isVisitor) {
        await this.deleteConversationWithVisitor(currentUserId, conversationId);
      } else {
        await this.deleteConversationBetweenUsers(currentUserId, conversationId);
      }
    } catch (error) {
      console.error('Erro ao deletar conversa:', error);
      throw error;
    }
  }
};

