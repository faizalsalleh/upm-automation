import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TestCaseService {
  private baseUrl = 'http://localhost:3000/api/testcase';

  constructor(private http: HttpClient) { }

  addTestCase(testCaseData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/add`, testCaseData);
  }

  updateTestCase(testCaseData: any, testCaseId: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/update/${testCaseId}`, testCaseData);
  }

  getAllTestCases(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  getTestCaseById(testCaseId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${testCaseId}`);
  }

  addAllTestCaseResults(testCaseResults: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/result/add`, testCaseResults);
  }

  // getAllTestCaseResults(testCaseId: string): Observable<any[]> {
  //   return this.http.get<any[]>(`${this.baseUrl}/result/${testCaseId}`);
  // }

}
