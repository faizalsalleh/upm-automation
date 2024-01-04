import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from '../../../services/project.service';
import { AlertService  } from '../../../services/alert.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-project-index',
  templateUrl: './project-index.component.html',
  styleUrls: ['./project-index.component.scss']
})
export class ProjectIndexComponent implements OnInit {
  projects: any[] = [];
  alertMessage: string = '';  // Initialize as empty string
  alertType: 'error' | 'info' | 'warning' | 'success' = 'info';  // Keep the default type

  constructor(
    private projectService: ProjectService,
    private alertService: AlertService,
    private router: Router,
    private location: Location
    ) { }

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    const alertInfo = this.alertService.getAlert();
    this.alertMessage = alertInfo.message;
    this.alertType = alertInfo.type;
    console.log('Alert Message:', this.alertMessage);

    // Clear the alert message in the service after retrieving it
    this.alertService.clearAlert();

    this.projectService.getAllProjects().subscribe({
      next: (data) => this.projects = data,
      error: (error) => console.error('Error fetching projects', error)
    });
  }

  goBack(): void {
    this.location.back();
  }
}
