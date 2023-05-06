import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LINK_BASE, LINK_BASE_CLIENT, BASE_URL } from "../config"

@Injectable({
  providedIn: 'root'
})
export class BanqueService {

  constructor(private http: HttpClient) { }

   // Add
   Add(data: any, api: string, suffixUrl: string) : Observable<any> {
    // console.log(data);
    return this.http.post(`${BASE_URL}${api}/${suffixUrl}/`, data);
  }

  // LIST
  getList(api:string,suffixUrl:string){
    return this.http.get<any[]>(`${BASE_URL}${api}/${suffixUrl}/`);
  }

}
