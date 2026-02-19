dataTableBacklog = null;
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

var MyWidget = SuperWidget.extend({
    init: function () {
        init();
    },
});


function init() {
    initDatatableBacklog();
    atualizaDatatableCentrosDeCusto();
    atualizaListaEmpresas();

    $("#filtroEmpresa").selectize({
        onChange: function (value) {
            var [CODCOLIGADA, NOME] = value.split(" - ");
            atualizaListaObras(CODCOLIGADA);

        }
    });
    $("#filtroObras").selectize();

    $("#btnNovoBacklog").on("click", function () {
        abreModalNovoBacklog();
    });
    $("#btnBuscarBacklog").on("click", function () {
        atualizaDatatableCentrosDeCusto();
    });
}

// Datatable
function initDatatableBacklog() {
    dataTableBacklog = new DataTable('#tableBacklog', {
        colReorder: true,
        fixedColumns: true,
        fixedHeader: true,
        columns: [
            {
                data: "des_empresa",
                visible: false
            },
            {
                data: "cod_obra",
                render: function (data, type, row) {
                    return `${data} - ${row.des_centro_custo}`
                }
            },
            {
                data: "vlr_pi",
                render: function (data) {
                    return floatToMoney(data);
                }
            },
            {
                data: "vlr_pi_medido",
                visible: false,
                render: function (data) {
                    return floatToMoney(data);
                },
            },
            {
                data: "vlr_r",
                render: function (data) {
                    return floatToMoney(data);
                }
            },
            {
                data: "vlr_r_medido",
                visible: false,
                render: function (data) {
                    return floatToMoney(data);
                }
            },
            {
                data: "vlr_aditivos",
                render: function (data) {
                    return floatToMoney(data);
                }
            },
            {
                data: "vlr_aditivos_medido",
                visible: false,
                render: function (data) {
                    return floatToMoney(data);
                }
            },
            {
                data: "vlr_nao_executavel",
                render: function (data) {
                    return floatToMoney(data);
                }
            },
            {
                data: "des_observacao",
                visible: false,
            },
            {
                data: "des_indice_reajuste",
            },
            {
                render: function (data, row) {
                    return `<div style="display: flex;align-items: center; width:100%;">
                                <button class="btn btn-default btnViewBacklog">
                                    <i class="flaticon flaticon-view icon-sm" aria-hidden="true"></i>
                                </button>
                                <button class="btn btn-default btnEditBacklog">
                                    <i class="flaticon flaticon-edit icon-sm" aria-hidden="true"></i>
                                </button>
                            </div>`;
                }
            }
        ],
        layout: {
            topStart: {
                buttons: [{ extend: 'colvis', className: 'btn btn-primary' }, { extend: 'excel' }]
            }
        },
        language: datatablesLanguage
    });

    $(dataTableBacklog.buttons($('.buttons-colvis')).nodes()).attr("class", "buttons-collection buttons-colvis btn btn-primary");
    $(dataTableBacklog.buttons($('.buttons-excel')).nodes()).attr("class", "buttons-excel buttons-html5 btn btn-primary");

    dataTableBacklog.on("draw", function () {
        $(".btnViewBacklog").off("click").on("click", function () {
            var tr = $(this).closest('tr');
            var row = dataTableBacklog.row(tr);
            var data = row.data();
            abreModalNovoBacklog(data, true);

        });
        $(".btnEditBacklog").off("click").on("click", function () {
            var tr = $(this).closest('tr');
            var row = dataTableBacklog.row(tr);
            var data = row.data();
            abreModalNovoBacklog(data, false);
        });
    });
}
async function atualizaDatatableCentrosDeCusto() {
    try {
        var dados = await promiseConsultaBacklog();
        dataTableBacklog.clear().draw();
        dataTableBacklog.rows.add(dados);
        dataTableBacklog.columns.adjust().draw();
    } catch (error) {
        throw error;
    }
}


async function atualizaListaEmpresas() {
    try {
        var coligadas = await promiseConsultaColigadas();
        $("#filtroEmpresa")[0].selectize.addOption(coligadas.map(e => { return { value: `${e.CODCOLIGADA} - ${e.NOME}`, text: `${e.CODCOLIGADA} - ${e.NOME}` } }));
    } catch (error) {
        throw error;
    }
}
async function atualizaListaObras(CODCOLIGADA) {
    try {
        var CCUSTO = await promiseConsultaCCusto(CODCOLIGADA);
        const selectizeControler = $("#filtroObras")[0].selectize;
        selectizeControler.clear();
        selectizeControler.clearOptions();
        selectizeControler.addOption(CCUSTO.map(e => {
            return {
                value: `${e.CODCCUSTO} - ${e.NOME}`,
                text: `${e.CODCCUSTO} - ${e.NOME}`,
            }
        }));
    } catch (error) {
        throw error;
    }
}


// Modal
function abreModalNovoBacklog(data, readonly) {
    myModal = FLUIGC.modal({
        title: 'Detalhes Backlog',
        content: getHTML(data),
        id: 'fluig-modal',
        size: 'full',
        actions: getActions(readonly),
    }, function (err) {
        if (err) {
            // do error handling
        } else {
            initModalNovoBacklog(data, readonly);

            $("[data-salvar]").on("click", async function () {
                try {
                    if (data) {
                        await updateBacklog();
                        showMessage("Backlog atualizado com sucesso!!", "", "success");
                        myModal.remove();
                    } else {
                        await promiseCreateBacklog();
                        showMessage("Backlog criado com sucesso!!", "", "success");
                        myModal.remove();
                    }
                } catch (error) {
                    showMessage("Erro ao cadastrar Backlog", error, "warning");
                }
            });
        }
    });

    function getHTML(data) {
        var htmlHidden = `<div style="display:none;">
            <input type="hidden" id="hiddenCODCOLIGADA"/>
            <input type="hidden" id="hiddenCODCCUSTO"/>
            <input type="hidden" id="hiddenDATABASE"/>
        </div>`;

        var htmlObra = `
            <div>
                <h3>
                    <i class="flaticon flaticon-form-list icon-md" style="color: var(--colorCastilho)" aria-hidden="true"></i>
                    Dados da Obra
                </h3>
                <hr class="hrCastilho">
            </div>
            <div class="row">
                <div class="col-md-4">
                   <label>Empresa</label>
                    <select id="selectEmpresaNovoBacklog"></select>
                </div>
                <div class="col-md-4">
                   <label>Obra</label>
                    <select id="selectObraNovoBacklog"></select>
                </div>
                <div class="col-md-4">
                   <label>Data Base</label>
                    <div class="form-group">
                        <div class="input-group">
                            <input id="dataBaseObraNovoBacklog" class="form-control" />
                            <div class="input-group-addon">
                                <i class="flaticon flaticon-calendar icon-md" aria-hidden="true"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        var htmlInfoFinanceira = `
            <div>
                <h3>
                    <i class="flaticon flaticon-form-list icon-md" style="color: var(--colorCastilho)" aria-hidden="true"></i>
                    Informações Financeiras
                </h3>
                <hr class="hrCastilho">
            </div>
            <div class="row">
                <div class="col-md-6">
                    <label>Preço Inicial (PI)</label>
                    <input id="piNovoBacklog" type="text" class="form-control" />
                </div>
                <div class="col-md-6">
                    <label>Preço Inicial (PI) Medido</label>
                    <input id="piMedidoNovoBacklog" type="text" class="form-control" />
                </div>
                <div class="col-md-6">
                    <label>Reajuste (R)</label>
                    <input id="rNovoBacklog" type="text" class="form-control" />
                </div>
                <div class="col-md-6">
                    <label>Reajuste (R) Medido</label>
                    <input id="rMedidoNovoBacklog" type="text" class="form-control" />
                </div>
                <div class="col-md-6">
                    <label>Aditivo</label>
                    <input id="aditivoNovoBacklog" type="text" class="form-control" />
                </div>
                <div class="col-md-6">
                    <label>Aditivo Medido</label>
                    <input id="aditivoMedidoNovoBacklog" type="text" class="form-control" />
                </div>
                <div class="col-md-6">
                    <label>Não Executável</label>
                    <input id="naoExecutavelNovoBacklog" type="text" class="form-control" />
                </div>
                <div class="col-md-6">
                    <label>Índice de Reajuste</label>
                    <select class="form-control" id="indiceReajusteNovoBacklog">
                        <option></option>
                        <option value="IPCA">IPCA</option>
                        <option value="Selic">Selic</option>
                        <option value="IGPM">IGPM</option>
                    </select>
                </div>
            </div>
        `;

        var htmlObservacao = `
            <div>
                <h3>
                    <i class="flaticon flaticon-form-list icon-md" style="color: var(--colorCastilho)" aria-hidden="true"></i>
                    Observações
                </h3>
                <hr class="hrCastilho">
            </div>
            <div class="row">
                <div class="col-md-12">
                    <label>Observação </label>
                    <textarea id="observaçãoNovoBacklog" rows=4 class="form-control"></textarea>
                </div>
            </div>
        `;

        var htmlHistorico = `
            <div>
                <h3>
                    <i class="flaticon flaticon-form-list icon-md" style="color: var(--colorCastilho)" aria-hidden="true"></i>
                    Histórico
                </h3>
                <hr class="hrCastilho">
            </div>
            <div class="row">
                <div class="col-md-12">
                    <table id="tableHistoricoBacklog" class="table table-bordered">
                        <thead>
                            <tr>
                                <th>DATA BASE</th>
                                <th>PREÇO INICIAL (PI)</th>
                                <th>PI MEDIDO</th>
                                <th>REAJUSTE (R)</th>
                                <th>R MEDIDO</th>
                                <th>ADITIVOS</th>
                                <th>ADITIVOS MEDIDO</th>
                                <th>NÃO EXECUTÁVEL</th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    </table>
                </div>
            </div>
        `

        return `
            ${htmlHidden}
            ${htmlObra}
            <br>
            ${htmlInfoFinanceira}
            <br>
            ${htmlObservacao}
            ${data ? htmlHistorico : ""}
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
    function initModalNovoBacklog(data, readonly) {
        $("#selectEmpresaNovoBacklog").selectize({
            onChange: function (value) {
                var [CODCOLIGADA, NOME] = value.split(" - ");
                atualizaListaCCusto(CODCOLIGADA);
            }
        });
        $("#selectObraNovoBacklog").selectize({
            onChange: async function (value) {
                var [CODCOLIGADA, NOMECOLIGADA] = $("#selectEmpresaNovoBacklog")[0].selectize.items[0].split(" - ");
                var [CODCCUSTO, NOME] = value.split(" - ");

                var historicoBacklog = await promiseConsultaHistoricoBacklog(CODCOLIGADA, CODCCUSTO);
                var ultimoBacklog = historicoBacklog[0];

                preencheData(ultimoBacklog);
            }
        });

        atualizaListaEmpresas();

        FLUIGC.calendar('#dataBaseObraNovoBacklog');

        $("#piNovoBacklog").maskMoney({ prefix: "R$", precision: 2, thousands: ".", decimal: ",", allowZero: true });
        $("#piMedidoNovoBacklog").maskMoney({ prefix: "R$", precision: 2, thousands: ".", decimal: ",", allowZero: true });

        $("#rNovoBacklog").maskMoney({ prefix: "R$", precision: 2, thousands: ".", decimal: ",", allowZero: true });
        $("#rMedidoNovoBacklog").maskMoney({ prefix: "R$", precision: 2, thousands: ".", decimal: ",", allowZero: true });

        $("#aditivoNovoBacklog").maskMoney({ prefix: "R$", precision: 2, thousands: ".", decimal: ",", allowZero: true });
        $("#aditivoMedidoNovoBacklog").maskMoney({ prefix: "R$", precision: 2, thousands: ".", decimal: ",", allowZero: true });

        $("#naoExecutavelNovoBacklog").maskMoney({ prefix: "R$", precision: 2, thousands: ".", decimal: ",", allowZero: true });


        if (data) {
            setTimeout(() => {
                preencheData(data);
                preencheHistoricoBacklog(data.cod_coligada, data.cod_obra);
            }, 500);
        }

        if (readonly) {
            setReadonly();
        }
    }

    function preencheData(data) {
        console.log(data);

        $("#hiddenCODCOLIGADA").val(data.cod_coligada);
        $("#hiddenCODCCUSTO").val(data.cod_obra);
        $("#hiddenDATABASE").val(formataDateToDDMMAAAA(data.dt_base));

        $("#selectEmpresaNovoBacklog")[0].selectize.setValue(`${data.cod_coligada} - ${data.des_empresa}`);
        setTimeout(() => {
            $("#selectObraNovoBacklog")[0].selectize.setValue(`${data.cod_obra} - ${data.des_centro_custo}`);
        }, 1000);
        $("#dataBaseObraNovoBacklog").val(formataDateToDDMMAAAA(data.dt_base));


        $("#piNovoBacklog").val(floatToMoney(data.vlr_pi));
        $("#piMedidoNovoBacklog").val(floatToMoney(data.vlr_pi_medido));

        $("#rNovoBacklog").val(floatToMoney(data.vlr_r));
        $("#rMedidoNovoBacklog").val(floatToMoney(data.vlr_r_medido));

        $("#aditivoNovoBacklog").val(floatToMoney(data.vlr_aditivos));
        $("#aditivoMedidoNovoBacklog").val(floatToMoney(data.vlr_aditivos_medido));

        $("#naoExecutavelNovoBacklog").val(floatToMoney(data.vlr_nao_executavel));

        $("#indiceReajusteNovoBacklog").val(data.des_indice_reajuste);
        $("#observaçãoNovoBacklog").val(data.des_observacao);
    }
    function setReadonly() {
        $("#selectEmpresaNovoBacklog")[0].selectize.lock();
        $("#selectObraNovoBacklog")[0].selectize.lock();


        $("#dataBaseObraNovoBacklog").attr("readonly", "readonly");
        $("#piNovoBacklog").attr("readonly", "readonly");
        $("#piMedidoNovoBacklog").attr("readonly", "readonly");
        $("#rNovoBacklog").attr("readonly", "readonly");
        $("#rMedidoNovoBacklog").attr("readonly", "readonly");
        $("#aditivoNovoBacklog").attr("readonly", "readonly");
        $("#aditivoMedidoNovoBacklog").attr("readonly", "readonly");
        $("#naoExecutavelNovoBacklog").attr("readonly", "readonly");
        $("#indiceReajusteNovoBacklog").attr("readonly", "readonly");
        $("#observaçãoNovoBacklog").attr("readonly", "readonly");
    }

    async function atualizaListaEmpresas() {
        var coligadas = await promiseConsultaColigadas();
        $("#selectEmpresaNovoBacklog")[0].selectize.addOption(coligadas.map(e => { return { value: `${e.CODCOLIGADA} - ${e.NOME}`, text: `${e.CODCOLIGADA} - ${e.NOME}` } }));

    }
    async function atualizaListaCCusto(CODCOLIGADA) {
        try {
            var CCUSTO = await promiseConsultaCCusto(CODCOLIGADA);
            const selectizeControler = $("#selectObraNovoBacklog")[0].selectize;
            selectizeControler.clear();
            selectizeControler.clearOptions();
            selectizeControler.addOption(CCUSTO.map(e => {
                return {
                    value: `${e.CODCCUSTO} - ${e.NOME}`,
                    text: `${e.CODCCUSTO} - ${e.NOME}`,
                }
            }));

        } catch (error) {
            showMessage("Erro ao consultar CCusto: ", error, "warning");
            throw error;
        }
    }
    async function preencheHistoricoBacklog(CODCOLIGADA, CODCCUSTO) {
        try {
            var historicos = await promiseConsultaHistoricoBacklog(CODCOLIGADA, CODCCUSTO);

            for (const historico of historicos) {
                var html = `
                    <tr>
                    <td>${formataDateToDDMMAAAA(historico.dt_base)}</td>
                        <td>${floatToMoney(historico.vlr_pi)}</td>
                        <td>${floatToMoney(historico.vlr_pi_medido)}</td>
                        <td>${floatToMoney(historico.vlr_r)}</td>
                        <td>${floatToMoney(historico.vlr_r_medido)}</td>
                        <td>${floatToMoney(historico.vlr_aditivos)}</td>
                        <td>${floatToMoney(historico.vlr_aditivos_medido)}</td>
                        <td>${floatToMoney(historico.vlr_nao_executavel)}</td>
                    </tr>
                `;

                $("#tableHistoricoBacklog>tbody").append(html);
            }


        } catch (error) {
            throw error;
        }
    }
}


// CRUD
function promiseConsultaBacklog() {
    return new Promise((resolve, reject) => {
        var FILTROS = JSON.stringify(getFiltrosConsultaCentrosDeCusto());

        DatasetFactory.getDataset("dsCadastroBacklogBigQuery", null, [
            DatasetFactory.createConstraint("ACTION", "SELECT", "SELECT", ConstraintType.MUST),
            DatasetFactory.createConstraint("FILTROS", FILTROS, FILTROS, ConstraintType.MUST),
        ], null, {
            success: ds => {
                if (ds.values[0].STATUS != "SUCCESS") {
                    showMessage("Erro ao cadastrar Backlog", ds.values[0].MENSAGEM, "warning");
                    reject(ds.values[0].MENSAGEM);
                } else {
                    resolve(JSON.parse(ds.values[0].RESULT).data);
                }
            },
            error: e => {
                log.error(e);
                showMessage("Erro ao cadastrar Backlog", error, "warning");
                reject(e);
            }
        })
    });

    function getFiltrosConsultaCentrosDeCusto() {
        var filtros = [];

        var filtroColigada = $("#filtroEmpresa")[0].selectize.items[0];
        if (filtroColigada) {
            filtros.push({
                column: "BACKLOG.cod_coligada",
                value: filtroColigada.split(" - ")[0],
                type: "int"
            });
        }

        var filtroObra = $("#filtroObras")[0].selectize.items[0];
        if (filtroObra) {
            filtros.push({
                column: "BACKLOG.cod_obra",
                value: filtroObra.split(" - ")[0],
                type: "text"
            });
        }

        var filtroIndiceReajuste = $("#filtroIndiceReajuste").val();
        if (filtroIndiceReajuste) {
            filtros.push({
                column: "BACKLOG.des_indice_reajuste",
                value: filtroIndiceReajuste,
                type: "text"
            });
        }

        var filtroObservacao = $("#filtroPalavraChave").val();
        if (filtroObservacao) {
            filtros.push({
                column: "BACKLOG.des_observacao",
                value: "%" + filtroObservacao + "%",
                LIKE_SEARCH: true,
                type: "text"
            });
        }

        return filtros;
    }

}
function promiseConsultaHistoricoBacklog(CODCOLIGADA, CODCCUSTO) {
    return new Promise((resolve, reject) => {
        DatasetFactory.getDataset("dsCadastroBacklogBigQuery", null, [
            DatasetFactory.createConstraint("ACTION", "SELECT_HISTORICO", "SELECT_HISTORICO", ConstraintType.MUST),
            DatasetFactory.createConstraint("CODCOLIGADA", CODCOLIGADA, CODCOLIGADA, ConstraintType.MUST),
            DatasetFactory.createConstraint("CODCCUSTO", CODCCUSTO, CODCCUSTO, ConstraintType.MUST),
        ], null, {
            success: ds => {
                if (ds.values[0].STATUS != "SUCCESS") {
                    showMessage("Erro ao consultar Backlog", ds.values[0].MENSAGEM, "warning");
                    reject(ds.values[0].MENSAGEM);
                } else {
                    resolve(JSON.parse(ds.values[0].RESULT).data);
                }
            },
            error: e => {
                log.error(e);
                showMessage("Erro ao consultar Backlog", error, "warning");
                reject(e);
            }
        })
    });
}
function promiseCreateBacklog() {
    return new Promise((resolve, reject) => {
        var campos = validaPreenchimentoDoFormularioDeBacklog();

        var ACTION = "CREATE";
        var constraints = [
            DatasetFactory.createConstraint("ACTION", ACTION, ACTION, ConstraintType.MUST),
            DatasetFactory.createConstraint("cod_coligada", campos.CODCOLIGADA, campos.CODCOLIGADA, ConstraintType.MUST),
            DatasetFactory.createConstraint("cod_obra", campos.CODCCUSTO, campos.CODCCUSTO, ConstraintType.MUST),
            DatasetFactory.createConstraint("dt_base", campos.DATA_BASE.split("/").reverse().join("-"), campos.DATA_BASE.split("/").reverse().join("-"), ConstraintType.MUST),
            DatasetFactory.createConstraint("vlr_pi", moneyToFloat(campos.PI), moneyToFloat(campos.PI), ConstraintType.MUST),
            DatasetFactory.createConstraint("vlr_pi_medido", moneyToFloat(campos.PI_MEDIDO), moneyToFloat(campos.PI_MEDIDO), ConstraintType.MUST),
            DatasetFactory.createConstraint("vlr_r", moneyToFloat(campos.R), moneyToFloat(campos.R), ConstraintType.MUST),
            DatasetFactory.createConstraint("vlr_r_medido", moneyToFloat(campos.R_MEDIDO), moneyToFloat(campos.R_MEDIDO), ConstraintType.MUST),
            DatasetFactory.createConstraint("vlr_aditivos", moneyToFloat(campos.ADITIVO), moneyToFloat(campos.ADITIVO), ConstraintType.MUST),
            DatasetFactory.createConstraint("vlr_aditivos_medido", moneyToFloat(campos.ADITIVO_MEDIDO), moneyToFloat(campos.ADITIVO_MEDIDO), ConstraintType.MUST),
            DatasetFactory.createConstraint("vlr_nao_executavel", moneyToFloat(campos.NAO_EXECUTAVEL), moneyToFloat(campos.NAO_EXECUTAVEL), ConstraintType.MUST),
            DatasetFactory.createConstraint("des_indice_reajuste", campos.INDICE_REAJUSTE, campos.INDICE_REAJUSTE, ConstraintType.MUST),
            DatasetFactory.createConstraint("des_observacao", campos.OBSERVACAO, campos.OBSERVACAO, ConstraintType.MUST),
        ];

        DatasetFactory.getDataset("dsCadastroBacklogBigQuery", null, constraints, null, {
            success: ds => {
                if (ds.values[0].STATUS != "SUCCESS") {
                    showMessage("Erro ao cadastrar Backlog", ds.values[0].MENSAGEM, "warning");
                    reject(ds.values[0].MENSAGEM);
                } else {
                    resolve(true);
                }
            },
            error: e => {
                log.error(e);
                showMessage("Erro ao cadastrar Backlog", error, "warning");
                reject(e);
            }
        });
    });
}
function validaPreenchimentoDoFormularioDeBacklog() {
    try {
        var camposEmBranco = [];

        var [CODCOLIGADA, NOMECOLIGADA] = $("#selectEmpresaNovoBacklog").val().split(" - ");
        if (!CODCOLIGADA) {
            camposEmBranco.push("Empresa");
        }
        var [CODCCUSTO, CCUSTO] = $("#selectObraNovoBacklog").val().split(" - ");
        if (!CODCCUSTO) {
            camposEmBranco.push("Obra");
        }
        var DATA_BASE = $("#dataBaseObraNovoBacklog").val();
        if (!DATA_BASE) {
            camposEmBranco.push("Data Base");
        }

        var PI = $("#piNovoBacklog").val();
        if (!PI) {
            camposEmBranco.push("Preço Inicial (PI)");
        }
        var PI_MEDIDO = $("#piMedidoNovoBacklog").val();
        if (!PI_MEDIDO) {
            camposEmBranco.push("Preço Inicial (PI) Medido");
        }

        var R = $("#rNovoBacklog").val();
        if (!R) {
            camposEmBranco.push("Reajuste (R)");
        }
        var R_MEDIDO = $("#rMedidoNovoBacklog").val();
        if (!R_MEDIDO) {
            camposEmBranco.push("Reajuste (R) Medido");
        }

        var ADITIVO = $("#aditivoNovoBacklog").val();
        if (!ADITIVO) {
            camposEmBranco.push("Aditivo");
        }
        var ADITIVO_MEDIDO = $("#aditivoMedidoNovoBacklog").val();
        if (!ADITIVO_MEDIDO) {
            camposEmBranco.push("Aditivo Medido");
        }


        var NAO_EXECUTAVEL = $("#naoExecutavelNovoBacklog").val();
        if (!NAO_EXECUTAVEL) {
            camposEmBranco.push("Não Executável");
        }

        var INDICE_REAJUSTE = $("#indiceReajusteNovoBacklog").val();
        if (!INDICE_REAJUSTE) {
            camposEmBranco.push("Índice de Reajuste");
        }

        var OBSERVACAO = $("#observaçãoNovoBacklog").val();
        if (!OBSERVACAO) {
            camposEmBranco.push("Observação");
        }


        if (camposEmBranco.length > 0) {
            throw `Campos não preenchidos: <ul>${camposEmBranco.map(e => `<li>${e}<li>`).join("")}</ul>`
        } else {
            return {
                CODCOLIGADA, CODCCUSTO, DATA_BASE,
                PI, PI_MEDIDO,
                R, R_MEDIDO,
                ADITIVO, ADITIVO_MEDIDO,
                NAO_EXECUTAVEL, INDICE_REAJUSTE, OBSERVACAO
            };
        }
    } catch (error) {
        throw error;
    }
}
function updateBacklog() {
    return new Promise((resolve, reject) => {
        var campos = validaPreenchimentoDoFormularioDeBacklog();
        var ACTION = "UPDATE";
        var constraints = [
            DatasetFactory.createConstraint("ACTION", ACTION, ACTION, ConstraintType.MUST),
            DatasetFactory.createConstraint("cod_coligada", campos.CODCOLIGADA, campos.CODCOLIGADA, ConstraintType.MUST),
            DatasetFactory.createConstraint("cod_obra", campos.CODCCUSTO, campos.CODCCUSTO, ConstraintType.MUST),
            DatasetFactory.createConstraint("dt_base", campos.DATA_BASE.split("/").reverse().join("-"), campos.DATA_BASE.split("/").reverse().join("-"), ConstraintType.MUST),
            DatasetFactory.createConstraint("vlr_pi", moneyToFloat(campos.PI), moneyToFloat(campos.PI), ConstraintType.MUST),
            DatasetFactory.createConstraint("vlr_pi_medido", moneyToFloat(campos.PI_MEDIDO), moneyToFloat(campos.PI_MEDIDO), ConstraintType.MUST),
            DatasetFactory.createConstraint("vlr_r", moneyToFloat(campos.R), moneyToFloat(campos.R), ConstraintType.MUST),
            DatasetFactory.createConstraint("vlr_r_medido", moneyToFloat(campos.R_MEDIDO), moneyToFloat(campos.R_MEDIDO), ConstraintType.MUST),
            DatasetFactory.createConstraint("vlr_aditivos", moneyToFloat(campos.ADITIVO), moneyToFloat(campos.ADITIVO), ConstraintType.MUST),
            DatasetFactory.createConstraint("vlr_aditivos_medido", moneyToFloat(campos.ADITIVO_MEDIDO), moneyToFloat(campos.ADITIVO_MEDIDO), ConstraintType.MUST),
            DatasetFactory.createConstraint("vlr_nao_executavel", moneyToFloat(campos.NAO_EXECUTAVEL), moneyToFloat(campos.NAO_EXECUTAVEL), ConstraintType.MUST),
            DatasetFactory.createConstraint("des_indice_reajuste", campos.INDICE_REAJUSTE, campos.INDICE_REAJUSTE, ConstraintType.MUST),
            DatasetFactory.createConstraint("des_observacao", campos.OBSERVACAO, campos.OBSERVACAO, ConstraintType.MUST),
        ];

        DatasetFactory.getDataset("dsCadastroBacklogBigQuery", null, constraints, null, {
            success: ds => {
                if (ds.values[0].STATUS != "SUCCESS") {
                    showMessage("Erro ao cadastrar Backlog", ds.values[0].MENSAGEM, "warning");
                    reject(ds.values[0].MENSAGEM);
                } else {
                    resolve(true);
                }
            },
            error: e => {
                log.error(e);
                showMessage("Erro ao cadastrar Backlog", error, "warning");
                reject(e);
            }
        })
    });
}


// Consultas
function promiseConsultaColigadas() {
    return new Promise((resolve, reject) => {
        DatasetFactory.getDataset("COLIGADAS", null, [
            DatasetFactory.createConstraint("ATIVO", "T", "T", ConstraintType.MUST),
        ], null, {
            success: ds => {
                var result = ds.values;

                // Remove a Coligada gloval (0)
                result.shift();

                resolve(result.map(e => {
                    return {
                        CODCOLIGADA: e.CODCOLIGADA,
                        NOME: e.NOMEFANTASIA,
                    }
                }));
            }
        });
    });
}
function promiseConsultaCCusto(CODCOLIGADA) {
    return new Promise((resolve, reject) => {
        DatasetFactory.getDataset("GCCUSTO", null, null, null)
        DatasetFactory.getDataset("GCCUSTO", null, [
            DatasetFactory.createConstraint("CODCOLIGADA", CODCOLIGADA, CODCOLIGADA, ConstraintType.MUST),
            DatasetFactory.createConstraint("ATIVO", "T", "T", ConstraintType.MUST),
        ], null, {
            success: ds => {
                resolve(ds.values);
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
function formataDateToAAAAMMDD(date) {
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

    return [ano, mes, dia].join("-")
}