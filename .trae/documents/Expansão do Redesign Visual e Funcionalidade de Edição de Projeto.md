Fico feliz que tenha gostado! Vamos expandir essa identidade visual para todo o sistema. <mccoremem id="03fe51uog0ud48frqgjdos0yc" />

### Plano de Redesign Geral e Melhorias Funcionais

Vou trabalhar em três frentes principais para alinhar o restante da aplicação com o novo padrão da Dashboard:

#### 1. Página "Novo Projeto" (`/new-project`) - *Pendente*
*   **Ação:** Criar esta página do zero (ainda não existe).
*   **Design:** Formulário limpo, card centralizado, input fields com design moderno (bordas suaves, foco sutil).
*   **Funcionalidade:** Conectar ao `useProjects` para criar o projeto no Supabase.

#### 2. Página "Detalhes do Projeto" (`ProjectDetails.tsx`) - *Redesign*
*   **Visual:**
    *   Remover cabeçalhos gigantes/hero images pesadas se houver.
    *   Adotar o cabeçalho branco minimalista igual ao da Dashboard ou Settings.
    *   Reduzir tamanhos de fonte de títulos (H1 -> H2/H3 visualmente) para ficar mais "elegante". <mccoremem id="03fe51uog0ud48frqgh5cypfg" />
*   **Funcionalidade Nova:**
    *   Adicionar botão/ícone de **"Editar"** ao lado do título do projeto.
    *   Permitir editar **Nome** e **Descrição** inline ou via modal simples.
    *   Atualizar o hook `useProjects` com função `updateProjectDetails`.

#### 3. Modais "Editar Etapas" (`AddStepModal` e `EditStepModal`) - *Redesign*
*   **Visual:**
    *   Padronizar com o estilo dos cards: fundo branco, sombras suaves, inputs com bordas `slate-200`.
    *   Botões de ação (Salvar/Cancelar) com cores sólidas e design "pill" (arredondado).

#### 4. Timeline (`Timeline.tsx`) - *Refinamento*
*   Ajustar a tipografia da timeline para usar Poppins e tamanhos menores/mais delicados.
*   Melhorar o visual dos cards de etapa (drag & drop) para serem menos "brutos".

### Plano de Execução Sequencial:

1.  **Hooks:** Adicionar `updateProject` no `useProjects.ts`.
2.  **Página Novo Projeto:** Criar `src/pages/NewProject.tsx` e adicionar rota.
3.  **Página Detalhes:** Refatorar `ProjectDetails.tsx` (visual + edição de título/descrição).
4.  **Componentes:** Refinar visual da `Timeline` e Modais.

Vou começar criando a funcionalidade de edição e a página de novo projeto, aplicando o visual novo.