import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { PlannerEvent } from '../../models/event.model';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './event-card.component.html',
  styleUrl: './event-card.component.css'
})
export class EventCardComponent {
    @Input({ required: true }) event!: PlannerEvent;
    @Output() deleteRequested = new EventEmitter<string>();
    @Output() completionRequested = new EventEmitter<string>();

    requestDelete(): void {
      this.deleteRequested.emit(this.event.id);
    }

    toggleCompleted(): void {
      this.completionRequested.emit(this.event.id);
    }
}
