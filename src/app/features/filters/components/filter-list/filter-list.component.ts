import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { Filter } from '../../../../core/models/filter.model';

@Component({
  selector: 'app-filter-list',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    TagModule,
    TooltipModule
  ],
  templateUrl: './filter-list.component.html',
  styleUrls: ['./filter-list.component.scss']
})
export class FilterListComponent {
  @Input() filters: Filter[] = [];
  @Input() loading: boolean = false;

  @Output() onAdd = new EventEmitter<void>();
  @Output() onEdit = new EventEmitter<Filter>();
  @Output() onDelete = new EventEmitter<number>();
  @Output() onToggleActive = new EventEmitter<Filter>();

  getSeverity(active: boolean): 'success' | 'danger' {
    return active ? 'success' : 'danger';
  }

  openSnapchatLink(url: string): void {
    window.open(url, '_blank');
  }
}