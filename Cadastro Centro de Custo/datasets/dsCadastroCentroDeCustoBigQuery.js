function createDataset(fields, constraints, sortFields) {
    try {
        var constraints = getConstraints(constraints);
        lancaErroSeConstraintsObrigatoriasNaoInformadas(constraints, ["ACTION"]);

        if (constraints.ACTION == "SELECT") {
            var retorno = buscaCentrosDeCusto(constraints);
            return returnDataset("SUCCESS", "", JSON.stringify(retorno));
        }
        else if (constraints.ACTION == "UPDATE") {
            var retorno = updateCentroDeCusto(constraints);
            if (retorno) {
                return returnDataset("SUCCESS", "", JSON.stringify(retorno));
            } else {
                return returnDataset("ERROR", "", retorno);
            }
        }
        else if (constraints.ACTION == "CREATE") {
            var retorno = criaCentroDeCusto(constraints);
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

function buscaCentrosDeCusto(constraints) {
    try {
        var query = "SELECT * FROM etl-castilho.dev.cadastro_centros_custo WHERE 1=1 ";

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
        return retorno

    } catch (error) {
        throw catchError(error)
    }
}
function criaCentroDeCusto(constraints) {
    try {
        var columns = getColumnFromContraints(constraints);
        var query = "INSERT INTO etl-castilho.dev.cadastro_centros_custo (" + getColumns(columns) + ") VALUES (" + getValues(columns) + ")";

        log.info("dsCadastroCentroDeCustoBigQuery - criaCentroDeCusto - query: " + query);

        var retorno = executaQueryNoBigQuery(query);
        return retorno;
    } catch (error) {
        return catchError(error);
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
function updateCentroDeCusto(constraints) {
    try {
        var columns = getColumnFromContraints(constraints);

        var query = "UPDATE etl-castilho.dev.cadastro_centros_custo ";
        query += " SET " + getSetColumns(columns);
        query += " WHERE cod_coligada = " + constraints.PKCODCOLIGADA;
        query += " AND  cod_obra = '" + constraints.PKCODCCUSTO + "'";

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


function getColumnFromContraints(constraints) {
    var columns = [
        { type: "int", column: "cod_coligada", value: constraints.CODCOLIGADA },
        { type: "string", column: "des_empresa", value: constraints.NOMECOLIGADA },
        { type: "string", column: "cod_obra", value: constraints.CODCCUSTO },
        { type: "string", column: "des_centro_custo", value: constraints.CCUSTO },
        { type: "string", column: "des_objeto_contrato", value: constraints.OBJETOCONTRATO },
        { type: "string", column: "des_contrato", value: constraints.NUMEROCONTRATO },
        { type: "int", column: "idprj", value: constraints.IDPRJ },

        // CLIENTE
        { type: "string", column: "cod_cfo", value: constraints.CODCFO },
        { type: "string", column: "cnpj_cliente", value: constraints.CGCCFO },
        { type: "string", column: "des_cliente", value: constraints.NOMECLIENTE },

        // OBRA
        { type: "string", column: "des_setor", value: constraints.SETOR },
        { type: "string", column: "des_segmento", value: constraints.SEGMENTO },
        { type: "string", column: "des_tipo_segmento", value: constraints.TIPO_OBRA },
        { type: "string", column: "des_regiao", value: constraints.REGIONAL },
        { type: "string", column: "des_coordenacao", value: constraints.COORDENADOR },
        { type: "string", column: "des_lider_contrato", value: constraints.ENGEHEIRO },
        { type: "string", column: "des_chefe_escritorio", value: constraints.CHEFE_ESCRITORIO },
        { type: "string", column: "des_uf", value: constraints.UF },
        { type: "string", column: "des_cidade", value: constraints.CIDADE },

        // Datas
        { type: "string", column: "dt_ordem_inicio", value: constraints.DATA_INICIO_OBRA },
        { type: "int", column: "qt_prazo_contratual", value: constraints.PRAZO_OBRA_EM_DIAS },
        { type: "string", column: "dt_termino_contratual", value: constraints.DATA_TERMINO_CONTRATUAL },

        // RESULTADO
        { type: "float", column: "per_meta_resultado", value: constraints.META_RESULTADO },
        { type: "float", column: "per_castilho", value: constraints.PERCENTUAL_CASTILHO },

        // Consorcio
        { type: "bool", column: "st_consorcio", value: constraints.STATUS_CONSORCIO },
        { type: "string", column: "des_consorcio", value: constraints.DESCRICAO_CONSORCIO },

        // UPDATE
        { type: "string", column: "dt_ultima_alteracao", value: getDateNow() },
        { type: "string", column: "user_ultima_alteracao", value: getValue("WKUser") },
    ];

    if (constraints.DATA_TERMINO_OBRA && constraints.DATA_TERMINO_OBRA != "") {
        columns.push({ type: "string", column: "dt_termino_obra", value: constraints.DATA_TERMINO_OBRA });
    }

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