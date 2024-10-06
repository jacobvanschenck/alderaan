CREATE TABLE IF NOT EXISTS "alderaan_songs" (
	"song_id" serial PRIMARY KEY NOT NULL,
	"title" varchar(256),
	"artist" varchar(256),
	"tempo" varchar(256),
	"content" text,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
