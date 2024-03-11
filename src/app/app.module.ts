import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import AppRouting from './app.routing';
import { DemoMaterialModule } from './demo-material-module';
import { MatIconModule } from '@angular/material/icon';
import { NavbarComponent } from './public/navbar/navbar.component';
import { SidebarComponent } from './public/sidebar/sidebar.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HttpClientModule } from '@angular/common/http';
import { ErrorComponent } from './error/error/error.component';
import { DataTablesModule } from 'angular-datatables';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {CdkAccordionModule} from '@angular/cdk/accordion';
import { DialogUpdateFixingInfoComponent } from './public/dialogs/dialog-update-fixing-info/dialog-update-fixing-info.component';
import { DialogAddClientComponent } from './public/dialogs/dialog-add-client/dialog-add-client.component';
import { DialogConvertMoneyComponent } from './public/dialogs/dialog-convert-money/dialog-convert-money.component';
import { LoginComponent } from './user/login/login.component';
import { LogoutComponent } from './user/logout/logout.component';
import { AuthGuard } from './user/auth.guard';
import { MatDialogModule } from '@angular/material/dialog';
import { EnteteComponent } from './public/entete/entete.component';
import { ProfileComponent } from './user/profile/profile.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
// DATA-TABLES


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SidebarComponent,
    ErrorComponent,
    DialogUpdateFixingInfoComponent,
    DialogAddClientComponent,
    DialogConvertMoneyComponent,
    LoginComponent,
    LogoutComponent,
    EnteteComponent,
    ProfileComponent,
  ],
  imports: [
    BrowserModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatToolbarModule,
    CdkAccordionModule,
    DemoMaterialModule,
    HttpClientModule,
    DataTablesModule,
    CommonModule,
    MatAutocompleteModule,
    MatCardModule,
    FormsModule,
    MatIconModule,
    ReactiveFormsModule,
    MatDialogModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(AppRouting,{relativeLinkResolution:'legacy'}),
  ],
  providers: [
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
