import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

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
  ninetieth_response_time: number;
  ninety_ninth_response_time: number;
  num_failures: number;
  num_requests: number;
  safe_name: string;
}

interface StatsResponse {
  stats: Stat[];
}

@Injectable({
  providedIn: 'root'
})
export class LocustService {

  private baseUrl = '/api'; // Updated to use the '/api' prefix

  constructor(private http: HttpClient) { }

  getRealTimeStats(): Observable<any> {
    return this.http.get(`${this.baseUrl}/stats/requests`).pipe(
      tap(data => console.log('Fetched stats:', data)),
      catchError(this.handleError)
    );
  }

  isTestRunning(): Observable<boolean> {
    return this.http.get<{running: boolean}>(`${this.baseUrl}/test_status`).pipe(
      map(response => response.running),
      catchError(() => of(false)) // Assume not running if there's an error
    );
  }

  startLoadTest(userCount: number, spawnRate: number, host: string, duration: string): Observable<any> {
    const body = `user_count=${userCount}&spawn_rate=${spawnRate}&host=${host}`;
    const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
    return this.http.post(`${this.baseUrl}/swarm`, body, { headers: headers }).pipe(
      catchError(this.handleError)
    );
}


  stopLoadTest(): Observable<any> {
    return this.http.get(`${this.baseUrl}/stop`).pipe(
        catchError(this.handleError)
    );
  }

  getStats(): Observable<StatsResponse> {
    return this.http.get<StatsResponse>(`${this.baseUrl}/stats/requests`).pipe(
      catchError(this.handleError)
    );
  }

  resetStats(): Observable<any> {
    return this.http.get(`${this.baseUrl}/stats/reset`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Something went wrong; please try again later.';
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(`Backend returned code ${error.status}, body was: ${error.error}`);
    }
    return throwError(() => new Error(errorMessage));
  }

  checkServiceStatus(): Observable<{ status: 'running' | 'down' }> {
    return this.http.get(`${this.baseUrl}/stats/requests`).pipe(
      map(() => ({ status: 'running' as 'running' })),
      catchError(() => of({ status: 'down' as 'down' }))
    );
  }

}
