import { Routes } from '@angular/router';
import { LayoutComponent } from './components/reusable_components/layout-component/layout-component';

export const routes: Routes = [
    {
        //root route
        path: '', component: LayoutComponent,

        //nested route
        children: [
            // TODO
        ]
    }
];
