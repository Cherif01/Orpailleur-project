import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { LINK_BASE, LINK_BASE_CLIENT, BASE_URL } from "../config"
@Injectable({
  providedIn: 'root'
})
export class ApiserviceService {

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) { }

  // CREATE
  create(api: string, suffixURL: string, data: any): Observable<any> {
    // console.log(data);
    return this.http.post(`${BASE_URL}${api}/${suffixURL}`, data);
  }

  // READ GLOBAL
  LIST_BY_ID(api: string, suffixUrl: string, id: any) {
    let params = {
      params: {
        id: id
      },
    }
    return this.http.get<any[]>(`${BASE_URL}${api}/${suffixUrl}`, params);
  }

  // READ GLOBAL
  LIST(api: string, suffixUrl: string, table_name: string) {
    let params = {
      params: {
        table: table_name
      },
    }
    return this.http.get<any[]>(`${BASE_URL}${api}/${suffixUrl}/`, params);
  }

  LIST_SEARCH(api: string, suffixUrl: string, table_name: string,data: any) {
    let params = {
      params: {
        table: table_name,
        startDate: data.startDate,
        endDate: data.endDate
      },
    }
    return this.http.get<any[]>(`${BASE_URL}${api}/${suffixUrl}/`, params);
  }

  // READ GLOBAL
  LIST_ALL_PRECIS(api: string, suffixUrl: string) {
    return this.http.get<any[]>(`${BASE_URL}${api}/${suffixUrl}/`);
  }

  // READ
  GetAllByName(api: string, suffixUrl: string, code: number) {
    let params = {
      params: {
        code: code
      },
    }
    return this.http.get<any[]>(`${BASE_URL}${api}/${suffixUrl}/`, params);
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

  // READ
  GetAllByNamePoids(api: string, suffixUrl: string, poids: number, idFixing: number) {
    let params = {
      params: {
        idFixing: idFixing,
        poids: poids
      },
    }
    return this.http.get<any[]>(`${BASE_URL}${api}/${suffixUrl}/`, params);
  }
  // Config
  GetAllByNamePoids_(api: string, suffixUrl: string, idFixing: number) {
    let params = {
      params: {
        idFixing: idFixing
      },
    }
    return this.http.get<any[]>(`${BASE_URL}${api}/${suffixUrl}/`, params);
  }

  // UPDATE
  // UPDATE ACHAT

  Update(api: string, suffixUrl: string, data: any) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any[]>(`${BASE_URL}${api}/${suffixUrl}`, data);
  }


  UpdateItem(api: string, suffixUrl: string, data: any) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<any[]>(`${BASE_URL}${api}/${suffixUrl}/${data.id}/`, data)
  }

  // GET ONE ALL
  getOneById(api: string, suffixUrl: string, id_lot: string, tableName: string) {
    const url = `${BASE_URL}${api}/${suffixUrl}/${id_lot}/`;
    let params = {
      params: {
        id: id_lot,
        table: tableName
      },
    }
    return this.http.get<any[]>(url, params)
  }

  // GET
  getUnique(api: string, suffixUrl: string, id_: any) {
    const url = `${BASE_URL}${api}/${suffixUrl}/${id_}/`;
    let params = {
      params: {
        id: id_
      },
    }
    return this.http.get<any[]>(url, params)
  }


  // GET
  getByName(api: string, suffixUrl: string, name: any) {
    const url = `${BASE_URL}${api}/${suffixUrl}/name`;
    let params = {
      params: {
        name: name
      },
    }
    return this.http.get<any[]>(url, params)
  }

  // GET
  getList_(api: string, suffixUrl: string) {
    const url = `${BASE_URL}${api}/${suffixUrl}`;
    return this.http.get<any[]>(url)
  }

  getList(api: string, suffixUrl: string) {
    let params = new HttpParams().set('sort', 'desc');
    return this.http.get<any[]>(`${BASE_URL}${api}/${suffixUrl}/`);
  }

  // Liste fournisseur
  getFournisseur(): Observable<any> {
    return this.http.get(`${BASE_URL}${LINK_BASE}/fournisseur/`)
  }


  // GET POST BY INTERVALLE
  getIntervalle(api: string, suffixUrl: string, data: any): Observable<any> {
    // console.log(data);
    const url = `${BASE_URL}${api}/${suffixUrl}`;
    return this.http.post(url, data)
  }


// Add Fournisseur
  clientPost(data: any): Observable<any> {
    // console.log(data);
    return this.http.post(`${BASE_URL}${LINK_BASE_CLIENT}/client/`, data)
  }


  // Add Achat _INIT_
  achatAddPost(data: any): Observable<any> {
    // console.log(data);
    return this.http.post(`${BASE_URL}${LINK_BASE}/achat/`, data)
  }

}
