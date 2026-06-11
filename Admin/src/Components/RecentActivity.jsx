import React from "react";
import { FaFileAlt, FaCheckCircle } from "react-icons/fa";
import { IoDocumentText } from "react-icons/io5";

const getStyles = (type) => {
  switch (type) {
    case "approved":
      return {
        bg: "bg-green-500",
        text: "text-green-600",
        label: "approval",
        icon: <FaCheckCircle />,
      };
    case "rejected":
      return {
        bg: "bg-red-500",
        text: "text-red-600",
        label: "rejection",
        icon: <FaFileAlt />,
      };
    default:
      return {
        bg: "bg-blue-500",
        text: "text-blue-600",
        label: "leave request",
        icon: <IoDocumentText />,
      };
  }
};

const RecentActivity = ({ activities = [] }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md w-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-2 h-8 bg-green-600 rounded-full"></div>
        <h2 className="text-lg font-semibold text-gray-800">
          Recent Activity
        </h2>
      </div>

      {/* Cards for small screens */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {activities.map((item, index) => {
          const style = getStyles(item?.type);

          return (
            <div
              key={index}
              className="bg-gray-50 border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              {/* Top Row */}
              <div className="flex items-start justify-between gap-3">
                <div
                  className={`w-11 h-11 flex items-center justify-center rounded-full text-xl text-white shadow-md ${style.bg}`}
                >
                  {style.icon}
                </div>

                <span
                  className={`text-sm px-3 py-1 rounded-full bg-gray-200 ${style.text} whitespace-nowrap`}
                >
                  {style.label}
                </span>
              </div>

              {/* Text */}
              <p className="text-sm font-medium text-gray-800 mt-3">
                <span className="font-semibold">{item?.name || ""}</span>{" "}
                {item?.action || ""}
              </p>
              <p className="text-xs text-gray-500 mt-1">{item?.time || ""}</p>
            </div>
          );
        })}
      </div>

      {/* Table for medium+ screens */}
      <div className="hidden md:block">
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0">
            <thead>
              <tr>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3 border-b border-gray-200">
                  Status
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3 border-b border-gray-200">
                  Activity
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3 border-b border-gray-200">
                  Time
                </th>
              </tr>
            </thead>

            <tbody>
              {activities.map((item, index) => {
                const style = getStyles(item?.type);

                return (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 flex items-center justify-center rounded-full text-base text-white shadow-sm ${style.bg}`}
                        >
                          {style.icon}
                        </div>
                        <span
                          className={`text-sm px-3 py-1 rounded-full bg-gray-200 ${style.text} whitespace-nowrap`}
                        >
                          {style.label}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-3 border-b border-gray-100">
                      <div className="text-sm text-gray-800">
                        <span className="font-semibold">{item?.name || ""}</span>{" "}
                        {item?.action || ""}
                      </div>
                    </td>

                    <td className="px-4 py-3 border-b border-gray-100">
                      <span className="text-xs text-gray-500">
                        {item?.time || ""}
                      </span>
                    </td>
                  </tr>
                );
              })}

              {activities.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="px-4 py-10 text-center text-sm text-gray-500"
                  >
                    No recent activities found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;
