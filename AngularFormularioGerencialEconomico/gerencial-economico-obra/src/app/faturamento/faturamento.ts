import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { FaturamentoService } from './faturamento.service';
@Component({
  selector: 'app-faturamento',
  imports: [MatIconModule,CurrencyPipe,DatePipe],
  templateUrl: './faturamento.html',
  styleUrl: './faturamento.css',
})
export class Faturamento {
  constructor(private faturamentoService:FaturamentoService){}

  get faturamento(){
    return this.faturamentoService.faturamentos();
  }
}
