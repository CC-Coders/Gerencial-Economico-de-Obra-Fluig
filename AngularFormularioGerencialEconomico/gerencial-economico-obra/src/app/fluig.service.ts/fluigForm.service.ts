import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FluigForm {
  constructor(){
      this.WKNumState = parseInt(this.getValue("atividade"));
      this.formMode = this.getValue("formMode");
  }

  WKNumState:number;
  formMode:string;

  setValue(name: string, value: string) {
    (document.getElementById(name) as HTMLInputElement).value = value;
  }
  getValue(name: string) {
    return (document.getElementById(name) as HTMLInputElement).value;
  }

  updatePaiFilho(tableName: string, data: {name:string, value:string|number|null}[][]) {
    var table = $('#' + tableName);
    var trList = $(table).find('tbody>tr:not(:first)');

    var dataLength = data.length;
    var tableLength = table.find('tbody>tr:not(:first)').length;
    var maxTries = 500;

    while (table.find('tbody>tr:not(:first)').length != dataLength && maxTries > 0) {
      if (table.find('tbody>tr:not(:first)').length > data.length) {
        this.fnWdkRemoveChild(table.find('tbody>tr:not(:first):last'));
      } else {
        this.wdkAddChild(table);
      }
      maxTries--;
    }

    var counter = 1;
    var trList = $(table).find('tbody>tr:not(:first)');
    for (const row of data) {
      var tr = trList[counter];

      
      for (const column of row) {
        var name = column.name + "___" + counter;
        $("#"+name).val(column.value || "");
      }

      counter++;
    }
  }
  getPaiFilho(tableName:string){
      var table = $('#' + tableName);
      var retorno:{name:string, value:string}[][] = [];
      $(table).find("tbody>tr:not(:first)").each(function(){
        var row: {name:string, value:string}[] = [];
        $(this).find("input").each(function(){
          var name:string = $(this).attr("id")?.split("___")[0]||"";
          var value:string = $(this).val() || "";
          if (name && value) {
            row.push({
              name:name,
              value: value
            })
          }
        });
        retorno.push(row);
      });
      return retorno;
  }

  private fnWdkRemoveChild(tr: any) {
    $(tr).find('.fluigicon').trigger('click');
  }
  private wdkAddChild(table: any) {
    $(table).closest('table.table').find('tbody>tr:first>td:first>input').trigger('click');
  }
}
