import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../../../services/project.service';
import { Location } from '@angular/common';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-project-show',
  templateUrl: './project-show.component.html',
  styleUrls: ['./project-show.component.scss']
})
export class ProjectShowComponent implements OnInit {
  project: any;
  scenarios: any[] = [];
  alertMessage: string = '';
  alertType: 'error' | 'info' | 'warning' | 'success' = 'info';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private alertService: AlertService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const projectId = params['id'];
      console.log('projectId in project-show.component.ts:', projectId);

      if (projectId) {
        this.projectService.getProjectById(projectId).subscribe((data: any) => {
          this.project = data;
          console.log('Project data:', this.project);
        });

        this.projectService.getScenariosForProject(projectId).subscribe((data: any[]) => {
          this.scenarios = data;
          console.log('Scenarios data:', this.scenarios);
        });
      } else {
        // Handle invalid or missing project ID
      }
    });
  }

  deleteProject(projectId: number) {
    // Implement project deletion logic
  }

  goBack(): void {
    this.location.back();
  }

}
