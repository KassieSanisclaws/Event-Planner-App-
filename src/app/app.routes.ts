import { Routes } from '@angular/router';

export const routes: Routes = [
    {
    path: '',
    loadComponent: () => import ('./pages/event-list/event-list.component').then(m => m.EventListComponent),
    title: 'My Events'
    },
    {
    path: 'events/new',
    loadComponent: () => import ('./pages/event-editor/event-editor.component').then(m => m.EventEditorComponent),
    title: 'Create Event'
    },
    {
    path: 'events/:id/edit',
    loadComponent: () => import ('./pages/event-editor/event-editor.component').then(m => m.EventEditorComponent),
    title: 'Edit Event'
    },
    {
    path: 'events/:id',
    loadComponent: () => import ('./pages/event-details/event-details.component').then(m => m.EventDetailsComponent),
    title: 'Event Details'
    },
    {
    path: '**',
    redirectTo: ''
    }
];
