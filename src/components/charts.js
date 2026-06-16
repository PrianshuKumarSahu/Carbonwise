/**
 * @module charts
 * @description Chart.js wrappers for rendering consistent graphs.
 */

import Chart from 'chart.js/auto';

/**
 * Design System Colors mapped from UI tokens.
 * @type {Record<string, string>}
 */
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
const ANIMATION_DURATION_MS = 1000;
const DOUGHNUT_CUTOUT = '70%';
const GAUGE_CUTOUT = '80%';
const CHART_TENSION = 0.4;
const HOVER_OFFSET = 4;

Chart.defaults.font.family = DEFAULT_FONT;
Chart.defaults.color = COLORS.fg;
Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(6, 78, 59, 0.9)';

/**
 * Creates a Doughnut chart.
 * @param {HTMLCanvasElement} canvasEl - The target canvas element.
 * @param {string[]} labels - Data labels.
 * @param {number[]} data - Data points.
 * @param {string[]} [colors] - Array of hex colors for the segments.
 * @returns {Chart} The Chart.js instance.
 */
export function createDoughnutChart(canvasEl, labels, data, colors) {
  return new Chart(canvasEl, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: colors || [COLORS.primary, COLORS.secondary, COLORS.accent, COLORS.info, COLORS.purple],
        borderWidth: 0,
        hoverOffset: HOVER_OFFSET
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: ANIMATION_DURATION_MS,
        easing: 'easeOutQuart'
      },
      plugins: {
        legend: { position: 'bottom' }
      },
      cutout: DOUGHNUT_CUTOUT
    }
  });
}

/**
 * @typedef {Object} LineDataset
 * @property {string} label - Dataset label.
 * @property {number[]} data - Data points.
 * @property {string} [borderColor] - Line color.
 * @property {string} [backgroundColor] - Fill color.
 * @property {boolean} [fill] - Whether to fill under the line.
 */

/**
 * Creates a Line chart.
 * @param {HTMLCanvasElement} canvasEl - The target canvas element.
 * @param {string[]} labels - X-axis labels.
 * @param {LineDataset[]} datasets - The datasets to plot.
 * @returns {Chart} The Chart.js instance.
 */
export function createLineChart(canvasEl, labels, datasets) {
  return new Chart(canvasEl, {
    type: 'line',
    data: {
      labels: labels,
      datasets: datasets.map(ds => ({
        ...ds,
        borderColor: ds.borderColor || COLORS.primary,
        backgroundColor: ds.backgroundColor || 'rgba(5, 150, 105, 0.1)',
        tension: CHART_TENSION,
        fill: ds.fill !== false
      }))
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: ANIMATION_DURATION_MS,
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

/**
 * Creates a Bar chart.
 * @param {HTMLCanvasElement} canvasEl - The target canvas element.
 * @param {string[]} labels - X-axis labels.
 * @param {number[]} data - Data points.
 * @param {string|string[]} [colors] - Bar colors.
 * @returns {Chart} The Chart.js instance.
 */
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
        duration: ANIMATION_DURATION_MS,
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

/**
 * Creates a semi-circular Radial Gauge chart.
 * @param {HTMLCanvasElement} canvasEl - The target canvas element.
 * @param {number} value - The current value to display.
 * @param {number} max - The maximum bound of the gauge.
 * @param {string} label - The label for the value.
 * @returns {Chart} The Chart.js instance.
 */
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
        duration: ANIMATION_DURATION_MS,
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
      cutout: GAUGE_CUTOUT
    }
  });
}
