import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TagModule } from 'primeng/tag'; // ✅ Ajouté pour le badge
import { TooltipModule } from 'primeng/tooltip';
import { Filter } from '../../../../core/models/filter.model'; // Vérifie le chemin

@Component({
  selector: 'app-filter-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    ToggleSwitchModule,
    RadioButtonModule,
    FileUploadModule,
    TagModule, // ✅
    TooltipModule
  ],
  templateUrl: './filter-form.component.html',
  styleUrls: ['./filter-form.component.scss']
})
export class FilterFormComponent implements OnChanges {
  @Input() filter: Filter | null = null;
  @Output() onSave = new EventEmitter<FormData>();
  @Output() onCancel = new EventEmitter<void>();

  filterForm: FormGroup;
  isEditMode = false;
  
  imagePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      name: ['', [Validators.maxLength(100)]],
      filterUrl: ['', [Validators.required]],
      platform: ['SNAPCHAT', [Validators.required]],
      isActive: [true]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filter']) {
      if (this.filter) {
        this.isEditMode = true;
        this.filterForm.patchValue({
          name: this.filter.name || '',
          filterUrl: this.filter.filterUrl, // Assure-toi que le modèle a bien filterUrl
          platform: this.filter.platform || 'SNAPCHAT',
          isActive: this.filter.isActive
        });
        this.imagePreview = this.filter.imageUrl;
        this.selectedFile = null;
      } else {
        this.isEditMode = false;
        this.filterForm.reset({
          name: '',
          filterUrl: '',
          platform: 'SNAPCHAT',
          isActive: true
        });
        this.imagePreview = null;
        this.selectedFile = null;
      }
    }
  }

  onFileSelect(event: any): void {
    const file = event.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.selectedFile = null;
    this.imagePreview = this.isEditMode ? this.filter?.imageUrl || null : null;
  }

  submit(): void {
    if (this.filterForm.valid) {
      const formData = new FormData();
      const formValue = this.filterForm.value;
      
      if (formValue.name) formData.append('name', formValue.name);
      formData.append('filterUrl', formValue.filterUrl);
      formData.append('platform', formValue.platform);
      formData.append('isActive', formValue.isActive.toString());

      if (this.selectedFile) {
        formData.append('image', this.selectedFile);
      }

      this.onSave.emit(formData);
    }
  }

  // Getters
  get nameControl() { return this.filterForm.get('name'); }
  get filterUrlControl() { return this.filterForm.get('filterUrl'); }
}