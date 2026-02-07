import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { FilterService } from '../../core/services/filter.service';
import { Filter } from '../../core/models/filter.model';
import { FilterListComponent } from './components/filter-list/filter-list.component';
import { FilterFormComponent } from './components/filter-form/filter-form.component';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    ToastModule,
    ConfirmDialogModule,
    FilterListComponent,
    FilterFormComponent
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit {
  private filterService = inject(FilterService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  // État des données
  filters = signal<Filter[]>([]);
  isLoading = signal<boolean>(false);

  // État de l'UI
  displayDialog = false;
  selectedFilter = signal<Filter | null>(null);
  isEditMode = signal<boolean>(false);

  ngOnInit(): void {
    this.loadFilters();
  }

  loadFilters(): void {
    this.isLoading.set(true);
    this.filterService.getAllFilters().subscribe({
      next: (res) => {
        this.filters.set(res.data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erreur chargement filtres:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de charger les filtres'
        });
        this.isLoading.set(false);
      }
    });
  }

  openCreateDialog(): void {
    this.isEditMode.set(false);
    this.selectedFilter.set(null);
    this.displayDialog = true;
  }

  openEditDialog(filter: Filter): void {
    this.isEditMode.set(true);
    this.selectedFilter.set(filter);
    this.displayDialog = true;
  }

  closeDialog(): void {
    this.displayDialog = false;
    this.selectedFilter.set(null);
  }

  handleSave(formData: FormData): void {
    if (this.isEditMode() && this.selectedFilter()) {
      // Mode édition
      this.filterService.updateFilter(this.selectedFilter()!.id, formData).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Filtre mis à jour'
          });
          this.closeDialog();
          this.loadFilters();
        },
        error: (err) => {
          console.error('Erreur mise à jour:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Impossible de mettre à jour le filtre'
          });
        }
      });
    } else {
      // Mode création
      this.filterService.createFilter(formData).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Filtre créé'
          });
          this.closeDialog();
          this.loadFilters();
        },
        error: (err) => {
          console.error('Erreur création:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Impossible de créer le filtre'
          });
        }
      });
    }
  }

  handleDelete(id: number): void {
    this.confirmationService.confirm({
      message: 'Voulez-vous vraiment supprimer ce filtre ?',
      header: 'Confirmation de suppression',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Supprimer',
      rejectLabel: 'Annuler',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.filterService.deleteFilter(id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Supprimé',
              detail: 'Filtre supprimé avec succès'
            });
            this.loadFilters();
          },
          error: (err) => {
            console.error('Erreur suppression:', err);
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Impossible de supprimer le filtre'
            });
          }
        });
      }
    });
  }

  handleToggleActive(filter: Filter): void {
    const newStatus = !filter.isActive;
    
    // Créer un FormData avec juste isActive
    const formData = new FormData();
    formData.append('isActive', newStatus.toString());

    this.filterService.updateFilter(filter.id, formData).subscribe({
      next: () => {
        this.messageService.add({
          severity: newStatus ? 'success' : 'warn',
          summary: newStatus ? 'Activé' : 'Désactivé',
          detail: `Le filtre a été ${newStatus ? 'activé' : 'désactivé'}`
        });
        this.loadFilters();
      },
      error: (err) => {
        console.error('Erreur toggle:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de modifier le statut'
        });
      }
    });
  }
}