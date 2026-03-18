import { Component, computed, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Card } from '../card/card';
import { CurrencyPipe } from '@angular/common';
import { DetalhesDespesas } from './detalhes-despesas/detalhes-despesas';
import { DespesasEconomicasService } from './despesas-economicas.service';


@Component({
	selector: 'app-despesas-economicas',
	imports: [MatIconModule, Card, CurrencyPipe, DetalhesDespesas],
	templateUrl: './despesas-economicas.html',
	styleUrl: './despesas-economicas.css',
})
export class DespesasEconomicas {
	constructor(public despesasEconomicasService:DespesasEconomicasService){}
	isDetalhesOpen = false;
	detalhesOpen = "";
	
	onCloseDetalhes(){
		this.isDetalhesOpen = false;
	}
	onClickDetalhes(tipo: string) {
		this.isDetalhesOpen = true;
		this.detalhesOpen = tipo;
	}
}
