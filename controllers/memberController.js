import Member from "../models/Member.js";

// Add a new member
export const addMember = async (req, res) => {
  try {
    const { name, phone, plan, feeAmount, lastPaymentDate, nextDueDate } =
      req.body;

    // Check if member with phone already exists
    const existingMember = await Member.findOne({ phone });
    if (existingMember) {
      return res
        .status(400)
        .json({ message: "Member with this phone number already exists" });
    }

    const member = await Member.create({
      name,
      phone,
      plan,
      feeAmount,
      lastPaymentDate,
      nextDueDate,
    });

    res.status(201).json({ message: "Member added successfully", member });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding member", error: error.message });
  }
};

// Get all members
export const getAllMembers = async (req, res) => {
  try {
    const members = await Member.find().sort({ createdAt: -1 });
    res.status(200).json(members);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching members", error: error.message });
  }
};

// Get a single member by ID
export const getMemberById = async (req, res) => {
  try {
    const { id } = req.params;

    const member = await Member.findById(id);
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    res.status(200).json(member);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching member", error: error.message });
  }
};

// Update a member
export const updateMember = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const member = await Member.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    res.status(200).json({ message: "Member updated successfully", member });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating member", error: error.message });
  }
};

// Delete a member
export const deleteMember = async (req, res) => {
  try {
    const { id } = req.params;

    const member = await Member.findByIdAndDelete(id);

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    res.status(200).json({ message: "Member deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting member", error: error.message });
  }
};

// Get overdue members
export const getOverdueMembers = async (req, res) => {
  try {
    const today = new Date();
    const members = await Member.find({ nextDueDate: { $lt: today } }).sort({
      nextDueDate: 1,
    });
    res.status(200).json(members);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching overdue members",
      error: error.message,
    });
  }
};

// Get due soon members (within 7 days)
export const getDueSoonMembers = async (req, res) => {
  try {
    const today = new Date();
    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(today.getDate() + 7);

    const members = await Member.find({
      nextDueDate: { $gte: today, $lte: sevenDaysLater },
    }).sort({ nextDueDate: 1 });

    res.status(200).json(members);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching due soon members",
      error: error.message,
    });
  }
};

// Get paid members (not overdue and not due soon)
export const getPaidMembers = async (req, res) => {
  try {
    const today = new Date();
    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(today.getDate() + 7);

    const members = await Member.find({
      nextDueDate: { $gt: sevenDaysLater },
    }).sort({ nextDueDate: 1 });

    res.status(200).json(members);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching paid members", error: error.message });
  }
};

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(today.getDate() + 7);

    const totalMembers = await Member.countDocuments();
    const overdueCount = await Member.countDocuments({
      nextDueDate: { $lt: today },
    });
    const dueSoonCount = await Member.countDocuments({
      nextDueDate: { $gte: today, $lte: sevenDaysLater },
    });
    const paidCount = await Member.countDocuments({
      nextDueDate: { $gt: sevenDaysLater },
    });

    res.status(200).json({
      totalMembers,
      overdue: overdueCount,
      dueSoon: dueSoonCount,
      paid: paidCount,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching dashboard stats",
      error: error.message,
    });
  }
};

// Search and filter members
export const searchMembers = async (req, res) => {
  try {
    const { search, filter } = req.query;
    const today = new Date();
    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(today.getDate() + 7);

    let query = {};

    // Search by name or phone using text index
    if (search) {
      query.$text = { $search: search };
    }

    // Apply filter
    if (filter) {
      switch (filter.toLowerCase()) {
        case "unpaid":
          query.nextDueDate = { $lt: today };
          break;
        case "due-soon":
          query.nextDueDate = { $gte: today, $lte: sevenDaysLater };
          break;
        case "paid":
          query.nextDueDate = { $gt: sevenDaysLater };
          break;
        case "all":
        default:
          break;
      }
    }

    const members = await Member.find(query).sort({ createdAt: -1 });
    res.status(200).json(members);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error searching members", error: error.message });
  }
};
