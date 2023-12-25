import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { LoadTestComponent } from './components/load-test/load-test.component';
import { ProjectIndexComponent } from './components/project/project-index/project-index.component';
import { ProjectCreateComponent } from './components/project/project-create/project-create.component';
import { ProjectShowComponent } from './components/project/project-show/project-show.component';


const routes: Routes = [
  { path: '', redirectTo: '/main', pathMatch: 'full' }, // default route
  { path: 'main', component: MainComponent },
  { path: 'load-test', component: LoadTestComponent },
  { path: 'project', component: ProjectIndexComponent },
  { path: 'project/create', component: ProjectCreateComponent },
  { path: 'project/show/:id', component: ProjectShowComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
