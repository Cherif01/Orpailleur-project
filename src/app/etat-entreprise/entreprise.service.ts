import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_URL, LINK_BASE, T_CompteF, T_FOURNISSEUR, T_ITEMS } from '../config';

@Injectable({
  providedIn: 'root'
})
export class EntrepriseService {

  constructor(private http: HttpClient) { }

  // Add
  Add(data: any, api: string, suffixUrl: string) : Observable<any> {
    // console.log(data);
    return this.http.post(`${BASE_URL}${api}/${suffixUrl}/`, data);
  }

  // LIST REQ
  getList(api:string,suffixUrl:string){
    // let params = new HttpParams().set('sort', 'desc');
    return this.http.get<any[]>(`${BASE_URL}${api}/${suffixUrl}`);
  }
  // LIST REQ
  getList2(api:string,suffixUrl:string){
    let params = new HttpParams().set('sort', 'desc');
    return this.http.get<any[]>(`${BASE_URL}${api}/${suffixUrl}`, {params});
  }

  getInfoStockAPI(api: string, suffixUrl: string, idUser: any) {
    const url = `${BASE_URL}${api}/${suffixUrl}/${idUser}/situation_stock/`;
    return this.http.get<any[]>(url)
  }

  getAllByClause(api: string, suffixUrl: string, field: any, value: any) {
    const options = {
      // headers: new HttpHeaders().set('Accept', 'application/json'),
      params: new HttpParams().set(field, value)
    };
    const url = `${BASE_URL}${api}/${suffixUrl}`;
    return this.http.get<any>(url, options)
  }

  getElementById(api: string, suffixUrl: string, id: number): Observable<any> {
    const url = `${BASE_URL}${api}/${suffixUrl}/${id}`;
    return this.http.get<any>(url);
  }
}
