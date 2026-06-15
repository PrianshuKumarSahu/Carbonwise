/**
 * @module charts
 * @description Chart.js wrappers.
 */

import Chart from 'chart.js/auto';

// Design System Colors
const COLORS = {
  primary: '#059669',
  secondary: '#10B981',
  accent: '#D97706',
  destructive: '#DC2626',
  info: '#0891B2',
  purple: '#7C3AED',
  pink: '#EC4899',
  muted: '#E8F1F3',
  fg: '#064E3B'
};

const DEFAULT_FONT = 'Work Sans, sans-serif';

Chart.defaults.font.family = DEFAULT_FONT;
Chart.defaults.color = COLORS.fg;
Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(6, 78, 59, 0.9)';

export function createDoughnutChart(canvasEl, labels, data, colors) {
  return new Chart(canvasEl, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: colors || [COLORS.primary, COLORS.secondary, COLORS.accent, COLORS.info, COLORS.purple],
        borderWidth: 0,
        hoverOffset: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 1000,
        easing: 'easeOutQuart'
      },
      plugins: {
        legend: {
          position: 'bottom'
        }
      },
      cutout: '70%'
    }
  });
}

export function createLineChart(canvasEl, labels, datasets) {
  return new Chart(canvasEl, {
    type: 'line',
    data: {
      labels: labels,
      datasets: datasets.map(ds => ({
        ...ds,
        borderColor: ds.borderColor || COLORS.primary,
        backgroundColor: ds.backgroundColor || 'rgba(5, 150, 105, 0.1)',
        tension: 0.4,
        fill: ds.fill !== false
      }))
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 1000,
        easing: 'easeOutQuart'
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: COLORS.muted }
        },
        x: {
          grid: { display: false }
        }
      }
    }
  });
}

export function createBarChart(canvasEl, labels, data, colors) {
  return new Chart(canvasEl, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: colors || COLORS.primary,
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 1000,
        easing: 'easeOutQuart'
      },
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: COLORS.muted }
        },
        x: {
          grid: { display: false }
        }
      }
    }
  });
}

export function createRadialGauge(canvasEl, value, max, label) {
  const safeValue = Math.min(value, max);
  const remaining = Math.max(max - value, 0);
  
  let color = COLORS.primary;
  if (value > max * 1.5) color = COLORS.destructive;
  else if (value > max * 1.1) color = COLORS.accent;
  
  return new Chart(canvasEl, {
    type: 'doughnut',
    data: {
      labels: [label, 'Remaining Allowance'],
      datasets: [{
        data: [safeValue, remaining],
        backgroundColor: [color, COLORS.muted],
        borderWidth: 0,
        circumference: 180,
        rotation: 270
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      aspectRatio: 2,
      animation: {
        duration: 1000,
        easing: 'easeOutQuart'
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              if (ctx.dataIndex === 0) return `${label}: ${value} kg`;
              return '';
            }
          }
        }
      },
      cutout: '80%'
    }
  });
}
