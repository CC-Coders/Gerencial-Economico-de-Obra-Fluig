import { Component, Input } from '@angular/core';
import { Card } from '../card/card';
import { MatIconModule } from '@angular/material/icon';
import { CurrencyPipe } from '@angular/common';

export interface Backlog {
  vlr_pi_medido: number;
  vlr_aditivos_medido: number;
  des_centro_custo: string;
  dt_base: string;
  des_cliente:string;
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

@Component({
  selector: 'app-dados-gerais',
  imports: [Card, MatIconModule, CurrencyPipe],
  templateUrl: './dados-gerais.html',
  styleUrl: './dados-gerais.css',
})
export class DadosGerais {
  @Input({ required: true }) backlog!: Backlog | null;
  
}
