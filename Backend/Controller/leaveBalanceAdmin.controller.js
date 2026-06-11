import Leave from "../Models/leave.model.js";
import User from "../Models/user.model.js";

// Returns leave balances computed from leave requests.
// Mapping (simple + deterministic):
// - Annual Leave: totalApprovedDays for leaveType "Annual Leave"
// - Sick Leave: totalApprovedDays for leaveType "Sick Leave"
// - Casual Leave: totalApprovedDays for leaveType "Casual Leave"
//
// For now, we treat "left" as (allocated - used) with a default allocation.
// If later you add allocations per employee in DB, replace totalAllocated logic.

const toDays = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;
  const days =
    Math.ceil(
      (new Date(endDate) - new Date(startDate)) /
        (1000 * 60 * 60 * 24)
    ) + 1;
  return Number.isFinite(days) ? Math.max(0, days) : 0;
};

const getAllocatedTotalForType = (type) => {
  // Mock allocation defaults.
  // You can later make this dynamic.
  switch (type) {
    case "Annual Leave":
      return 15;
    case "Sick Leave":
      return 8;
    case "Casual Leave":
      return 5;
    case "Unpaid Leave":
      return 5;
    default:
      return 0;
  }
};

const leaveTypes = ["Annual Leave", "Sick Leave", "Casual Leave", "Unpaid Leave"];

const getEmployeeLeaveBalances = async (req, res) => {
  try {
    const employees = await User.find({}).select("fullName designation logInID").lean();

    const usedByEmployee = {};

    // Pull approved leave requests once, then compute totals per employee/type.
    const approvedLeaves = await Leave.find({ status: "approved" })
      .select("user leaveType startDate endDate")
      .lean();

    for (const l of approvedLeaves) {
      if (!leaveTypes.includes(l.leaveType)) continue;
      const userId = String(l.user);
      usedByEmployee[userId] ||= { "Annual Leave": 0, "Sick Leave": 0, "Casual Leave": 0 };
      usedByEmployee[userId][l.leaveType] += toDays(l.startDate, l.endDate);
    }

    const balances = employees.map((emp) => {
      const used = usedByEmployee[String(emp._id)] || {
        "Annual Leave": 0,
        "Sick Leave": 0,
        "Casual Leave": 0,
        "Unpaid Leave": 0,
      };

      const annualLeft = getAllocatedTotalForType("Annual Leave") - used["Annual Leave"];
      const sickLeft = getAllocatedTotalForType("Sick Leave") - used["Sick Leave"];
      const casualLeft = getAllocatedTotalForType("Casual Leave") - used["Casual Leave"];
      const unpaidLeft = getAllocatedTotalForType("Unpaid Leave") - used["Unpaid Leave"];

      const annual = Math.max(0, annualLeft);
      const sick = Math.max(0, sickLeft);
      const casual = Math.max(0, casualLeft);
      const unpaid = Math.max(0, unpaidLeft);
      const total = annual + sick + casual + unpaid;

      return {
        id: emp.logInID,
        name: emp.fullName,
        dept: emp.designation,
        annual,
        sick,
        casual,
        unpaid,
        total,
      };
    });

    res.json({ balances });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export { getEmployeeLeaveBalances };

