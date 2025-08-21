# Relatório de Análise e Correções para Investpro

## Introdução

Este relatório detalha os problemas identificados no projeto Investpro, especificamente em relação ao cadastro de usuários no Supabase e à exibição de informações no painel administrativo. As correções propostas visam garantir que todos os dados do usuário sejam salvos corretamente e que o painel administrativo reflita as informações de saldo de forma precisa.

## Problemas Identificados

### 1. Inconsistência na Estrutura do Banco de Dados e Mapeamento de Dados

O projeto possui dois arquivos de configuração do Supabase (`supabase_setup.sql` e `supabase_setup_fixed.sql`), que definem estruturas de tabela e lógicas de inserção de usuário diferentes. O arquivo `supabase_setup.sql` utiliza uma tabela `users` com campos limitados (`full_name`, `cpf`, `phone`), enquanto o `supabase_setup_fixed.sql` utiliza uma tabela `profiles` mais completa, com campos como `username`, `name`, `email`, `balance`, `monthly_profit`, e `accumulated_profit`.

O `RegisterPage.jsx` tenta enviar `full_name`, `cpf`, e `phone` via `options.data` no `supabase.auth.signUp`. No entanto, a função `handle_new_user` no `supabase_setup.sql` espera `raw_user_meta_data->>'full_name'`, `raw_user_meta_data->>'cpf'`, e `raw_user_meta_data->>'phone'`. Se a tabela `users` estiver sendo usada e o mapeamento não for exato ou se o `raw_user_meta_data` não estiver sendo preenchido corretamente pelo Supabase, esses campos podem ficar como `NULL`.

O `supabase_setup_fixed.sql` tenta resolver isso, mas a função `handle_new_user` nele mapeia `NEW.raw_user_meta_data->>'name'` e `NEW.raw_user_meta_data->>'username'` para os campos `name` e `username` da tabela `profiles`, e não `full_name`, `cpf` e `phone` que são enviados pelo frontend. Isso causa a inconsistência onde `username`, `cpf`, `phone`, `balance`, `monthly_profit` e `accumulated_profit` ficam como `NULL` na tabela `profiles`.

### 2. Painel Administrativo e Sincronização de Dados

O `AdminPanel.jsx` tenta carregar usuários através de uma API (`/api/users`) e atualizar lucros (`/api/users/:id`). Isso sugere que há um backend intermediário (provavelmente em Python, dado o `requirements.txt` e a estrutura de pastas) que se comunica com o Supabase. O problema de `monthly_profit` e `accumulated_profit` não refletirem no painel ADM pode ser devido a:

*   **Mapeamento incorreto:** O backend pode não estar lendo ou escrevendo esses campos corretamente da tabela `profiles` (ou `users`).
*   **Ausência de atualização:** O painel pode não estar sendo atualizado após as alterações no Supabase, ou o backend não está enviando os dados atualizados para o frontend.
*   **RLS (Row Level Security):** Políticas de RLS no Supabase podem estar impedindo o acesso ou a atualização desses campos pelo backend ou pelo próprio painel.
*   **Dados iniciais:** Os campos `balance`, `monthly_profit`, e `accumulated_profit` na tabela `profiles` (`supabase_setup_fixed.sql`) têm valores `DEFAULT 0.00`. Se o frontend ou o backend não os preencherem explicitamente no momento da criação do perfil, eles permanecerão com esses valores padrão, e o painel pode não ter a lógica para exibi-los corretamente se forem `NULL` ou `0`.

## Lista de Correções Necessárias

Para resolver os problemas identificados, as seguintes correções são necessárias:

### 1. Padronização da Estrutura do Banco de Dados

*   **Escolher e aplicar um script:** Decida qual script SQL (`supabase_setup.sql` ou `supabase_setup_fixed.sql`) será o definitivo para a configuração do Supabase. Recomenda-se usar o `supabase_setup_fixed.sql` por ser mais completo e já incluir campos como `balance`, `monthly_profit`, `accumulated_profit`, e `is_admin`.
*   **Garantir a execução:** Certifique-se de que o script escolhido seja executado corretamente no seu projeto Supabase, criando a tabela `profiles` (ou `users`) com todos os campos necessários e as políticas de RLS adequadas.

### 2. Ajustes no Cadastro de Usuários (frontend/src/components/RegisterPage.jsx)

*   **Mapeamento de dados:** A função `handle_new_user` no `supabase_setup_fixed.sql` espera `name` e `username` no `raw_user_meta_data`. O `RegisterPage.jsx` envia `full_name`, `cpf`, e `phone`. É preciso ajustar o `options.data` no `supabase.auth.signUp` para corresponder aos campos esperados pela função `handle_new_user` no Supabase.

    **Correção Sugerida para `RegisterPage.jsx`:**

    ```javascript
    // ... dentro de handleSubmit
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          name: formData.fullName, // Mapear fullName para name
          username: formData.email.split('@')[0], // Gerar um username simples do email
          // Outros dados que você queira passar para raw_user_meta_data, se necessário
          // Ex: cpf: formData.cpf.replace(/\D/g, ""),
          // Ex: phone: formData.phone.replace(/\D/g, ""),
        }
      }
    });
    // ...
    ```

*   **Atualização da função `handle_new_user` (no Supabase):** A função `handle_new_user` no `supabase_setup_fixed.sql` precisa ser modificada para receber e inserir `cpf` e `phone` na tabela `profiles` se esses dados forem passados via `raw_user_meta_data`.

    **Correção Sugerida para `handle_new_user` no Supabase:**

    ```sql
    CREATE OR REPLACE FUNCTION public.handle_new_user()
    RETURNS TRIGGER AS $$
    BEGIN
      INSERT INTO public.profiles (id, email, name, username, phone, cpf)
      VALUES (
        NEW.id, 
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>
'name', NEW.email),
        COALESCE(NEW.raw_user_meta_data->>
'username', NEW.email),
        NEW.raw_user_meta_data->>
'phone', -- Adicionar phone
        NEW.raw_user_meta_data->>
'cpf'    -- Adicionar cpf
      );
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;
    ```

    **Alternativa:** Se o `cpf` e `phone` não forem passados via `raw_user_meta_data` no `signUp`, eles precisarão ser inseridos em uma etapa posterior, talvez após o login inicial, usando uma função `supabase.from('profiles').update(...)`.

### 3. Verificação e Ajustes no Backend (API)

*   **Endpoints de Usuários:** Verifique o código do backend (provavelmente em `src/` ou `api/` no seu projeto) que lida com os endpoints `/api/users` e `/api/users/:id`.
    *   **Leitura de Dados:** Garanta que o backend esteja lendo todos os campos necessários (`username`, `name`, `email`, `phone`, `cpf`, `balance`, `monthly_profit`, `accumulated_profit`, `is_admin`, `status`) da tabela `profiles` do Supabase.
    *   **Escrita de Dados:** Certifique-se de que, ao atualizar um usuário (via PUT para `/api/users/:id`), o backend esteja enviando corretamente os valores de `monthly_profit` e `accumulated_profit` para o Supabase. O backend deve usar a API do Supabase para atualizar esses campos na tabela `profiles`.

### 4. Ajustes no Painel Administrativo (frontend/src/components/AdminPanel.jsx)

*   **Atualização de Lucros:** O `AdminPanel.jsx` já possui a lógica para `updateAllProfits`. O problema pode estar na forma como esses dados são persistidos no Supabase via backend. Certifique-se de que o backend esteja recebendo e aplicando essas atualizações corretamente.
*   **Exibição de Dados:** Verifique se os campos `balance`, `monthly_profit`, e `accumulated_profit` estão sendo exibidos corretamente na tabela de usuários do painel. Se eles estiverem vindo como `NULL` ou `0` do backend, a correção principal será no backend e na configuração do Supabase.

### 5. RLS (Row Level Security) no Supabase

*   **Políticas de Admin:** O `supabase_setup_fixed.sql` já inclui políticas de RLS para administradores. Certifique-se de que o usuário que acessa o painel administrativo tenha o `is_admin` definido como `true` na tabela `profiles` e que as políticas de RLS estejam ativas e corretas para permitir que administradores visualizem e editem todos os perfis.

## Recomendações Adicionais

*   **Variáveis de Ambiente:** Verifique se as variáveis de ambiente do Supabase (URL e `anon_key`) estão configuradas corretamente no seu projeto frontend e backend.
*   **Logs do Supabase:** Monitore os logs do Supabase para identificar erros nas funções de banco de dados (triggers, RLS) ou nas chamadas de API.
*   **Testes Abrangentes:** Após aplicar as correções, realize testes completos de cadastro de novos usuários, login, e manipulação de dados no painel administrativo para garantir que todos os fluxos funcionem como esperado.

Espero que esta análise detalhada e as correções propostas ajudem a resolver os problemas do seu projeto Investpro. Se precisar de mais detalhes ou assistência em alguma etapa específica, por favor, me informe.

