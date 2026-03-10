import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MenuItem } from './menu-item/menu-item';

@Component({
  selector: 'app-menu',
  imports: [MenuItem],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu {
  @Output() selectMenu = new EventEmitter();
  @Input({required:true}) activeMenu!: string;

  onSelectMenu(menu:string) {
    this.selectMenu.emit(menu);
  }
}
