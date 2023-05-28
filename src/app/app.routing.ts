import { Routes } from "@angular/router";

const AppRouting: Routes = [
    {
        path: '',
        children: [
            {
                path: 'home',
                loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
            },
            {
                path: 'lot',
                loadChildren: () => import('./lot/lot.module').then(m => m.LotModule)
            },
            {
                path: 'operation',
                loadChildren: () => import('./operations/operation.module').then(m => m.OperationModule)
            },
            {
                path: 'etat-entreprise',
                loadChildren: () => import('./etat-entreprise/entreprise-state.module').then(m => m.EntrepriseStateModule)
            },
            {
                path: 'fournisseur',
                loadChildren: () => import('./fournisseur/fournisseur.module').then(m => m.FournisseurModule)
            },
            {
                path: 'client',
                loadChildren: () => import('./client/client.module').then(m => m.ClientModule)
            },
            {
                path: 'fixing',
                loadChildren: () => import('./operations/fixing_/fixing.module').then(m => m.FixingModule)
            },
            {
                path: 'bank',
                loadChildren: () => import('./banque/banque.module').then(m => m.BanqueModule)
            },
            {
                path: 'operation-bank',
                loadChildren: () => import('./banque/operation/operationb.module').then(m => m.OperationbModule)
            },
            {
                path: 'rapport',
                loadChildren: () => import('./rapport/rapport.module').then(m => m.rapportModule)
            },
            {
                path: 'user',
                loadChildren: () => import('./user/user.module').then(m => m.UserModule)
            },
            {
                path: 'notfound',
                loadChildren: () => import('./error/error.module').then(m => m.ErrorModule)
            },
            {
                path: '',
                redirectTo: 'login',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: '**',
        redirectTo: 'notfound',
    }
];
export default AppRouting;
