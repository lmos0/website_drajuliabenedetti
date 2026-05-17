# Dra. Julia Benedetti | Site Institucional

Este repositório contém o site institucional da Dra. Julia Benedetti, com foco em apresentação da médica, áreas de atuação, tratamentos e contato.

## Estrutura

```text
/
├── index.html              # Página inicial
├── sobre.html              # Página institucional / biografia
├── tratamento.html         # Página de tratamentos e tecnologia
├── contato.html            # Página de contato
├── assets/
│   ├── css/
│   │   └── styles.css      # Estilos globais do site
│   ├── js/
│   │   └── main.js         # Menu mobile e envio do formulário
│   └── images/
│       ├── branding/       # Logo e identidade base
│       ├── home/           # Imagens usadas na home
│       ├── about/          # Imagens da página Sobre
│       ├── treatments/     # Imagens da página Tratamentos
│       └── legacy/         # Arquivos antigos mantidos só como referência
├── archive/
│   ├── home-b.html         # Versão antiga de protótipo
│   └── tailwind-output.css # Build antigo não utilizado no layout atual
├── package.json
├── package-lock.json
└── tailwind.config.js
```

## Observações

- O layout atual usa HTML estático com CSS e JS próprios.
- O arquivo `tailwind.config.js` foi mantido porque fazia parte da estrutura anterior, mas o site atual não depende do `output.css` arquivado.
- As imagens foram separadas por contexto para facilitar manutenção e substituição futura.
