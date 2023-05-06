import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SelectFilterService {

  constructor() { }
  filterMethodWithFirstNameAndLastName(values: any, ControleValue: any) {
    if (!values) {
      return;
    }

    let search = ControleValue;
    if (!search) {
      // this.filterCaegories.next(values);
      return values;
    } else {
      search = search.toLowerCase();
    }

    // this.filterCaegories.next(
    //   values.filter((value: any) => value.name.toLowerCase().indexOf(search) > -1)
    // );
    return values.filter((value: any) =>
      value?.telephone.toString().includes(search) || value.prenom?.toLowerCase()?.indexOf(search) > -1 ||
      (value.nom?.toLowerCase()?.indexOf(search) > -1)


    );
  }
}
