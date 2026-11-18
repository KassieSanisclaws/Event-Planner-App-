export type EventCategory =
| 'Personal'
| 'Work'
| 'Birthday'
| 'Appointments'
| 'Other';

export interface PlannerEvent {
    id: string,
    title: string,
    description: string,
    date: string,
    time: string,
    location: string,
    category: EventCategory,
    completed: boolean,
    createdAt: string,
}

export type EventInput = Pick<
PlannerEvent,
| 'title'
| 'description'
| 'date'
| 'time'
| 'location'
| 'category'
>;

export const EVENT_CATEGORIES: EventCategory[] = [
    'Personal',
    'Work',
    'Appointments',
    'Birthday',
    'Other'
];


