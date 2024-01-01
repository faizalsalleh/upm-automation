import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

// Define the structure of the stats object as per your API response
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
  user_num: number;
  ninetieth_response_time: number;
  ninety_ninth_response_time: number;
  num_failures: number;
  num_requests: number;
  safe_name?: string;
}

interface StatsResponse {
  stats: Stat[];
  // Add other properties from the response if needed
}

@Injectable({
  providedIn: 'root'
})
export class LocustService {

  private baseUrl = 'http://localhost:8089';

  constructor(private http: HttpClient) { }

  getRealTimeStats(): Observable<any> {
    return this.http.get(`${this.baseUrl}/stats/requests`).pipe(
      tap(data => console.log('Fetched stats:', data)),
      catchError(this.handleError)
    );
  }

  startLoadTest(userCount: number, spawnRate: number, host: string): Observable<any> {
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
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error(errorMessage));
  }

  checkServiceStatus(): Observable<{ status: 'running' | 'down' }> {
    return this.http.get(`${this.baseUrl}/stats/requests`).pipe(
      map(() => ({ status: 'running' as 'running' })),
      catchError(() => of({ status: 'down' as 'down' }))
    );
  }

}
