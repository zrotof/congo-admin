import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { ChallengeService } from '../../core/services/challenge.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ChartModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  private challengeService = inject(ChallengeService);
  
  // Signal pour les stats simples
  stats = signal({ activeChallenges: 0, totalClicks: 0 });

  // Données pour les graphiques
  chartData: any;
  chartOptions: any;
  pieData: any;

  ngOnInit() {
    this.challengeService.getAllChallenges().subscribe(res => {
      const data = res.data;
      
      // Calcul des stats
      const active = data.filter((c: any) => c.is_active).length;
      const total = data.reduce((acc: number, c: any) => acc + (c.current_clicks || 0), 0);
      this.stats.set({ activeChallenges: active, totalClicks: total });

      // Préparation du graphique (Barres)
      this.initCharts(data);
    });
  }

  initCharts(challenges: any[]) {
    this.chartData = {
      labels: challenges.map(c => c.title),
      datasets: [
        {
          label: 'Objectif',
          backgroundColor: '#3B82F6',
          data: challenges.map(c => c.targetClicks)
        },
        {
          label: 'Clics Actuels',
          backgroundColor: '#10B981',
          data: challenges.map(c => c.currentClicks || 0)
        }
      ]
    };

    this.pieData = {
        labels: ['Actifs', 'En pause'],
        datasets: [
            {
                data: [
                    challenges.filter(c => c.isActive).length,
                    challenges.filter(c => c.isActive === false).length
                ],
                backgroundColor: ['#10B981', '#EF4444']
            }
        ]
    };
  }
}