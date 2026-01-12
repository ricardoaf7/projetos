O erro de build na Vercel indica que as propriedades `responsibleAgency`, `responsibleSector`, `startDate` e `completionForecast` estão sendo passadas para as funções `onSave` (em `AddStepModal`) e `onSave` (em `EditStepModal`), mas a tipagem dessas funções nos componentes pais (onde são definidas as interfaces `Props`) ainda não espera esses campos opcionais.

Basicamente, atualizei o código dentro do componente, mas a interface que define o que a função `onSave` aceita ficou desatualizada ou incompleta na definição dos props.

**O Problema:**
*   Em `AddStepModal.tsx`, a interface `AddStepModalProps` define `onSave` aceitando apenas `{ title, status, topAnnotation, bottomAnnotation }`.
*   Em `EditStepModal.tsx`, acontece o mesmo com `EditStepModalProps`.
*   Mas no código, estamos chamando `onSave` passando também `responsibleAgency`, `startDate`, etc. O TypeScript reclama porque estamos passando "coisas a mais" do que o contrato permite.

**A Solução:**
Vou atualizar as interfaces `AddStepModalProps` e `EditStepModalProps` para incluir os novos campos opcionais na definição da função `onSave`.

**Plano:**
1.  Corrigir `src/components/timeline/AddStepModal.tsx`: Adicionar campos novos na interface `AddStepModalProps`.
2.  Corrigir `src/components/timeline/EditStepModal.tsx`: Adicionar campos novos na interface `EditStepModalProps`.
3.  Enviar a correção para o GitHub.

Vamos corrigir isso agora mesmo!