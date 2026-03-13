function createDataset(fields, constraints, sortFields) {
    try {
        var constraints = getConstraints(constraints);
        lancaErroSeConstraintsObrigatoriasNaoInformadas(constraints, ["CODCCUSTO"]);

        var query = "";
        query += "SELECT ";
        query += "       A.CODCOLIGADA, ";
        query += "       A.NEGOCIO, ";
        query += "       A.CODCCUSTO, ";
        query += "       A.NOMECCUSTO, ";
        query += "       A.CODDEPARTAMENTO, ";
        query += "       A.NOMEDEPARTAMENTO, ";
        query += "       CASE ";
        query += "              WHEN A.CODDEPARTAMENTO = '1.3.81' THEN 11 ";
        query += "              ELSE 10 ";
        query += "       END VERMELHO, ";
        query += "       A.NUMERO, ";
        query += "       A.CLASSSINTETICA, ";
        query += "       A.CLASSANALITICA, ";
        query += "       A.FORNECEDOR, ";
        query += "       CONVERT(DATE, A.DATAEMISSAO) AS EMISSAO, ";
        query += "       A.COMPETENCIA, ";
        query += "       CONVERT(MONEY, A.VALOR) AS VALOR ";
        query += "FROM ";
        query += "       ( ";
        query += "              SELECT ";
        query += "                     Z.CODCOLIGADA, ";
        query += "                     Z.NEGOCIO, ";
        query += "                     Z.CODCCUSTO, ";
        query += "                     Z.NOMECCUSTO, ";
        query += "                     Z.CODDEPARTAMENTO, ";
        query += "                     Z.NOMEDEPARTAMENTO, ";
        query += "                     Z.NUMERO, ";
        query += "                     Z.CLASSSINTETICA, ";
        query += "                     Z.CLASSANALITICA, ";
        query += "                     Z.FORNECEDOR, ";
        query += "                     CONVERT(DATE, Z.DATAEMISSAO) DATAEMISSAO, ";
        query += "                     Z.COMPETENCIA, ";
        query += "                     CONVERT(MONEY, Z.VALOR) VALOR ";
        query += "              FROM ";
        query += "                     ZCECONOMICO Z (NOLOCK) ";
        query += "              WHERE ";
        query += "                     Z.TIPO = 'Saída' ";
        query += "                     AND Z.CODCOLIGADA = 1 ";
        query += "                     AND Month (Z.DATAEMISSAO) = Month (Dateadd (M, -1, CONVERT(DATE, SYSDATETIME ()))) ";
        query += "                     AND Year (Z.DATAEMISSAO) = Year (Dateadd (M, -1, CONVERT(DATE, SYSDATETIME ()))) ";
        query += "                     AND Z.CODCCUSTO = ? ";
        query += "                     AND Z.NEGOCIO <> 'Guiana' ";
        query += "                     AND Z.CODCLASSANALITICA NOT IN ( ";
        query += "                            '2.4.040119', ";
        query += "                            '2.4.040108', ";
        query += "                            '2.4.040102', ";
        query += "                            '2.1.010103', ";
        query += "                            '2.4.040126', ";
        query += "                            '2.4.040123', ";
        query += "                            '2.2.010101', ";
        query += "                            '2.2.010101', ";
        query += "                            '2.2.020121', ";
        query += "                            '2.4.040103', ";
        query += "                            '2.1.010102', ";
        query += "                            '2.2.020102', ";
        query += "                            '2.2.020120', ";
        query += "                            '2.2.010103', ";
        query += "                            '2.2.020130', ";
        query += "                            '2.2.010102' ";
        query += "                     ) ";
        query += "                     AND ( ";
        query += "                            ( ";
        query += "                                   Z.CODCLASSANALITICA = '2.1.010201' ";
        query += "                                   AND Z.FORNECEDOR <> 'CASTILHO ENGENHARIA E EMPREENDIMENTOS S/A.' ";
        query += "                            ) ";
        query += "                            OR (Z.CODCLASSANALITICA <> '2.1.010201') ";
        query += "                     ) ";
        query += "              UNION ALL ";
        query += "              SELECT ";
        query += "                     COL.CODCOLIGADA, ";
        query += "                     COL.NOMECCUSTO, ";
        query += "                     COL.CODCCUSTO, ";
        query += "                     COL.NOMECCUSTO, ";
        query += "                     COL.CODDEPARTAMENTO, ";
        query += "                     COL.NOMEDEPARTAMENTO, ";
        query += "                     COL.NUMERO, ";
        query += "                     COL.CLASSSINTETICA, ";
        query += "                     COL.CLASSANALITICA, ";
        query += "                     COL.FORNECEDOR, ";
        query += "                     CONVERT(DATE, COL.DATAEMISSAO), ";
        query += "                     COL.COMPETENCIA, ";
        query += "                     CONVERT(MONEY, COL.VALOR) ";
        query += "              FROM ";
        query += "                     ZCECONOMICOCOLIGADAS COL (NOLOCK) ";
        query += "              WHERE ";
        query += "                     COL.TIPO = 'Saída' ";
        query += "                     AND Month (COL.DATAEMISSAO) = Month (Dateadd (M, -1, CONVERT(DATE, SYSDATETIME ()))) ";
        query += "                     AND Year (COL.DATAEMISSAO) = Year (Dateadd (M, -1, CONVERT(DATE, SYSDATETIME ()))) ";
        query += "                     AND COL.CODCCUSTO = ? ";
        query += "                     AND ( ";
        query += "                            COL.CODTB5FLX IS NULL ";
        query += "                            OR COL.CODTB5FLX NOT IN ('000009999', '000009997') ";
        query += "                            OR COL.CODTB5FLX = '000009991' ";
        query += "                     ) ";
        query += "                     AND COL.CODCLASSANALITICA NOT IN ( ";
        query += "                            '2.4.040119', ";
        query += "                            '2.4.040108', ";
        query += "                            '2.4.040102', ";
        query += "                            '2.1.010103', ";
        query += "                            '2.4.040126', ";
        query += "                            '2.4.040123', ";
        query += "                            '2.2.010101', ";
        query += "                            '2.2.010101', ";
        query += "                            '2.2.020121', ";
        query += "                            '2.4.040103', ";
        query += "                            '2.1.010102', ";
        query += "                            '2.2.020102', ";
        query += "                            '2.2.020120', ";
        query += "                            '2.2.010103', ";
        query += "                            '2.2.020130', ";
        query += "                            '2.2.010102' ";
        query += "                     ) ";
        query += "                     AND ( ";
        query += "                            ( ";
        query += "                                   COL.CODCLASSANALITICA = '2.1.010201' ";
        query += "                                   AND COL.FORNECEDOR <> 'CASTILHO ENGENHARIA E EMPREENDIMENTOS S/A.' ";
        query += "                            ) ";
        query += "                            OR (COL.CODCLASSANALITICA <> '2.1.010201') ";
        query += "                     ) ";
        query += "       ) A ";
        query += "ORDER BY ";
        query += "       A.CODCCUSTO, ";
        query += "       A.CLASSSINTETICA, ";
        query += "       A.DATAEMISSAO ";

        var retorno = executaQuery(query, [
            {type:"text", value:constraints.CODCCUSTO},
            {type:"text", value:constraints.CODCCUSTO},
        ], "/jdbc/FluigRM");

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
function executaQuery(query, constraints, dataSorce) {
    try {
        var dataSource = dataSorce;
        var ic = new javax.naming.InitialContext();
        var ds = ic.lookup(dataSource);

        var conn = ds.getConnection();
        var stmt = conn.prepareStatement(query);

        var counter = 1;
        for (var i = 0; i < constraints.length; i++) {
            var val = constraints[i];
            if (val.type == "int") {
                stmt.setInt(counter, val.value);
            }
            else if (val.type == "float") {
                stmt.setFloat(counter, val.value);
            }
            else if (val.type == "date") {
                stmt.setString(counter, val.value);
            }
            else if (val.type == "datetime") {
                stmt.setString(counter, val.value);
            } else {
                stmt.setString(counter, val.value);
            }
            counter++;
        }

        var rs = stmt.executeQuery();
        var columnCount = rs.getMetaData().getColumnCount();
        var retorno = [];

        while (rs.next()) {
            var linha = {};
            for (var j = 1; j < columnCount + 1; j++) {
                linha[rs.getMetaData().getColumnName(j)] = rs.getObject(rs.getMetaData().getColumnName(j)) + "";
            }
            retorno.push(linha);
        }

        return retorno;

    } catch (error) {
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
        throw "Erro ao executar Dataset: " + msg;
    } finally {
        if (stmt != null) {
            stmt.close();
        }
        if (conn != null) {
            conn.close();
        }
    }
}