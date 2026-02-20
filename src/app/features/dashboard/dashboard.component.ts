import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart'; // Assure-toi d'avoir installé chart.js
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';

// Services
import { ChallengeService } from '../../core/services/challenge.service';
import { FilterService } from '../../core/services/filter.service';
import { GlobalStatsService } from '../../core/services/global-stats.service';

// Models
import { Challenge } from '../../core/models/challenge.model';
import { Filter } from '../../core/models/filter.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [
    CommonModule, 
    ChartModule, 
    CardModule, 
    SkeletonModule,
    TagModule
  ]
})
export class DashboardComponent implements OnInit {
  private challengeService = inject(ChallengeService);
  private filterService = inject(FilterService);
  private globalStatsService = inject(GlobalStatsService);

  // Données
  challenges = signal<Challenge[]>([]);
  filters = signal<Filter[]>([]);
  totalVisits = signal<number>(0);

  isLoading = signal<boolean>(true);

  // --- STATS CALCULÉES ---

  // Challenge Actif
  activeChallenge = computed(() => this.challenges().find(c => c.isActive));

  // Filtres par plateforme
  tiktokFilters = computed(() => this.filters().filter(f => f.platform === 'TIKTOK'));
  snapchatFilters = computed(() => this.filters().filter(f => !f.platform || f.platform === 'SNAPCHAT'));

  // Totaux Filtres
  totalTiktokUsage = computed(() => this.tiktokFilters().reduce((sum, f) => sum + f.usageCount, 0));
  totalSnapUsage = computed(() => this.snapchatFilters().reduce((sum, f) => sum + f.usageCount, 0));

  // --- CHART DATA ---

  chartData: any;
  pieData: any;
  chartOptions: any;

  ngOnInit() {
    this.loadAllData();
    this.initChartOptions();
  }

  private loadAllData() {
    this.isLoading.set(true);

    // 1. Charger Challenges
    this.challengeService.getAllChallenges().subscribe({
      next: (res) => {
        this.challenges.set(res.data);
        this.updateCharts();
      }
    });

    // 2. Charger Filtres
    this.filterService.getAllFilters().subscribe({
      next: (res) => {
        this.filters.set(res.data);
        this.updateCharts();
      }
    });

    // 3. Charger Stats Globales
    this.globalStatsService.fetchStats().subscribe({ // Assure-toi que cette méthode est publique dans le service ou utilise l'observable existant
      next: (res) => {
        this.totalVisits.set(res.data.totalVisits); // Adapter selon la réponse de ton service
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  private updateCharts() {
    // Bar Chart : Top 5 Challenges par Vues
    const topChallenges = this.challenges()
      .sort((a, b) => b.currentViews - a.currentViews)
      .slice(0, 5);

    this.chartData = {
      labels: topChallenges.map(c => c.title),
      datasets: [
        {
          label: 'Vues',
          backgroundColor: '#667eea',
          data: topChallenges.map(c => c.currentViews)
        }
      ]
    };

    // Pie Chart : Répartition Filtres (Snap vs TikTok)
    this.pieData = {
      labels: ['TikTok', 'Snapchat'],
      datasets: [
        {
          data: [this.totalTiktokUsage(), this.totalSnapUsage()],
          backgroundColor: ['#000000', '#FFFC00'], // Couleurs officielles
          hoverBackgroundColor: ['#333333', '#FFF176']
        }
      ]
    };
  }

  private initChartOptions() {
    this.chartOptions = {
      plugins: {
        legend: {
          labels: {
            color: '#495057'
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#495057'
          },
          grid: {
            color: '#ebedef'
          }
        },
        y: {
          ticks: {
            color: '#495057'
          },
          grid: {
            color: '#ebedef'
          }
        }
      }
    };
  }
}