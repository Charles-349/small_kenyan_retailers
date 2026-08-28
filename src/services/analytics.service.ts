import { db } from "../db";
import { deliveryRequests, deliveryAssignments, riders, riderLocations } from "../db/schema";
import { eq, sql, count } from "drizzle-orm";

export class AnalyticsService {
  /**
   * Generates logistics overview: Total deliveries, completion rate, active riders
   */
  static async getLogisticsOverview() {
    // 1. Order Status Counts
    const totalDeliveries = await db
      .select({ count: count() })
      .from(deliveryRequests);

    const completedDeliveries = await db
      .select({ count: count() })
      .from(deliveryRequests)
      .where(eq(deliveryRequests.status, "delivered"));

    const openDeliveries = await db
      .select({ count: count() })
      .from(deliveryRequests)
      .where(eq(deliveryRequests.status, "open"));

    const inTransitDeliveries = await db
      .select({ count: count() })
      .from(deliveryRequests)
      .where(eq(deliveryRequests.status, "assigned"));

    // 2. Rider Fleet Metrics
    const totalRiders = await db
      .select({ count: count() })
      .from(riders);

    const availableRiders = await db
      .select({ count: count() })
      .from(riders)
      .where(eq(riders.status, "available"));

    const totalCount = Number(totalDeliveries[0]?.count || 0);
    const completedCount = Number(completedDeliveries[0]?.count || 0);
    const fulfillmentRate = totalCount > 0 ? ((completedCount / totalCount) * 100).toFixed(2) : "0.00";

    return {
      summary: {
        totalOrders: totalCount,
        completedOrders: completedCount,
        openOrders: Number(openDeliveries[0]?.count || 0),
        inTransitOrders: Number(inTransitDeliveries[0]?.count || 0),
        fulfillmentRate: `${fulfillmentRate}%`,
      },
      fleet: {
        totalRiders: Number(totalRiders[0]?.count || 0),
        availableRiders: Number(availableRiders[0]?.count || 0),
      },
    };
  }

  /**
   * Rider-specific performance analytics
   */
  static async getRiderPerformance(riderId: number) {
    const totalAssignments = await db
      .select({ count: count() })
      .from(deliveryAssignments)
      .where(eq(deliveryAssignments.riderId, riderId));

    const totalBreadcrumbs = await db
      .select({ count: count() })
      .from(riderLocations)
      .where(eq(riderLocations.riderId, riderId));

    return {
      riderId,
      totalTripsAssigned: Number(totalAssignments[0]?.count || 0),
      gpsBreadcrumbsLogged: Number(totalBreadcrumbs[0]?.count || 0),
    };
  }
}