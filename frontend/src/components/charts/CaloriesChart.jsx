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

const CaloriesChart = ({ data, dateRange }) => {
  const processData = () => {
    if (!data || data.length === 0) {
      return { labels: [], datasets: [] };
    }

    // Sort data by date
    const sortedData = [...data].sort((a, b) => 
      new Date(a.createdAt) - new Date(b.createdAt)
    );

    // Group by date
    const dateMap = new Map();
    
    sortedData.forEach(progress => {
      const date = new Date(progress.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
      
      if (!dateMap.has(date)) {
        dateMap.set(date, {
          totalCalories: 0,
          workouts: 0
        });
      }
      
      const dayData = dateMap.get(date);
      dayData.totalCalories += progress.caloriesBurned || 0;
      if (progress.completed) dayData.workouts++;
    });

    const labels = Array.from(dateMap.keys());
    const calories = Array.from(dateMap.values()).map(d => d.totalCalories);

    // Calculate color gradient based on calories
    const maxCalories = Math.max(...calories);
    const backgroundColors = calories.map(cal => {
      const intensity = (cal / maxCalories) * 0.5 + 0.3; // 0.3 to 0.8
      return `rgba(249, 115, 22, ${intensity})`;
    });

    return {
      labels,
      datasets: [
        {
          label: 'Calories Burned',
          data: calories,
          backgroundColor: backgroundColors,
          borderColor: 'rgb(249, 115, 22)',
          borderWidth: 2,
          borderRadius: 6
        }
      ]
    };
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
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
              label += context.parsed.y.toLocaleString() + ' cal';
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
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          font: {
            size: 11
          },
          callback: function(value) {
            return value.toLocaleString();
          }
        },
        title: {
          display: true,
          text: 'Calories Burned',
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
        <p>No calorie data available for the selected period</p>
      </div>
    );
  }

  // Calculate statistics
  const totalCalories = chartData.datasets[0].data.reduce((sum, val) => sum + val, 0);
  const avgCalories = totalCalories / chartData.datasets[0].data.length;
  const maxCalories = Math.max(...chartData.datasets[0].data);
  const maxCaloriesDate = chartData.labels[chartData.datasets[0].data.indexOf(maxCalories)];

  return (
    <div className="h-80">
      <Bar data={chartData} options={options} />
      
      {/* Calorie statistics */}
      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
          <p className="text-xs text-orange-600 mb-1">Total Burned</p>
          <p className="text-sm font-semibold text-orange-900">
            {totalCalories.toLocaleString()} cal
          </p>
        </div>
        <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
          <p className="text-xs text-orange-600 mb-1">Daily Average</p>
          <p className="text-sm font-semibold text-orange-900">
            {Math.round(avgCalories).toLocaleString()} cal
          </p>
        </div>
        <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
          <p className="text-xs text-orange-600 mb-1">Best Day</p>
          <p className="text-sm font-semibold text-orange-900">
            {maxCalories.toLocaleString()} cal
          </p>
          <p className="text-xs text-orange-600 mt-1">{maxCaloriesDate}</p>
        </div>
      </div>
    </div>
  );
};

export default CaloriesChart;
