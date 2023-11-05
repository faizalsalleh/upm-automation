import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocustService {

  private baseUrl = 'http://localhost:8089';

  constructor(private http: HttpClient) { }

  startLoadTest(userCount: number, spawnRate: number, host: string): Observable<any> {
    const body = {
      user_count: userCount,
      spawn_rate: spawnRate,
      host: host
    };
    return this.http.post(`${this.baseUrl}/swarm`, body);
  }

  stopLoadTest(): Observable<any> {
    return this.http.post(`${this.baseUrl}/stop`, {});
  }

  getStats(): Observable<any> {
    return this.http.get(`${this.baseUrl}/stats/requests`);
  }

  resetStats(): Observable<any> {
    return this.http.get(`${this.baseUrl}/stats/reset`);
  }
}
