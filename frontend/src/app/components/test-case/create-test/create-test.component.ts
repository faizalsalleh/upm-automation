import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../../../services/project.service';
import { ScenarioService } from '../../../services/scenario.service';
import { TestCaseService } from '../../../services/test-case.service';
import { AlertService } from '../../../services/alert.service';
import { LocustService } from '../../../services/locust.service';

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

  isTesting: boolean = false;
  individualTestResults: Stat[] = [];
  aggregatedResult: Stat | null = null;
  progress: number = 100;
  currentTestUrl: string = '';
  showResults: boolean = false;
  currentUsers: number = 0;
  serviceStatus: 'running' | 'down' | 'unknown' = 'unknown';
  countdown: number = 0;

  constructor(
    private locustService: LocustService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private testCaseService: TestCaseService,
    private projectService: ProjectService,
    private scenarioService: ScenarioService,
    private alertService: AlertService
    ) {
    this.form = this.fb.group({
      userCount: ['', Validators.required],
      spawnRate: ['', Validators.required],
      host: ['', Validators.required],
      testPaths: this.fb.array([this.fb.control('')]),
      duration: ['5s', Validators.required]
    });
  }

  ngOnInit(): void {
    this.initializeForm();
    this.updateServiceStatus();
    this.startStatsUpdate();

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
      this.testCaseService.addTestCase(this.form.value).subscribe({
        next: (response) => {
          // Redirect to index page with success message
          this.alertService.setAlert('Test case created successfully', 'success');
          this.router.navigate(['/scenario', this.scenarioId ]);

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

  startStatsUpdate() {
    const statsInterval = setInterval(() => {
      if (this.isTesting) {
        this.locustService.getRealTimeStats().subscribe(stats => {
          this.currentUsers = stats.user_count; // Update the number of current users
        });
      } else {
        clearInterval(statsInterval); // Stop updating stats when testing is not active
      }
    }, 2000); // Fetch stats every 2 seconds (adjust as needed)
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

  async onStartTest(): Promise<void> {
    if (this.form.valid) {
      this.isTesting = true;
      this.showResults = true;
      const { userCount, spawnRate, host, testPaths, duration } = this.form.value;

      this.individualTestResults = [];
      for (const path of testPaths) {
        await this.runTest(userCount, spawnRate, host, path, duration);
      }
      this.isTesting = false;
    }
  }

  async runTest(userCount: number, spawnRate: number, host: string, path: string, duration: string): Promise<void> {
    return new Promise((resolve) => {
      const normalizedHost = host.endsWith('/') ? host.slice(0, -1) : host;
      const fullPath = normalizedHost + (path.startsWith('/') ? '' : '/') + path;
      const durationMs = this.convertDurationToMilliseconds(duration);

      this.currentTestUrl = fullPath;
      this.locustService.startLoadTest(userCount, spawnRate, fullPath).subscribe(response => {
        this.progress = 100;
        const startTime = Date.now();

        // Initialize countdown based on duration
        this.countdown = Math.ceil(durationMs / 1000);

        const interval = setInterval(() => {
          const elapsedTime = Date.now() - startTime;
          this.progress = Math.max(0, 100 - (elapsedTime / durationMs) * 100);

          // Update countdown
          this.countdown = Math.ceil((durationMs - elapsedTime) / 1000);

          // Fetch current users
          this.updateCurrentUsers();

          if (elapsedTime >= durationMs) {
            clearInterval(interval);
            this.stopTestAndFetchStats(path, resolve);
          }
        }, 1000);
      });
    });
  }

  private updateCurrentUsers(): void {
    this.locustService.getRealTimeStats().subscribe(stats => {
      this.currentUsers = stats.user_count; // Update the number of current users
    });
  }

  private stopTestAndFetchStats(path: string, resolve: () => void): void {
    this.locustService.stopLoadTest().subscribe(stopResponse => {
      this.locustService.getStats().subscribe(stats => {
        this.processStats(stats, path);
        resolve();
      });
    });
  }

  processStats(stats: any, path: string): void {
    const filteredStats = stats.stats.filter((stat: Stat) => stat.name !== 'Aggregated');
    filteredStats.forEach((stat: Stat) => {
      stat.name = path;
    });

    this.individualTestResults.push(...filteredStats);
    this.calculateAggregatedResults();
  }

  stopTest(): void {
    this.locustService.stopLoadTest().subscribe(response => {
      this.onResetStats();
      this.isTesting = false;
    });
  }

  onResetStats(): void {
    this.locustService.resetStats().subscribe(response => {
      this.individualTestResults = [];
      this.aggregatedResult = null;
    });
  }

  convertDurationToMilliseconds(duration: string): number {
    const match = duration.match(/(\d+)([hms])/);
    if (match) {
      const value = parseInt(match[1], 10);
      const unit = match[2];
      switch (unit) {
        case 'h': return value * 3600000;
        case 'm': return value * 60000;
        case 's': return value * 1000;
        default: return 0;
      }
    }
    return 0;
  }

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

  updateServiceStatus(): void {
    this.locustService.checkServiceStatus().subscribe({
      next: (response) => this.serviceStatus = response.status,
      error: () => this.serviceStatus = 'down'
    });
  }

  deleteTestCase(testcaseId: string) {
    // Implement project deletion logic
  }
}
