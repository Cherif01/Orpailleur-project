import { Routes } from "@angular/router"
import { AddPurchaseComponent } from "./purchase/add-purchase/add-purchase.component"
import { DetailPurchaseComponent } from "./purchase/detail-purchase/detail-purchase.component"
import { FournisseurachatComponent } from "./purchase/fournisseurachat/fournisseurachat.component"
import { ListPurchaseComponent } from "./purchase/list-purchase/list-purchase.component"
import { AddSaleComponent } from "./sales/add-sale/add-sale.component"
import { DetailSaleComponent } from "./sales/detail-sale/detail-sale.component"
import { ListSaleComponent } from "./sales/list-sale/list-sale.component"
import { ClientventeComponent } from "./sales/clientvente/clientvente.component"
import { FactureclientComponent } from "./sales/factureclient/factureclient.component"
import { FactureFournisseurComponent } from "./purchase/facture-fournisseur/facture-fournisseur.component"
import { InitPurchaseComponent } from "./purchase/init-purchase/init-purchase.component"
import { FacturepurchaseComponent } from "./purchase/facturepurchase/facturepurchase.component"
import { CreateFactureFrsComponent } from "./purchase/create-facture-frs/create-facture-frs.component"
import { FixingClientComponent } from "./sales/fixing/fixing-client/fixing-client.component"
import { AddFixingClientComponent } from "./sales/fixing/add-fixing-client/add-fixing-client.component"


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
        component: ListSaleComponent,
      },
      {
        path: 'add-sales',
        component: AddSaleComponent,
      },
      {
        path: 'add-sales/:id',
        component: AddSaleComponent,
      },
      {
        path: 'detail-sales/:id',
        component: DetailSaleComponent
      },
      {
        path: 'client-vente',
        component: ClientventeComponent
      },
      {
        path: 'list-fixing-client',
        component: FixingClientComponent
      },
      {
        path: 'add-fixing-client',
        component: AddFixingClientComponent
      },
      {
        path: 'facture-client',
        component: FactureclientComponent
      }
    ]
  },
];

export default OperationRouting;
