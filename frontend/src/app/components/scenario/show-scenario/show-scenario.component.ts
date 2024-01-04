import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../../../services/project.service';
import { ScenarioService } from '../../../services/scenario.service';
import { AlertService  } from '../../../services/alert.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-show-scenario',
  templateUrl: './show-scenario.component.html',
  styleUrls: ['./show-scenario.component.scss']
})

export class ShowScenarioComponent implements OnInit {
  project: any;
  scenario: any;
  testCases: any[] = [];
  alertMessage: string = '';  // Initialize as empty string
  alertType: 'error' | 'info' | 'warning' | 'success' = 'info';  // Keep the default type

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private scenarioService: ScenarioService,
    private alertService: AlertService,
    private location: Location
  ) { }

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    const alertInfo = this.alertService.getAlert();
    this.alertMessage = alertInfo.message;
    this.alertType = alertInfo.type;
    console.log('Alert Message:', this.alertMessage);

    // Clear the alert message in the service after retrieving it
    this.alertService.clearAlert();

    this.route.params.subscribe(params => {
      const scenarioId = params['id'];

      if (scenarioId) {

        this.scenarioService.getScenarioById(scenarioId).subscribe((data: any) => {
          this.scenario = data;
          const projectId = data.project_id;

          if (projectId) {
            this.projectService.getProjectById(projectId).subscribe((projectData: any) => {
              this.project = projectData;
            });
          }
        });

        this.scenarioService.getTestCasesForScenario(scenarioId).subscribe((data: any[]) => {
          this.testCases = data;
          console.log('Test cases data:', this.testCases);
        });
      } else {
        // Handle invalid or missing project ID
      }
    });
  }

  deleteScenario(scenarioId: string) {
    // Implement project deletion logic
  }

  goBack(): void {
    this.location.back();
  }

}
