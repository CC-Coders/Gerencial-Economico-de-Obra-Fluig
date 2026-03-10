import { Component, signal } from '@angular/core';
import { Menu } from './menu/menu';
import { Producao } from './producao/producao';
import { DadosGerais } from './dados-gerais/dados-gerais';
import { ProducaoService } from './producao/producao.service';
import { DadosGeraisService } from './dados-gerais/dados-gerais.service';
import { FluigForm } from './fluig.service.ts/fluigForm.service';

@Component({
  selector: 'app-root',
  imports: [Menu, Producao, DadosGerais],
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
  activeMenu = "Dados Gerais";

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
