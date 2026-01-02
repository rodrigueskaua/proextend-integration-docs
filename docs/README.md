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

### [1. Visão Geral](00-visao-geral.md)

Comece aqui! Entenda:
- Objetivo da integração
- Como funciona a autenticação (geração de API Key)
- Padrão de codes (o sistema utiliza identificadores próprios)
- Entidades principais
- Diferença entre Disciplinas Base e Turmas
- Fluxo geral de sincronização

**Leia primeiro** se esta é a primeira vez com a API.

### [2. Conceitos Fundamentais](01-conceitos-fundamentais.md)

Entenda as entidades e seus relacionamentos:
- Unidades, Áreas, Cursos
- Disciplinas Base vs Turmas
- Professores e Alunos
- Hierarquia e dependências
- Campos obrigatórios e opcionais

**Importante** para entender o modelo de dados completo.

### [3. Autenticação](02-autenticacao.md)

Configure acesso à API:
- Como gerar API Key no painel administrativo
- Usar API Key nas requisições (não há login separado)
- Gerenciamento de chaves
- Scopes de acesso (read, write, full)
- Rate limiting
- Segurança e boas práticas

**Configure antes** de começar a sincronizar.

### [4. Fluxo de Sincronização](03-fluxo-de-sincronizacao.md)

Passo a passo completo de sincronização:
- Ordem correta (Unidades/Campus (Units) → Áreas (Areas) → Cursos (Courses) → Disciplinas Base (Subjects) → Professores (Professors) → Alunos (Students) → Disciplinas Ativas/Turmas (Enrollments))
- Exemplos práticos de cada endpoint
- Campos obrigatórios e opcionais
- Tratamento de erros
- Estratégias (completa, incremental, em lote)
- Consultas de dados sincronizados

**Siga este guia** durante a implementação.

### [5. Identificadores e Codes](04-identificadores-e-codes.md)

Como funcionam os identificadores:
- O sistema utiliza seus próprios codes (não são gerados pela API)
- Idempotência (mesmo code atualiza ao invés de duplicar)
- Boas práticas de nomenclatura
- Exemplos práticos
- Erros comuns

**Essencial** para implementação correta.

## Como Utilizar esta Documentação

### Para Implementação Inicial

1. Leia [Visão Geral](00-visao-geral.md) para entender o contexto completo
2. Estude [Conceitos Fundamentais](01-conceitos-fundamentais.md) para familiarizar-se com as entidades
3. Configure [Autenticação](02-autenticacao.md) no painel administrativo (requer permissões de administrador)
4. Siga o [Fluxo de Sincronização](03-fluxo-de-sincronizacao.md) passo a passo
5. Implemente [Identificadores e Codes](04-identificadores-e-codes.md) corretamente

### Para Consulta Rápida

- Use o índice de cada documento para navegar diretamente ao tópico
- Consulte a [Coleção Postman](../ProExtend-API.postman_collection.json) para exemplos prontos

### Para Resolução de Problemas

Consulte as seções de "Erros Comuns" e "Tratamento de Erros" em cada documento.

## Conceitos-Chave

### Autenticação
API Key gerada no painel administrativo (Avançado > Integrações). Detalhes em [Autenticação](02-autenticacao.md).

### Identificadores (Codes)
O sistema utiliza identificadores próprios do ERP. Detalhes em [Identificadores e Codes](04-identificadores-e-codes.md).

### Ordem de Sincronização
Unidades → Áreas → Cursos → Disciplinas Base → Professores/Alunos → Turmas

Detalhes completos em [Fluxo de Sincronização](03-fluxo-de-sincronizacao.md).

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

## Recursos Adicionais

### Coleção Postman

Arquivo: [`ProExtend-API.postman_collection.json`](../ProExtend-API.postman_collection.json)

Contém exemplos prontos de todas as requisições com:
- Variáveis configuráveis
- Exemplos de sucesso e erro
- Testes automatizados
- Descrições detalhadas

### Health Check

Verifique se a API está operacional:

```bash
curl https://tenant.proextend.com.br/api/integration/v1/health
```

### Sync Status

Acompanhe totais sincronizados:

```bash
curl https://tenant.proextend.com.br/api/integration/v1/sync-status \
  -H "Authorization: Bearer pex_..."
```

## Início Rápido

1. **Gerar API Key**: Painel Admin → Avançado → Integrações → Gerar Nova API Key
   - Ver guia completo em [Autenticação](02-autenticacao.md)

2. **Sincronizar dados**: Seguir ordem de dependências
   - Ver passo a passo em [Fluxo de Sincronização](03-fluxo-de-sincronizacao.md)

3. **Consultar dados**: Usar endpoints GET com API Key
   - Ver exemplos em [Fluxo de Sincronização](03-fluxo-de-sincronizacao.md)

## FAQ

### Preciso armazenar IDs retornados pela API?

**Não**. O sistema utiliza identificadores próprios (codes) do ERP. Ver [Identificadores e Codes](04-identificadores-e-codes.md).

### Como funciona a autenticação?

API Key gerada no painel administrativo e usada no header `Authorization: Bearer {api_key}`. Ver [Autenticação](02-autenticacao.md).

### Posso sincronizar múltiplas vezes?

Sim! A sincronização é idempotente. Ver [Identificadores e Codes](04-identificadores-e-codes.md#idempot%C3%AAncia).

### Qual a ordem correta de sincronização?

Unidades → Áreas → Cursos → Disciplinas Base → Professores/Alunos → Turmas. Ver [Fluxo de Sincronização](03-fluxo-de-sincronizacao.md).

### Qual a diferença entre Subject e Enrollment?

- **Subject**: Disciplina no currículo (sem semestre)
- **Enrollment**: Turma ativa (com semestre, professor e alunos)

Ver [Conceitos Fundamentais](01-conceitos-fundamentais.md#diferen%C3%A7a-disciplina-base-vs-turma).

## Suporte

Para dúvidas técnicas ou problemas na documentação, entre em contato com a equipe técnica da ProExtend.

## Versionamento

- **Versão da API**: v1
- **Última atualização da documentação**: Dezembro 2025

---

Leia a [Visão Geral](00-visao-geral.md) e configure a [Autenticação](02-autenticacao.md)!
