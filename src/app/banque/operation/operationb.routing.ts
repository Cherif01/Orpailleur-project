import { Routes } from "@angular/router";
import { DepotComponent } from "./depot/depot.component";
import { RetraitComponent } from "./retrait/retrait.component";
import { VirementComponent } from "./virement/virement.component";


const OperationBancaireRouting: Routes = [
    {
        path: '',
        children: [            
            {
                path: '',
                redirectTo: '/notfound',
                pathMatch: 'full'
            },
            {
                path: 'depot',
                component: DepotComponent,
            },
            {
                path: 'retrait',
                component: RetraitComponent,
            },
            {
                path: 'virement',
                component: VirementComponent,
            }
        ]
    },
];

export default OperationBancaireRouting;