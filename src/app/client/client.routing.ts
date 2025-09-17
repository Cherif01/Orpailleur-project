import { Routes } from "@angular/router";
import { DetailClientComponent } from "./detail-client/detail-client.component";
import { ListClientComponent } from "./list-client/list-client.component";
import { AuthGuard } from "../user/auth.guard";


const ClientRouting: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                redirectTo: '/notfound',
                pathMatch: 'full'
            },
            {
                path: 'list-client',
                component: ListClientComponent,
                canActivate:[AuthGuard]
            },
            {
                path: 'detail-client/:id',
                component: DetailClientComponent,
                canActivate:[AuthGuard]
            }
        ]
    },
];

export default ClientRouting;
