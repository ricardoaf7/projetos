Entendido. O usuário quer implementar um gerenciamento completo de etapas, incluindo **Edição**, **Exclusão** e **Reordenação** (Drag & Drop), tudo em tempo real.

Aqui está o plano detalhado para implementar essas funcionalidades:

### 1. Atualizar o Hook `useProjects` (Lógica e Dados)
Precisamos adicionar novas funções ao nosso hook para lidar com as operações no Supabase:
*   `updateStep(stepId, data)`: Para editar título, status e anotações.
*   `deleteStep(stepId)`: Para remover uma etapa.
*   `reorderSteps(steps)`: Para salvar a nova ordem (`order_index`) após o drag & drop.

### 2. Implementar Edição e Exclusão (Interface)
Vamos criar um novo componente `EditStepModal` (ou adaptar o `AddStepModal` para ser reutilizável).
*   Ao clicar em uma etapa na Timeline, abrirá esse modal.
*   Botão de "Salvar" para atualizar.
*   Botão de "Excluir" (com confirmação) para remover.

### 3. Implementar Drag & Drop (Reordenação)
Para isso, vou usar a biblioteca `dnd-kit` (moderna e leve) ou `react-beautiful-dnd` (clássica).
*   A Timeline deixará de ser apenas uma lista estática e passará a ser uma lista ordenável.
*   Ao soltar o item, chamaremos a função `reorderSteps` para atualizar os índices no banco.

### Plano de Execução:
1.  **Instalar dependências:** `npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities` (Vou usar dnd-kit por ser mais moderna e flexível).
2.  **Atualizar `useProjects.ts`:** Adicionar funções `updateStep`, `deleteStep` e `reorderSteps`.
3.  **Refatorar `Timeline.tsx`:** Tornar os itens arrastáveis e clicáveis para edição.
4.  **Criar `EditStepModal.tsx`:** Modal para editar e excluir.

Podemos começar? Vou começar instalando as dependências.