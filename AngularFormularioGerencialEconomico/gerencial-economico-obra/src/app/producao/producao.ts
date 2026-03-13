import { Component } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import { ProducaoService } from './producao.service';
import { ProducaoTable } from './producao-table/producao-table';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';




@Component({
  selector: 'app-producao',
  imports: [MatIconModule, ProducaoTable, CurrencyPipe,FormsModule],
  templateUrl: './producao.html',
  styleUrl: './producao.css',
})
export class Producao {
  percentAplicado = 0;

  constructor(private producaoService: ProducaoService){}

  get valorTotal(){
    return this.producaoService.valorTotal;
  }

  getTarefasDeGrupo(cod_grupo:string){
    var cod_grupo = cod_grupo.split(".")[1];
    var tarefas = this.producaoService.tarefas().filter(e=>e.cod_grupo==cod_grupo);
    return tarefas;
  }
  get grupos(){
    return this.producaoService.getGrupos;
  }
  get tarefas(){
    return this.producaoService.getTarefas;
  }

  onLancarValorTeste(){
    this.producaoService.lancaValorTeste(this.percentAplicado);
  }
}
