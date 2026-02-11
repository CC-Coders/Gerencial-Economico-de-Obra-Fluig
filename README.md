# Gerencial Econômico Obra



## ADRs (Architectural Decision Record)

<details>
<summary>ADR-001: Cadastro de Clientes</summary>

Status: Análise
Data: 11/02/2026

### Contexto
No cadastro de Centros de Custo do Gerencial Econômico, é necessário informar o Cliente referente a essa obra, ao verificar o cadastro na tabela FCFO(Clientes/Fornecedores) do RM, idenficamos que os Clientes não estão cadastrados corretamente com um CODTCF(Código Tipo Cliente/Fornecedor), impedindo a busca pelos Clientes cadastrados no RM. Em conversa com o Evandro também foi levantado que o campo Cliente não deve ser o CNPJ específico e sim o uma visão Gerencial por Cliente.


### Decisão
    TODO


### Oções Consideradas
 1. Liberar o campo para Digitação
 1. Criar lista separada de Clientes
 1. Preencher o CODCFO (Código Cliente/Fornecedor) no CCusto, assim fazendo o link com o Cliente
 1. Usar um SELECT DISTINCT no BigQuery para retornar os Clientes cadastrados, e permitir um NOVO liberando para digitação


### Raciocínio
    TODO


#### Consequências

##### Positivo
    TODO

##### Negativo
    TODO

##### Neutro / Follow-ups
    TODO
</details>
