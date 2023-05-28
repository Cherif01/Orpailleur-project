import { Routes } from "@angular/router"
import { LoginComponent } from "./login/login.component";


const LoginRouting: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: '/notfound',
        pathMatch: 'full'
      },
      {
        path: 'login',
        component: LoginComponent,
      }
    ]
  },
];

export default LoginRouting;
