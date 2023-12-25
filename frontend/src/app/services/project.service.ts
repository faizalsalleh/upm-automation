import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private baseUrl = 'http://localhost:3000/api/project';

  constructor(private http: HttpClient) { }

  addProject(projectData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/add`, projectData);
  }

  getAllProjects(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  getProjectById(projectId: string): Observable<any> {
    console.log('projectId in project.service.ts:', projectId);
    return this.http.get<any>(`${this.baseUrl}/${projectId}`);
  }

  getScenariosForProject(projectId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/scenario/${projectId}`);
  }
}
