// =============================================================================
// CONFIGURAÇÃO DE MONETIZAÇÃO
// -----------------------------------------------------------------------------
// Tudo que gera receita fica AQUI, fácil de editar. O núcleo do app continua
// 100% grátis — monetizamos por cima, sem paywall.
// =============================================================================

export interface JobBoard {
  name: string;
  /**
   * IMPORTANTE: troque pela sua URL de AFILIADO.
   * Programas no Brasil:
   *  - Indeed Publisher Program (publisher.indeed.com)
   *  - Catho / Vagas.com / InfoJobs → via redes Awin, Lomadee ou Rakuten
   *  - Gupy, Trampos.co → contato direto / parcerias
   * Ex.: "https://br.indeed.com/?utm_source=curriculoio&pubnum=SEU_ID"
   */
  url: string;
  emoji: string;
  note?: string;
}

// Portais exibidos na vitrine pós-download. Substitua as URLs pelos seus links
// de afiliado para começar a ganhar comissão por clique/cadastro.
export const JOB_BOARDS: JobBoard[] = [
  { name: "Indeed", url: "https://br.indeed.com/", emoji: "🔎", note: "Maior agregador de vagas" },
  { name: "Catho", url: "https://www.catho.com.br/", emoji: "💼", note: "Vagas em todo o Brasil" },
  { name: "Vagas.com", url: "https://www.vagas.com.br/", emoji: "📋", note: "Clássico do mercado" },
  { name: "InfoJobs", url: "https://www.infojobs.com.br/", emoji: "🗂️", note: "Muitas vagas operacionais" },
  { name: "Gupy", url: "https://portal.gupy.io/", emoji: "🚀", note: "Vagas em grandes empresas" },
  { name: "LinkedIn", url: "https://www.linkedin.com/jobs/", emoji: "🔗", note: "Networking + vagas" },
];

// -----------------------------------------------------------------------------
// Apoio via Pix
// -----------------------------------------------------------------------------
const PIX_KEY_PLACEHOLDER = "SUA_CHAVE_PIX_AQUI";

export const PIX = {
  // Sua chave Pix (e-mail, telefone, CPF/CNPJ ou aleatória).
  key: PIX_KEY_PLACEHOLDER,
  // Nome exibido como recebedor.
  name: "Currículo.io",
};

export const isPixConfigured = () => PIX.key !== PIX_KEY_PLACEHOLDER && PIX.key.trim().length > 0;
