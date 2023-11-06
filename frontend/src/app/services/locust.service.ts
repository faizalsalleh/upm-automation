import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LocustService {

  private baseUrl = 'http://localhost:8089';

  constructor(private http: HttpClient) { }

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

  getStats(): Observable<any> {
    return this.http.get(`${this.baseUrl}/stats/requests`).pipe(
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
    if (error.error && error.error.message) {
        console.error('An error occurred:', error.error.message);
        errorMessage = error.error.message;
    }
    return throwError(() => new Error(errorMessage));
  }
}
