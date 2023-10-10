import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StateMonService {
  private apiUrl = 'https://api.pokemontcg.io/v1/cards';

  constructor(private http: HttpClient) { }

  getCards(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}
