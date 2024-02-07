CREATE TABLE "public"."notes" ("id" UUID NOT NULL DEFAULT gen_random_uuid(), "content" text NOT NULL, "user_id" uuid NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON UPDATE restrict ON DELETE restrict);