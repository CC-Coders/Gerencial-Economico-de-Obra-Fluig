function createDataset(fields, constraints, sortFields) {
    try {
        var constraints = getConstraints(constraints);
        lancaErroSeConstraintsObrigatoriasNaoInformadas(constraints, ["CODCOLIGADA", "CODCCUSTO"]);

        var query = "";
        query += "SELECT ";
        query += "    FAT.IDMOV, ";
        query += "    FAT.CODCCUSTO, ";
        query += "    CCU.NOME AS NOME, ";
        query += "    CASE ";
        query += "        WHEN CCU.CODCCUSTO LIKE '1.2%' THEN 'Sul' ";
        query += "        WHEN CCU.CODCCUSTO LIKE '1.3%' THEN 'Norte' ";
        query += "        WHEN CCU.CODCCUSTO LIKE '1.4%' THEN 'Sudeste' ";
        query += "        WHEN CCU.CODCCUSTO LIKE '1.5%' THEN 'Nordeste' ";
        query += "        WHEN CCU.CODCCUSTO LIKE '1.6%' THEN 'Centro-Oeste' ";
        query += "        ELSE ' - ' ";
        query += "    END AS REGIONAL, ";
        query += "    FAT.NOMEFANTASIA AS CLIENTE, ";
        query += "    FAT.MEDICAO, ";
        query += "    FAT.COMPETENCIA, ";
        query += "    FAT.NFISCAL, ";
        query += "    FAT.EMISSAO AS EMISSAO, ";
        query += "    CONVERT(MONEY, FAT.VALORBRUTO) AS VALORBRUTO, ";
        query += "    /*CONVERT(MONEY, FAT.PIS)             AS PIS,*/ ";
        query += "    CASE ";
        query += "        WHEN FAT.IDMOV = 1067864 THEN 3029.8511 ";
        query += "        ELSE FAT.PIS ";
        query += "    END AS PIS, ";
        query += "    CONVERT(MONEY, FAT.COFINS) AS COFINS, ";
        query += "    CONVERT(MONEY, FAT.CSLL) AS CSLL, ";
        query += "    CONVERT(MONEY, FAT.IRRF) AS IRRF, ";
        query += "    CONVERT(MONEY, FAT.INSS) AS INSS, ";
        query += "    CONVERT(MONEY, FAT.ISS) AS ISS, ";
        query += "    CONVERT(MONEY, FAT.ISSRET) AS ISSRET, ";
        query += "    FAT2.DATAPREV AS DATAPREV, ";
        query += "    FAT2.DATAREC AS DATAREC, ";
        query += "    CONVERT(MONEY, FAT2.PISRF) AS PIS2, ";
        query += "    CONVERT(MONEY, FAT2.COFIRF) AS COFINS2, ";
        query += "    CONVERT(MONEY, FAT2.CSLLRF) AS CSLL2, ";
        query += "    CONVERT(MONEY, FAT2.IRRF) AS IRRF2, ";
        query += "    CONVERT(MONEY, FAT2.INSS) AS INSS2, ";
        query += "    CONVERT(MONEY, FAT2.ISS) AS ISS2, ";
        query += "    CONVERT(MONEY, FAT2.DESCONTOS) AS DESCONTOS, ";
        query += "    CONVERT(MONEY, FAT2.JUROS) AS JUROS, ";
        query += "    CONVERT(MONEY, FAT2.ADIANTAMENTO) AS ADIANTAMENTO, ";
        query += "    CONVERT(MONEY, FAT2.RETENCAO) AS RETENCAO, ";
        query += "    CONVERT(MONEY, FAT2.LIQREC) AS LIQREC, ";
        query += "    CASE ";
        query += "        WHEN (FAT2.IDMOV = 1002668) THEN 0 /*CASO DA NF 7241, BAIXA FOI FEITA VIA VALOR DE ISS.*/ ";
        query += "        WHEN ( ";
        query += "            FAT.CODCCUSTO = '1.4.005' ";
        query += "            AND FAT2.ADIANTAMENTO > 0 ";
        query += "        ) THEN 0 ";
        query += "        WHEN ( ";
        query += "            FAT.CODCCUSTO = '1.2.061' ";
        query += "            AND FAT2.LIQREC = 0 ";
        query += "            AND FAT2.ADIANTAMENTO > 0 ";
        query += "        ) THEN (FAT2.ADIANTAMENTO - (FAT.VALORBRUTO - FAT2.PISRF - FAT2.COFIRF - FAT2.CSLLRF - FAT2.IRRF - FAT2.INSS - FAT2.ISS - FAT2.DESCONTOS - FAT2.JUROS)) ";
        query += "        ELSE CONVERT(MONEY, FAT2.VALORBRUTOABER) ";
        query += "    END AS SALDO, ";
        query += "    VALOR_PI, ";
        query += "    VALOR_R ";
        query += "FROM ";
        query += "    View_Cas_ControleFaturamento FAT ";
        query += "    LEFT JOIN View_Cas_ControleFaturamento2 FAT2 ON FAT2.IDMOV = FAT.IDMOV ";
        query += "    INNER JOIN GCCUSTO CCU ON CCU.CODCOLIGADA = 1 ";
        query += "    AND CCU.CODCCUSTO = FAT.CODCCUSTO ";
        query += "    LEFT JOIN TMOVCOMPL ON TMOVCOMPL.CODCOLIGADA = 1 ";
        query += "    AND TMOVCOMPL.IDMOV = FAT.IDMOV ";
        query += "WHERE ";
        query += "    FAT.CODCCUSTO not in ( ";
        query += "        '1.1.001', ";
        query += "        '1.2.007', ";
        query += "        '1.2.008', ";
        query += "        '1.3.038', ";
        query += "        '1.3.032', ";
        query += "        '1.3.030', ";
        query += "        '1.3.031', ";
        query += "        '1.3.028', ";
        query += "        '1.3.013', ";
        query += "        '1.3.014', ";
        query += "        '1.2.009', ";
        query += "        '1.3.037', ";
        query += "        '1.3.007', ";
        query += "        '1.3.003', ";
        query += "        '1.3.047', ";
        query += "        '1.3.026', ";
        query += "        '1.3.048', ";
        query += "        '1.2.001', ";
        query += "        '1.3.010', ";
        query += "        '1.3.010', ";
        query += "        '1.2.003', ";
        query += "        '1.2.006', ";
        query += "        '1.3.009', ";
        query += "        '1.3.011', ";
        query += "        '1.3.006', ";
        query += "        '1.2.012', ";
        query += "        '1.2.011', ";
        query += "        '1.2.002', ";
        query += "        '1.3.024', ";
        query += "        '1.2.005', ";
        query += "        '1.3.036', ";
        query += "        '1.2.004', ";
        query += "        '1.3.005', ";
        query += "        '1.1.004', ";
        query += "        '1.1.002', ";
        query += "        '1.3.001', ";
        query += "        '1.1.003', ";
        query += "        '1.3.012', ";
        query += "        '1.3.016', ";
        query += "        '1.3.018', ";
        query += "        '1.2.013', ";
        query += "        '1.2.014', ";
        query += "        '1.2.015', ";
        query += "        '1.3.019', ";
        query += "        '1.2.016', ";
        query += "        '1.3.020', ";
        query += "        '1.3.021', ";
        query += "        '1.2.017', ";
        query += "        '1.1.006', ";
        query += "        '1.3.022', ";
        query += "        '1.3.023', ";
        query += "        '1.2.020', ";
        query += "        '1.2.019', ";
        query += "        '1.2.018', ";
        query += "        '1.3.025', ";
        query += "        '1.3.027', ";
        query += "        '1.2.022', ";
        query += "        '1.3.029', ";
        query += "        '1.3.033', ";
        query += "        '1.2.024', ";
        query += "        '1.2.025', ";
        query += "        '1.2.026', ";
        query += "        '1.2.027', ";
        query += "        '1.2.028', ";
        query += "        '1.2.029', ";
        query += "        '1.2.030', ";
        query += "        '1.3.039', ";
        query += "        '1.2.031', ";
        query += "        '1.2.032', ";
        query += "        '1.2.033', ";
        query += "        '1.2.034', ";
        query += "        '1.2.035', ";
        query += "        '1.2.036', ";
        query += "        '1.2.037', ";
        query += "        '1.2.038', ";
        query += "        '1.2.039', ";
        query += "        '1.2.040', ";
        query += "        '1.3.046', ";
        query += "        '1.1.008', ";
        query += "        '1.1.011' ";
        query += "    ) ";
        query += "    AND FAT.IDMOV <> 791825 ";
        query += "    AND FAT.CODCCUSTO = ? ";
        query += "ORDER BY ";
        query += "    FAT.NFISCAL ";


        var retorno = executaQuery(query,[
            {type:"text", value: constraints.CODCCUSTO},
        ],"/jdbc/FluigRM");

        return returnDataset("SUCCESS","", JSON.stringify(retorno));

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
                }else{
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