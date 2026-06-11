import User from "../Models/user.model.js";

const mapToEmployee = (u) => ({
  id: u.logInID || u._id,
  name: u.fullName,
  email: u.email,
  dept: u.designation,
  avatar: u.avatarUrl,
  phoneNumber: u.phoneNumber,
  address: u.address,
  initials: (u.fullName || "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join(""),
  status: "active",
});

const getAllEmployees = async (req, res) => {
  try {
    const users = await User.find({})
      .select("fullName email phoneNumber designation avatarUrl logInID phoneNumber address")
      .lean();

    res.json({ employees: users.map(mapToEmployee) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const idOrLogInID = req.params.id;
    const { fullName, email, phoneNumber, designation, address, avatarUrl } = req.body || {};

    // In the admin UI we use `logInID` (e.g. MAN4321) as the table id.
    // So, attempt update by logInID first, then fall back to _id when it looks like an ObjectId.
    let filter = { logInID: idOrLogInID };

    const maybeObjectId = typeof idOrLogInID === "string" && /^[a-fA-F0-9]{24}$/.test(idOrLogInID);
    if (maybeObjectId) {
      filter = { _id: idOrLogInID };
    }

    const updated = await User.findOneAndUpdate(
      filter,
      {
        ...(fullName !== undefined ? { fullName } : {}),
        ...(email !== undefined ? { email } : {}),
        ...(phoneNumber !== undefined ? { phoneNumber } : {}),
        ...(designation !== undefined ? { designation } : {}),
        ...(address !== undefined ? { address } : {}),
        ...(avatarUrl !== undefined ? { avatarUrl } : {}),
      },
      { new: true, runValidators: true }
    ).lean();

    if (!updated) return res.status(404).json({ message: "Employee not found" });

    res.json({ message: "Employee updated", employee: mapToEmployee(updated) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const idOrLogInID = req.params.id;

    let filter = { logInID: idOrLogInID };
    const maybeObjectId = typeof idOrLogInID === "string" && /^[a-fA-F0-9]{24}$/.test(idOrLogInID);
    if (maybeObjectId) {
      filter = { _id: idOrLogInID };
    }

    const deleted = await User.findOneAndDelete(filter).lean();

    if (!deleted) return res.status(404).json({ message: "Employee not found" });

    res.json({ message: "Employee deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const createEmployee = async (req, res) => {
  res.status(501).json({ message: "Create employee not implemented yet" });
};

export { getAllEmployees, updateEmployee, deleteEmployee, createEmployee };

