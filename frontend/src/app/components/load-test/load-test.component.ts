import { Component } from '@angular/core';
import { LocustService } from '../../services/locust.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

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
  safe_name?: string;
}

@Component({
  selector: 'app-load-test',
  templateUrl: './load-test.component.html',
  styleUrls: ['./load-test.component.scss']
})

export class LoadTestComponent {
  form: FormGroup;
  isTesting: boolean = false;
  individualTestResults: Stat[] = [];
  aggregatedResult: Stat | null = null;

  constructor(private locustService: LocustService, private fb: FormBuilder) {
    this.form = this.fb.group({
      userCount: ['', Validators.required],
      spawnRate: ['', Validators.required],
      host: ['', Validators.required],
      testPaths: this.fb.array([this.fb.control('')])
    });
  }

  get testPaths() {
    return this.form.get('testPaths') as FormArray;
  }

  addTestPath() {
    this.testPaths.push(this.fb.control(''));
  }

  removeTestPath(index: number) {
    this.testPaths.removeAt(index);
  }

  onStartTest(): void {
    if (this.form.valid) {
      this.isTesting = true;
      const { userCount, spawnRate, host, testPaths } = this.form.value;
      const fullUrls = testPaths.map((path: string) => host + path);

      this.locustService.startLoadTest(userCount, spawnRate, fullUrls).subscribe(response => {
        console.log('Test started:', response);
        // Calculate the test duration based on user count
        const testDuration = this.calculateTestDuration(userCount);
        // Wait for the test to complete before stopping and getting stats
        setTimeout(() => {
          this.onStopTest();
          this.onGetStats();
        }, testDuration * 2000); // Convert seconds to milliseconds
      });
    }
  }

  onStopTest(): void {
    this.locustService.stopLoadTest().subscribe(response => {
      console.log('Test stopped:', response);
      this.onGetStats();
    });
  }

  onGetStats(): void {
    this.locustService.getStats().subscribe(stats => {
      console.log('Current stats:', stats);

      // Filter out the 'Aggregated' entry from the stats array
      const filteredStats = stats.stats.filter(stat => stat.name !== 'Aggregated');

      // Now, only individual test results are pushed into the array
      this.individualTestResults.push(...filteredStats);

      // If you need to calculate aggregated results manually, do it here
      this.calculateAggregatedResults();

      this.isTesting = false;
    });
  }

  onResetStats(): void {
    this.locustService.resetStats().subscribe(response => {
      console.log('Stats reset:', response);
    });
  }

  calculateTestDuration(userCount: number): number {
    if (userCount <= 10) {
      return 5; // Duration in seconds for up to 10 users
    } else if (userCount <= 50) {
      return 15; // Duration in seconds for up to 50 users
    } else if (userCount <= 100) {
      return 30; // Duration in seconds for up to 100 users
    } else {
      return 60; // Duration in seconds for more than 100 users
    }
  }

// ...

calculateAggregatedResults(): void {
  // Initialize the aggregatedResult object with zeros or appropriate starting values
  const initialAggregatedResult: Stat = {
    avg_content_length: 0,
    avg_response_time: 0,
    current_fail_per_sec: 0,
    current_rps: 0,
    max_response_time: 0,
    median_response_time: 0,
    method: '', // method might not be relevant for aggregated results
    min_response_time: Number.MAX_SAFE_INTEGER,
    ninetieth_response_time: 0,
    ninety_ninth_response_time: 0,
    num_failures: 0,
    num_requests: 0,
    name: 'Aggregated', // or any other identifier you prefer
    safe_name: 'aggregated' // or any other identifier you prefer
  };

  // Sum up all the values for each test result
  this.individualTestResults.forEach(stat => {
    initialAggregatedResult.avg_content_length += stat.avg_content_length;
    initialAggregatedResult.avg_response_time += stat.avg_response_time;
    initialAggregatedResult.current_fail_per_sec += stat.current_fail_per_sec;
    initialAggregatedResult.current_rps += stat.current_rps;
    initialAggregatedResult.max_response_time = Math.max(initialAggregatedResult.max_response_time, stat.max_response_time);
    initialAggregatedResult.median_response_time += stat.median_response_time;
    // Assuming min_response_time should be the minimum of all tests
    initialAggregatedResult.min_response_time = Math.min(initialAggregatedResult.min_response_time, stat.min_response_time);
    initialAggregatedResult.ninetieth_response_time += stat.ninetieth_response_time;
    initialAggregatedResult.ninety_ninth_response_time += stat.ninety_ninth_response_time;
    initialAggregatedResult.num_failures += stat.num_failures;
    initialAggregatedResult.num_requests += stat.num_requests;
  });

  // Calculate averages by dividing by the number of test results
  const testCount = this.individualTestResults.length;
  if (testCount > 0) {
    initialAggregatedResult.avg_content_length /= testCount;
    initialAggregatedResult.avg_response_time /= testCount;
    initialAggregatedResult.median_response_time /= testCount;
    initialAggregatedResult.ninetieth_response_time /= testCount;
    initialAggregatedResult.ninety_ninth_response_time /= testCount;
    // For current RPS and current failures per second, you might want to take the average or the max
    initialAggregatedResult.current_rps /= testCount;
    initialAggregatedResult.current_fail_per_sec /= testCount;
    // If min_response_time is MAX_SAFE_INTEGER, it means no requests were made
    if (initialAggregatedResult.min_response_time === Number.MAX_SAFE_INTEGER) {
      initialAggregatedResult.min_response_time = 0;
    }
  }

  // Assign the calculated result to this.aggregatedResult
  this.aggregatedResult = initialAggregatedResult;
}

}
