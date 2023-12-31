import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { LocustService } from '../../services/locust.service';
import { TestCaseService } from '../../services/test-case.service';
import { TestCaseResultService } from '../../services/test-case-result.service';
import { firstValueFrom } from 'rxjs';

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
export class LoadTestComponent implements OnInit {
  form: FormGroup;
  isTesting: boolean = false;
  individualTestResults: Stat[] = [];
  showResults: boolean = false;
  currentUsers: number = 0;
  progress: number = 0; // Define progress property
  countdown: number = 0; // Define countdown property
  serviceStatus: 'running' | 'down' | 'unknown' = 'unknown';
  testCaseId!: string;
  testCase: any;
  aggregatedResult: Stat | null = null;

  constructor(
    private http: HttpClient,
    private locustService: LocustService,
    private testCaseService: TestCaseService,
    private testCaseResultService: TestCaseResultService,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      user_num: ['', Validators.required],
      spawn_rate: ['', Validators.required],
      host: ['', Validators.required],
      testPaths: this.fb.array([this.fb.control('')]),
      duration: ['5s', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.testCaseId = params['id'];
      if (this.testCaseId) {
        this.testCaseService.getTestCaseById(this.testCaseId).subscribe((data: any) => this.testCase = data);
      }
    });
  }

  get testPaths(): FormArray {
    return this.form.get('testPaths') as FormArray;
  }

  addTestPath(): void {
    this.testPaths.push(this.fb.control(''));
  }

  removeTestPath(index: number): void {
    this.testPaths.removeAt(index);
  }

  async onStartTest(): Promise<void> {
    if (this.form.valid) {
      this.isTesting = true;
      this.showResults = true;
      const { user_num, spawn_rate, host, testPaths, duration } = this.form.value;
      const paths = testPaths.map((path: string) => path.startsWith('/') ? path : '/' + path);

      await this.setPathsInFlask(host, paths);
      this.startLoadTest(user_num, spawn_rate, host, duration);
    }
  }

  private async setPathsInFlask(host: string, paths: string[]): Promise<void> {
    // Convert the Observable to a Promise using firstValueFrom
    await firstValueFrom(
        this.http.post('/api/set_paths', { host, paths })
    );
  }

  private startLoadTest(user_num: number, spawn_rate: number, host: string, duration: string): void {
    this.locustService.startLoadTest(user_num, spawn_rate, host, duration).subscribe(() => {
      const estimatedDuration = this.calculateEstimatedDuration(user_num, duration);
      const intervalId = setInterval(async () => {
        const isTesting = await this.locustService.isTestRunning().toPromise();
        if (!isTesting) {
          clearInterval(intervalId);
          this.stopTest();
        }
      }, 2000);
    });
  }

  private calculateEstimatedDuration(userCount: number, durationPerUser: string): number {
    // Logic to calculate estimated total duration
    return 0; // Placeholder for calculated duration
  }

  stopTest(): void {
    this.locustService.stopLoadTest().subscribe(() => {
      this.locustService.getStats().subscribe(stats => {
        this.processStats(stats);
        this.isTesting = false;
        this.saveTestResults();
      });
    });
  }

  private processStats(stats: any): void {
    // Clear previous test results
    this.individualTestResults = [];

    // Process individual path stats
    stats.stats.filter((stat: Stat) => stat.name !== 'Aggregated' && stat.name !== 'Total')
        .forEach((stat: Stat) => {
            this.individualTestResults.push(stat);
        });

    // Process aggregated stats, if available
    const aggregatedStats = stats.stats.find((stat: Stat) => stat.name === 'Aggregated');
    if (aggregatedStats) {
        this.aggregatedResult = aggregatedStats;
    } else {
        this.aggregatedResult = null;
    }

    // Update the UI to show results
    this.showResults = this.individualTestResults.length > 0;
  }

  saveTestResults(): void {
    this.individualTestResults.forEach(result => {
      this.testCaseResultService.addTestCaseResult({...result, testCaseId: this.testCaseId}).subscribe({
        next: response => console.log('Test result saved', response),
        error: err => console.error('Error saving test result', err)
      });
    });
  }
}
