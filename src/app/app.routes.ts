import { Routes } from '@angular/router';
import { LayoutComponent } from './components/reusable_components/layout-component/layout-component';
import { HomeComponent } from './components/page_components/home-component/home-component';
import { TemplateDrivenBrandComponent } from './components/page_components/template-driven-brand-component/template-driven-brand-component';
import { ReactiveBrandComponent } from './components/page_components/reactive-brand-component/reactive-brand-component';

export const routes: Routes = [
    {
        //root route
        path: '', component: LayoutComponent,

        //nested route
        children: [
            { path: '', component: HomeComponent },
            { path: 'temp_brand', component: TemplateDrivenBrandComponent },
            { path: 'react_brand', component: ReactiveBrandComponent }
        ]
    }
];
