import { Component, Input, TemplateRef, ContentChild, SimpleChanges} from '@angular/core';
import { CommonModule } from '@angular/common';
import {tarefaInteface} from "../producao/tarefa.inteface"

// import { CurrencyPipe } from '@angular/common';

// import { CurrencyMaskModule } from "ng2-currency-mask";


@Component({
  selector: 'app-fluig-table',
  imports: [CommonModule],
  templateUrl: './fluig-table.html',
  styleUrl: './fluig-table.css',
})

export class FluigTable {
  @ContentChild(TemplateRef) rowTemplate!: TemplateRef<any>;
  @Input({required:true}) data!: tarefaInteface[];
  @Input({required:true}) columns!: string[];
  @Input({required:true}) tablename!: string;
}
