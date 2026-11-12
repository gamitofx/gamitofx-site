# gamitofx-site

Site da GamitoFX. Responda em português; o site é em inglês (público gringo), e todo texto novo vem com tradução para o usuário conferir.

- Sem build: HTML/CSS/JS puros. Não adicionar framework sem necessidade.
- Marca Midnight Teal: fundo #06080A, texto #EEF3F2, destaque #1FC7B2 (só no que importa). Sora (títulos), Inter (texto), JetBrains Mono (rótulos e números), fontes variáveis em `assets/fonts/`. Tokens em `assets/site.css`.
- Estrutura v2 (11/11/2026, decisão `decisao-site-v2` no cérebro): primeira tela, vídeos longos com aba Storyboard, curtos com storyboard em folha (dados no JSON `#sb-data` do `index.html`), sobre, clientes, contato, rodapé. Celular primeiro; desktop a partir de 900 px.
- **Nenhum valor no site** (nem no JSON-LD nem no `llms.txt`). Preço só na proposta.
- Canal próprio do YouTube não aparece. LinkedIn e YouTube fora até ter posts.
- Nunca inventar números, depoimentos ou clientes. Vídeo de lead/cliente só entra com autorização por escrito (o spec da Krishi Ahuja depende disso).
- Vídeo longo: YouTube não listado, ID em `data-yt` do botão `#lf-play`. Vazio = aviso "coming soon".
- Vídeo curto: com `data-yt` no `.vc`, toca o YouTube dentro do card (botão do canto fecha); sem `data-yt`, toca o mp4 de `assets/video/`.
- Domínio canônico TEMPORÁRIO: https://gamitofx.pages.dev, até o gamitofx.com ser comprado; aí trocar de volta com `grep -rl gamitofx.pages.dev . | xargs sed -i "s#https://gamitofx.pages.dev#https://gamitofx.com#g"` (usado em canonical, og:url, og:image, JSON-LD, sitemap, robots, llms.txt).
- Vídeos curtos em mp4: H.264 720p, `-crf 26 -preset slow -movflags +faststart`, `preload="none"` e poster WebP. Quadros de storyboard em `assets/img/sb/`.
- Ao mudar ou criar página: atualizar `sitemap.xml` (lastmod) e revisar visualmente em desktop e celular (360 px inclusive) antes de entregar.
- Checklist completo de lançamento: skill `/site-lancamento` do gamitofx-estudio.
- GA4 e Clarity: os códigos entram no `<head>` de todas as páginas, nos comentários marcados.
