import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { LINK_BASE, LINK_BASE_CLIENT, BASE_URL, T_ITEMS } from "../config"

@Injectable({
  providedIn: 'root'
})
export class LotService {

  constructor(private http: HttpClient) { }

  getList(api:string,suffixUrl:string){
    return this.http.get<any[]>(`${BASE_URL}${api}/${suffixUrl}/`);
  }

  getDetailPurchaseItems(id_achat: any) {
    return this.http.get<any[]>(BASE_URL.concat(LINK_BASE, "/", T_ITEMS, "/?id_achat=", id_achat))
  }

  updateRowsPurchase(purchase:any) {
    return this.http.put<any[]>(BASE_URL.concat(LINK_BASE, `/achat_items/${purchase.id}/`), purchase)
  }

  // Add Lot
  PostElement(api:string, suffixUrl:string, data: any) : Observable<any> {
    // console.log(data);
    return this.http.post(`${BASE_URL}${api}/${suffixUrl}/`, data)
  }

  // UPDATE
  updateResource(api:string, suffixUrl: string, data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put(`${BASE_URL}${api}/${suffixUrl}/`, data, { headers });
  }

  // postData()
  // Liste Lot
  getLot(api: string, suffixUrl: string): Observable<any> {
    return this.http.get(`${BASE_URL}${api}/${suffixUrl}/`)
  }
  // Liste Attribution
  getAttribution(api: string, suffixUrl: string): Observable<any> {
    return this.http.get(`${BASE_URL}${api}/${suffixUrl}/`)
  }
}