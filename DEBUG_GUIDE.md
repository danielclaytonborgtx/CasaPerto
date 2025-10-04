# 🐛 Guia de Debug - Criação de Usuário

## 📋 Logs Adicionados

Adicionei logs detalhados em todo o processo de criação de usuário para ajudar a identificar o problema.

### 🔍 Como usar os logs:

1. **Abra o Console do Navegador** (F12 → Console)
2. **Tente criar um usuário**
3. **Observe os logs** que aparecem no console
4. **Copie os logs** e me envie para análise

## 📊 Logs que você verá:

### ✅ **Se tudo estiver funcionando:**
```
🔧 Configuração do Supabase:
📍 URL: ✅ Configurada
🔑 Anon Key: ✅ Configurada
🎯 Iniciando processo de cadastro...
📋 Dados do formulário: {name: "...", email: "...", ...}
✅ Validações passaram, iniciando cadastro...
🔄 Chamando supabaseAuth.signUp...
🚀 Iniciando processo de registro...
📝 Dados recebidos: {...}
🔍 Verificando se usuário já existe...
✅ Usuário não existe, prosseguindo...
🔐 Criando usuário no Supabase Auth...
📊 Resposta do Supabase Auth: {...}
✅ Usuário criado no Auth, criando registro na tabela users...
📊 Resposta da criação na tabela users: {...}
✅ Usuário criado com sucesso!
📊 Resultado do signUp: {...}
✅ Usuário criado com sucesso!
```

### ❌ **Se houver problemas:**

**Problema 1 - Variáveis não configuradas:**
```
🔧 Configuração do Supabase:
📍 URL: ❌ Não configurada
🔑 Anon Key: ❌ Não configurada
❌ Variáveis de ambiente do Supabase não configuradas!
```

**Problema 2 - Usuário já existe:**
```
❌ Usuário já existe: {id: 1, email: "...", username: "..."}
```

**Problema 3 - Erro no Supabase Auth:**
```
❌ Erro ao criar usuário no Auth: [mensagem de erro]
```

**Problema 4 - Erro na tabela users:**
```
❌ Erro ao criar dados do usuário na tabela: [mensagem de erro]
```

## 🔧 Possíveis Soluções:

### 1. **Variáveis de ambiente não configuradas**
- Crie o arquivo `.env` na raiz do projeto
- Adicione as variáveis do Supabase
- Reinicie o servidor

### 2. **Schema não executado**
- Execute o arquivo `supabase-schema.sql` no painel do Supabase
- Verifique se as tabelas foram criadas

### 3. **Políticas RLS bloqueando**
- Verifique as políticas no painel do Supabase
- Teste com políticas temporariamente desabilitadas

### 4. **Email já cadastrado**
- Tente com um email diferente
- Verifique se o usuário já existe no painel

## 📝 Para me ajudar a debugar:

1. **Copie TODOS os logs** do console
2. **Me envie a mensagem de erro** exata
3. **Confirme se o arquivo .env existe** e tem as variáveis corretas
4. **Verifique se executou o schema SQL** no Supabase

## 🚀 Teste Rápido:

1. Abra o console (F12)
2. Tente criar um usuário
3. Copie os logs que aparecem
4. Me envie os logs para análise

---

**💡 Dica:** Os logs estão organizados com emojis para facilitar a identificação de cada etapa do processo!
