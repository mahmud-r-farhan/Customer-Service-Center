import { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { fetchClients } from "../redux/clientsSlice";
import { FiMaximize, FiMinimize } from "react-icons/fi";
import { calculateConsultationTime } from "../utils/clientUtils";
import StatsCard from "../components/Serial/StatsCard";
import NowServing from "../components/Serial/NowServing";
import NextInLine from "../components/Serial/NextInLine";
import RecentlyCompleted from "../components/Serial/RecentlyCompleted";
import FullScreenWrapper from "../components/Serial/FullScreenWrapper";

function Serial() {
  const dispatch = useDispatch();
  const clients = useSelector((state) => state.clients.list);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const now = new Date();
  const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const queuedClients = useMemo(() =>
    clients
      .filter((client) => client.status === "queued")
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)),
    [clients]
  );

  const consultingClients = useMemo(() =>
    clients
      .filter((client) => client.status === "consulting")
      .sort((a, b) => new Date(a.consultationStart) - new Date(b.consultationStart)),
    [clients]
  );

  const completedClients = useMemo(() =>
    clients.filter(
      (client) =>
        client.status === "done" && new Date(client.updatedAt) > last24h
    ),
    [clients]
  );

  let displayCurrent = null;
  let displayUpcoming = [];

  if (consultingClients.length > 0) {
    displayCurrent = consultingClients[0];
    displayUpcoming = queuedClients;
  } else {
    displayCurrent = queuedClients[0] || null;
    displayUpcoming = queuedClients.slice(1);
  }

  useEffect(() => {
    dispatch(fetchClients());
    dispatch({ type: "ws/connect" });
    return () => {
      dispatch({ type: "ws/disconnect" });
    };
  }, [dispatch]);

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const stats = [
    {
      icon: "FaUsers",
      label: "In Queue",
      value: queuedClients.length,
      color: "blue",
    },
    {
      icon: "FaCheckCircle",
      label: "Completed (24h)",
      value: completedClients.length,
      color: "green",
    },
    {
      icon: "FaRegClock",
      label: "Est. Wait",
      value: `${displayUpcoming.length * 5}min`,
      color: "orange",
    },
  ];

  const SerialContent = (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center"
      >
        <div className="flex justify-between items-center w-full max-w-7xl mb-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Serial Queue
          </h1>
          <motion.button
            onClick={toggleFullScreen}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition-colors flex items-center space-x-2 shadow-md"
          >
            {isFullScreen ? (
              <>
                <FiMinimize className="w-5 h-5" />
                <span>Exit Full Screen</span>
              </>
            ) : (
              <>
                <FiMaximize className="w-5 h-5" />
                <span>Full Screen</span>
              </>
            )}
          </motion.button>
        </div>
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 w-full max-w-7xl px-4 sm:px-6 lg:px-8"
        >
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </motion.div>
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative overflow-hidden w-full max-w-7xl px-4 sm:px-6 lg:px-8"
        >
          <NowServing displayCurrent={displayCurrent} />
        </motion.div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 w-full max-w-7xl px-4 sm:px-6 lg:px-8 mt-10">
          <NextInLine displayUpcoming={displayUpcoming} />
          <RecentlyCompleted
            completedClients={completedClients}
            calculateConsultationTime={calculateConsultationTime}
          />
        </div>
      </motion.div>
    </div>
  );

  return (
    <FullScreenWrapper
      isFullScreen={isFullScreen}
      onToggleFullScreen={toggleFullScreen}
      content={SerialContent}
    />
  );
}

export default Serial;