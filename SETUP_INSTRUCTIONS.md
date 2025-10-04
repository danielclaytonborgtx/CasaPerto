# 🚀 Instruções de Configuração - CasaPerto com Supabase

## ⚠️ IMPORTANTE: Configure as Variáveis de Ambiente

Para resolver o erro de CORS e usar o Supabase, você precisa configurar as variáveis de ambiente:

### 1. Criar arquivo `.env` na raiz do projeto

Crie um arquivo chamado `.env` na pasta raiz do projeto (mesmo nível do `package.json`) com o seguinte conteúdo:

```env
VITE_SUPABASE_URL=sua_url_do_supabase_aqui
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase_aqui
VITE_GOOGLE_MAPS_API_KEY=sua_chave_google_maps_aqui
```

### 2. Obter as credenciais do Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Faça login na sua conta
3. Crie um novo projeto ou acesse um existente
4. Vá para **Settings** → **API**
5. Copie:
   - **Project URL** → use como `VITE_SUPABASE_URL`
   - **anon public** key → use como `VITE_SUPABASE_ANON_KEY`

### 3. Configurar o banco de dados

1. No painel do Supabase, vá para **SQL Editor**
2. Copie todo o conteúdo do arquivo `supabase-schema.sql`
3. Cole no editor e clique em **Run**
4. Aguarde a execução (deve mostrar "Success")

### 4. Configurar Storage

1. Vá para **Storage** no painel do Supabase
2. Verifique se o bucket `images` foi criado
3. Se não existir, crie manualmente:
   - Clique em "New bucket"
   - **Name**: `images`
   - **Public bucket**: ✅ (marcado)

### 5. Reiniciar o servidor

Após configurar as variáveis de ambiente:

```bash
# Pare o servidor (Ctrl+C)
# Reinicie o servidor
npm run dev
```

## 🔧 Solução de Problemas

### Erro de CORS
- ✅ **RESOLVIDO**: O Supabase não tem problemas de CORS
- ✅ **RESOLVIDO**: Todas as páginas foram atualizadas para usar Supabase

### Erro "Cannot read properties of undefined"
- Verifique se as variáveis de ambiente estão configuradas
- Reinicie o servidor após configurar o `.env`

### Erro de autenticação
- Verifique se o schema SQL foi executado corretamente
- Confirme se as políticas RLS estão ativas

## 📋 Checklist de Migração

- [x] ✅ Instalar dependências do Supabase
- [x] ✅ Criar serviços do Supabase
- [x] ✅ Atualizar SignUp para Supabase
- [x] ✅ Atualizar SignIn para Supabase  
- [x] ✅ Atualizar Profile para Supabase
- [x] ✅ Atualizar PropertyDetails para Supabase
- [x] ✅ Atualizar Team para Supabase
- [x] ✅ Atualizar Home para Supabase
- [x] ✅ Atualizar AddProperty para Supabase
- [ ] ⏳ **PENDENTE**: Configurar variáveis de ambiente
- [ ] ⏳ **PENDENTE**: Executar schema SQL
- [ ] ⏳ **PENDENTE**: Testar funcionalidades

## 🎯 Próximos Passos

1. **Configure o `.env`** com suas credenciais do Supabase
2. **Execute o schema SQL** no painel do Supabase
3. **Reinicie o servidor** (`npm run dev`)
4. **Teste o cadastro** de um novo usuário
5. **Teste o login** com o usuário criado
6. **Teste as funcionalidades** principais

## 🆘 Precisa de Ajuda?

Se encontrar problemas:

1. **Verifique o console** do navegador para erros
2. **Confirme as variáveis** de ambiente estão corretas
3. **Teste a conexão** com o Supabase no painel
4. **Verifique os logs** do Supabase

---

**🎉 Após seguir estes passos, seu CasaPerto estará rodando 100% no Supabase!**
