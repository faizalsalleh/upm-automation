import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private alertMessage: string = '';
  private alertType: 'error' | 'info' | 'warning' | 'success' = 'info';

  setAlert(message: string, type: 'error' | 'info' | 'warning' | 'success' = 'info') {
    this.alertMessage = message;
    this.alertType = type;
  }

  getAlert(): { message: string, type: 'error' | 'info' | 'warning' | 'success' } {
    return { message: this.alertMessage, type: this.alertType };
  }

  clearAlert() {
    this.alertMessage = '';
    this.alertType = 'info';
  }
}
