import Leave from "../Models/leave.model.js";
import User from "../Models/user.model.js";

const getLeaveBalance = async (req, res) => {
  try {
    const userId = req.user._id;

    // Leave types from model - balance-tracked types
    const leaveTypes = ["Annual Leave", "Sick Leave", "Casual Leave", "Unpaid Leave"];
    
    const stats = await Promise.all(leaveTypes.map(async (type) => {
      // Total allocated (mock for now - can add to user model)
      const totalAllocated = type === "Annual Leave" ? 10 : 5;
      
      // Used leaves
      const usedLeaves = await Leave.countDocuments({
        user: userId,
        leaveType: type
      });
      
      return {
        type,
        left: totalAllocated - usedLeaves,
        used: usedLeaves,
        total: totalAllocated
      };
    }));

    // Status counts
    const statusCounts = await Leave.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    const approved = statusCounts.find(s => s._id === 'approved')?.count || 0;
    const pending = statusCounts.find(s => s._id === 'pending')?.count || 0;

    res.json({
      balances: stats,
      approved,
      pending
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export { getLeaveBalance };
