import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core'
import { FormControl } from '@angular/forms'
import { MatPaginator } from '@angular/material/paginator'
import { MatTableDataSource } from '@angular/material/table'
import { SelectionModel } from '@angular/cdk/collections'
import { Location } from '@angular/common'
import { MatSort } from '@angular/material/sort'
import { ApiserviceService } from 'src/app/api_service/apiservice.service'
import { convertObjectInFormData } from 'src/app/etat-entreprise/caisse-principale/caisse-principale.component'
import { MatSnackBar } from '@angular/material/snack-bar'
import { DialogMessageComponent } from 'src/app/public/dialogs/dialog-message/dialog-message.component'
import { MatDialog } from '@angular/material/dialog'

@Component({
  selector: 'app-list-fixing',
  templateUrl: './list-fixing.component.html',
  styleUrls: ['./list-fixing.component.css']
})
export class ListFixingComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort?: MatSort | any
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator = Object.create(null)
  search = new FormControl()

  constructor (
    private service: ApiserviceService,
    private dialog: MatDialog,
    public location: Location,
    private snackBar: MatSnackBar
  ) {
    this.search.valueChanges.subscribe(v => {
      this.filterTable(v)
    })
  }

  dataSource: MatTableDataSource<any> = new MatTableDataSource()
  displaysColums: string[] = [
    'date',
    'fournisseur',
    'fixing',
    'discounte',
    'p_unit',
    'pds_fixe',
    'pds_vendu',
    'pds_restant',
    'action'
  ]
  dataSource2: MatTableDataSource<any> = new MatTableDataSource()
  displaysColums2: string[] = [
    'date',
    'fournisseur',
    'pds_fixe',
    'fixing',
    'discounte',
    'p_unit',
    'action'
  ]
  selection = new SelectionModel<any>(true, [])

  title = 'List fixing'

  ngOnInit (): void {
    this.getAllFixingCinq()
    this.getAllFixingProvisoire()
  }

  // GET FIxing
  getAllFixingCinq () {
    this.service.LIST('fixing', 'read.php', 'table_fixing').subscribe({
      next: (data: any) => {
        // console.log(data),
        this.dataSource.data = data
        this.dataSource.paginator = this.paginator
      },
      error: (err: any) => console.log(err)
    })
  }

  // GET FIxing
  getAllFixingTout () {
    this.service.LIST('fixing', 'read2.php', 'table_fixing').subscribe({
      next: (data: any) => {
        // console.log(data),
        this.dataSource.data = []
        this.dataSource.data = data
        this.dataSource.paginator = this.paginator
      },
      error: (err: any) => console.log(err)
    })
  }

  // GET FIxing
  getAllFixingProvisoire () {
    this.service.getList('fixing', 'readProvision.php').subscribe({
      next: (data: any) => {
        // console.log(data),
        this.dataSource2.data = data
        this.dataSource2.paginator = this.paginator
      },
      error: (err: any) => console.log(err)
    })
  }

  ngAfterViewInit () {
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort
    // 2e tableau
    this.dataSource2.paginator = this.paginator
    this.dataSource2.sort = this.sort
  }

  applyFilter (event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
    this.dataSource.filter = filterValue.trim().toLowerCase()
    this.dataSource2.filter = filterValue.trim().toLowerCase()

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage()
    } else if (this.dataSource2.paginator) {
      this.dataSource2.paginator.firstPage()
    }
  }

  // Mise a jour du fixing
  saveTableData (element: any) {
    // console.log("Row : ", element);
    let table_fixing = {
      id: element.id,
      poidsFixer: element.poidsFixer,
      discompte: element.discompte,
      fixingBourse: element.fixingBourse
    }
    const objetForm = convertObjectInFormData(table_fixing)
    // console.log("NEW OBJET : ", table_fixing);
    // console.log("NEW OBJET : ", objetForm);

    this.service.Update('fixing', 'updateFixing.php', objetForm).subscribe({
      next: response => {
        // console.log("res : ", response);
        this.snackBar.open('fixing modifier avec succès!', undefined, {
          duration: 2000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['bg-success', 'text-white']
        })
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      },
      error: err => {
        console.error('err : ', err)
        this.snackBar.open('Echec, Veuillez reessayer!', undefined, {
          duration: 1000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom',
          panelClass: ['bg-danger', 'text-white']
        })
      }
    })

    // Traitez les données modifiées ici
  }

  deleteFixing (idFixing: any) {
    // console.log('id:', this.Id_achat);
    this.dialog
      .open(DialogMessageComponent, {
        disableClose: true,
        data: {
          title: 'Suppression demander!',
          message: 'Voulez-vous vraiment supprimer cet fixing? ',
          messageNo: 'Annuler',
          messageYes: 'Supprimer'
        }
      })
      .afterClosed()
      .subscribe(data => {
        if (data) {
          // console.log(data);
          this.service
            .delete('public', 'delete.php', 'table_fixing', idFixing)
            .subscribe({
              next: value => {
                // console.log("res : ", value);
                window.location.reload()
              },
              error: err => {
                console.error(err)
              }
            })
        }
      })
    //Requete suppression sur la DB
  }

  deleteFixingProvisoire (idFixing: any) {
    // console.log('id:', this.Id_achat);
    this.dialog
      .open(DialogMessageComponent, {
        disableClose: true,
        data: {
          title: 'Suppression demander!',
          message: 'Voulez-vous vraiment supprimer cet fixing? ',
          messageNo: 'Annuler',
          messageYes: 'Supprimer'
        }
      })
      .afterClosed()
      .subscribe(data => {
        if (data) {
          // console.log(data);
          this.service
            .delete('public', 'delete.php', 'table_fixing_provisoire', idFixing)
            .subscribe({
              next: value => {
                // console.log("res : ", value);
                window.location.reload()
              },
              error: err => {
                console.error(err)
              }
            })
        }
      })
    //Requete suppression sur la DB
  }

  filterTable (value: string) {
    this.dataSource.filter = value?.trim()?.toLowerCase()
    this.dataSource2.filter = value?.trim()?.toLowerCase()
  }
}
