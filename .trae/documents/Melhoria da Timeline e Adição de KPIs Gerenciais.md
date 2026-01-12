# Melhorias de UX e Inteligência de Dados

## 1. Timeline Enriquecida (Sua Solicitação)
Vamos adicionar as informações cruciais nas etapas sem perder a elegância minimalista:
*   **Localização Visual:**
    *   **Órgão/Setor:** Será exibido na **Anotação Superior** (linha acima da etapa). Isso evita que o texto brigue com o título da etapa dentro do chevron.
    *   **Data de Previsão:** Será exibida logo abaixo do Título da Etapa, dentro do chevron, com fonte `10px` (bem discreta).
*   **Indicador de Atraso:** Se a data prevista já passou e a etapa não foi concluída, a data ficará vermelha para alertar o gestor.

## 2. Dashboard KPIs (Minha Sugestão)
Adicionaremos uma seção de indicadores no topo do Dashboard para visão macro:
*   **Cards de Resumo:**
    *   Total de Projetos Ativos.
    *   Projetos Concluídos (%).
    *   Próximas Entregas (Projetos perto do fim).
*   Isso transforma a tela de uma "lista" para um verdadeiro "painel de controle".

## Passos Técnicos:
1.  **Atualizar `Timeline.tsx`:** Alterar o layout do `SortableStep` para renderizar data e órgão.
2.  **Atualizar `Dashboard.tsx`:** Criar a lógica de cálculo dos KPIs e renderizar os cards no topo.
3.  **Verificação:** Garantir que os dados estão vindo corretamente do banco (hook `useProjects`).