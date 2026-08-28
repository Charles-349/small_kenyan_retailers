import { db } from "../db";
import { deliveryRequests, deliveryAssignments, riders, riderLocations } from "../db/schema";
import { count } from "drizzle-orm";

export class AnalyticsService {
  /**
   * Generates logistics overview: Total deliveries, completion rates, fleet totals
   */
  static async getLogisticsOverview() {
    const totalDeliveries = await db
      .select({ count: count() })
      .from(deliveryRequests);

    const totalRiders = await db
      .select({ count: count() })
      .from(riders);

    const totalAssignments = await db
      .select({ count: count() })
      .from(deliveryAssignments);

    const totalOrdersCount = Number(totalDeliveries[0]?.count || 0);
    const assignedOrdersCount = Number(totalAssignments[0]?.count || 0);

    return {
      summary: {
        totalOrders: totalOrdersCount,
        assignedOrders: assignedOrdersCount,
        openOrders: Math.max(0, totalOrdersCount - assignedOrdersCount),
      },
      fleet: {
        totalRiders: Number(totalRiders[0]?.count || 0),
      },
    };
  }

  /**
   * Rider-specific performance analytics
   */
  static async getRiderPerformance(riderId: number) {
    const totalAssignments = await db
      .select({ count: count() })
      .from(deliveryAssignments);

    const totalBreadcrumbs = await db
      .select({ count: count() })
      .from(riderLocations);

    return {
      riderId,
      totalTripsAssigned: Number(totalAssignments[0]?.count || 0),
      gpsBreadcrumbsLogged: Number(totalBreadcrumbs[0]?.count || 0),
    };
  }
}