import { Routes } from "@angular/router";
import { AddAccountComponent } from "./add-account/add-account.component";
import { DetailAccountComponent } from "./detail-account/detail-account.component";
import { ListAccountComponent } from "./list-account/list-account.component";


const BanqueRouting: Routes = [
    {
        path: '',
        children: [            
            {
                path: '',
                redirectTo: '/notfound',
                pathMatch: 'full'
            },
            {
                path: 'list-account',
                component: ListAccountComponent,
            },
            {
                path: 'add-account',
                component: AddAccountComponent,
            },
            {
                path: 'detail-account/:id',
                component: DetailAccountComponent,
            }
        ]
    },
];

export default BanqueRouting;