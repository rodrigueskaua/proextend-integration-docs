---
sidebar_position: 2
title: Visão Geral
---

# Visão Geral da Integração

## Objetivo da Integração

A API de Integração ProExtend permite que sistemas de gestão acadêmica (ERPs) sincronizem dados com a plataforma ProExtend. Esta API possibilita a sincronização bidirecional de dados acadêmicos incluindo unidades, áreas, cursos, disciplinas, professores, alunos e matrículas.

## Modelo de Comunicação

```
Sistema Acadêmico (ERP)    →    ProExtend API
   da Instituição                (Plataforma)

   - Envia dados          →    - Valida dados
   - Usa codes próprios   →    - Cria/atualiza registros
   - Sincroniza dados     →    - Mantém consistência
```

### Características Principais

1. **Baseado em Codes**: O sistema utiliza seus próprios identificadores (códigos de disciplinas, matrículas, etc.)
2. **Idempotente**: Pode executar sincronizações múltiplas vezes sem duplicar dados
3. **RESTful**: Padrão REST com JSON
4. **Autenticação simples**: API Key gerada no painel administrativo

## Autenticação

A API utiliza **API Keys** geradas no painel administrativo (Avançado > Integrações).

**Não há processo de login via API**. A API Key é incluída no header `Authorization: Bearer {token}` de todas as requisições.

**Importante**: API Key é exibida apenas uma vez durante criação. Guia completo em [Autenticação](autenticacao).

## Identificadores (Codes)

O sistema utiliza **identificadores próprios** (codes) do ERP para todas as entidades.

**Não é necessário** armazenar IDs internos da plataforma. Utilize códigos que já existem no sistema acadêmico.

**Idempotência**: Sincronizar múltiplas vezes com mesmo code atualiza ao invés de duplicar.

Detalhes completos em [Identificadores e Codes](identificadores-e-codes).

## Entidades Principais

A integração trabalha com as seguintes entidades:

### 1. Unidades (Units)
Campus ou unidades físicas da instituição.

**Exemplo**: Campus Centro, Campus Norte

### 2. Áreas (Areas)
Áreas de conhecimento que agrupam cursos.

**Exemplo**: Tecnologia da Informação, Ciências da Saúde

### 3. Cursos (Courses)
Cursos oferecidos pela instituição.

**Exemplo**: Ciência da Computação, Enfermagem

### 4. Disciplinas Base (Subjects)
Componentes curriculares que fazem parte dos cursos (grade curricular).

**Exemplo**: Algoritmos I, Banco de Dados, LIBRAS

**Importante**: Disciplinas Base são o cadastro no currículo, **sem** vínculo com semestre ou alunos.

### 5. Professores (Professors)
Docentes que lecionam disciplinas.

**Exemplo**: Dr. João Silva, Dra. Maria Santos

### 6. Alunos (Students)
Discentes matriculados nos cursos.

**Exemplo**: Pedro Oliveira, Ana Costa

### 7. Turmas (Enrollments / Active Subjects)
Disciplinas ativas vinculadas a um semestre específico, com professor e alunos matriculados.

**Exemplo**: "Algoritmos I - 2025.1" (turma com 30 alunos, Prof. João)

**Importante**: Turmas são instâncias de Disciplinas Base em um período letivo.

## Diferença: Disciplina Base vs Turma

- **Disciplina Base (Subject)**: Cadastro permanente no currículo (sem semestre, sem alunos)
- **Turma (Enrollment)**: Disciplina ativa em um semestre com professor e alunos matriculados

Explicação detalhada em [Conceitos Fundamentais](conceitos-fundamentais#diferen%C3%A7a-disciplina-base-vs-turma).

## Hierarquia de Entidades

Unidades → Áreas → Cursos → Disciplinas Base

Turmas vinculam: Disciplina Base + Professor + Alunos

Ver hierarquia completa em [Conceitos Fundamentais](conceitos-fundamentais#hierarquia-de-entidades).

## Fluxo de Integração

### Setup Inicial
1. Gerar API Key no painel administrativo
2. Sincronizar entidades na ordem: Unidades → Áreas → Cursos → Disciplinas Base → Professores/Alunos → Turmas

### Atualizações
Enviar apenas dados alterados. API atualiza automaticamente com base no code.

Detalhes completos em [Fluxo de Sincronização](fluxo-de-sincronizacao).

## Operações Disponíveis

### Consulta (GET)
Listar e buscar dados sincronizados.

**Scope necessário**: `read` ou `full`

**Exemplos**:
- `GET /integration/v1/units` - Listar unidades
- `GET /integration/v1/professors/PROF001` - Buscar professor por código

### Sincronização (POST)
Criar ou atualizar dados em lote.

**Scope necessário**: `write` ou `full`

**Exemplos**:
- `POST /integration/v1/units/sync` - Sincronizar unidades
- `POST /integration/v1/students/sync` - Sincronizar alunos

**Comportamento**:
- Se entidade com `code` existir: **atualiza** dados
- Se não existir: **cria** novo registro
- Operação é **idempotente** (pode executar múltiplas vezes)

## Segurança e Autenticação

### Scopes de Acesso

Ao gerar a API Key, define-se o scope:

- **read**: Permite apenas leitura (endpoints GET)
- **write**: Permite sincronização (endpoints POST /sync)
- **full**: Acesso completo (read + write)

### Rate Limiting

Limite configurável por API Client (padrão: 60 requisições/minuto).

Quando atingido o limite, a API retorna:

```json
{
  "success": false,
  "message": "Muitas tentativas. Por favor, tente novamente mais tarde.",
  "retry_after": 60,
  "status": 429
}
```

### Comunicação Segura

- **HTTPS obrigatório**: Todas as requisições devem usar protocolo seguro
- **Isolamento de dados**: Cada instituição acessa apenas seus próprios dados
- **API Key única**: Cada integração tem credenciais exclusivas

## Endpoints da API

### Base URL

```
https://TENANT.proextend.com.br/api/integration/v1/
```

Substitua `TENANT` pelo subdomínio correspondente.

### Principais Endpoints

#### Status e Monitoramento

```
GET /integration/v1/health              (público, sem autenticação)
GET /integration/v1/sync-status         (requer API Key)
```

#### Consultas (GET)

```
GET /integration/v1/units
GET /integration/v1/units/{code}
GET /integration/v1/areas
GET /integration/v1/courses
GET /integration/v1/subjects
GET /integration/v1/professors
GET /integration/v1/students
GET /integration/v1/enrollments
```

#### Sincronização (POST)

```
POST /integration/v1/units/sync
POST /integration/v1/areas/sync
POST /integration/v1/courses/sync
POST /integration/v1/subjects/sync
POST /integration/v1/professors/sync
POST /integration/v1/students/sync
POST /integration/v1/enrollments/sync
```

## Exemplo Básico

```bash
# 1. Sincronizar
POST /integration/v1/professors/sync
Authorization: Bearer pex_...

{
  "professors": [{
    "code": "PROF001",
    "name": "Dr. João Silva",
    "email": "joao@inst.edu.br",
    "cpf": "12345678901"
  }]
}

# 2. Consultar
GET /integration/v1/professors/PROF001
Authorization: Bearer pex_...
```

Exemplos completos em [Fluxo de Sincronização](fluxo-de-sincronizacao).

## Vantagens da Integração

1. **Simplicidade**: Utilize códigos próprios, sem IDs internos
2. **Idempotência**: Execute sincronizações quantas vezes quiser sem duplicar
3. **Flexibilidade**: Sincronize todas as entidades ou apenas as alteradas
4. **Rastreabilidade**: Todos os dados ficam vinculados aos codes do sistema
5. **Segurança**: Isolamento total de dados entre instituições

## Próximos Passos

Após compreender a visão geral da integração:

1. Leia [Conceitos Fundamentais](conceitos-fundamentais) para entender as entidades em detalhes
2. Configure [Autenticação](autenticacao) para começar a testar
3. Siga o [Fluxo de Sincronização](fluxo-de-sincronizacao) passo a passo
4. Implemente corretamente conforme [Identificadores e Codes](identificadores-e-codes)

## Suporte

Para questões sobre a integração ou problemas técnicos, consulte a equipe técnica da ProExtend.

## Recursos Adicionais

- **Coleção Postman**: Teste todos os endpoints com exemplos prontos
- **Health Check**: Monitore disponibilidade da API
- **Sync Status**: Acompanhe status das sincronizações
