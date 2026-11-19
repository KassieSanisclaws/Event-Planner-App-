import { Routes } from '@angular/router';
import { EventListComponent } from './pages/event-list/event-list.component';
import { EventEditorComponent } from './pages/event-editor/event-editor.component';
import { EventDetailsComponent } from './pages/event-details/event-details.component';

export const routes: Routes = [
    {
    path: '',
    component: EventListComponent,
    title: 'My Event'
    },
    {
    path: 'events/new',
    component: EventEditorComponent,
    title: 'Create Event'
    },
    {
    path: 'events/:id/edit',
    component: EventEditorComponent,
    title: 'Edit Event'
    },
    {
    path: 'events/:id',
    component: EventDetailsComponent,
    title: 'Event Details'
    },
    {
    path: '**',
    redirectTo: ''
    }
];
