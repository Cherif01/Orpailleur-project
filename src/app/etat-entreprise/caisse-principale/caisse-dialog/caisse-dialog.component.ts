import { Component, Inject, OnInit, Optional } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { Observable, map, startWith } from 'rxjs'
import { ApiserviceService } from 'src/app/api_service/apiservice.service'

@Component({
  selector: 'app-caisse-dialog',
  templateUrl: './caisse-dialog.component.html',
  styleUrls: ['./caisse-dialog.component.css']
})
export class CaisseDialogComponent implements OnInit {
  form = new FormGroup({
    operation: new FormControl([Validators.required]),
    created_at: new FormControl(),
    fournisseur: new FormControl(),
    representant: new FormControl(null),
    devise: new FormControl([Validators.required]),
    montant: new FormControl([Validators.required]),
    montant_anterieur: new FormControl(0),
    motif: new FormControl(''),
    created_by: new FormControl('')
  })

  myControl = new FormControl('')
  options!: any[]
  Finaldata!: Observable<any[]>

  constructor (
    public dialogRef: MatDialogRef<CaisseDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    //
    private service: ApiserviceService
  ) {
    this.service.LIST('public', 'read.php', 'table_fournisseur').subscribe({
      next: (data: any) => {
        this.options = data
        // console.log(this.options);
      }
    })
  }

  ngOnInit (): void {
    // this.getFournisseur();
    this.Finaldata = this.myControl.valueChanges.pipe(
      startWith(''),
      map(item => {
        const name = item
        return name ? this._filter(name as string) : this.options
      })
    )
  }

  selection: string = ''
  explodedString: string[] = []
  selectCustomer (nameID: string) {
    let originalString = nameID
    let separator = '-'
    this.explodedString = originalString.split(separator)
    // console.log("Name : ", nameID);
    // console.log("Name Tab : ", this.explodedString);
    if (this.explodedString[1])
      this.form.controls.fournisseur.setValue(this.explodedString[1])
    this.selection = this.explodedString[1]
  }

  private _filter (nomComplet: string): any {
    const filterValue = nomComplet.toLocaleLowerCase()
    return this.options.filter(opt => {
      // Vérifiez si opt.name est défini et est une chaîne de caractères
      if (opt.nomComplet && typeof opt.nomComplet === 'string') {
        return opt.nomComplet.toLocaleLowerCase().includes(filterValue)
      }
      return false // Si opt.name est undefined ou n'est pas une chaîne, ne l'incluez pas dans le résultat du filtre
    })
  }

  // // GetFourniseur
  // ListFrs: any = []
  // getFournisseur(): void {
  //   this.service.LIST('public','read.php','table_fournisseur').subscribe({
  //     next: (data: any) => {
  //       // console.log(data),
  //       this.ListFrs = data
  //     },
  //     error: (err: any) => console.log(err)
  //   })
  // }

  saveData () {
    this.form.controls.fournisseur.setValue(this.explodedString[0])
    if (this.form.valid) {
      this.dialogRef.close({
        event: 'insert',
        data: this.form.value
      })
    }
  }

  isTrue: any = false
  vendorChoice (select: any): void {
    if (select == 3 || select == 4) {
      this.isTrue = true
    } else {
      this.isTrue = false
    }
  }
}
