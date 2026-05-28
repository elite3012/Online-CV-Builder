-- Keep long-form resume text in TEXT columns so AI imports and editor content do not fail at 255 characters.
ALTER TABLE "cv" ALTER COLUMN "summary" TYPE TEXT;
ALTER TABLE "education" ALTER COLUMN "description" TYPE TEXT;
ALTER TABLE "experience" ALTER COLUMN "description" TYPE TEXT;
ALTER TABLE "project" ALTER COLUMN "description" TYPE TEXT;

-- Seed templates on every application startup.
-- IDs must match frontend/src/data/templates.js because the frontend sends these IDs when creating a CV.
INSERT INTO "template" ("template_id", "template_name") VALUES
    (1, 'Modern'),
    (2, 'Minimal'),
    (3, 'Classic'),
    (4, 'Creative'),
    (5, 'Professional'),
    (6, 'Elegant'),
    (7, 'Classic 2'),
    (8, 'Professional 2'),
    (9, 'Modern 2')
ON CONFLICT ("template_id") DO UPDATE
SET "template_name" = EXCLUDED."template_name";

SELECT setval(pg_get_serial_sequence('"template"', 'template_id'), (SELECT MAX("template_id") FROM "template"));
