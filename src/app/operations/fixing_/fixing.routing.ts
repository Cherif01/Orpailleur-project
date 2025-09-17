import { Routes } from "@angular/router"
import { AddFixingComponent } from "./add-fixing/add-fixing.component";
import { ListFixingComponent } from "./list-fixing/list-fixing.component";
import { BourseViewComponent } from "./bourse-view/bourse-view.component";
import { FixingProvisoireComponent } from "./fixing-provisoire/fixing-provisoire.component";

const FixingRouting: Routes = [
    {
        path: '',
        children: [

            {
                path: '',
                redirectTo: '/notfound',
                pathMatch: 'full'
            },
            {
                path: 'bourse-view',
                component: BourseViewComponent,
            },
            {
                path: 'list-fixing',
                component: ListFixingComponent,
            },
            {
                path: 'add-fixing',
                component: AddFixingComponent,
            },
            {
                path: 'fixing-provisoire',
                component: FixingProvisoireComponent,
            }
        ]
    },
];

export default FixingRouting;
