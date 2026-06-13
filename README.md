# Currículo.io

Ferramenta web para criar currículos profissionais de forma **simples, rápida e bonita** — com vários modelos prontos, edição ao vivo e download em PDF.

> **100% grátis · sem cadastro · sem marca d'água · seus dados ficam só no seu navegador.**

## ✨ Destaques

- **8 modelos** de currículo (e crescendo) — do clássico ATS ao criativo com foto.
- **Pré-visualização ao vivo** em formato A4 enquanto você digita.
- **Dois modos de edição:**
  - 🧭 **Guiado** — passo a passo, com dicas. Ideal para a primeira vez.
  - ⚡ **Avançado** — tudo em uma tela, edição livre.
- **Acessibilidade (WCAG AA):** controle de tamanho de fonte (A− / A+), foco visível, alvos de clique ≥44px, alto contraste. Pensado de idosos a usuários avançados.
- **Painel de qualidade / ATS ao vivo:** pontuação 0–100 com sugestões (verbos de ação, números, contato completo…).
- **Assistente de escrita:** verbos de ação e frases-modelo (método STAR) inseridos com 1 clique.
- **Personalização:** cor de destaque e família de fonte (sans / serif / mono).
- **Responsivo:** funciona no computador e no celular.
- **Download em PDF** direto pela impressão do navegador (formato A4 fiel).
- **Salvamento automático** no navegador (localStorage) — sem servidor, sem login.

## 🧱 Arquitetura

O princípio central é **separar os dados da apresentação**:

```
  Dados do usuário (1 JSON)  ──►  Template A (Moderno)
                             ──►  Template B (Clássico ATS)
                             ──►  Template C (Sidebar)
                             ──►  ... N templates
```

O usuário preenche **uma vez**; trocar de modelo só troca a "skin". Adicionar um modelo
novo = criar **um componente** e registrá-lo — escala sem dor.

```
src/
├─ app/
│  ├─ layout.tsx          # fontes + metadata
│  ├─ globals.css         # estilos globais, folha A4, regras de impressão e acessibilidade
│  └─ page.tsx            # app principal (toolbar, editor, preview, modais)
├─ lib/
│  ├─ resume-schema.ts    # tipos do JSON do currículo + presets
│  ├─ sample-data.ts      # currículo de exemplo e vazio
│  ├─ use-resume.ts       # estado + persistência (localStorage)
│  ├─ use-ui-prefs.ts     # preferências de UI (acessibilidade, modo)
│  └─ insights.ts         # qualidade/ATS + verbos de ação
├─ components/
│  ├─ ResumePreview.tsx   # pré-visualização A4 com escala automática
│  ├─ EditorPanel.tsx     # modo avançado
│  ├─ GuidedEditor.tsx    # modo guiado (passo a passo)
│  ├─ sections.tsx        # seções do editor + assistente de escrita
│  ├─ QualityPanel.tsx    # painel de qualidade/ATS
│  ├─ TemplateGallery.tsx # galeria de modelos
│  ├─ Onboarding.tsx      # tela de boas-vindas
│  ├─ ListEditor.tsx      # editor genérico de listas
│  └─ ui.tsx              # primitivas de formulário
└─ templates/
   ├─ types.ts            # contrato de um template
   ├─ shared.tsx          # helpers compartilhados (bullets, níveis…)
   ├─ registry.ts         # registro central dos modelos
   └─ designs/            # um arquivo por modelo
```

### Como adicionar um novo modelo

1. Crie `src/templates/designs/MeuModelo.tsx` recebendo `{ data, settings }` (ver `types.ts`).
2. Adicione uma entrada em `src/templates/registry.ts`.

Pronto — ele aparece na galeria e no preview automaticamente.

## 🚀 Rodando localmente

```bash
npm install
npm run dev      # http://localhost:3000
```

Outros scripts:

```bash
npm run build    # build de produção
npm run start    # serve o build
npm run lint     # ESLint
```

## 🛠️ Stack

- [Next.js 16](https://nextjs.org/) (App Router) + React 19
- TypeScript
- Tailwind CSS v4

100% client-side: roda inteiramente no navegador, sem backend.

## 🗺️ Próximos passos

- Assistente de IA para reescrever bullets
- Carta de apresentação
- Exportação em Word/DOCX
- Backup/importação em JSON
- Contas opcionais na nuvem

---

Feito com ❤️ para ajudar pessoas a conquistarem a vaga.
