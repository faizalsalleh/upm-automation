import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import { AlertService  } from '../../services/alert.service';
import Chart, { ChartOptions } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  project: any;
  alertMessage: string = '';  // Initialize as empty string
  alertType: 'error' | 'info' | 'warning' | 'success' = 'info';  // Keep the default type

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dashboardService: DashboardService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    const alertInfo = this.alertService.getAlert();
    this.alertMessage = alertInfo.message;
    this.alertType = alertInfo.type;

    // Clear the alert message in the service after retrieving it
    this.alertService.clearAlert();

    this.route.params.subscribe(params => {
      const projectId = params['id'];

      if (projectId) {

        /* this.dashboardService.getDashboard(projectId).subscribe((projectData: any) => {
          this.project = projectData;
        }); */



      } else {
        // Handle invalid or missing project ID
      }
    });
  }

  ngAfterViewInit(): void {
    this.initChart();
  }

  initChart(): void {
    const canvas = document.getElementById('artChart') as HTMLCanvasElement;
    if (!canvas) return; // Check if the canvas element is found

    const ctx = canvas.getContext('2d');
    if (!ctx) return; // Check if the context is not null

    const areaChartData = {
      labels: ['TS1-01 - Home', 'TS1-02 - Student'],
      datasets: [
        {
          label: '1 User',
          fill: false,
          backgroundColor: 'rgb(255, 87, 46)',
          borderColor: 'rgb(255, 87, 45)',
          pointRadius: 0, // Set to 0 instead of false
          pointColor: '#8f59ff',
          pointStrokeColor: 'rgb(144, 91, 255)',
          pointHighlightFill: '#fff',
          pointHighlightStroke: 'rgb(144, 91, 255)',
          data: [28, 48, 40, 19, 86, 27, 90, 0, 0, 0, 0, 0]
        },
        {
          label: '5 User',
          fill: false,
          backgroundColor: 'rgb(0, 192, 239)',
          borderColor: 'rgb(0, 192, 238)',
          pointRadius: 0, // Set to 0 instead of false
          pointColor: '#8f59ff',
          pointStrokeColor: 'rgb(144, 91, 255)',
          pointHighlightFill: '#fff',
          pointHighlightStroke: 'rgb(144, 91, 255)',
          data: [65, 59, 80, 81, 56, 55, 40, 0, 0, 0, 0, 0]
        }
      ]
    };

    const barChartOptions: ChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 2000, // Duration in milliseconds
        easing: 'easeOutBounce', // Predefined easing option
      },
      legend: {
        display: true // This will show/hide the legend
      },
      scales: {
        xAxes: [{
          gridLines: {
            display: false // This will remove the grid lines for the x-axis
          }
        }],
        yAxes: [{
          gridLines: {
            display: false // This will remove the grid lines for the y-axis
          }
        }]
      }
    };

    new Chart(ctx, {
      type: 'bar',
      data: areaChartData,
      options: barChartOptions
    });
  }

}

