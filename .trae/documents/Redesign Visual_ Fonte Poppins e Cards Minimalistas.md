Entendido. Vou reformular o visual da aplicação focando em um design mais limpo, profissional e moderno ("Lucide style"), e alterar a tipografia para **Poppins**.

### Plano de Redesign Visual

#### 1. Tipografia (Poppins)
*   Adicionar a fonte **Poppins** ao projeto (via Google Fonts no `index.html`).
*   Configurar o Tailwind CSS para usar Poppins como fonte padrão (`sans`).

#### 2. Componente `ProjectCard` (Redesign)
*   **Remover Imagem de Fundo:** Eliminar o uso da imagem de background que está "sujando" o visual.
*   **Novo Estilo:**
    *   Card branco com sombra suave (`shadow-sm` -> `hover:shadow-md`).
    *   Borda sutil (`border-slate-100`).
    *   Ícone representativo do projeto em destaque (usando Lucide Icons, ex: `Building`, `Road`, `Leaf` dependendo do contexto ou um genérico elegante).
    *   Barra de progresso mais moderna e minimalista.
    *   Status com badges coloridos (pílulas) com cores suaves (bg-green-50 text-green-700).
    *   Tipografia hierárquica clara (Título em negrito, descrição em cinza mais claro).

#### 3. Melhorias Gerais na UI (Dashboard e Detalhes)
*   **Dashboard:**
    *   Melhorar o espaçamento e alinhamento do cabeçalho.
    *   Refinar os botões de filtro (Ativos/Arquivados) para parecerem mais com "tabs" modernas ou pílulas de seleção.
    *   Input de busca mais limpo.
*   **Cores:** Manter a paleta Emerald/Slate, mas usar tons mais "frios" e profissionais para o fundo (`bg-slate-50` já está bom, mas podemos limpar os elementos decorativos de fundo se estiverem poluindo).

### Plano de Ação:
1.  **Fonte:** Atualizar `index.html` e `tailwind.config.js` para Poppins.
2.  **Card:** Reescrever `src/components/dashboard/ProjectCard.tsx` com o novo design minimalista.
3.  **Dashboard:** Refinar o layout do `Dashboard.tsx` para acompanhar a nova linguagem visual.

Vou começar configurando a fonte e depois ataco o Card.