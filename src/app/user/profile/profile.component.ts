import { Location } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { MatSnackBar } from '@angular/material/snack-bar'
import { ApiserviceService } from 'src/app/api_service/apiservice.service'
import { convertObjectInFormData } from 'src/app/etat-entreprise/caisse-principale/caisse-principale.component'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  title = 'User/update'

  constructor (
    public location: Location,
    private fb: FormBuilder,
    private service: ApiserviceService,
    private snackBar: MatSnackBar
  ) {}

  userFormEdit = this.fb.group({
    id: [''],
    nomComplet: [''],
    username: [''],
    ancienMotDePasse: [''],
    motDePasse: ['']
  })

  idSession = localStorage.getItem('id')
  ngOnInit (): void {
    this.getOneByID()
  }

  // INFO
  infoUser: any = []
  getOneByID () {
    this.service.getUnique('auth', 'getOnebyId.php', this.idSession).subscribe({
      next: (data: any) => {
        // console.log(data)
        this.infoUser = data
      },
      error: (err: any) => console.log(err)
    })
  }

  oldName: any = localStorage.getItem('nomComplet')
  oldUsername: any = localStorage.getItem('username')
  updateUser (form: FormGroup) {
    this.userFormEdit.controls.id.setValue(this.idSession)
    if (form.value.nomComplet == '') {
      this.userFormEdit.value.nomComplet = this.oldName
    }
    if (form.value.username == '') {
      this.userFormEdit.value.username = this.oldUsername
    }

    console.log(form.value)
    const formData = convertObjectInFormData(form.value)
    this.service.create('auth', 'updateInfo.php', formData).subscribe({
      next: (reponse: any) => {
        this.snackBar.open(reponse, 'Success', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['bg-success', 'text-white']
        })
      },
      error: (err: any) => {
        console.log('ERREUR : ', err),
          this.snackBar.open('Ancien MDP incorrect', 'Error', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass: ['bg-danger', 'text-white']
          })
      }
    })
  }
}
