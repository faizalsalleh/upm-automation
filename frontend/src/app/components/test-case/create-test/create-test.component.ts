import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../../../services/project.service';
import { ScenarioService } from '../../../services/scenario.service';
import { TestCaseService } from '../../../services/test-case.service';
import { AlertService } from '../../../services/alert.service';


@Component({
  selector: 'app-create-test',
  templateUrl: './create-test.component.html',
  styleUrls: ['./create-test.component.scss']
})
export class CreateTestComponent implements OnInit {
  form!: FormGroup;
  alertMessage: string = '';
  alertType: 'error' | 'info' | 'warning' | 'success' = 'info';
  project: any;
  scenario: any;
  scenarioId!: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private testCaseService: TestCaseService,
    private projectService: ProjectService,
    private scenarioService: ScenarioService,
    private alertService: AlertService
    ) {}

  ngOnInit(): void {
    this.initializeForm();

    this.route.params.subscribe(params => {
      this.scenarioId = params['id'];

      if (this.scenarioId) {

        //console.log('scenarioId: ', scenarioId);
        this.scenarioService.getScenarioById(this.scenarioId).subscribe((data: any) => {
          this.scenario = data;
          const projectId = data.project_id;

          if (projectId) {
            //console.log('projectId: ', projectId);
            this.projectService.getProjectById(projectId).subscribe((projectData: any) => {
              this.project = projectData;
            });
          }
        });

      } else {
        // Handle invalid or missing project ID
      }
    });

  }

  initializeForm(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['']
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      // Prepare the form data including scenarioId
      const formData = {
        ...this.form.value,
        scenario_id: this.scenarioId
      };

      //console.log('formData:', formData);

      this.testCaseService.addTestCase(formData).subscribe({
        next: (response) => {
          // Get _id from the response
          const newId = response.id;
          this.router.navigate(['/testcase/start', newId]);
        },
        error: (error) => {
          // Display error message on the create page
          this.alertMessage = error.error.message;
          this.alertType = 'error';
          window.scrollTo(0, 0); // Scroll to the top of the window
        }
      });
    }
  }

  deleteTestCase(testcaseId: string) {
    // Implement project deletion logicc
  }
}
