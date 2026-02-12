function createDataset(fields, constraints, sortFields) {
    try {
        var constraints = getConstraints(constraints);
        lancaErroSeConstraintsObrigatoriasNaoInformadas(constraints, ["ACTION"]);

        if (constraints.ACTION == "SELECT") {
            var retorno = buscaCentrosDeCusto(constraints);
            return returnDataset("SUCCESS","", JSON.stringify(retorno));
        }
        else if (constraints.ACTION == "UPDATE") {
            
        }
        else if (constraints.ACTION == "CREATE") {
            
        }
        else if (constraints.ACTION == "DELETE") {
            throw "ACTION DELETE não implementado.";
        }
        else{
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

function buscaCentrosDeCusto(constraints) {
    try {
        var query = "SELECT * FROM etl-castilho.dev.cadastro_centros_custo WHERE 1=1 ";

        var filtros = JSON.parse(constraints.FILTROS);
        for (var i = 0; i < filtros.length; i++) {
            var filtro = filtros[i];

            if (filtro.LIKE_SEARCH == "true") {
                query += " AND " + filtro.column + " like '" + filtro + "'";
            }
            else{
                query += " AND " + filtro.column + " = '" + filtro + "'";
            }
            
        }


        var retorno = executaQueryNoBigQuery(query);

        log.dir(retorno);
        return retorno

    } catch (error) {
        throw catchError(error)
    }
}
function criaCentroDeCusto(constraint){
    try {
        var query = "INSERT INTO etl-castilho.dev.cadastro_centros_custo (";
        query += "cod_coligada, ";
        query += "des_empresa, ";
        query += "cod_obra, ";
        query += "des_centro_custo, ";
        query += "des_coordenacao, ";
        query += "des_uf, ";
        query += "des_regiao, ";
        query += "des_cliente, ";
        query += "des_contrato, ";
        query += "per_castilho, ";

        query += "dt_base, ";
        query += "st_consorcio, ";
        query += "des_consorcio, ";
        query += "per_meta_resultado, ";
        query += "des_segmento, ";
        query += "des_situacao, ";
        query += "dt_ordem_inicio, ";
        query += "dt_termino_obra, ";
        query += "des_objeto_contrato, ";
        query += "des_setor, ";

        query += "qt_prazo_contratual, ";
        query += "dt_termino_contratual, ";
        query += "des_lider_contrato, ";
        query += "dt_ultima_alteracao, ";
        query += "user_ultima_alteracao";        
        query += ") VALUES (";
        query += "?,?,?,?,?,?,?,?,?,? ?,?,?,?,?,?,?,?,?,? ?,?,?,?,?";
        query += ")";


    } catch (error) {
        return catchError(error);
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
            return JSON.parse(vo.getResult());
        }
    } catch (error) {
        return catchError(error);
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