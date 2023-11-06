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
  isTesting: boolean = false; // To track if the testing is in progress
  statsData: any[] = []; // To store the stats data

  constructor(private locustService: LocustService, private fb: FormBuilder) {
    this.form = this.fb.group({
      userCount: ['', Validators.required],
      spawnRate: ['', Validators.required],
      host: ['', Validators.required]
    });
  }

  onStartTest(): void {
    if (this.form.valid) {
      this.isTesting = true; // Set testing flag to true
      const { userCount, spawnRate, host } = this.form.value;
      this.locustService.startLoadTest(userCount, spawnRate, host).subscribe(response => {
        console.log('Test started:', response);
        // After starting the test, stop it
        this.onStopTest();
      });
    }
  }

  onStopTest(): void {
    this.locustService.stopLoadTest().subscribe(response => {
      console.log('Test stopped:', response);
      // After stopping the test, reset stats
      //this.onResetStats();
      this.onGetStats();
    });
  }

  onResetStats(): void {
    this.locustService.resetStats().subscribe(response => {
      console.log('Stats reset:', response);
      // After resetting stats, get the stats
      //this.onGetStats();
    });
  }

  onGetStats(): void {
    this.locustService.getStats().subscribe(stats => {
      console.log('Current stats:', stats);
      this.statsData = stats.stats; // Store the stats data
      this.isTesting = false; // Set testing flag to false
      this.onResetStats();
    });
  }
}
