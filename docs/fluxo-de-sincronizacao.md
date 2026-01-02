---
sidebar_position: 5
title: Fluxo de Sincronização
---

# Fluxo de Sincronização

## Introdução

Este documento descreve o processo completo de sincronização de dados entre o sistema acadêmico (ERP) e a plataforma ProExtend.

A ordem correta de sincronização é fundamental, pois muitas entidades dependem de outras já existentes.

## Ordem de Sincronização

### Sincronização Inicial (Setup Completo)

```
1. Verificar disponibilidade (Health Check)
   ↓
2. Sincronizar Unidades/Campus (Units)
   ↓
3. Sincronizar Áreas (Areas)
   ↓
4. Sincronizar Cursos (Courses)
   ↓
5. Sincronizar Disciplinas Base (Subjects)
   ↓
6. Sincronizar Professores (Professors)
   ↓
7. Sincronizar Alunos (Students)
   ↓
8. Sincronizar Disciplinas Ativas/Turmas com matrículas (Enrollments)
```

### Sincronizações Subsequentes

```
1. Identificar alterações no ERP
   ↓
2. Sincronizar apenas entidades alteradas
   ↓
3. Verificar status da sincronização
```

## Verificando Disponibilidade

Antes de iniciar, verifique se a API está operacional.

### Endpoint

```
GET /integration/v1/health
```

**Não requer autenticação** (endpoint público)

### Exemplo

```bash
curl -X GET https://tenant.proextend.com.br/api/integration/v1/health
```

### Resposta (API Saudável)

```json
{
  "success": true,
  "status": "healthy",
  "message": "API de Integração operacional",
  "data": {
    "api_version": "v1",
    "services": {
      "database": { "status": "ok" },
      "cache": { "status": "ok" }
    }
  }
}
```

## 1. Sincronizar Unidades

Unidades são campus ou filiais da instituição.

### Endpoint

```
POST /integration/v1/units/sync
```

### Exemplo de Requisição

```bash
curl -X POST https://tenant.proextend.com.br/api/integration/v1/units/sync \
  -H "Authorization: Bearer pex_..." \
  -H "Content-Type: application/json" \
  -d '{
    "units": [
      {
        "code": "CAMPUS_CENTRO",
        "name": "Campus Centro",
        "address": "Rua Principal, 123 - Centro, São Paulo - SP"
      },
      {
        "code": "CAMPUS_NORTE",
        "name": "Campus Zona Norte",
        "address": "Av. Norte, 456 - Zona Norte, São Paulo - SP"
      }
    ]
  }'
```

### Campos Obrigatórios

- `code`: Código único da unidade (ex: "CAMPUS_CENTRO")
- `name`: Nome da unidade

### Campos Opcionais

- `address`: Endereço completo

### Resposta

```json
{
  "success": true,
  "message": "Sincronização de unidades concluída.",
  "data": {
    "created": 2,
    "updated": 0,
    "failed": 0
  }
}
```

## 2. Sincronizar Áreas

Áreas de conhecimento que agrupam cursos.

**Depende de**: Unidades

### Endpoint

```
POST /integration/v1/areas/sync
```

### Exemplo

```json
{
  "areas": [
    {
      "code": "TECH",
      "name": "Tecnologia da Informação",
      "unit_code": "CAMPUS_CENTRO",
      "responsible_email": "coord.tech@faculdade.edu.br"
    },
    {
      "code": "HEALTH",
      "name": "Ciências da Saúde",
      "unit_code": "CAMPUS_NORTE"
    }
  ]
}
```

### Campos Obrigatórios

- `code`: Código único da área
- `name`: Nome da área
- `unit_code`: Código da unidade (deve existir)

### Campos Opcionais

- `responsible_email`: Email do responsável pela área

## 3. Sincronizar Cursos

Cursos oferecidos pela instituição.

**Depende de**: Unidades e Áreas

### Endpoint

```
POST /integration/v1/courses/sync
```

### Exemplo

```json
{
  "courses": [
    {
      "code": "CC001",
      "name": "Ciência da Computação",
      "description": "Bacharelado em Ciência da Computação - Duração 4 anos",
      "area_code": "TECH",
      "unit_code": "CAMPUS_CENTRO",
      "responsible_code": "PROF001"
    },
    {
      "code": "ENF001",
      "name": "Enfermagem",
      "description": "Bacharelado em Enfermagem - Duração 5 anos",
      "area_code": "HEALTH",
      "unit_code": "CAMPUS_NORTE",
      "responsible_email": "coord.enf@faculdade.edu.br"
    }
  ]
}
```

### Campos Obrigatórios

- `code`: Código único do curso
- `name`: Nome do curso
- `area_code`: Código da área (deve existir)
- `unit_code`: Código da unidade (deve existir)
- `responsible_email` **OU** `responsible_code`: Responsável pelo curso

### Campos Opcionais

- `description`: Descrição detalhada

**IMPORTANTE**: Use `responsible_email` (email do usuário) **OU** `responsible_code` (code de professor/admin). Se ambos forem fornecidos, `responsible_code` tem prioridade.

## 4. Sincronizar Disciplinas Base

Disciplinas do currículo dos cursos (grade curricular).

**Depende de**: Cursos

### Endpoint

```
POST /integration/v1/subjects/sync
```

### Exemplo

```json
{
  "subjects": [
    {
      "code": "ALG001",
      "name": "Algoritmos e Programação I",
      "description": "Introdução a algoritmos e lógica de programação",
      "course_code": "CC001"
    },
    {
      "code": "BD001",
      "name": "Banco de Dados I",
      "description": "Fundamentos de banco de dados relacionais",
      "course_code": "CC001"
    },
    {
      "code": "LIBRAS",
      "name": "Língua Brasileira de Sinais",
      "course_code": "CC001",
      "type": "optativa"
    }
  ]
}
```

### Campos Obrigatórios

- `code`: Código único da disciplina
- `name`: Nome da disciplina
- `course_code`: Código do curso (deve existir)

### Campos Opcionais

- `description`: Descrição da disciplina
- `type`: Tipo de disciplina
  - `obrigatoria` (padrão se omitido)
  - `optativa`
  - `eletiva`

## 5. Sincronizar Professores

Docentes da instituição.

**Independente** (pode ser sincronizado a qualquer momento)

### Endpoint

```
POST /integration/v1/professors/sync
```

### Exemplo

```json
{
  "professors": [
    {
      "code": "PROF001",
      "name": "Dr. João Silva",
      "email": "joao.silva@faculdade.edu.br",
      "cpf": "12345678901",
      "phone": "11999999999",
      "area_code": "TECH"
    },
    {
      "code": "PROF002",
      "name": "Dra. Maria Santos",
      "email": "maria.santos@faculdade.edu.br",
      "cpf": "98765432100",
      "area_code": "TECH"
    }
  ]
}
```

### Campos Obrigatórios

- `code`: Código único do professor (matrícula, CPF ou código funcional)
- `name`: Nome completo
- `email`: Email institucional (deve ser único)
- `cpf`: CPF (11 dígitos numéricos)

### Campos Opcionais

- `phone`: Telefone
- `area_code`: Código da área (se existir)

**IMPORTANTE**:
- Email duplicado gera erro 422
- CPF duplicado gera erro 422
- A plataforma cria usuário automaticamente com senha aleatória

## 6. Sincronizar Alunos

Discentes matriculados nos cursos.

**Independente** (pode ser sincronizado a qualquer momento)

### Endpoint

```
POST /integration/v1/students/sync
```

### Exemplo

```json
{
  "students": [
    {
      "code": "ALU2024001",
      "name": "Pedro Oliveira Santos",
      "email": "pedro.oliveira@aluno.edu.br",
      "cpf": "11122233344",
      "phone": "11977777777",
      "course_code": "CC001"
    },
    {
      "code": "12345678901",
      "name": "Ana Costa Ferreira",
      "email": "ana.costa@aluno.edu.br",
      "cpf": "12345678901",
      "course_code": "ENF001"
    }
  ]
}
```

### Campos Obrigatórios

- `code`: Código único do aluno (matrícula, CPF ou RA)
- `name`: Nome completo
- `email`: Email institucional (deve ser único)
- `course_code`: Código do curso (deve existir)

### Campos Opcionais

- `cpf`: CPF (11 dígitos) - se fornecido, deve ser único
- `phone`: Telefone

**IMPORTANTE**:
- O campo `code` é flexível: pode ser matrícula, CPF ou RA
- A plataforma cria usuário automaticamente com senha aleatória

## 7. Sincronizar Turmas (Enrollments)

Turmas são disciplinas ativas em um semestre com professor e alunos vinculados.

**Depende de**: Disciplinas Base, Professores e Alunos

### Endpoint

```
POST /integration/v1/enrollments/sync
```

### Exemplo

```json
{
  "enrollments": [
    {
      "code": "ALG001-2025.1",
      "subject_code": "ALG001",
      "professor_code": "PROF001",
      "semester": "2025.1",
      "student_codes": [
        "ALU2024001",
        "ALU2024002"
      ]
    },
    {
      "code": "BD001-2025.1",
      "subject_code": "BD001",
      "professor_code": "PROF002",
      "semester": "2025.1",
      "student_codes": [
        "ALU2024001"
      ]
    }
  ]
}
```

### Campos Obrigatórios

- `code`: Código único da turma (ex: "ALG001-2025.1", "TURMA001")
- `subject_code`: Código da disciplina base (deve existir)
- `professor_code`: Código do professor (deve existir)
- `semester`: Período letivo (formato: "YYYY.N", ex: "2025.1", "2025.2")
- `student_codes`: Array de códigos de alunos (devem existir)

**IMPORTANTE**:
- Se turma com `code` existir: atualiza professor e lista de alunos
- Se não existir: cria nova turma
- Alunos removidos da lista são desvinculados
- Alunos adicionados são vinculados

## Consultando Status da Sincronização

Após a sincronização, é possível verificar o status geral.

### Endpoint

```
GET /integration/v1/sync-status
```

### Exemplo

```bash
curl -X GET https://tenant.proextend.com.br/api/integration/v1/sync-status \
  -H "Authorization: Bearer pex_..."
```

### Resposta

```json
{
  "success": true,
  "data": {
    "last_sync": {
      "timestamp": "2025-12-31T10:00:00Z",
      "minutes_ago": 15
    },
    "entities": {
      "units": { "total": 3 },
      "areas": { "total": 8 },
      "courses": { "total": 15 },
      "subjects": { "total": 120 },
      "professors": { "total": 45 },
      "students": { "total": 850 },
      "enrollments": { "total": 2340 }
    },
    "api_client": {
      "name": "Integração - Acesso Completo",
      "scope": "full",
      "rate_limit": 60
    }
  }
}
```

## Consultando Dados Sincronizados

Após a sincronização, é possível consultar os dados.

### Listar Unidades

```
GET /integration/v1/units?per_page=50&page=1&search=centro
```

### Buscar Unidade por Código

```
GET /integration/v1/units/CAMPUS_CENTRO
```

### Buscar Professor por Código

```
GET /integration/v1/professors/PROF001
```

### Listar Turmas do Professor

```
GET /integration/v1/professors/PROF001/subjects
```

### Buscar Turma por Código

```
GET /integration/v1/enrollments/ALG001-2025.1
```

## Tratamento de Erros

### Erros de Dependência

**Problema**: Tentar criar curso antes de área/unidade

```json
{
  "success": false,
  "message": "Validation error",
  "errors": {
    "area_code": ["A área selecionada não existe"]
  }
}
```

**Solução**: Sincronizar dependências primeiro (units → areas → courses)

### Erros de Duplicação

**Problema**: Email duplicado

```json
{
  "success": false,
  "message": "Validation error",
  "errors": {
    "email": ["Email já cadastrado"]
  }
}
```

**Solução**: A sincronização é idempotente. Se o `code` já existe, a API **atualiza** ao invés de criar.

### Erros de Validação

```json
{
  "success": false,
  "message": "Validation error",
  "errors": {
    "cpf": ["CPF deve conter 11 dígitos"]
  }
}
```

**Solução**: Validar dados antes de enviar

## Estratégias de Sincronização

### Sincronização Completa (Recomendada para Setup Inicial)

Sincronize todas as entidades na ordem correta.

```php
<?php

// 1. Unidades
syncUnits($allUnits);

// 2. Áreas
syncAreas($allAreas);

// 3. Cursos
syncCourses($allCourses);

// 4. Disciplinas Base
syncSubjects($allSubjects);

// 5. Professores
syncProfessors($allProfessors);

// 6. Alunos
syncStudents($allStudents);

// 7. Turmas
syncEnrollments($allEnrollments);
```

### Sincronização Incremental (Recomendada para Atualizações)

Sincronize apenas dados alterados desde a última sincronização.

```php
<?php

$lastSync = getLastSyncTimestamp();

// Identificar entidades alteradas desde $lastSync
$changedProfessors = getProfessorsChangedSince($lastSync);
$changedStudents = getStudentsChangedSince($lastSync);
$changedEnrollments = getEnrollmentsChangedSince($lastSync);

// Sincronizar apenas alterações
if (!empty($changedProfessors)) {
    syncProfessors($changedProfessors);
}

if (!empty($changedStudents)) {
    syncStudents($changedStudents);
}

if (!empty($changedEnrollments)) {
    syncEnrollments($changedEnrollments);
}

// Atualizar timestamp
updateLastSyncTimestamp();
```

### Sincronização em Lote

Agrupe múltiplos registros em uma única requisição.

```json
{
  "professors": [
    { "code": "PROF001", "name": "Dr. João", ... },
    { "code": "PROF002", "name": "Dra. Maria", ... },
    { "code": "PROF003", "name": "Dr. Carlos", ... }
  ]
}
```

**Recomendação**: Envie lotes de até 100 registros por requisição.

## Boas Práticas

### 1. Respeite a Ordem de Sincronização

```
Unidades/Campus (Units) → Áreas (Areas) → Cursos (Courses) → Disciplinas Base (Subjects) → Professores (Professors)/Alunos (Students) → Disciplinas Ativas/Turmas (Enrollments)
```

### 2. Valide Dados Antes de Enviar

- CPF deve ter 11 dígitos
- Email deve ser válido e único
- Codes devem ser únicos
- Referências (area_code, unit_code) devem existir

### 3. Implemente Retry com Backoff

Para erros temporários (500, 503), tente novamente com intervalo crescente.

### 4. Monitore Taxa de Sucesso

Acompanhe quantos registros foram criados vs falharam.

### 5. Use Sincronização Incremental

Após setup inicial, sincronize apenas alterações.

## Checklist de Sincronização

### Antes de Iniciar

- [ ] API Key configurada e testada
- [ ] Health check retorna status "healthy"
- [ ] Dados validados no ERP
- [ ] Tratamento de erros implementado

### Durante a Sincronização

- [ ] Seguir ordem correta de dependências
- [ ] Monitorar erros e fazer retry quando apropriado
- [ ] Agrupar registros em lotes (até 100 por vez)

### Após a Sincronização

- [ ] Verificar sync-status
- [ ] Confirmar totais de registros
- [ ] Revisar logs de erro
- [ ] Testar consultas (GET endpoints)
- [ ] Validar vínculos (turma-professor-alunos)

## Próximos Passos

1. Entenda [Identificadores e Codes](identificadores-e-codes)
2. Consulte a [Postman Collection](postman) para testes
3. Configure sincronização periódica

## Suporte

Para dúvidas sobre o fluxo de sincronização, consulte a equipe técnica da ProExtend.
