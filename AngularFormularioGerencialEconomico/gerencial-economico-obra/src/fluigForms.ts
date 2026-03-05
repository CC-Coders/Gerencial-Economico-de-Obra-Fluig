import { Directive, Input, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[FluigForm]',
})
export class FluigForm {
  @Input() fieldName!: string;
  fieldElement!: HTMLInputElement | HTMLSelectElement;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.fieldElement = document.getElementById(this.fieldName) as HTMLInputElement;
    console.log(this.fieldElement);
  }

  @HostListener('change', ['$event.target'])
  onChange(target: any) {
    var value = target.value;
    console.log(value)
    if (this.fieldElement) {
      this.fieldElement.value = value;
    }
  }
}