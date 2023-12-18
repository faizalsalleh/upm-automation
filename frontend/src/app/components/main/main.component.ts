import { AfterViewInit, Component, OnInit } from '@angular/core';
//import { DynamicScriptLoaderService } from 'src/app/dynamic-script-loader.service';
import Chart, { ChartOptions } from 'chart.js';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})

export class MainComponent implements OnInit, AfterViewInit {

  ngOnInit(): void {
    // Initialization logic if needed
  }

  ngAfterViewInit(): void {
    this.initChart();
  }

  initChart(): void {
    const canvas = document.getElementById('barChart') as HTMLCanvasElement;
    if (!canvas) return; // Check if the canvas element is found

    const ctx = canvas.getContext('2d');
    if (!ctx) return; // Check if the context is not null

    const areaChartData = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      datasets: [
        {
          label: '',
          fill: false,
          backgroundColor: 'rgb(144, 91, 255)',
          borderColor: 'rgb(104, 66, 183)',
          pointRadius: 0, // Set to 0 instead of false
          pointColor: '#8f59ff',
          pointStrokeColor: 'rgb(144, 91, 255)',
          pointHighlightFill: '#fff',
          pointHighlightStroke: 'rgb(144, 91, 255)',
          data: [28, 48, 40, 19, 86, 27, 90, 0, 0, 0, 0, 0]
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
        display: false // This will hide the legend
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
