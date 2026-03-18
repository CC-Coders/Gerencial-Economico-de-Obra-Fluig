import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CurrencyPipe } from '@angular/common';
import { EfetivoService } from './efetivo.service';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-efetivo',
  imports: [MatIconModule, CurrencyPipe,MatSlideToggleModule,FormsModule],
  templateUrl: './efetivo.html',
  styleUrl: './efetivo.css',
})
export class Efetivo {
  constructor(private efetivoService:EfetivoService){}



  get efetivo(){
    return this.efetivoService.getEfetivo;
  }
  get valorTotal(){
    return this.efetivoService.getValorTotal;
  }


  async loadPlanilha(event: Event) {
    var target = event.target as HTMLInputElement;
    var files = target.files;
    if (files && files.length > 0) {
      var file = files[0];
      var data = await this.lerArquivoComoTexto(file);
      var resultado = this.efetivoService.setEfetivoFromCSV(data);
      if (resultado!=true) {
        alert(resultado);
      }
    }
  }

  lerArquivoComoTexto(file: File) {
    // Lê o arquivo selecionado no input e devolve o conteúdo como texto (string).
    // Lê o arquivo do input para validar antes de anexar no GED
    return new Promise<string>(function (resolve, reject) {
      const r = new FileReader();
      r.onload = function (e) {
        resolve(String(e.target?.result || ''));
      };
      r.onerror = reject; // // Dispara se der erro ao ler o arquivo
      r.readAsText(file, 'UTF-8');
    });
  }
}
