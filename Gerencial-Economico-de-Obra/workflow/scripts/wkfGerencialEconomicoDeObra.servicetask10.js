function servicetask10(attempt, message) {
    try {
        var CODCOLIGADA = hAPI.getCardValue("CODCOLIGADA");
        var CODCCUSTO = hAPI.getCardValue("CODCCUSTO");
        var IDPRJ = hAPI.getCardValue("IDPRJ");
        var IDPERIODO = hAPI.getCardValue("IDPERIODO");


        var planilhaDeProducao = [];
        var indexes = hAPI.getCardValue("tableProducao");

        for (var i = 0; i < indexes.length; i++) {
            var id = indexes[i];

            var cod_tarefa = hAPI.getCardValue("CODTAREFA" + "___" + id);
            var descricao_tarefa = hAPI.getCardValue("DESCRICAO" + "___" + id);
            var un_tarefa = hAPI.getCardValue("UN" + "___" + id);
            var quantidade_medida_tarefa = hAPI.getCardValue("QUANTIDADE" + "___" + id);
            var valor_unitario_tarefa = hAPI.getCardValue("VALOR_UNIDADE" + "___" + id);
            var valor_realizado_tarefa = hAPI.getCardValue("VALOR_TOTAL" + "___" + id);

            planilhaDeProducao.push({
                cod_tarefa: cod_tarefa,
                descricao_tarefa: descricao_tarefa,
                un_tarefa: un_tarefa,
                quantidade_medida_tarefa: quantidade_medida_tarefa,
                valor_unitario_tarefa: valor_unitario_tarefa,
                valor_realizado_tarefa: valor_realizado_tarefa,
            });
        }



        for (var i = 0; i < planilhaDeProducao.length; i++) {
            var tarefa = planilhaDeProducao[i];
            var XML = getXML(CODCOLIGADA, IDPRJ, IDPERIODO, tarefa.IDTRF, tarefa.valor_realizado_tarefa);


            var pUsuario = "fluig";
			var pPassword = "flu!g@cc#2018";
            var service = ServiceManager.getService("wsProcessRM");
            var serviceHelper = service.getBean();
            var serviceLocator = service.instantiate("com.totvs.WsProcess");
            var wsObj = serviceLocator.getRMIwsProcess();

            var authService = serviceHelper.getBasicAuthenticatedClient(wsObj, "com.totvs.IwsProcess", pUsuario, pPassword);
            var ret = authService.executeWithParams('PrjEfetuarLancamentoMultiploData', XML);

            if (ret == "1") {
                
                return true;
            }
            else {
                throw ret;
            }
        }


    } catch (error) {
        throw error;
    }
}

function getXML(CODCOLIGADA, IDPRJ, IDPERIODO, IDTRF, VALOR) {
    var XML = "";
    XML += '<PrjLancMultiploParamsProc z:Id="i1" xmlns="http://www.totvs.com.br/RM/';
    XML += '  xmlns:i="http://www.w3.org/2001/XMLSchema-instance';
    XML += '  xmlns:z="http://schemas.microsoft.com/2003/10/Serialization/"';
    XML += '  <ActionModule xmlns="http://www.totvs.com/">M</ActionModule';
    XML += '  <ActionName xmlns="http://www.totvs.com/">PrjLancamentoMultiploServicoAction</ActionName';
    XML += '  <ConnectionId i:nil="true" xmlns="http://www.totvs.com/" /';
    XML += '  <ConnectionString i:nil="true" xmlns="http://www.totvs.com/" /';
    XML += '  <Context z:Id="i2" xmlns="http://www.totvs.com/" xmlns:a="http://www.totvs.com.br/RM/"';
    XML += '    <a:_params xmlns:b="http://schemas.microsoft.com/2003/10/Serialization/Arrays"';
    XML += '      <b:KeyValueOfanyTypeanyType';
    XML += '        <b:Key i:type="c:string" xmlns:c="http://www.w3.org/2001/XMLSchema">$EXERCICIOFISCAL</b:Key';
    XML += '        <b:Value i:type="c:int" xmlns:c="http://www.w3.org/2001/XMLSchema">8</b:Value';
    XML += '      </b:KeyValueOfanyTypeanyType';
    XML += '      <b:KeyValueOfanyTypeanyType';
    XML += '        <b:Key i:type="c:string" xmlns:c="http://www.w3.org/2001/XMLSchema">$CODLOCPRT</b:Key';
    XML += '        <b:Value i:type="c:int" xmlns:c="http://www.w3.org/2001/XMLSchema">-1</b:Value';
    XML += '      </b:KeyValueOfanyTypeanyType';
    XML += '      <b:KeyValueOfanyTypeanyType';
    XML += '        <b:Key i:type="c:string" xmlns:c="http://www.w3.org/2001/XMLSchema">$CODTIPOCURSO</b:Key';
    XML += '        <b:Value i:type="c:int" xmlns:c="http://www.w3.org/2001/XMLSchema">-1</b:Value';
    XML += '      </b:KeyValueOfanyTypeanyType';
    XML += '      <b:KeyValueOfanyTypeanyType';
    XML += '        <b:Key i:type="c:string" xmlns:c="http://www.w3.org/2001/XMLSchema">$EDUTIPOUSR</b:Key';
    XML += '        <b:Value i:type="c:string" xmlns:c="http://www.w3.org/2001/XMLSchema">-1</b:Value';
    XML += '      </b:KeyValueOfanyTypeanyType';
    XML += '      <b:KeyValueOfanyTypeanyType';
    XML += '        <b:Key i:type="c:string" xmlns:c="http://www.w3.org/2001/XMLSchema">$CODUNIDADEBIB</b:Key';
    XML += '        <b:Value i:type="c:int" xmlns:c="http://www.w3.org/2001/XMLSchema">-1</b:Value';
    XML += '      </b:KeyValueOfanyTypeanyType';
    XML += '      <b:KeyValueOfanyTypeanyType';
    XML += '        <b:Key i:type="c:string" xmlns:c="http://www.w3.org/2001/XMLSchema">$CODCOLIGADA</b:Key';
    XML += '        <b:Value i:type="c:int" xmlns:c="http://www.w3.org/2001/XMLSchema">1</b:Value';
    XML += '      </b:KeyValueOfanyTypeanyType';
    XML += '      <b:KeyValueOfanyTypeanyType';
    XML += '        <b:Key i:type="c:string" xmlns:c="http://www.w3.org/2001/XMLSchema">CONTEXTOPRJ</b:Key';
    XML += '        <b:Value i:type="c:boolean" xmlns:c="http://www.w3.org/2001/XMLSchema">false</b:Value';
    XML += '      </b:KeyValueOfanyTypeanyType';
    XML += '      <b:KeyValueOfanyTypeanyType';
    XML += '        <b:Key i:type="c:string" xmlns:c="http://www.w3.org/2001/XMLSchema">$RHTIPOUSR</b:Key';
    XML += '        <b:Value i:type="c:string" xmlns:c="http://www.w3.org/2001/XMLSchema">-1</b:Value';
    XML += '      </b:KeyValueOfanyTypeanyType';
    XML += '      <b:KeyValueOfanyTypeanyType';
    XML += '        <b:Key i:type="c:string" xmlns:c="http://www.w3.org/2001/XMLSchema">$CODIGOEXTERNO</b:Key';
    XML += '        <b:Value i:type="c:string" xmlns:c="http://www.w3.org/2001/XMLSchema">-1</b:Value';
    XML += '      </b:KeyValueOfanyTypeanyType';
    XML += '      <b:KeyValueOfanyTypeanyType';
    XML += '        <b:Key i:type="c:string" xmlns:c="http://www.w3.org/2001/XMLSchema">$CODSISTEMA</b:Key';
    XML += '        <b:Value i:type="c:string" xmlns:c="http://www.w3.org/2001/XMLSchema">M</b:Value';
    XML += '      </b:KeyValueOfanyTypeanyType';
    XML += '      <b:KeyValueOfanyTypeanyType';
    XML += '        <b:Key i:type="c:string" xmlns:c="http://www.w3.org/2001/XMLSchema">$CODUSUARIOSERVICO</b:Key';
    XML += '        <b:Value i:type="c:string" xmlns:c="http://www.w3.org/2001/XMLSchema" /';
    XML += '      </b:KeyValueOfanyTypeanyType';
    XML += '      <b:KeyValueOfanyTypeanyType';
    XML += '        <b:Key i:type="c:string" xmlns:c="http://www.w3.org/2001/XMLSchema">$CODUSUARIO</b:Key';
    XML += '        <b:Value i:type="c:string" xmlns:c="http://www.w3.org/2001/XMLSchema">Gabriel.Persike</b:Value';
    XML += '      </b:KeyValueOfanyTypeanyType';
    XML += '      <b:KeyValueOfanyTypeanyType';
    XML += '        <b:Key i:type="c:string" xmlns:c="http://www.w3.org/2001/XMLSchema">$IDPRJ</b:Key';
    XML += '        <b:Value i:type="c:int" xmlns:c="http://www.w3.org/2001/XMLSchema">7090</b:Value';
    XML += '      </b:KeyValueOfanyTypeanyType';
    XML += '      <b:KeyValueOfanyTypeanyType';
    XML += '        <b:Key i:type="c:string" xmlns:c="http://www.w3.org/2001/XMLSchema">$CHAPAFUNCIONARIO</b:Key';
    XML += '        <b:Value i:type="c:string" xmlns:c="http://www.w3.org/2001/XMLSchema">-1</b:Value';
    XML += '      </b:KeyValueOfanyTypeanyType';
    XML += '      <b:KeyValueOfanyTypeanyType';
    XML += '        <b:Key i:type="c:string" xmlns:c="http://www.w3.org/2001/XMLSchema">$CODFILIAL</b:Key';
    XML += '        <b:Value i:type="c:int" xmlns:c="http://www.w3.org/2001/XMLSchema">1</b:Value';
    XML += '      </b:KeyValueOfanyTypeanyType';
    XML += '    </a:_params';
    XML += '    <a:Environment>WebServices</a:Environment';
    XML += '  </Context';
    XML += '  <CustomData i:nil="true" xmlns="http://www.totvs.com/" /';
    XML += '  <DriverType i:nil="true" xmlns="http://www.totvs.com/" /';
    XML += '  <MasterActionName xmlns="http://www.totvs.com/">PrjPlanilhaServicoAction</MasterActionName';
    XML += '  <PrimaryKeyList xmlns="http://www.totvs.com/';
    XML += '    xmlns:a="http://schemas.microsoft.com/2003/10/Serialization/Arrays"';
    XML += '    <a:ArrayOfanyType';
    XML += '      <a:anyType i:type="b:short" xmlns:b="http://www.w3.org/2001/XMLSchema">' + CODCOLIGADA + '</a:anyType';
    XML += '      <a:anyType i:type="b:int" xmlns:b="http://www.w3.org/2001/XMLSchema">' + IDPRJ + '</a:anyType';
    XML += '      <a:anyType i:type="b:int" xmlns:b="http://www.w3.org/2001/XMLSchema">' + IDTRF + '</a:anyType';
    XML += '      <a:anyType i:type="b:int" xmlns:b="http://www.w3.org/2001/XMLSchema">0</a:anyType';
    XML += '      <a:anyType i:type="b:int" xmlns:b="http://www.w3.org/2001/XMLSchema">0</a:anyType';
    XML += '    </a:ArrayOfanyType';
    XML += '  </PrimaryKeyList';
    XML += '  <PrimaryKeyNames xmlns="http://www.totvs.com/';
    XML += '    xmlns:a="http://schemas.microsoft.com/2003/10/Serialization/Arrays"';
    XML += '    <a:string>CODCOLIGADA</a:string';
    XML += '    <a:string>IDPRJ</a:string';
    XML += '    <a:string>IDTRF</a:string';
    XML += '    <a:string>TIPOPLANILHA</a:string';
    XML += '    <a:string>IDCENARIO</a:string';
    XML += '  </PrimaryKeyNames';
    XML += '  <PrimaryKeyTableName xmlns="http://www.totvs.com/">MTAREFA</PrimaryKeyTableName';
    XML += '  <ProcessName xmlns="http://www.totvs.com/">Lançamentos Múltiplos - Cronograma</ProcessName';
    XML += '  <ServerName xmlns="http://www.totvs.com/">PrjEfetuarLancamentoMultiploData</ServerName';
    XML += '  <CodColigada>' + CODCOLIGADA + '</CodColigada';
    XML += '  <ConsideraPert>false</ConsideraPert';
    XML += '  <ConverterGrandeza>Valor</ConverterGrandeza';
    XML += '  <Cronogramas xmlns:a="http://schemas.datacontract.org/2004/07/RM.Prj.Parametros"';
    XML += '    <a:PrjTipoCronogramaEnum>Medido</a:PrjTipoCronogramaEnum';
    XML += '  </Cronogramas';
    XML += '  <Grandeza>Valor</Grandeza';
    XML += '  <IdPrj>' + IDPRJ + '</IdPrj';
    XML += '  <Periodos xmlns:a="http://schemas.microsoft.com/2003/10/Serialization/Arrays"';
    XML += '    <a:short>' + IDPERIODO + '</a:short';
    XML += '  </Periodos';
    XML += '  <Ratear>false</Ratear';
    XML += '  <SomenteConverter>false</SomenteConverter';
    XML += '  <UtilizaFormula>false</UtilizaFormula';
    XML += '  <UtilizarPercentualConcluidoPert>false</UtilizarPercentualConcluidoPert';
    XML += '  <valor>' + VALOR + '</valor';
    XML += '</PrjLancMultiploParamsProc';

    return XML;


}