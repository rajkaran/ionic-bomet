import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommunicateServerService {

  constructor(private http: HttpClient) { }

  fetch(url: string){
    return this.http.get(environment.api_url+url);
  }

  fetchFromDynamicDestination(url: string){
    return this.http.get(url);
  }

  store(url: string, data: any){
    return this.http.post(environment.api_url+url, data);
  }

  patch(url: string, data: any){
    return this.http.patch(environment.api_url+url, data);
  }

  delete(url: string){
    return this.http.delete(environment.api_url+url);
  }

}
