Entendido. O usuário quer aprimorar a estrutura das etapas, tornando-as mais detalhadas e funcionais, com campos específicos como **Órgão Responsável**, **Setor Responsável**, **Data de Início** e **Previsão de Conclusão**.

Aqui está o plano detalhado para implementar essas mudanças:

### 1. Atualizar o Banco de Dados (Supabase)
Precisamos adicionar novos campos à tabela `project_steps` para armazenar essas informações.
*   `responsible_agency` (text)
*   `responsible_sector` (text)
*   `start_date` (date)
*   `completion_forecast` (date)

Vou criar um arquivo de migração SQL para adicionar essas colunas.

### 2. Atualizar Tipagem (TypeScript)
No arquivo `src/types/index.ts`, vou adicionar esses novos campos à interface `TimelineStep`.

### 3. Atualizar Modais de Criação e Edição
*   **AddStepModal:** Adicionar os novos campos (Dropdowns e Datepickers).
*   **EditStepModal:** Adicionar os mesmos campos para permitir edição.
*   **Validações:** Garantir que a data final não seja anterior à inicial e que campos obrigatórios sejam preenchidos.

### 4. Lógica de "Outro" nos Dropdowns
*   Criar listas pré-definidas para "Órgão" e "Setor".
*   Adicionar lógica para mostrar um input de texto quando a opção "Outro" for selecionada.

### 5. Atualizar Hook `useProjects`
*   Garantir que as funções `addStep` e `updateStep` enviem e recebam esses novos campos do Supabase.

### Plano de Execução:
1.  **SQL:** Criar migração para adicionar colunas.
2.  **Types:** Atualizar interfaces.
3.  **Hooks:** Atualizar `useProjects.ts`.
4.  **UI:** Atualizar `AddStepModal` e `EditStepModal` com os novos campos e validações.

Podemos começar? Vou iniciar criando o arquivo SQL de migração.