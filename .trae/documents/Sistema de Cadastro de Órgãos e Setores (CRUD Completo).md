Entendido. O objetivo é criar um cadastro completo e dinâmico para "Órgãos Responsáveis" e "Setores Responsáveis", substituindo as listas estáticas que temos hoje por tabelas no banco de dados.

### Plano de Implementação

#### 1. Banco de Dados (Supabase)
Criarei duas novas tabelas para armazenar essas informações de forma estruturada:
*   `agencies` (id, name, created_at)
*   `sectors` (id, name, created_at)

Também criarei um script SQL para criar essas tabelas e inserir alguns dados iniciais.

#### 2. Hooks e Serviços
Vou criar hooks específicos para gerenciar esses dados:
*   `useAgencies`: Para buscar, adicionar, editar e excluir órgãos.
*   `useSectors`: Para buscar, adicionar, editar e excluir setores.

#### 3. Componentes de UI
*   **Página de Configurações (Settings):** Uma nova página onde o usuário poderá gerenciar (CRUD) essas listas.
*   **Atualização dos Modais (AddStep/EditStep):**
    *   Substituir as listas fixas (hardcoded) por dados vindos dos hooks `useAgencies` e `useSectors`.
    *   Implementar a lógica de "Adicionar Novo" diretamente no dropdown: Se o usuário digitar algo que não existe ou selecionar "Adicionar Novo", abrir um pequeno input ou modal para cadastrar na hora.

#### 4. Validações e UX
*   Garantir que não haja duplicidade de nomes.
*   Feedback visual (loading, sucesso, erro).
*   Confirmação antes de excluir.

### Plano de Ação:
1.  **SQL:** Criar script de migração para tabelas `agencies` e `sectors`.
2.  **Hooks:** Criar `src/hooks/useSettings.ts` (ou similar) para gerenciar o CRUD dessas entidades.
3.  **UI Settings:** Criar página `/settings` para gerenciamento administrativo.
4.  **Integração:** Atualizar `AddStepModal` e `EditStepModal` para usar os dados dinâmicos.

Podemos começar criando as tabelas no banco? Vou preparar o script SQL.