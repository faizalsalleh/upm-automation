import { Component } from '@angular/core';
import { LocustService } from '../../services/locust.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

// Define the structure of the stats object
interface Stat {
  avg_content_length: number;
  avg_response_time: number;
  current_fail_per_sec: number;
  current_rps: number;
  max_response_time: number;
  median_response_time: number;
  method: string;
  min_response_time: number;
  name: string;
  ninetieth_response_time: number;
  ninety_ninth_response_time: number;
  num_failures: number;
  num_requests: number;
  safe_name: string;
}

interface StatsResponse {
  stats: Stat[];
  // Add other properties from the response if needed
}

@Component({
  selector: 'app-load-test',
  templateUrl: './load-test.component.html',
  styleUrls: ['./load-test.component.scss']
})
export class LoadTestComponent {
  form: FormGroup;
  isTesting: boolean = false; // To track if the testing is in progress
  statsData: Stat[] = []; // To store the stats data
  testInProgress: boolean = false;
  testResults: Stat[] = [];
  aggregatedResult: Stat | null = null;

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
        // Wait for a certain amount of time before stopping the test
        setTimeout(() => {
          this.onStopTest();
        }, 5000); // Wait for 5 seconds (or the duration of your test)
      });
    }
  }

  onStopTest(): void {
    this.locustService.stopLoadTest().subscribe(response => {
      console.log('Test stopped:', response);
      // After stopping the test, get the stats
      this.onGetStats();
    });
  }

  onGetStats(): void {
    this.locustService.getStats().subscribe((stats: StatsResponse) => {
      console.log('Current stats:', stats);
      this.statsData = [...this.statsData, ...stats.stats]; // Append the new stats to the array
      this.isTesting = false; // Set testing flag to false
      // Optionally, you can reset stats here if needed
      this.onResetStats();
    });
  }

  onResetStats(): void {
    this.locustService.resetStats().subscribe(response => {
      console.log('Stats reset:', response);
      // Resetting stats is complete, you can now start a new test if needed
    });
  }
}
