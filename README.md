# Gerencial Econômico Obra

## ADRs (Architectural Decision Record)

<details>
<summary>ADR-001: Cadastro de Clientes</summary>

Status: Aprovado
Data: 11/02/2026

### Contexto

No cadastro de Centros de Custo do Gerencial Econômico, é necessário informar o Cliente referente a essa obra, ao verificar o cadastro na tabela FCFO(Clientes/Fornecedores) do RM, idenficamos que os Clientes não estão cadastrados corretamente com um CODTCF(Código Tipo Cliente/Fornecedor), impedindo a busca pelos Clientes cadastrados no RM. Em conversa com o Evandro também foi levantado que o campo Cliente não deve ser o CNPJ específico e sim o uma visão Gerencial por Cliente.

### Decisão

    Sanitizar o cadastro de Clientes do RM para usar a listagem do RM

### Oções Consideradas

1.  Liberar o campo para Digitação
1.  Criar lista separada de Clientes
1.  Preencher o CODCFO (Código Cliente/Fornecedor) no CCusto, assim fazendo o link com o Cliente
1.  Usar um SELECT DISTINCT no BigQuery para retornar os Clientes cadastrados, e permitir um NOVO liberando para digitação
1.  Sanitizar o cadastro de Clientes do RM para usar a listagem do RM

### Raciocínio

    Durante reunião dia 11/02/2026, foi levantado que uma sanitização nos Clientes já está programada, então será utilizado os o cadastro de Clientes do RM, e quando a sanitização for concluída a listagem estará correta.

#### Consequências

##### Positivo

1. Consulta unificada no RM
1. Vinculo entre os dados do BigQuery e RM

##### Negativo

1. Nececessário agrupar por ALIAS no BigQuery/DataForm

##### Neutro / Follow-ups

1. Necessário conclusão da Sanitização dos Clientes

</details>


<details>
<summary>ADR-002: Status da Obra</summary>

Status: Análise
Data: 11/02/2026

### Contexto
Dentro do RM, os Centros de Custo são tratados como Obra, dessa forma, não é possível concluír a obra quando existem custos pendentes para baixar, em muitos casos os centros de custo ficam anos ativo após conclusão da obra, assim na visualização do Gerencial essas obras não estariam com o status correto.


### Decisão
    TODO


### Oções Consideradas
 1. Incluír campo complementar no Centro de Custo do RM (STATUS_OBRA)
 1. Controlar o Status da Obra pelo BigQuery e Painel de Centro de Custo
 


### Raciocinio
    TODO


#### Consequencias

##### Positivo
    TODO

##### Negativo
    TODO

##### Neutro / Follow-ups
    TODO
</details>