import { Location } from '@angular/common'
import { Component, OnInit, ViewChild } from '@angular/core'
import { MatAccordion } from '@angular/material/expansion'
import { ApiserviceService } from 'src/app/api_service/apiservice.service'

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion | undefined

  panelOpenState = false

  constructor (public location: Location, private service: ApiserviceService) {}

  ngOnInit (): void {
    this.getAllMenu()
    this.listAccessSession()
  }

  listMenu: any = []
  menuOperation: any = []
  menuSituation: any = []
  menuFournisseur: any = []
  menuClient: any = []
  menuFixing: any = []
  menuRapport: any = []
  menuSettings: any = []
  getAllMenu () {
    this.service.LIST_ALL_PRECIS('menu', 'read.php').subscribe({
      next: (data: any) => {
        // console.log(data)
        if (data.length > 0) {
          data.forEach((user: any) => {
            // console.log("menu : ", user);
            switch (user.famille) {
              case 'operation':
                this.menuOperation.push(user)
                break
              case 'situation':
                this.menuSituation.push(user)
                break
              case 'fournisseur':
                this.menuFournisseur.push(user)
                break
              case 'client':
                this.menuClient.push(user)
                break
              case 'fixing':
                this.menuFixing.push(user)
                break
              case 'rapport':
                this.menuRapport.push(user)
                break
              case 'settings':
                this.menuSettings.push(user)
                break
              default:
                break
            }
            this.listMenu.push(user)
          })
        }
      },
      error: (err: any) => console.log(err)
    })
  }

  // ACCESS LIST USER => logge-in
  ListAccess_onglet: any = []
  ListAccess_menu: any = []
  ListAccess_menu_url: any = []
  listAccessSession () {
    let id: any = localStorage.getItem('id')
    this.service
      .LIST_BY_ID('menu', 'list-access-session.php', parseInt(id))
      .subscribe({
        next: (data: any) => {
          // console.log("Access infos: ", data)
          if (data.length > 0)
            data.forEach((menu: any) => {
              // console.log("Access : ", menu);
              // ONGLET
              if (!this.ListAccess_onglet.includes(menu.familleMenu))
                this.ListAccess_onglet.push(menu.familleMenu)
              // MENU
              if (!this.ListAccess_menu.includes(menu.libelle)) {
                this.ListAccess_menu.push(menu.libelleMenu)
                this.ListAccess_menu_url.push(menu.url)
              }
            })
          // console.log("Onglet : ", this.ListAccess_onglet);
          // console.log("Menu : ", this.ListAccess_menu);
        },
        error: (err: any) => console.log(err)
      })
  }

  // playSound() {
  //   const audio = new Audio();
  //   audio.src = 'assets/click/click3.wav';
  //   audio.load();
  //   audio.play();
  // }
}
