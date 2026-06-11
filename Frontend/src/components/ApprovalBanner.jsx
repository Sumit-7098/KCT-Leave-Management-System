import { Smartphone, CheckCircle, Clock, Circle } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function ApprovalBanner({ status = 'fresh' }) {
  const getSteps = (status) => {
    const baseSteps = [
      { label: "You Apply", color: 'green', complete: status !== 'fresh' },
      { label: "Manager",   color: 'amber',   complete: status === 'approved' },
      { label: "Director",  color: 'amber',   complete: status === 'approved' },
      { label: "Hr",        color: 'amber',   complete: status === 'approved' },
      { label: "Approved",  color: 'emerald', complete: status === 'approved' }
    ];

    return baseSteps.map(step => ({
      ...step,
      bg: step.complete ? `bg-${step.color}-300` : 'bg-green-600',
      text: step.complete ? `text-${step.color}-400` : 'text-slate-400',
      icon: step.complete ? <CheckCircle className="w-5 h-5" /> : <Circle className="w-5 h-5" />
    }));
  };

  const [currentStatus, setCurrentStatus] = useState(status);
  const steps = getSteps(currentStatus);

  useEffect(() => {
    const saved = localStorage.getItem('leaveStatus');
    if (saved) {
      setCurrentStatus(saved);
    }
  }, []);

  return (
    <div className="bg-linear-to-r from-blue-900 via-blue-700 to-blue-600 rounded-2xl p-4 lg:p-6 mb-6">

      <h2 className="text-white text-lg lg:text-xl font-bold mb-1">
        {currentStatus === 'approved' ? '✅ Leave Approved' : currentStatus === 'applied' ? '📤 Request Submitted' : '3-Step Email Approval'}
      </h2>
      <p className="text-blue-200 text-xs lg:text-sm mb-4 lg:mb-6">
        When you apply – Director, Manager & HR – both must approve
      </p>

      {/* Steps — wraps on mobile */}
      <div className="flex flex-wrap lg:flex-nowrap items-center justify-between gap-y-4">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center flex-1 min-w-20">
            <div className="flex flex-col items-center gap-1 lg:gap-2">
              <div className={`w-9 h-9 lg:w-11 lg:h-11 rounded-full flex items-center justify-center text-base lg:text-xl ${step.bg}`}>
                <span className={step.text}>{step.icon}</span>
              </div>
              <span className="text-blue-100 text-xs font-medium text-center">
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className="flex-1 h-0.5 bg-white/20 mx-1 lg:mx-2 mb-5" />
            )}
          </div>
        ))}
      </div>

    </div>
  )
}