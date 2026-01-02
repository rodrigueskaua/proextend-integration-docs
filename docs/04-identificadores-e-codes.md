---
layout: default
title: identificadores e codes
---

# Identificadores e Codes

## Introdução

Este documento explica como funcionam os identificadores (`codes`) na integração ProExtend e por que deve-se usá-los.

## Conceito Principal

**O sistema utiliza códigos próprios**. A plataforma ProExtend não gera identificadores pela API.

```
Sistema ERP           ProExtend API
code: "ALG001"       →      usa "ALG001" como identificador
code: "PROF001"      →      usa "PROF001" como identificador
code: "ALU2024001"   →      usa "ALU2024001" como identificador
```

## O que é um Code

Um **code** é o identificador único que definido no sistema e envia para a plataforma.

### Exemplos Práticos

**Unidades**:
- `"CAMPUS_CENTRO"`, `"SEDE"`, `"FILIAL_01"`

**Disciplinas**:
- `"ALG001"`, `"BD001"`, `"LIBRAS"`, `"MAT101"`

**Professores**:
- `"PROF001"` (matrícula)
- `"12345678901"` (CPF)
- `"JOS001"` (código funcional)

**Alunos**:
- `"ALU2024001"` (matrícula)
- `"98765432100"` (CPF)
- `"20241234"` (RA)

**Turmas**:
- `"ALG001-2025.1"` (disciplina + semestre)
- `"TURMA001"` (código único)

## Como Funcionam os Codes

### 1. Criação

Ao criar uma entidade, envia o `code`:

```json
{
  "subjects": [
    {
      "code": "ALG001",
      "name": "Algoritmos I",
      "course_code": "CC001"
    }
  ]
}
```

A plataforma armazena usando `"ALG001"` como identificador.

### 2. Atualização

Para atualizar, use o mesmo `code`:

```json
{
  "subjects": [
    {
      "code": "ALG001",
      "name": "Algoritmos e Programação I",
      "course_code": "CC001"
    }
  ]
}
```

A plataforma reconhece `"ALG001"` e **atualiza** os dados ao invés de criar duplicado.

### 3. Relacionamentos

Para vincular entidades, use os codes:

```json
{
  "enrollments": [
    {
      "code": "ALG001-2025.1",
      "subject_code": "ALG001",
      "professor_code": "PROF001",
      "semester": "2025.1",
      "student_codes": ["ALU2024001", "ALU2024002"]
    }
  ]
}
```

A plataforma usa os codes para encontrar e vincular as entidades corretas.

## Vantagens desta Abordagem

### 1. Simplicidade

Não é necessário armazenar IDs da plataforma. Utilize códigos próprios.

### 2. Idempotência

Pode sincronizar múltiplas vezes sem duplicar:

```
1ª sincronização: code "PROF001" → cria professor
2ª sincronização: code "PROF001" → atualiza professor (não duplica)
3ª sincronização: code "PROF001" → atualiza professor (não duplica)
```

### 3. Manutenibilidade

Os códigos são familiares para a equipe:
- "ALG001" é reconhecível
- "PROF-2023-001" tem significado
- "CAMPUS_CENTRO" é autoexplicativo

### 4. Independência

Não depende de IDs internos da plataforma que podem mudar.

## Boas Práticas

### Use Códigos Consistentes

✅ **Bom**:
```
Disciplinas: ALG001, ALG002, BD001, BD002
Professores: PROF001, PROF002, PROF003
Alunos: ALU2024001, ALU2024002, ALU2024003
```

❌ **Ruim** (inconsistente):
```
Disciplinas: alg1, Alg-002, bd_001
Professores: prof1, Professor002, p003
```

### Use Códigos Significativos

✅ **Bom**:
```
"CAMPUS_CENTRO" - indica localização
"ALG001" - sigla da disciplina
"2025.1" - ano e semestre claro
```

❌ **Ruim** (sem contexto):
```
"C1", "C2", "C3"
"D1", "D2", "D3"
```

### Mantenha Códigos Únicos

Cada entidade deve ter code único:

```
Professor code: "PROF001" - único entre todos os professores
Aluno code: "ALU2024001" - único entre todos os alunos
Disciplina code: "ALG001" - único entre todas as disciplinas
```

**Importante**: Codes podem se repetir entre **tipos diferentes**:
- Professor com code "001" ✅
- Aluno com code "001" ✅
- São entidades diferentes, sem conflito

### Use Códigos Estáveis

Evite mudar codes após criação:

✅ **Bom**:
```
Matrícula do professor nunca muda: "PROF001"
```

❌ **Ruim**:
```
Ano 1: "PROF-2024-001"
Ano 2: "PROF-2025-001" (mudou sem necessidade)
```

## Exemplos Práticos

### Exemplo 1: Sincronizar Disciplina

**ERP da Instituição**:
```
Tabela: disciplinas
┌────┬──────────┬─────────────────────┐
│ id │ codigo   │ nome                │
├────┼──────────┼─────────────────────┤
│ 1  │ ALG001   │ Algoritmos I        │
│ 2  │ BD001    │ Banco de Dados I    │
└────┴──────────┴─────────────────────┘
```

**Enviar para API**:
```json
{
  "subjects": [
    {
      "code": "ALG001",
      "name": "Algoritmos I",
      "course_code": "CC001"
    },
    {
      "code": "BD001",
      "name": "Banco de Dados I",
      "course_code": "CC001"
    }
  ]
}
```

**Não é necessário** armazenar nada além do que já tem no ERP.

### Exemplo 2: Sincronizar Turma

**ERP da Instituição**:
```
Tabela: turmas
┌────┬──────────────┬────────────┬──────────────┬──────────┐
│ id │ codigo       │ disciplina │ professor    │ semestre │
├────┼──────────────┼────────────┼──────────────┼──────────┤
│ 10 │ ALG001-25.1  │ ALG001     │ PROF001      │ 2025.1   │
└────┴──────────────┴────────────┴──────────────┴──────────┘

Tabela: matriculas
┌────────┬───────────┐
│ turma  │ aluno     │
├────────┼───────────┤
│ 10     │ ALU001    │
│ 10     │ ALU002    │
└────────┴───────────┘
```

**Enviar para API**:
```json
{
  "enrollments": [
    {
      "code": "ALG001-25.1",
      "subject_code": "ALG001",
      "professor_code": "PROF001",
      "semester": "2025.1",
      "student_codes": ["ALU001", "ALU002"]
    }
  ]
}
```

Utilize os códigos existentes no sistema!

### Exemplo 3: Atualizar Professor

**Situação**: Professor mudou de email

**ERP da Instituição**:
```sql
UPDATE professores
SET email = 'novo.email@faculdade.edu.br'
WHERE codigo = 'PROF001';
```

**Sincronizar mudança**:
```json
{
  "professors": [
    {
      "code": "PROF001",
      "name": "Dr. João Silva",
      "email": "novo.email@faculdade.edu.br",
      "cpf": "12345678901"
    }
  ]
}
```

A plataforma reconhece `"PROF001"` e atualiza o email automaticamente.

## Códigos Flexíveis

Alguns campos aceitam diferentes formatos de código:

### Professores e Alunos

Pode usar:
- Matrícula: `"PROF001"`, `"ALU2024001"`
- CPF: `"12345678901"`
- Código funcional: `"JOS001"`
- RA: `"20241234"`

**Importante**: Escolha um padrão e mantenha consistência.

### Turmas

Recomendamos incluir semestre no code:
- `"ALG001-2025.1"` - disciplina + semestre
- `"TURMA001-2025.1"` - código + semestre
- `"CC001-ALG001-2025.1"` - curso + disciplina + semestre

Isso facilita identificação e evita conflitos entre semestres.

## Erros Comuns

### Erro 1: Code Duplicado em Criação Inicial

❌ **Problema**:
```json
{
  "professors": [
    { "code": "PROF001", "name": "João", "email": "joao@f.br", "cpf": "111" },
    { "code": "PROF001", "name": "Maria", "email": "maria@f.br", "cpf": "222" }
  ]
}
```

**Erro**: Email duplicado (porque code duplicado tenta atualizar)

✅ **Solução**: Codes únicos
```json
{
  "professors": [
    { "code": "PROF001", "name": "João", "email": "joao@f.br", "cpf": "111" },
    { "code": "PROF002", "name": "Maria", "email": "maria@f.br", "cpf": "222" }
  ]
}
```

### Erro 2: Referência a Code Inexistente

❌ **Problema**:
```json
{
  "enrollments": [
    {
      "code": "TURMA001",
      "subject_code": "ALG999",  // disciplina não existe
      "professor_code": "PROF001",
      "semester": "2025.1",
      "student_codes": []
    }
  ]
}
```

**Erro**: Subject not found

✅ **Solução**: Sincronize disciplinas primeiro
```
1. Sincronizar disciplina ALG999
2. Depois sincronizar turma que usa ALG999
```

### Erro 3: Code Inválido (Vazio ou Nulo)

❌ **Problema**:
```json
{
  "subjects": [
    { "code": "", "name": "Algoritmos", "course_code": "CC001" }
  ]
}
```

**Erro**: Code é obrigatório

✅ **Solução**: Sempre forneça code válido
```json
{
  "subjects": [
    { "code": "ALG001", "name": "Algoritmos", "course_code": "CC001" }
  ]
}
```

## Checklist

Antes de sincronizar, verifique:

- [ ] Codes são únicos para cada entidade
- [ ] Codes seguem padrão consistente
- [ ] Codes não estão vazios ou nulos
- [ ] Referências (subject_code, professor_code, etc.) existem
- [ ] Codes não mudam desnecessariamente

## Resumo

1. **Os codes são definidos** - use seus próprios identificadores
2. **Sincronização idempotente** - mesmo code atualiza ao invés de duplicar
3. **Relacionamentos usam codes** - vincule entidades pelos codes
4. **Não precisa armazenar IDs da plataforma** - os codes são suficientes
5. **Mantenha consistência** - use padrão único e estável

## Próximos Passos

1. Revise os [Conceitos Fundamentais](01-conceitos-fundamentais.md)
2. Siga o [Fluxo de Sincronização](03-fluxo-de-sincronizacao.md)
3. Consulte a [Coleção Postman](../ProExtend-API.postman_collection.json) para exemplos

## Suporte

Para dúvidas sobre identificadores e codes, consulte a equipe técnica da ProExtend.
