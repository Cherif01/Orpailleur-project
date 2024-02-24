import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { Location } from '@angular/common'
import { ApiserviceService } from 'src/app/api_service/apiservice.service'
import { Observable, map, startWith } from 'rxjs'

// import { Select2Option, Select2UpdateEvent } from 'ng-select2-component';

@Component({
  selector: 'app-add-fixing',
  templateUrl: './add-fixing.component.html',
  styleUrls: ['./add-fixing.component.css']
})
export class AddFixingComponent implements OnInit {
  // FORM
  Fixing = new FormGroup({
    idFournisseur: new FormControl('', [Validators.required]),
    poidsFixer: new FormControl(),
    fournisseur: new FormControl(null),
    fixingBourse: new FormControl(),
    discompte: new FormControl(),
    created_by: new FormControl(1)
  })

  id_session = localStorage.getItem('id_session')

  // Fixing = this.fb.group({
  //   idFournisseur: ['', Validators.required],
  //   poidsFixer: [, Validators.required],
  //   fournisseur: [''],
  //   fixingBourse: [, Validators.required],
  //   discompte: [, Validators.required],
  //   created_by: [1]
  // })

  title = 'Nouveau / Fixing'
  // Control
  myControl = new FormControl('')
  options!: any[]
  Finaldata!: Observable<any[]>

  constructor (
    private fb: FormBuilder,
    private router: Router,
    private service: ApiserviceService,
    public location: Location
  ) {
    this.service.LIST('public', 'read.php', 'table_fournisseur').subscribe({
      next: (data: any) => {
        this.options = data
        // console.log(this.options);
      }
    })
  }

  ngOnInit () {
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
      this.Fixing.controls.idFournisseur.setValue(this.explodedString[1])
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

  // ADD FIXING
  fixingPOST (form: FormGroup): void {
    this.Fixing.controls.idFournisseur.setValue(this.explodedString[0])
    if (form.valid) {
      //Envoyer dans la Base
      // console.log('Fournisseur ', form.value)
      const formData = new FormData()
      formData.append('idFournisseur', form.value.idFournisseur)
      formData.append('poidsFixer', form.value.poidsFixer)
      formData.append('fixingBourse', form.value.fixingBourse)
      formData.append('discompte', form.value.discompte)
      this.service.create('fixing', 'add.php', formData).subscribe({
        next: (reponse: any) => {
          console.log('Poids fixe avec success...', reponse)
          this.router.navigate(['fixing/list-fixing'])
        },
        error: (err: any) => console.log(err)
      })
    } else {
      // console.log(form.value)
    }
  }

  // Infos
  InfosFournisseur: any = {}
  select: any = false
  infosVendor (idF: any): void {
    if (idF === undefined) {
      this.select = false
      return
    } else {
      this.select = true
    }
    // console.log(idF);
    this.service
      .getOneById('public', 'getOne.php', idF, 'table_fournisseur')
      .subscribe({
        next: data => {
          // console.log(data);
          this.InfosFournisseur = data
        }
      })
  }

  // change(key: string, event: any) {
  //   console.log(key, event);

  // }

  // overalay = false
  // data1: any = []
  // _info_ = "Selectionnez un fournisseur"
  // search_(text: string) {
  //   this.data1 = text
  //     ? (JSON.parse(JSON.stringify(this.data1)) as Select2Option[]).filter(
  //       option => option.label.toLowerCase().indexOf(text.toLocaleLowerCase()) > -1,
  //     )
  //     : JSON.parse(JSON.stringify(this.data1));
  // }

  // update(key: string, event: Select2UpdateEvent<any>) {
  //   console.log(event.value);
  // }
}
