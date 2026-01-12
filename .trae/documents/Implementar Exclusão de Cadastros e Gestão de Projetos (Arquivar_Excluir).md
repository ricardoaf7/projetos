Entendido. Vou implementar as funcionalidades de Exclusão de Órgãos/Setores e o Gerenciamento de Projetos (Arquivar/Excluir).

### Plano de Implementação

#### 1. Exclusão de Órgãos e Setores
A funcionalidade básica de exclusão já foi implementada no frontend (`SettingsPage.tsx`) e no hook (`useSettings.ts`), mas precisamos garantir a integridade referencial no banco de dados.
*   **Ação:** Verificar e ajustar as constraints no banco de dados para impedir a exclusão de órgãos/setores que estejam em uso por alguma etapa de projeto, ou definir uma política (ex: `ON DELETE SET NULL` ou `ON DELETE RESTRICT`). Como os campos na tabela `project_steps` são TEXT e não Foreign Keys estritas para `agencies` e `sectors` (baseado no que vi até agora, salvamos o nome), a exclusão física na tabela de domínio não quebraria o banco, mas deixaria o dado histórico órfão.
*   **Melhoria:** Implementar uma verificação no hook `deleteAgency`/`deleteSector` para avisar se o registro está em uso antes de excluir.

#### 2. Gerenciamento de Projetos (Arquivar/Excluir)
*   **Backend (Supabase):**
    *   Adicionar campo `status` na tabela `projects` (se não existir) com valores: `'active'`, `'archived'`.
    *   Para exclusão: Garantir que ao excluir um projeto, todas as `project_steps` vinculadas sejam excluídas também (`ON DELETE CASCADE`).
*   **Frontend (Dashboard):**
    *   Adicionar menu de contexto (três pontinhos) ou botões em cada card de projeto.
    *   **Arquivar:** Atualiza o status para `archived`.
    *   **Excluir:** Modal de confirmação -> Remove do banco.
    *   Criar filtro/aba no Dashboard para visualizar "Ativos" vs "Arquivados".

#### 3. Logs de Auditoria (Audit Logs)
*   Criar tabela `audit_logs` (action, entity, entity_id, user_id, timestamp, details).
*   Criar função utilitária `logAction` para registrar essas operações.

### Plano de Ação Detalhado:

1.  **Banco de Dados:**
    *   Criar migração para tabela `audit_logs`.
    *   Adicionar coluna `status` em `projects` (default 'active').
    *   Garantir `ON DELETE CASCADE` nas FKs de steps.
2.  **Hooks:**
    *   Atualizar `useProjects` para suportar `archiveProject` e `deleteProject`.
    *   Criar `useAudit` (ou integrar no `useProjects`) para registrar logs.
3.  **UI - Dashboard:**
    *   Implementar abas "Ativos" / "Arquivados".
    *   Adicionar botões de ação nos cards.
    *   Modais de confirmação.
4.  **UI - Settings:**
    *   Refinar a exclusão para verificar uso antes de deletar (opcional, mas recomendado para integridade).

Vou começar criando as migrações SQL necessárias.