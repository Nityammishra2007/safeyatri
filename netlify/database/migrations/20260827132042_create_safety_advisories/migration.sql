CREATE TABLE "safety_advisories" (
	"id" serial PRIMARY KEY,
	"message" text NOT NULL,
	"severity" text NOT NULL,
	"time" timestamp with time zone DEFAULT now() NOT NULL
);
