import { Component, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { EstoqueService } from './estoque.service';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { CurrencyMaskModule } from 'ng2-currency-mask';

@Component({
  selector: 'app-estoque',
  imports: [CurrencyPipe, MatIconModule, FormsModule, NgSelectModule, CurrencyMaskModule],
  templateUrl: './estoque.html',
  styleUrl: './estoque.css',
})
export class Estoque {
  constructor(public estoqueService: EstoqueService) {}


  onAdicionarLinhaEstoque() {
    this.estoqueService.onAdicionarLinhaEstoque();
  }

  onDeleteRow(id:number){
      this.estoqueService.onDeleteRow(id);
  }

  get fornecedores() {
    return this.estoqueService.fornecedores();
  }
  get estoque() {
    return this.estoqueService.estoque();
  }
  get produtos(){
    return this.estoqueService.produtos();
  }
  get valorTotal() {
    return this.estoqueService.valorTotal;
  }
}
