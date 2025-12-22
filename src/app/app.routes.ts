import { Routes } from '@angular/router';
import { LayoutComponent } from './components/reusable_components/layout-component/layout-component';
import { HomeComponent } from './components/page_components/home-component/home-component';
import { BrandComponent } from './components/page_components/brand-component/brand-component';

export const routes: Routes = [
    {
        //root route
        path: '', component: LayoutComponent,

        //nested route
        children: [
            { path: '', component: HomeComponent },
            { path: 'brand', component: BrandComponent }
        ]
    }
];
