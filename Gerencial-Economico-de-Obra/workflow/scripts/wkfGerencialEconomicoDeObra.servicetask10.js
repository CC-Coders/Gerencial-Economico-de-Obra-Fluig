function servicetask10(attempt, message) {
    try {
        var CODCOLIGADA = hAPI.getCardValue("CODCOLIGADA");
        var CODCCUSTO = hAPI.getCardValue("CODCCUSTO");
        var IDPRJ = hAPI.getCardValue("IDPRJ");
        var IDPERIODO = hAPI.getCardValue("IDPERIODO");

        var cardData = hAPI.getCardData(getValue("WKNumProces"));

        var planilhaDeProducao = [];
        var indexes = hAPI.getChildrenIndexes("tableProducao");

        for (var i = 0; i < indexes.length && i<10; i++) {
            var id = indexes[i];

            var id_tarefa = cardData.get("id_tarefa" + "___" + id);
            var cod_tarefa = cardData.get("cod_tarefa" + "___" + id);
            var descricao_tarefa = cardData.get("des_tarefa" + "___" + id);
            var un_tarefa = cardData.get("un_medida" + "___" + id);
            var quantidade_medida_tarefa = cardData.get("quantidade" + "___" + id);
            var valor_unitario_tarefa = cardData.get("vlr_unitario" + "___" + id);

            planilhaDeProducao.push({
                id_tarefa: id_tarefa,
                cod_tarefa: cod_tarefa,
                descricao_tarefa: descricao_tarefa,
                un_tarefa: un_tarefa,
                quantidade_medida_tarefa: quantidade_medida_tarefa,
                valor_unitario_tarefa: valor_unitario_tarefa
            });
        }

        for (var i = 0; i < planilhaDeProducao.length; i++) {
            log.info("I:"+i);
            var tarefa = planilhaDeProducao[i];
          
            var query = "INSERT INTO MTRFREAL (CODCOLIGADA,IDPRJ,IDTRF,NUMPERIODO, QUANTREAL, CAMPOINFORMADO) "
                query += "VALUES ";
                query += "(?,?,?,?,?,?)";

                executeInsert(query, [
                    {type:"int", value:CODCOLIGADA},
                    {type:"int", value:IDPRJ},
                    {type:"int", value:tarefa.id_tarefa},
                    {type:"int", value:IDPERIODO},
                    {type:"float", value:tarefa.quantidade_medida_tarefa},
                    {type:"text", value:"Q"},//Quantidade
                ], "/jdbc/FluigRM");
          
          
            // var XML = getXML(CODCOLIGADA, IDPRJ, IDPERIODO, tarefa.id_tarefa, tarefa.quantidade_medida_tarefa);
            // var ds = DatasetFactory.getDataset("dsAtualizaItemPlanejamentoGerencialEconomico",null,[
            //     DatasetFactory.createConstraint("CODCOLIGADA", CODCOLIGADA,CODCOLIGADA,ConstraintType.MUST),
            //     DatasetFactory.createConstraint("XML", XML,XML,ConstraintType.MUST),
            // ],null);

            // var STATUS = ds.getValue(0,"STATUS");
            // if (STATUS != "SUCCESS") {
            //     throw ds.getValue(0,"MENSAGEM");
            // }
        }


    } catch (error) {
        throw error;
    }
}

function getXML(CODCOLIGADA, IDPRJ, IDPERIODO, IDTRF, QUANTIDADE) {
    var XML = '<PrjLancMultiploParamsProc z:Id="i1" xmlns="http://www.totvs.com.br/RM/" xmlns:i="http://www.w3.org/2001/XMLSchema-instance" xmlns:z="http://schemas.microsoft.com/2003/10/Serialization/">';
    XML += '  <ActionModule xmlns="http://www.totvs.com/">M</ActionModule>';
    XML += '  <ActionName xmlns="http://www.totvs.com/">PrjLancamentoMultiploServicoAction</ActionName>';
    XML += '  <CanParallelize xmlns="http://www.totvs.com/">false</CanParallelize>';
    XML += '  <CanSendMail xmlns="http://www.totvs.com/">false</CanSendMail>';
    XML += '  <CanWaitSchedule xmlns="http://www.totvs.com/">false</CanWaitSchedule>';
    XML += '  <CodUsuario xmlns="http://www.totvs.com/">Gabriel.Persike</CodUsuario>';
    XML += '  <ConnectionId i:nil="true" xmlns="http://www.totvs.com/" />';
    XML += '  <ConnectionString i:nil="true" xmlns="http://www.totvs.com/" />';
    XML += '  <Context z:Id="i2" xmlns="http://www.totvs.com/" xmlns:a="http://www.totvs.com.br/RM/">';
    XML += '    <a:_params xmlns:b="http://schemas.microsoft.com/2003/10/Serialization/Arrays">';
    XML += '      <b:KeyValueOfanyTypeanyType>';
    XML += '        <b:Key i:type="c:string" xmlns:c="http://www.w3.org/2001/XMLSchema">$EXERCICIOFISCAL</b:Key>';
    XML += '        <b:Value i:type="c:int" xmlns:c="http://www.w3.org/2001/XMLSchema">8</b:Value>';
    XML += '      </b:KeyValueOfanyTypeanyType>';
    XML += '      <b:KeyValueOfanyTypeanyType>';
    XML += '        <b:Key i:type="c:string" xmlns:c="http://www.w3.org/2001/XMLSchema">$CODLOCPRT</b:Key>';
    XML += '        <b:Value i:type="c:int" xmlns:c="http://www.w3.org/2001/XMLSchema">-1</b:Value>';
    XML += '      </b:KeyValueOfanyTypeanyType>';
    XML += '      <b:KeyValueOfanyTypeanyType>';
    XML += '        <b:Key i:type="c:string" xmlns:c="http://www.w3.org/2001/XMLSchema">$CODTIPOCURSO</b:Key>';
    XML += '        <b:Value i:type="c:int" xmlns:c="http://www.w3.org/2001/XMLSchema">-1</b:Value>';
    XML += '      </b:KeyValueOfanyTypeanyType>';
    XML += '      <b:KeyValueOfanyTypeanyType>';
    XML += '        <b:Key i:type="c:string" xmlns:c="http://www.w3.org/2001/XMLSchema">$EDUTIPOUSR</b:Key>';
    XML += '        <b:Value i:type="c:string" xmlns:c="http://www.w3.org/2001/XMLSchema">-1</b:Value>';
    XML += '      </b:KeyValueOfanyTypeanyType>';
    XML += '      <b:KeyValueOfanyTypeanyType>';
    XML += '        <b:Key i:type="c:string" xmlns:c="http://www.w3.org/2001/XMLSchema">$CODUNIDADEBIB</b:Key>';
    XML += '        <b:Value i:type="c:int" xmlns:c="http://www.w3.org/2001/XMLSchema">-1</b:Value>';
    XML += '      </b:KeyValueOfanyTypeanyType>';
    XML += '      <b:KeyValueOfanyTypeanyType>';
    XML += '        <b:Key i:type="c:string" xmlns:c="http://www.w3.org/2001/XMLSchema">$CODCOLIGADA</b:Key>';
    XML += '        <b:Value i:type="c:int" xmlns:c="http://www.w3.org/2001/XMLSchema">1</b:Value>';
    XML += '      </b:KeyValueOfanyTypeanyType>';
    XML += '      <b:KeyValueOfanyTypeanyType>';
    XML += '        <b:Key i:type="c:string" xmlns:c="http://www.w3.org/2001/XMLSchema">CONTEXTOPRJ</b:Key>';
    XML += '        <b:Value i:type="c:boolean" xmlns:c="http://www.w3.org/2001/XMLSchema">false</b:Value>';
    XML += '      </b:KeyValueOfanyTypeanyType>';
    XML += '      <b:KeyValueOfanyTypeanyType>';
    XML += '        <b:Key i:type="c:string" xmlns:c="http://www.w3.org/2001/XMLSchema">$RHTIPOUSR</b:Key>';
    XML += '        <b:Value i:type="c:string" xmlns:c="http://www.w3.org/2001/XMLSchema">-1</b:Value>';
    XML += '      </b:KeyValueOfanyTypeanyType>';
    XML += '      <b:KeyValueOfanyTypeanyType>';
    XML += '        <b:Key i:type="c:string" xmlns:c="http://www.w3.org/2001/XMLSchema">';
    XML += '                    $CODUSUARIOSERVICO</b:Key>';
    XML += '        <b:Value i:type="c:string" xmlns:c="http://www.w3.org/2001/XMLSchema" />';
    XML += '      </b:KeyValueOfanyTypeanyType>';
    XML += '      <b:KeyValueOfanyTypeanyType>';
    XML += '        <b:Key i:type="c:string" xmlns:c="http://www.w3.org/2001/XMLSchema">$CODIGOEXTERNO</b:Key>';
    XML += '        <b:Value i:type="c:string" xmlns:c="http://www.w3.org/2001/XMLSchema">-1</b:Value>';
    XML += '      </b:KeyValueOfanyTypeanyType>';
    XML += '      <b:KeyValueOfanyTypeanyType>';
    XML += '        <b:Key i:type="c:string" xmlns:c="http://www.w3.org/2001/XMLSchema">$CODSISTEMA</b:Key>';
    XML += '        <b:Value i:type="c:string" xmlns:c="http://www.w3.org/2001/XMLSchema">M</b:Value>';
    XML += '      </b:KeyValueOfanyTypeanyType>';
    XML += '      <b:KeyValueOfanyTypeanyType>';
    XML += '        <b:Key i:type="c:string" xmlns:c="http://www.w3.org/2001/XMLSchema">$CODUSUARIO</b:Key>';
    XML += '        <b:Value i:type="c:string" xmlns:c="http://www.w3.org/2001/XMLSchema">Gabriel.Persike</b:Value>';
    XML += '      </b:KeyValueOfanyTypeanyType>';
    XML += '      <b:KeyValueOfanyTypeanyType>';
    XML += '        <b:Key i:type="c:string" xmlns:c="http://www.w3.org/2001/XMLSchema">$IDPRJ</b:Key>';
    XML += '        <b:Value i:type="c:int" xmlns:c="http://www.w3.org/2001/XMLSchema">7090</b:Value>';
    XML += '      </b:KeyValueOfanyTypeanyType>';
    XML += '      <b:KeyValueOfanyTypeanyType>';
    XML += '        <b:Key i:type="c:string" xmlns:c="http://www.w3.org/2001/XMLSchema">';
    XML += '                    $CHAPAFUNCIONARIO</b:Key>';
    XML += '        <b:Value i:type="c:string" xmlns:c="http://www.w3.org/2001/XMLSchema">-1</b:Value>';
    XML += '      </b:KeyValueOfanyTypeanyType>';
    XML += '      <b:KeyValueOfanyTypeanyType>';
    XML += '        <b:Key i:type="c:string" xmlns:c="http://www.w3.org/2001/XMLSchema">$CODFILIAL</b:Key>';
    XML += '        <b:Value i:type="c:int" xmlns:c="http://www.w3.org/2001/XMLSchema">1</b:Value>';
    XML += '      </b:KeyValueOfanyTypeanyType>';
    XML += '    </a:_params>';
    XML += '    <a:Environment>WebServices</a:Environment>';
    XML += '  </Context>';
    XML += '  <CustomData i:nil="true" xmlns="http://www.totvs.com/" />';
    XML += '  <DisableIsolateProcess xmlns="http://www.totvs.com/">false</DisableIsolateProcess>';
    XML += '  <DriverType i:nil="true" xmlns="http://www.totvs.com/" />';
    XML += '  <ExecutionId xmlns="http://www.totvs.com/">9d14d6f6-fac6-42db-adca-fe18b228a60a</ExecutionId>';
    XML += '  <FailureMessage i:nil="true" xmlns="http://www.totvs.com/" />';
    XML += '  <FriendlyLogs i:nil="true" xmlns="http://www.totvs.com/" />';
    XML += '  <HideProgressDialog xmlns="http://www.totvs.com/">false</HideProgressDialog>';
    XML += '  <HostName xmlns="http://www.totvs.com/" />';
    XML += '  <Initialized xmlns="http://www.totvs.com/">false</Initialized>';
    XML += '  <Ip i:nil="true" xmlns="http://www.totvs.com/" />';
    XML += '  <IsolateProcess xmlns="http://www.totvs.com/">false</IsolateProcess>';
    XML += '  <JobServerHostName xmlns="http://www.totvs.com/">HOMOLOGACAO</JobServerHostName>';
    XML += '  <MasterActionName xmlns="http://www.totvs.com/">PrjPlanilhaServicoAction</MasterActionName>';
    XML += '  <MaximumQuantityOfPrimaryKeysPerProcess xmlns="http://www.totvs.com/">0</MaximumQuantityOfPrimaryKeysPerProcess>';
    XML += '  <MinimumQuantityOfPrimaryKeysPerProcess xmlns="http://www.totvs.com/">0</MinimumQuantityOfPrimaryKeysPerProcess>';
    XML += '  <NetworkUser xmlns="http://www.totvs.com/" />';
    XML += '  <NotifyEmail xmlns="http://www.totvs.com/">false</NotifyEmail>';
    XML += '  <NotifyEmailList i:nil="true" xmlns="http://www.totvs.com/" xmlns:a="http://schemas.microsoft.com/2003/10/Serialization/Arrays" />';
    XML += '  <NotifyFluig xmlns="http://www.totvs.com/">false</NotifyFluig>';
    XML += '  <OnlineMode xmlns="http://www.totvs.com/">true</OnlineMode>';
    XML += '  <PrimaryKeyList xmlns="http://www.totvs.com/" xmlns:a="http://schemas.microsoft.com/2003/10/Serialization/Arrays">';
    XML += '    <a:ArrayOfanyType>';
    XML += '      <a:anyType i:type="b:short" xmlns:b="http://www.w3.org/2001/XMLSchema">'+CODCOLIGADA+'</a:anyType>';
    XML += '      <a:anyType i:type="b:int" xmlns:b="http://www.w3.org/2001/XMLSchema">'+IDPRJ+'</a:anyType>';
    XML += '      <a:anyType i:type="b:int" xmlns:b="http://www.w3.org/2001/XMLSchema">'+IDTRF+'</a:anyType>';
    XML += '      <a:anyType i:type="b:int" xmlns:b="http://www.w3.org/2001/XMLSchema">0</a:anyType>';
    XML += '      <a:anyType i:type="b:int" xmlns:b="http://www.w3.org/2001/XMLSchema">0</a:anyType>';
    XML += '    </a:ArrayOfanyType>';
    XML += '  </PrimaryKeyList>';
    XML += '  <PrimaryKeyNames xmlns="http://www.totvs.com/" xmlns:a="http://schemas.microsoft.com/2003/10/Serialization/Arrays">';
    XML += '    <a:string>CODCOLIGADA</a:string>';
    XML += '    <a:string>IDPRJ</a:string>';
    XML += '    <a:string>IDTRF</a:string>';
    XML += '    <a:string>TIPOPLANILHA</a:string>';
    XML += '    <a:string>IDCENARIO</a:string>';
    XML += '  </PrimaryKeyNames>';
    XML += '  <PrimaryKeyTableName xmlns="http://www.totvs.com/">MTAREFA</PrimaryKeyTableName>';
    XML += '  <ProcessName xmlns="http://www.totvs.com/">Lançamentos Múltiplos - Cronograma</ProcessName>';
    XML += '  <QuantityOfSplits xmlns="http://www.totvs.com/">0</QuantityOfSplits>';
    XML += '  <SaveLogInDatabase xmlns="http://www.totvs.com/">true</SaveLogInDatabase>';
    XML += '  <SaveParamsExecution xmlns="http://www.totvs.com/">false</SaveParamsExecution>';
    XML += '  <ScheduleDateTime xmlns="http://www.totvs.com/">0001-01-01T00:00:00</ScheduleDateTime>';
    XML += '  <Scheduler xmlns="http://www.totvs.com/">JobServer</Scheduler>';
    XML += '  <SendMail xmlns="http://www.totvs.com/">false</SendMail>';
    XML += '  <ServerName xmlns="http://www.totvs.com/">PrjEfetuarLancamentoMultiploData</ServerName>';
    XML += '  <ServiceInterface i:nil="true" xmlns="http://www.totvs.com/" xmlns:a="http://schemas.datacontract.org/2004/07/System" />';
    XML += '  <ShouldParallelize xmlns="http://www.totvs.com/">false</ShouldParallelize>';
    XML += '  <StatusMessage i:nil="true" xmlns="http://www.totvs.com/" />';
    XML += '  <SuccessMessage i:nil="true" xmlns="http://www.totvs.com/" />';
    XML += '  <SyncExecution xmlns="http://www.totvs.com/">false</SyncExecution>';
    XML += '  <UseJobMonitor xmlns="http://www.totvs.com/">false</UseJobMonitor>';
    XML += '  <UserName xmlns="http://www.totvs.com/">Gabriel.Persike</UserName>';
    XML += '  <WaitSchedule xmlns="http://www.totvs.com/">false</WaitSchedule>';
    XML += '  <CodColigada>'+CODCOLIGADA+'</CodColigada>';
    XML += '  <ConsideraPert>false</ConsideraPert>';
    XML += '  <ConverterGrandeza>Quantidade</ConverterGrandeza>';
    XML += '  <Cronogramas xmlns:a="http://schemas.datacontract.org/2004/07/RM.Prj.Parametros">';
    XML += '    <a:PrjTipoCronogramaEnum>Medido</a:PrjTipoCronogramaEnum>';
    XML += '  </Cronogramas>';
    XML += '  <Grandeza>Quantidade</Grandeza>';
    XML += '  <IdPrj>'+IDPRJ+'</IdPrj>';
    XML += '  <Periodos xmlns:a="http://schemas.microsoft.com/2003/10/Serialization/Arrays">';
    XML += '    <a:short>'+IDPERIODO+'</a:short>';
    XML += '  </Periodos>';
    XML += '  <Ratear>false</Ratear>';
    XML += '  <SomenteConverter>false</SomenteConverter>';
    XML += '  <UtilizaFormula>false</UtilizaFormula>';
    XML += '  <UtilizarPercentualConcluidoPert>false</UtilizarPercentualConcluidoPert>';
    XML += '  <valor>'+QUANTIDADE+'</valor>';
    XML += '</PrjLancMultiploParamsProc>';

    return XML;
}
function executeInsert(query, constraints, dataSource) {
    var dataSource = dataSource;
    var ic = new javax.naming.InitialContext();
    var ds = ic.lookup(dataSource);

    log.info("wkfGerencialEconomicoDeObra.servicetask10: executandoQuery");
    log.info(query);
    try {
        var conn = ds.getConnection();
        var stmt = conn.prepareStatement(query, Packages.java.sql.Statement.RETURN_GENERATED_KEYS);

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

        log.info("wkfGerencialEconomicoDeObra.servicetask10: executandoQuery"+query.length)

       var hasResultSet = stmt.execute();
        if (hasResultSet) {
            var rs = stmt.getResultSet();
            if (rs.next()) {
                var id = rs.getInt(1);
                log.info("id");
                log.dir(id);
                return id;
            }
        }



    } catch (e) {
        log.error("ERRO==============> " + e.message);
        throw e;
    } finally {
        if (stmt != null) {
            stmt.close();
        }
        if (conn != null) {
            conn.close();
        }
    }
}