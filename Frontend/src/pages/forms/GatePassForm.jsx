import { Upload, Clock } from "lucide-react";

export default function GatePassForm({ 
  form, 
  errors, 
  handleChange, 
  handleFileChange,
  dragOver, 
  setDragOver 
}) {
  return (
    <>
      {/* Date + Time Grid for Gate Pass */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-2">
            Date <span className="text-red-500">*</span>
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
            In Time <span className="text-red-500">*</span>
          </label>
          <input
            type="time"
            name="inTime"
            value={form.inTime}
            onChange={handleChange}
            className={`w-full p-4 rounded-xl border-2 text-sm dark:border-gray-600 text-slate-700 dark:text-slate-200 focus:outline-none focus:border-blue-500 transition-all ${errors.inTime ? "border-red-300" : "border-slate-200 hover:border-slate-300"}`}
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
            className={`w-full p-4 rounded-xl border-2 dark:border-gray-600 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:border-blue-500 transition-all ${errors.outTime ? "border-red-300" : "border-slate-200 hover:border-slate-300"}`}
          />
          {errors.outTime && (
            <p className="text-red-500 text-xs mt-1">
              {errors.outTime}
            </p>
          )}
        </div>
      </div>

      {/* Reason */}
      <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-2">
          Reason for Gate Pass <span className="text-red-500">*</span>
        </label>
        <textarea
          name="reason"
          value={form.reason}
          onChange={handleChange}
          rows={4}
          placeholder="Provide detailed reason for gate pass request..."
          className={`w-full p-4 dark:text-slate-100 dark:border-gray-600 rounded-xl border-2 resize-vertical text-sm focus:outline-none focus:border-blue-500 transition-all ${errors.reason ? "border-red-300" : "border-slate-200 hover:border-slate-300"}`}
        />
        {errors.reason && (
          <p className="text-red-500 text-xs mt-1">{errors.reason}</p>
        )}
      </div>

      {/* Document Upload */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-2">
          Supporting Document (Optional)
        </label>
        <div
          className={`p-8 border-2 border-dashed dark:border-gray-600 dark:text-slate-100 rounded-xl text-center transition-all duration-200 cursor-pointer flex flex-col items-center gap-3 ${dragOver ? "border-blue-400 bg-blue-25" : "border-slate-200 dark:hover:border-gray-500 hover:border-slate-300 "}`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            const file = e.dataTransfer.files[0];
            if (file) handleFileChange({ target: { files: [file] } });
          }}
          onClick={() => document.getElementById("gatePassFileInput").click()}
        >
          <Upload className="w-8 h-8 text-slate-400" />
          {form.document ? (
            <p className="text-sm font-semibold text-emerald-600">
              {form.document.name}
            </p>
          ) : (
            <>
              <p className="text-sm text-slate-600 font-medium">
                Click to upload or drag & drop
              </p>
              <p className="text-xs text-slate-400">
                PDF, JPG, PNG (Max 5MB)
              </p>
            </>
          )}
        </div>
        <input
          id="gatePassFileInput"
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </>
  );
}
