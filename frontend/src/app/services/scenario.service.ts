import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScenarioService {
  private baseUrl = 'http://localhost:3000/api/scenario';

  constructor(private http: HttpClient) { }

  addScenario(scenarioData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/add`, scenarioData);
  }

  getAllScenarios(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  getScenarioById(scenarioId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${scenarioId}`);
  }

  getTestCasesForScenario(scenarioId: string): Observable<any[]> {
    console.log('scenarioId in scenario.service.ts:', scenarioId);

    return this.http.get<any[]>(`${this.baseUrl}/testcase/${scenarioId}`);
  }

}
