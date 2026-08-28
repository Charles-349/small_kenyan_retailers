ALTER TABLE "delivery_requests" ADD COLUMN "tracking_token" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "delivery_requests" ADD COLUMN "delivery_qr_code" varchar(255);--> statement-breakpoint
ALTER TABLE "delivery_requests" ADD CONSTRAINT "delivery_requests_tracking_token_unique" UNIQUE("tracking_token");