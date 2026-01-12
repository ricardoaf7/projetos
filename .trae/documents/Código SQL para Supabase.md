Aqui está o código SQL completo. Copie e cole no **SQL Editor** do seu projeto "projetos" no Supabase:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  progress INTEGER DEFAULT 0,
  image_url TEXT,
  current_responsible TEXT,
  current_deadline TEXT,
  current_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create project_steps table
CREATE TABLE project_steps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  status TEXT CHECK (status IN ('completed', 'in-progress', 'pending')),
  is_current BOOLEAN DEFAULT FALSE,
  top_annotation TEXT,
  bottom_annotation TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert Seed Data (Mock Data)

-- Project 1: Revitalização do Lago Municipal
DO $$
DECLARE
  p_id UUID;
BEGIN
  INSERT INTO projects (title, description, progress, image_url, current_responsible, current_deadline, current_notes)
  VALUES (
    'Revitalização do Lago Municipal',
    'Projeto de reurbanização completa da orla do lago, incluindo ciclovias e áreas de lazer.',
    45,
    'https://images.unsplash.com/photo-1581094794329-cd8119604f8b?auto=format&fit=crop&q=80&w=1000',
    'Arq. Mariana Silva (IPPUL)',
    '15/11/2023',
    'Aguardando ajustes na análise de tráfego solicitada na última reunião.'
  ) RETURNING id INTO p_id;

  INSERT INTO project_steps (project_id, title, status, is_current, top_annotation, bottom_annotation, order_index) VALUES
  (p_id, 'Demanda', 'completed', false, 'Consulta Prévia Empresa Fácil PR', 'Processo SEI "IPPUL: Análise de EIV"', 1),
  (p_id, 'Instrução', 'completed', false, 'Emitido pelo IPPUL', NULL, 2),
  (p_id, 'Termo de Referência', 'completed', false, NULL, NULL, 3),
  (p_id, 'Entrega do EIV', 'completed', false, NULL, 'No prazo de 180 dias', 4),
  (p_id, 'Revisão do EIV', 'in-progress', true, 'Revisão de conteúdo pelo IPPUL', NULL, 5),
  (p_id, 'Publicação do EIV', 'pending', false, NULL, 'No site do IPPUL', 6),
  (p_id, 'Análise do EIV', 'pending', false, 'Análise dos impactos e medidas', NULL, 7),
  (p_id, 'Pareceres', 'pending', false, NULL, 'IPPUL, CMPGT e órgãos relacionados', 8),
  (p_id, 'Diretriz de EIV', 'pending', false, 'Emitida pelo IPPUL, indicando viabilidade', NULL, 9),
  (p_id, 'Termo de Compromisso', 'pending', false, NULL, 'Assinado pelo interessado', 10),
  (p_id, 'Execução de Medidas', 'pending', false, 'No prazo de até 12 meses', NULL, 11),
  (p_id, 'Declaração Cumprimento', 'pending', false, NULL, 'Apresentada pelo interessado', 12);
END $$;

-- Project 2: Nova Sinalização Viária
DO $$
DECLARE
  p_id UUID;
BEGIN
  INSERT INTO projects (title, description, progress, image_url, current_responsible, current_deadline, current_notes)
  VALUES (
    'Nova Sinalização Viária',
    'Implementação de semáforos inteligentes e revitalização das placas de sinalização no centro.',
    78,
    'https://images.unsplash.com/photo-1494515855673-102c6c523065?auto=format&fit=crop&q=80&w=1000',
    'Eng. Carlos Souza',
    '30/10/2023',
    'Instalação dos semáforos na Av. Brasil em andamento.'
  ) RETURNING id INTO p_id;

  INSERT INTO project_steps (project_id, title, status, is_current, top_annotation, bottom_annotation, order_index) VALUES
  (p_id, 'Planejamento', 'completed', false, NULL, NULL, 1),
  (p_id, 'Licitação', 'completed', false, NULL, NULL, 2),
  (p_id, 'Execução', 'in-progress', true, NULL, NULL, 3),
  (p_id, 'Vistoria', 'pending', false, NULL, NULL, 4);
END $$;

-- Project 3: Centro Cultural Zona Norte
DO $$
DECLARE
  p_id UUID;
BEGIN
  INSERT INTO projects (title, description, progress, image_url, current_responsible, current_deadline, current_notes)
  VALUES (
    'Centro Cultural Zona Norte',
    'Construção de novo centro comunitário com biblioteca e teatro.',
    15,
    'https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&q=80&w=1000',
    'Secretaria de Cultura',
    '20/12/2023',
    'Aguardando liberação de verba federal.'
  ) RETURNING id INTO p_id;

  INSERT INTO project_steps (project_id, title, status, is_current, top_annotation, bottom_annotation, order_index) VALUES
  (p_id, 'Projeto Arquitetônico', 'completed', false, NULL, NULL, 1),
  (p_id, 'Aprovação Orçamentária', 'in-progress', true, NULL, NULL, 2),
  (p_id, 'Licitação da Obra', 'pending', false, NULL, NULL, 3),
  (p_id, 'Início das Obras', 'pending', false, NULL, NULL, 4);
END $$;
```

Depois de rodar isso:
1.  Vá em **Settings > API** no Supabase.
2.  Copie a **URL** e a **anon public key**.
3.  Crie um arquivo `.env` na raiz do seu projeto local (ou edite se já existir) e cole as chaves (como mostrei antes).
4.  Reinicie o servidor local (`npm run dev`).

Me avise quando tiver feito isso para confirmarmos se os dados apareceram!