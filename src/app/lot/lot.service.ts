import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { LINK_BASE, LINK_BASE_CLIENT, BASE_URL, T_ITEMS } from "../config"

@Injectable({
  providedIn: 'root'
})
export class LotService {

  constructor(private http: HttpClient) { }

  getList(api: string, suffixUrl: string) {
    let params = new HttpParams().set('sort', 'desc');
    return this.http.get<any[]>(`${BASE_URL}${api}/${suffixUrl}`, { params });
  }

  create(api: string, suffix: string, data: any) {
    let url: string
    // api = name_dossier::lot
    // suffixe = name_fonction: create.php
    // url = "http://localhost/limanaya/api/lot/create.php"
    return this.http.post(`${BASE_URL}${api}/${suffix}`, data);
  }

  LIST(api: string, suffixUrl: string, table_name: string) {
    // http://localhost/limanaya/api/lot/read.php
    let params = {
      params: {
        table: table_name
      },
    }
    return this.http.get<any[]>(`${BASE_URL}${api}/${suffixUrl}/`, params);
  }

  // GET ONE
  getOneById(api: string, suffixUrl: string, idSend: string, tableName: string) {
    const url = `${BASE_URL}${api}/${suffixUrl}/${idSend}/`;
    let params = {
      params: {
        id: idSend,
        table: tableName
      },
    }
    return this.http.get<any[]>(url, params)
  }

  // GET ONE
  getOneByIdSimple(api: string, suffixUrl: string, idSend: string) {
    const url = `${BASE_URL}${api}/${suffixUrl}/`;
    let params = {
      params: {
        id: idSend
      },
    }
    return this.http.get<any[]>(url, params)
  }


  // Liste Attribution
  getAttribution(suffixUrl: string): Observable<any> {
    return this.http.get(`${BASE_URL}${suffixUrl}/`)
  }


  UpdateItem(api: string, suffixUrl: string, data: any) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any[]>(`${BASE_URL}${api}/${suffixUrl}`, data);
  }

  // /api/achat/id_lot/achat_by_lot/
  getAchatOfLot(api: string, suffixUrl: string, id_lot: any) {
    const url = `${BASE_URL}${api}/${suffixUrl}/${id_lot}/achat_by_lot/`;
    return this.http.get<any[]>(url)
  }

  // Add Fournisseur
  Add(api: string, suffixURL: string, data: any): Observable<any> {
    // console.log(data);
    return this.http.post(`${BASE_URL}${api}/${suffixURL}/`, data)
  }

  getItemsOfAchat(api: string, suffixUrl: string, id_achat: any) {
    const url = `${BASE_URL}${api}/${suffixUrl}/${id_achat}/achat_items_by_achat/`;
    return this.http.get<any[]>(url)
  }

  getLotContentById(api: string, suffixUrl: string, id_lot: any) {
    const url = `${BASE_URL}${api}/${suffixUrl}/${id_lot}/get_achat_items/`;
    return this.http.get<any[]>(url)
  }



  updateRowsPurchase(purchase: any) {
    return this.http.put<any[]>(BASE_URL.concat(LINK_BASE, `/achat_items/${purchase.id}/`), purchase)
  }


  updateRows(data: any) {
    return this.http.put<any[]>(BASE_URL.concat(LINK_BASE, `/achat_items/${data.id}/`), data)
  }

  // Add Lot
  PostElement(api: string, suffixUrl: string, data: any): Observable<any> {
    // console.log(data);
    return this.http.post(`${BASE_URL}${api}/${suffixUrl}/`, data)
  }

  // UPDATE
  updateResource(api: string, suffixUrl: string, data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put(`${BASE_URL}${api}/${suffixUrl}/`, data, { headers });
  }
}
