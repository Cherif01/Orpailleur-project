import { Routes } from "@angular/router"
import { AddPurchaseComponent } from "./purchase/add-purchase/add-purchase.component"
import { DetailPurchaseComponent } from "./purchase/detail-purchase/detail-purchase.component"
import { FournisseurachatComponent } from "./purchase/fournisseurachat/fournisseurachat.component"
import { ListPurchaseComponent } from "./purchase/list-purchase/list-purchase.component"
import { AddSaleComponent } from "./sales/add-sale/add-sale.component"
import { DetailSaleComponent } from "./sales/detail-sale/detail-sale.component"
import { FactureFournisseurComponent } from "./purchase/facture-fournisseur/facture-fournisseur.component"
import { InitPurchaseComponent } from "./purchase/init-purchase/init-purchase.component"
import { FacturepurchaseComponent } from "./purchase/facturepurchase/facturepurchase.component"
import { CreateFactureFrsComponent } from "./purchase/create-facture-frs/create-facture-frs.component"
import { AuthGuard } from "../user/auth.guard"


const OperationRouting: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: '/notfound',
        pathMatch: 'full'
      },
      {
        path: 'purchase',
        component: ListPurchaseComponent,
        canActivate:[AuthGuard]
      },
      {
        path: 'init-purchase/:id',
        component: InitPurchaseComponent,
        canActivate:[AuthGuard]
      },
      {
        path: 'add-purchase',
        component: FournisseurachatComponent,
        canActivate:[AuthGuard]
      },
      {
        path: 'add-purchase/:id',
        component: AddPurchaseComponent,
        canActivate:[AuthGuard]
      },
      {
        path: 'detail-purchase/:id',
        component: DetailPurchaseComponent,
        canActivate:[AuthGuard]
      },
      {
        path: 'facturepurchase/:id',
        component: FacturepurchaseComponent,
        canActivate:[AuthGuard]
      },
      {
        path: 'facture-fournisseur',
        component: FactureFournisseurComponent,
        canActivate:[AuthGuard]
      },
      {
        path: 'facture-fournisseur/:id',
        component: FactureFournisseurComponent,
        canActivate:[AuthGuard]
      },
      {
        path: 'create-facture',
        component: CreateFactureFrsComponent,
        canActivate:[AuthGuard]
      },
      {
        path: 'create-facture/:id',
        component: CreateFactureFrsComponent,
        canActivate:[AuthGuard]
      },
      {
        path: 'sales',
        component: AddSaleComponent,
        canActivate:[AuthGuard]
      },
      {
        path: 'sales/:id',
        component: AddSaleComponent,
        canActivate:[AuthGuard]
      },
      {
        path: 'detail-sales/:id',
        component: DetailSaleComponent,
        canActivate:[AuthGuard]
      }
    ]
  },
];

export default OperationRouting;
