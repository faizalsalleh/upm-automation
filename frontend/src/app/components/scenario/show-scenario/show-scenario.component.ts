import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../../../services/project.service';
import { ScenarioService } from '../../../services/scenario.service';

@Component({
  selector: 'app-show-scenario',
  templateUrl: './show-scenario.component.html',
  styleUrls: ['./show-scenario.component.scss']
})

export class ShowScenarioComponent implements OnInit {
  project: any;
  scenario: any;
  testCases: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private scenarioService: ScenarioService
  ) { }

  ngOnInit(): void {
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

  deleteProject(projectId: number) {
    // Implement project deletion logic
  }
}
