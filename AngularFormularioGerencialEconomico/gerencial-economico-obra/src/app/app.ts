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
    'eyJraWQiOiI4ODg4NjYzYS01OWNiLTQzODktOTQ2YS01YzA4NDNiNGM5MjYiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJnYWJyaWVsLnBlcnNpa2UiLCJyb2xlIjoiYWRtaW4sdXNlciIsInRlbmFudCI6MSwidXNlclRlbmFudElkIjo0MiwidXNlclR5cGUiOjAsInVzZXJVVUlEIjoiZmM0ZjU5ODItZWY5MC00OTcxLTg2YjAtMTZmYWM3ZDhkNmZmIiwidGVuYW50VVVJRCI6Ijg4ODg2NjNhLTU5Y2ItNDM4OS05NDZhLTVjMDg0M2I0YzkyNiIsImxhc3RVcGRhdGVEYXRlIjoxNzY0MjU4ODgwMzU2LCJ1c2VyVGltZVpvbmUiOiJBbWVyaWNhL1Nhb19QYXVsbyIsImV4cCI6MTc3MjY1NDA0NiwiaWF0IjoxNzcyNjM5NjQ2LCJhdWQiOiJmbHVpZ19hdXRoZW50aWNhdG9yX3Jlc291cmNlIn0.a3TBbHJ-db75Q_KkPCr-RnWrsHw_Gi5vBVHlRTbL1AU-iy1bv7OUQjkNA9JTsxb38n5QZ_h2X37BrV0oGx-qpunfbkkxcl1oKmOvkI-sUwqUafQBGYeW7e-7ihLm3s8727R0LQp_rqD4NHew37oVeezHfhBjIl0104Pu7DsgvdMACoY8ZlMGcK2Hsn191vRTV2hLgucwwKdiFvodgQ72xK5KBW98uq5yn_mo-IVTQ-7UY8OZJtcdQL-2Nue6-RsLXe6J3Q2Oqckkq3UNSSi69j4kkPgkSw35ZOmsR0ZyrIVktRS968N4k3Ij-XlG-mhsTyC0yn1vq8GRTlHeJaz01Q',
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
