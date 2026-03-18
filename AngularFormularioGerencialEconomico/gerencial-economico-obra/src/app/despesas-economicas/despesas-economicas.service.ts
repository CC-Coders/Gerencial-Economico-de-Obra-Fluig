import { Injectable, signal, computed } from '@angular/core';
import { DatasetFactory } from '../fluig.service.ts/fluigDatasets';

export interface despesa {
  descricao: string;
  classe:string;
  data: string;
  valor: number;
  indireto:boolean;
}

@Injectable({ providedIn: 'root' })
export class DespesasEconomicasService {
  constructor(private datasetFactory: DatasetFactory) {
    this.loadDespesasEconomicas();
    this.loadTransferencias();
  }

  despesasEconomicas = signal<despesa[]>([]);
  faturamentoDireto = signal<despesa[]>([{ descricao: 'teste', classe:"faturamento direto", data: '2026-03-13', valor: 1000, indireto:false }]);
  materiaisProprios = signal<despesa[]>([{ descricao: 'Brita', classe:"materiais proprios", data: '2026-03-05', valor: 15000, indireto:false }]);
  provisaoFolha = signal<despesa[]>([{ descricao: 'Salarios', classe:"folha", data: '2026-03-01', valor: 80000, indireto:true }]);
  transferencias = signal<despesa[]>([
    { descricao: 'Equipamento', classe:"transferencia", data: '2026-03-01', valor: 30000, indireto:false },
  ]);

  valorTotal = computed(() => {
    var total = 0;
    for (const despesas of this.despesasEconomicas()) {
      total += Math.abs(despesas.valor);
    }
    for (const despesas of this.faturamentoDireto()) {
      total += despesas.valor;
    }
    for (const despesas of this.materiaisProprios()) {
      total += despesas.valor;
    }
    for (const despesas of this.provisaoFolha()) {
      total += despesas.valor;
    }
    for (const despesas of this.transferencias()) {
      total += despesas.valor;
    }
    return total;
  });

  async loadDespesasEconomicas() {
    var ds = await this.datasetFactory.getDataset(
      'dsConsultaDepesasEconomicasGerencialEconomico',
      [],
      [
        DatasetFactory.createConstraint(
          'CODCCUSTO',
          '1.2.066',
          '1.2.066',
          DatasetFactory.ConstraintType.MUST,
          null,
        ),
      ],
      [],
    );
    if (ds.values[0].STATUS != 'SUCCESS') {
      throw ds.values[0].MENSAGEM;
    } else {
      console.log(JSON.parse(ds.values[0].RESULT));
      this.despesasEconomicas.set(formataDespesas(JSON.parse(ds.values[0].RESULT)));
    }

    function formataDespesas(data: any) {
      var newDespesas: despesa[] = [];

      for (const row of data) {
        newDespesas.push({
          descricao: row.CLASSANALITICA,
          classe: row.CLASSSINTETICA,
          data: row.EMISSAO,
          valor: row.VALOR,
          indireto:false
        });
      }

      return newDespesas;
    }
  }

  // Despesas
  get totalDespesasEconomicas() {
    var total = 0;
    var despesasEconomicas = this.despesasEconomicas();
    for (const despesa of despesasEconomicas) {
      total += Math.abs(despesa.valor);
    }

    return total;
  }
  get quantidadeDespesas() {
    return this.despesasEconomicas().length;
  }

  // Faturamento Direto
  get totalFaturamentoDireto() {
    var total = 0;
    for (const faturamento of this.faturamentoDireto()) {
      total += faturamento.valor;
    }
    return total;
  }
  get quantidadeFaturamentoDireto() {
    return this.faturamentoDireto().length;
  }

  // Materiais Proprios
  get totalMateriaisProprios() {
    var total = 0;
    for (const materiais of this.materiaisProprios()) {
      total += materiais.valor;
    }
    return total;
  }
  get quantidadeMateriaisProprios() {
    return this.materiaisProprios().length;
  }

  // Provisao Folha
  get totalProvisaoFolha() {
    var total = 0;
    for (const materiais of this.provisaoFolha()) {
      total += materiais.valor;
    }
    return total;
  }
  get quantidadeProvisaoFolha() {
    return this.provisaoFolha().length;
  }

  // Transferência de Obras
  get totalTransferencias() {
     return this.transferencias().reduce(
    (acc, curr) => acc + Number(curr.valor || 0),
    0
  );
  }
  get quantidadeTransferencias() {
    return this.transferencias().length;
  }
  async loadTransferencias(){
      var ds = await this.datasetFactory.getDataset("dsConsultaTransferenciasGerencialEconomico", [],[
        DatasetFactory.createConstraint("CODCOLIGADA","1","1", DatasetFactory.ConstraintType.MUST,"false"),
        DatasetFactory.createConstraint("CODCCUSTO","1.2.066","1.2.066", DatasetFactory.ConstraintType.MUST,"false"),
      ],[]);

      if (ds.values[0].STATUS != "SUCCESS") {
        throw ds.values[0].MENSAGEM;
      }
      else{
        var RESULT = JSON.parse(ds.values[0].RESULT)

        var newTransferencias: despesa[] = [];
        for (const row of RESULT) {
          newTransferencias.push({
            classe:"transferencia",
            data:row.dataEmissao,
            descricao:"Transferencia",
            indireto:false,
            valor:parseFloat(row.valor)
          });

          this.transferencias.set(newTransferencias);
        }

      }
  }
}
