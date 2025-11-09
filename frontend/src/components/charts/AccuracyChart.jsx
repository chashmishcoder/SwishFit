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

const AccuracyChart = ({ data, dateRange }) => {
  const processData = () => {
    if (!data || data.length === 0) {
      return { labels: [], datasets: [] };
    }

    // Filter completed workouts only
    const completedWorkouts = data.filter(p => p.completed);

    // Sort by date
    const sortedData = [...completedWorkouts].sort((a, b) => 
      new Date(a.createdAt) - new Date(b.createdAt)
    );

    // Calculate accuracy by date
    const dateMap = new Map();
    
    sortedData.forEach(progress => {
      const date = new Date(progress.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
      
      if (!dateMap.has(date)) {
        dateMap.set(date, {
          totalShots: 0,
          madeShots: 0,
          accuracyValues: []
        });
      }
      
      const dayData = dateMap.get(date);
      
      // Calculate accuracy from exercise results
      if (progress.exerciseResults && progress.exerciseResults.length > 0) {
        progress.exerciseResults.forEach(exercise => {
          if (exercise.shotsAttempted > 0) {
            dayData.totalShots += exercise.shotsAttempted;
            dayData.madeShots += exercise.shotsMade || 0;
          }
          if (exercise.accuracy !== undefined && exercise.accuracy !== null) {
            dayData.accuracyValues.push(exercise.accuracy);
          }
        });
      }
    });

    const labels = Array.from(dateMap.keys());
    const accuracyData = Array.from(dateMap.values()).map(d => {
      // Calculate average accuracy for the day
      if (d.accuracyValues.length > 0) {
        return d.accuracyValues.reduce((sum, val) => sum + val, 0) / d.accuracyValues.length;
      } else if (d.totalShots > 0) {
        return (d.madeShots / d.totalShots) * 100;
      }
      return 0;
    });

    // Calculate moving average for trend line
    const movingAverage = [];
    const windowSize = Math.min(3, accuracyData.length);
    
    for (let i = 0; i < accuracyData.length; i++) {
      const start = Math.max(0, i - windowSize + 1);
      const window = accuracyData.slice(start, i + 1);
      const avg = window.reduce((sum, val) => sum + val, 0) / window.length;
      movingAverage.push(avg);
    }

    return {
      labels,
      datasets: [
        {
          label: 'Daily Accuracy',
          data: accuracyData,
          borderColor: 'rgb(34, 197, 94)',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          tension: 0.4,
          fill: true,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: 'rgb(34, 197, 94)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2
        },
        {
          label: 'Trend',
          data: movingAverage,
          borderColor: 'rgb(249, 115, 22)',
          backgroundColor: 'transparent',
          borderDash: [5, 5],
          tension: 0.4,
          fill: false,
          pointRadius: 0,
          borderWidth: 2
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
              label += context.parsed.y.toFixed(1) + '%';
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
        min: 0,
        max: 100,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          font: {
            size: 11
          },
          callback: function(value) {
            return value + '%';
          }
        },
        title: {
          display: true,
          text: 'Shooting Accuracy (%)',
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
        <p>No accuracy data available for the selected period</p>
      </div>
    );
  }

  return (
    <div className="h-80">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default AccuracyChart;
