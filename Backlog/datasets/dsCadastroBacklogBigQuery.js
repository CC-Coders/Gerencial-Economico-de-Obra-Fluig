function createDataset(fields, constraints, sortFields) {
    try {
        var constraints = getConstraints(constraints);
        lancaErroSeConstraintsObrigatoriasNaoInformadas(constraints, ["ACTION"]);

        if (constraints.ACTION == "SELECT") {
            var retorno = buscaBacklog(constraints);
            return returnDataset("SUCCESS", "", JSON.stringify(retorno));
        }
        if (constraints.ACTION == "SELECT_HISTORICO") {
            var retorno = consultaHistoricoBacklog(constraints);
            return returnDataset("SUCCESS", "", JSON.stringify(retorno));
        }
        else if (constraints.ACTION == "UPDATE") {
            var retorno = updateBacklog(constraints);
            if (retorno) {
                return returnDataset("SUCCESS", "", JSON.stringify(retorno));
            } else {
                return returnDataset("ERROR", "", retorno);
            }
        }
        else if (constraints.ACTION == "CREATE") {
            var retorno = criaBacklog(constraints);
            if (retorno) {
                return returnDataset("SUCCESS", "", JSON.stringify(retorno));
            } else {
                return returnDataset("ERROR", "", retorno);
            }
        }
        else if (constraints.ACTION == "DELETE") {
            throw "ACTION DELETE não implementado.";
        }
        else {
            throw "Parâmetro ACTION inválido.";
        }

    } catch (error) {
        if (typeof error == "object") {
            var mensagem = "";
            var keys = Object.keys(error);
            for (var i = 0; i < keys.length; i++) {
                mensagem += (keys[i] + ": " + error[keys[i]]) + " - ";
            }
            log.info("Erro ao executar Dataset:");
            log.dir(error);
            log.info(mensagem);

            return returnDataset("ERRO", mensagem, null);
        } else {
            return returnDataset("ERRO", error, null);
        }
    }
}

function buscaBacklog(constraints) {
    try {
        var query = "SELECT BACKLOG.*,  CCUSTO.des_empresa, CCUSTO.des_centro_custo ";
        query += "FROM etl-castilho.dev.gerencial_backlog as BACKLOG ";
        query += "INNER JOIN (SELECT cod_coligada, cod_obra, MAX(dt_base) as dt_base ";
        query += "  FROM etl-castilho.dev.gerencial_backlog ";
        query += "  GROUP BY cod_coligada, cod_obra) as DTBASE ON  ";
        query += "  BACKLOG.cod_coligada = DTBASE.cod_coligada AND BACKLOG.cod_obra = DTBASE.cod_obra AND BACKLOG.dt_base = DTBASE.dt_base ";
        query += "INNER JOIN etl-castilho.dev.cadastro_centros_custo as CCUSTO ON ";
        query += "  BACKLOG.cod_coligada = CCUSTO.cod_coligada AND BACKLOG.cod_obra = CCUSTO.cod_obra ";
        query += "WHERE 1=1 ";

        var filtros = JSON.parse(constraints.FILTROS);
        for (var i = 0; i < filtros.length; i++) {
            var filtro = filtros[i];

            if (filtro.LIKE_SEARCH == true) {
                if (filtro.type == "int") {
                    query += " AND UPPER(" + filtro.column + ") like UPPER(" + filtro.value + ")";
                } else {
                    query += " AND UPPER(" + filtro.column + ") like UPPER('" + filtro.value + "')";
                }
            }
            else {
                if (filtro.type == "int") {
                    query += " AND " + filtro.column + " = " + filtro.value;
                } else {
                    query += " AND " + filtro.column + " = '" + filtro.value + "'";
                }
            }
        }

        var retorno = executaQueryNoBigQuery(query);

        log.dir(retorno);
        return retorno;

    } catch (error) {
        throw catchError(error)
    }
}
function criaBacklog(constraints) {
    try {
        var columns = getColumnFromContraints(constraints);
        var query = "INSERT INTO etl-castilho.dev.gerencial_backlog (" + getColumns(columns) + ") VALUES (" + getValues(columns) + ")";

        log.info("dsCadastroBacklogBigQuery - criaBacklog - query: " + query);

        var retorno = executaQueryNoBigQuery(query);
        return retorno;
    } catch (error) {
        throw catchError(error);
    }

    function getValues(columns) {
        var retorno = "";

        for (var i = 0; i < columns.length; i++) {
            var campo = columns[i];

            if (campo.type == "int") {
                retorno += campo.value + ", ";
            }
            else if (campo.type == "float") {
                retorno += campo.value + ", ";
            }
            else if (campo.type == "bool") {
                retorno += campo.value + ", ";
            }
            else if (campo.type == "date") {
                retorno += "'" + campo.value + "', ";
            }
            else if (campo.type == "string") {
                retorno += "'" + campo.value + "', ";
            } else {
                retorno += "'" + campo.value + "', ";
            }
        }

        retorno = retorno.substring(0, retorno.length - 2);
        return retorno;
    }
    function getColumns(columns) {
        var retorno = "";

        for (var i = 0; i < columns.length; i++) {
            var campo = columns[i];
            retorno += campo.column + ", ";
        }

        retorno = retorno.substring(0, retorno.length - 2);
        return retorno;
    }

}
function updateBacklog(constraints) {
    try {
        var columns = getColumnFromContraints(constraints);

        var query = "UPDATE etl-castilho.dev.gerencial_backlog ";
        query += " SET " + getSetColumns(columns);
        query += " WHERE cod_coligada = " + constraints.cod_coligada;
        query += " AND  cod_obra = '" + constraints.cod_obra + "'";
        query += " AND  dt_base = '" + constraints.dt_base + "'";

        var retorno = executaQueryNoBigQuery(query);
        return retorno;
    } catch (error) {
        throw error;
    }

    function getSetColumns(columns) {
        var retorno = "";

        for (var i = 0; i < columns.length; i++) {
            var campo = columns[i];

            if (campo.type == "int") {
                retorno += campo.column + " = " + campo.value + ", ";
            }
            else if (campo.type == "float") {
                retorno += campo.column + " = " + campo.value + ", ";
            }
            else if (campo.type == "bool") {
                retorno += campo.column + " = " + campo.value + ", ";
            }
            else if (campo.type == "string") {
                retorno += campo.column + " = '" + campo.value + "', ";
            } else {
                retorno += campo.column + " = '" + campo.value + "', ";
            }
        }

        retorno = retorno.substring(0, retorno.length - 2);
        return retorno;
    }
}
function consultaHistoricoBacklog(constraints){
    try {        
        var query = "SELECT BACKLOG.*,  CCUSTO.des_empresa, CCUSTO.des_centro_custo ";
        query += "FROM etl-castilho.dev.gerencial_backlog as BACKLOG ";
        query += "INNER JOIN etl-castilho.dev.cadastro_centros_custo as CCUSTO ON ";
        query += "  BACKLOG.cod_coligada = CCUSTO.cod_coligada AND BACKLOG.cod_obra = CCUSTO.cod_obra ";
        query += "WHERE CCUSTO.cod_coligada = " + constraints.CODCOLIGADA + " AND  BACKLOG.cod_obra = '" + constraints.CODCCUSTO + "'";

        var retorno = executaQueryNoBigQuery(query);
        log.dir(retorno);
        return retorno;
    } catch (error) {
        throw error;   
    }
}


function getColumnFromContraints(constraints) {
    var columns = [
        { type: "int", column: "cod_coligada", value: constraints.cod_coligada },
        { type: "string", column: "cod_obra", value: constraints.cod_obra },

        // CLIENTE
        { type: "float", column: "vlr_pi", value: constraints.vlr_pi },
        { type: "float", column: "vlr_r", value: constraints.vlr_r },
        { type: "float", column: "vlr_aditivos", value: constraints.vlr_aditivos },
        { type: "float", column: "vlr_nao_executavel", value: constraints.vlr_nao_executavel },
        { type: "float", column: "vlr_pi_medido", value: constraints.vlr_pi_medido },
        { type: "float", column: "vlr_r_medido", value: constraints.vlr_r_medido },
        { type: "float", column: "vlr_aditivos_medido", value: constraints.vlr_aditivos_medido },
        { type: "string", column: "des_observacao", value: constraints.des_observacao },
        { type: "string", column: "des_indice_reajuste", value: constraints.des_indice_reajuste },
        { type: "date", column: "dt_base", value: constraints.dt_base },


        // UPDATE
        { type: "date", column: "dt_ultima_alteracao", value: getDateNow() },
        { type: "string", column: "user_ultima_alteracao", value: getValue("WKUser") },
    ];

    return columns;
}




function executaQueryNoBigQuery(query) {
    try {
        var data = {
            "query": query,
            "key": "75146630SXrF32382vYA",
        };

        var clientService = fluigAPI.getAuthorizeClientService();
        var data = {
            companyId: getValue("WKCompany") + '',
            serviceCode: 'BigQuery',
            endpoint: '/',
            method: 'post',
            timeoutService: '100',
            params: data,
        };

        var vo = clientService.invoke(JSON.stringify(data));
        log.dir(vo);
        if (vo.getResult() == null || vo.getResult().isEmpty()) {
            throw new Exception("Retorno está vazio");
        } else {
            var retorno = JSON.parse(vo.getResult());
            if (retorno.error != undefined && retorno.error != null && retorno.error != "") {
                throw retorno.error;
            }

            return retorno;
        }
    } catch (error) {
        throw catchError(error);
    }
}

// Utils
function getConstraints(constraints) {
    var retorno = {};
    if (constraints != null) {
        for (var i = 0; i < constraints.length; i++) {
            var constraint = constraints[i];
            retorno[constraint.fieldName] = constraint.initialValue;
        }
    }
    return retorno;
}
function returnDataset(STATUS, MENSAGEM, RESULT) {
    var dataset = DatasetBuilder.newDataset();
    dataset.addColumn("STATUS");
    dataset.addColumn("MENSAGEM");
    dataset.addColumn("RESULT");
    dataset.addRow([STATUS, MENSAGEM, RESULT]);
    return dataset;
}
function lancaErroSeConstraintsObrigatoriasNaoInformadas(constraints, listConstrainstObrigatorias) {
    try {
        var retornoErro = [];
        for (var i = 0; i < listConstrainstObrigatorias.length; i++) {
            if (constraints[listConstrainstObrigatorias[i]] == null || constraints[listConstrainstObrigatorias[i]] == "" || constraints[listConstrainstObrigatorias[i]] == undefined) {
                retornoErro.push(listConstrainstObrigatorias[i]);
            }
        }

        if (retornoErro.length > 0) {
            throw "Constraints obrigatorias nao informadas (" + retornoErro.join(", ") + ")";
        }
    } catch (error) {
        throw error;
    }
}
function catchError(error) {
    var msg = "";

    // Try to extract useful message safely
    if (error && error.javaException) {
        msg = error.javaException.getMessage();
    } else if (error && error.message) {
        if (error.message.Error) {
        } else {
            msg = error.message;
        }
    } else {
        msg = String(error);
    }

    log.error("ERRO==============> " + msg);
    log.error("Type of error: " + typeof error);
    log.error("Type of msg: " + typeof msg);

    // Safely rethrow as standard JS error
    return "Erro ao executar Dataset: " + msg;
}
function getDateNow() {
    var date = new Date();
    var dia = date.getDate();
    if (dia < 10) {
        dia = "0" + dia;
    }
    var mes = date.getMonth() + 1;
    if (mes < 10) {
        mes = "0" + mes;
    }

    var ano = date.getFullYear();

    var dateTime = [ano, mes, dia].join("-");
    return dateTime;
}