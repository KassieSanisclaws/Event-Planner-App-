import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EventService } from '../../services/event.service';
import { EventCardComponent } from '../../components/event-card/event-card.component';
import { EventCategory, EVENT_CATEGORIES, PlannerEvent } from '../../models/event.model';

type EventStatusFIlter =
| 'All'
| 'Upcoming'
| 'Past'
| 'Completed';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [RouterLink, EventCardComponent],
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.css'
})

export class EventListComponent {
   readonly eventService = inject(EventService);
   readonly categories = EVENT_CATEGORIES;
   readonly searchTerm = signal('');
   readonly selectedCategory = signal('All');
   readonly selectedStatus = signal<EventStatusFIlter>('All');
   readonly filterEvents = computed(() => {
       const query = this.searchTerm().trim().toLowerCase();
       const category = this.selectedCategory();
       const status = this.selectedStatus();
       const now = new Date();

    return this.eventService.events()
           .filter(e => {
            const matchesSearch = [
              e.title,
              e.description,
              e.location
            ].join(' ').toLowerCase().includes(query);

            const matchesCategory = category === 'All' || e.category === category;

            const eventDate = new Date(
              `${e.date}T${e.time}:00`
            );

            let matchesStatus = true;

            if (status === 'Upcoming'){
              matchesStatus = !e.completed && eventDate >= now;
            } else if (status === 'Past'){
              matchesStatus = !e.completed && eventDate < now;
            } else if (status === 'Completed'){
              matchesStatus = e.completed;
            }

            return matchesSearch && matchesCategory && matchesStatus;
           })
           .sort((a, b) => {
                const first = `${a.date}T${a.time}`;
                const second = `${b.date}T${b.time}`;
                return first.localeCompare(second);
           });
   });

   changeSearch(e: Event): void {
    const input = e.target as HTMLInputElement;
    this.searchTerm.set(input.value);
   }

   changeCategory(e: Event): void {
    const select = e.target as HTMLSelectElement;
    this.selectedCategory.set(select.value);
   }

   changeStatus(e: Event): void {
     const select = e.target as HTMLSelectElement;
     this.selectedStatus.set(select.value as EventStatusFIlter);
   }

   toggleCompleted(id: string): void {
       this.eventService.toggleCompleted(id);
   }

   deleteEvent(id: string): void {
     const event = this.eventService.getEventById(id);
     if (!event) {
      return;
     }

     const confirmed = window.confirm(
      `Are You Sure You Want To Delete This "${event.title}"?`
     );

     if (confirmed) {
      this.eventService.deleteEvent(id);
     }
   }
}
