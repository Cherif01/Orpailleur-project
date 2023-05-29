import { Routes } from "@angular/router";
import { RapportFournisseurComponent } from "./rapport-fournisseur/rapport-fournisseur.component";
import { RapportClientComponent } from "./rapport-client/rapport-client.component";
import { RapportCaisseComponent } from "./rapport-caisse/rapport-caisse.component";
import { AuthGuard } from "../user/auth.guard";

const rapportRouting: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: '/notfound',
        pathMatch: 'full'
      },
      {
        path: 'rapport-frs',
        component: RapportFournisseurComponent,
        canActivate:[AuthGuard]
      },
      {
        path: 'rapport-frs/:id',
        component: RapportFournisseurComponent,
        canActivate:[AuthGuard]
      },
      {
        path: 'rapport-client',
        component: RapportClientComponent,
        canActivate:[AuthGuard]
      },
      {
        path: 'rapport-client/:id',
        component: RapportClientComponent,
        canActivate:[AuthGuard]
      },
      {
        path: 'rapport-caisse',
        component: RapportCaisseComponent,
        canActivate:[AuthGuard]
      },
      {
        path: 'rapport-caisse/:id',
        component: RapportCaisseComponent,
        canActivate:[AuthGuard]
      }
    ]
  }
]

export default rapportRouting;
