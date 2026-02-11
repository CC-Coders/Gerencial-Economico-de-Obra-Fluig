# Gerencial Econômico Obra



## ADRs (Architectural Decision Record)

### ADR-001: Cadastro do Cliente diretamento no CCusto do RM

Status: Análise
Data: 11/02/2026

1. Contexto
    No cadastro de Centros de Custo do Gerencial Econômico, é necessário informar o Cliente referente a essa obra, ao verificar o cadastro na tabela FCFO(Clientes/Fornecedores) do RM, idenficamos que os Clientes não estão cadastrados corretamente com um CODTCF(Código Tipo Cliente/Fornecedor), impedindo a busca pelos Clientes cadastrados no RM.


2. Decision
    TODO


3. Options Considered

 1. Liberar o campo para Digitação
 1. Opção 2: Criar lista separada de Clientes
 1. Opção 3: Preencher o CODCFO (Código Cliente/Fornecedor) no CCusto, assim fazendo o link com o Cliente


4. Rationale
    TODO

5. Consequences

#### Positive
    TODO

#### Negative
    TODO

#### Neutral / Follow-ups
    TODO
