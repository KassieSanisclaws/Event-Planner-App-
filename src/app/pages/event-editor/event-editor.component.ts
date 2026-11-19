import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EventService } from '../../services/event.service';
import { EventFormComponent } from '../../components/event-form/event-form.component';
import { EventInput, PlannerEvent } from '../../models/event.model';

@Component({
  selector: 'app-event-editor',
  standalone: true, 
  imports: [RouterLink, EventFormComponent],
  templateUrl: './event-editor.component.html',
  styleUrl: './event-editor.component.css'
})

export class EventEditorComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly eventService = inject(EventService);

  editingEvent?: PlannerEvent;
  isEditing = false;
  notFound = false;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.isEditing = true;
      this.editingEvent = this.eventService.getEventById(id);

      if (!this.editingEvent) {
        this.notFound = true;
      }
    }
  }

  saveEvent(input: EventInput): void {
    if (this.isEditing) {
      if (!this.editingEvent) {
        return;
      }

      const updated = this.eventService.updateEvent(
        this.editingEvent.id,
        input
      );

      if (updated) {
        this.router.navigate([
          '/events',
          this.editingEvent.id
        ]);
      }
    } else {
      const newEvent = this.eventService.addEvent(input);

      this.router.navigate([
        '/events',
        newEvent.id
      ]);
    }
  }

  cancel(): void {
    this.router.navigate(['/']);
  }
}
