import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ScenarioService } from '../../../services/scenario.service';
import { AlertService } from '../../../services/alert.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-scenario',
  templateUrl: './create-scenario.component.html',
  styleUrls: ['./create-scenario.component.scss']
})
export class CreateScenarioComponent implements OnInit {
  scenarioForm!: FormGroup;
  alertMessage: string = '';
  alertType: 'error' | 'info' | 'warning' | 'success' = 'info';


  constructor(
    private fb: FormBuilder,
    private scenarioService: ScenarioService,
    private alertService: AlertService,
    private router: Router  // Inject the Router
  ) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.scenarioForm = this.fb.group({
      name: ['', Validators.required],
      description: ['']
    });
  }

  onSubmit(): void {
    if (this.scenarioForm.valid) {
      this.scenarioService.addScenario(this.scenarioForm.value).subscribe({
        next: (response) => {
          // Redirect to index page with success message
          this.alertService.setAlert('Scenario created successfully', 'success');
          this.router.navigate(['/scenario']);

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
}
