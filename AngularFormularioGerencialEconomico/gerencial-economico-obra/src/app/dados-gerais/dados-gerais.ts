import { Component } from '@angular/core';
import { Card } from '../card/card';
import {MatIconModule} from '@angular/material/icon';


@Component({
  selector: 'app-dados-gerais',
  imports: [Card, MatIconModule],
  templateUrl: './dados-gerais.html',
  styleUrl: './dados-gerais.css',
})
export class DadosGerais {}
