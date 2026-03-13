function createDataset(fields, constraints, sortFields) {
    try {
        var constraints = getConstraints(constraints);
        lancaErroSeConstraintsObrigatoriasNaoInformadas(constraints, ["CODCOLIGADA", "IDPRJ"]);

        var query = "";
        query += "WITH periodo AS ( ";
        query += "    SELECT  ";
        query += "        ZVWPERIODOS.CODCOLIGADA ";
        query += "        ,ZVWPERIODOS.IDPRJ ";
        query += "        ,ZVWPERIODOS.IDPERIODO AS Periodo ";
        query += "        ,CAST(DTINICIO AS DATE) AS DT_PERIODO ";
        query += "    FROM CastilhoRM.dbo.ZVWPERIODOS ";
        query += "    INNER JOIN ( ";
        query += "        SELECT  ";
        query += "            CODCOLIGADA, ";
        query += "            IDPRJ, ";
        query += "            MAX(IDPERIODO) AS Periodo ";
        query += "        FROM CastilhoRM.dbo.ZVWPERIODOS ";
        query += "        GROUP BY CODCOLIGADA, IDPRJ ";
        query += "    ) MAX_PERIODO ON ZVWPERIODOS.CODCOLIGADA = MAX_PERIODO.CODCOLIGADA  ";
        query += "        AND ZVWPERIODOS.IDPRJ = MAX_PERIODO.IDPRJ ";
        query += "        AND ZVWPERIODOS.IDPERIODO = MAX_PERIODO.Periodo ";
        query += "    ), ";
        query += " ";
        query += "    cronograma AS ( ";
        query += " ";
        query += "    SELECT ";
        query += "        Unpivoted.CODCOLIGADA, ";
        query += "        Unpivoted.IDPRJ, ";
        query += "        IDTRF, ";
        query += "        periodo.DT_PERIODO, ";
        query += "        periodo.periodo, ";
        query += "        MAX(CASE WHEN TIPOCRONOGRAMA = 'BASE' THEN Valor END) AS BASE, ";
        query += "        MAX(CASE WHEN TIPOCRONOGRAMA = 'PREVISTO' THEN Valor END) AS PREVISTO, ";
        query += "        MAX(CASE WHEN TIPOCRONOGRAMA = 'REALIZADO' THEN Valor END) AS REALIZADO, ";
        query += "        MAX(CASE WHEN TIPOCRONOGRAMA = 'MEDIDO' THEN Valor END) AS MEDIDO ";
        query += "    FROM ( ";
        query += "        SELECT ";
        query += "        CODCOLIGADA, ";
        query += "        IDPRJ, ";
        query += "        IDTRF, ";
        query += "        TIPOCRONOGRAMA, ";
        query += "        Periodo, ";
        query += "        Valor ";
        query += "    FROM ";
        query += "        (SELECT CODCOLIGADA, IDPRJ, IDTRF, TIPOCRONOGRAMA,  ";
        query += "                [1], [2], [3], [4], [5], [6], [7], [8], [9], [10], ";
        query += "                [11], [12], [13], [14], [15], [16], [17], [18], [19], [20], ";
        query += "                [21], [22], [23], [24], [25], [26], [27], [28], [29], [30], ";
        query += "                [31], [32], [33], [34], [35], [36], [37], [38], [39], [40], ";
        query += "                [41], [42], [43], [44], [45], [46], [47], [48], [49], [50], ";
        query += "                [51], [52], [53], [54], [55], [56], [57], [58], [59], [60], ";
        query += "                [61], [62], [63], [64], [65], [66], [67], [68], [69], [70], ";
        query += "                [71], [72], [73], [74], [75], [76], [77], [78], [79], [80], ";
        query += "                [81], [82], [83], [84], [85], [86], [87], [88], [89], [90], ";
        query += "                [91], [92], [93], [94], [95], [96], [97], [98], [99], [100], ";
        query += "                [101], [102], [103], [104], [105], [106], [107], [108], [109], [110], ";
        query += "                [111], [112], [113], [114], [115], [116], [117], [118], [119], [120], ";
        query += "                [121], [122], [123], [124], [125], [126], [127], [128], [129], [130], ";
        query += "                [131], [132], [133], [134], [135], [136], [137], [138], [139], [140], ";
        query += "                [141], [142], [143], [144], [145], [146], [147], [148], [149], [150] ";
        query += "        FROM ZVWCRONOGRAMA ";
        query += "        ) AS Src ";
        query += "    UNPIVOT ";
        query += "        (Valor FOR Periodo IN ( ";
        query += "                [1], [2], [3], [4], [5], [6], [7], [8], [9], [10], ";
        query += "                [11], [12], [13], [14], [15], [16], [17], [18], [19], [20], ";
        query += "                [21], [22], [23], [24], [25], [26], [27], [28], [29], [30], ";
        query += "                [31], [32], [33], [34], [35], [36], [37], [38], [39], [40], ";
        query += "                [41], [42], [43], [44], [45], [46], [47], [48], [49], [50], ";
        query += "                [51], [52], [53], [54], [55], [56], [57], [58], [59], [60], ";
        query += "                [61], [62], [63], [64], [65], [66], [67], [68], [69], [70], ";
        query += "                [71], [72], [73], [74], [75], [76], [77], [78], [79], [80], ";
        query += "                [81], [82], [83], [84], [85], [86], [87], [88], [89], [90], ";
        query += "                [91], [92], [93], [94], [95], [96], [97], [98], [99], [100], ";
        query += "                [101], [102], [103], [104], [105], [106], [107], [108], [109], [110], ";
        query += "                [111], [112], [113], [114], [115], [116], [117], [118], [119], [120], ";
        query += "                [121], [122], [123], [124], [125], [126], [127], [128], [129], [130], ";
        query += "                [131], [132], [133], [134], [135], [136], [137], [138], [139], [140], ";
        query += "                [141], [142], [143], [144], [145], [146], [147], [148], [149], [150] ";
        query += "        )) AS Unpvt ";
        query += "    ) AS Unpivoted ";
        query += " ";
        query += "    LEFT JOIN periodo ";
        query += "    ON Unpivoted.CODCOLIGADA = periodo.CODCOLIGADA ";
        query += "    AND Unpivoted.IDPRJ = periodo.IDPRJ ";
        query += "    AND Unpivoted.Periodo = periodo.Periodo ";
        query += " ";
        query += "    GROUP BY Unpivoted.CODCOLIGADA, Unpivoted.IDPRJ, IDTRF, periodo.DT_PERIODO, periodo.periodo ";
        query += " ";
        query += "    ) ";
        query += " ";
        query += "    SELECT DISTINCT";
        query += "		planilha.CODCOLIGADA AS cod_coligada ";
        query += "        ,planilha.IDPRJ AS id_projeto ";
        query += "        ,CASE WHEN TIPOPLANILHA = 0 THEN 'ATIVIDADES' ";
        query += "            ELSE 'SERVIÇOS' ";
        query += "            END AS tipo_planilha ";
        query += "        ,CLASSIFICACAO AS des_classificacao ";
        query += "        ,planilha.IDTRF AS id_tarefa ";
        query += "        ,CODTRF AS cod_tarefa ";
        query += "        ,NIVEL AS num_nivel ";
        query += "        ,NOMETAREFA AS des_tarefa ";
        query += "        ,SERVICO AS st_servico ";
        query += "        ,INDIRETO AS st_indireto ";
        query += "        ,CODUND cod_unidade ";
        query += "        ,QUANTIDADE AS qt_item ";
        query += "        ,VALORUNIT AS vlr_unitario_item ";
        query += "        ,VALORTOTAL AS vlr_total_item ";
        query += "        ,PERCOBRA AS per_obra ";
        query += "        ,PERCPROJETO AS per_projeto ";
        query += "        ,PERCCONCLUIDO AS per_concluido ";
        query += " ";
        query += "    FROM CastilhoRM.dbo.ZVWPLANILHA planilha ";
        query += " ";
        query += "    INNER JOIN cronograma ";
        query += "    ON planilha.CODCOLIGADA = cronograma.CODCOLIGADA ";
        query += "    AND planilha.IDPRJ = cronograma.IDPRJ ";
        query += "    AND planilha.IDTRF = cronograma.IDTRF ";
        query += " ";
        query += "    WHERE planilha.CODCOLIGADA = ? AND CLASSIFICACAO = 'Plan e Acomp'  and planilha.idprj = ? and TIPOPLANILHA = 1 and SERVICO = 1 ";
        query += " ";
        query += "    ORDER BY planilha.CODTRF, NIVEL ";

        var retorno = executaQuery(query,[
            {type:"int", value:constraints.CODCOLIGADA},
            {type:"int", value:constraints.IDPRJ},
        ],"/jdbc/FluigRM");

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