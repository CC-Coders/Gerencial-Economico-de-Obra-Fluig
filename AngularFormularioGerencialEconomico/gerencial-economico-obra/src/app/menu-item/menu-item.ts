import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';
import {MatIconModule} from '@angular/material/icon';


@Component({
  selector: 'app-menu-item',
  imports: [NgClass, MatIconModule],
  templateUrl: './menu-item.html',
  styleUrl: './menu-item.css',
})
export class MenuItem {
  @Input({required:true}) NAME!: string;
  @Input({required:true}) ICON_NAME!: string;
  @Input() isActive?: string;
}
