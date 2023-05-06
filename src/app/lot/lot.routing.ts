import { Routes } from "@angular/router";
import { AddLotComponent } from "./add-lot/add-lot.component";
import { DetailLotComponent } from "./detail-lot/detail-lot.component";
import { ListLotComponent } from "./list-lot/list-lot.component";
import { AttributionComponent } from "./attribution/attribution.component";


const LotRouting: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                redirectTo: '/notfound',
                pathMatch: 'full'
            },
            {
                path: 'list-lot',
                component: ListLotComponent,
            },
            {
                path: 'add-lot',
                component: AddLotComponent,
            },
            {
                path: 'attribution-lot',
                component: AttributionComponent,
            },
            {
                path: 'attribution-lot/:id',
                component: AttributionComponent,
            },
            {
                path: 'detail-lot/:id',
                component: DetailLotComponent,
            }
        ]
    },
];

export default LotRouting;
