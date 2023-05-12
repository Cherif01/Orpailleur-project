import { Routes } from "@angular/router";
import { AddLotComponent } from "./add-lot/add-lot.component";
import { DetailLotComponent } from "./detail-lot/detail-lot.component";
import { ListLotComponent } from "./list-lot/list-lot.component";


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
                path: 'detail-lot/:id',
                component: DetailLotComponent,
            }
        ]
    },
];

export default LotRouting;
