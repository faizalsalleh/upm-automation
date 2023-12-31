import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent {
  @Input() message: string = '';
  @Input() type: 'error' | 'info' | 'warning' | 'success' = 'info';

  hideAlert() {
    this.message = '';
  }

}
