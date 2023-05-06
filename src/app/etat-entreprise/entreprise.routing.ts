import { Routes } from "@angular/router";
import { StockComponent } from "./stock/stock.component";
import { CaissePrincipaleComponent } from "./caisse-principale/caisse-principale.component";
import { EntrerCaisseComponent } from "./caisse-principale/entrer-caisse/entrer-caisse.component";
import { SortieCaisseComponent } from "./caisse-principale/sortie-caisse/sortie-caisse.component";

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
      },
      {
        path: 'caisse-principale',
        component: CaissePrincipaleComponent,
      },
      {
        path: 'entrer-caisse',
        component: EntrerCaisseComponent,
      },
      {
        path: 'sortie-caisse',
        component: SortieCaisseComponent,
      }
    ]
  },
];

export default EntrepriseRouting;
