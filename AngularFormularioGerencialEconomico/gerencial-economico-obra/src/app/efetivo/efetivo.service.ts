import { Injectable, signal } from '@angular/core';

export interface EfetivoInterface {
    CARGO: string;
    VALOR: number;
    INDIRETO: boolean;
}

@Injectable({ providedIn: 'root' })
export class EfetivoService {
    private efetivo = signal<EfetivoInterface[]>([]);

    get getEfetivo() {
        return this.efetivo();
    }

    get getValorTotal(){
        var total = 0;
        for (const row of this.efetivo()) {
            total += row.VALOR;
        }

        return total;
    }

    public setEfetivoFromCSV(csv: string) {
        var rows = csv.replace("\r","").trim().split('\n');
        console.log(rows)
        if (rows.length < 2) {
            return 'Esperado pelo menos duas linhas (cabeçalho e corpo)';
        }

        var header = rows.shift(); //Tira a primeira linha de rows
        var headerList = header!.split(';');
        console.log(headerList)

        var rowsList:any[] = [];

        for (const row of rows) {
            rowsList.push(row.replace("\r","").split(";"));
        }
        console.log(rowsList)

        var colunasNecessarias = ['FUNCAO', 'VALOR', 'INDIRETO?'];

        var validaColunas = true;

        var indexFUNCAO = 0;
        var indexVALOR = 0;
        var indexINDIRETO = 0;
        for (const colunaNecessaria of colunasNecessarias) {
            var found = false;
            for (const header of headerList) {
                if (header == colunaNecessaria) {
                    found = true;
                }
            }
            if (!found) {
                validaColunas = false;
            }
        }
        if (!validaColunas) {
            return 'Colunas necessrias não encontradas ' + `[${colunasNecessarias.join(', ')}]`;
        } 

        indexFUNCAO = headerList.indexOf("FUNCAO");
        indexVALOR = headerList.indexOf("VALOR");
        indexINDIRETO = headerList.indexOf("INDIRETO?");

        console.log(indexFUNCAO)
        console.log(indexVALOR)
        console.log(indexINDIRETO)


        var efetivo: EfetivoInterface[] = [];
        for (const row of rowsList) {
            efetivo.push({
                CARGO: row[indexFUNCAO],
                VALOR: parseFloat(row[indexVALOR]),
                INDIRETO: (row[indexINDIRETO] == "SIM"),
            });
        }


        this.efetivo.set(efetivo);
        return true;
    }
}
