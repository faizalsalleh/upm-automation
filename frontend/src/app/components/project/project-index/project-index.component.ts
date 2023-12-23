import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../../services/project.service';

@Component({
  selector: 'app-project-index',
  templateUrl: './project-index.component.html',
  styleUrls: ['./project-index.component.scss']
})
export class ProjectIndexComponent implements OnInit {
  projects: any[] = [];

  constructor(private projectService: ProjectService) { }

  ngOnInit(): void {
    this.projectService.getAllProjects().subscribe({
      next: (data) => this.projects = data,
      error: (error) => console.error('Error fetching projects', error)
    });
  }
}
