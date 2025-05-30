import prisma from "../lib/prisma.js";

export const createTourRequest = async (req, res) => {
  const {
    propertyId,
    agencyId,
    preferredDate,
    preferredTime,
    contactPhone,
    message,
  } = req.body;
  const clientId = req.userId; // From auth middleware

  try {
    // Verify property exists and get agency info
    const property = await prisma.post.findUnique({
      where: { id: propertyId },
      include: { user: true },
    });

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // Verify the property belongs to the specified agency
    if (property.userId !== agencyId) {
      return res
        .status(400)
        .json({ message: "Property does not belong to this agency" });
    }

    // Create tour request
    const tourRequest = await prisma.tourRequest.create({
      data: {
        propertyId,
        clientId,
        agencyId,
        preferredDate,
        preferredTime,
        contactPhone,
        message: message || null,
        status: "pending",
      },
      include: {
        property: true,
        client: {
          select: { id: true, username: true, email: true },
        },
        agency: {
          select: {
            id: true,
            username: true,
            email: true,
            agencyName: true,
            phone: true,
          },
        },
      },
    });

    res.status(201).json(tourRequest);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create tour request" });
  }
};

export const getTourRequestsByClient = async (req, res) => {
  const clientId = req.userId;

  try {
    const tourRequests = await prisma.tourRequest.findMany({
      where: { clientId },
      include: {
        property: true,
        agency: {
          select: {
            id: true,
            username: true,
            email: true,
            agencyName: true,
            phone: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json(tourRequests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get tour requests" });
  }
};

export const getTourRequestsByAgency = async (req, res) => {
  const agencyId = req.userId;

  try {
    const tourRequests = await prisma.tourRequest.findMany({
      where: { agencyId },
      include: {
        property: true,
        client: {
          select: { id: true, username: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json(tourRequests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get tour requests" });
  }
};

export const updateTourRequest = async (req, res) => {
  const { id } = req.params;
  const { status, confirmedDate, confirmedTime, declineReason } = req.body;
  const userId = req.userId;

  try {
    // First check if tour request exists and user has permission
    const existingRequest = await prisma.tourRequest.findUnique({
      where: { id: parseInt(id) },
      include: { agency: true, client: true },
    });

    if (!existingRequest) {
      return res.status(404).json({ message: "Tour request not found" });
    }

    // Check if user is the agency or client for this request
    if (
      existingRequest.agencyId !== userId &&
      existingRequest.clientId !== userId
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this request" });
    }

    const updateData = { status };

    if (status === "confirmed" && confirmedDate && confirmedTime) {
      updateData.confirmedDate = confirmedDate;
      updateData.confirmedTime = confirmedTime;
    }

    if (status === "declined" && declineReason) {
      updateData.declineReason = declineReason;
    }

    const updatedRequest = await prisma.tourRequest.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        property: true,
        client: {
          select: { id: true, username: true, email: true },
        },
        agency: {
          select: {
            id: true,
            username: true,
            email: true,
            agencyName: true,
            phone: true,
          },
        },
      },
    });

    res.status(200).json(updatedRequest);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update tour request" });
  }
};

export const deleteTourRequest = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    const tourRequest = await prisma.tourRequest.findUnique({
      where: { id: parseInt(id) },
    });

    if (!tourRequest) {
      return res.status(404).json({ message: "Tour request not found" });
    }

    // Only client can delete their own requests
    if (tourRequest.clientId !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this request" });
    }

    await prisma.tourRequest.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: "Tour request deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete tour request" });
  }
};
