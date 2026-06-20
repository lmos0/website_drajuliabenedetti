# Dra. Julia Benedetti | Site Institucional

Site institucional da Dra. Julia Benedetti — dermatologia com foco em saúde da pele, prevenção, diagnóstico e tratamento.

## Estrutura

```
/
├── index.html                  # Página inicial
├── sobre.html                  # Biografia e formação
├── tratamento.html             # Tratamentos e tecnologia
├── contato.html                # Contato e formulário
├── agendar.html                # Agendamento público
├── admin/
│   ├── login.html              # Login administrativo
│   ├── agenda.html             # Gerenciar agenda
│   ├── agendamentos.html       # Gerenciar agendamentos
│   └── mensagens.html          # Gerenciar mensagens
├── src/
│   ├── components/             # Componentes reutilizáveis
│   │   ├── header.js           # Inicialização do header e idioma
│   │   └── menu-toggle.js      # Menu mobile público e admin
│   ├── services/
│   │   └── api.js              # Wrapper HTTP (autenticado e público)
│   ├── state/
│   │   └── store.js            # Estado global com pub/sub (idioma)
│   ├── utils/
│   │   ├── date.js             # formatDateKey, isSameDay, MONTHS, WEEKDAYS
│   │   ├── dom.js              # setText, setHtml, setAttr
│   │   ├── sanitize.js         # escapeHtml (XSS)
│   │   ├── debounce.js         # Debounce utility
│   │   └── string.js           # getInitials
│   ├── i18n/
│   │   └── index.js            # Traduções PT/EN por página
│   ├── pages/                  # Entry points das páginas públicas
│   │   ├── home.js
│   │   ├── sobre.js
│   │   ├── tratamento.js
│   │   ├── contato.js
│   │   └── agendar.js
│   ├── admin/                  # Entry points das páginas admin
│   │   ├── login.js
│   │   ├── agenda.js
│   │   ├── agendamentos.js
│   │   └── mensagens.js
│   ├── styles/                 # CSS modular (mobile-first)
│   │   ├── tokens.css          # Custom properties (:root)
│   │   ├── reset.css           # Reset e .container
│   │   ├── typography.css      # Eyebrow, titles, body
│   │   ├── buttons.css         # .button, .button-outline
│   │   ├── header.css          # Header, nav, mobile menu
│   │   ├── footer.css          # Footer
│   │   ├── pages/              # CSS por página pública
│   │   │   ├── home.css
│   │   │   ├── about.css
│   │   │   ├── treatments.css
│   │   │   ├── contact.css
│   │   │   └── booking.css
│   │   └── admin/              # CSS por página admin
│   │       ├── login.css
│   │       ├── dashboard.css
│   │       ├── agenda.css
│   │       ├── appointments.css
│   │       └── messages.css
│   └── config.js               # Configuração (API_BASE via data-api-base)
└── assets/
    └── images/                 # Imagens organizadas por contexto
        ├── branding/
        ├── home/
        ├── about/
        ├── treatments/
        └── legacy/
```

## Stack

- **HTML5** semântico com acessibilidade
- **CSS** modular com custom properties, mobile-first (`min-width`)
- **JavaScript** vanilla com **ES Modules** nativos (`import`/`export`)
- **Estado** com pub/sub simples (`src/state/store.js`)
- **i18n** PT/EN via URL param (`?lang=en`) e localStorage
- **API** backend em `localhost:8082` (configurável via `data-api-base` no `<html>`)

## Padrões

- Delegação de eventos em listas dinâmicas (calendários)
- `AbortController` para cancelamento de fetch obsoleto
- `debounce` em inputs de busca (300ms)
- `escapeHtml` em todo `innerHTML` com dados externos
- `loading="lazy"` em imagens abaixo da dobra
- `fetchpriority="high"` na imagem hero (LCP)
- `aria-label` em elementos interativos sem texto visível
- JSDoc em funções exportadas de `utils/` e `services/`

## Como rodar

Servir os arquivos estáticos com qualquer servidor HTTP:

```bash
# Python
python3 -m http.server 8080

# Node (npx)
npx serve .

# VS Code Live Server
# Clique direito no index.html → Open with Live Server
```

O backend deve estar rodando em `http://localhost:8082`. Para mudar, edite o atributo `data-api-base` no `<html>` de cada página.
