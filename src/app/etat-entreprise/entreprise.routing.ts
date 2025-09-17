import { Routes } from "@angular/router";
import { StockComponent } from "./stock/stock.component";
import { CaissePrincipaleComponent } from "./caisse-principale/caisse-principale.component";
import { EntrerCaisseComponent } from "./caisse-principale/entrer-caisse/entrer-caisse.component";
import { SortieCaisseComponent } from "./caisse-principale/sortie-caisse/sortie-caisse.component";
import { AuthGuard } from "../user/auth.guard";

const EntrepriseRouting: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: '/notfound',
        pathMatch: 'full'
      },
      {
        path: 'stock-principale',
        component: StockComponent,
        canActivate:[AuthGuard]
      },
      {
        path: 'caisse-principale',
        component: CaissePrincipaleComponent,
        canActivate:[AuthGuard]
      },
      {
        path: 'caisse-principale/:id',
        component: CaissePrincipaleComponent,
        canActivate:[AuthGuard]
      },
      {
        path: 'entrer-caisse',
        component: EntrerCaisseComponent,
        canActivate:[AuthGuard]
      },
      {
        path: 'sortie-caisse',
        component: SortieCaisseComponent,
        canActivate:[AuthGuard]
      }
    ]
  },
];

export default EntrepriseRouting;
