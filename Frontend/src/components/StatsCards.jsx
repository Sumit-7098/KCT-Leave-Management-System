import { UserRound } from 'lucide-react';

export default function StatsCards({ stats = [] }) {
  // Row 1: Status cards
  const statusCards = [
    { label: "Approved", count: stats.approved || 0, color: "border-emerald-500 text-emerald-700", bgColor: "bg-emerald-50" },
    { label: "Pending", count: stats.pending || 0, color: "border-orange-500 text-orange-700", bgColor: "bg-orange-50" }
  ];

  // Row 2: Leave balance cards
  const leaveCards = [
    { key: 'Annual Leave', label: 'Annual Leave', color: "border-blue-500 text-blue-700", bgColor: "bg-blue-50" },
    { key: 'Casual Leave', label: 'Casual Leave', color: "border-green-500 text-green-700", bgColor: "bg-green-50" },
    { key: 'Sick Leave', label: 'Sick Leave', color: "border-amber-500 text-amber-700", bgColor: "bg-amber-50" },
    { key: 'Unpaid Leave', label: 'Unpaid Leave', color: "border-purple-500 text-purple-700", bgColor: "bg-purple-50" }
  ];

  const getLeaveSub = (stat) => {
    if (!stat) return '0/10';
    return `${stat.used || 0}/${stat.total || 10}`;
  };

  return (
    <div className="mb-8 space-y-6">
      {/* ROW 1: Approved & Pending */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {statusCards.map((card, index) => (
          <div key={index} className={`border-t-8 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200 ${card.color} ${card.bgColor}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center shadow ${card.bgColor}`}>
                  <UserRound className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{card.label}</h3>
                  <p className="text-sm text-slate-500">Requests</p>
                </div>
              </div>
              <span className="text-4xl font-bold">{card.count}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ROW 2: Leave Balances */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {leaveCards.map((card, index) => {
          const stat = stats.balances?.find(s => s.type === card.key) || {};
          const remaining = stat.left || 0;
          
          return (
            <div key={index} className={`border rounded-lg p-5 shadow-sm hover:shadow-md transition-all duration-200 border-t-4 ${card.color} ${card.bgColor} group`}>
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform ${card.bgColor}`}>
                  <UserRound className="w-5 h-5" />
                </div>
              <span className={`text-2xl font-bold text-slate-800 `}>{remaining}</span>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-slate-700 mb-1 truncate">{card.label}</h4>
                <p className="text-xs text-slate-500">{getLeaveSub(stat)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
