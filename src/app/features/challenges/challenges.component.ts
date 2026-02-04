import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ChallengeService } from '../../core/services/challenge.service';
import { ChallengeListComponent } from './components/challenge-list/challenge-list.component';
import { ChallengeFormComponent } from './components/challenge-form/challenge-form.component';

@Component({
    selector: 'app-challenges',
    templateUrl: './challenges.component.html',
    standalone: true,
    imports: [
        CommonModule,
        ChallengeListComponent,
        ChallengeFormComponent,
        DialogModule,
        ToastModule
    ],
    providers: [MessageService], // Pour les notifications de succès/erreur
})
export class ChallengesComponent implements OnInit {
    private challengeService = inject(ChallengeService);
    private messageService = inject(MessageService);

    // État des données (Signals)
    challenges = signal<any[]>([]);
    isLoading = signal<boolean>(false);

    // État de l'UI
    displayDialog = false;
    selectedChallenge = signal<any>(null);
    isEditMode = signal<boolean>(false);

    ngOnInit() {
        this.loadChallenges();
    }

    loadChallenges() {
        this.isLoading.set(true);
        this.challengeService.getAllChallenges().subscribe({
            next: (res) => {
                this.challenges.set(res.data);
                this.isLoading.set(false);
            },
            error: () => {
                this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Impossible de charger les challenges' });
                this.isLoading.set(false);
            }
        });
    }

    openCreateDialog() {
        this.isEditMode.set(false);
        this.selectedChallenge.set(null);
        this.displayDialog = true;
    }

    openEditDialog(challenge: any) {
        this.isEditMode.set(true);
        this.selectedChallenge.set(challenge);
        this.displayDialog = true;
    }

    handleSave(formData: FormData) {
        const request = this.isEditMode()
            ? this.challengeService.updateChallenge(this.selectedChallenge().id, formData)
            : this.challengeService.createChallenge(formData);

        request.subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Opération réussie' });
                this.displayDialog = false;
                this.loadChallenges(); // Rafraîchissement automatique
            },
            error: () => this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'L\'opération a échoué' })
        });
    }

    handleDelete(id: number) {
        if (confirm('Voulez-vous vraiment supprimer ce challenge ?')) {
            this.challengeService.deleteChallenge(id).subscribe({
                next: () => {
                    this.messageService.add({ severity: 'success', summary: 'Supprimé', detail: 'Challenge effacé' });
                    this.loadChallenges();
                }
            });
        }
    }

    resetSelection() {
        this.selectedChallenge.set(null);
    }
}