import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { MainComponent } from './components/main/main.component';
import { LoadTestComponent } from './components/load-test/load-test.component';
import { ProjectIndexComponent } from './components/project/project-index/project-index.component';
import { ProjectCreateComponent } from './components/project/project-create/project-create.component';
import { ProjectShowComponent } from './components/project/project-show/project-show.component';
import { ProjectUpdateComponent } from './components/project/project-update/project-update.component';
import { AlertComponent } from './components/shared/alert/alert.component';
import { CreateScenarioComponent } from './components/scenario/create-scenario/create-scenario.component';
import { IndexScenarioComponent } from './components/scenario/index-scenario/index-scenario.component';
import { ShowScenarioComponent } from './components/scenario/show-scenario/show-scenario.component';
import { UpdateScenarioComponent } from './components/scenario/update-scenario/update-scenario.component';
import { CreateTestComponent } from './components/test-case/create-test/create-test.component';
import { IndexTestComponent } from './components/test-case/index-test/index-test.component';
import { ShowTestComponent } from './components/test-case/show-test/show-test.component';
import { UpdateTestComponent } from './components/test-case/update-test/update-test.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

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
    ProjectShowComponent,
    ProjectUpdateComponent,
    AlertComponent,
    CreateScenarioComponent,
    IndexScenarioComponent,
    ShowScenarioComponent,
    UpdateScenarioComponent,
    CreateTestComponent,
    IndexTestComponent,
    ShowTestComponent,
    UpdateTestComponent,
    DashboardComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
