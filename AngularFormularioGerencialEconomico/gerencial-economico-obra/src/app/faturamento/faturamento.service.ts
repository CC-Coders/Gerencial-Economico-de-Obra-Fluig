import { Injectable, signal } from "@angular/core";
import { DatasetFactory } from "../fluig.service.ts/fluigDatasets";

export interface faturamento{
    MEDICAO:string;
    COMPETENCIA:string;
    NUMERO_NF:string;
    VALOR:number;

    EMISSAO:string;
    NFISCAL:string;
    VALOR_PI:number;
    VALOR_R:number;
    VALOR_PI_R:number;
    DATAPREV:string;
    VALORBRUTO:number;
    DATAREC:string;
    LIQREC:number;
}

@Injectable({providedIn:"root"})
export class FaturamentoService{
    constructor(private datasetFactory:DatasetFactory){
        this.loadFaturamento();
    }

    faturamentos = signal<faturamento[]>([]);




    async loadFaturamento(){
        var ds = await this.datasetFactory.getDataset("dsConsultaFaturamentoGerencialEconomico",[],[
            DatasetFactory.createConstraint("CODCOLIGADA","1","1",DatasetFactory.ConstraintType.MUST, "false"),
            DatasetFactory.createConstraint("CODCCUSTO","1.2.066","1.2.066",DatasetFactory.ConstraintType.MUST, "false"),
        ],[]);

        if (ds.values[0].STATUS != "SUCCESS") {
            throw ds.values[0].MENSAGEM;
        }else{
            const RESULT = JSON.parse(ds.values[0].RESULT);
            console.log(RESULT);

            var newFaturamentos: faturamento[] = [];
            for (const row of RESULT) {
                newFaturamentos.push({
                    COMPETENCIA:row.COMPETENCIA,
                    MEDICAO:row.MEDICAO,
                    NUMERO_NF:row.NFISCAL,
                    VALOR:row.VALORBRUTO,
                    EMISSAO:row.EMISSAO,
                    NFISCAL:row.NFISCAL,
                    VALOR_PI:row.VALOR_PI,
                    VALOR_R:row.VALOR_R,
                    VALOR_PI_R:parseFloat(row.VALOR_PI) + parseFloat(row.VALOR_R),
                    DATAPREV:row.DATAPREV,
                    VALORBRUTO:row.VALORBRUTO,
                    DATAREC:row.DATAREC,
                    LIQREC:row.LIQREC,
                });
            }
            this.faturamentos.set(newFaturamentos);
        }
    }

}