CREATE TABLE IF NOT EXISTS "alderaan_sets" (
	"set_id" uuid PRIMARY KEY NOT NULL,
	"date" timestamp with time zone NOT NULL,
	"title" varchar(256),
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "alderaan_song_sets" (
	"set_id" uuid,
	"song_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "alderaan_songs" (
	"song_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(256),
	"artist" varchar(256),
	"tempo" varchar(256),
	"content" text,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "alderaan_song_sets" ADD CONSTRAINT "alderaan_song_sets_set_id_alderaan_sets_set_id_fk" FOREIGN KEY ("set_id") REFERENCES "public"."alderaan_sets"("set_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "alderaan_song_sets" ADD CONSTRAINT "alderaan_song_sets_song_id_alderaan_songs_song_id_fk" FOREIGN KEY ("song_id") REFERENCES "public"."alderaan_songs"("song_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
