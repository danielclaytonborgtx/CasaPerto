import { supabase } from '../lib/supabase'

export interface ProfileUpdate {
  name?: string;
  username?: string;
  profile_picture?: string;
  bio?: string;
}

export const supabaseProfile = {
  // Atualizar foto de perfil do usuário
  async updateProfilePicture(userId: string, imageUrl: string): Promise<void> {
    try {
      console.log('🖼️ supabaseProfile: Atualizando foto de perfil', { userId, imageUrl });
      
      const { error } = await supabase
        .from('users')
        .update({ profile_picture: imageUrl })
        .eq('id', userId);

      if (error) {
        console.error('❌ Erro ao atualizar foto de perfil:', error.message);
        throw new Error(error.message);
      }

      console.log('✅ supabaseProfile: Foto de perfil atualizada com sucesso');
    } catch (error) {
      console.error('❌ Erro ao atualizar foto de perfil:', error);
      throw error;
    }
  },

  // Atualizar perfil completo do usuário
  async updateProfile(userId: string, updates: ProfileUpdate): Promise<void> {
    try {
      console.log('👤 supabaseProfile: Atualizando perfil', { userId, updates });
      
      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId);

      if (error) {
        console.error('❌ Erro ao atualizar perfil:', error.message);
        throw new Error(error.message);
      }

      console.log('✅ supabaseProfile: Perfil atualizado com sucesso');
    } catch (error) {
      console.error('❌ Erro ao atualizar perfil:', error);
      throw error;
    }
  },

  // Atualizar bio do usuário
  async updateBio(userId: string, bio: string): Promise<void> {
    try {
      console.log('📝 supabaseProfile: Atualizando bio no banco de dados', { userId, bio });
      
      const { error } = await supabase
        .from('users')
        .update({ bio: bio })
        .eq('id', userId);

      if (error) {
        console.error('❌ Erro ao atualizar bio:', error.message);
        throw new Error(error.message);
      }

      console.log('✅ supabaseProfile: Bio atualizada com sucesso no banco de dados');
    } catch (error) {
      console.error('❌ Erro ao atualizar bio:', error);
      throw error;
    }
  },

  // Buscar perfil do usuário
  async getProfile(userId: string) {
    try { 
      const { data, error } = await supabase
        .from('users')
        .select('id, name, username, email, profile_picture, bio')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('❌ Erro ao buscar perfil:', error.message);
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      console.error('❌ Erro ao buscar perfil:', error);
      throw error;
    }
  }
}
