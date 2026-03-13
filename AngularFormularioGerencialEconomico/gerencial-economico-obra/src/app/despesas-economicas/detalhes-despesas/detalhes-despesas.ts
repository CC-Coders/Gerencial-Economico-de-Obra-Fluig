import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-detalhes-despesas',
  imports: [MatIcon, CurrencyPipe, DatePipe],
  templateUrl: './detalhes-despesas.html',
  styleUrl: './detalhes-despesas.css',
})
export class DetalhesDespesas {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) data!: any[];
  @Output() close = new EventEmitter<void>();

  columnSort = 'data';
  sortOrder = 'ASC';

  get despesas() {
    var despesas = [...this.data];
    if (this.columnSort == "valor") {
      return despesas.sort((a, b) => {
        if (this.sortOrder == 'ASC') {
          return parseFloat(a[this.columnSort]) < parseFloat(b[this.columnSort]) ? 1 : -1;
        } else {
          return parseFloat(b[this.columnSort]) < parseFloat(a[this.columnSort]) ? 1 : -1;
        }
      });
    }else{
      return despesas.sort((a, b) => {
        if (this.sortOrder == 'ASC') {
          return a[this.columnSort].localeCompare(b[this.columnSort], 'pt-BR');
        } else {
          return b[this.columnSort].localeCompare(a[this.columnSort], 'pt-BR');
        }
      });
    }

  }

  changeSorting(column: string) {
    if (column != this.columnSort) {
      this.columnSort = column;
    } else {
      this.sortOrder = this.sortOrder == 'ASC' ? 'DESC' : 'ASC';
    }
  }
  onClose() {
    this.close.emit();
  }
}
