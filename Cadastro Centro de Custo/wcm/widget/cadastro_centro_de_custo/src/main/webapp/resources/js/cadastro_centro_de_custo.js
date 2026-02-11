var MyWidget = SuperWidget.extend({
    init: function () {
        init();
    },
});

dataTableCentrosDeCusto = null;
datatablesLanguage = {
    sEmptyTable: "Nenhum registro encontrado",
    sInfo: "Mostrando de _START_ até _END_ de _TOTAL_ registros",
    sInfoEmpty: "Mostrando 0 até 0 de 0 registros",
    sInfoFiltered: "(Filtrados de _MAX_ registros)",
    sInfoPostFix: "",
    sInfoThousands: ".",
    sLengthMenu: "_MENU_ resultados por página",
    sLoadingRecords: "Carregando...",
    sProcessing: "Processando...",
    sZeroRecords: "Nenhum registro encontrado",
    sSearch: "Pesquisar",
    oPaginate: {
        sNext: "Próximo",
        sPrevious: "Anterior",
        sFirst: "Primeiro",
        sLast: "Último",
    },
    oAria: {
        sSortAscending: ": Ordenar colunas de forma ascendente",
        sSortDescending: ": Ordenar colunas de forma descendente",
    },
    select: {
        rows: {
            _: "Selecionado %d linhas",
            0: "Nenhuma linha selecionada",
            1: "Selecionado 1 linha",
        },
    },
    buttons: {
        copy: "Copiar para a área de transferência",
        copyTitle: "Cópia bem sucedida",
        copySuccess: {
            1: "Uma linha copiada com sucesso",
            _: "%d linhas copiadas com sucesso",
        },
        colvis: 'Colunas'
    },
};


function init() {
    initFiltros();
    initDatatableCentrosDeCusto();
    atualizaDatatableCentrosDeCusto();

    $("#btnNovoCentroDeCusto").on("click", function () {
        abreModalCentroDeCusto();
    });
}

// Filtros
function initFiltros() {
    $("#filtroColigada").selectize();
    $("#filtroCliente").selectize();
    $("#filtroCoordenador").selectize();

    FLUIGC.calendar("#filtroDataBase");
    FLUIGC.calendar("#filtroInicioObra");
}
function consultaCoordenadores() {

}
function consultaEmpresas() {

}
function consultaClientes() {

}


// Datatables
function initDatatableCentrosDeCusto() {
    try {
        dataTableCentrosDeCusto = new DataTable('#tableCentrosDeCusto', {
            colReorder: true,
            fixedColumns: true,
            fixedHeader: true,
            columns: [
                {
                    data: "des_empresa"
                },
                {
                    data: "des_cliente"
                },
                {
                    data: "des_contrato"
                },
                {
                    data: "des_objeto_contrato"
                },
                {
                    data: "des_coordenacao"
                },
                {
                    data: "dt_base",
                    render: (data) => {
                        return formataDateToDDMMAAAA(data);
                    }
                },
                {
                    data: "dt_ordem_inicio",
                    render: (data) => {
                        return formataDateToDDMMAAAA(data);
                    }
                },
                {
                    render: function (data, row) {
                        return `<div style="display: flex;align-items: center;">
                                <button class="btn btn-default">
                                    <i class="flaticon flaticon-view icon-sm" aria-hidden="true"></i>
                                </button>
                                <button class="btn btn-default">
                                    <i class="flaticon flaticon-edit icon-sm" aria-hidden="true"></i>
                                </button>
                            </div>`;
                    }
                }
            ],

            layout: {
                topStart: {
                    buttons: [{ extend: 'colvis', className: 'btn btn-primary' }]
                }
            },
            language: datatablesLanguage
        });

        $(dataTableCentrosDeCusto.buttons($('.buttons-colvis')).nodes()).attr("class", "buttons-collection buttons-colvis btn btn-primary")
    } catch (error) {
        throw error;
    }
}
async function atualizaDatatableCentrosDeCusto() {
    try {
        var dados = await promiseConsultaCentrosDeCusto();
        dataTableCentrosDeCusto.clear().draw();
        dataTableCentrosDeCusto.rows.add(dados); // Add new data
        dataTableCentrosDeCusto.columns.adjust().draw(); // Redraw the DataTable
    } catch (error) {
        throw error;
    }
}



function promiseConsultaCentrosDeCusto() {
    return new Promise((resolve, reject) => {
        DatasetFactory.getDataset("dsCadastroCentroDeCustoBigQuery", null, [
            DatasetFactory.createConstraint("ACTION", "SELECT", "SELECT", ConstraintType.MUST)
        ], null, {
            success: ds => {
                var STATUS = ds.values[0].STATUS;
                if (STATUS != "SUCCESS") {
                    showMessage("Erro ao consultar Centros de Custo", ds.values[0].MENSAGEM, "warning");
                    reject(ds.values[0].MENSAGEM);
                }


                var RESULT = ds.values[0].RESULT;
                resolve(JSON.parse(RESULT).data);
            },
            error: error => {
                showMessage("Erro ao consultar Centros de Custo", error, "warning");
                reject(ds.values[0].MENSAGEM);
            }
        })
    });
}

// Modal
function abreModalCentroDeCusto(data, readonly) {
    var myModal = FLUIGC.modal({
        title: 'Detalhes Centro de Custo',
        content: getHTML(),
        id: 'fluig-modal',
        size: 'full',
        actions: getActions(readonly),
    }, function (err, data) {
        if (err) {
            // do error handling
        } else {
            initModalNovoCentroDeCusto();
        }
    });


    function getHTML() {
        var htmlIdentificacaoContrato =
            `<div>
            <h3>
                <i class="flaticon flaticon-form-list icon-md" style="color: var(--colorCastilho)" aria-hidden="true"></i>
                Identificação do Contrato
            </h3>
            <hr class="hrCastilho">
        </div>
        <div class="row">
            <div class="col-md-4">
                <label>Empresa</label>
                <select id="empresaNovoCentroDeCusto"></select>
            </div>
            <div class="col-md-4">
                <label>Cliente</label>
                <select id="clienteNovoCentroDeCusto"></select>
            </div>
            <div class="col-md-4">
                <label>Nº do Contrato</label>
                <input type="text" class="form-control">
            </div>
            <div class="col-md-12">
                <label>Objeto do Contrato</label>
                <input type="text" class="form-control">
            </div>
        </div>`;

        var htmlClassificacaoStatus =
            `<div>
            <h3>
                <i class="flaticon flaticon-form-list icon-md" style="color: var(--colorCastilho)" aria-hidden="true"></i>
                Classificação e Status
            </h3>
            <hr class="hrCastilho">
        </div>
        <div class="row">
            <div class="col-md-4">
                <label>Segmento</label>
                <select id="segmentoNovoCentroDeCusto" class="form-control">
                    <option></option>
                    <option value="Rodovia">Rodovia</option>
                    <option value="Ferrovia">Ferrovia</option>
                </select>
            </div>
            <div class="col-md-4">
                <label>Setor</label>
                <select id="setorNovoCentroDeCusto" class="form-control">
                    <option></option>
                    <option value="Público">Público</option>
                    <option value="Privado">Privado</option>
                </select>
            </div>
            <div class="col-md-4">
                <label>Situação Atual</label>
                <select id="situacaoNovoCentroDeCusto" class="form-control">
                    <option></option>
                    <option value="Ativo">Ativo</option>
                    <option value="Paralisado">Paralisado</option>
                    <option value="Encerrado">Encerrado</option>
                </select>
            </div>
        </div>`;

        var htmlEquipeGestao =
            `<div>
            <h3>
                <i class="flaticon flaticon-form-list icon-md" style="color: var(--colorCastilho)" aria-hidden="true"></i>
                Equipe de Gestão
            </h3>
            <hr class="hrCastilho">
        </div>
        <div class="row">
            <div class="col-md-4">
                <label>Coordenador/Regional</label>
                <select id="coordenadorNovoCentroDeCusto"></select>
            </div>
            <div class="col-md-4">
                <label>Líder de Contrato</label>
                <select id="liderContratoNovoCentroDeCusto"></select>
            </div>
            <div class="col-md-4">
                <label>Chefe de Escritório</label>
                <select id="chefeEscritorioNovoCentroDeCusto"></select>
            </div>
        </div>`

        var htmlIndicadoresEconomicos =
            `<div>
            <h3>
                <i class="flaticon flaticon-form-list icon-md" style="color: var(--colorCastilho)" aria-hidden="true"></i>
                Indicadores Econômicos
            </h3>
            <hr class="hrCastilho">
        </div>
        <div class="row">
            <div class="col-md-6">
                <label>Percentual Castilho</label>
                <input id="percentualCastilhoNovoCentroDeCusto" class="form-control" />
            </div>
            <div class="col-md-6">
                <label>Meta Resultado</label>
                <input id="metaResultadoNovoCentroDeCusto" class="form-control" />
            </div>
        </div>`;

        var htmlLocalizacaoObra =
            `<div>
            <h3>
                <i class="flaticon flaticon-form-list icon-md" style="color: var(--colorCastilho)" aria-hidden="true"></i>
                Localização da Obra
            </h3>
            <hr class="hrCastilho">
        </div>
        <div class="row">
            <div class="col-md-12">
                <label>Endereço</label>
                <input id="enderecoNovoCentroDeCusto" class="form-control" type="text" />
            </div>
            <div class="col-md-4">
                <label>UF</label>
                <select id="ufNovoCentroDeCusto"></select>
            </div>
            <div class="col-md-8">
                <label>Cidade</label>
                <select id="cidadeNovoCentroDeCusto"></select>
            </div>
        </div>`;

        var htmlPrazos = `
        <div>
            <h3>
                <i class="flaticon flaticon-form-list icon-md" style="color: var(--colorCastilho)" aria-hidden="true"></i>
                Vigência e Prazos
            </h3>
            <hr class="hrCastilho">
        </div>
        <div class="row">
            <div class="col-md-3">
                <label>Data Base</label>
                <div class="form-group">
                    <div class="input-group">
                        <input id="dataBaseNovoCentroDeCusto" class="form-control" />
                        <div class="input-group-addon">
                            <i class="flaticon flaticon-calendar icon-md" aria-hidden="true"></i>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <label>Início da Obra</label>
                <div class="form-group">
                    <div class="input-group">
                        <input id="inicioObraNovoCentroDeCusto" class="form-control" />
                        <div class="input-group-addon">
                            <i class="flaticon flaticon-calendar icon-md" aria-hidden="true"></i>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <label>Término da Obra</label>
                <div class="form-group">
                    <div class="input-group">
                        <input id="terminoObraNovoCentroDeCusto" class="form-control"/>
                        <div class="input-group-addon">
                            <i class="flaticon flaticon-calendar icon-md" aria-hidden="true"></i>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <label>Término Contratual (Prazo)</label>
                <input id="prazoContratualNovoCentroDeCusto" class="form-control" />
            </div>
        </div>`;

        var htmlConsorcio = 
        `<div>
            <h3>
                <i class="flaticon flaticon-form-list icon-md" style="color: var(--colorCastilho)" aria-hidden="true"></i>
                Consórcio
            </h3>
            <hr class="hrCastilho">
        </div>
        <div>
            <label>
                <input type="checkbox" id="checkboxConsorcio" />
                Este centro de custo será vinculado a algum consórcio?
            </label>
        </div>
        <div id="divDadosConsorcio" class="row">
            <div class="col-md-6">
                <label>Descrição do Consórcio</label>
                <input type="text" class="form-control" id="descricaoConsorcio"/>
            </div>
            <div class="col-md-6">
                <label>Status do Consórcio</label>
                <select class="form-control">
                    <option></option>
                    <option value="Ativo">Ativo</option>
                    <option value="Paralisado">Paralisado</option>
                    <option value="Encerrado">Encerrado</option>
                </select>
            </div>
        </div>`;

        return `
            ${htmlIdentificacaoContrato}
            <br/>
            ${htmlClassificacaoStatus} 
            <br/>
            ${htmlEquipeGestao} 
            <br/>
            ${htmlPrazos}
            <br/>
            <div class="row">
                <div class="col-md-6">
                    ${htmlIndicadoresEconomicos}
                </div>
                <div class="col-md-6">
                    ${htmlLocalizacaoObra}
                </div>
            </div>
            <br/>
            ${htmlConsorcio}
            `;
    }
    function getActions(readonly) {
        if (readonly) {
            return [{
                'label': 'Fechar',
                'autoClose': true
            }]
        } else {
            return [{
                'label': 'Salvar',
                'bind': 'data-salvar',
            }, {
                'label': 'Fechar',
                'autoClose': true
            }]
        }
    }
    async function initModalNovoCentroDeCusto() {
        FLUIGC.calendar("#dataBaseNovoCentroDeCusto");
        FLUIGC.calendar("#inicioObraNovoCentroDeCusto");
        FLUIGC.calendar("#terminoObraNovoCentroDeCusto");



        $("#empresaNovoCentroDeCusto").selectize();
        var coligadas = await promiseConsultaColigadas();
        $("#empresaNovoCentroDeCusto")[0].selectize.addOption(coligadas.map(e=>{return {value:e.CODCOLIGADA, text:`${e.CODCOLIGADA} - ${e.NOME}`}}));

        $("#clienteNovoCentroDeCusto").selectize();

        $("#coordenadorNovoCentroDeCusto").selectize();
        $("#liderContratoNovoCentroDeCusto").selectize();
        $("#chefeEscritorioNovoCentroDeCusto").selectize();

        var coordenadores = await promiseConsultaCoordenadores();
        $("#coordenadorNovoCentroDeCusto")[0].selectize.addOption(coordenadores.map(e=>{return {value:e,text:e}}));

        var engenheiros = await promiseConsultaEngenheiros();
        $("#liderContratoNovoCentroDeCusto")[0].selectize.addOption(engenheiros.map(e=>{return {value:e,text:e}}));

        var chefes = await promiseConsultaChefesDeEscritorio();
        $("#chefeEscritorioNovoCentroDeCusto")[0].selectize.addOption(chefes.map(e=>{return {value:e,text:e}}));



        $("#cidadeNovoCentroDeCusto").selectize();
        $("#ufNovoCentroDeCusto").selectize({
            onChange:async function(value){
                $("#cidadeNovoCentroDeCusto")[0].selectize.clearOptions();
                var cidades = await asyncConsultaCidades(value);
                $("#cidadeNovoCentroDeCusto")[0].selectize.addOption(cidades.map(e=>{return {value:e.cidade, text:e.cidade}}));
            }
        });
        var estados = await asyncConsultaEstados();
        $("#ufNovoCentroDeCusto")[0].selectize.addOption(estados.map(e=>{return {value:e.ID, text:e.UF}}));


        $("#divDadosConsorcio").hide();
        $("#checkboxConsorcio").on("change", function(){
            if ($(this).is(":checked")) {
                $("#divDadosConsorcio").show();
            }else{
                $("#divDadosConsorcio").hide();
            }
        });


        $("#metaResultadoNovoCentroDeCusto").maskMoney({prefix:"R$"});
        $("#prazoContratualNovoCentroDeCusto").maskMoney({suffix:" Meses"});
        $("#percentualCastilhoNovoCentroDeCusto").maskMoney({suffix:" %"});
    }
}




// Consultas
async function asyncConsultaEstados() {
    try {
        var response = await fetch("http://www.geonames.org/childrenJSON?geonameId=3469034");
        var status = response.status;
        if (status != 200) {
            throw response.statusText;
        }


        const result = await response.json();

        var estados = result.geonames.map(e => {
            return {
                UF: e.name,
                ID: e.geonameId,
            }
        });

        return estados;

    } catch (error) {
        throw error;
    }
}
async function asyncConsultaCidades(idEstado) {
    try {
        var response = await fetch(`http://www.geonames.org/childrenJSON?geonameId=${idEstado}`);
        var status = response.status;
        if (status != 200) {
            throw response.statusText;
        }

        const result = await response.json();
        var cidades = result.geonames.map(e => {
            return {
                cidade: e.name,
            }
        });

        return cidades;

    } catch (error) {
        throw error;
    }
}
function promiseConsultaCoordenadores() {
    return new Promise((resolve, reject)=>{
        DatasetFactory.getDataset("colleagueGroup",null,[
            DatasetFactory.createConstraint("colleagueGroupPK.groupId", "Coordenadores de obras", "Coordenadores de obras", ConstraintType.MUST)
        ],null,{
            success:ds=>{
                var retorno = ds.values.map(e=>{
                    return e["colleagueGroupPK.colleagueId"]
                });
                resolve(retorno);
            }
        })
    });
}
function promiseConsultaEngenheiros() {
        return new Promise((resolve, reject)=>{
        DatasetFactory.getDataset("colleagueGroup",null,[
            DatasetFactory.createConstraint("colleagueGroupPK.groupId", "Engenheiros", "Engenheiros", ConstraintType.MUST)
        ],null,{
            success:ds=>{
                var retorno = ds.values.map(e=>{
                    return e["colleagueGroupPK.colleagueId"]
                });
                resolve(retorno);
            }
        })
    });
}
function promiseConsultaChefesDeEscritorio() {
        return new Promise((resolve, reject)=>{
        DatasetFactory.getDataset("colleagueGroup",null,[
            DatasetFactory.createConstraint("colleagueGroupPK.groupId", "Chefes de Escritório", "Chefes de Escritório", ConstraintType.MUST)
        ],null,{
            success:ds=>{
                var retorno = ds.values.map(e=>{
                    return e["colleagueGroupPK.colleagueId"]
                });
                resolve(retorno);
            }
        })
    });
}
function promiseConsultaColigadas(){
    return new Promise((resolve, reject)=>{
        DatasetFactory.getDataset("COLIGADAS",null,[
            DatasetFactory.createConstraint("ATIVO", "T", "T", ConstraintType.MUST),
        ],null,{
            success:ds=>{
                var result = ds.values;
                
                // Remove a Coligada gloval (0)
                result.shift();

                resolve(result.map(e=>{
                    return {
                        CODCOLIGADA:e.CODCOLIGADA,
                        NOME:e.NOME,
                    }
                }));
            }
        });
    });
}


// Utils
function formataDateToDDMMAAAA(date) {
    var date = new Date(date);

    var dia = date.getUTCDate();
    if (dia < 10) {
        dia = "0" + dia;
    }

    var mes = date.getUTCMonth() + 1;
    if (mes < 10) {
        mes = "0" + mes;
    }

    var ano = date.getUTCFullYear();

    return [dia, mes, ano].join("/")
}


