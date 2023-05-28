import { Routes } from "@angular/router";
import { RapportFournisseurComponent } from "./rapport-fournisseur/rapport-fournisseur.component";
import { RapportClientComponent } from "./rapport-fournisseur/rapport-client/rapport-client.component";
import { RapportCaisseComponent } from "./rapport-caisse/rapport-caisse.component";

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
      },
      {
        path: 'rapport-frs/:id',
        component: RapportFournisseurComponent,
      },
      {
        path: 'rapport-client',
        component: RapportClientComponent,
      },
      {
        path: 'rapport-client/:id',
        component: RapportClientComponent,
      },
      {
        path: 'rapport-caisse',
        component: RapportCaisseComponent,
      },
      {
        path: 'rapport-caisse/:id',
        component: RapportCaisseComponent,
      }
    ]
  }
]

export default rapportRouting;
