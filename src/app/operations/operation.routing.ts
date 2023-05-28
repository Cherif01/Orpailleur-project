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
      },
      {
        path: 'init-purchase/:id',
        component: InitPurchaseComponent,
      },
      {
        path: 'add-purchase',
        component: FournisseurachatComponent,
      },
      {
        path: 'add-purchase/:id',
        component: AddPurchaseComponent,
      },
      {
        path: 'detail-purchase/:id',
        component: DetailPurchaseComponent,
      },
      {
        path: 'facturepurchase/:id',
        component: FacturepurchaseComponent,
      },
      {
        path: 'facture-fournisseur',
        component: FactureFournisseurComponent
      },
      {
        path: 'facture-fournisseur/:id',
        component: FactureFournisseurComponent,
      },
      {
        path: 'create-facture',
        component: CreateFactureFrsComponent,
      },
      {
        path: 'create-facture/:id',
        component: CreateFactureFrsComponent,
      },
      {
        path: 'sales',
        component: AddSaleComponent,
      },
      {
        path: 'sales/:id',
        component: AddSaleComponent,
      },
      {
        path: 'detail-sales/:id',
        component: DetailSaleComponent
      }
    ]
  },
];

export default OperationRouting;
