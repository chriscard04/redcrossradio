import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../../../shared/shared.module';
import { VolunteersComponent } from './volunteers.component';


export const routes = [
    {
        path: '',
        data: { title: 'Acerca de | Cruz Roja Radio' },
        component: VolunteersComponent,
    }
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        SharedModule,
    ],
    declarations: [VolunteersComponent],
    providers: []
})
export class VolunteersModule { }
