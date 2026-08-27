CREATE TYPE "public"."assignment_status" AS ENUM('pending', 'accepted', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."delivery_status" AS ENUM('open', 'assigned', 'accepted', 'picked_up', 'in_transit', 'delivered', 'failed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('admin', 'retailer', 'dispatcher', 'rider');--> statement-breakpoint
CREATE TABLE "delivery_assignments" (
	"id" serial PRIMARY KEY NOT NULL,
	"delivery_request_id" integer NOT NULL,
	"rider_id" integer NOT NULL,
	"dispatcher_id" integer NOT NULL,
	"status" "assignment_status" DEFAULT 'pending',
	"assigned_at" timestamp DEFAULT now(),
	CONSTRAINT "delivery_assignments_delivery_request_id_unique" UNIQUE("delivery_request_id")
);
--> statement-breakpoint
CREATE TABLE "delivery_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"retailer_id" integer NOT NULL,
	"customer_name" varchar(255) NOT NULL,
	"customer_phone" varchar(20) NOT NULL,
	"delivery_address" text NOT NULL,
	"latitude" numeric(10, 7),
	"longitude" numeric(10, 7),
	"item_description" text NOT NULL,
	"special_instructions" text,
	"status" "delivery_status" DEFAULT 'open',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "delivery_status_history" (
	"id" serial PRIMARY KEY NOT NULL,
	"delivery_request_id" integer NOT NULL,
	"status" "delivery_status" NOT NULL,
	"updated_by" integer NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "dispatchers" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "dispatchers_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "proof_of_delivery" (
	"id" serial PRIMARY KEY NOT NULL,
	"delivery_request_id" integer NOT NULL,
	"recipient_name" varchar(255),
	"qr_code" varchar(255),
	"photo_url" text,
	"signature_url" text,
	"delivered_at" timestamp DEFAULT now(),
	CONSTRAINT "proof_of_delivery_delivery_request_id_unique" UNIQUE("delivery_request_id")
);
--> statement-breakpoint
CREATE TABLE "retailers" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"business_name" varchar(255) NOT NULL,
	"address" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "retailers_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "rider_locations" (
	"rider_id" integer PRIMARY KEY NOT NULL,
	"latitude" numeric(10, 7) NOT NULL,
	"longitude" numeric(10, 7) NOT NULL,
	"speed" integer,
	"heading" integer,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "riders" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"vehicle_type" varchar(50),
	"plate_number" varchar(50),
	"license_number" varchar(100),
	"national_id" varchar(50),
	"is_available" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "riders_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"first_name" varchar(100) NOT NULL,
	"last_name" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(20),
	"password" varchar(255) NOT NULL,
	"role" "user_role" NOT NULL,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "delivery_assignments" ADD CONSTRAINT "delivery_assignments_delivery_request_id_delivery_requests_id_fk" FOREIGN KEY ("delivery_request_id") REFERENCES "public"."delivery_requests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "delivery_assignments" ADD CONSTRAINT "delivery_assignments_rider_id_riders_id_fk" FOREIGN KEY ("rider_id") REFERENCES "public"."riders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "delivery_assignments" ADD CONSTRAINT "delivery_assignments_dispatcher_id_dispatchers_id_fk" FOREIGN KEY ("dispatcher_id") REFERENCES "public"."dispatchers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "delivery_requests" ADD CONSTRAINT "delivery_requests_retailer_id_retailers_id_fk" FOREIGN KEY ("retailer_id") REFERENCES "public"."retailers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "delivery_status_history" ADD CONSTRAINT "delivery_status_history_delivery_request_id_delivery_requests_id_fk" FOREIGN KEY ("delivery_request_id") REFERENCES "public"."delivery_requests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "delivery_status_history" ADD CONSTRAINT "delivery_status_history_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dispatchers" ADD CONSTRAINT "dispatchers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "proof_of_delivery" ADD CONSTRAINT "proof_of_delivery_delivery_request_id_delivery_requests_id_fk" FOREIGN KEY ("delivery_request_id") REFERENCES "public"."delivery_requests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "retailers" ADD CONSTRAINT "retailers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rider_locations" ADD CONSTRAINT "rider_locations_rider_id_riders_id_fk" FOREIGN KEY ("rider_id") REFERENCES "public"."riders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "riders" ADD CONSTRAINT "riders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "delivery_requests_retailer_idx" ON "delivery_requests" USING btree ("retailer_id");--> statement-breakpoint
CREATE INDEX "rider_locations_rider_idx" ON "rider_locations" USING btree ("rider_id");