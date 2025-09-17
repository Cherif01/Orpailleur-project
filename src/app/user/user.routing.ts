import { Routes } from "@angular/router"
import { LoginComponent } from "./login/login.component";
import { HelpAppComponent } from "./help-app/help-app.component";
import { ProfileComponent } from "./profile/profile.component";


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
      },
      {
        path: 'profile/:id',
        component: ProfileComponent
      },
      {
        path: 'help-me',
        component: HelpAppComponent,
      }
    ]
  },
];

export default LoginRouting;
