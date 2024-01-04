import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { LoadTestComponent } from './components/load-test/load-test.component';
import { ProjectIndexComponent } from './components/project/project-index/project-index.component';
import { ProjectCreateComponent } from './components/project/project-create/project-create.component';
import { ProjectShowComponent } from './components/project/project-show/project-show.component';
import { ProjectUpdateComponent } from './components/project/project-update/project-update.component';
import { IndexScenarioComponent } from './components/scenario/index-scenario/index-scenario.component';
import { CreateScenarioComponent } from './components/scenario/create-scenario/create-scenario.component';
import { ShowScenarioComponent } from './components/scenario/show-scenario/show-scenario.component';
import { UpdateScenarioComponent } from './components/scenario/update-scenario/update-scenario.component';
import { CreateTestComponent } from './components/test-case/create-test/create-test.component';
import { IndexTestComponent } from './components/test-case/index-test/index-test.component';
import { ShowTestComponent } from './components/test-case/show-test/show-test.component';
import { UpdateTestComponent } from './components/test-case/update-test/update-test.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

const routes: Routes = [
  { path: '', redirectTo: '/main', pathMatch: 'full' }, // default route
  { path: 'main', component: MainComponent },
  { path: 'load-test', component: LoadTestComponent },
  { path: 'project', component: ProjectIndexComponent },
  { path: 'project/create', component: ProjectCreateComponent },
  { path: 'project/show/:id', component: ProjectShowComponent },
  { path: 'project/update/:id', component: ProjectUpdateComponent },
  { path: 'scenario', component: IndexScenarioComponent },
  { path: 'scenario/create/:id', component: CreateScenarioComponent },
  { path: 'scenario/show/:id', component: ShowScenarioComponent },
  { path: 'scenario/update/:id', component: UpdateScenarioComponent },
  { path: 'testcase', component: IndexTestComponent },
  { path: 'testcase/create/:id', component: CreateTestComponent },
  { path: 'testcase/show/:id', component: ShowTestComponent },
  { path: 'testcase/update/:id', component: UpdateTestComponent },
  { path: 'testcase/start/:id', component: LoadTestComponent },
  { path: 'dashboard/show/:id', component: DashboardComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
