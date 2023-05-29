import { Routes } from "@angular/router";
import { AddLotComponent } from "./add-lot/add-lot.component";
import { DetailLotComponent } from "./detail-lot/detail-lot.component";
import { ListLotComponent } from "./list-lot/list-lot.component";
import { AuthGuard } from "../user/auth.guard";


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
                canActivate:[AuthGuard]
            },
            {
                path: 'add-lot',
                component: AddLotComponent,
                canActivate:[AuthGuard]
            },
            {
                path: 'detail-lot/:id',
                component: DetailLotComponent,
                canActivate:[AuthGuard]
            }
        ]
    },
];

export default LotRouting;
