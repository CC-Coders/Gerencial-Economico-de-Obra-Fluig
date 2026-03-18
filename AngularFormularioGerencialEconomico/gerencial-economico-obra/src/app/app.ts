import { Component, signal } from '@angular/core';
import { Menu } from './menu/menu';
import { Producao } from './producao/producao';
import { DadosGerais } from './dados-gerais/dados-gerais';
import { ProducaoService } from './producao/producao.service';
import { DadosGeraisService } from './dados-gerais/dados-gerais.service';
import { FluigForm } from './fluig.service.ts/fluigForm.service';
import { DespesasEconomicas } from './despesas-economicas/despesas-economicas';
import { Estoque } from './estoque/estoque';
import { DespesasIndiretas } from './despesas-indiretas/despesas-indiretas';
import { Efetivo } from './efetivo/efetivo';
import { Faturamento } from './faturamento/faturamento';

@Component({
  selector: 'app-root',
  imports: [Menu, Producao, DadosGerais, DespesasEconomicas, Estoque, DespesasIndiretas,Efetivo, Faturamento],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('app-gerencial-economico');
  constructor(
    private producaoService: ProducaoService,
    private dadosGeraisService:DadosGeraisService,
    private fluigForm:FluigForm,
  ){}
  // activeMenu = "Dados Gerais";
  activeMenu = "Faturamento";

  ngOnInit(){
      this.dadosGeraisService.loadBacklog();
      this.producaoService.loadData(1,7090);
  }

  changeActiveMenu(menu:string){
    this.activeMenu=menu;
  }
  saveAndSend(){
    this.producaoService.saveData();
     (parent as any).$(".workflow-actions").find("[data-send]").click();
  }
}
