import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { EventService } from '../../services/event.service';
import { PlannerEvent } from '../../models/event.model';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './event-details.component.html',
  styleUrl: './event-details.component.css'
})

export class EventDetailsComponent {
   private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly eventService = inject(EventService);

  event?: PlannerEvent;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.event = this.eventService.getEventById(id);
    }
  }

  toggleCompleted(): void {
    if (!this.event) {
      return;
    }

    this.eventService.toggleCompleted(this.event.id);

    this.event = this.eventService.getEventById(this.event.id);
  }

  deleteEvent(): void {
    if (!this.event) {
      return;
    }

    const confirmed = window.confirm(
      `Delete "${this.event.title}" permanently?`
    );

    if (confirmed) {
      this.eventService.deleteEvent(this.event.id);
      this.router.navigate(['/']);
    }
  }
}
