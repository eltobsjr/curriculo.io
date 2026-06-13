# CLAUDE.md — Currículo.io

## 1. Sempre ler a memória antes de começar

Ao iniciar qualquer conversa neste projeto:

1. Leia o índice de memória: `~/.claude/projects/-home-eltobsjr-dev-curriculotool/memory/MEMORY.md`
   É um índice — siga os links para os arquivos relevantes à tarefa atual.

2. Leia o devtrack mais recente:
   `ls CurriculoIoSecondBrain/devtrack/ | sort | tail -1`
   e leia o arquivo retornado. Isso garante continuidade: o que foi feito,
   decisões tomadas e pendências abertas na última sessão.

## 2. Stack e tecnologias

- **Next.js 16** (App Router) + **React 19**
- **TypeScript**
- **Tailwind CSS v4**
- 100% client-side (sem backend): estado no `localStorage`, deploy alvo Vercel

## 3. Estrutura do projeto

- `src/app/` — layout, estilos globais (folha A4, impressão, acessibilidade) e página principal
- `src/lib/` — schema de dados, persistência, preferências de UI e lógica de qualidade/ATS
- `src/components/` — editor (guiado/avançado), preview, galeria, onboarding, painel de qualidade
- `src/templates/` — motor de templates plugável (`registry.ts`) e os modelos em `designs/`

## 4. Documentação

Toda documentação fica no vault: `CurriculoIoSecondBrain/`
Logs de sessão: `CurriculoIoSecondBrain/devtrack/`
Formato dos logs: `YYYY-MM-DD - Título.md`

## 5. Regras de desenvolvimento

- **Commits granulares**: um por componente / por melhoria. Mensagens em pt-BR no estilo `tipo(escopo): descrição`.
- **Nunca adicionar Claude como co-autor** nos commits (sem trailer `Co-Authored-By: Claude`). Autoria é só do usuário (eltobsjr).
- **Comunicar e documentar sempre em pt-BR.**

## 6. Fluxo de trabalho

1. Ler memória e devtrack mais recente
2. Entender o contexto antes de implementar
3. Implementar
4. Atualizar devtrack ao final da sessão
