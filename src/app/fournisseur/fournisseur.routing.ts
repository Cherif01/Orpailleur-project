import { Routes } from "@angular/router";
import { AddFournisseurComponent } from "./add-fournisseur/add-fournisseur.component";
import { DetailFournisseurComponent } from "./detail-fournisseur/detail-fournisseur.component";
import { ListFournisseurComponent } from "./list-fournisseur/list-fournisseur.component";
import { FactureachatComponent } from "./facture/factureachat/factureachat.component";
import { FactureventeComponent } from "./facture/facturevente/facturevente.component";
import { SituationFournisseurComponent } from "./situation-fournisseur/situation-fournisseur.component";
import { AuthGuard } from "../user/auth.guard";

const FournisseurRouting: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                redirectTo: '/notfound',
                pathMatch: 'full'
            },
            {
                path: 'list-fournisseur',
                component: ListFournisseurComponent,
                canActivate:[AuthGuard]
            },
            {
                path: 'add-fournisseur',
                component: AddFournisseurComponent,
                canActivate:[AuthGuard]
            },
            {
                path: 'detail-fournisseur/:id',
                component: DetailFournisseurComponent,
                canActivate:[AuthGuard]
            },
            {
                path: 'facture-achat/:id',
                component: FactureachatComponent,
                canActivate:[AuthGuard]
            },
            {
                path: 'facture-vente/:id',
                component: FactureventeComponent,
                canActivate:[AuthGuard]
            },
            {
                path: 'situation-monetaire',
                component: SituationFournisseurComponent,
                canActivate:[AuthGuard]
            },
            {
                path: 'situation-monetaire/:id',
                component: SituationFournisseurComponent,
                canActivate:[AuthGuard]
            }
        ]
    },
];

export default FournisseurRouting;
