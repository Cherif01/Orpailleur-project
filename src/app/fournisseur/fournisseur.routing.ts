import { Routes } from "@angular/router";
import { AddFournisseurComponent } from "./add-fournisseur/add-fournisseur.component";
import { DetailFournisseurComponent } from "./detail-fournisseur/detail-fournisseur.component";
import { ListFournisseurComponent } from "./list-fournisseur/list-fournisseur.component";
import { FactureachatComponent } from "./facture/factureachat/factureachat.component";
import { FactureventeComponent } from "./facture/facturevente/facturevente.component";
import { SituationFournisseurComponent } from "./situation-fournisseur/situation-fournisseur.component";

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
            },
            {
                path: 'add-fournisseur',
                component: AddFournisseurComponent,
            },
            {
                path: 'detail-fournisseur/:id',
                component: DetailFournisseurComponent,
            },
            {
                path: 'facture-achat/:id',
                component: FactureachatComponent,
            },
            {
                path: 'facture-vente/:id',
                component: FactureventeComponent,
            },
            {
                path: 'situation-monetaire',
                component: SituationFournisseurComponent,
            },
            {
                path: 'situation-monetaire/:id',
                component: SituationFournisseurComponent,
            }
        ]
    },
];

export default FournisseurRouting;
