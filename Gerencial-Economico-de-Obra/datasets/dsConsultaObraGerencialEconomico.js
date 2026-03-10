function createDataset(fields, constraints, sortFields) {
    try {
        var constraints = getConstraints(constraints);
        lancaErroSeConstraintsObrigatoriasNaoInformadas(constraints, ["CODCOLIGADA","CODCCUSTO"]);

        var query = ""
        query += "SELECT ";
        query += "  BACKLOG.*,  CCUSTO.des_empresa, CCUSTO.des_centro_custo, CCUSTO.des_cliente, CCUSTO.des_coordenacao, CCUSTO.des_lider_contrato ";
        query += "FROM etl-castilho.dev.gerencial_backlog as BACKLOG ";
        query += "  INNER JOIN ( ";
        query += "      SELECT cod_coligada, cod_obra, MAX(dt_ultima_alteracao) as dt_ultima_alteracao ";
        query += "      FROM etl-castilho.dev.gerencial_backlog ";
        query += "           GROUP BY cod_coligada, cod_obra) as DTBASE ON  ";
        query += "      BACKLOG.cod_coligada = DTBASE.cod_coligada AND BACKLOG.cod_obra = DTBASE.cod_obra AND BACKLOG.dt_ultima_alteracao = DTBASE.dt_ultima_alteracao ";
        query += "INNER JOIN etl-castilho.dev.cadastro_centros_custo as CCUSTO ON ";
        query += "  BACKLOG.cod_coligada = CCUSTO.cod_coligada AND BACKLOG.cod_obra = CCUSTO.cod_obra ";
        query += "WHERE 1=1 ";
        query += "  AND CCUSTO.cod_coligada = " + constraints.CODCOLIGADA;
        query += "  AND CCUSTO.cod_obra = '" + constraints.CODCCUSTO + "'";

        var retorno = executaQueryNoBigQuery(query);

        return returnDataset("SUCCESS", "", JSON.stringify(retorno));


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