import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MdmModulesComponent } from 'src/app/Views/mdm-modules/mdm-modules.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: MdmModulesComponent },
  {
    path: 'mdm',
    loadChildren: () =>
      import('../layout/layout.module').then((m) => m.LayoutModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectionRoutingModule {}
