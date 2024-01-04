import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocustService } from '../../services/locust.service';
import { TestCaseService } from '../../services/test-case.service';
import { TestCaseResultService } from '../../services/test-case-result.service';
import { AlertService } from '../../services/alert.service';

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
  user_num: number;
  ninetieth_response_time: number;
  ninety_ninth_response_time: number;
  num_failures: number;
  num_requests: number;
  safe_name?: string;
}

@Component({
  selector: 'app-load-test',
  templateUrl: './load-test.component.html',
  styleUrls: ['./load-test.component.scss'],
})

export class LoadTestComponent implements OnInit {
  form: FormGroup;
  isTesting: boolean = false;
  alertMessage: string = '';
  alertType: 'error' | 'info' | 'warning' | 'success' = 'info';
  individualTestResults: Stat[] = [];
  progress: number = 100;
  currentTestUrl: string = '';
  userNum: number = 0;
  showResults: boolean = false;
  currentUsers: number = 0;
  serviceStatus: 'running' | 'down' | 'unknown' = 'unknown';
  countdown: number = 0;
  testCaseId!: string;
  scenarioId!: string;
  testCase: any;
  testCaseName!: string;
  fullPath!: string;
  spawnRate: number = 0;

  constructor(
    private locustService: LocustService,
    private testCaseService: TestCaseService,
    private testCaseResultService: TestCaseResultService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private router: Router
    ) {
    this.form = this.fb.group({
      user_num: ['', Validators.required], // Default value set to 10
      host: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.updateServiceStatus();
    this.startStatsUpdate();
    this.getTestCaseInfo();
  }

  getTestCaseInfo() {
    this.route.params.subscribe(params => {
      this.testCaseId = params['id'];

      if (this.testCaseId) {
        this.testCaseService.getTestCaseById(this.testCaseId).subscribe((data: any) => {
          this.testCase = data;
          this.scenarioId = this.testCase.scenario_id
          this.testCaseName = this.testCase.name
        });

      } else {
        // Handle invalid or missing project ID
      }
    });
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

  async onStartTest(): Promise<void> {
    if (this.form.valid) {
      this.isTesting = true;
      this.showResults = true;
      const { user_num, host } = this.form.value;

      // Split user_num string into an array of numbers
      const userNums = user_num.split(',').map((num: string) => parseInt(num.trim()));

      this.individualTestResults = [];

      for (const num of userNums) {
        await this.runTest(num, host);
      }

      this.isTesting = false;
    }
  }

  async runTest(user_num: number, host: string): Promise<void> {
    return new Promise((resolve) => {
      const normalizedHost = host.endsWith('/') ? host.slice(0, -1) : host;
      this.fullPath = normalizedHost;
      this.spawnRate = Math.max(1, Math.round(user_num * 0.1));

      this.currentTestUrl = this.fullPath;
      this.userNum = user_num;
      this.locustService.startLoadTest(user_num, this.spawnRate, this.fullPath).subscribe(response => {
        this.isTesting = true; // Activate spinner

        // Polling interval to check if the current number of users matches the target
        const checkUsersInterval = setInterval(() => {
          this.locustService.getRealTimeStats().subscribe(stats => {
            this.currentUsers = stats.user_count;

            if (this.currentUsers >= user_num) {
              clearInterval(checkUsersInterval);
              this.stopTestAndFetchStats(this.testCaseName, user_num, () => {
                this.isTesting = false; // Deactivate spinner once test is complete
                resolve();
              });
            }
          });
        }, 2000); // Check every 2 seconds
      });
    });
  }


  private updateCurrentUsers(): void {
    this.locustService.getRealTimeStats().subscribe(stats => {
      this.currentUsers = stats.user_count; // Update the number of current users
    });
  }

  private stopTestAndFetchStats(path: string, user_num: number, resolve: () => void): void {
    this.locustService.stopLoadTest().subscribe(stopResponse => {
      this.locustService.getStats().subscribe(stats => {
        this.processStats(stats, path, user_num);
        resolve();
      });
    });
  }

  processStats(stats: any, path: string, user_num: number): void {
    const filteredStats = stats.stats.filter((stat: Stat) => stat.name !== 'Aggregated');
    filteredStats.forEach((stat: Stat) => {
      stat.name = path;
      stat.user_num = user_num;

      // Round the decimal numbers to the nearest integer
      stat.avg_response_time = Math.round(stat.avg_response_time);
      stat.avg_content_length = Math.round(stat.avg_content_length);
      stat.current_rps = Math.round(stat.current_rps);

    });

    this.individualTestResults.push(...filteredStats);
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
    });
  }

  updateServiceStatus(): void {
    this.locustService.checkServiceStatus().subscribe({
      next: (response) => this.serviceStatus = response.status,
      error: () => this.serviceStatus = 'down'
    });
  }

  saveTestResults(): void {
    if (this.form.valid) {
      // Prepare the form data
      const { user_num, host } = this.form.value;
      const formData = {
        user_num: user_num,
        spawn_rate: this.spawnRate,
        host: this.fullPath
      };

      // Updating an existing test case
      this.testCaseService.updateTestCase(formData, this.testCaseId).subscribe({
        next: (response) => {
          // Handle successful update
        },
        error: (error) => {
          // Handle update error
          this.alertMessage = error.error.message;
          this.alertType = 'error';
          window.scrollTo(0, 0); // Scroll to the top of the window
        }
      });
    }

    this.individualTestResults.forEach(result => {
      // Round the values before saving
      result.avg_response_time = Math.round(result.avg_response_time);
      result.avg_content_length = Math.round(result.avg_content_length);
      result.current_rps = Math.round(result.current_rps);

      this.testCaseResultService.addTestCaseResult({...result, testCaseId: this.testCaseId}).subscribe({
        next: (response) => {
          // Redirect to index page with success message
          this.alertService.setAlert('Test Case created successfully', 'success');
          this.router.navigate(['/scenario/show/', this.scenarioId]);
        },
        error: (error) => {
          // Handle individual result save error
          this.alertMessage = error.error.message;
          this.alertType = 'error';
          window.scrollTo(0, 0); // Scroll to the top of the window
        }
      });
    });
  }
}
