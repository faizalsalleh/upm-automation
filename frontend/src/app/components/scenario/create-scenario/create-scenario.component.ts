import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../../../services/project.service';
import { ScenarioService } from '../../../services/scenario.service';
import { AlertService } from '../../../services/alert.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-create-scenario',
  templateUrl: './create-scenario.component.html',
  styleUrls: ['./create-scenario.component.scss']
})
export class CreateScenarioComponent implements OnInit {
  scenarioForm!: FormGroup;
  alertMessage: string = '';
  alertType: 'error' | 'info' | 'warning' | 'success' = 'info';
  project: any;
  projectId!: string;

  constructor(
    private fb: FormBuilder,
    private scenarioService: ScenarioService,
    private alertService: AlertService,
    private router: Router,  // Inject the Router
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.initializeForm();

    this.route.params.subscribe(params => {
      this.projectId = params['id'];

        if (this.projectId) {
          this.projectService.getProjectById(this.projectId).subscribe((projectData: any) => {
            this.project = projectData;
          });
        } else {
        // Handle invalid or missing project ID
        }
    })
  }

  initializeForm(): void {
    this.scenarioForm = this.fb.group({
      name: ['', Validators.required],
      description: ['']
    });
  }

  onSubmit(): void {
    if (this.scenarioForm.valid) {
      // Prepare the form data including scenarioId
      const formData = {
        ...this.scenarioForm.value,
        project_id: this.projectId
      };

      this.scenarioService.addScenario(formData).subscribe({
        next: (response) => {
          // Redirect to index page with success message
          this.alertService.setAlert('Scenario created successfully', 'success');
          this.router.navigate(['/project/show', this.projectId]);

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

  goBack(): void {
    this.location.back();
  }

}
