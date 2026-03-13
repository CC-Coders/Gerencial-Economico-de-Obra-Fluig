import { Component, computed, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Card } from '../card/card';
import { CurrencyPipe } from '@angular/common';
import { DetalhesDespesas } from './detalhes-despesas/detalhes-despesas';
import { DatasetFactory } from '../fluig.service.ts/fluigDatasets';

interface despesa {
	descricao: string;
	data: string;
	valor: number;
}

@Component({
	selector: 'app-despesas-economicas',
	imports: [MatIconModule, Card, CurrencyPipe, DetalhesDespesas],
	templateUrl: './despesas-economicas.html',
	styleUrl: './despesas-economicas.css',
})
export class DespesasEconomicas {
	constructor(private datasetFactory: DatasetFactory) { }

	ngOnInit(){
		this.loadDespesasEconomicas()
	}

	isDetalhesOpen = false;
	detalhesOpen = "";
	despesasEconomicas = signal<despesa[]>([]);
	faturamentoDireto = signal<despesa[]>([{descricao:"teste",data:"2026-03-13",valor:1000}]);
	materiaisProprios = signal<despesa[]>([{descricao:"Brita",data:"2026-03-05",valor:15000}]);
	provisaoFolha = signal<despesa[]>([{descricao:"Salarios",data:"2026-03-01",valor:80000}]);
	transferencias = signal<despesa[]>([{descricao:"Equipamento",data:"2026-03-01",valor:30000}]);


	valorTotal = computed(()=>{
		var total = 0;
		for (const despesas of this.despesasEconomicas()) {
			total+=Math.abs(despesas.valor);
		}
		for (const despesas of this.faturamentoDireto()) {
			total+=despesas.valor;
		}
		for (const despesas of this.materiaisProprios()) {
			total+=despesas.valor;
		}
		for (const despesas of this.provisaoFolha()) {
			total+=despesas.valor;
		}
		for (const despesas of this.transferencias()) {
			total+=despesas.valor;
		}
		return total;
	});

	// Despesas
	get totalDespesasEconomicas(){
		var total = 0;
		var despesasEconomicas = this.despesasEconomicas();
		for (const despesa of despesasEconomicas) {
			total+=Math.abs(despesa.valor);
		}

		return total;
	}
	get quantidadeDespesas(){
		return this.despesasEconomicas().length;
	}

	// Faturamento Direto
	get totalFaturamentoDireto(){
		var total = 0;
		for (const faturamento of this.faturamentoDireto()) {
			total += faturamento.valor;
		}
		return total;
	}
	get quantidadeFaturamentoDireto(){
		return this.faturamentoDireto().length;
	}

	// Materiais Proprios
	get totalMateriaisProprios(){
		var total = 0;
		for (const materiais of this.materiaisProprios()) {
			total += materiais.valor;
		}
		return total;
	}
	get quantidadeMateriaisProprios(){
		return this.materiaisProprios().length;
	}

	// Provisao Folha
	get totalProvisaoFolha(){
		var total = 0;
		for (const materiais of this.provisaoFolha()) {
			total += materiais.valor;
		}
		return total;
	}
	get quantidadeProvisaoFolha(){
		return this.provisaoFolha().length;
	}

	// Transferência de Obras
	get totalTransferencias(){
		var total = 0;
		for (const materiais of this.transferencias()) {
			total += materiais.valor;
		}
		return total;
	}
	get quantidadeTransferencias(){
		return this.transferencias().length;
	}


	onCloseDetalhes(){
		this.isDetalhesOpen = false;
	}
	onClickDetalhes(tipo: string) {
		console.log(tipo);

		this.isDetalhesOpen = true;
		this.detalhesOpen = tipo;
	}

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
					data: row.EMISSAO,
					valor: row.VALOR
				});
			}

			return newDespesas;
		}
	}
}
