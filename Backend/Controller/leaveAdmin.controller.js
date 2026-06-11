import Leave from "../Models/leave.model.js";

const toHumanDate = (d) => {
  if (!d) return null;
  const date = new Date(d);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getAllLeaveRequests = async (req, res) => {
  try {
    // NOTE: we don't restrict by admin role here because existing auth.js already
    // authenticates either a User or Admin based on the token.
    const leaves = await Leave.find({})
      .populate("user", "designation fullName logInID") // only get these fields from user
      .sort({ createdAt: -1 })
      .lean();

    const mapped = leaves.map((leave) => {
      const start = toHumanDate(leave.startDate);
      const end = toHumanDate(leave.endDate);
      const applied = toHumanDate(leave.createdAt);

      const days =
        leave.startDate && leave.endDate
          ? Math.ceil(
              (new Date(leave.endDate) - new Date(leave.startDate)) /
                (1000 * 60 * 60 * 24)
            ) + 1
          : null;

      return {
        id: leave._id,
        requestId: leave._id, // keep for backward compatibility if UI expects id
        employee: {
          name: leave.user?.fullName || "",
          dept: leave.user?.designation || "",
          logInID: leave.user?.logInID || "",
        },
        leaveType: leave.leaveType,
        startDate: leave.startDate,
        endDate: leave.endDate,
        start_date: start,
        end_date: end,
        days,
        appliedDate: leave.createdAt,
        applied: applied,
        status: leave.status,
        reason: leave.reason,
        document: leave.document,
      };
    });

    res.json({ leaves: mapped });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateLeaveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body || {};

    if (!status || !["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const updated = await Leave.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).lean();

    if (!updated) return res.status(404).json({ message: "Leave not found" });

    return res.json({ message: "Leave status updated", leave: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export { getAllLeaveRequests, updateLeaveStatus };

