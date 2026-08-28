import { eq } from "drizzle-orm";

import { db } from "../db";

import {
  riders,
  deliveryAssignments,
  deliveryRequests,
  deliveryStatusHistory,
} from "../db/schema";

export const acceptAssignment = async (
  assignmentId: number,
  riderUserId: number
) => {
  const rider =
    await db.query.riders.findFirst({
      where: eq(
        riders.userId,
        riderUserId
      ),
    });

  if (!rider) {
    throw new Error("Rider not found");
  }

  const assignment =
    await db.query.deliveryAssignments.findFirst({
      where: eq(
        deliveryAssignments.id,
        assignmentId
      ),
    });

  if (!assignment) {
    throw new Error(
      "Assignment not found"
    );
  }

  if (assignment.riderId !== rider.id) {
    throw new Error(
      "This assignment does not belong to you"
    );
  }

  const [updatedAssignment] =
    await db
      .update(deliveryAssignments)
      .set({
        status: "accepted",
      })
      .where(
        eq(
          deliveryAssignments.id,
          assignmentId
        )
      )
      .returning();

  await db
    .update(deliveryRequests)
    .set({
      status: "accepted",
    })
    .where(
      eq(
        deliveryRequests.id,
        assignment.deliveryRequestId
      )
    );

  await db
    .insert(deliveryStatusHistory)
    .values({
      deliveryRequestId:
        assignment.deliveryRequestId,

      status: "accepted",

      updatedBy:
        riderUserId,

      notes:
        "Rider accepted assignment",
    });

  return updatedAssignment;
};

export const rejectAssignment = async (
  assignmentId: number,
  riderUserId: number
) => {
  const rider =
    await db.query.riders.findFirst({
      where: eq(
        riders.userId,
        riderUserId
      ),
    });

  if (!rider) {
    throw new Error("Rider not found");
  }

  const assignment =
    await db.query.deliveryAssignments.findFirst({
      where: eq(
        deliveryAssignments.id,
        assignmentId
      ),
    });

  if (!assignment) {
    throw new Error(
      "Assignment not found"
    );
  }

  if (assignment.riderId !== rider.id) {
    throw new Error(
      "This assignment does not belong to you"
    );
  }

  const [updatedAssignment] =
    await db
      .update(deliveryAssignments)
      .set({
        status: "rejected",
      })
      .where(
        eq(
          deliveryAssignments.id,
          assignmentId
        )
      )
      .returning();

  await db
    .update(deliveryRequests)
    .set({
      status: "open",
    })
    .where(
      eq(
        deliveryRequests.id,
        assignment.deliveryRequestId
      )
    );

  await db
    .insert(deliveryStatusHistory)
    .values({
      deliveryRequestId:
        assignment.deliveryRequestId,

      status: "open",

      updatedBy:
        riderUserId,

      notes:
        "Rider rejected assignment",
    });

  return updatedAssignment;
};