import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';

//import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MainComponent } from './components/main/main.component';
import { LoadTestComponent } from './components/load-test/load-test.component';

import { ProjectIndexComponent } from './components/project/project-index/project-index.component';
import { ProjectCreateComponent } from './components/project/project-create/project-create.component';
import { ProjectShowComponent } from './components/project/project-show/project-show.component';
import { ProjectUpdateComponent } from './components/project/project-update/project-update.component';
import { AlertComponent } from './components/shared/alert/alert.component';

const routes: Routes = [
  { path: '', redirectTo: '/main', pathMatch: 'full' }, // default route
  { path: 'main', component: MainComponent },
  { path: 'load-test', component: LoadTestComponent },
  { path: 'project', component: ProjectIndexComponent },
  { path: 'project/create', component: ProjectCreateComponent }
];


@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    NavbarComponent,
    FooterComponent,
    MainComponent,
    LoadTestComponent,
    ProjectIndexComponent,
    ProjectCreateComponent,
    AlertComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(routes),
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
