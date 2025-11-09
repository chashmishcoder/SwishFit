import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const WorkoutProgressChart = ({ data, dateRange }) => {
  // Process data for the chart
  const processData = () => {
    if (!data || data.length === 0) {
      return { labels: [], datasets: [] };
    }

    // Sort data by date
    const sortedData = [...data].sort((a, b) => 
      new Date(a.createdAt) - new Date(b.createdAt)
    );

    // Group by date and calculate metrics
    const dateMap = new Map();
    
    sortedData.forEach(progress => {
      const date = new Date(progress.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
      
      if (!dateMap.has(date)) {
        dateMap.set(date, {
          totalWorkouts: 0,
          completedWorkouts: 0,
          totalDuration: 0,
          totalCalories: 0
        });
      }
      
      const dayData = dateMap.get(date);
      dayData.totalWorkouts++;
      if (progress.completed) dayData.completedWorkouts++;
      dayData.totalDuration += progress.duration || 0;
      dayData.totalCalories += progress.caloriesBurned || 0;
    });

    const labels = Array.from(dateMap.keys());
    const completedWorkouts = Array.from(dateMap.values()).map(d => d.completedWorkouts);
    const duration = Array.from(dateMap.values()).map(d => d.totalDuration);

    return {
      labels,
      datasets: [
        {
          label: 'Workouts Completed',
          data: completedWorkouts,
          borderColor: 'rgb(249, 115, 22)',
          backgroundColor: 'rgba(249, 115, 22, 0.1)',
          tension: 0.4,
          fill: true,
          yAxisID: 'y'
        },
        {
          label: 'Total Duration (min)',
          data: duration,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
          fill: true,
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
          maxRotation: 45,
          minRotation: 45,
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
          text: 'Workouts Completed',
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

  if (chartData.labels.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        <p>No workout data available for the selected period</p>
      </div>
    );
  }

  return (
    <div className="h-80">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default WorkoutProgressChart;
