CREATE TABLE IF NOT EXISTS "alderaan_sections" (
	"section_id" serial PRIMARY KEY NOT NULL,
	"song_id" integer,
	"title" varchar(256),
	"content" text,
	"lyrics" text,
	"order" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "alderaan_songs" (
	"song_id" serial PRIMARY KEY NOT NULL,
	"title" varchar(256),
	"artist" varchar(256),
	"key" varchar(256),
	"tempo" varchar(256),
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);

const string = `{title: No Longer Slaves}
{artist: Jonathan and Melissa Helser}
{key: E}
{tempo: 74}`
