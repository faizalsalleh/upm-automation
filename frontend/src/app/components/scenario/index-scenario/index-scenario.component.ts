import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ScenarioService } from '../../../services/scenario.service';
import { AlertService  } from '../../../services/alert.service';

@Component({
  selector: 'app-index-scenario',
  templateUrl: './index-scenario.component.html',
  styleUrls: ['./index-scenario.component.scss']
})

export class IndexScenarioComponent implements OnInit {
  scenarios: any[] = [];
  alertMessage: string = '';  // Initialize as empty string
  alertType: 'error' | 'info' | 'warning' | 'success' = 'info';  // Keep the default type

  constructor(private scenarioService: ScenarioService, private alertService: AlertService, private router: Router) { }

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
      const alertInfo = this.alertService.getAlert();
      this.alertMessage = alertInfo.message;
      this.alertType = alertInfo.type;
      console.log('Alert Message:', this.alertMessage);

      // Clear the alert message in the service after retrieving it
      this.alertService.clearAlert();

    this.scenarioService.getAllScenarios().subscribe({
      next: (data) => this.scenarios = data,
      error: (error) => console.error('Error fetching scenarios', error)
    });
  }
}

