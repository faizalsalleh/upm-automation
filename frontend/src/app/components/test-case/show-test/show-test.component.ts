import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../../../services/project.service';
import { ScenarioService } from '../../../services/scenario.service';
import { TestCaseService } from '../../../services/test-case.service';

@Component({
  selector: 'app-show-test',
  templateUrl: './show-test.component.html',
  styleUrls: ['./show-test.component.scss']
})

export class ShowTestComponent implements OnInit {
  project: any;
  scenario: any;
  testCase: any;
  testCaseResults: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private scenarioService: ScenarioService,
    private testCaseService: TestCaseService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const testcaseId = params['id'];

      if (testcaseId) {
        //console.log('testcaseId: ', testcaseId);
        this.testCaseService.getTestCaseById(testcaseId).subscribe((data: any) => {
          this.testCase = data;
          const scenarioId = data.scenario_id;

          if (scenarioId) {
            //console.log('scenarioId: ', scenarioId);
            this.scenarioService.getScenarioById(scenarioId).subscribe((data: any) => {
              this.scenario = data;
              const projectId = data.project_id;

              if (projectId) {
                //console.log('projectId: ', projectId);
                this.projectService.getProjectById(projectId).subscribe((projectData: any) => {
                  this.project = projectData;
                });
              }
            });
          }
        });

        this.testCaseService.getAllTestCaseResults(testcaseId).subscribe((data: any[]) => {
          this.testCaseResults = data;
        });
      } else {
        // Handle invalid or missing project ID
      }
    });
  }

  deleteTestCase(testcaseId: string) {
    // Implement project deletion logic
  }
}
