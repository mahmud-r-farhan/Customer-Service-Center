import { FaUsers, FaCheckCircle, FaRegClock } from "react-icons/fa";

const iconMap = {
  FaUsers,
  FaCheckCircle,
  FaRegClock,
};

const colorMap = {
  blue: { bg: "bg-blue-100 dark:bg-blue-900", text: "text-blue-600 dark:text-blue-400" },
  green: { bg: "bg-green-100 dark:bg-green-900", text: "text-green-600 dark:text-green-400" },
  orange: { bg: "bg-orange-100 dark:bg-orange-900", text: "text-orange-600 dark:text-orange-400" },
};

function StatsCard({ icon, label, value, color }) {
  const IconComponent = iconMap[icon];
  const colors = colorMap[color];

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-white/20">
      <div className="flex items-center space-x-3">
        <div className={`p-2 ${colors.bg} rounded-lg`}>
          <IconComponent className={`h-5 w-5 ${colors.text}`} />
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
      </div>
    </div>
  );
}

export default StatsCard;