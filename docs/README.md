# Processo de Desenvolvimento - Custom Node n8n

Este documento detalha o processo completo de desenvolvimento do custom node, incluindo desafios enfrentados, decisões técnicas tomadas e aprendizados obtidos durante a implementação.

## Análise do Desafio

### Requisitos Identificados

**Funcionais:**
- Custom node chamado "Random" 
- Operação única: "True Random Number Generator"
- Inputs: Min e Max (números inteiros)
- Integração obrigatória com Random.org API
- Estilo programático (não declarativo)

**Não Funcionais:**
- n8n self-hosted local (versão 1.85.4 latest)
- Docker Compose + PostgreSQL
- Node.js 22 + TypeScript
- Documentação completa
- Ícone SVG personalizado

## Arquitetura da Solução

### Decisões Técnicas Principais

**1. Estrutura de Operações**
```typescript
// Implementação com operação única
properties: [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        options: [{
            name: 'True Random Number Generator',
            value: 'generator'
        }]
    }
]
```

**2. Validação de Inputs**
```typescript
displayOptions: {
    show: {
        operation: ['generator']
    }
}
```

**3. Integração com API Externa**
```typescript
const options = {
    method: 'GET' as const,
    url: `https://www.random.org/integers/?num=1&min=${min}&max=${max}&col=1&base=10&format=plain&rnd=new`,
};
const response = await this.helpers.request(options);
```

## Problemas Enfrentados e Soluções

### 1. Configuração Script PostgreSQL

**Problema:** Script de inicialização não executava por formato de arquivo incorreto.

**Logs de Erro:**
```
cannot execute: required file not found
```

**Solução:**
- Conversão CRLF → LF
- Validação de sintaxe bash

### 2. Compatibilidade Cross-Platform

**Problema:** Comandos Unix (cp, mkdir) não funcionam no Windows.

**Solução Implementada:**
```json
{
  "scripts": {
    "copy-icons": "cpy 'nodes/*.svg' dist/nodes"
  },
  "devDependencies": {
    "cpy-cli": "^6.0.0"
  }
}
```

### 3. Vulnerabilidades de Segurança

**Problema:** Vulnerabilidade crítica no pacote form-data.

**Decisão:** Aplicar `npm audit fix --force` após teste de compatibilidade, porém foi realizado de forma segura em um repositório teste.

**Resultado:** Downgrade do n8n-workflow sem quebra de funcionalidade.

## Evolução da Implementação

### Iteração 1: Estrutura Básica
```typescript
export class Random implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Random',
        name: 'random',
        // Configuração inicial básica
    };
}
```

### Iteração 2: Adição de Operações
```typescript
properties: [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        // Implementação de operação única
    }
]
```

### Iteração 3: Integração com API
```typescript
async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    // Implementação da chamada HTTP
    const response = await this.helpers.request(options);
    const randomNumber = parseInt(response.trim());
}
```

### Iteração 4: Tratamento de Erros
```typescript
try {
    const response = await this.helpers.request(options);
    // Processamento
} catch (error) {
    if (this.continueOnFail()) {
        returnData.push({
            json: { error: (error as Error).message }
        });
    } else {
        throw error;
    }
}
```

## Debugging e Ferramentas

### Comandos de Debug Utilizados
```bash
# Logs detalhados n8n
docker-compose logs n8n | grep -i custom

# Verificação de build
ls .n8n/custom/n8n-nodes-random/dist/nodes/

# Teste de conectividade database
docker-compose exec postgres psql -U n8n_user -d n8n_db

# Monitoramento em tempo real
docker-compose logs -f
```

### Ferramentas de Desenvolvimento
- **VS Code**: Editor principal com extensões TypeScript
- **Docker Desktop**: Gerenciamento de containers
- **Git**: Controle de versão

---

**Desenvolvido por:** Rafael Abras  
**Período:** Setembro 2025  
**Stack:** Node.js 22, TypeScript 5.2, n8n 1.85.4 PostgreSQL 15, Docker
