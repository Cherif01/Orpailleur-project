import { Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { AuthGuard } from "../user/auth.guard";

export const homeRouting:Routes = [
    {
        path: '',
        component: HomeComponent,
        canActivate:[AuthGuard]
    },
    // {
    //     path: 'home',
    //     component: HomeComponent
    // }
]
