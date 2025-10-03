# Guia de Migração: Render API → Supabase

Este guia te ajudará a migrar o projeto CasaPerto do Render para o Supabase.

## 📋 Pré-requisitos

1. Conta no Supabase (gratuita)
2. Node.js instalado
3. Projeto CasaPerto configurado

## 🚀 Passo a Passo

### 1. Configurar Projeto Supabase

1. Acesse [supabase.com](https://supabase.com) e faça login
2. Clique em "New Project"
3. Escolha sua organização
4. Preencha:
   - **Name**: `casaperto-db`
   - **Database Password**: (anote esta senha!)
   - **Region**: escolha a mais próxima do Brasil
5. Clique em "Create new project"
6. Aguarde a criação (pode levar alguns minutos)

### 2. Configurar Banco de Dados

1. No painel do Supabase, vá para **SQL Editor**
2. Copie todo o conteúdo do arquivo `supabase-schema.sql`
3. Cole no editor SQL e clique em **Run**
4. Aguarde a execução (deve mostrar "Success")

### 3. Configurar Storage

1. No painel do Supabase, vá para **Storage**
2. Verifique se o bucket `images` foi criado
3. Se não existir, crie manualmente:
   - Clique em "New bucket"
   - **Name**: `images`
   - **Public bucket**: ✅ (marcado)

### 4. Configurar Variáveis de Ambiente

1. No painel do Supabase, vá para **Settings** → **API**
2. Copie os valores:
   - **Project URL** (será sua `VITE_SUPABASE_URL`)
   - **anon public** key (será sua `VITE_SUPABASE_ANON_KEY`)

3. Crie um arquivo `.env` na raiz do projeto:
```env
VITE_SUPABASE_URL=sua_url_aqui
VITE_SUPABASE_ANON_KEY=sua_chave_aqui
VITE_GOOGLE_MAPS_API_KEY=sua_chave_google_maps
```

### 5. Instalar Dependências

```bash
npm install @supabase/supabase-js
```

### 6. Testar a Migração

1. Execute o projeto:
```bash
npm run dev
```

2. Teste as funcionalidades:
   - ✅ Login/Logout
   - ✅ Adicionar imóvel
   - ✅ Visualizar imóveis
   - ✅ Mapa
   - ✅ Equipes
   - ✅ Mensagens

## 🔧 Configurações Adicionais

### Autenticação

O Supabase usa email/senha por padrão. Para usar CRECI como username:

1. Vá para **Authentication** → **Settings**
2. Desabilite "Enable email confirmations" se necessário
3. Configure as políticas RLS conforme o schema

### Storage

Para otimizar o upload de imagens:

1. Vá para **Storage** → **Policies**
2. Verifique se as políticas foram criadas corretamente
3. Teste o upload de uma imagem

### Backup

1. Vá para **Settings** → **Database**
2. Configure backups automáticos
3. Exporte dados se necessário

## 🐛 Solução de Problemas

### Erro de CORS
- Verifique se as URLs estão corretas no `.env`
- Limpe o cache do navegador

### Erro de RLS (Row Level Security)
- Verifique se as políticas foram criadas
- Teste com um usuário autenticado

### Imagens não carregam
- Verifique se o bucket `images` existe
- Confirme as políticas do Storage
- Teste a URL pública manualmente

### Performance lenta
- Adicione índices conforme necessário
- Use paginação para listas grandes
- Otimize queries com `select` específico

## 📊 Monitoramento

1. **Dashboard**: Monitore uso de recursos
2. **Logs**: Verifique erros em tempo real
3. **Metrics**: Acompanhe performance
4. **Alerts**: Configure notificações

## 🔄 Rollback (se necessário)

Se precisar voltar ao Render:

1. Mantenha o código antigo em uma branch
2. Reverta as mudanças nos serviços
3. Restaure as URLs da API antiga
4. Teste todas as funcionalidades

## 📈 Próximos Passos

Após a migração bem-sucedida:

1. **Otimize queries** com índices específicos
2. **Configure backups** automáticos
3. **Monitore performance** regularmente
4. **Atualize documentação** da API
5. **Treine a equipe** nas novas ferramentas

## 🆘 Suporte

- **Documentação Supabase**: [docs.supabase.com](https://docs.supabase.com)
- **Comunidade**: [github.com/supabase/supabase](https://github.com/supabase/supabase)
- **Discord**: [discord.supabase.com](https://discord.supabase.com)

---

✅ **Migração concluída com sucesso!**

O CasaPerto agora está rodando no Supabase com melhor performance, escalabilidade e recursos avançados.
