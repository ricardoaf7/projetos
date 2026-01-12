import { Project } from '../types';

export const projects: Project[] = [
  {
    id: '1',
    title: 'Revitalização do Lago Municipal',
    description: 'Projeto de reurbanização completa da orla do lago, incluindo ciclovias e áreas de lazer.',
    progress: 45,
    imageUrl: 'https://images.unsplash.com/photo-1581094794329-cd8119604f8b?auto=format&fit=crop&q=80&w=1000',
    steps: [
      { id: '1', title: 'Demanda', status: 'completed', topAnnotation: 'Consulta Prévia Empresa Fácil PR', bottomAnnotation: 'Processo SEI "IPPUL: Análise de EIV"' },
      { id: '2', title: 'Instrução', status: 'completed', topAnnotation: 'Emitido pelo IPPUL' },
      { id: '3', title: 'Termo de Referência', status: 'completed' },
      { id: '4', title: 'Entrega do EIV', status: 'completed', bottomAnnotation: 'No prazo de 180 dias' },
      { id: '5', title: 'Revisão do EIV', status: 'in-progress', isCurrent: true, topAnnotation: 'Revisão de conteúdo pelo IPPUL' },
      { id: '6', title: 'Publicação do EIV', status: 'pending', bottomAnnotation: 'No site do IPPUL' },
      { id: '7', title: 'Análise do EIV', status: 'pending', topAnnotation: 'Análise dos impactos e medidas' },
      { id: '8', title: 'Pareceres', status: 'pending', bottomAnnotation: 'IPPUL, CMPGT e órgãos relacionados' },
      { id: '9', title: 'Diretriz de EIV', status: 'pending', topAnnotation: 'Emitida pelo IPPUL, indicando viabilidade' },
      { id: '10', title: 'Termo de Compromisso', status: 'pending', bottomAnnotation: 'Assinado pelo interessado' },
      { id: '11', title: 'Execução de Medidas', status: 'pending', topAnnotation: 'No prazo de até 12 meses' },
      { id: '12', title: 'Declaração Cumprimento', status: 'pending', bottomAnnotation: 'Apresentada pelo interessado' },
    ],
    currentStepDetails: {
      responsible: 'Arq. Mariana Silva (IPPUL)',
      deadline: '15/11/2023',
      notes: 'Aguardando ajustes na análise de tráfego solicitada na última reunião.',
    }
  },
  {
    id: '2',
    title: 'Nova Sinalização Viária',
    description: 'Implementação de semáforos inteligentes e revitalização das placas de sinalização no centro.',
    progress: 78,
    imageUrl: 'https://images.unsplash.com/photo-1494515855673-102c6c523065?auto=format&fit=crop&q=80&w=1000',
    steps: [
      { id: '1', title: 'Planejamento', status: 'completed' },
      { id: '2', title: 'Licitação', status: 'completed' },
      { id: '3', title: 'Execução', status: 'in-progress', isCurrent: true },
      { id: '4', title: 'Vistoria', status: 'pending' },
    ],
    currentStepDetails: {
      responsible: 'Eng. Carlos Souza',
      deadline: '30/10/2023',
      notes: 'Instalação dos semáforos na Av. Brasil em andamento.',
    }
  },
  {
    id: '3',
    title: 'Centro Cultural Zona Norte',
    description: 'Construção de novo centro comunitário com biblioteca e teatro.',
    progress: 15,
    imageUrl: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&q=80&w=1000',
    steps: [
      { id: '1', title: 'Projeto Arquitetônico', status: 'completed' },
      { id: '2', title: 'Aprovação Orçamentária', status: 'in-progress', isCurrent: true },
      { id: '3', title: 'Licitação da Obra', status: 'pending' },
      { id: '4', title: 'Início das Obras', status: 'pending' },
    ],
    currentStepDetails: {
      responsible: 'Secretaria de Cultura',
      deadline: '20/12/2023',
      notes: 'Aguardando liberação de verba federal.',
    }
  }
];
