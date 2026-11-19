import { Injectable, computed, signal } from '@angular/core';
import { PlannerEvent, EventInput } from '../models/event.model';

@Injectable({
  providedIn: 'root'
})

export class EventService {
  private readonly storagekey = 'personal-event-planner-events';
  private readonly eventState = signal<PlannerEvent[]>(
    this.loadEvents()
  );

  readonly events = this.eventState.asReadonly();
  readonly totalCount = computed(() => this.eventState().length);

  readonly completedCount = computed(() => this.eventState().filter(e => e.completed).length);

  readonly upcomingCount = computed(() => {
    const now = new Date();

    return this.eventState().filter(e => !e.completed && this.eventDateTime(e) < now).length;
  });

   readonly pastCount = computed(() => {
    const now = new Date();

    return this.eventState().filter(e => 
      !e.completed && this.eventDateTime(e) < now).length;
   });

  getEventById(id: string): PlannerEvent | undefined {
    return this.eventState().find(e => e.id === id);
  }

  addEvent(input: EventInput): PlannerEvent {
    const newEvent: PlannerEvent = {
      ...input,
      id: crypto.randomUUID(),
      completed: false,
      createdAt: new Date().toISOString()
    };

    this.eventState.update(currnt => {
      const updated = [...currnt, newEvent];
      this.saveEvents(updated);
      return updated;
    });

    return newEvent;
  }

  updateEvent(id: string, input: EventInput): boolean {
    if (!this.getEventById(id)) {
      return false;
    }

    this.eventState.update(currnt => {
      const updated = currnt.map(e => 
        e.id === id
        ? { ...e, ...input }
        : e
      );

      this.saveEvents(updated);
      return updated;
    });
    return true;
  }

  toggleCompleted(id: string): void {
    this.eventState.update(currnt => {
      const updated = currnt.map(e => 
        e.id === id
        ? { ...e, completed: !e.completed }
        : e
      );

      this.saveEvents(updated);
      return updated;
    });
  }

  deleteEvent(id: string): void {
    this.eventState.update(currnt => {
      const updated = currnt.filter(e => e.id !== id);
      this.saveEvents(updated);
      return updated;
    });
  }

  private eventDateTime(event: PlannerEvent): Date {
    return new Date(`${event.date}T${event.time}:00`);
  }

  private loadEvents(): PlannerEvent[] {
    try {
       const saved = localStorage.getItem(this.storagekey);
       const parsed: unknown = saved ? JSON.parse(saved) : [];

       if (!Array.isArray(parsed)) {
        return [];
       }

       return parsed.filter(
        (item): item is PlannerEvent => 
          item !== null && 
          typeof item === 'object' &&
          typeof item.id === 'string' &&
          typeof item.title === 'string' &&
          typeof item.description === 'string' &&
          typeof item.date === 'string' && 
          typeof item.time === 'string' && 
          typeof item.location === 'string' &&
          typeof item.category === 'string' &&
          typeof item.completed === 'boolean' &&
          typeof item.createdAt === 'string'
       );
    } catch (err) {
       console.error('Unable To Load Your Saved Events:', err);
       return [];
    }
  }

  private saveEvents(events: PlannerEvent[]): void {
    try {
       localStorage.setItem(
        this.storagekey,
        JSON.stringify(events)
       );
    } catch (err) {
      console.error('Unable To Save Events:', err);
    }
  }
}
