import { Injectable } from "@angular/core";
import { signal } from '@angular/core';
import { DatasetFactory } from "../fluig.service.ts/fluigDatasets";

export interface Backlog {
  vlr_pi_medido: number;
  vlr_aditivos_medido: number;
  des_centro_custo: string;
  dt_base: string;
  des_cliente: string;
  des_empresa: string;
  des_indice_reajuste: string;
  cod_obra: string;
  des_lider_contrato: string;
  des_coordenacao: string;
  vlr_r_medido: number;
  dt_ultima_alteracao: string;
  vlr_nao_executavel: number;
  cod_coligada: number;
  vlr_aditivos: number;
  des_observacao: string;
  user_ultima_alteracao: string;
  vlr_r: number;
  vlr_pi: number;
}

@Injectable({providedIn:"root"})
export class DadosGeraisService{
    constructor(private datasetFactory: DatasetFactory){}

 backlog = signal<Backlog>({
    cod_coligada: 1,
    des_empresa: '',
    cod_obra: '',
    des_centro_custo: '',
    des_indice_reajuste: '',
    des_cliente: '',
    des_observacao: 'Inicio',
    des_coordenacao: '',
    des_lider_contrato: '',
    vlr_nao_executavel: 0,
    vlr_aditivos: 0,
    vlr_aditivos_medido: 0,
    vlr_pi: 20000000,
    vlr_pi_medido: 0,
    vlr_r: 0,
    vlr_r_medido: 0,
    dt_base: '',
    dt_ultima_alteracao: 'Tue, 24 Feb 2026 15:20:33 GMT',
    user_ultima_alteracao: 'gabriel.persike',
  });


  async loadBacklog(){
        this.backlog.set(await this.getBacklog());
  }

    async getBacklog() {
    var ds = await this.datasetFactory.getDataset(
      'dsConsultaObraGerencialEconomico',
      [],
      [
        DatasetFactory.createConstraint('CODCOLIGADA','1','1',DatasetFactory.ConstraintType.MUST,null,),
        DatasetFactory.createConstraint('CODCCUSTO','1.2.066','1.2.066',DatasetFactory.ConstraintType.MUST,null,),
      ],
      [],
    );

    if (ds.values[0].STATUS != 'SUCCESS') {
      throw ds.values[0].MENSAGEM;
    } else {
      return JSON.parse(ds.values[0].RESULT).data[0];
    }
  }
}