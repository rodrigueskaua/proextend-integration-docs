# Conceitos Fundamentais

## Introdução

Este documento explica as entidades fundamentais da integração ProExtend e como elas se relacionam.

## Modelo de Dados

### Hierarquia de Entidades

```
Instituição
├── Unidades (Units)
│   └── Áreas (Areas)
│       └── Cursos (Courses)
│           └── Disciplinas Base (Subjects)
│
├── Professores (Professors)
│
├── Alunos (Students)
│
└── Turmas (Enrollments)
    ├── Disciplina Base
    ├── Professor
    └── Alunos
```

## Entidades Detalhadas

### 1. Unidade (Unit)

Campus ou unidade física da instituição.

#### Atributos

- **code**: Código único da unidade (ex: "CAMPUS_CENTRO", "SEDE")
- **name**: Nome da unidade
- **address**: Endereço completo (opcional)

#### Exemplo

```json
{
  "code": "CAMPUS_CENTRO",
  "name": "Campus Centro",
  "address": "Rua Principal, 123 - Centro, São Paulo - SP"
}
```

#### Características

- Entidade independente
- Pode ter múltiplas áreas
- Primeira entidade a ser sincronizada

---

### 2. Área (Area)

Área de conhecimento que agrupa cursos relacionados.

#### Atributos

- **code**: Código único da área (ex: "TECH", "HEALTH")
- **name**: Nome da área
- **unit_code**: Código da unidade (obrigatório, deve existir)
- **responsible_email**: Email do responsável (opcional)

#### Exemplo

```json
{
  "code": "TECH",
  "name": "Tecnologia da Informação",
  "unit_code": "CAMPUS_CENTRO",
  "responsible_email": "coord.tech@faculdade.edu.br"
}
```

#### Características

- **Depende de**: Unidade
- Agrupa cursos relacionados
- Pode ter coordenador responsável

---

### 3. Curso (Course)

Curso de graduação ou pós-graduação oferecido pela instituição.

#### Atributos

- **code**: Código único do curso (ex: "CC001", "ENF001")
- **name**: Nome do curso
- **description**: Descrição detalhada (opcional)
- **area_code**: Código da área (obrigatório, deve existir)
- **unit_code**: Código da unidade (obrigatório, deve existir)
- **responsible_email** OU **responsible_code**: Coordenador do curso

#### Exemplo

```json
{
  "code": "CC001",
  "name": "Ciência da Computação",
  "description": "Bacharelado em Ciência da Computação - Duração 4 anos",
  "area_code": "TECH",
  "unit_code": "CAMPUS_CENTRO",
  "responsible_code": "PROF001"
}
```

#### Características

- **Depende de**: Unidade e Área
- Pode usar `responsible_email` (email) OU `responsible_code` (code do usuário)
- Se ambos forem fornecidos, `responsible_code` tem prioridade

---

### 4. Disciplina Base (Subject)

Componente curricular que faz parte da grade do curso.

#### Atributos

- **code**: Código único da disciplina (ex: "ALG001", "LIBRAS")
- **name**: Nome da disciplina
- **description**: Ementa ou descrição (opcional)
- **course_code**: Código do curso (obrigatório, deve existir)
- **type**: Tipo da disciplina (opcional, padrão: "obrigatoria")
  - `obrigatoria`: Disciplina obrigatória
  - `optativa`: Disciplina optativa
  - `eletiva`: Disciplina eletiva

#### Exemplo

```json
{
  "code": "ALG001",
  "name": "Algoritmos e Programação I",
  "description": "Introdução a algoritmos e lógica de programação",
  "course_code": "CC001",
  "type": "obrigatoria"
}
```

#### Características

- **Depende de**: Curso
- Representa matéria do currículo (**NÃO** tem vínculo com semestre ou alunos)
- Disciplinas Base são usadas para criar Turmas (Enrollments)

---

### 5. Professor (Professor)

Docente que leciona disciplinas na instituição.

#### Atributos

- **code**: Código único do professor (matrícula, CPF ou código funcional)
- **name**: Nome completo
- **email**: Email institucional (obrigatório, único)
- **cpf**: CPF (obrigatório, 11 dígitos)
- **phone**: Telefone (opcional)
- **area_code**: Código da área de atuação (opcional)

#### Exemplo

```json
{
  "code": "PROF001",
  "name": "Dr. João Silva",
  "email": "joao.silva@faculdade.edu.br",
  "cpf": "12345678901",
  "phone": "11999999999",
  "area_code": "TECH"
}
```

#### Características

- Entidade independente (pode ser sincronizada a qualquer momento)
- Email deve ser único em toda a instituição
- CPF deve ser único
- Plataforma cria usuário automaticamente com senha aleatória
- Pode lecionar em múltiplas turmas

---

### 6. Aluno (Student)

Discente matriculado em um curso da instituição.

#### Atributos

- **code**: Código único do aluno (matrícula, CPF ou RA)
- **name**: Nome completo
- **email**: Email institucional (obrigatório, único)
- **cpf**: CPF (opcional, se fornecido deve ter 11 dígitos e ser único)
- **phone**: Telefone (opcional)
- **course_code**: Código do curso (obrigatório, deve existir)

#### Exemplo

```json
{
  "code": "ALU2024001",
  "name": "Pedro Oliveira Santos",
  "email": "pedro.oliveira@aluno.edu.br",
  "cpf": "11122233344",
  "phone": "11977777777",
  "course_code": "CC001"
}
```

#### Características

- Entidade independente (pode ser sincronizada a qualquer momento)
- Email deve ser único
- Campo `code` é flexível: pode ser matrícula, CPF ou RA
- Plataforma cria usuário automaticamente
- Pode estar matriculado em múltiplas turmas

---

### 7. Turma (Enrollment / Active Subject)

Disciplina ativa vinculada a um semestre específico, com professor e alunos matriculados.

#### Atributos

- **code**: Código único da turma (ex: "ALG001-2025.1", "TURMA001")
- **subject_code**: Código da disciplina base (obrigatório, deve existir)
- **professor_code**: Código do professor responsável (obrigatório, deve existir)
- **semester**: Período letivo (obrigatório, formato: "YYYY.N")
- **student_codes**: Array de códigos de alunos (obrigatório, devem existir)

#### Exemplo

```json
{
  "code": "ALG001-2025.1",
  "subject_code": "ALG001",
  "professor_code": "PROF001",
  "semester": "2025.1",
  "student_codes": ["ALU2024001", "ALU2024002", "ALU2024003"]
}
```

#### Características

- **Depende de**: Disciplina Base, Professor e Alunos
- Representa disciplina **ativa** em um semestre específico
- Vincula professor + alunos + disciplina + período
- Se `code` já existir: atualiza professor e lista de alunos
- Alunos removidos da lista são desvinculados automaticamente

---

## Diferença: Disciplina Base vs Turma

Esta é uma distinção importante:

### Disciplina Base (Subject)

Cadastro **permanente** da matéria no currículo do curso.

```json
{
  "code": "ALG001",
  "name": "Algoritmos e Programação I",
  "course_code": "CC001"
}
```

- Não tem semestre
- Não tem professor vinculado
- Não tem alunos vinculados
- É o "molde" para criar turmas

### Turma (Enrollment)

Instância **ativa** da disciplina em um semestre, com professor e alunos.

```json
{
  "code": "ALG001-2025.1",
  "subject_code": "ALG001",
  "professor_code": "PROF001",
  "semester": "2025.1",
  "student_codes": ["ALU2024001", "ALU2024002"]
}
```

- Tem semestre definido
- Tem professor responsável
- Tem alunos matriculados
- É a "turma real" que acontece

### Exemplo Visual

```
DISCIPLINA BASE (Cadastro no Currículo)
┌──────────────────────────────────┐
│ code: ALG001                     │
│ name: Algoritmos I               │
│ course: Ciência da Computação    │
└──────────────────────────────────┘
              ↓
        (usada para criar)
              ↓
TURMAS (Disciplinas Ativas por Semestre)
┌─────────────────────────────────────┐
│ code: ALG001-2025.1                 │
│ subject: ALG001                     │
│ professor: Prof. João (PROF001)     │
│ semester: 2025.1                    │
│ students: 30 alunos                 │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│ code: ALG001-2025.2                 │
│ subject: ALG001                     │
│ professor: Profa. Maria (PROF002)   │
│ semester: 2025.2                    │
│ students: 35 alunos                 │
└─────────────────────────────────────┘
```

## Relacionamentos entre Entidades

### Dependências de Criação

Ordem obrigatória para sincronização:

```
1. Unidades/Campus (Units) - independente
   ↓
2. Áreas (Areas) - depende de Unidades
   ↓
3. Cursos (Courses) - depende de Unidades + Áreas
   ↓
4. Disciplinas Base (Subjects) - depende de Cursos

5. Professores (Professors) - independente
6. Alunos (Students) - independente, mas depende de Cursos

7. Disciplinas Ativas/Turmas (Enrollments) - depende de Disciplinas Base + Professores + Alunos
```

### Diagrama de Relacionamentos

```
Unidade/Campus (Unit) ──→ Área (Area) ──→ Curso (Course) ──→ Disciplina Base (Subject)
                                                                        ↓
                                                        Disciplina Ativa/Turma (Enrollment) ←── Professor (Professor)
                                                                        ↑
                                                                   Aluno (Student)
```

## Campos Obrigatórios vs Opcionais

### Resumo por Entidade

| Entidade | Campos Obrigatórios | Campos Opcionais |
|----------|---------------------|------------------|
| Unidade/Campus (Unit) | code, name | address |
| Área (Area) | code, name, unit_code | responsible_email |
| Curso (Course) | code, name, area_code, unit_code, responsible* | description |
| Disciplina Base (Subject) | code, name, course_code | description, type |
| Professor (Professor) | code, name, email, cpf | phone, area_code |
| Aluno (Student) | code, name, email, course_code | cpf, phone |
| Disciplina Ativa/Turma (Enrollment) | code, subject_code, professor_code, semester, student_codes | - |

\* Course requer `responsible_email` **OU** `responsible_code`

## Boas Práticas

### Nomenclatura de Codes

✅ **Bom**:
- Unidades: `"CAMPUS_CENTRO"`, `"SEDE"`, `"FILIAL_SP"`
- Disciplinas: `"ALG001"`, `"BD002"`, `"LIBRAS"`
- Turmas: `"ALG001-2025.1"`, `"TURMA-2025.1-001"`

❌ **Evite**:
- Codes genéricos: `"001"`, `"ABC"`, `"X"`
- Inconsistência: `"alg1"`, `"Alg-002"`, `"ALG_003"`

### Regras de Validação de Campos

| Campo | Regra | Formato/Exemplo |
|-------|-------|-----------------|
| **code** | Obrigatório, único por tipo de entidade | Alfanumérico, até 100 caracteres |
| **cpf** | 11 dígitos, único (quando fornecido) | `"12345678901"` (apenas números) |
| **email** | Formato válido, único | `"usuario@dominio.com"` |
| **phone** | Opcional, formato flexível | `"11999999999"` ou `"(11) 99999-9999"` |
| **semester** | Formato ano.período | `"2025.1"`, `"2025.2"` |
| **codes** de referência | Devem existir previamente | `area_code`, `unit_code`, `course_code`, etc. |

**Validações automáticas**:
- CPF: Valida formato e dígitos verificadores
- Email: Valida formato e unicidade
- Codes: Valida unicidade dentro do tipo de entidade
- Referências: Valida existência antes de criar vínculo

### Tratamento de Códigos

Utilize códigos do próprio sistema:
- Matrícula do professor: `"PROF-2023-001"`
- Código da disciplina: `"CC-ALG-001"`
- RA do aluno: `"202410001"`

**Não invente códigos novos**. Utilize os códigos existentes no ERP.

## Glossário

- **Unidade/Campus (Unit)**: Campus ou filial da instituição
- **Área (Area)**: Área de conhecimento (ex: Tecnologia, Saúde)
- **Curso (Course)**: Curso de graduação/pós-graduação
- **Disciplina Base (Subject)**: Disciplina do currículo (cadastro base, sem semestre)
- **Disciplina Ativa/Turma (Enrollment)**: Turma ativa (disciplina + semestre + professor + alunos)
- **Professor (Professor)**: Docente
- **Aluno (Student)**: Discente
- **Code**: Identificador único definido pelo ERP
- **Semestre (Semester)**: Período letivo (formato "YYYY.N")

## Próximos Passos

1. Configure [Autenticação](02-autenticacao.md)
2. Siga o [Fluxo de Sincronização](03-fluxo-de-sincronizacao.md)
3. Entenda [Identificadores e Codes](04-identificadores-e-codes.md)

## Suporte

Para dúvidas sobre as entidades e conceitos, consulte a equipe técnica da ProExtend.
