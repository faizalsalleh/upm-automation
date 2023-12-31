import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import { AlertService  } from '../../services/alert.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  project: any;
  alertMessage: string = '';  // Initialize as empty string
  alertType: 'error' | 'info' | 'warning' | 'success' = 'info';  // Keep the default type

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dashboardService: DashboardService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    const alertInfo = this.alertService.getAlert();
    this.alertMessage = alertInfo.message;
    this.alertType = alertInfo.type;

    // Clear the alert message in the service after retrieving it
    this.alertService.clearAlert();

    this.route.params.subscribe(params => {
      const projectId = params['id'];

      if (projectId) {

        if (projectId) {
          this.dashboardService.getDashboard(projectId).subscribe((projectData: any) => {
            this.project = projectData;
          });
        }

      } else {
        // Handle invalid or missing project ID
      }
    });
  }

}

