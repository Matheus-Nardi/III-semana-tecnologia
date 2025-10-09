"use client";

import { useRef, useState } from "react";
import { Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion, useInView } from "motion/react";

interface Talk {
  id: string;
  title: string;
  speaker: string;
  time: string;
  location: string;
}

interface Event {
  id: string;
  name: string;
  talks: Talk[];
}

interface DaySchedule {
  date: string;
  dayOfWeek: string;
  events: Event[];
}

// Cores temáticas para cada evento
const eventColors: Record<string, { primary: string; secondary: string; accent: string; text: string }> = {
  "Encontro Estadual das Licenciaturas da Unitins": {
    primary: "bg-purple-500",
    secondary: "bg-purple-50",
    accent: "border-purple-500",
    text: "text-purple-700"
  },
  "XXXII Jornada de Iniciação Científica - Embrapa": {
    primary: "bg-green-600",
    secondary: "bg-green-50",
    accent: "border-green-600",
    text: "text-green-700"
  },
  "Seminário Estadual de Educação em Direitos Humanos": {
    primary: "bg-blue-600",
    secondary: "bg-blue-50",
    accent: "border-blue-600",
    text: "text-blue-700"
  },
  "Abertura da III SCTI": {
    primary: "bg-red-600",
    secondary: "bg-red-50",
    accent: "border-red-600",
    text: "text-red-700"
  },
  "I Semana Acadêmica das Agrárias - IntegraAGRO": {
    primary: "bg-emerald-600",
    secondary: "bg-emerald-50",
    accent: "border-emerald-600",
    text: "text-emerald-700"
  },
  "IX Colóquio Interdisciplinar de Ensino, Pesquisa e Extensão": {
    primary: "bg-indigo-600",
    secondary: "bg-indigo-50",
    accent: "border-indigo-600",
    text: "text-indigo-700"
  },
  "Mudanças Climáticas e seus Desdobramentos": {
    primary: "bg-teal-600",
    secondary: "bg-teal-50",
    accent: "border-teal-600",
    text: "text-teal-700"
  },
  "III Circuito de Inovação": {
    primary: "bg-orange-600",
    secondary: "bg-orange-50",
    accent: "border-orange-600",
    text: "text-orange-700"
  },
  "I Fórum de Gestão dos Grupos de Pesquisa": {
    primary: "bg-cyan-600",
    secondary: "bg-cyan-50",
    accent: "border-cyan-600",
    text: "text-cyan-700"
  },
  "II Colóquio de Extensão – TO Graduado": {
    primary: "bg-pink-600",
    secondary: "bg-pink-50",
    accent: "border-pink-600",
    text: "text-pink-700"
  },
  "Apresentações Culturais": {
    primary: "bg-violet-600",
    secondary: "bg-violet-50",
    accent: "border-violet-600",
    text: "text-violet-700"
  },
  "I Congresso de Direito, Processo e Tecnologia": {
    primary: "bg-amber-600",
    secondary: "bg-amber-50",
    accent: "border-amber-600",
    text: "text-amber-700"
  },
  "Jornada Acadêmica - Sistemas de Informação e TADS": {
    primary: "bg-sky-600",
    secondary: "bg-sky-50",
    accent: "border-sky-600",
    text: "text-sky-700"
  },
  "Encerramento da III SCTI": {
    primary: "bg-rose-600",
    secondary: "bg-rose-50",
    accent: "border-rose-600",
    text: "text-rose-700"
  }
};

// Função auxiliar para obter as cores de um evento
const getEventColors = (eventName: string) => {
  return eventColors[eventName] || {
    primary: "bg-primary",
    secondary: "bg-primary/5",
    accent: "border-primary",
    text: "text-primary"
  };
};

export default function Schedule() {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: false, margin: "-100px" });

  const schedule: DaySchedule[] = [
    {
      date: "20/10",
      dayOfWeek: "Segunda-feira",
      events: [
        {
          id: "event-1-1",
          name: "Encontro Estadual das Licenciaturas da Unitins",
          talks: [
            {
              id: "talk-1-1-1",
              title: "Cerimônia de Abertura e Conferência: O modelo mercadológico de formação humana",
              speaker: "Prof.ª Dr.ª Raquel Aparecida Marra da Madeira Freitas (PUC GO)",
              time: "09:30 - 11:00",
              location: "Auditório/central",
            },
            {
              id: "talk-1-1-2",
              title: "Conferência Temática: A formação do professor na perspectiva histórico-cultural",
              speaker: "Prof.ª Dr.ª Raquel Aparecida Marra da Madeira Freitas (PUC GO)",
              time: "14:00 - 17:00",
              location: "Sala 5 - Bloco A",
            },
            {
              id: "talk-1-1-3",
              title: "Mesa Redonda: A Relação entre a Universidade e a Escola de Educação Básica",
              speaker: "Prof. Dr. Diego Grossi e Prof. Dr. Raimundo Carvalho",
              time: "10:00 - 12:00",
              location: "Auditório/câmpus",
            },
          ],
        },
        {
          id: "event-1-2",
          name: "XXXII Jornada de Iniciação Científica - Embrapa",
          talks: [
            {
              id: "talk-1-2-1",
              title: "Apresentações de trabalhos - Agro",
              speaker: "Vários apresentadores",
              time: "14:00 - 18:00",
              location: "Salas 1 a 4 - Bloco A",
            },
          ],
        },
        {
          id: "event-1-3",
          name: "Seminário Estadual de Educação em Direitos Humanos",
          talks: [
            {
              id: "talk-1-3-1",
              title: "Mesa Redonda: Inclusão e Justiça Social - Direito à Educação Superior",
              speaker: "Pabla (Ministério dos Direitos Humanos)",
              time: "16:00 - 18:00",
              location: "Auditório/câmpus",
            },
            {
              id: "talk-1-3-2",
              title: "Conferência de Abertura: A Universidade como Espaço de Direitos Humanos",
              speaker: "Rodrigo Mondego (Câmara dos Deputados)",
              time: "19:00",
              location: "Auditório/câmpus",
            },
          ],
        },
        {
          id: "event-1-4",
          name: "Abertura da III SCTI",
          talks: [
            {
              id: "talk-1-4-1",
              title: "Apresentação Cultural - Coral Unicanto",
              speaker: "Coral Unicanto",
              time: "19:00",
              location: "Auditório/central",
            },
            {
              id: "talk-1-4-2",
              title: "Palestra Magna de Abertura",
              speaker: "Jaime Café",
              time: "19:30 - 20:30",
              location: "Auditório/central",
            },
          ],
        },
      ],
    },
    {
      date: "21/10",
      dayOfWeek: "Terça-feira",
      events: [
        {
          id: "event-2-1",
          name: "I Semana Acadêmica das Agrárias - IntegraAGRO",
          talks: [
            {
              id: "talk-2-1-1",
              title: "Palestra Magna: Cenários e Futuro do Agronegócio Tocantinense",
              speaker: "Joelma Feitosa Modesto",
              time: "08:00 - 12:00",
              location: "Auditório/central",
            },
            {
              id: "talk-2-1-2",
              title: "Mini curso: Técnicas para Interpretação da Análise de Solo",
              speaker: "Mirian das Mercês",
              time: "13:00 - 14:30",
              location: "Sala 5 - Bloco A",
            },
            {
              id: "talk-2-1-3",
              title: "Oficina: Produção de silagem",
              speaker: "Giovani Menegucci Martin",
              time: "13:00 - 15:00",
              location: "Sala 6 - Bloco A",
            },
            {
              id: "talk-2-1-4",
              title: "Mini curso: Operação de Máquinas e Implementos Agrícolas",
              speaker: "Gilberto Fernandes de Melo Junior",
              time: "13:00 - 17:00",
              location: "Sala 7 - Bloco A",
            },
            {
              id: "talk-2-1-5",
              title: "Mini curso: Agricultura de Precisão",
              speaker: "Instrutor especializado",
              time: "13:00 - 17:00",
              location: "Sala 8 - Bloco A",
            },
            {
              id: "talk-2-1-6",
              title: "Mini curso: Sanidade Animal e Vacinação em Bovinos - ADAPEC",
              speaker: "Gustavo Marquardt",
              time: "14:00 - 15:30",
              location: "Sala 09 - Bloco A",
            },
            {
              id: "talk-2-1-7",
              title: "Mini curso: ILPF no Contexto do Matopiba - EMBRAPA",
              speaker: "Gilmar Mendes",
              time: "14:00 - 15:30",
              location: "Sala 10 - Bloco A",
            },
            {
              id: "talk-2-1-8",
              title: "Mini curso: Fitopatologia - EMBRAPA",
              speaker: "Cibelle Christine",
              time: "14:00 - 15:30",
              location: "Sala 11 - Bloco A",
            },
            {
              id: "talk-2-1-9",
              title: "Mini curso: Recomendação de Calagem e Gessagem",
              speaker: "Diony Alves Reis",
              time: "15:00 - 16:30",
              location: "Sala 5 - Bloco A",
            },
            {
              id: "talk-2-1-10",
              title: "Mini curso: Uso de Drones na Agricultura",
              speaker: "Adriano Sérgio Bernardo Queiroz",
              time: "15:00 - 17:00",
              location: "Sala 6 - Bloco A",
            },
            {
              id: "talk-2-1-11",
              title: "Oficina: Fruticultura e Técnicas de Propagação Vegetativa",
              speaker: "Instrutor especializado",
              time: "15:00 - 17:00",
              location: "Sala 12 - Bloco A",
            },
            {
              id: "talk-2-1-12",
              title: "Mini Curso: Boas Práticas de Manejo na Pecuária - ADAPEC",
              speaker: "Instrutor ADAPEC",
              time: "16:00 - 17:30",
              location: "Sala 10 - Bloco A",
            },
            {
              id: "talk-2-1-13",
              title: "Mini Curso: Plataforma AgroTag ILPF - EMBRAPA",
              speaker: "Instrutor EMBRAPA",
              time: "16:00 - 17:30",
              location: "Sala 11 - Bloco A",
            },
            {
              id: "talk-2-1-14",
              title: "Roda de Conversa: Perspectivas de mercado - Engenheiro Agrônomo",
              speaker: "Vários palestrantes",
              time: "19:00 - 22:00",
              location: "Auditório/câmpus",
            },
          ],
        },
        {
          id: "event-2-2",
          name: "IX Colóquio Interdisciplinar de Ensino, Pesquisa e Extensão",
          talks: [
            {
              id: "talk-2-2-1",
              title: "Oficina: Código e Sustentabilidade - Sistema de reaproveitamento de água",
              speaker: "Instrutor",
              time: "09:00 - 10:00",
              location: "Sala 4 - Bloco B",
            },
          ],
        },
        {
          id: "event-2-3",
          name: "Mudanças Climáticas e seus Desdobramentos",
          talks: [
            {
              id: "talk-2-3-1",
              title: "Palestra Magna: Mudanças Climáticas no Tocantins",
              speaker: "Palestrante convidado",
              time: "08:00 - 09:45",
              location: "Auditório/câmpus",
            },
            {
              id: "talk-2-3-2",
              title: "Sessão de banners e Oficinas temáticas",
              speaker: "Vários apresentadores",
              time: "19:00 - 22:00",
              location: "Sala 5 - Bloco A",
            },
          ],
        },
        {
          id: "event-2-4",
          name: "III Circuito de Inovação",
          talks: [
            {
              id: "talk-2-4-1",
              title: "Hackathon InovaUni – HackÁgua",
              speaker: "Equipe de desenvolvedores",
              time: "10:00 - 18:00",
              location: "Arena Hackathon",
            },
          ],
        },
        {
          id: "event-2-5",
          name: "Seminário de Educação em Direitos Humanos",
          talks: [
            {
              id: "talk-2-5-1",
              title: "Educação em Direitos Humanos: Transversalidade no Ensino Superior",
              speaker: "Palestrantes convidados",
              time: "16:00 - 18:00",
              location: "Auditório/câmpus",
            },
            {
              id: "talk-2-5-2",
              title: "Apresentação Cultural - Roda de Sussia e Curso Básico de LIBRAS",
              speaker: "Grupos culturais de Monte do Carmo",
              time: "19:00",
              location: "Auditório/central",
            },
            {
              id: "talk-2-5-3",
              title: "Conferência de Encerramento: O Futuro da Educação em Direitos Humanos",
              speaker: "Rodrigo Mondego",
              time: "19:30 - 21:00",
              location: "Auditório/central",
            },
          ],
        },
      ],
    },
    {
      date: "22/10",
      dayOfWeek: "Quarta-feira",
      events: [
        {
          id: "event-3-1",
          name: "I Semana Acadêmica das Agrárias - IntegraAGRO",
          talks: [
            {
              id: "talk-3-1-1",
              title: "Oficina: Brotos Comestíveis",
              speaker: "Juliana Maria de Paula, Ana Carolina Roos e Tiago Dias",
              time: "08:00 - 09:30",
              location: "Sala 7 - Bloco A",
            },
            {
              id: "talk-3-1-2",
              title: "Oficina: Boas Práticas Agrícolas na Produção de Mandioca",
              speaker: "Eliane Archangelo",
              time: "09:30 - 10:30",
              location: "Sala 8 - Bloco A",
            },
            {
              id: "talk-3-1-3",
              title: "Oficina: Plantas Alimentícias Não Convencionais (PANCS)",
              speaker: "Juliana Maria de Paula",
              time: "10:30 - 12:00",
              location: "Sala 7 - Bloco A",
            },
            {
              id: "talk-3-1-4",
              title: "Encontro de Egressos - Engenharia Agronômica e Agronegócio",
              speaker: "Egressos dos cursos",
              time: "14:00 - 18:00",
              location: "Auditório/câmpus",
            },
          ],
        },
        {
          id: "event-3-2",
          name: "Mudanças Climáticas e seus Desdobramentos",
          talks: [
            {
              id: "talk-3-2-1",
              title: "Mesa Redonda: Barragens e Mudanças Climáticas no Cerrado Tocantinense",
              speaker: "Atamis Antônio Foschiera (UFT) e Judith Rocha",
              time: "09:00 - 10:00",
              location: "Sala 6 - Bloco A",
            },
          ],
        },
        {
          id: "event-3-3",
          name: "I Fórum de Gestão dos Grupos de Pesquisa",
          talks: [
            {
              id: "talk-3-3-1",
              title: "Palestra: Estratégias para Consolidação dos Grupos de Pesquisa",
              speaker: "Jofre Jacob da Silva Freitas (Universidade Estadual do Pará)",
              time: "09:30 - 10:30",
              location: "Auditório/câmpus",
            },
            {
              id: "talk-3-3-2",
              title: "Estruturação dos Grupos de Pesquisa da Unitins",
              speaker: "Coordenadores de grupos",
              time: "11:10 - 12:00",
              location: "Auditório/câmpus",
            },
            {
              id: "talk-3-3-3",
              title: "Financiamento à Pesquisa - Como construir projetos para fomento",
              speaker: "Sandra Negri (UFMT)",
              time: "14:30 - 15:00",
              location: "Auditório/câmpus",
            },
            {
              id: "talk-3-3-4",
              title: "Mesa Redonda: Casos Exitosos de Liderança na Unitins",
              speaker: "Líderes de grupos de pesquisa",
              time: "15:30 - 16:30",
              location: "Auditório/câmpus",
            },
            {
              id: "talk-3-3-5",
              title: "Encerramento e Direcionamentos",
              speaker: "Coordenação geral",
              time: "16:30 - 17:00",
              location: "Auditório/câmpus",
            },
          ],
        },
        {
          id: "event-3-4",
          name: "III Circuito de Inovação",
          talks: [
            {
              id: "talk-3-4-1",
              title: "Oficina: Construção de Dashboards com Looker Studio",
              speaker: "Instrutor especializado",
              time: "08:30 - 11:30",
              location: "Lab. Informática I - Bloco B",
            },
            {
              id: "talk-3-4-2",
              title: "Palestra: Transferência de Tecnologia na UFJF",
              speaker: "Prof. Dr. Leonardo Miranda Frossard (UFJF)",
              time: "09:00 - 11:00",
              location: "Auditório/central",
            },
          ],
        },
        {
          id: "event-3-5",
          name: "IX Colóquio Interdisciplinar",
          talks: [
            {
              id: "talk-3-5-1",
              title: "III Feira de Extensão",
              speaker: "Projetos de extensão",
              time: "14:00 - 17:00",
              location: "Hall - Bloco A",
            },
            {
              id: "talk-3-5-2",
              title: "Oficina Temática: Brincando e Construindo Jogos",
              speaker: "Prof. Flávio Moura (SEDUC TO)",
              time: "14:00 - 17:00",
              location: "Sala 8 e 9 - Bloco B",
            },
          ],
        },
        {
          id: "event-3-6",
          name: "II Colóquio de Extensão – TO Graduado",
          talks: [
            {
              id: "talk-3-6-1",
              title: "Apresentação de trabalhos",
              speaker: "Estudantes TO Graduado",
              time: "19:00 - 20:00",
              location: "Google Meet",
            },
          ],
        },
        {
          id: "event-3-7",
          name: "Apresentações Culturais",
          talks: [
            {
              id: "talk-3-7-1",
              title: "Apresentação Cultural - Banda da Polícia Militar",
              speaker: "Banda PM-TO",
              time: "19:00",
              location: "Auditório/câmpus",
            },
            {
              id: "talk-3-7-2",
              title: "Palestra Magna: Direito à água e saneamento no Brasil",
              speaker: "Palestrante especializado",
              time: "19:00 - 22:00",
              location: "Auditório/câmpus",
            },
          ],
        },
      ],
    },
    {
      date: "23/10",
      dayOfWeek: "Quinta-feira",
      events: [
        {
          id: "event-4-1",
          name: "I Semana Acadêmica das Agrárias - IntegraAGRO",
          talks: [
            {
              id: "talk-4-1-1",
              title: "Mesa Redonda: Problema Interdisciplinar",
              speaker: "Engenharia Agronômica, Pedagogia e Sistemas de Informação",
              time: "08:00 - 12:00",
              location: "Auditório/câmpus",
            },
            {
              id: "talk-4-1-2",
              title: "Oficina: Bunitins - Percussão Sustentável",
              speaker: "Danilo da Silva Moreira Pires e Emannuel Oliveira Pedreira",
              time: "09:00 - 12:00",
              location: "Sala 4 - Bloco B",
            },
            {
              id: "talk-4-1-3",
              title: "Oficina: Conhecendo o Selo ODS Educação",
              speaker: "Bruno do Amaral Crispim",
              time: "14:00 - 18:00",
              location: "Sala 5 - Bloco A",
            },
            {
              id: "talk-4-1-4",
              title: "Palestra: Competências e Carreiras no Agro",
              speaker: "Oscar Arnaldo Batista Neto e Silva (Corteva)",
              time: "19:30 - 21:00",
              location: "Auditório/central",
            },
            {
              id: "talk-4-1-5",
              title: "Festival Culinário Sabores do Campo",
              speaker: "Organizadores e participantes",
              time: "20:00 - 21:00",
              location: "Hall - Bloco A",
            },
          ],
        },
        {
          id: "event-4-2",
          name: "I Congresso de Direito, Processo e Tecnologia",
          talks: [
            {
              id: "talk-4-2-1",
              title: "Palestras e apresentações",
              speaker: "Vários palestrantes",
              time: "08:00 - 18:00",
              location: "Sala 10 - Bloco A",
            },
          ],
        },
        {
          id: "event-4-3",
          name: "Jornada Acadêmica - Sistemas de Informação e TADS",
          talks: [
            {
              id: "talk-4-3-1",
              title: "Roda de Conversa ao vivo: Tecnólogo em Ação",
              speaker: "Profissionais do mercado",
              time: "19:30 - 20:30",
              location: "Google Meet",
            },
            {
              id: "talk-4-3-2",
              title: "Oficina ao vivo: Transformação Digital no Agronegócio com Impressão 3D",
              speaker: "Phelipe Luiz Damasceno Araújo",
              time: "20:30 - 22:00",
              location: "Google Meet",
            },
          ],
        },
        {
          id: "event-4-4",
          name: "IX Colóquio Interdisciplinar",
          talks: [
            {
              id: "talk-4-4-1",
              title: "III Feira de Extensão",
              speaker: "Projetos de extensão",
              time: "14:00 - 17:00",
              location: "Hall - Bloco A",
            },
            {
              id: "talk-4-4-2",
              title: "Palestra: Da nascente ao oceano - Degradação ambiental e saúde",
              speaker: "Alexandro Billy",
              time: "19:00 - 22:00",
              location: "Auditório/câmpus",
            },
          ],
        },
        {
          id: "event-4-5",
          name: "III Circuito de Inovação",
          talks: [
            {
              id: "talk-4-5-1",
              title: "Palestra Magna: Inovação Sustentável no Setor Industrial",
              speaker: "Lucas Mattos (FIT - Instituto de Tecnologia)",
              time: "19:30 - 21:30",
              location: "Auditório/central",
            },
            {
              id: "talk-4-5-2",
              title: "Roda de Conversa: Inteligência Coletiva no Tocantins",
              speaker: "Especialistas em inovação",
              time: "19:30 - 19:00",
              location: "Arena Hackathon",
            },
          ],
        },
        {
          id: "event-4-6",
          name: "Apresentações Culturais",
          talks: [
            {
              id: "talk-4-6-1",
              title: "Apresentação Cultural - Orquestra Jovem da Guarda Metropolitana",
              speaker: "Orquestra Jovem",
              time: "19:00",
              location: "Auditório/câmpus",
            },
          ],
        },
      ],
    },
    {
      date: "24/10",
      dayOfWeek: "Sexta-feira",
      events: [
        {
          id: "event-5-1",
          name: "Jornada Acadêmica - Sistemas de Informação e TADS",
          talks: [
            {
              id: "talk-5-1-1",
              title: "Palestra: LGPD na Prática Acadêmica",
              speaker: "Alex Coelho",
              time: "08:30 - 09:55",
              location: "Auditório/câmpus",
            },
            {
              id: "talk-5-1-2",
              title: "Palestra: Certificação Profissional e Carreira Acadêmica",
              speaker: "Heder Dorneles Soares (INPE)",
              time: "10:00 - 11:30",
              location: "Auditório/câmpus",
            },
            {
              id: "talk-5-1-3",
              title: "Encontro dos Egressos: Conexões que Transformam",
              speaker: "Egressos de Sistemas de Informação",
              time: "19:30 - 21:30",
              location: "Auditório/central",
            },
            {
              id: "talk-5-1-4",
              title: "Oficina: Programando com Flutter",
              speaker: "Marco Antonio Firmino de Sousa e Douglas Chagas",
              time: "19:30 - 21:30",
              location: "Google Meet",
            },
            {
              id: "talk-5-1-5",
              title: "Oficina: Construindo meu primeiro serviço",
              speaker: "Cristovam Ferreira Liberato Junior",
              time: "19:30 - 21:30",
              location: "Google Meet",
            },
          ],
        },
        {
          id: "event-5-2",
          name: "I Congresso de Direito, Processo e Tecnologia",
          talks: [
            {
              id: "talk-5-2-1",
              title: "Mesa Redonda: Problema Interdisciplinar",
              speaker: "Direito, Serviço Social, Tecnólogos EAD e MBA",
              time: "08:00 - 12:00",
              location: "Auditório/câmpus",
            },
          ],
        },
        {
          id: "event-5-3",
          name: "Mudanças Climáticas e seus Desdobramentos",
          talks: [
            {
              id: "talk-5-3-1",
              title: "Palestras e apresentações",
              speaker: "Vários palestrantes",
              time: "08:00 - 12:00",
              location: "Sala 8 e 9 - Bloco B",
            },
          ],
        },
        {
          id: "event-5-4",
          name: "IX Colóquio Interdisciplinar",
          talks: [
            {
              id: "talk-5-4-1",
              title: "III Feira de Extensão",
              speaker: "Projetos de extensão",
              time: "14:00 - 17:00",
              location: "Hall - Bloco A",
            },
            {
              id: "talk-5-4-2",
              title: "Lançamento da Revista e Premiações",
              speaker: "JIC, NIT, Colóquio e TO Graduado",
              time: "18:00 - 19:00",
              location: "Auditório/central",
            },
          ],
        },
        {
          id: "event-5-5",
          name: "Encerramento da III SCTI",
          talks: [
            {
              id: "talk-5-5-1",
              title: "Premiação e Encerramento",
              speaker: "Comissão organizadora",
              time: "18:00 - 19:00",
              location: "Auditório/central",
            },
            {
              id: "talk-5-5-2",
              title: "Apresentação Cultural - Grupo Toca Choro",
              speaker: "Grupo Toca Choro",
              time: "19:00 - 19:30",
              location: "Auditório/central",
            },
          ],
        },
      ],
    },
  ];

  // Estado para o dia selecionado (primeiro dia por padrão)
  const [selectedDay, setSelectedDay] = useState<string | null>(schedule[0]?.date || null);

  // Filtra os eventos baseado no dia selecionado
  const filteredSchedule = selectedDay
    ? schedule.filter((day) => day.date === selectedDay)
    : [];

  return (
    <section id="programacao" className="w-full py-20 px-4 relative overflow-hidden bg-white">

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-3 font-montserrat">
            Programação
          </h2>
            <div className="flex justify-center">
            <motion.div 
              className="h-1 bg-primary rounded-full"
              initial={{ width: "4rem" }}
              animate={{ 
                width: isHeaderInView ? "12rem" : "4rem" 
              }}
              transition={{ 
                duration: 0.8, 
                ease: "easeInOut" 
              }}
            />
          </div>
          <p className="text-muted-foreground font-poppins text-lg">
            Selecione um dia para ver a programação completa
          </p>
        </div>

        {/* Filtro de Dias */}
        <div className="flex justify-center gap-3 mb-12 flex-wrap">
          {schedule.map((day) => {
            const isActive = selectedDay === day.date;
            return (
              <Button
                key={day.date}
                variant={isActive ? "default" : "outline"}
                size="lg"
                onClick={() => setSelectedDay(isActive ? null : day.date)}
                className={`
                  w-[140px] h-[90px] py-4 px-6 flex flex-col items-center justify-center gap-1 
                  transition-all duration-300 rounded-xl
                  ${isActive 
                    ? 'shadow-md' 
                    : 'hover:border-primary hover:bg-primary/10 hover:shadow-sm hover:text-primary'
                  }
                `}
              >
                <span className={`text-xs font-medium uppercase tracking-wider transition-opacity ${isActive ? 'opacity-90' : 'opacity-70'}`}>
                  {day.dayOfWeek}
                </span>
                <span className="text-2xl font-bold">
                  {day.date}
                </span>
              </Button>
            );
          })}
        </div>

        {/* Lista de Eventos */}
        {filteredSchedule.length > 0 ? (
          <div className="space-y-8">
            {filteredSchedule.map((day) => (
              <div key={day.date}>
                {/* Título do Dia */}
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-primary inline-block font-montserrat">
                    {day.date}
                  </h3>
                  <span className="text-muted-foreground ml-3">
                    {day.dayOfWeek}
                  </span>
                </div>

                {/* Cards de Eventos */}
                <Accordion type="single" collapsible className="space-y-4">
                  {day.events.map((event) => {
                    const colors = getEventColors(event.name);
                    return (
                      <AccordionItem
                        key={event.id}
                        value={event.id}
                        className="border-none"
                      >
                        <Card className={`border-l-4 ${colors.accent} hover:shadow-lg overflow-hidden transition-all duration-300 bg-white`}>
                          <AccordionTrigger className="hover:no-underline p-0 [&[data-state=open]_.chevron]:rotate-180 [&>svg]:hidden">
                            <CardHeader className={`py-5 px-6 w-full flex flex-row items-center justify-between space-y-0 ${colors.secondary}`}>
                              <CardTitle className={`text-lg font-semibold ${colors.text} text-left pr-4 font-montserrat`}>
                                {event.name}
                              </CardTitle>
                              <div className="flex items-center gap-3 flex-shrink-0">
                                <span className={`text-xs text-white ${colors.primary} px-3 py-1.5 rounded-full font-medium shadow-sm min-w-[110px] text-center`}>
                                  {event.talks.length} {event.talks.length === 1 ? "evento" : "eventos"}
                                </span>
                                <svg
                                  className={`chevron w-5 h-5 ${colors.text} transition-transform duration-200 flex-shrink-0`}
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </div>
                            </CardHeader>
                          </AccordionTrigger>

                          <AccordionContent>
                            <CardContent className="pt-0 pb-6 px-6 space-y-3">
                              {event.talks.map((talk) => (
                                <div
                                  key={talk.id}
                                  className={`flex items-start justify-between gap-4 p-4 bg-white rounded-lg border ${colors.accent} ${colors.secondary} hover:shadow-md transition-all duration-300`}
                                >
                                  {/* Conteúdo Principal */}
                                  <div className="flex-1 min-w-0">
                                    <h5 className="font-semibold text-foreground mb-1 text-base font-montserrat">
                                      {talk.title}
                                    </h5>
                                    <p className="text-sm text-muted-foreground mb-2 font-poppins">
                                      {talk.speaker}
                                    </p>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                      <MapPin className={`w-4 h-4 ${colors.text}`} />
                                      <span>{talk.location}</span>
                                    </div>
                                  </div>

                                  {/* Horário */}
                                  <div className="flex-shrink-0 text-right">
                                    <div className={`flex items-center gap-1.5 ${colors.text} font-medium ${colors.secondary} px-3 py-2 rounded-lg border ${colors.accent}`}>
                                      <Clock className="w-4 h-4" />
                                      <span className="text-sm whitespace-nowrap">{talk.time}</span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </CardContent>
                          </AccordionContent>
                        </Card>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </div>
            ))}
          </div>
        ) : (
          /* Mensagem quando nenhum dia está selecionado */
          <div className="text-center mt-12 p-8 border-2 border-dashed border-border rounded-lg">
            <p className="text-muted-foreground text-lg mb-2 font-poppins">
              Selecione um dia acima
            </p>
            <p className="text-muted-foreground text-sm font-poppins">
              💡 Clique em um dos cards para visualizar a programação
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
