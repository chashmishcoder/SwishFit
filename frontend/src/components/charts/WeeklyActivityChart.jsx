import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const WeeklyActivityChart = ({ data }) => {
  const processData = () => {
    if (!data || data.length === 0) {
      return { labels: [], datasets: [] };
    }

    // Initialize days of week
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const activityByDay = Array(7).fill(0);
    const durationByDay = Array(7).fill(0);

    // Count workouts by day of week
    data.forEach(progress => {
      const date = new Date(progress.createdAt);
      const dayIndex = date.getDay();
      
      if (progress.completed) {
        activityByDay[dayIndex]++;
        durationByDay[dayIndex] += progress.duration || 0;
      }
    });

    return {
      labels: daysOfWeek,
      datasets: [
        {
          label: 'Workouts Completed',
          data: activityByDay,
          backgroundColor: 'rgba(249, 115, 22, 0.8)',
          borderColor: 'rgb(249, 115, 22)',
          borderWidth: 2,
          borderRadius: 6,
          yAxisID: 'y'
        },
        {
          label: 'Total Duration (min)',
          data: durationByDay,
          backgroundColor: 'rgba(59, 130, 246, 0.6)',
          borderColor: 'rgb(59, 130, 246)',
          borderWidth: 2,
          borderRadius: 6,
          yAxisID: 'y1'
        }
      ]
    };
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 12,
            family: "'Inter', sans-serif"
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        },
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y;
              if (context.dataset.label.includes('Duration')) {
                label += ' min';
              }
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 11
          }
        }
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          font: {
            size: 11
          },
          callback: function(value) {
            return Math.floor(value);
          }
        },
        title: {
          display: true,
          text: 'Workouts',
          font: {
            size: 12,
            weight: 'bold'
          }
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          font: {
            size: 11
          }
        },
        title: {
          display: true,
          text: 'Duration (min)',
          font: {
            size: 12,
            weight: 'bold'
          }
        }
      }
    }
  };

  const chartData = processData();

  // Check if there's any data
  const hasData = chartData.datasets[0].data.some(value => value > 0);

  if (!hasData) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        <p>No activity data available</p>
      </div>
    );
  }

  return (
    <div className="h-80">
      <Bar data={chartData} options={options} />
      
      {/* Activity insights */}
      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-xs text-gray-600 mb-1">Most Active Day</p>
          <p className="text-sm font-semibold text-gray-900">
            {chartData.labels[chartData.datasets[0].data.indexOf(Math.max(...chartData.datasets[0].data))]}
          </p>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-xs text-gray-600 mb-1">Total Weekly Workouts</p>
          <p className="text-sm font-semibold text-gray-900">
            {chartData.datasets[0].data.reduce((sum, val) => sum + val, 0)}
          </p>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-xs text-gray-600 mb-1">Avg Per Day</p>
          <p className="text-sm font-semibold text-gray-900">
            {(chartData.datasets[0].data.reduce((sum, val) => sum + val, 0) / 7).toFixed(1)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WeeklyActivityChart;
