# gamitofx-site

Site da Gamitofx. Responda em português; o site é em inglês (público gringo), e todo texto novo vem com tradução para o usuário conferir.

- Sem build: HTML/CSS/JS puros. Não adicionar framework sem necessidade.
- Marca Midnight Teal: fundo #0D1214, texto #EEF3F2, destaque #1FC7B2 (só no que importa). Sora (títulos), Inter (texto), JetBrains Mono (rótulos e números). Tokens em `assets/site.css`.
- Preços e pacotes vêm do PRD (Decisão 3 — Oferta). Se mudarem, atualizar em 3 lugares: `index.html` (seções e JSON-LD), `llms.txt`.
- Nunca inventar números, depoimentos ou clientes. Vídeo de lead/cliente só entra com autorização por escrito.
- Domínio canônico: https://gamitofx.com (usado em canonical, og:url, og:image, JSON-LD, sitemap, robots, llms.txt).
- Vídeos: H.264 720p, `-crf 26 -preset slow -movflags +faststart`, `preload="none"` e poster WebP.
- Ao mudar ou criar página: atualizar `sitemap.xml` (lastmod) e revisar visualmente em desktop e celular antes de entregar.
- Checklist completo de lançamento: skill `/site-lancamento` do gamitofx-estudio.
- GA4 e Clarity: os códigos entram no `<head>` de todas as páginas, nos comentários marcados.
