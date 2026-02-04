import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { InputSwitchModule } from 'primeng/inputswitch';
import { FileUploadModule } from 'primeng/fileupload';
import { SnapFilter } from '../../../../core/models/snap-filter.model';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

@Component({
  selector: 'app-filter-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    ToggleSwitchModule,
    FileUploadModule
  ],
  templateUrl: './filter-form.component.html',
  styleUrls: ['./filter-form.component.scss']
})
export class FilterFormComponent implements OnChanges {
  @Input() filter: SnapFilter | null = null;
  @Output() onSave = new EventEmitter<FormData>();
  @Output() onCancel = new EventEmitter<void>();

  filterForm: FormGroup;
  isEditMode = false;
  
  // Gestion de l'image
  imagePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      name: ['', [Validators.maxLength(100)]],
      snapchatUrl: ['', [Validators.required]],
      isActive: [false]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filter']) {
      if (this.filter) {
        // Mode édition
        this.isEditMode = true;
        this.filterForm.patchValue({
          name: this.filter.name || '',
          snapchatUrl: this.filter.snapchatUrl,
          isActive: this.filter.isActive
        });
        // Afficher l'image existante
        this.imagePreview = this.filter.imageUrl;
        this.selectedFile = null;
      } else {
        // Mode création
        this.isEditMode = false;
        this.filterForm.reset({
          name: '',
          snapchatUrl: '',
          isActive: true
        });
        this.imagePreview = null;
        this.selectedFile = null;
      }
    }
  }

  /**
   * Gestion de la sélection d'image
   */
  onFileSelect(event: any): void {
    const file = event.files[0];
    if (file) {
      this.selectedFile = file;

      // Générer un aperçu
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  /**
   * Supprimer l'image sélectionnée
   */
  removeImage(): void {
    this.selectedFile = null;
    this.imagePreview = this.isEditMode ? this.filter?.imageUrl || null : null;
  }

  /**
   * Soumettre le formulaire
   */
  submit(): void {
    if (this.filterForm.valid) {
      const formData = new FormData();

      // Ajouter les champs du formulaire
      const formValue = this.filterForm.value;
      
      if (formValue.name) {
        formData.append('name', formValue.name);
      }
      formData.append('snapchatUrl', formValue.snapchatUrl);
      formData.append('isActive', formValue.isActive.toString());

      // Ajouter l'image si sélectionnée
      if (this.selectedFile) {
        formData.append('image', this.selectedFile);
      }

      this.onSave.emit(formData);
    } else {
      // Marquer tous les champs comme touchés
      Object.keys(this.filterForm.controls).forEach(key => {
        this.filterForm.get(key)?.markAsTouched();
      });
    }
  }

  // Getters pour les validations
  get nameControl() { return this.filterForm.get('name'); }
  get snapchatUrlControl() { return this.filterForm.get('snapchatUrl'); }
}