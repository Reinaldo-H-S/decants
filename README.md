# Decants

Controle dos perfumes que você faz decant: foto, ml que sobram, vendas, lucro, quanto ainda rende em 1/2/5 ml e preço no Mercado Livre.

- Funciona sem internet depois do primeiro acesso.
- Os dados ficam no aparelho. Pra usar no celular e no PC juntos, ligue **Ajustes → Sincronizar aparelhos** (usa o mesmo repositório privado do Fiado, `fiado-dados`, no arquivo `decants.json`).
- Backup em **Ajustes → Backup**.

## Instalar no iPhone

1. Abra o link do app no **Safari**.
2. Toque em **Compartilhar** → **Adicionar à Tela de Início**.

No Android: menu do Chrome → **Instalar app**.

## Atualizar

Edite `index.html` e aumente `VERSION` em `sw.js` (ex.: `decants-v2`) e `APP_VERSION` no `index.html` pra os aparelhos baixarem a versão nova.
