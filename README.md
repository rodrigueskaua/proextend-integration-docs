# ProExtend - Documentação de Integração

Este repositório contém a documentação oficial para integração com a API ProExtend.

## 📚 Documentação Online

Acesse a documentação completa em: **https://rodrigueskaua.github.io/proextend-integration-docs/**

## 📖 Conteúdo

- [Visão Geral](docs/00-visao-geral.md) - Introdução à API de Integração
- [Conceitos Fundamentais](docs/01-conceitos-fundamentais.md) - Entenda os conceitos básicos
- [Autenticação](docs/02-autenticacao.md) - Como autenticar suas requisições
- [Fluxo de Sincronização](docs/03-fluxo-de-sincronizacao.md) - Processo completo de sincronização
- [Identificadores e Codes](docs/04-identificadores-e-codes.md) - Sistema de identificação

## 🚀 Como usar

A documentação está disponível online através do GitHub Pages. Você também pode navegar pelos arquivos markdown diretamente neste repositório.

## 🔄 Atualizações

Esta documentação é mantida e atualizada regularmente pela equipe ProExtend.

## 🛠️ Desenvolvimento Local

Para visualizar a documentação localmente:

```bash
# Instalar Jekyll (primeira vez apenas)
gem install bundler jekyll

# Criar Gemfile
cat > Gemfile << 'GEMFILE'
source "https://rubygems.org"
gem "github-pages", group: :jekyll_plugins
gem "webrick"
GEMFILE

# Instalar dependências
bundle install

# Executar servidor local
cd docs
bundle exec jekyll serve

# Acesse em http://localhost:4000
```

## 📄 Licença

Copyright © 2026 ProExtend. Todos os direitos reservados.
