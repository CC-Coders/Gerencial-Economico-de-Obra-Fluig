function createDataset(fields, constraints, sortFields) {
    try {
        var constraints = getConstraints(constraints);
        lancaErroSeConstraintsObrigatoriasNaoInformadas(constraints, ["CODCOLIGADA", "XML"]);

        log.info("XML Produção:");
        log.dir(constraints.XML);

        var pUsuario = "fluig";
        var pPassword = "flu!g@cc#2018";
        var service = ServiceManager.getService("wsProcessRM");
        var serviceHelper = service.getBean();
        var serviceLocator = service.instantiate("com.totvs.WsProcess");
        var wsObj = serviceLocator.getRMIwsProcess();

        var authService = serviceHelper.getBasicAuthenticatedClient(wsObj, "com.totvs.IwsProcess", pUsuario, pPassword);
        var ret = authService.executeWithXmlParams('PrjEfetuarLancamentoMultiploData', constraints.XML);
        log.info("Retorno")
        log.dir(ret)
        // if (ret == "1") {
            return returnDataset("SUCCESS","","");
        // }
        // else {
        //     return returnDataset("ERROR",ret,"");
        // }

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