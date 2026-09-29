/**
 * Mapa de cores temáticas dos eixos e sub-eventos da SCTI UNITINS
 * Cores originárias do design da edição de 2025/2026
 */
export const defaultEventColorsMap: Record<string, string> = {
  // Edição 2025
  "Encontro Estadual das Licenciaturas da Unitins": "#2563EB", // Azul Real
  "XXXII Jornada de iniciação científica": "#059669", // Verde Esmeralda
  "Embrapa": "#15803D", // Verde Floresta
  "Seminário Estadual de Educação em Direitos Humanos: Prevenir para Proteger: A Universidade como Território de Direitos": "#4F46E5", // Índigo
  "Apresentação cultural": "#E11D48", // Rosa Magenta
  "III SCTI": "#DC2626", // Vermelho Carmim
  "I Semana Acadêmica das Agrárias - UNITINS/Tema IntegraAGRO: Cultivando Conhecimento Para o Campo": "#65A30D", // Lima
  "IX Colóquio Interdisciplinar de Ensino, Pesquisa e Extensão": "#0284C7", // Azul Céu
  "III Circuito de Inovação": "#9333EA", // Roxo
  "FAPT": "#B45309", // Âmbar / Bronze
  "Projeto Integrador curso de Gestão Pública - TO Graduado": "#C026D3", // Fúcsia
  "I Fórum de Gestão dos Grupos de Pesquisa": "#0891B2", // Ciano
  "II Colóquio de Extensão – TO Graduado": "#EA580C", // Laranja
  "Mudanças Climáticas e seus Desdobramentos: Educação Climática, Sustentabilidade, Tecnologia e Saberes Interdisciplinares": "#0D9488", // Teal
  "I Congresso de Direito, Processo e Tecnologia da Unitins": "#475569", // Cinza Ardósia
  "Jornada Acadêmica dos Cursos de Sistemas de Informação e Tecnologia em Análise e Desenvolvimento de Sistemas e Encontro de Egressos do Curso de Sistemas de Informação": "#DB2777", // Rosa Choque
  "Lançamento da revista e premiações da JIC, NIT, Colóquio e TO Graduado": "#CA8A04", // Dourado

  // Edição 2026
  "PALESTRA MAGNA": "#D97706", // Âmbar Dourado
  "XXXIII Jornada de Iniciação Científica": "#059669", // Verde Esmeralda
  "IV Circuito de Inovação": "#9333EA", // Roxo
  "II Encontro Estadual das Licenciaturas da Unitins": "#2563EB", // Azul
  "V Semana Acadêmica do Curso de Engenharia Agrônomica - TocaInovAgro Unitins": "#65A30D", // Lima
  "Jornada Acadêmica dos Cursos de SI e TADS": "#DB2777", // Rosa
  "Fórum Interdisciplinar de Saúde Integral": "#0891B2", // Ciano
  "II Edição do Fórum de Gestão dos Grupos de Pesquisa e da Mostra de Projetos de Pesquisa da Unitins": "#4F46E5", // Índigo
  "X Colóquio Interdisciplinar de Ensino, Pesquisa e Extensão": "#0284C7", // Azul Céu
  "III Mostra de Ciências da Vida — Anatomia, Ciência e Inovação: aproximando estudantes da educação básica às profissões da saúde": "#EA580C", // Laranja
  "Congresso Ciência Delas para Elas: Mulheres e sistema prisional: desafios da atuação feminina em espaços institucionais": "#BE185D", // Rosa Escuro
  "Seminário: Direitos Humanos em Todo Lugar: o Protagonismo das Mulheres na Transformação Social": "#7C3AED", // Violeta
  "Pedagogia em Movimento: 5 anos de Ensino, Pesquisa e Extensão": "#059669", // Verde
  "II Festival Culinário da Unitins — Chefs do Sabor": "#E11D48", // Rosa Coral
  "III Colóquio de Extensão TO Graduado: Caminhos para transformação social": "#F97316", // Laranja Brilhante
  "III Jornada de Iniciação Científica e Tecnológica na Modalidade à Distância": "#0284C7", // Azul Claro
}

/**
 * Retorna a cor padrão do eixo temático a partir do nome ou correspondência parcial
 */
export function getDefaultEventColor(eventName: string): string {
  if (!eventName) return "#083D77"

  // 1. Busca exata
  if (defaultEventColorsMap[eventName]) {
    return defaultEventColorsMap[eventName]
  }

  const normalized = eventName.toLowerCase()

  // 2. Busca por fragmentos-chave
  if (normalized.includes("licenciatura")) return "#2563EB"
  if (normalized.includes("iniciação científica") || normalized.includes("jic")) return "#059669"
  if (normalized.includes("embrapa")) return "#15803D"
  if (normalized.includes("direitos humanos")) return "#4F46E5"
  if (normalized.includes("cultural")) return "#E11D48"
  if (normalized.includes("scti")) return "#DC2626"
  if (normalized.includes("agrária") || normalized.includes("agronômica") || normalized.includes("agro")) return "#65A30D"
  if (normalized.includes("colóquio")) return "#0284C7"
  if (normalized.includes("circuito de inovação") || normalized.includes("inovação")) return "#9333EA"
  if (normalized.includes("fapt")) return "#B45309"
  if (normalized.includes("gestão pública")) return "#C026D3"
  if (normalized.includes("grupos de pesquisa")) return "#0891B2"
  if (normalized.includes("extensão")) return "#EA580C"
  if (normalized.includes("mudanças climáticas") || normalized.includes("climática")) return "#0D9488"
  if (normalized.includes("direito")) return "#475569"
  if (normalized.includes("sistemas de informação") || normalized.includes("tads") || normalized.includes("informação")) return "#DB2777"
  if (normalized.includes("palestra magna")) return "#D97706"
  if (normalized.includes("saúde")) return "#0891B2"
  if (normalized.includes("ciências da vida")) return "#EA580C"
  if (normalized.includes("mulheres") || normalized.includes("delas")) return "#BE185D"
  if (normalized.includes("culinário") || normalized.includes("sabor")) return "#E11D48"
  if (normalized.includes("pedagogia")) return "#059669"

  return "#083D77"
}
