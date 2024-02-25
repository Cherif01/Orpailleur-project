import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_URL, LINK_BASE, T_ACHAT, T_ITEMS } from 'src/app/config';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {

  constructor(private http: HttpClient) { }

  // GET ONE
  getOneById(api: string, suffixUrl: string, idF: string) {
    const url = `${BASE_URL}${api}/${suffixUrl}/${idF}/`;
    let params = {
      params: {
        id: idF,
      },
    }
    return this.http.get<any[]>(url, params)
  }

  getElementById(api: string, suffixUrl: string, id: number): Observable<any> {
    const url = `${BASE_URL}${api}/${suffixUrl}/${id}`;
    return this.http.get<any>(url);
  }

  /**
   *
   * @param purchase
   * @returns
   */
  updateRowsPurchase(purchase:any) {
    return this.http.put<any[]>(BASE_URL.concat(LINK_BASE, `/achat_items/${purchase.id}/`), purchase)
  }

  situationMonetaire(api: string, suffixUrl: string, id: number): Observable<any> {
    const url = `${BASE_URL}${api}/${suffixUrl}/${id}/situation_fournisseur/`;
    return this.http.get<any>(url);
  }

  // UPDATE ACHAT
  mettreAJourRessource(ressourceID: any) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${BASE_URL}api/achat/${ressourceID.id}/`;
    return this.http.put(url, ressourceID, { headers });
  }

  // AdD iN LOT ACTIF
  PostElement(api:string, suffixUrl:string, data: any) : Observable<any> {
    // console.log(data);
    return this.http.post(`${BASE_URL}${api}/${suffixUrl}/`, data)
  }

   // UPDATE
   updateRowsPurchase2(api:string, suffixUrl: string, data: any) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put(`${BASE_URL}${api}/${suffixUrl}/`, data, { headers });
  }

   // Add Achat Items
   achatAddItemsPost(data: any) {
    // console.log(data);
    return this.http.post(`${BASE_URL}${LINK_BASE}/achat_items/`, data)
  }

  getList(api:string,suffixUrl:string){
    return this.http.get<any[]>(`${BASE_URL}${api}/${suffixUrl}/`);
  }

  getOneByID_achat(id: any) {
    return this.http.get<any[]>(BASE_URL.concat(LINK_BASE, "/", T_ACHAT, "/?id=", id))
  }

  // getDetailPurchase(slug: any) {
  //   return this.http.get<any[]>(BASE_URL.concat(LINK_BASE, "/", T_ACHAT, "/?slug=", slug))
  // }

  getDetailPurchaseItems(id_achat: any) {
    return this.http.get<any[]>(BASE_URL.concat(LINK_BASE, "/", T_ITEMS, "/?id_achat=", id_achat))
  }
  getItemsOfAchat(api: string, suffixUrl: string, id_achat: any) {
    const url = `${BASE_URL}${api}/${suffixUrl}/${id_achat}/achat_items_by_achat/`;
    return this.http.get<any[]>(url)
  }

  // Achat
  getPurchaseOnline(body: any) {
    let ID_F = body;
    let httpParams = new HttpParams().set('id_fournisseur', ID_F)
    return this.http.get<any[]>(BASE_URL.concat(LINK_BASE, "/", "achat_items", "/",), {
      params: httpParams,
    })
  }


  // READ GLOBAL
  LISTFournisseurAchat(api: string, suffixUrl: string) {
    return this.http.get<any[]>(`${BASE_URL}${api}/${suffixUrl}/`);
  }

  getListePurchase(api: string, suffixUrl: string, table_name: string, body: any) {
    let startDate = body?.start?.getTime();
    let endDate =new Date( (new Date().setDate(body?.end?.getDate() + 1))).setHours(0,0,0,0);
    let httpParams = new HttpParams()
      .set('startDate', startDate?.toString())
      .set('endDate', (body.end) ? endDate?.toString() : '')
    return this.http.get<any[]>(`${BASE_URL}${api}/${suffixUrl}/`), {
      params: httpParams,
    }
  }

  deleteItems(id:any):Observable<boolean> {
    return this.http.delete<boolean>(BASE_URL.concat(LINK_BASE, "/", "achat_items", "/",id))
  }

  delete(api: string, suffixUrl: any, table: string, id:any):Observable<boolean> {
    // return this.http.delete<boolean>(BASE_URL.concat(LINK_BASE, "/", "achat_items", "/",id))

    const url = `${BASE_URL}${api}/${suffixUrl}/${id}/`;
    let params = {
      params: {
        table: table,
        id: id
      },
    }
    return this.http.delete<boolean>(url, params)
  }

  deleteByID(api: string, suffixUrl: any, id:any):Observable<boolean> {
    const url = `${BASE_URL}${api}/${suffixUrl}/${id}/`;
    let params = {
      params: {
        id: id
      },
    }
    return this.http.delete<boolean>(url, params)
  }

}
