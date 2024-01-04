import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Define an interface that matches the structure of your results
interface AvgResponseTimeResult {
  _id: string;
  averageResponseTime: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private baseUrl = 'http://localhost:3000/api/dashboard';

  constructor(private http: HttpClient) { }

  getAvgResponseTimeBarChart(scenarioId: string): Observable<any> {
    return this.http.get<AvgResponseTimeResult[]>(`${this.baseUrl}/getAvgResponseTimeBarChart/${scenarioId}`)
      .pipe(
        map(results => {
          // Now 'result' parameter is typed
          return results.map((result: AvgResponseTimeResult) => {
            // Assume '_id' contains the user count
            const userCount = parseInt(result._id, 10);
            return {
              label: `${userCount} User`,
              data: [result.averageResponseTime],
              backgroundColor: this.getBackgroundColor(userCount),
              borderColor: this.getBorderColor(userCount),
            };
          });
        })
      );
  }

  // Example color definitions
  private getBackgroundColor(userCount: number): string {
    // Define color logic based on userCount here
    // For example:
    return userCount <= 10 ? 'rgba(0, 123, 255, 0.5)' : 'rgba(255, 193, 7, 0.5)';
  }

  private getBorderColor(userCount: number): string {
    // Define border color logic based on userCount here
    // For example:
    return userCount <= 10 ? 'rgba(0, 123, 255, 1)' : 'rgba(255, 193, 7, 1)';
  }

  // Add the missing getTestCases method if don't have it yet
  getTestCases(scenarioId: string): Observable<TestCase[]> {
    // Replace with the actual endpoint to get test cases
    return this.http.get<TestCase[]>(`${this.baseUrl}/testcases/${scenarioId}`);
  }
}

// Define TestCase interface to match backend data structure
export interface TestCase {
  _id: string;
  name: string;
}
