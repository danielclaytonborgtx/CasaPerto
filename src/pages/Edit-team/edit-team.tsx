import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { supabaseStorage } from "../../services/supabaseStorage";
import { supabaseTeams } from "../../services/supabaseTeams";
import LoadingMessage from "../../components/loadingMessage/LoadingMessage";
import {
  Container,
  Input,
  Button,
  BrokerList,
  BrokerItem,
  AddedBrokerList,
  AddBrokerButton,
  LeftColumn,
  ListsContainer,
  RightColumn,
  TeamIcon,
  TeamImage,
  EditButton,
  DeleteTeamButton,
} from "./styles";

import { FaPlus, FaMinus } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";

import { useAuth } from "../../services/authContext";

// Interface local para compatibilidade com UUIDs do banco
interface LocalUser {
  id: string;
  name: string;
  email: string;
  username: string;
  password: string;
  createdAt: string;
  updatedAt: string;
}

interface TeamMemberData {
  id: string;
  user_id: string;
  team_id: number;
  role?: string;
  team?: {
    id: number;
    name: string;
  };
}

interface TeamMember {
  id: string;
  userId: string;
  name: string;
  email: string;
  role?: string;
}


interface PendingInvite {
  id: number;
  userId: string;
  name: string;
  email: string;
  status: string;
}

const EditTeam: React.FC = () => {
  const { id } = useParams();
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [teamName, setTeamName] = useState("");
  const [brokers, setBrokers] = useState<TeamMember[]>([]);
  const [brokerName, setBrokerName] = useState("");
  const [availableBrokers, setAvailableBrokers] = useState<LocalUser[]>([]);
  const [teamImage, setTeamImage] = useState<string | null>(null);
  const [imageInputRef, setImageInputRef] = useState<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>([]);
  const [removedMembers, setRemovedMembers] = useState<string[]>([]);

  const fetchTeam = useCallback(async () => {
    if (isDeleted) return;
    try {
      console.log('🔍 EditTeam: Buscando dados da equipe', id);
      const team = await supabaseTeams.getTeamById(Number(id));
      
      if (!team) {
        console.log('❌ EditTeam: Equipe não encontrada');
        navigate("/team");
        return;
      }
      
      console.log('✅ EditTeam: Equipe carregada', team);
      setTeamName(team.name);
      setTeamImage(team.image_url || null);
      
      // Buscar membros da equipe
      console.log('🔍 EditTeam: Verificando se getTeamMembers existe:', typeof supabaseTeams.getTeamMembers);
      const members = await supabaseTeams.getTeamMembers(Number(id));
      console.log('✅ EditTeam: Membros carregados', members);
      
      // Converter para o formato esperado
      const brokers = members.map(member => ({
        id: member.user_id,
        userId: member.user_id,
        name: member.user?.name || 'Nome não encontrado',
        email: member.user?.email || '',
        role: member.role
      }));
      
      setBrokers(brokers);
    } catch (error) {
      console.error("❌ EditTeam: Erro ao buscar dados da equipe:", error);
      navigate("/team");
    }
  }, [id, navigate, isDeleted]);

  const fetchBrokers = useCallback(async () => {
    try {
      console.log('🔍 EditTeam: Buscando usuários disponíveis');
      const { data: users, error } = await supabase
        .from('users')
        .select('id, name, username, email')
        .order('name', { ascending: true });

      if (error) {
        console.error('❌ EditTeam: Erro ao buscar usuários:', error);
        return;
      }

      console.log('✅ EditTeam: Usuários carregados', users);
      const validBrokers: LocalUser[] = (users || []).filter((broker) => broker.id && broker.name).map((broker) => ({
        id: broker.id,
        name: broker.name,
        email: broker.email,
        username: broker.username || '',
        password: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));
      setAvailableBrokers(validBrokers);
    } catch (error) {
      console.error("❌ EditTeam: Erro ao buscar corretores:", error);
    }
  }, []);

  useEffect(() => {
    if (id && !isDeleted) {
      fetchTeam();
    }
    fetchBrokers();
  }, [id, isDeleted, fetchBrokers, fetchTeam]);

  const handleAddBroker = (user: LocalUser) => {
    console.log('🔍 EditTeam: Adicionando usuário à lista de convites pendentes', { userId: user.id, name: user.name });
    
    // Adicionar à lista de convites pendentes (sem enviar ainda)
    const newInvite = {
      id: Date.now(), // ID temporário
      userId: user.id,
      name: user.name,
      email: user.email,
      status: 'PENDING'
    };
    setPendingInvites((prev) => [...prev, newInvite]);

    // Remover da lista de corretores disponíveis
    setAvailableBrokers((prev) => prev.filter((b) => b.id !== user.id));
    
    console.log('✅ EditTeam: Usuário adicionado à lista de convites pendentes');
  };

  const handleRemovePendingInvite = (userId: string) => {
    console.log('🔍 EditTeam: Removendo convite pendente', { userId });
    
    // Remover da lista de convites pendentes
    setPendingInvites((prev) => prev.filter((invite) => invite.userId !== userId));
    
    // Adicionar de volta à lista de corretores disponíveis (apenas se não existir)
    const removedInvite = pendingInvites.find(invite => invite.userId === userId);
    if (removedInvite) {
      setAvailableBrokers((prev) => {
        const alreadyExists = prev.some(b => b.id === removedInvite.userId);
        if (alreadyExists) {
          console.log('⚠️ EditTeam: Corretor já existe na lista de disponíveis');
          return prev;
        }
        
        const brokerAsUser: LocalUser = {
          id: removedInvite.userId,
          name: removedInvite.name,
          email: removedInvite.email,
          username: '',
          password: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        return [...prev, brokerAsUser];
      });
    }
    
    console.log('✅ EditTeam: Convite pendente removido');
  };

  const handleRemoveBroker = (broker: TeamMember) => {
    console.log('🔍 EditTeam: Removendo membro da lista (visual)', { userId: broker.userId });
    
    // Apenas remover da lista visual - não salvar no banco ainda
    setBrokers((prev) => prev.filter((b) => b.userId !== broker.userId));

    // Adicionar à lista de membros removidos
    setRemovedMembers((prev) => [...prev, broker.userId]);

    // Adicionar de volta à lista de disponíveis (apenas se não existir)
    setAvailableBrokers((prev) => {
      const alreadyExists = prev.some(b => b.id === broker.userId);
      if (alreadyExists) {
        console.log('⚠️ EditTeam: Corretor já existe na lista de disponíveis');
        return prev;
      }
      
      const brokerAsUser: LocalUser = {
        id: broker.userId,
        name: broker.name,
        email: broker.email,
        username: '',
        password: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      return [...prev, brokerAsUser];
    });
    
    console.log('✅ EditTeam: Membro removido da lista (será salvo ao clicar em Salvar)');
  };

  const handleUpdateTeam = async () => {
    if (loading) return;

    if (teamName.trim() === "") {
      alert("O nome da equipe não pode estar vazio.");
      return;
    }

    if (brokers.length === 0) {
      alert("Adicione pelo menos um corretor à equipe.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("name", teamName);
    formData.append("members", JSON.stringify(brokers.map((broker) => broker.userId)));

    if (teamImage && teamImage.startsWith("data:image")) {
      const imageBlob = dataURItoBlob(teamImage);
      formData.append("image", imageBlob);
    } else if (teamImage && !teamImage.startsWith("http")) {
      formData.append("imageUrl", teamImage);
    }

    try {
      console.log('🔍 EditTeam: Atualizando equipe', { teamId: id, name: teamName });
      
      // Atualizar dados básicos da equipe
      await supabaseTeams.updateTeam(Number(id), {
        name: teamName
      });
      
      // Fazer upload da imagem se houver
      if (teamImage && teamImage.startsWith("data:image")) {
        console.log('🖼️ EditTeam: Fazendo upload da nova imagem');
        const imageBlob = dataURItoBlob(teamImage);
        const imageFile = new File([imageBlob], 'team-image.jpg', { type: imageBlob.type });
        const imageUrl = await supabaseStorage.uploadTeamImage(Number(id), imageFile);
        
        // Atualizar URL da imagem
        await supabaseTeams.updateTeam(Number(id), {
          image_url: imageUrl
        });
      }

      // Remover membros da equipe (se houver)
      // Remover membros da equipe (se houver)
      if (removedMembers.length > 0) {
        console.log('🗑️ EditTeam: Removendo membros da equipe', removedMembers.length);

        for (const memberId of removedMembers) {
          try {
            // 1️⃣ Remover membro da equipe
            await supabaseTeams.removeTeamMember(Number(id), memberId);
            console.log('✅ EditTeam: Membro removido da equipe', memberId);

            // 2️⃣ Limpar team_id das propriedades do membro
            console.log('🧹 EditTeam: Limpando vínculo das propriedades do membro', memberId);
            const { error: updatePropertiesError } = await supabase
              .from('properties')
              .update({ team_id: null })
              .eq('user_id', memberId)
              .eq('team_id', Number(id));

            if (updatePropertiesError) {
              console.error('❌ EditTeam: Erro ao limpar vínculo das propriedades:', updatePropertiesError);
              if (updatePropertiesError.code === '42501') {
                console.error('🔒 EditTeam: ERRO DE PERMISSÃO RLS - Execute o script fix-edit-team-rls.sql no Supabase');
                alert('Erro de permissão ao atualizar propriedades. Verifique as políticas RLS do banco de dados.');
              }
            } else {
              console.log('✅ EditTeam: Vínculo das propriedades limpo com sucesso');
            }

            // 3️⃣ Limpar dados do usuário no banco (teamId e afins)
            console.log('🧩 EditTeam: Limpando dados do usuário (teamId, teamMembers...)');
            const { error: updateUserError } = await supabase
              .from('users')
              .update({
                team_id: null,
                team: null,
                teamMembers: [],
              })
              .eq('id', memberId);

            if (updateUserError) {
              console.error('❌ EditTeam: Erro ao limpar dados do usuário:', updateUserError);
              if (updateUserError.code === '42501') {
                console.error('🔒 EditTeam: ERRO DE PERMISSÃO RLS - Execute o script fix-edit-team-rls.sql no Supabase');
                alert('Erro de permissão ao atualizar dados do usuário. Verifique as políticas RLS do banco de dados.');
              }
            } else {
              console.log('✅ EditTeam: Dados do usuário limpos com sucesso');
            }

            // 4️⃣ Limpar localStorage do usuário removido (se estiver logado em outra aba)
            console.log('🧹 EditTeam: Limpando localStorage do usuário removido');
            try {
              // Nota: Isso só funciona se o usuário estiver logado na mesma sessão
              // Para usuários em outras abas, eles serão atualizados no próximo login
              const storedUser = localStorage.getItem('user');
              if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                if (parsedUser.id === memberId) {
                  // Limpar dados de equipe do localStorage
                  parsedUser.teamMembers = [];
                  parsedUser.team_id = null;
                  parsedUser.team = null;
                  localStorage.setItem('user', JSON.stringify(parsedUser));
                  console.log('✅ EditTeam: localStorage do usuário removido limpo');
                }
              }
            } catch (localStorageError) {
              console.error('❌ EditTeam: Erro ao limpar localStorage:', localStorageError);
            }

            // 4️⃣ (Opcional) Se o membro estiver logado em outra aba, 
            // ele será desassociado automaticamente na próxima leitura do banco.
            // Caso você tenha Supabase Realtime, isso atualizará instantaneamente.

          } catch (memberError) {
            console.error('❌ EditTeam: Erro ao remover membro', memberId, memberError);
          }
        }
      }

      // Enviar convites pendentes
      if (pendingInvites.length > 0) {
        console.log('📧 EditTeam: Enviando convites pendentes', pendingInvites.length);
        
        for (const invite of pendingInvites) {
          try {
            await supabaseTeams.createTeamInvitation(Number(id), invite.userId);
            console.log('✅ EditTeam: Convite enviado para', invite.name);
          } catch (inviteError) {
            console.error('❌ EditTeam: Erro ao enviar convite para', invite.name, inviteError);
          }
        }
      }

      console.log('✅ EditTeam: Equipe atualizada com sucesso');
      
      // Forçar atualização dos dados do usuário para refletir mudanças
      if (user) {
        console.log('🔄 EditTeam: Forçando atualização dos dados do usuário...');
        // Recarregar dados do usuário para atualizar teamMembers
        try {
          // Buscar dados atualizados do usuário
          const { data: updatedUser, error: userError } = await supabase
            .from('users')
            .select(`
              *,
              team_members:team_members(
                *,
                team:teams(*)
              )
            `)
            .eq('id', user.id)
            .single();
          
          if (!userError && updatedUser) {
            // Converter team_members para o formato esperado
            if (updatedUser.team_members) {
              updatedUser.teamMembers = updatedUser.team_members.map((tm: TeamMemberData) => ({
                id: tm.id,
                userId: tm.user_id,
                teamId: tm.team_id
              }));
              delete updatedUser.team_members;
            }
            
            console.log('✅ EditTeam: Dados do usuário atualizados:', updatedUser);
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
          }
        } catch (error) {
          console.error('❌ EditTeam: Erro ao atualizar dados do usuário:', error);
          // Fallback: reload da página
          window.location.reload();
        }
      }
      
      navigate("/team");
    } catch (error) {
      console.error("❌ EditTeam: Erro ao editar equipe:", error);
      alert("Erro ao editar equipe. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("O arquivo deve ser uma imagem.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("O arquivo deve ter no máximo 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setTeamImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const dataURItoBlob = (dataURI: string) => {
    const mimeTypeMatch = dataURI.match(/^data:(image\/\w+);base64,/);
    if (!mimeTypeMatch) {
      alert("Imagem inválida!");
      return new Blob([]);
    }

    const mimeType = mimeTypeMatch[1];
    const byteString = atob(dataURI.split(",")[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ua = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ua[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeType });
  };

  const handleIconClick = () => {
    if (imageInputRef) {
      imageInputRef.click();
    }
  };

  const handleDeleteTeam = async () => {
    const confirmDelete = window.confirm("Você tem certeza que deseja excluir esta equipe?");
    if (confirmDelete) {
      try {
        console.log('🔍 EditTeam: Excluindo equipe', id);
        setIsDeleted(true);
        
        // Primeiro, limpar team_id de todas as propriedades dos membros da equipe
        console.log('🧹 EditTeam: Limpando team_id das propriedades dos membros da equipe...');
        const { error: updatePropertiesError } = await supabase
          .from('properties')
          .update({ team_id: null })
          .eq('team_id', Number(id));

        if (updatePropertiesError) {
          console.error('❌ EditTeam: Erro ao limpar team_id das propriedades:', updatePropertiesError);
          // Não falhar o processo por causa disso, apenas logar o erro
        } else {
          console.log('✅ EditTeam: team_id das propriedades limpo com sucesso');
        }
        
        // Deletar equipe
        await supabaseTeams.deleteTeam(Number(id));

        if (setUser && user) {
          const updatedUser = {
            ...user,
            teamId: undefined,
            team: undefined,
          };
          setUser(updatedUser);
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }

        console.log('✅ EditTeam: Equipe excluída com sucesso');
        navigate("/team");
      } catch (error) {
        setIsDeleted(false);
        console.error("❌ EditTeam: Erro ao excluir equipe:", error);
        alert("Erro ao excluir equipe. Tente novamente.");
      }
    }
  };

  return (
    <Container>
      {loading ? (
        <LoadingMessage />
      ) : (
        <>
          {teamImage ? (
            <div style={{ position: "relative", display: "inline-block" }}>
              <TeamImage
                src={teamImage}
                alt="Imagem da equipe"
              />
              <EditButton onClick={handleIconClick}>
                <FiEdit size={16} />
              </EditButton>
              <input
                type="file"
                ref={setImageInputRef}
                onChange={handleImageUpload}
                style={{ display: "none" }}
              />
            </div>
          ) : (
            <TeamIcon>
              <button type="button" onClick={handleIconClick}>
                <span>+</span>
              </button>
              <input
                type="file"
                ref={setImageInputRef}
                onChange={handleImageUpload}
                style={{ display: "none" }}
              />
            </TeamIcon>
          )}

          <h2>Editar Equipe</h2>

          <Input
            type="text"
            placeholder="Nome da equipe"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
          />

          <ListsContainer>
            <LeftColumn>
              <h3>Adicionar Corretores</h3>
              <Input
                type="text"
                placeholder="Buscar corretor..."
                value={brokerName}
                onChange={(e) => setBrokerName(e.target.value)}
              />
              <BrokerList>
                {availableBrokers
                  .filter((broker) => {
                    // Filtrar por nome
                    const matchesName = broker.name.toLowerCase().includes(brokerName.toLowerCase());
                    // Filtrar corretores que já estão na equipe
                    const isAlreadyInTeam = brokers.some(b => b.userId === broker.id);
                    // Filtrar corretores que já estão nos convites pendentes
                    const isPendingInvite = pendingInvites.some(invite => invite.userId === broker.id);
                    
                    return matchesName && !isAlreadyInTeam && !isPendingInvite;
                  })
                  .map((broker) => (
                    <BrokerItem key={`available-${broker.id}`}>
                      {broker.name}
                      <AddBrokerButton onClick={() => handleAddBroker(broker)}>
                        <FaPlus />
                      </AddBrokerButton>
                    </BrokerItem>
                  ))}
              </BrokerList>
            </LeftColumn>

            <RightColumn>
              <h3>Corretores Adicionados</h3>
              <AddedBrokerList>
                {brokers.map((broker) => (
                  <BrokerItem key={`broker-${broker.userId}`}>
                    {broker.name}
                    <AddBrokerButton onClick={() => handleRemoveBroker(broker)}>
                      <FaMinus />
                    </AddBrokerButton>
                  </BrokerItem>
                ))}
                {pendingInvites.map((invite) => (
                  <BrokerItem key={`invite-${invite.userId}`}>
                    {invite.name} (Convite Pendente)
                    <AddBrokerButton onClick={() => handleRemovePendingInvite(invite.userId)}>
                      <FaMinus />
                    </AddBrokerButton>
                  </BrokerItem>
                ))}
              </AddedBrokerList>
            </RightColumn>
          </ListsContainer>

          <Button onClick={handleUpdateTeam} disabled={loading}>
            {loading ? "Salvando..." : "Salvar Alterações"}
          </Button>

          <DeleteTeamButton onClick={handleDeleteTeam}>
            Excluir Equipe
          </DeleteTeamButton>
        </>
      )}
    </Container>
  );
};

export default EditTeam;