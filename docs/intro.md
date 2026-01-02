---
sidebar_position: 1
slug: /
title: Introdução
---

# Documentação de Integração - ProExtend API

Documentação oficial para integração de sistemas acadêmicos (ERPs) com a plataforma ProExtend.

## Sobre esta Documentação

Esta documentação foi desenvolvida para auxiliar equipes técnicas de instituições de ensino a integrar seus sistemas acadêmicos com a plataforma ProExtend.

O foco está em explicar **processos, conceitos e fluxos completos de sincronização**, não apenas endpoints isolados.

## Para Quem é

- Desenvolvedores responsáveis pela integração
- Arquitetos de software das instituições
- Equipes de TI que precisam implementar a sincronização
- Gestores técnicos que precisam planejar a integração

## Estrutura da Documentação

A documentação está organizada de forma progressiva, do conceitual ao prático:

### [1. Visão Geral](visao-geral)

Comece aqui! Entenda:
- Objetivo da integração
- Como funciona a autenticação (geração de API Key)
- Padrão de codes (o sistema utiliza identificadores próprios)
- Entidades principais
- Diferença entre Disciplinas Base e Turmas
- Fluxo geral de sincronização

**Leia primeiro** se esta é a primeira vez com a API.

### [2. Conceitos Fundamentais](conceitos-fundamentais)

Entenda as entidades e seus relacionamentos:
- Unidades, Áreas, Cursos
- Disciplinas Base vs Turmas
- Professores e Alunos
- Hierarquia e dependências
- Campos obrigatórios e opcionais

**Importante** para entender o modelo de dados completo.

### [3. Autenticação](autenticacao)

Configure acesso à API:
- Como gerar API Key no painel administrativo
- Usar API Key nas requisições (não há login separado)
- Gerenciamento de chaves
- Scopes de acesso (read, write, full)
- Rate limiting
- Segurança e boas práticas

**Configure antes** de começar a sincronizar.

### [4. Fluxo de Sincronização](fluxo-de-sincronizacao)

Passo a passo completo de sincronização:
- Ordem correta (Unidades/Campus (Units) → Áreas (Areas) → Cursos (Courses) → Disciplinas Base (Subjects) → Professores (Professors) → Alunos (Students) → Disciplinas Ativas/Turmas (Enrollments))
- Exemplos práticos de cada endpoint
- Campos obrigatórios e opcionais
- Tratamento de erros
- Estratégias (completa, incremental, em lote)
- Consultas de dados sincronizados

**Siga este guia** durante a implementação.

### [5. Identificadores e Codes](identificadores-e-codes)

Como funcionam os identificadores:
- O sistema utiliza seus próprios codes (não são gerados pela API)
- Idempotência (mesmo code atualiza ao invés de duplicar)
- Boas práticas de nomenclatura
- Exemplos práticos
- Erros comuns

**Essencial** para implementação correta.

## Como Utilizar esta Documentação

### Para Implementação Inicial

1. Leia [Visão Geral](visao-geral) para entender o contexto completo
2. Estude [Conceitos Fundamentais](conceitos-fundamentais) para familiarizar-se com as entidades
3. Configure [Autenticação](autenticacao) no painel administrativo (requer permissões de administrador)
4. Siga o [Fluxo de Sincronização](fluxo-de-sincronizacao) passo a passo
5. Implemente [Identificadores e Codes](identificadores-e-codes) corretamente

### Para Consulta Rápida

- Use o índice de cada documento para navegar diretamente ao tópico
- Consulte a coleção Postman para exemplos prontos

### Para Resolução de Problemas

Consulte as seções de "Erros Comuns" e "Tratamento de Erros" em cada documento.

## Conceitos-Chave

### Autenticação
API Key gerada no painel administrativo (Avançado > Integrações). Detalhes em [Autenticação](autenticacao).

### Identificadores (Codes)
O sistema utiliza identificadores próprios do ERP. Detalhes em [Identificadores e Codes](identificadores-e-codes).

### Ordem de Sincronização
Unidades → Áreas → Cursos → Disciplinas Base → Professores/Alunos → Turmas

Detalhes completos em [Fluxo de Sincronização](fluxo-de-sincronizacao).

## Endpoints Principais

### Base URL

```
https://TENANT.proextend.com.br/api/integration/v1/
```

### Status e Monitoramento

```
GET /health                    (público, sem autenticação)
GET /sync-status               (requer API Key)
```

### Sincronização (POST)

```
POST /units/sync
POST /areas/sync
POST /courses/sync
POST /subjects/sync
POST /professors/sync
POST /students/sync
POST /enrollments/sync
```

### Consultas (GET)

```
GET /units
GET /units/{code}
GET /professors/{code}
GET /professors/{code}/subjects
GET /enrollments/{code}
```

## Início Rápido

1. **Gerar API Key**: Painel Admin → Avançado → Integrações → Gerar Nova API Key
   - Ver guia completo em [Autenticação](autenticacao)

2. **Sincronizar dados**: Seguir ordem de dependências
   - Ver passo a passo em [Fluxo de Sincronização](fluxo-de-sincronizacao)

3. **Consultar dados**: Usar endpoints GET com API Key
   - Ver exemplos em [Fluxo de Sincronização](fluxo-de-sincronizacao)

## FAQ

### Preciso armazenar IDs retornados pela API?

**Não**. O sistema utiliza identificadores próprios (codes) do ERP. Ver [Identificadores e Codes](identificadores-e-codes).

### Como funciona a autenticação?

API Key gerada no painel administrativo e usada no header `Authorization: Bearer {api_key}`. Ver [Autenticação](autenticacao).

### Posso sincronizar múltiplas vezes?

Sim! A sincronização é idempotente. Ver [Identificadores e Codes](identificadores-e-codes).

### Qual a ordem correta de sincronização?

Unidades → Áreas → Cursos → Disciplinas Base → Professores/Alunos → Turmas. Ver [Fluxo de Sincronização](fluxo-de-sincronizacao).

### Qual a diferença entre Subject e Enrollment?

- **Subject**: Disciplina no currículo (sem semestre)
- **Enrollment**: Turma ativa (com semestre, professor e alunos)

Ver [Conceitos Fundamentais](conceitos-fundamentais#diferença-disciplina-base-vs-turma).

## Suporte

Para dúvidas técnicas ou problemas na documentação, entre em contato com a equipe técnica da ProExtend.

## Versionamento

- **Versão da API**: v1
- **Última atualização da documentação**: Janeiro 2026

---

Comece pela [Visão Geral](visao-geral) e configure a [Autenticação](autenticacao)!
