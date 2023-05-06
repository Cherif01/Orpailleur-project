import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_URL, LINK_BASE, T_ACHAT, T_ITEMS } from 'src/app/config';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {

  constructor(private http: HttpClient) { }

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

  // UPDATE ACHAT
  mettreAJourRessource(ressourceID: any) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${BASE_URL}api/achat/${ressourceID.id}/`;
    return this.http.put(url, ressourceID, { headers });
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

  // Achat
  getPurchaseOnline(body: any) {
    let ID_F = body;
    let httpParams = new HttpParams().set('id_fournisseur', ID_F)
    return this.http.get<any[]>(BASE_URL.concat(LINK_BASE, "/", "achat", "/",), {
      params: httpParams,
    })
  }

  getListePurchase(body: any) {
    let startDate = body?.start?.getTime();
    let endDate =new Date( (new Date().setDate(body?.end?.getDate() + 1))).setHours(0,0,0,0);
    let httpParams = new HttpParams()
      .set('startDate', startDate?.toString())
      .set('endDate', (body.end) ? endDate?.toString() : '')
    return this.http.get<any[]>(BASE_URL.concat(LINK_BASE, "/", "achat", "/",), {
      params: httpParams,
    })
  }

  deleteItems(id:any):Observable<boolean> {
    return this.http.delete<boolean>(BASE_URL.concat(LINK_BASE, "/", "achat_items", "/",id))
  }


}
