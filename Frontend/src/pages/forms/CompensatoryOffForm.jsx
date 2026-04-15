import { Clock } from "lucide-react";

export default function CompensatoryOffForm({ 
  form, 
  errors, 
  handleChange,
  dragOver, 
  setDragOver,
  handleFileChange 
}) {
  const calculateDuration = () => {
    if (!form.inTime || !form.outTime) return "--:--";
    const [ih, im] = form.inTime.split(":");
    const [oh, om] = form.outTime.split(":");
    let mins = parseInt(oh) * 60 + parseInt(om) - (parseInt(ih) * 60 + parseInt(im));
    if (mins < 0) mins += 1440;
    const hours = Math.floor(mins / 60);
    const m = mins % 60;
    return `${hours.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
  };

  return (
    <>
      {/* Time Grid for Comp Off */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-2">
            In Time <span className="text-red-500">*</span>
          </label>
          <input
            type="time"
            name="inTime"
            value={form.inTime}
            onChange={handleChange}
            className={`w-full p-4 rounded-xl border-2 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-blue-500 transition-all ${errors.inTime
                ? "border-red-300"
                : "border-slate-200 dark:border-gray-600 hover:border-slate-300 dark:hover:border-gray-500"
              }`}
          />
          {errors.inTime && (
            <p className="text-red-500 text-xs mt-1">{errors.inTime}</p>
          )}
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-2">
            Out Time <span className="text-red-500">*</span>
          </label>
          <input
            type="time"
            name="outTime"
            value={form.outTime}
            onChange={handleChange}
            className={`w-full p-4 rounded-xl border-2 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-blue-500 transition-all ${errors.outTime
                ? "border-red-300"
                : "border-slate-200 dark:border-gray-600 hover:border-slate-300 dark:hover:border-gray-500"
              }`}
          />
          {errors.outTime && (
            <p className="text-red-500 text-xs mt-1">
              {errors.outTime}
            </p>
          )}
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-2">
            Duration
          </label>
          <input
            value={calculateDuration()}
            readOnly
            className="w-full p-4 rounded-xl border bg-slate-50 dark:bg-gray-700 border-slate-200 dark:border-gray-600 text-sm text-slate-600 dark:text-slate-400 font-mono"
          />
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-2">
            Start Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
            className={`w-full p-4 rounded-xl border-2 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-blue-500 transition-all ${errors.startDate ? "border-red-300" : "border-slate-200 dark:border-gray-600 hover:border-slate-300 dark:hover:border-gray-500"}`}
          />
          {errors.startDate && (
            <p className="text-red-500 text-xs mt-1">
              {errors.startDate}
            </p>
          )}
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-2">
            End Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="endDate"
            value={form.endDate}
            onChange={handleChange}
            className={`w-full p-4 rounded-xl border-2 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-blue-500 transition-all ${errors.endDate ? "border-red-300" : "border-slate-200 dark:border-gray-600 hover:border-slate-300 dark:hover:border-gray-500"}`}
          />
          {errors.endDate && (
            <p className="text-red-500 text-xs mt-1">
              {errors.endDate}
            </p>
          )}
        </div>
      </div>

      {/* Reason */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-2">
          Reason for Compensatory Off <span className="text-red-500">*</span>
        </label>
        <textarea
          name="reason"
          value={form.reason}
          onChange={handleChange}
          rows={4}
          placeholder="Provide detailed reason for compensatory off..."
          className={`w-full p-4 rounded-xl border-2 resize-vertical text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-blue-500 transition-all ${errors.reason ? "border-red-300" : "border-slate-200 dark:border-gray-600 hover:border-slate-300 dark:hover:border-gray-500"}`}
        />
        {errors.reason && (
          <p className="text-red-500 text-xs mt-1">{errors.reason}</p>
        )}
      </div>
    </>
  );
}
