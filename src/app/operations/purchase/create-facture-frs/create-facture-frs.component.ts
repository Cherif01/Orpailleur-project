import { Component, ElementRef, OnInit, ViewChild, PipeTransform, Pipe } from '@angular/core';
import { PurchaseService } from '../purchase.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-create-facture-frs',
  templateUrl: './create-facture-frs.component.html',
  styleUrls: ['./create-facture-frs.component.css']
})

export class CreateFactureFrsComponent implements OnInit {

  @ViewChild('divToPrint') divToPrint: ElementRef | any;
  @ViewChild('head') head: ElementRef | any;
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  displayedColumns: string[] = ["select", "Date", "Fournisseur", "Poids_total", "Fixing", "P_Fixing", "Poids vendu", "Poids_restant", "Discount", "Status"];
  selection = new SelectionModel<any>(true, []);

  title = 'Create Facture'
  idGet: any

  Fixing = this.fb.group({
    id: [, Validators.required],
    created_by: [1, Validators.required]
  })

  AchatL = this.fb.group({
    id: [, Validators.required],
    created_by: [1, Validators.required]
  })
  search = new FormControl();

  constructor(
    private serviceOperation: PurchaseService,
    private activeroute: ActivatedRoute,
    public location: Location,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.search.valueChanges.subscribe(v => {
      this.filterTable(v)
    })
  }
  filterTable(event: any) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue?.trim()?.toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngOnInit() {
    // ID Fournisseur EN GET
    this.idGet = this.activeroute.snapshot.params['id'];
    this.detailFixing()
  }

  // Reset form
  resetForm(form: FormGroup, fields: string[]) {
    fields.forEach(field => {
      form.controls[field].setValue(null);
      form.controls[field].updateValueAndValidity();
    })
  }

  // FIXING POST
  fournisseurName: any = ""
  TabItemsFix: any[] = [];
  infosFix: any = {}
  _TYPE_: any = false
  poidsTotal: number = 0
  carratMoyen: number = 0
  detailFixing() {
    // Le 1 represente l'id du created_by
    this.serviceOperation.getList('api', 'fixing_detail/1/fixing_valide')
      .subscribe({
        next: ((data) => {
          this.dataSource.data = data
          console.log("donnees : ", data);
        }),
        error: (err) => console.log(err)
      })
  }


  // Unique
  factureUnique: any = false;
  // Multiple
  factureMultiple: any = false;

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    if (numSelected == 1) {
      this.factureUnique = true;
      this.factureMultiple = false;
    } else if (numSelected > 1) {
      this.factureMultiple = true;
      this.factureUnique = false;
    } else {
      this.factureUnique = false;
      this.factureMultiple = false;
      this.facture = false;
    }
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  tab: number = 0
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  actualiser() {
    this.facture = false;
    this.selection.clear();
    // window.location.reload()
    this.dataItem.splice(0, this.dataItem.length)
    this.dataItem = []
    this.objetItem = []
    this.objetItemM = []
    this.InfoFrsM = []
    this.TableMultipleItem = []
    this.TableMultiplePoidsSelect = []
    this.Poids_total = 0
    this.carrat_somme = 0
    this.cmRegForAchat = 0
    this.cmRegForAchat2 = 0
    this.MTotal_MItem = 0
    this.MTotal_MPS = 0
    this.SoldeUSD = 0
    this.SoldeGNF = 0
  }


  poids_fixer: any
  fixing_bourse: any
  discount: any
  id_fixing: any

  facture: any = false;
  objetItem: any = {}
  dataItem: any[] = []
  objetItemM: any[] = []
  InfoFrsM: any = {}
  poids_select: number = 0
  len: number = -1
  TableMultipleItem: any[] = []
  TableMultiplePoidsSelect: any[] = []
  MTotal_MItem: any = 0
  MTotal_MPS: any = 0

  Poids_total: number = 0
  carrat_somme: number = 0
  // Variables de regroupement de facture
  Pt_reg_item: number = 0
  Pt_reg_poids: number = 0
  cmRegForAchat: number = 0
  cmRegForAchat2: number = 0
  PT_item: number = 0
  PT_Poids: number = 0
  Cm1: number = 0
  Cm2: number = 0
  factureElement() {
    let selected: any[] = []
    selected = this.selection.selected;
    this.facture = true;
    if (selected.length == 1) {
      this.len = 0
      selected.forEach(item => {
        this.objetItem = item
        if (item.achat_item) {
          // PAR ITEM
          item.achat_item.forEach((donnees: any) => {
            if (donnees.poids > 0) {
              this.dataItem.push(donnees)
              // console.log(donnees);
              this.Poids_total += parseFloat(donnees.poids)
              this.carrat_somme += parseFloat(donnees.poids) * (parseFloat(donnees.carrat.toString().substring(0, 5)) - donnees.manquant)
              let pu_ = ''
              let mt_ = ''
              pu_ = ((this.objetItem.fixing_bourse / 34) - this.objetItem.fixing_discompte).toString().substring(0, 5)
              mt_ = this.calculPrice(pu_, donnees.poids, (donnees.carrat.toString().substring(0, 5) - donnees.manquant.toString().substring(0, 5)))
              this.MTotal_MItem += parseFloat(mt_);
            }
          })
        } else if (!item.achat_item) {
          console.log("PAR POIDS : ", item);
          // console.log("CMR:", item.carrat_moyen_restant);

          this.objetItem = item
          this.poids_select = parseFloat(item.poids_select[0])
          this.Poids_total += parseFloat(item.poids_select[0])
          this.carrat_somme += parseFloat(item.poids_select[0]) * (parseFloat(item.carrat_moyen_restant.toString().substring(0, 5)))
          let pu_ = ''
          let mtt_ = ''
          pu_ = ((this.objetItem.fixing_bourse / 34) - this.objetItem.fixing_discompte).toString().substring(0, 5)
          mtt_ = this.calculPrice(pu_, item.poids_select[0], (item.carrat_moyen_restant.toString().substring(0, 5)))
          // console.log(pu_);
          // console.log(mt_);
          this.MTotal_MPS += parseFloat(mtt_);
          // console.log("PS: ", this.poids_select);
        }
        // console.log("Objetitem: ", this.objetItem);
        // console.log("dataItem: ", this.dataItem);
      })
    } else {
      // Si c'est plusieurs facture qui est demander en meme temps
      this.len = 1
      console.log(" ==== PLUSIEURS ELEM ==== ");

      let idF: any
      let tabVerif: any[] = []
      selected.forEach(f => {
        idF = f.fournisseur
        tabVerif.push(f.fournisseur)
      })
      tabVerif.forEach((x): any => {
        if (idF != x) {
          this.snackBar.open("Votre selection est incorrect (Fournisseur non conforme) !", "D'accord !", {
            duration: 4000,
            horizontalPosition: "right",
            verticalPosition: "bottom",
            panelClass: ['bg-danger', 'text-white']
          })
          selected = []
        }
      })
      // D'abord je parcours les elements selectionner par l'utilisateur
      // Afin de les filtrer
      selected.forEach((item, index) => {
        // console.log("index: ", index);

        this.InfoFrsM = item
        this.objetItemM.push(item)
        // console.log("ITEM : ", item);
        // Si les element de l'achat existe fait !!!
        if (item.achat_item) {
          this.TableMultipleItem.push(selected[index])
          let donnees: any = selected[index]

          // console.log("Data achat item ", donnees.achat_item[donnees.achat_item.length-1]);
          this.PT_item += Number(donnees.achat_item[donnees.achat_item.length - 1])
          // console.log("Donnees item1", donnees);

          let pu__ = ''
          let mt__ = ''
          pu__ = ((donnees.fixing_bourse / 34) - donnees.fixing_discompte).toString().substring(0, 5)
          donnees.achat_item.forEach((x: any) => {
            if (x.poids != undefined) {
              // console.log("Poids items : ", x);

              this.Poids_total += x.poids
              this.Pt_reg_item += x.poids
              let poids = x.poids
              let carrat = x.carrat.toString().substring(0, 5)
              this.cmRegForAchat = Number(poids) * Number(carrat - x.manquant)

              // this.PT_item += x.poids
              this.carrat_somme += parseFloat(x.poids) * Number(carrat - x.manquant)
              // this.cmRegForAchat += parseFloat(x.poids) * parseFloat(x.carrat.toString().substring(0, 5))
              mt__ = this.calculPrice(pu__, x.poids,  Number(carrat - x.manquant))
              //
              this.MTotal_MItem += mt__
              this.Cm1 += this.cmRegForAchat
            }
          })
          // console.log("CM1 : ", this.Cm1);

        }
        // Si les elements de l'achat n'existe pas fais xa !!!!
        if (!item.achat_item) {
          this.TableMultiplePoidsSelect.push(selected[index])
          // console.log("SELECT : ", selected[index]);
          let k = selected[index]
          // if (k.poids_select[0] > 0) {
          // console.log("Donnees : ", selected[index]);

          let pu__2 = ''
          let mt__2 = ''
          pu__2 = ((k.fixing_bourse / 34) - k.fixing_discompte).toString().substring(0, 5)
          mt__2 = this.calculPrice(pu__2, k.poids_select[0], k.carrat_moyen_restant.toString().substring(0, 5))
          // console.log("PU2 :", pu__2);
          // console.log("MT2 :", mt__2);
          this.PT_Poids += k.poids_select[0]
          let carrat_moyen = (k.carrat_moyen_restant).toString().substring(0, 5)
          this.Poids_total += parseFloat(k.poids_select[0])
          this.Pt_reg_poids += k.poids_select[0]
          this.carrat_somme += parseFloat(k.poids_select[0]) * (k.carrat_moyen_restant).toString().substring(0, 5)
          this.cmRegForAchat2 = k.poids_select[0] * Number(carrat_moyen)
          //
          this.MTotal_MPS += mt__2
          this.Cm2 += this.cmRegForAchat2
        }
        // console.log("CM2 : ", this.Cm2);
      })

    }
    this.getInfoSolde()
  }


  // SOLDE DU FOURNISSEUR

  TabCaisseOpts: any[] = []
  TabFixingOpts: any[] = []
  baseSoldeUSD: number = 0
  baseSoldeGNF: number = 0
  SoldeGNF: number = 0;
  SoldeUSD: number = 0;
  soldeRetourGNF: number = 0;
  soldeRetourUSD: number = 0;
  soldeDecaissementGNF: number = 0;
  soldeDecaissementUSD: number = 0;
  infoElem: any = {}
  PoidsValider: number = 0;
  getInfoSolde(): void {
    let idFournisseur: any
    if (this.len == 1) {
      idFournisseur = this.InfoFrsM.fournisseur
    } else {
      idFournisseur = this.objetItem.fournisseur
    }
    this.serviceOperation.situationMonetaire('api', 'caisse', idFournisseur)
      .subscribe({
        next: (response: any) => {
          console.log(response);
          let dataCaisse: any = response.caisse_fournisseur
          let dataFixing: any = response.fixing_detail
          // console.log(response.caisse_fournisseur);

          // 1 : Parcours du tableau de caisse
          dataCaisse.forEach((itemCaisse: any) => {
            this.TabCaisseOpts.push(itemCaisse);
            if (itemCaisse.devise == 1) {
              if (itemCaisse.operation == 3) {
                this.soldeRetourGNF += parseFloat(itemCaisse.montant)
              } else if (itemCaisse.operation == 4) {
                this.soldeDecaissementGNF += parseFloat(itemCaisse.montant)
              }
            } else if (itemCaisse.devise == 2) {
              if (itemCaisse.operation == 3) {
                this.soldeRetourUSD += parseFloat(itemCaisse.montant)
              } else if (itemCaisse.operation == 4) {
                this.soldeDecaissementUSD += parseFloat(itemCaisse.montant)
              }
            } else { }
          })

          // 2 : Parcours du tableau de fixing detail
          // console.log(response.fixing_detail);
          dataFixing.forEach((elem: any) => {
            let pu_ = ''
            pu_ = (elem.prix_unit).toString().substring(0, 5)
            this.TabFixingOpts.push(elem)
            // console.log(pu_);

            this.baseSoldeUSD += this.calculPrice(pu_, elem.poids_item, ((elem.carrat).toString().substring(0, 5) - elem.manquant))
            // console.log(elem);
            this.infoElem = elem;
          })
          // console.log("Decaissement : ", this.soldeDecaissementUSD);
          let soldeUSD_ = this.baseSoldeUSD + this.soldeRetourUSD // USD
          let soldeGNF_ = this.soldeRetourGNF - this.soldeDecaissementGNF // GNF
          this.SoldeGNF = soldeGNF_
          this.SoldeUSD = soldeUSD_ - this.soldeDecaissementUSD;
        }
      })
  }





  // FIN SOLDE

  //
  Total: number = 0
  calculPrice(pu: any, poids: any, carrat: any) {
    let Montant: any = ((pu / 22) * poids * carrat)
    this.Total += Montant
    return Montant
  }



  imprimerDiv(): void {
    let printContents = this.divToPrint.nativeElement.innerHTML;
    let originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
  }


  generatePDF() {
    const doc = new jsPDF();
    const divElement: any = document.getElementById('facture'); // Remplacez 'divId' par l'ID de votre div

    // Utilisez la méthode html2canvas pour capturer la div sous forme d'image
    html2canvas(divElement).then((canvas) => {
      const imageData = canvas.toDataURL('image/png');

      // Ajoutez l'image capturée au document PDF
      doc.addImage(imageData, 'PNG', 10, 10, 190, 280); // Modifiez les coordonnées et la taille selon vos besoins

      // Enregistrez le document PDF
      doc.save('_facture_suivant_.pdf');
    });
  }



}
