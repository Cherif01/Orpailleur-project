import { SelectionModel } from '@angular/cdk/collections';
import { DatePipe, Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { ApiserviceService } from 'src/app/api_service/apiservice.service';
import { imprimerDiv } from 'src/app/app.component';
import { convertObjectInFormData } from 'src/app/etat-entreprise/caisse-principale/caisse-principale.component';
import { OperationClientComponent } from 'src/app/etat-entreprise/caisse-principale/operation-client/operation-client.component';
import { FixingClientDialogComponent } from 'src/app/etat-entreprise/fixing-client-dialog/fixing-client-dialog.component';
import { UpdateFixingComponent } from '../_modal/update-fixing/update-fixing.component';
import { DialogMessageComponent } from 'src/app/public/dialogs/dialog-message/dialog-message.component';
import { EditExpeditionComponent } from '../_modal/edit-expedition/edit-expedition.component';
import { FactureAchatComponent } from '../_modal/facture-achat/facture-achat.component';

@Component({
  selector: 'app-detail-client',
  templateUrl: './detail-client.component.html',
  styleUrls: ['./detail-client.component.css'],
})
export class DetailClientComponent implements OnInit {
  @ViewChild('divToPrint') divToPrint: ElementRef | any;
  @ViewChild('divToPrint_') divToPrint_: ElementRef | any;
  @ViewChild('head') head: ElementRef | any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  search = new FormControl();
  selection = new SelectionModel<any>(true, []);

  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  displaysColums = [
    'Date',
    'Poids',
    'CarratMoyen',
    'Vendu',
    'Status',
    'Action',
  ];

  // LIST FIXING
  dataSource2: MatTableDataSource<any> = new MatTableDataSource();
  displaysColums2: string[] = [
    'date',
    'fixing',
    'discounte',
    'p_unit',
    'pds_fixe',
    'pds_vendu',
    'pds_restant',
  ];

  constructor(
    private activeroute: ActivatedRoute,
    private dialog: MatDialog,
    private fb: FormBuilder,
    public location: Location,
    private service: ApiserviceService,
    private snackBar: MatSnackBar
  ) {
    this.search.valueChanges.subscribe((v) => {
      this.filterTable(v);
    });
  }
  filterTable(v: any) {
    this.dataSource.filter = v?.trim()?.toLowerCase();
    this.dataSource2.filter = v?.trim()?.toLowerCase();
  }

  clientOperation = new FormGroup({
    operation_client: new FormControl('', [Validators.required]),
    montant_client: new FormControl('', [Validators.required]),
  });

  title = 'SOCIETE : ';
  Id_client: any;
  ngOnInit(): void {
    this.getExpeditionOnline();
    // ID ACHAT EN GET
    this.Id_client = this.activeroute.snapshot.params['id'];
    this.getCaisse();
    this.getListExpedition();
    this.getInfo();
    this.goRapport();
    this.getFacture();
  }

  // Liste des clients
  statExpedition: boolean = false;
  Liste: any = [];
  infoExpedition: any = [];
  getExpeditionOnline(): void {
    this.service
      .GetAllByName(
        'client',
        'verifExpedition.php',
        this.activeroute.snapshot.params['id']
      )
      .subscribe({
        next: (response: any) => {
          // console.log('Expedition - ', response);
          this.infoExpedition = response.info;
          this.Liste = response.items;
        },
        error: (err: any) => {
          console.log('Error - ', err);
        },
      });
  }

  // Nouvelle Expedition
  initExpedition() {
    this.service
      .sendID('client', 'initExpedition.php', this.Id_client)
      .subscribe({
        next: (response: any) => {
          // console.log('INIT EXP : ', response)
          if (response.status == 1)
            this.snackBar.open(response.message, 'Okay', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['bg-success', 'text-white'],
            });

          this.getExpeditionOnline();
        },
        error: (err: any) => {
          console.log('ERR : ', err);
        },
      });
  }

  // Formulaire
  formAddItems = this.fb.group({
    id_initExpedition: [],
    poids: [, Validators.required],
    carrat: [, Validators.required],
    res_poids: [0],
    res_carrat: [0],
  });
  ajouter() {
    this.formAddItems.value.id_initExpedition =
      this.infoExpedition.idExpedition;
    this.service
      .create(
        'client',
        'addItem_expedition.php',
        convertObjectInFormData(this.formAddItems.value)
      )
      .subscribe({
        next: (response: any) => {
          // console.log('Add Items EXP : ', response);
          if (response.status == 1)
            this.snackBar.open(response.message, 'Okay', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
              panelClass: ['bg-success', 'text-white'],
            });
          else
            this.snackBar.open(response.message, 'Okay', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
              panelClass: ['bg-danger', 'text-white'],
            });

          this.getExpeditionOnline();
          this.formAddItems.patchValue({
            poids: null,
            carrat: null,
          });
        },
        error: (err: any) => {
          console.log('ERR : ', err);
        },
      });
  }

  // Modification du resultat de carrat et poids
  saveTableData(element: any) {
    // console.log("Row : ", element);
    let obj = {
      id: element.id,
      poids: element.poids,
      carrat: element.carrat,
      res_poids: element.res_poids,
      res_carrat: element.res_carrat,
    };
    const objetForm = convertObjectInFormData(obj);
    // console.log("NEW OBJET : ", obj);

    this.service.UpdateItem('client', 'updateItem.php', objetForm).subscribe({
      next: (response: any) => {
        // console.log("res : ", response);
        if (response.status == 1)
          this.snackBar.open(response.message, 'Fermer', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['bg-success', 'text-white'],
          });
        else {
          this.snackBar.open(response.message, 'Fermer', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'bottom',
            panelClass: ['bg-danger', 'text-white'],
          });
        }
        window.location.reload();
      },
      error: (err) => {
        console.error('err : ', err);
        this.snackBar.open('Echec, Veuillez reessayer!', undefined, {
          duration: 1000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom',
          panelClass: ['bg-danger', 'text-white'],
        });
      },
    });

    // Traitez les données modifiées ici
  }

  // SUPPRIMER UNE EXPEDITION EN COURS
  deleteExpedtion() {
    // console.log('delete : ', form.value);
    this.service
      .sendID('client', 'deleteExp.php', this.infoExpedition.idExpedition)
      .subscribe({
        next: (data: any) => {
          window.location.reload();
          // console.log("Data : ", data);
        },
      });
  }

  // VALIDER ET TERMINER UNE EXPEDITION
  endExpedtion() {
    this.service
      .sendID('client', 'endExp.php', this.infoExpedition.idExpedition)
      .subscribe({
        next: (data: any) => {
          this.snackBar.open(
            'Cette Enregistrement est maintenant terminer',
            'Okay',
            {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
              panelClass: ['bg-success', 'text-white'],
            }
          );
          this.getExpeditionOnline();
        },
      });
  }

  // SUPPRIMER UNE EXPEDITION EN COURS
  deleteLine(idElement: any) {
    // console.log('delete : ', idElement);
    this.service.sendID('client', 'deleteItemExp.php', idElement).subscribe({
      next: (response: any) => {
        if (response.status == 1) {
          this.snackBar.open(response.message, 'Okay', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['bg-success', 'text-white'],
          });
          this.getExpeditionOnline();
        } else {
          this.snackBar.open(response.message, 'Okay', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'bottom',
            panelClass: ['bg-danger', 'text-white'],
          });
        }
      },
      error: (err: any) => {
        console.log('Error - ', err);
      },
    });
  }

  // openDialog_(id: any): void {
  //   const dialogRef = this.dialog.open(List1Component, {
  //     width: '67%',
  //     data: { id: id }, // Vous pouvez passer des données ici si nécessaire
  //   });

  //   dialogRef.afterClosed().subscribe((result) => {
  //     console.log('The dialog was closed');
  //   });
  // }

  // GET Fournisseur
  infoClient: any = {};
  getInfo() {
    this.service
      .getUnique('client', 'getInfoOne.php', this.Id_client)
      .subscribe({
        next: (data: any) => {
          // console.log("Client : ", data);
          this.infoClient = data;
        },
      });
  }

  // LIST EXPEDITION
  PT_SEND: number = 0;
  CM_SEND: number = 0;
  expeditionDatatable: any;
  datatable: any[] = [];
  PTotalExpedition: any = 0;
  // GET BY POIDS
  getListExpedition(): void {
    this.service
      .LIST_BY_ID('client', 'getListeExpeditionRestant.php', this.Id_client)
      .subscribe({
        next: (data: any) => {
          // console.log('Liste expedition poids : ', data);
          this.datatable = data;
          this.dataSource.data = data;
        },
        error: (err: any) => console.log('erreur : ', err),
      });
  }

  // GET Facture by fixing...
  dataFacture: any[] = [];
  filteredDataArray: any[] = [];
  pagedData: any[] = [];
  searchTerm: string = '';
  pageSize: number = 10; // Nombre de lignes par page
  pageIndex: number = 0; // Index de la page actuelle

  getFacture(): void {
    this.service
      .LIST_BY_ID('client', 'getFactureFixing.php', this.Id_client)
      .subscribe({
        next: (response: any) => {
          this.dataFacture = response;
          this.applyFilter(); // Apply filter after fetching data
        },
        error: (err: any) => console.log('erreur : ', err),
      });
  }

  applyFilter(): void {
    const searchLower = this.searchTerm.toLowerCase();

    this.filteredDataArray = this.dataFacture.filter((data) =>
      Object.values(data).some((value) => {
        if (
          value != null &&
          (typeof value === 'string' || typeof value === 'number')
        ) {
          return value.toString().toLowerCase().includes(searchLower);
        }
        return false;
      })
    );

    if (this.paginator) this.paginator.firstPage(); // Revenir à la première page après filtrage
    this.updatePagedData();
  }

  updatePagedData(): void {
    if (!this.paginator) return;

    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    const endIndex = startIndex + this.paginator.pageSize;

    this.pagedData = this.filteredDataArray.slice(startIndex, endIndex);
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.paginator.pageIndex = event.pageIndex;
    this.updatePagedData();
  }

  // END FACTURE

  // FACTURE TOGGLE
  selectedFactures: any[] = [];
  showFacture: boolean = false;
  generatedFacture: any = null;

  trackById(index: number, item: any): number {
    return item.idFixing; // Assure un rendu plus efficace des listes Angular
  }

  // Met à jour la sélection des factures individuellement
  updateSelectedFactures(data: any): void {
    // console.log('🆕 Sélection modifiée :', data);
    if (data.selected) {
      // Vérifier si la facture n'est pas déjà ajoutée
      if (!this.selectedFactures.some((f) => f.idFixing === data.idFixing)) {
        this.selectedFactures.push(data);
      }
    } else {
      this.selectedFactures = this.selectedFactures.filter(
        (f) => f.idFixing !== data.idFixing
      );
    }

    // console.log('🔍 Factures sélectionnées :', this.selectedFactures);
  }

  // Sélectionne/Désélectionne toutes les factures
  toggleSelectAll(event: any): void {
    const checked = event.checked; // Utilisation correcte de l'événement MatCheckbox
    this.selectedFactures = checked ? [...this.dataFacture] : [];

    this.dataFacture.forEach((data) => (data.selected = checked));
    // console.log('✅ Sélection globale :', this.selectedFactures);
  }

  // Génère la facture groupée
  generateFactureGroup(): void {
    if (this.selectedFactures.length === 0) {
      // console.warn('⚠️ Aucune facture sélectionnée !');
      return;
    }

    const facturesToSend = this.selectedFactures
      .map((facture) => facture.idFixing)
      .filter((id) => id != null);

    if (facturesToSend.length === 0) {
      console.error('❌ Erreur : Aucun ID valide à envoyer !');
      return;
    }

    this.service
      .getFacture('client', 'factureGroup.php', facturesToSend)
      .subscribe({
        next: (response: any) => {
          console.log('📄 Facture générée (API):', response);
          this.generatedFacture = response;
          this.showFacture = true; // Affiche l’onglet facture générée
        },
        error: (err: any) => console.error('🚨 Erreur API : ', err),
      });
  }
  // Facture toggle

  openEditionDialog(idFixing: any) {
    this.dialog
      .open(UpdateFixingComponent, {
        data: { id: idFixing },
      })
      .afterClosed()
      .subscribe((result) => {
        if (result?.event && result.event === 'insert') {
          let form: any = result.data;
          this.updateFix(form);
        }
      });
  }

  // UPDATE POIDS-VENDU (RESULTAT)
  updateFix(form: any) {
    let f = convertObjectInFormData(form);
    // console.log(f);
    this.service.create('client', 'updateFixing.php', f).subscribe({
      next: (response: any) => {
        // console.log("Fixing : ", response)
        if (response.status == 1) {
          this.snackBar.open(response.message, 'Okay', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['bg-success', 'text-white'],
          });
        } else {
          this.snackBar.open(response.message, 'Okay', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'bottom',
            panelClass: ['bg-danger', 'text-white'],
          });
        }
        // this.getCaisse()
        window.location.reload();
      },
    });
  }

  // Fixing client dialog
  openDialogFix() {
    this.dialog
      .open(FixingClientDialogComponent, {
        data: { idClient: this.Id_client },
      })
      .afterClosed()
      .subscribe((result) => {
        if (result?.event && result.event === 'insert') {
          let form: any = result.data;
          form.idClient = this.Id_client;
          this.saveFixing(form);
        }
      });
  }

  facture_achat(idLigne: any) {
    // console.log('idExp : ', idLigne);
    this.dialog
      .open(FactureAchatComponent, {
        width: '50%',
        height: '90%',
        data: { id: idLigne },
      })
      .afterClosed()
      .subscribe((result) => {
        if (result?.event && result.event === 'insert') {
          let form: any = result.data;
          this.save(form);
        }
      });
  }

  editExpedition(idLigne: any) {
    // console.log('idExp : ', idLigne);
    this.dialog
      .open(EditExpeditionComponent, {
        data: { id: idLigne },
      })
      .afterClosed()
      .subscribe((result) => {
        if (result?.event && result.event === 'insert') {
          let form: any = result.data;
          this.save(form);
        }
      });
  }

  // Operation caisse dialog
  openDialog() {
    this.dialog
      .open(OperationClientComponent, {})
      .afterClosed()
      .subscribe((result) => {
        if (result?.event && result.event === 'insert') {
          let form: any = result.data;
          form.idClient = this.Id_client;
          this.save(form);
        }
      });
  }

  // CAISSE ELEMENT
  EntrerClient = 0;
  SortieClient = 0;
  SoldeFinal = 0;

  historique: any[] = [];
  Today_h: any = new DatePipe('en_EN').transform(new Date(), 'yyyy/MM/dd');
  rechercheIntervalleForm = new FormGroup({
    dateStart: new FormControl<Date>(this.Today_h, Validators.required),
    dateEnd: new FormControl<Date | null>(null),
  });
  getCaisse(): void {
    //console.log(this.rechercheIntervalleForm.value);
    if (this.rechercheIntervalleForm.valid) {
      let values = this.rechercheIntervalleForm.value;
      this.service
        .LIST_SEARCH('public', 'readbyclause.php', 'table_caisse', {
          startDate: new Date(values.dateStart!).getTime(),
          endDate: values.dateEnd
            ? new Date(values.dateEnd).getTime()
            : new Date(values.dateStart!).getTime(),
        })
        .subscribe({
          next: (data: any) => {
            // console.log("DATA : ", data);
            this.historique = [];
            data.forEach((value: any) => {
              if (this.Id_client == value.idClient) {
                if (value.operation == 5 || value.operation == 6) {
                  this.historique.push(value);
                  if (value.operation == 5) {
                    this.EntrerClient += parseFloat(value.montant);
                  } else if (value.operation == 6) {
                    this.SortieClient += parseFloat(value.montant);
                  }
                }
              }
            });
            this.SoldeFinal = this.EntrerClient - this.SortieClient;
            // console.log("SOLDE : ", this.EntrerClient, this.SortieClient);
          },
        });
    }
  }

  save(form: any) {
    let f = convertObjectInFormData(form);
    // console.log(f);
    this.service.create('client', 'addOperation.php', f).subscribe((v) => {
      if (v.status == 1)
        this.snackBar.open(v.message, 'Okay', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['bg-success', 'text-white'],
        });
      else
        this.snackBar.open(v.message, 'Okay', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['bg-danger', 'text-white'],
        });

      this.goRapport();
    });
  }

  saveFixing(form: any) {
    let f = convertObjectInFormData(form);
    // console.log(f);
    this.service.create('client', 'addFixing.php', f).subscribe({
      next: (response: any) => {
        // console.log("Fixing : ", response)
        if (response.status == 1) {
          this.snackBar.open(response.message, 'Okay', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['bg-success', 'text-white'],
          });
        } else {
          this.snackBar.open(response.message, 'Okay', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'bottom',
            panelClass: ['bg-danger', 'text-white'],
          });
        }
        // this.getCaisse()
        window.location.reload();
      },
    });
  }

  format2Chart(data: any) {
    let tab = data.toString().split('.');
    if (tab.length < 2) return Number(data);
    return Number(tab[0].concat('.', tab[1].substr(0, 2)));
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
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
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.position + 1
    }`;
  }

  validationFixing = new FormGroup({
    idFixing: new FormControl('', Validators.required),
    idClient: new FormControl(''),
    idItem: new FormControl(''),
    idAchat: new FormControl(''),
    codeGenerer: new FormControl(''),
  });
  // Envoie dans du fixing dans la db
  objetFixer: any = [];
  logSelected(idFixing: any) {
    let selected = this.selection.selected;
    let code: any = Math.floor(Math.random() * (1000000 - 1000 + 1)) + 2023;
    if (selected.length < 1)
      this.snackBar.open('Aucune selection... !', 'Merci!', {
        duration: 2000,
        horizontalPosition: 'right',
        verticalPosition: 'bottom',
        panelClass: ['bg-danger', 'text-white'],
      });

    // ENVOIE DU FIXING DETAIL POUR LE CLIENT (F-VITEM-CLIENT)
    selected.forEach((v) => {
      // console.log('v ', v)
      const formData = new FormData();
      formData.append('idFixing', idFixing);
      formData.append('idClient', this.Id_client);
      formData.append('idItem', v.item);
      formData.append('idAchat', v.achat);
      formData.append('codeGenerer', code);
      // formData.append('statut_fixing_vitem_client', this)

      this.service
        .create('client', 'addfixingclient1.php', formData)
        .subscribe({
          next: (response: any) => {
            // console.log("RESPONSE : ", response);
            this.snackBar.open('Or expedier !', 'Merci!', {
              duration: 2000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
              panelClass: ['bg-success', 'text-white'],
            });
            if (response) window.location.reload();
          },
        });
    });
  }

  // RAPPORT GET
  // Event Rapport
  Name: any;
  fusionTab: any[] = [];
  SoldeGNF: number = 0;
  SoldeUSD: number = 0;
  // ITEM
  ListItem: any = [];
  PoidsTotal_barre: number = 0;
  manquantTotal: number = 0;
  CMoyen_: number = 0;
  reverse_statut = true;
  goRapport(api: string = 'operation.php'): any {
    if (api == 'operation_reverse.php') this.reverse_statut = false;
    else this.reverse_statut = true;
    this.service.getUnique('client', api, this.Id_client).subscribe({
      next: (data: any) => {
        // console.log('Operation : ', data);
        this.fusionTab = data;
        let solde = 0;
        this.fusionTab.forEach((op: any) => {
          // console.log("Echo : ", op)
          if (op.type_operation == 1) {
            // fixing
            solde += parseFloat(op.montant);
            // op['solde'] = amount;
          }
          if (op.type_operation == 2) {
            //caisse
            solde -= parseFloat(op.montant);
          }
          op['solde'] = solde;
        });
        this.SoldeUSD = solde;
        // console.log('FUSION : ', this.fusionTab);
      },
      error: (err: any) => console.log(err),
    });
  }

  goRapportAllAsking(): any {
    this.service
      .getUnique('client', 'operation_allAsking.php', this.Id_client)
      .subscribe({
        next: (data: any) => {
          // console.log("Operation : ", data);
          this.fusionTab = data[0];
          let solde = 0;
          this.fusionTab.forEach((op: any) => {
            // console.log("Echo : ", op)
            if (op.type_operation == 'credit') {
              // fixing
              solde += parseFloat(op.montant);
              // op['solde'] = amount;
            }
            if (op.type_operation == 'debit') {
              //caisse
              solde -= parseFloat(op.montant);
            }
            op['solde'] = solde;
          });
          this.SoldeUSD = solde;
          // console.log("FUSION : ", this.fusionTab);
        },
        error: (err: any) => console.log(err),
      });
  }

  imprimerDiv(): void {
    imprimerDiv(this.divToPrint.nativeElement.innerHTML);
  }

  imprimerDiv_(): void {
    imprimerDiv(this.divToPrint_.nativeElement.innerHTML);
  }

  deleteFunction(table: any, id: any) {
    this.dialog
      .open(DialogMessageComponent, {
        disableClose: true,
        data: {
          title: 'Suppression demander!',
          message: 'Voulez-vous vraiment supprimer cette ligne? ',
          messageNo: 'Non',
          messageYes: 'Confirmer',
        },
      })
      .afterClosed()
      .subscribe((data) => {
        if (data) {
          // console.log(data);
          this.service
            .delete('public', 'suppression.php', table, id)
            .subscribe({
              next: (response: any) => {
                if (response.status == 1)
                  this.snackBar.open(response.message, 'Merci!', {
                    duration: 2000,
                    horizontalPosition: 'right',
                    verticalPosition: 'top',
                    panelClass: ['bg-success', 'text-white'],
                  });
                else
                  this.snackBar.open(response.message, 'Merci!', {
                    duration: 2000,
                    horizontalPosition: 'right',
                    verticalPosition: 'top',
                    panelClass: ['bg-danger', 'text-white'],
                  });
                // console.log("res : ", value);
                this.goRapport();
                // window.location.reload();
              },
              error: (err) => {
                console.error(err);
              },
            });
        }
      });
    //Requete suppression sur la DB
  }
}
