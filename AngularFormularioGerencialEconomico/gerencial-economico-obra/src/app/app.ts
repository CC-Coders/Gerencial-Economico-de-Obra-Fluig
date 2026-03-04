import { Component, signal } from '@angular/core';
import { Menu } from './menu/menu';
import { DadosGerais } from './dados-gerais/dados-gerais'
import {Producao} from "./producao/producao"

@Component({
  selector: 'app-root',
  imports: [ Menu, DadosGerais,Producao],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('gerencial-economico-obra');

  activeMenu: string = "Dados Gerais";


  changeActiveMenu(menu:string){
    console.log(menu)
    this.activeMenu = menu;
  }
}



