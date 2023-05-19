import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_URL, LINK_BASE, T_CompteF, T_FOURNISSEUR, T_ITEMS } from '../config';

@Injectable({
  providedIn: 'root'
})
export class VendorServiceService {

  constructor(private http: HttpClient) { }


  getList(api: string, suffixUrl: string) {
    return this.http.get<any[]>(`${BASE_URL}${api}/${suffixUrl}/`);
  }

  getAllByClause(api: string, suffixUrl: string, field: any, value: any) {
    const options = {
      headers: new HttpHeaders().set('Accept', 'application/json'),
      params: new HttpParams().set(field, value)
    };
    const url = `${BASE_URL}${api}/${suffixUrl}`;
    return this.http.get<any>(url, options)
  }

  getElementById(api: string, suffixUrl: string, id: number): Observable<any> {
    const url = `${BASE_URL}${api}/${suffixUrl}/${id}`;
    return this.http.get<any>(url);
  }

  // api/fixing_detail/4/get_fixing_by_id/
  infoFixing(api: string, suffixUrl: string, id: number): Observable<any> {
    const url = `${BASE_URL}${api}/${suffixUrl}/${id}/get_fixing_by_id/`;
    return this.http.get<any>(url);
  }

  situationMonetaire(api: string, suffixUrl: string, id: number): Observable<any> {
    const url = `${BASE_URL}${api}/${suffixUrl}/${id}/situation_fournisseur/`;
    return this.http.get<any>(url);
  }

  getDetailPurchaseItems(api: string, suffixUrl: string, id_achat: any) {
    // api/achat_items/28/get_achat_items_by_achat/
    const url = `${BASE_URL}${api}/${suffixUrl}/${id_achat}/get_achat_items_by_achat/`;
    return this.http.get<any[]>(url)
  }

  // UPDATE TRUE ITEmS
  updateRowsPurchase2(api: string, suffixUrl: string, data: any) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put(`${BASE_URL}${api}/${suffixUrl}/${data}/`, { headers });
  }

  updateRows(data: any) {
    return this.http.put<any[]>(BASE_URL.concat(LINK_BASE, `/fournisseur/${data.id}/`), data)
  }


  // UPDATE
  mettreAJourRessource2(ressource: any) {
    const url = `${BASE_URL}api/achat_items/${ressource.id}/`;
    return this.http.put(url, ressource);
  }


  // UPDATE FIXING
  mettreAJourRessource(ressource: any) {
    const url = `${BASE_URL}api/fixing/${ressource.id}/`;
    return this.http.put(url, ressource);
  }

  // Add Fournisseur
  Add(api: string, suffixURL: string, data: any): Observable<any> {
    // console.log(data);
    return this.http.post(`${BASE_URL}${api}/${suffixURL}/`, data)
  }

  // Add Fournisseur
  fournisseurPost(data: any): Observable<any> {
    // console.log(data);
    return this.http.post(`${BASE_URL}${LINK_BASE}/${T_FOURNISSEUR}/`, data)
  }

  // GET CLAUSE
  getByClause(idClause: any) {
    return this.http.get<any[]>(BASE_URL.concat(LINK_BASE, "/", T_CompteF, "/?fournisseur=", idClause))
  }

  // Liste fournisseur
  getFournisseur(): Observable<any> {
    return this.http.get(`${BASE_URL}${LINK_BASE}/${T_FOURNISSEUR}/`)
  }

  // Add COMPTE GNF
  addCompteGNF_FR(data: any): Observable<any> {
    // console.log(data);
    return this.http.post(`${BASE_URL}${LINK_BASE}/compte_fournisseur/`, data)
  }
  // Add COMPTE USD
  addCompteUSD_FR(data: any): Observable<any> {
    // console.log(data);
    return this.http.post(`${BASE_URL}${LINK_BASE}/compte_fournisseur/`, data)
  }
}
