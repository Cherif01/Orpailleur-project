import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_URL, LINK_BASE, T_CompteF, T_FOURNISSEUR, T_ITEMS } from '../config';

@Injectable({
  providedIn: 'root'
})
export class OperationsService {

  constructor(private http:HttpClient) { }

  // COURS DE LORS
  getGoldPrice(api: string) {
    return this.http.get<any>(api);
  }

  // Add
  Add(data: any, api: string, suffixUrl: string) : Observable<any> {
    // console.log(data);
    return this.http.post(`${BASE_URL}${api}/${suffixUrl}/`, data);
  }

  getList(api:string,suffixUrl:string){
    let params = new HttpParams().set('sort', 'desc');
    return this.http.get<any[]>(`${BASE_URL}${api}/${suffixUrl}`, {params});
  }

  getItemsOfAchat(api: string, suffixUrl: string, id_achat: any) {
    const url = `${BASE_URL}${api}/${suffixUrl}/${id_achat}/achat_items_by_achat/`;
    return this.http.get<any[]>(url)
  }

  getDetailPurchaseItems(api: string, suffixUrl: string, id_achat: any) {
    // api/achat_items/28/get_achat_items_by_achat/
    const url = `${BASE_URL}${api}/${suffixUrl}/${id_achat}/get_achat_items_by_achat/`;
    return this.http.get<any[]>(url)
  }

  getLotContentById(api: string, suffixUrl: string, id_lot: any) {
    const url = `${BASE_URL}${api}/${suffixUrl}/${id_lot}/get_achat_items/`;
    return this.http.get<any[]>(url)
  }

  // GET CLAUSE
  getByClause(idClause: any) {
    return this.http.get<any[]>(BASE_URL.concat(LINK_BASE, "/", T_CompteF, "/?fournisseur=", idClause))
  }

  getElementById(api: string, suffixUrl: string, id: number): Observable<any> {
    const url = `${BASE_URL}${api}/${suffixUrl}/${id}`;
    return this.http.get<any>(url);
  }
}
