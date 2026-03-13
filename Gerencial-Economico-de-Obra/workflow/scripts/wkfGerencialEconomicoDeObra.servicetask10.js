function servicetask10(attempt, message) {
    try {
        var CODCOLIGADA = hAPI.getCardValue("CODCOLIGADA");
        var CODCCUSTO = hAPI.getCardValue("CODCCUSTO");
        var IDPRJ = hAPI.getCardValue("IDPRJ");
        var IDPERIODO = hAPI.getCardValue("IDPERIODO");

        // Busca QUANTIDADE e VALOR_UNITARIO da Tarefa, e também o PERCENTUAL_REALIZADO no ultimo Periodo
        var tarefasCronograma = calculaPercentualConcluido(CODCOLIGADA, IDPRJ);
        log.info("tarefasCronograma");
        log.dir(tarefasCronograma);

        var cardData = hAPI.getCardData(getValue("WKNumProces"));
        var tasks = [];
        var indexes = hAPI.getChildrenIndexes("tableProducao");
        for (var i = 0; i < indexes.length; i++) {
            var id = indexes[i];

            var tarefa = {
                id_tarefa: cardData.get("id_tarefa" + "___" + id),
                cod_tarefa: cardData.get("cod_tarefa" + "___" + id),
                descricao_tarefa: cardData.get("des_tarefa" + "___" + id),
                un_tarefa: cardData.get("un_medida" + "___" + id),
                quantidade_medida_tarefa: cardData.get("quantidade" + "___" + id),
                valor_unitario_tarefa: cardData.get("vlr_unitario" + "___" + id),
            }

            for (var j = 0; j < tarefasCronograma.length; j++) {
                var e = tarefasCronograma[j];
                if (e.IDTRF == tarefa.id_tarefa) {
                    tarefa.per_realizado = e.PERCREALIZADO;
                    tarefa.quantidade_total = e.QUANTIDADE;
                }
            }

            var PERCENTUAL_REALIZADO_ACUMULADO = tarefa.per_realizado;
            var PERCENTUAL_REALIZADO_APONTADO = ((tarefa.quantidade_medida_tarefa * 100) / tarefa.quantidade_total);
            log.info(PERCENTUAL_REALIZADO_ACUMULADO)
            log.info(PERCENTUAL_REALIZADO_APONTADO)

            tarefa.per_realizado = (parseFloat(PERCENTUAL_REALIZADO_ACUMULADO) + parseFloat(PERCENTUAL_REALIZADO_APONTADO));
            tasks.push({
                "taskId": tarefa.id_tarefa,
                "accumulatedPercentageCompleted": tarefa.per_realizado.toFixed(2)
            })
        }


        var DATA_PERIODO = consultaDataDoPeriodo(CODCOLIGADA, IDPRJ, IDPERIODO)[0].DTINICIO;

        log.info("Data integração Cronograma: ");
        log.info("CODCOLIGADA: " + CODCOLIGADA);
        log.info("IDPRJ: " + IDPRJ);
        log.info("DATA_PERIODO: " + DATA_PERIODO);
        log.info("tasks: ");
        log.dir(tasks);


        chamaApiLancaRealizado(CODCOLIGADA, IDPRJ, DATA_PERIODO, tasks)

    } catch (error) {
        throw error;
    }
}


function calculaPercentualConcluido(CODCOLIGADA, IDPRJ) {
    try {
        var query = "";
        query += "SELECT ";
        query += "     MTAREFA.CODCOLIGADA, ";
        query += "     MTAREFA.IDPRJ, ";
        query += "     MTAREFA.IDTRF, ";
        query += "     MTAREFA.CODTRF, ";
        query += "     MTAREFA.QUANTIDADE, ";
        query += "     MTAREFA.VALOR, ";
        query += "     CASE ";
        query += "          WHEN SUM(MTRFREAL.PERCREALIZADO) IS NOT NULL THEN SUM(MTRFREAL.PERCREALIZADO) ";
        query += "          ELSE 0 ";
        query += "     END AS PERCREALIZADO ";
        query += "FROM ";
        query += "     MTAREFA ";
        query += "     LEFT JOIN MTRFREAL ON MTAREFA.CODCOLIGADA = MTRFREAL.CODCOLIGADA ";
        query += "     AND MTAREFA.IDPRJ = MTRFREAL.IDPRJ ";
        query += "     AND MTAREFA.IDTRF = MTRFREAL.IDTRF ";
        query += "WHERE ";
        query += "     MTAREFA.CODCOLIGADA = ? ";
        query += "     AND MTAREFA.IDPRJ = ? ";
        query += "     AND MTAREFA.SERVICO = 1 ";
        query += "     AND MTAREFA.TIPOPLANILHA = 1 ";
        query += "GROUP BY ";
        query += "     MTAREFA.CODCOLIGADA, ";
        query += "     MTAREFA.IDPRJ, ";
        query += "     MTAREFA.IDTRF, ";
        query += "     MTAREFA.CODTRF, ";
        query += "     MTAREFA.QUANTIDADE, ";
        query += "     MTAREFA.VALOR ";
        query += "ORDER BY ";
        query += "     MTAREFA.IDTRF ";

        var retorno = executaQuery(query, [
            { type: "int", value: CODCOLIGADA },
            { type: "int", value: IDPRJ },
        ], "/jdbc/FluigRM");

        return retorno;
    } catch (error) {
        throw error;
    }
}
function consultaDataDoPeriodo(CODCOLIGADA, IDPRJ, IDPERIODO) {
    try {
        var query = "SELECT DTINICIO FROM MPERIODO WHERE CODCOLIGADA = ? AND IDPRJ = ? AND IDPERIODO = ?";
        var retorno = executaQuery(query, [
            { type: "int", value: CODCOLIGADA },
            { type: "int", value: IDPRJ },
            { type: "int", value: IDPERIODO },
        ], "/jdbc/FluigRM");

        return retorno;
    } catch (error) {
        throw error;
    }
}

function chamaApiLancaRealizado(CODCOLIGADA, IDPRJ, DATA, LIST_TAREFAS) {
    try {
        var clientService = fluigAPI.getAuthorizeClientService();
        var data = {
            companyId: getValue("WKCompany") + '',
            serviceCode: 'RM_REST',
            endpoint: '/construction-projects/v1/accomplishedInput',
            method: 'post',
            params: {
                "companyId": CODCOLIGADA,
                "projectId": IDPRJ,
                "accomplishedIn": DATA,
                "tasks": LIST_TAREFAS
            },
            options: {
                encoding: 'UTF-8',
                mediaType: 'application/json',
            },
            headers: {
                "Content-Type": 'application/json;charset=UTF-8'
            }
        }

        var vo = clientService.invoke(JSON.stringify(data));

        if (vo.getResult() == null || vo.getResult().isEmpty()) {
            throw "Retorno está vazio";
        }
        else {
            var result = vo.getResult();
            log.info("result");
            log.dir(result);
            return result;
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
    XML += '      <a:anyType i:type="b:short" xmlns:b="http://www.w3.org/2001/XMLSchema">' + CODCOLIGADA + '</a:anyType>';
    XML += '      <a:anyType i:type="b:int" xmlns:b="http://www.w3.org/2001/XMLSchema">' + IDPRJ + '</a:anyType>';
    XML += '      <a:anyType i:type="b:int" xmlns:b="http://www.w3.org/2001/XMLSchema">' + IDTRF + '</a:anyType>';
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
    XML += '  <CodColigada>' + CODCOLIGADA + '</CodColigada>';
    XML += '  <ConsideraPert>false</ConsideraPert>';
    XML += '  <ConverterGrandeza>Quantidade</ConverterGrandeza>';
    XML += '  <Cronogramas xmlns:a="http://schemas.datacontract.org/2004/07/RM.Prj.Parametros">';
    XML += '    <a:PrjTipoCronogramaEnum>Medido</a:PrjTipoCronogramaEnum>';
    XML += '  </Cronogramas>';
    XML += '  <Grandeza>Quantidade</Grandeza>';
    XML += '  <IdPrj>' + IDPRJ + '</IdPrj>';
    XML += '  <Periodos xmlns:a="http://schemas.microsoft.com/2003/10/Serialization/Arrays">';
    XML += '    <a:short>' + IDPERIODO + '</a:short>';
    XML += '  </Periodos>';
    XML += '  <Ratear>false</Ratear>';
    XML += '  <SomenteConverter>false</SomenteConverter>';
    XML += '  <UtilizaFormula>false</UtilizaFormula>';
    XML += '  <UtilizarPercentualConcluidoPert>false</UtilizarPercentualConcluidoPert>';
    XML += '  <valor>' + QUANTIDADE + '</valor>';
    XML += '</PrjLancMultiploParamsProc>';

    return XML;
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