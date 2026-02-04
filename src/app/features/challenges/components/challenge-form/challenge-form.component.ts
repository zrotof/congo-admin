import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { TagModule } from 'primeng/tag';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

@Component({
  selector: 'app-challenge-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    InputNumberModule,
    ButtonModule,
    FileUploadModule,
    TagModule,
    ToggleSwitchModule
  ],
  templateUrl: './challenge-form.component.html',
  styleUrls: ['./challenge-form.component.scss']
})
export class ChallengeFormComponent implements OnChanges {
  @Input() challenge: any = null; // Données si mode édition
  @Output() onSave = new EventEmitter<FormData>();
  @Output() onCancel = new EventEmitter<void>();

  challengeForm: FormGroup;
  imagePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

  constructor(private fb: FormBuilder) {
    this.challengeForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      contextText: [''],
      targetViews: [1000, [Validators.required, Validators.min(1)]],
      isActive: [false]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['challenge'] && this.challenge) {
      // MODE ÉDITION : On remplit le formulaire
      this.challengeForm.patchValue({
        title: this.challenge.title,
        targetViews: this.challenge.targetViews,
        isActive: this.challenge.isActive
      });
      this.imagePreview = this.challenge.imageUrl;
    } else if (!this.challenge) {
      // MODE CRÉATION : On reset
      this.challengeForm.reset({ targetViews: 1000 });
      this.imagePreview = null;
      this.selectedFile = null;
    }
  }

  onFileSelect(event: any) {
    this.selectedFile = event.files[0];

    // Générer un aperçu pour Mariette
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    if (this.selectedFile) reader.readAsDataURL(this.selectedFile);
  }

  submit() {
    if (this.challengeForm.valid) {
      const formData = new FormData();
      formData.append('title', this.challengeForm.get('title')?.value);
      formData.append('targetViews', this.challengeForm.get('targetViews')?.value);
      formData.append('isActive', this.challengeForm.get('isActive')?.value);

      if (this.selectedFile) {
        formData.append('image', this.selectedFile);
      }

      this.onSave.emit(formData);
    }
  }
}
