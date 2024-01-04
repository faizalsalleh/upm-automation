import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import { AlertService } from '../../services/alert.service';
import Chart, { ChartOptions } from 'chart.js';

interface TestCase {
  _id: string;
  name: string;
  // Add any additional properties you expect to receive
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  avgResponseTimeData: any;
  alertMessage: string = '';
  alertType: 'error' | 'info' | 'warning' | 'success' = 'info';
  testCases: TestCase[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dashboardService: DashboardService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const scenarioId = params['id'];
      if (scenarioId) {
        this.fetchTestCases(scenarioId);
      } else {
        // Handle invalid or missing project ID
      }
    });

    const alertInfo = this.alertService.getAlert();
    if (alertInfo) {
      this.alertMessage = alertInfo.message;
      this.alertType = alertInfo.type;
      this.alertService.clearAlert();
    }
  }

  ngAfterViewInit(): void {
    // The chart initialization is now moved to the fetchChartData method
  }

  fetchTestCases(scenarioId: string): void {
    // Add a service call here to fetch the test cases
    // This is a pseudo code for illustration. Replace with your actual service call
    this.dashboardService.getTestCases(scenarioId).subscribe(testCases => {
      this.testCases = testCases;
      this.fetchChartData(scenarioId);
    });
  }

  fetchChartData(scenarioId: string): void {
    this.dashboardService.getAvgResponseTimeBarChart(scenarioId).subscribe(datasets => {
      this.avgResponseTimeData = {
        labels: this.testCases.map(tc => tc.name),
        datasets: datasets
      };
      this.initChart();
    });
  }

  initChart(): void {
    const canvas = <HTMLCanvasElement>document.getElementById('artChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const barChartOptions: ChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 2000,
        easing: 'easeOutBounce',
      },
      legend: {
        display: true
      },
      scales: {
        xAxes: [{
          gridLines: {
            display: false
          }
        }],
        yAxes: [{
          gridLines: {
            display: false
          }
        }]
      }
    };

    new Chart(ctx, {
      type: 'bar',
      data: this.avgResponseTimeData,
      options: barChartOptions
    });
  }
}
