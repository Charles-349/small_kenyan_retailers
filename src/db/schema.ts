import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  integer,
  boolean,
  pgEnum,
  index,
  decimal,
} from "drizzle-orm/pg-core";

import { relations } from "drizzle-orm";

// ENUMS
export const userRoleEnum = pgEnum("user_role", [
  "admin",
  "retailer",
  "dispatcher",
  "rider",
]);

export const deliveryStatusEnum = pgEnum("delivery_status", [
  "open",
  "assigned",
  "accepted",
  "picked_up",
  "in_transit",
  "delivered",
  "failed",
  "cancelled",
]);

export const assignmentStatusEnum = pgEnum(
  "assignment_status",
  [
    "pending",
    "accepted",
    "rejected",
  ]
);

//USERS

export const users = pgTable("users", {
  id: serial("id").primaryKey(),

  firstName: varchar("first_name", {
    length: 100,
  }).notNull(),

  lastName: varchar("last_name", {
    length: 100,
  }).notNull(),

  email: varchar("email", {
    length: 255,
  }).notNull().unique(),

  phone: varchar("phone", {
    length: 20,
  }),

  password: varchar("password", {
    length: 255,
  }).notNull(),

  role: userRoleEnum("role").notNull(),

  isActive: boolean("is_active").default(true),

  createdAt: timestamp("created_at").defaultNow(),

  updatedAt: timestamp("updated_at").defaultNow(),
});

//RETAILERS
export const retailers = pgTable("retailers", {
  id: serial("id").primaryKey(),

  userId: integer("user_id")
    .references(() => users.id)
    .notNull()
    .unique(),

  businessName: varchar("business_name", {
    length: 255,
  }).notNull(),

  address: text("address"),

  createdAt: timestamp("created_at").defaultNow(),
});

//DISPATCHERS

export const dispatchers = pgTable("dispatchers", {
  id: serial("id").primaryKey(),

  userId: integer("user_id")
    .references(() => users.id)
    .notNull()
    .unique(),

  createdAt: timestamp("created_at").defaultNow(),
});

//RIDERS
export const riders = pgTable("riders", {
  id: serial("id").primaryKey(),

  userId: integer("user_id")
    .references(() => users.id)
    .notNull()
    .unique(),

  vehicleType: varchar("vehicle_type", {
    length: 50,
  }),

  plateNumber: varchar("plate_number", {
    length: 50,
  }),
  licenseNumber: varchar("license_number", {
  length: 100,
  }),

  nationalId: varchar("national_id", {
  length: 50,
  }),

  isAvailable: boolean("is_available")
    .default(true),

  createdAt: timestamp("created_at")
    .defaultNow(),
});

// DELIVERY REQUESTS
export const deliveryRequests = pgTable(
  "delivery_requests",
  {
    id: serial("id").primaryKey(),

    retailerId: integer("retailer_id")
      .references(() => retailers.id)
      .notNull(),

    customerName: varchar("customer_name", {
      length: 255,
    }).notNull(),

    customerPhone: varchar("customer_phone", {
      length: 20,
    }).notNull(),

    deliveryAddress: text(
      "delivery_address"
    ).notNull(),

    latitude: decimal("latitude", {
      precision: 10,
      scale: 7,
    }),

    longitude: decimal("longitude", {
      precision: 10,
      scale: 7,
    }),

    itemDescription: text(
      "item_description"
    ).notNull(),

    specialInstructions: text(
      "special_instructions"
    ),

    status: deliveryStatusEnum(
      "status"
    ).default("open"),

    createdAt: timestamp(
      "created_at"
    ).defaultNow(),

    updatedAt: timestamp(
      "updated_at"
    ).defaultNow(),
  },
  (table) => ({
    retailerIdx: index(
      "delivery_requests_retailer_idx"
    ).on(table.retailerId),
  })
);

//RIDER LOCATIONS
export const riderLocations = pgTable(
  "rider_locations",
  {
    riderId: integer("rider_id")
      .references(() => riders.id)
      .primaryKey(),

    latitude: decimal("latitude", {
      precision: 10,
      scale: 7,
    }).notNull(),

    longitude: decimal("longitude", {
      precision: 10,
      scale: 7,
    }).notNull(),

    speed: integer("speed"),

    heading: integer("heading"),

    updatedAt: timestamp(
      "updated_at"
    ).defaultNow(),
  },
  (table) => ({
    riderIdx: index(
      "rider_locations_rider_idx"
    ).on(table.riderId),
  })
);

// DELIVERY ASSIGNMENTS
export const deliveryAssignments = pgTable(
  "delivery_assignments",
  {
    id: serial("id").primaryKey(),

    deliveryRequestId: integer(
      "delivery_request_id"
    )
      .references(
        () => deliveryRequests.id
      )
      .notNull()
      .unique(),

    riderId: integer("rider_id")
      .references(() => riders.id)
      .notNull(),

    dispatcherId: integer(
      "dispatcher_id"
    )
      .references(
        () => dispatchers.id
      )
      .notNull(),

    status: assignmentStatusEnum(
      "status"
      ).default("pending"),

    assignedAt: timestamp(
      "assigned_at"
    ).defaultNow(),
  }
);

//DELIVERY STATUS HISTORY
export const deliveryStatusHistory =
  pgTable(
    "delivery_status_history",
    {
      id: serial("id").primaryKey(),

      deliveryRequestId: integer(
        "delivery_request_id"
      )
        .references(
          () => deliveryRequests.id
        )
        .notNull(),

      status: deliveryStatusEnum(
        "status"
      ).notNull(),

      updatedBy: integer(
        "updated_by"
      )
        .references(() => users.id)
        .notNull(),

      notes: text("notes"),

      createdAt: timestamp(
        "created_at"
      ).defaultNow(),
    }
  );

//PROOF OF DELIVERY
export const proofOfDelivery = pgTable(
  "proof_of_delivery",
  {
    id: serial("id").primaryKey(),
    deliveryRequestId: integer(
    "delivery_request_id"
     )
    .references(
    () => deliveryRequests.id
    )
    .notNull()
    .unique(),

    recipientName: varchar(
      "recipient_name",
      {
        length: 255,
      }
    ),

    qrCode: varchar("qr_code", {
      length: 255,
    }),

    photoUrl: text("photo_url"),

    signatureUrl: text(
      "signature_url"
    ),

    deliveredAt: timestamp(
      "delivered_at"
    ).defaultNow(),
  }
);

//RELATIONS
export const usersRelations = relations(
  users,
  ({ one }) => ({
    retailer: one(retailers),

    dispatcher: one(dispatchers),

    rider: one(riders),
  })
);

export const retailersRelations =
  relations(
    retailers,
    ({ one, many }) => ({
      user: one(users, {
        fields: [retailers.userId],
        references: [users.id],
      }),

      deliveryRequests: many(
        deliveryRequests
      ),
    })
  );

export const dispatchersRelations =
  relations(
    dispatchers,
    ({ one, many }) => ({
      user: one(users, {
        fields: [
          dispatchers.userId,
        ],
        references: [users.id],
      }),

      assignments: many(
        deliveryAssignments
      ),
    })
  );

export const ridersRelations =
  relations(
    riders,
    ({ one, many }) => ({
      user: one(users, {
        fields: [riders.userId],
        references: [users.id],
      }),

      assignments: many(
        deliveryAssignments
      ),

      location: one(
        riderLocations,
        {
          fields: [riders.id],
          references: [riderLocations.riderId],
        }
      ),
    })
  );

  export const riderLocationsRelations =
  relations(
    riderLocations,
    ({ one }) => ({
      rider: one(riders, {
        fields: [
          riderLocations.riderId,
        ],
        references: [riders.id],
      }),
    })
  );

export const deliveryRequestsRelations =
  relations(
    deliveryRequests,
    ({ one, many }) => ({
      retailer: one(retailers, {
        fields: [
          deliveryRequests.retailerId,
        ],
        references: [
          retailers.id,
        ],
      }),

      assignments: many(
        deliveryAssignments
      ),

      statusHistory: many(
        deliveryStatusHistory
      ),

      proofOfDelivery: one(
      proofOfDelivery,
      {
      fields: [deliveryRequests.id],
      references: [proofOfDelivery.deliveryRequestId],
  }
),
    })
  );

export const deliveryAssignmentsRelations =
  relations(
    deliveryAssignments,
    ({ one }) => ({
      deliveryRequest: one(
        deliveryRequests,
        {
          fields: [
            deliveryAssignments.deliveryRequestId,
          ],
          references: [
            deliveryRequests.id,
          ],
        }
      ),

      rider: one(riders, {
        fields: [
          deliveryAssignments.riderId,
        ],
        references: [riders.id],
      }),

      dispatcher: one(
        dispatchers,
        {
          fields: [
            deliveryAssignments.dispatcherId,
          ],
          references: [
            dispatchers.id,
          ],
        }
      ),
    })
  );

export const deliveryStatusHistoryRelations =
  relations(
    deliveryStatusHistory,
    ({ one }) => ({
      deliveryRequest: one(
        deliveryRequests,
        {
          fields: [
            deliveryStatusHistory.deliveryRequestId,
          ],
          references: [
            deliveryRequests.id,
          ],
        }
      ),

      updatedByUser: one(users, {
        fields: [
          deliveryStatusHistory.updatedBy,
        ],
        references: [users.id],
      }),
    })
  );

export const proofOfDeliveryRelations =
  relations(
    proofOfDelivery,
    ({ one }) => ({
      deliveryRequest: one(
        deliveryRequests,
        {
          fields: [
            proofOfDelivery.deliveryRequestId,
          ],
          references: [
            deliveryRequests.id,
          ],
        }
      ),
    })
  );

//TYPES
export type TIUser = typeof users.$inferInsert;
export type TSUser = typeof users.$inferSelect;

export type TIRetailer =
  typeof retailers.$inferInsert;
export type TSRetailer =
  typeof retailers.$inferSelect;

export type TIDispatcher =
  typeof dispatchers.$inferInsert;
export type TSDispatcher =
  typeof dispatchers.$inferSelect;

export type TIRider =
  typeof riders.$inferInsert;
export type TSRider =
  typeof riders.$inferSelect;

export type TIDeliveryRequest =
  typeof deliveryRequests.$inferInsert;
export type TSDeliveryRequest =
  typeof deliveryRequests.$inferSelect;

export type TIDeliveryAssignment =
  typeof deliveryAssignments.$inferInsert;
export type TSDeliveryAssignment =
  typeof deliveryAssignments.$inferSelect;

export type TIDeliveryStatusHistory =
  typeof deliveryStatusHistory.$inferInsert;
export type TSDeliveryStatusHistory =
  typeof deliveryStatusHistory.$inferSelect;

export type TIProofOfDelivery =
  typeof proofOfDelivery.$inferInsert;
export type TSProofOfDelivery =
  typeof proofOfDelivery.$inferSelect;

  export type TIRiderLocation =
  typeof riderLocations.$inferInsert;
export type TSRiderLocation =
  typeof riderLocations.$inferSelect;
