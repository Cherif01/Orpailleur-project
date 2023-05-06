import { Routes } from "@angular/router";
import { DetailClientComponent } from "./detail-client/detail-client.component";
import { ListClientComponent } from "./list-client/list-client.component";


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
            },
            {
                path: 'detail-client/:id',
                component: DetailClientComponent,
            }
        ]
    },
];

export default ClientRouting;
