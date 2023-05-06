import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { LINK_BASE,LINK_BASE_CLIENT,BASE_URL} from "../config"
@Injectable({
  providedIn: 'root'
})
export class ApiserviceService {
  // LINK_BASE = 'http://192.168.134.100:8000/api/'
  // LINK_BASE_CLIENT = 'http://192.168.134.100:8000/client_api/'

  constructor(private http: HttpClient) { }

  getList(api:string,suffixUrl:string){
    let params = new HttpParams().set('sort', 'desc');
    return this.http.get<any[]>(`${BASE_URL}${api}/${suffixUrl}/`);
  }

  // Liste fournisseur
  getFournisseur() : Observable<any> {
    return this.http.get(`${BASE_URL}${LINK_BASE}/fournisseur/`)
  }


  // Add Fournisseur
  clientPost(data: any) : Observable<any> {
    // console.log(data);
    return this.http.post(`${BASE_URL}${LINK_BASE_CLIENT}/client/`, data)
  }

  // Add Lot
  lotPost(data: any) : Observable<any> {
    // console.log(data);
    return this.http.post(`${BASE_URL}${LINK_BASE}/arrivage/`, data)
  }

  // Add Achat _INIT_
  achatAddPost(data: any) : Observable<any> {
    // console.log(data);
    return this.http.post(`${BASE_URL}${LINK_BASE}/achat/`, data)
  }

}
