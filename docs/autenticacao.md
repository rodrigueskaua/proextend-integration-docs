---
sidebar_position: 4
title: Autenticação
---

# Autenticação

## Introdução

A autenticação na API de Integração ProExtend é baseada em **API Keys** geradas diretamente no painel administrativo da plataforma.

**Não há processo de login via API**. A API Key é gerada uma vez no painel e usa em todas as requisições.

## Como Funciona

### Modelo Simplificado

```
1. Admin acessa painel ProExtend
   ↓
2. Gera API Key com configurações
   ↓
3. Copia token (pex_xxxxxxxxxxxxxxxxxxxxxxxx)
   ↓
4. Usa token no header Authorization de todas as requisições
```

**Pronto!** Não há renovação, não há login separado, não há token de sessão.

## Gerando API Key no Painel Administrativo

**IMPORTANTE**: Apenas administradores com as permissões necessárias podem gerar, editar ou deletar API Keys de autenticação.

### Passo 1: Acessar Área de Integrações

1. Faça login no painel administrativo do ProExtend como administrador
2. Navegue até: **Avançado > Integrações**
3. Serão exibidos a lista de API Keys existentes (se houver)

### Passo 2: Criar Nova API Key

Clique em **"Gerar Nova API Key"** ou **"Criar API Client"**

### Passo 3: Configurar API Client

Preencha as informações:

#### Nome
Identificador descritivo para a integração.

**Exemplos**:
- "Integração ERP Produção"
- "Sistema Acadêmico - Sincronização"
- "Totvs RM - API"

#### Scope (Escopo de Acesso)

Defina o nível de permissão:

- **read**: Apenas leitura (endpoints GET)
  - Listar unidades, professores, alunos, etc.
  - Buscar dados específicos
  - Consultar status de sincronização

- **write**: Apenas escrita (endpoints POST /sync)
  - Sincronizar dados
  - Criar/atualizar registros
  - **Não permite consultas**

- **full**: Acesso completo (read + write)
  - Todas as operações de leitura
  - Todas as operações de sincronização
  - **Recomendado para integrações completas**

**Recomendação**: Use `full` para integrações completas de ERP.

#### Rate Limit (Limite de Requisições)

Número máximo de requisições por minuto.

**Padrão**: 60 requisições/minuto

**Exemplos**:
- **60/min**: Para sincronizações normais
- **120/min**: Para sincronizações de grande volume
- **30/min**: Para consultas ocasionais

### Passo 4: Copiar API Key

Após criar, a plataforma exibe a API Key gerada:

```
pex_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```

**CRÍTICO - ATENÇÃO**:
- **A chave completa só é exibida UMA VEZ** durante a criação
- Copie e armazene imediatamente em local seguro
- **Não será possível visualizar a chave novamente** após fechar esta tela
- Se perder a chave, será necessário gerar uma nova API Key
- **Gerar uma nova API Key desconectará todos os serviços** que usam a chave atual
- Planeje a substituição da chave em todos os sistemas antes de regenerar

## Usando API Key nas Requisições

### Formato do Header

Todas as requisições à API de integração devem incluir:

```
Authorization: Bearer pex_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
Content-Type: application/json
```

### Exemplo de Requisição

```bash
curl -X GET https://tenant.proextend.com.br/api/integration/v1/units \
  -H "Authorization: Bearer pex_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6" \
  -H "Content-Type: application/json"
```

## Gerenciamento de API Keys

### Visualizar API Keys Existentes

No painel administrativo:
1. Acesse **Avançado > Integrações**
2. Serão exibidos lista com:
   - Nome da integração
   - Scope configurado
   - Rate limit
   - Status (ativa/inativa)
   - Data de criação
   - Última sincronização

### Editar API Key

É possível atualizar:
- ✅ Nome da integração
- ✅ Scope de acesso
- ✅ Rate limit
- ❌ Token (não pode ser editado, apenas regenerado)

### Regenerar API Key

Se a chave foi comprometida ou perdida:

**ATENÇÃO**: Regenerar uma API Key desconectará imediatamente todos os serviços que a utilizam.

1. Acesse a API Key específica
2. Clique em **"Regenerar Token"**
3. Confirme a ação
4. **CRÍTICO**: O token antigo será **invalidado imediatamente**
5. **A nova chave será exibida apenas uma vez** - copie imediatamente
6. Atualize a nova chave em **todos os sistemas** que usam a integração

**Recomendação**:
- Planeje a substituição com antecedência
- Atualize todos os sistemas em paralelo para minimizar downtime
- Considere criar uma nova API Key temporária ao invés de regenerar, permitindo migração gradual

### Ativar/Desativar API Key

É possível desativar temporariamente uma API Key sem deletá-la:

1. Acesse a API Key específica
2. Clique em **"Desativar"** ou use o toggle de status
3. Requisições com essa chave retornarão erro 401

**Uso**: Útil para manutenção ou suspensão temporária da integração.

### Deletar API Key

Para remover permanentemente:

1. Acesse a API Key específica
2. Clique em **"Deletar"**
3. Confirme a ação
4. A chave é removida e não pode ser recuperada

## Monitoramento e Logs

### Visualizar Logs de Acesso

No painel administrativo é possível ver:

- **Total de requisições**: Quantidade de chamadas feitas
- **Taxa de sucesso**: Percentual de requisições bem-sucedidas
- **Últimas requisições**: Log detalhado com:
  - Endpoint acessado
  - Método HTTP
  - Status da resposta
  - Data/hora
  - IP de origem

### Estatísticas

Acesse estatísticas detalhadas:

- Requisições por dia/hora
- Endpoints mais utilizados
- Erros mais frequentes
- Tempo médio de resposta

## Tratamento de Erros

### Referência de Códigos de Erro

| Código | Nome | Descrição | Solução |
|--------|------|-----------|---------|
| **401** | Unauthorized | API Key inválida, desativada ou ausente | Verificar token no header `Authorization: Bearer pex_...` e status no painel |
| **403** | Forbidden | Scope insuficiente para operação | Alterar scope para `full` ou usar API Key com permissões adequadas |
| **404** | Not Found | Recurso não encontrado | Verificar se code/endpoint existe |
| **422** | Unprocessable Entity | Dados inválidos | Validar campos obrigatórios e formatos (CPF, email, etc.) |
| **429** | Too Many Requests | Rate limit atingido | Aguardar `retry_after` segundos e implementar backoff |
| **500** | Internal Server Error | Erro interno no servidor | Contatar suporte técnico |
| **503** | Service Unavailable | API temporariamente indisponível | Tentar novamente após alguns minutos |

### Detalhes dos Erros

#### 401 Unauthorized
```json
{
  "success": false,
  "message": "Unauthenticated",
  "status": 401
}
```

**Causas**: API Key incorreta, desativada, deletada ou ausente no header

**Solução**: Verificar token e status no painel (Avançado > Integrações)

#### 403 Forbidden
```json
{
  "success": false,
  "message": "Insufficient scope",
  "status": 403
}
```

**Causas**: Tentativa de sincronizar com scope `read` ou consultar com scope `write`

**Solução**: Alterar scope para `full` no painel

#### 429 Too Many Requests
```json
{
  "success": false,
  "message": "Muitas tentativas. Por favor, tente novamente mais tarde.",
  "retry_after": 60,
  "status": 429
}
```

**Causas**: Excesso de requisições (limite por minuto atingido)

**Solução**: Aguardar `retry_after` segundos, implementar backoff exponencial ou aumentar rate limit no painel

## Segurança

### Boas Práticas

- Restrinja acesso à API Key apenas a pessoal autorizado
- Documente quem tem acesso à chave
- Revise periodicamente os acessos
- Estabeleça política de rotação (ex: a cada 6 meses)
- Regenere se houver suspeita de vazamento
- Teste nova chave antes de invalidar antiga

### Em Caso de Vazamento

Se a API Key foi exposta:

1. **Acesse imediatamente o painel**
2. **Desative a API Key** (interrompe acesso imediatamente)
3. **Gere uma nova API Key** (será exibida apenas uma vez - copie!)
4. **Atualize a nova chave em todos os sistemas**
5. **Delete a API Key comprometida**
6. **Revise logs** para identificar acessos não autorizados
7. **Notifique equipe de segurança** se necessário

**Lembre-se**: A nova API Key será exibida apenas uma vez. Certifique-se de copiá-la antes de fechar a tela de criação.

## Checklist de Configuração

Antes de iniciar a integração:

- [ ] API Key gerada no painel administrativo
- [ ] Scope configurado corretamente (recomendado: `full`)
- [ ] Rate limit adequado ao volume de sincronização
- [ ] API Key armazenada com segurança
- [ ] Header `Authorization` configurado corretamente
- [ ] Teste de conexão realizado (`GET /health`)
- [ ] Tratamento de erros 401, 403 e 429 implementado
- [ ] Logs de acesso configurados
- [ ] Documentação interna criada (quem tem acesso)

## Próximos Passos

Após configurar a autenticação:

1. Teste a conexão com [Health Check](fluxo-de-sincronizacao#verificando-disponibilidade)
2. Siga o [Fluxo de Sincronização](fluxo-de-sincronizacao) completo
3. Entenda [Identificadores e Codes](identificadores-e-codes)

## Suporte

Para problemas de autenticação, geração ou renovação de API Keys, entre em contato com a equipe técnica da ProExtend.
