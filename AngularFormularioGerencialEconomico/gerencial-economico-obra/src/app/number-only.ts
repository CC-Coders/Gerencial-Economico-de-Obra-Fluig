import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[numberOnly]'
})
export class NumberOnlyDirective {
  @HostListener('input', ['$event']) onInputChange(event: any) {
    const initialValue = event.target.value;
    // Allow digits and one decimal point
    event.target.value = initialValue.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
    if (initialValue !== event.target.value) {
      event.stopPropagation();
    }
  }

  @HostListener('keypress', ['$event']) onKeyPress(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    const currentValue = event.target.value;
    // Allow digits, backspace, delete, tab, escape, enter, and dot (but only one dot)
    if (
      charCode > 31 &&
      (charCode < 48 || charCode > 57) &&
      charCode !== 46 // dot
    ) {
      event.preventDefault();
      return false;
    }
    // Prevent multiple dots
    if (charCode === 46 && currentValue.includes('.')) {
      event.preventDefault();
      return false;
    }
    return true;
  }
}