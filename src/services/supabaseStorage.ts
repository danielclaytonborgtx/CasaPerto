import { supabase } from '../lib/supabase'

export const supabaseStorage = {
  // Upload de imagem de perfil
  async uploadProfilePicture(userId: number, file: File): Promise<string> {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${userId}-${Date.now()}.${fileExt}`
      const filePath = `profiles/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        console.error('Erro ao fazer upload da imagem de perfil:', uploadError.message)
        throw new Error(uploadError.message)
      }

      // Obter URL pública
      const { data } = supabase.storage
        .from('images')
        .getPublicUrl(filePath)

      return data.publicUrl
    } catch (error) {
      console.error('Erro ao fazer upload da imagem de perfil:', error)
      throw error
    }
  },

  // Upload de imagens de propriedade
  async uploadPropertyImages(propertyId: number, files: File[]): Promise<string[]> {
    try {
      const uploadPromises = files.map(async (file, index) => {
        const fileExt = file.name.split('.').pop()
        const fileName = `${propertyId}-${index}-${Date.now()}.${fileExt}`
        const filePath = `properties/${propertyId}/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          })

        if (uploadError) {
          console.error('Erro ao fazer upload da imagem:', uploadError.message)
          throw new Error(uploadError.message)
        }

        // Obter URL pública
        const { data } = supabase.storage
          .from('images')
          .getPublicUrl(filePath)

        return data.publicUrl
      })

      const urls = await Promise.all(uploadPromises)
      return urls
    } catch (error) {
      console.error('Erro ao fazer upload das imagens:', error)
      throw error
    }
  },

  // Upload de imagem de equipe
  async uploadTeamImage(teamId: number, file: File): Promise<string> {
    try {
      const fileExt = file.name ? file.name.split('.').pop() : 'jpg'
      const fileName = `${teamId}-${Date.now()}.${fileExt}`
      const filePath = `teams/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        console.error('Erro ao fazer upload da imagem da equipe:', uploadError.message)
        throw new Error(uploadError.message)
      }

      // Obter URL pública
      const { data } = supabase.storage
        .from('images')
        .getPublicUrl(filePath)

      return data.publicUrl
    } catch (error) {
      console.error('Erro ao fazer upload da imagem da equipe:', error)
      throw error
    }
  },

  // Deletar imagem
  async deleteImage(filePath: string): Promise<void> {
    try {
      const { error } = await supabase.storage
        .from('images')
        .remove([filePath])

      if (error) {
        console.error('Erro ao deletar imagem:', error.message)
        throw new Error(error.message)
      }
    } catch (error) {
      console.error('Erro ao deletar imagem:', error)
      throw error
    }
  },

  // Deletar todas as imagens de uma propriedade
  async deletePropertyImages(propertyId: number): Promise<void> {
    try {
      const { data: files, error: listError } = await supabase.storage
        .from('images')
        .list(`properties/${propertyId}`)

      if (listError) {
        console.error('Erro ao listar imagens da propriedade:', listError.message)
        return
      }

      if (files && files.length > 0) {
        const filePaths = files.map(file => `properties/${propertyId}/${file.name}`)
        
        const { error: deleteError } = await supabase.storage
          .from('images')
          .remove(filePaths)

        if (deleteError) {
          console.error('Erro ao deletar imagens da propriedade:', deleteError.message)
          throw new Error(deleteError.message)
        }
      }
    } catch (error) {
      console.error('Erro ao deletar imagens da propriedade:', error)
      throw error
    }
  },

  // Obter URL pública de uma imagem
  getPublicUrl(filePath: string): string {
    const { data } = supabase.storage
      .from('images')
      .getPublicUrl(filePath)

    return data.publicUrl
  }
}
