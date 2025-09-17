import { Routes } from "@angular/router";
import { AuthGuard } from "../user/auth.guard";
import { UtilisateurComponent } from "./utilisateur/utilisateur.component";
import { AccessComponent } from "./access/access.component";

const SettingsRouting: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: UtilisateurComponent,
                canActivate:[AuthGuard]
            },
            {
                path: 'user',
                component: UtilisateurComponent,
                canActivate:[AuthGuard]
            },
            {
                path: 'menu',
                component: AccessComponent,
                canActivate:[AuthGuard]
            }
        ]
    },
];

export default SettingsRouting;
