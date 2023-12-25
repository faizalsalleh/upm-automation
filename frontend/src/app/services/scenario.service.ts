import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScenarioService {
  private baseUrl = 'http://localhost:3000/api/scenario';

  constructor(private http: HttpClient) { }

}
