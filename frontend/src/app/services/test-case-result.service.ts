import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TestCaseResultService {
  private baseUrl = 'http://localhost:3000/api/testcase/result';

  constructor(private http: HttpClient) { }

  addTestCaseResult(testCaseResultData: any): Observable<any> {
    console.log('testCaseResultData at Services: ', testCaseResultData);
    return this.http.post(`${this.baseUrl}/add`, testCaseResultData);
  }

  getAllTestCaseResults(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  getTestCaseResultById(testCaseResultId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${testCaseResultId}`);
  }

  getAllTestCaseResultsByTestCaseId(testCaseId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/for/${testCaseId}`);
  }

  deleteTestCaseResult(testCaseResultId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/delete/${testCaseResultId}`);
  }

  deleteAllResultsByTestCaseId(testCaseId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/delete/for/${testCaseId}`);
  }

}
