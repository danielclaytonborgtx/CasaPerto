import { supabase } from '../lib/supabase'

export interface Message {
  id: number
  sender_id: number
  receiver_id: number
  content: string
  created_at: string
  read_at?: string
  sender?: {
    id: number
    name: string
    username: string
  }
  receiver?: {
    id: number
    name: string
    username: string
  }
}

export const supabaseMessages = {
  // Buscar mensagens entre dois usuários
  async getMessagesBetweenUsers(userId1: number, userId2: number): Promise<Message[]> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:users!messages_sender_id_fkey(id, name, username),
          receiver:users!messages_receiver_id_fkey(id, name, username)
        `)
        .or(`and(sender_id.eq.${userId1},receiver_id.eq.${userId2}),and(sender_id.eq.${userId2},receiver_id.eq.${userId1})`)
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Erro ao buscar mensagens:', error.message)
        throw new Error(error.message)
      }

      return data || []
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error)
      throw error
    }
  },

  // Buscar conversas do usuário
  async getUserConversations(userId: number): Promise<{
    user: {
      id: number
      name: string
      username: string
    }
    lastMessage?: Message
    unreadCount: number
  }[]> {
    try {
      // Buscar todas as mensagens do usuário
      const { data: messages, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:users!messages_sender_id_fkey(id, name, username),
          receiver:users!messages_receiver_id_fkey(id, name, username)
        `)
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erro ao buscar conversas:', error.message)
        throw new Error(error.message)
      }

      // Agrupar por usuário
      const conversations = new Map<number, {
        user: { id: number; name: string; username: string }
        lastMessage?: Message
        unreadCount: number
      }>()

      messages?.forEach(message => {
        const otherUserId = message.sender_id === userId ? message.receiver_id : message.sender_id
        const otherUser = message.sender_id === userId ? message.receiver : message.sender

        if (!conversations.has(otherUserId)) {
          conversations.set(otherUserId, {
            user: otherUser!,
            lastMessage: undefined,
            unreadCount: 0
          })
        }

        const conversation = conversations.get(otherUserId)!
        
        // Se é a primeira mensagem (mais recente) ou se é mais recente que a atual
        if (!conversation.lastMessage || new Date(message.created_at) > new Date(conversation.lastMessage.created_at)) {
          conversation.lastMessage = message
        }

        // Contar mensagens não lidas
        if (message.receiver_id === userId && !message.read_at) {
          conversation.unreadCount++
        }
      })

      return Array.from(conversations.values())
    } catch (error) {
      console.error('Erro ao buscar conversas:', error)
      throw error
    }
  },

  // Enviar mensagem
  async sendMessage(messageData: {
    sender_id: number
    receiver_id: number
    content: string
  }): Promise<Message> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          ...messageData,
          created_at: new Date().toISOString(),
        })
        .select(`
          *,
          sender:users!messages_sender_id_fkey(id, name, username),
          receiver:users!messages_receiver_id_fkey(id, name, username)
        `)
        .single()

      if (error) {
        console.error('Erro ao enviar mensagem:', error.message)
        throw new Error(error.message)
      }

      return data
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
      throw error
    }
  },

  // Marcar mensagens como lidas
  async markMessagesAsRead(senderId: number, receiverId: number): Promise<void> {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ read_at: new Date().toISOString() })
        .eq('sender_id', senderId)
        .eq('receiver_id', receiverId)
        .is('read_at', null)

      if (error) {
        console.error('Erro ao marcar mensagens como lidas:', error.message)
        throw new Error(error.message)
      }
    } catch (error) {
      console.error('Erro ao marcar mensagens como lidas:', error)
      throw error
    }
  },

  // Buscar mensagens não lidas desde uma data
  async getUnreadMessagesSince(userId: number, since: string): Promise<{
    hasUnread: boolean
    count: number
  }> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('id, created_at, read_at')
        .eq('receiver_id', userId)
        .gte('created_at', since)
        .is('read_at', null)

      if (error) {
        console.error('Erro ao buscar mensagens não lidas:', error.message)
        throw new Error(error.message)
      }

      return {
        hasUnread: (data?.length || 0) > 0,
        count: data?.length || 0
      }
    } catch (error) {
      console.error('Erro ao buscar mensagens não lidas:', error)
      throw error
    }
  },

  // Deletar mensagem
  async deleteMessage(messageId: number, userId: number): Promise<void> {
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', messageId)
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)

      if (error) {
        console.error('Erro ao deletar mensagem:', error.message)
        throw new Error(error.message)
      }
    } catch (error) {
      console.error('Erro ao deletar mensagem:', error)
      throw error
    }
  }
}
