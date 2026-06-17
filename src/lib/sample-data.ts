import { ResumeData, uid } from "./resume-schema";

// Dados de exemplo usados como ponto de partida e nos previews da galeria.
export const SAMPLE_RESUME: ResumeData = {
  fullName: "Ana Beatriz Martins",
  headline: "Desenvolvedora Front-end Sênior",
  photoUrl: "",
  email: "ana.martins@email.com",
  phone: "(11) 98765-4321",
  location: "São Paulo, SP",
  website: "anamartins.dev",
  socials: [
    { id: uid(), label: "LinkedIn", url: "linkedin.com/in/anamartins" },
    { id: uid(), label: "GitHub", url: "github.com/anamartins" },
  ],
  summary:
    "Desenvolvedora front-end com 7 anos de experiência criando interfaces acessíveis e performáticas com React e TypeScript. Apaixonada por design systems, experiência do usuário e por liderar times pequenos rumo à entrega de produtos de alta qualidade.",
  experiences: [
    {
      id: uid(),
      role: "Desenvolvedora Front-end Sênior",
      company: "Nuvem Tech",
      location: "São Paulo, SP",
      startDate: "Mar 2022",
      endDate: "Atual",
      current: true,
      description:
        "Liderou a migração de um monólito jQuery para React, reduzindo o tempo de carregamento em 45%.\nCriou e mantém o design system interno usado por 6 squads.\nMentora de 3 desenvolvedores juniores.",
    },
    {
      id: uid(),
      role: "Desenvolvedora Front-end Pleno",
      company: "Loja Digital S.A.",
      location: "Remoto",
      startDate: "Jan 2019",
      endDate: "Fev 2022",
      description:
        "Desenvolveu o checkout responsivo que aumentou a conversão mobile em 18%.\nImplementou testes automatizados com Cypress cobrindo os fluxos críticos.",
    },
  ],
  education: [
    {
      id: uid(),
      degree: "Bacharelado em Ciência da Computação",
      institution: "Universidade de São Paulo (USP)",
      location: "São Paulo, SP",
      startDate: "2012",
      endDate: "2016",
      description: "",
    },
  ],
  projects: [
    {
      id: uid(),
      name: "ReactQuery PT-BR",
      url: "github.com/anamartins/reactquery-ptbr",
      description: "Tradução e manutenção da documentação em português da biblioteca.",
    },
  ],
  skills: [
    { id: uid(), name: "React", level: 5 },
    { id: uid(), name: "TypeScript", level: 5 },
    { id: uid(), name: "Next.js", level: 4 },
    { id: uid(), name: "CSS / Tailwind", level: 5 },
    { id: uid(), name: "Node.js", level: 3 },
    { id: uid(), name: "Acessibilidade (a11y)", level: 4 },
  ],
  languages: [
    { id: uid(), name: "Português", level: "Nativo" },
    { id: uid(), name: "Inglês", level: "Fluente" },
    { id: uid(), name: "Espanhol", level: "Intermediário" },
  ],
  certifications: [
    {
      id: uid(),
      name: "AWS Certified Cloud Practitioner",
      issuer: "Amazon Web Services",
      date: "2023",
    },
  ],
  publications: [],
};

// Currículo em branco (quando o usuário começa do zero).
export const EMPTY_RESUME: ResumeData = {
  fullName: "",
  headline: "",
  photoUrl: "",
  email: "",
  phone: "",
  location: "",
  website: "",
  socials: [],
  summary: "",
  experiences: [],
  education: [],
  projects: [],
  skills: [],
  languages: [],
  certifications: [],
  publications: [],
};
