import { memo } from "react";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import InfoCard from "./InfoCard";
import { useTheme } from "../context/ThemeContext";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const getCSSVar = (name, fallback) => {
  if (typeof window === 'undefined') return fallback;
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
};

function toLocalDateKey(date) {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function buildWeeklyCounts(history) {
  const labels = [];
  const counts = new Array(7).fill(0);
  const today = new Date();

  // Build keys for the last 7 local-timezone days
  const dayKeys = [];
  for (let offset = 6; offset >= 0; offset -= 1) {
    const day = new Date(today);
    day.setDate(today.getDate() - offset);
    labels.push(day.toLocaleDateString(undefined, { weekday: "short" }));
    dayKeys.push(toLocalDateKey(day));
  }

  // Count each history item using solvedAt (actual completion) or createdAt as fallback
  history.forEach((item) => {
    const solveDate = item.solvedAt || item.createdAt;
    if (!solveDate) return;
    const key = toLocalDateKey(solveDate);
    const dayIndex = dayKeys.indexOf(key);
    if (dayIndex !== -1) {
      counts[dayIndex] += 1;
    }
  });

  return { labels, counts };
}

export default memo(function StreakChart({ history = [], streak = 0, longestStreak = 0 }) {
  const { labels, counts } = buildWeeklyCounts(history);
  const { theme } = useTheme();

  const data = {
    labels,
    datasets: [
      {
        label: "Problems solved",
        data: counts,
        backgroundColor: (context) => {
          const chart = context.chart;
          const area = chart.chartArea;
          if (!area) return getCSSVar('--primary');
          const gradient = chart.ctx.createLinearGradient(0, area.bottom, 0, area.top);
          
          const primaryColor = getCSSVar('--primary');
          const primaryHoverColor = getCSSVar('--primary-hover');
          
          gradient.addColorStop(0, primaryColor);
          gradient.addColorStop(1, primaryHoverColor);
          return gradient;
        },
        borderColor: getCSSVar('--line-strong'),
        borderWidth: 1,
        borderRadius: 4,
        borderSkipped: false,
        hoverBackgroundColor: getCSSVar('--primary-hover', '#000'),
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 200,
      easing: "easeOutQuad",
      delay: 0,
    },
    interaction: {
      intersect: false,
      mode: "index",
    },
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: {
        backgroundColor: getCSSVar('--surface-1', '#111827'),
        borderColor: getCSSVar('--primary', 'rgba(45, 212, 191, 0.38)'),
        titleColor: getCSSVar('--text', '#fff'),
        bodyColor: getCSSVar('--text-muted', '#aaa'),
        borderWidth: 1,
        displayColors: false,
        padding: 12,
        titleFont: { weight: "700" },
        bodyFont: { weight: "700" },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: getCSSVar('--text-muted', '#657184'), font: { weight: "700" } },
      },
      y: {
        beginAtZero: true,
        grid: { color: getCSSVar('--line', 'rgba(17, 24, 39, 0.08)') },
        ticks: { stepSize: 1, color: getCSSVar('--text-muted', '#657184'), font: { weight: "700" } },
      },
    },
  };

  return (
    <InfoCard title="Weekly activity" meta={`${streak}d streak / best ${longestStreak}d`}>
      <div className="chart-wrap animated-chart-wrap">
        <Bar key={theme} data={data} options={options} />
      </div>
    </InfoCard>
  );
}
