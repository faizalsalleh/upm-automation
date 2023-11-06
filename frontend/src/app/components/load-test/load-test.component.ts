import { Component } from '@angular/core';
import { LocustService } from '../../services/locust.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-load-test',
  templateUrl: './load-test.component.html',
  styleUrls: ['./load-test.component.scss']
})
export class LoadTestComponent {
  form: FormGroup;

  constructor(private locustService: LocustService, private fb: FormBuilder) {
    this.form = this.fb.group({
      userCount: ['', Validators.required],
      spawnRate: ['', Validators.required],
      host: ['', Validators.required]
    });
  }

  onStartTest(): void {
    if (this.form.valid) {
      const { userCount, spawnRate, host } = this.form.value;
      this.locustService.startLoadTest(userCount, spawnRate, host).subscribe(response => {
        console.log('Test started:', response);
      });
    }
  }

  onStopTest(): void {
    this.locustService.stopLoadTest().subscribe(response => {
      console.log('Test stopped:', response);
    });
  }

  onGetStats(): void {
    this.locustService.getStats().subscribe(stats => {
      console.log('Current stats:', stats);
    });
  }

  onResetStats(): void {
    this.locustService.resetStats().subscribe({
        next: (response) => {
            console.log('Stats reset:', response);
        },
        error: (error) => {
            console.error('Error:', error);
            // Handle the error, e.g., show a user-friendly message on the UI
        }
    });
  }
}
