import { ModuleWithProviders }  from '@angular/core';
import { RouterModule } from '@angular/router';
import { ExampleComponent } from './example/example.component';

export const routing: ModuleWithProviders = RouterModule.forChild([
  { path: 'component', component: ExampleComponent }
]);
