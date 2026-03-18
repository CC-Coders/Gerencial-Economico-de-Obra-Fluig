import { Component } from '@angular/core';
import { DespesasEconomicasService } from '../despesas-economicas/despesas-economicas.service';
import { CurrencyPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Card } from '../card/card';
import { DetalhesDespesas } from '../despesas-economicas/detalhes-despesas/detalhes-despesas';
import { despesa } from '../despesas-economicas/despesas-economicas.service';
import { EfetivoInterface, EfetivoService } from '../efetivo/efetivo.service';

@Component({
	selector: 'app-despesas-indiretas',
	imports: [CurrencyPipe, MatIconModule, Card, DetalhesDespesas],
	templateUrl: './despesas-indiretas.html',
	styleUrl: './despesas-indiretas.css',
})
export class DespesasIndiretas {
	constructor(private despesasEconomicasService: DespesasEconomicasService,private efetivoService:EfetivoService) { }

	isDetalhesOpen = false;
	detalhesOpen:string = "";
	titleDetalhes:string="";
	dataDetalhes:despesa[] = [];


	get folhaIndireto(){
		return this.efetivoService.getEfetivo.filter(e=>e.INDIRETO==true);
	}
	get valorTotal() {
		var total = 0;
		var despesas = this.despesasEconomicasService.despesasEconomicas();
		var despesasIndiretas = despesas.filter((e) => e.indireto == true);

		for (const despesa of despesasIndiretas) {
			total += Math.abs(despesa.valor);
		}

		var efetivo =  this.efetivoService.getEfetivo.filter(e=>e.INDIRETO==true);
		for (const row of efetivo) {
			total += row.VALOR;
		}
		
		return total;
	}
	get despesasIndiretas() {
		var despesas = this.despesasEconomicasService.despesasEconomicas();
		var despesasIndiretas = despesas.filter((e) => e.indireto == true);

		var retorno: any[] = [];

		for (const despesaIndireta of despesasIndiretas) {
			var found = retorno.find((e) => e.classe == despesaIndireta.classe);
			if (found) {
				found.rows.push(despesaIndireta);
			} else {
				retorno.push({
					classe: despesaIndireta.classe,
					rows: [despesaIndireta],
				});
			}
		}

		return retorno;
	}

	calculaTotal(retorno: any[]) {
		var total = 0;

		for (const row of retorno) {
			if (row.VALOR) {
				total+= Math.abs(row.VALOR) ;
			}else{
				total+= Math.abs(row.valor) ;
			}
		}

		return total;
	}
	onCloseDetalhes(){
		this.isDetalhesOpen=false;
	}
	onOpenDetalhes(title:string){
		this.isDetalhesOpen=true;
		this.titleDetalhes = title;
		if (title == "Folha") {
			var despesasFolha:despesa[] = this.folhaIndireto.map(e=>{
				return {
					classe:"Folha",
					data:"",
					descricao:e.CARGO,
					indireto:true,
					valor:e.VALOR
				}
			});
			this.dataDetalhes = despesasFolha;
		}else{
			var despesas:any[] = this.despesasIndiretas.filter(e=>e.classe==title);
			this.dataDetalhes = despesas[0].rows;
		}
	}
}
