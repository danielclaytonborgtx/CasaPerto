import { supabase } from '../lib/supabase'

export interface Visitor {
  id: string
  name: string
  email: string
  phone?: string
  created_at: string
  last_contact_at: string
}

export interface VisitorMessage {
  id: number
  sender_id?: string
  receiver_id?: string
  visitor_sender_id?: string
  visitor_receiver_id?: string
  content: string
  created_at: string
  read_at?: string
  sender?: {
    id: string
    name: string
    username: string
  }
  receiver?: {
    id: string
    name: string
    username: string
  }
  visitor_sender?: Visitor
  visitor_receiver?: Visitor
}

export const supabaseVisitors = {
  // Criar ou buscar visitante por email
  async createOrGetVisitor(visitorData: {
    name: string
    email: string
    phone?: string
  }): Promise<Visitor> {
    try {
      // Primeiro, tentar buscar visitante existente
      const { data: existingVisitor, error: searchError } = await supabase
        .from('visitors')
        .select('*')
        .eq('email', visitorData.email)
        .single()

      if (existingVisitor && !searchError) {
        // Atualizar dados do visitante se necessário
        const { data: updatedVisitor, error: updateError } = await supabase
          .from('visitors')
          .update({
            name: visitorData.name,
            phone: visitorData.phone,
            last_contact_at: new Date().toISOString()
          })
          .eq('id', existingVisitor.id)
          .select()
          .single()

        if (updateError) {
          console.error('❌ Erro ao atualizar visitante:', updateError.message)
          throw new Error(updateError.message)
        }

        return updatedVisitor
      }

      // Se não existe, criar novo visitante
      const { data: newVisitor, error: createError } = await supabase
        .from('visitors')
        .insert({
          name: visitorData.name,
          email: visitorData.email,
          phone: visitorData.phone,
          created_at: new Date().toISOString(),
          last_contact_at: new Date().toISOString()
        })
        .select()
        .single()

      if (createError) {
        console.error('❌ Erro ao criar visitante:', createError.message)
        throw new Error(createError.message)
      }

      return newVisitor
    } catch (error) {
      console.error('❌ Erro ao criar/buscar visitante:', error)
      throw error
    }
  },

  // Enviar mensagem de visitante para usuário cadastrado
  async sendVisitorMessage(messageData: {
    visitor_sender_id: string
    receiver_id: string
    content: string
  }): Promise<VisitorMessage> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          visitor_sender_id: messageData.visitor_sender_id,
          receiver_id: messageData.receiver_id,
          content: messageData.content,
          created_at: new Date().toISOString(),
        })
        .select(`
          *,
          visitor_sender:visitors!messages_visitor_sender_id_fkey(id, name, email, phone),
          receiver:users!messages_receiver_id_fkey(id, name, username)
        `)
        .single()

      if (error) {
        console.error('❌ Erro ao enviar mensagem de visitante:', error.message)
        throw new Error(error.message)
      }

      return data
    } catch (error) {
      console.error('❌ Erro ao enviar mensagem de visitante:', error)
      throw error
    }
  },

  // Buscar mensagens entre visitante e usuário
  async getMessagesBetweenVisitorAndUser(visitorId: string, userId: string): Promise<VisitorMessage[]> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          visitor_sender:visitors!messages_visitor_sender_id_fkey(id, name, email, phone),
          receiver:users!messages_receiver_id_fkey(id, name, username),
          sender:users!messages_sender_id_fkey(id, name, username)
        `)
        .or(`and(visitor_sender_id.eq.${visitorId},receiver_id.eq.${userId}),and(sender_id.eq.${userId},visitor_receiver_id.eq.${visitorId})`)
        .order('created_at', { ascending: true })

      if (error) {
        console.error('❌ Erro ao buscar mensagens visitante-usuário:', error.message)
        throw new Error(error.message)
      }

      return data || []
    } catch (error) {
      console.error('❌ Erro ao buscar mensagens visitante-usuário:', error)
      throw error
    }
  },

  // Buscar conversas do usuário incluindo visitantes
  async getUserConversationsWithVisitors(userId: string): Promise<{
    user?: {
      id: string
      name: string
      username: string
    }
    visitor?: Visitor
    lastMessage?: VisitorMessage
    unreadCount: number
    isVisitor: boolean
  }[]> {
    try {
      // Buscar TODAS as mensagens (incluindo visitantes) de uma vez
      const { data: allMessagesData, error: allError } = await supabase
        .from('messages')
        .select(`
          *,
          sender:users!messages_sender_id_fkey(id, name, username),
          receiver:users!messages_receiver_id_fkey(id, name, username),
          visitor_sender:visitors!messages_visitor_sender_id_fkey(id, name, email, phone),
          visitor_receiver:visitors!messages_visitor_receiver_id_fkey(id, name, email, phone)
        `)
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .order('created_at', { ascending: false })

      if (allError) {
        console.error('Erro ao buscar todas as mensagens:', allError.message)
        throw new Error(allError.message)
      }

      // Usar apenas as mensagens combinadas
      const messages = allMessagesData || []

      // Agrupar por usuário ou visitante
      const conversations = new Map<string, {
        user?: { id: string; name: string; username: string }
        visitor?: Visitor
        lastMessage?: VisitorMessage
        unreadCount: number
        isVisitor: boolean
      }>()

      messages?.forEach(message => {
        let otherId: string
        let otherUser: any
        let isVisitor = false

        if (message.sender_id === userId) {
          // Usuário enviou mensagem
          if (message.visitor_receiver_id) {
            otherId = message.visitor_receiver_id
            otherUser = message.visitor_receiver
            isVisitor = true
          } else {
            otherId = message.receiver_id
            otherUser = message.receiver
          }
        } else if (message.receiver_id === userId) {
          // Usuário recebeu mensagem
          if (message.visitor_sender_id) {
            otherId = message.visitor_sender_id
            otherUser = message.visitor_sender
            isVisitor = true
          } else {
            otherId = message.sender_id
            otherUser = message.sender
          }
        } else {
          return // Pular mensagens não relacionadas ao usuário
        }

        if (otherId && otherUser) {
          if (!conversations.has(otherId)) {
            conversations.set(otherId, {
              user: isVisitor ? undefined : otherUser,
              visitor: isVisitor ? otherUser : undefined,
              lastMessage: undefined,
              unreadCount: 0,
              isVisitor
            })
          }
        }

        if (otherId && otherUser) {
          const conversation = conversations.get(otherId)!
          
          // Se é a primeira mensagem (mais recente) ou se é mais recente que a atual
          if (!conversation.lastMessage || new Date(message.created_at) > new Date(conversation.lastMessage.created_at)) {
            conversation.lastMessage = message
          }

          // Contar mensagens não lidas
          if ((message.receiver_id === userId || message.visitor_receiver_id) && !message.read_at) {
            conversation.unreadCount++
          }
        }
      })

      const result = Array.from(conversations.entries()).map(([id, conv]) => ({
        userId: conv.isVisitor ? undefined : id,
        visitorId: conv.isVisitor ? id : undefined,
        userName: conv.isVisitor ? (conv.visitor?.name || 'Visitante') : (conv.user?.name || 'Usuário'),
        userPhone: conv.visitor?.phone,
        user: conv.user,
        visitor: conv.visitor,
        lastMessage: conv.lastMessage,
        unreadCount: conv.unreadCount,
        isVisitor: conv.isVisitor
      }));

      return result
    } catch (error) {
      console.error('Erro ao buscar conversas com visitantes:', error)
      throw error
    }
  },

  // Marcar mensagens de visitante como lidas
  async markVisitorMessagesAsRead(visitorId: string, userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ read_at: new Date().toISOString() })
        .eq('visitor_sender_id', visitorId)
        .eq('receiver_id', userId)
        .is('read_at', null)

      if (error) {
        console.error('Erro ao marcar mensagens de visitante como lidas:', error.message)
        throw new Error(error.message)
      }
    } catch (error) {
      console.error('Erro ao marcar mensagens de visitante como lidas:', error)
      throw error
    }
  }
}
