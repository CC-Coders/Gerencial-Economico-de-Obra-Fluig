import { Component, signal } from '@angular/core';
import { Menu } from './menu/menu';
import { DadosGerais, Backlog } from './dados-gerais/dados-gerais';
import { Producao } from './producao/producao';
import { DatasetFactory } from '../fluigDatasets';

@Component({
  selector: 'app-root',
  imports: [Menu, DadosGerais, Producao],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('gerencial-economico-obra');
  DatasetFactory = new DatasetFactory(
    'eyJraWQiOiI4ODg4NjYzYS01OWNiLTQzODktOTQ2YS01YzA4NDNiNGM5MjYiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJnYWJyaWVsLnBlcnNpa2UiLCJyb2xlIjoiYWRtaW4sdXNlciIsInRlbmFudCI6MSwidXNlclRlbmFudElkIjo0MiwidXNlclR5cGUiOjAsInVzZXJVVUlEIjoiZmM0ZjU5ODItZWY5MC00OTcxLTg2YjAtMTZmYWM3ZDhkNmZmIiwidGVuYW50VVVJRCI6Ijg4ODg2NjNhLTU5Y2ItNDM4OS05NDZhLTVjMDg0M2I0YzkyNiIsImxhc3RVcGRhdGVEYXRlIjoxNzY0MjU4ODgwMzU2LCJ1c2VyVGltZVpvbmUiOiJBbWVyaWNhL1Nhb19QYXVsbyIsImV4cCI6MTc3MjkyMzQ2NCwiaWF0IjoxNzcyOTA5MDY0LCJhdWQiOiJmbHVpZ19hdXRoZW50aWNhdG9yX3Jlc291cmNlIn0.LUL_Y1P5K5d8YtNuKiQQQzLCfn9NL4Te4I4BJTHFWX9mb00qXISMzkBfWMj5pT0zEg_cK_2R9phF4xjLOPgHMQBjINmIHGwK0sQWVxqLmd38Tck2LrWI3A6WetNdqb-ex8yNj8t7yQY2rp5VNwihvq_swQzvpEt9i6LSxZFVDELXHiYg94Bycr7EJKSz6FJ-_1IwpcF1c3RIe0YiaAGSg07aYRuMpU6OxTKz1eGkzOERWGdt1i_dpqtPCjSM1VP3xom9tU0_51WghV2rYrYY_PIZte-bWNnOJSrxDG_5BR2VP6cAbmO-dWSunmFoIlw9LC_cCUppA6JvpI6CUg7ckA',
  );

  activeMenu: string = 'Dados Gerais';
  backlog = signal<Backlog>({
    vlr_pi_medido: 0,
    vlr_aditivos_medido: 0,
    des_centro_custo: '',
    dt_base: '',
    des_empresa: '',
    des_indice_reajuste: '',
    des_cliente: '',
    cod_obra: '',
    des_lider_contrato: '',
    des_coordenacao: '',
    vlr_r_medido: 0,
    dt_ultima_alteracao: 'Tue, 24 Feb 2026 15:20:33 GMT',
    vlr_nao_executavel: 0,
    cod_coligada: 1,
    vlr_aditivos: 0,
    des_observacao: 'Inicio',
    user_ultima_alteracao: 'gabriel.persike',
    vlr_r: 0,
    vlr_pi: 20000000,
  });

  async ngOnInit() {
    this.backlog.set(await this.getBacklog());
  }

  changeActiveMenu(menu: string) {
    console.log(menu);
    this.activeMenu = menu;
  }

  async getBacklog() {
    var ds = await this.DatasetFactory.getDataset(
      'dsConsultaObraGerencialEconomico',
      [],
      [
        DatasetFactory.createConstraint('CODCOLIGADA','1','1',DatasetFactory.ConstraintType.MUST,null,),
        DatasetFactory.createConstraint('CODCCUSTO','1.4.025','1.4.025',DatasetFactory.ConstraintType.MUST,null,),
      ],
      [],
    );

    if (ds.values[0].STATUS != 'SUCCESS') {
      throw ds.values[0].MENSAGEM;
    } else {
      return JSON.parse(ds.values[0].RESULT).data[0];
    }
  }
}
