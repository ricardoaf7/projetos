A integração com o **Supabase** deve ser feita **primeiro**.

**Por que?**
Se criarmos a tela de "Criar Projeto" agora sem o banco de dados, teremos que criar uma lógica falsa (mock) para salvar os dados temporariamente na memória. Depois, teríamos que jogar tudo fora e refazer a lógica para conectar com o Supabase. Começando pelo Supabase, o botão "Salvar" já funcionará de verdade.

### Plano de Execução (Sugerido)

**Fase 1: Infraestrutura de Dados (Supabase)**
1.  Instalar a biblioteca do Supabase (`@supabase/supabase-js`).
2.  Configurar a conexão em `src/lib/supabase.ts`.
3.  Fornecer o código **SQL** para você rodar no painel do Supabase e criar as tabelas (`projects` e `project_steps`).
4.  Criar um script ou função para "popular" o banco com os dados fictícios que já criamos (para o dashboard não ficar vazio).

**Fase 2: Conexão e Visualização**
1.  Substituir o arquivo `mockData.ts` por chamadas reais ao banco de dados.
2.  Atualizar o **Dashboard** para carregar a lista de projetos do Supabase.

**Fase 3: Novas Funcionalidades (O que você pediu)**
1.  **Botão "Novo Projeto":** Adicionar um botão de destaque no Dashboard.
2.  **Modal/Página de Criação:** Criar o formulário para inserir Título, Descrição e Prazo.
3.  **Ajuste de Listagem:** Se você achou que o Grid de Cards não é suficiente como "lista", posso adicionar uma opção de visualização em **Tabela/Lista** (toggle view) no Dashboard.

---

### O que preciso de você agora:
Para prosseguir com a Fase 1, você precisa ter um projeto criado no Supabase.
Você já tem o **Supabase URL** e a **Anon Key**?
*   **Se sim:** Por favor, me forneça (ou crie um arquivo `.env` na raiz com `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`).
*   **Se não:** Posso te guiar em como criar o projeto lá rapidinho.

Podemos seguir com esse plano?