-- Run this in pgAdmin Query Tool connected to database LankaVisit
-- (right-click LankaVisit → Query Tool, not the campuseats tab)

SELECT current_database() AS database_name;

SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

SELECT COUNT(*) AS places FROM places;
SELECT COUNT(*) AS users FROM users;
SELECT COUNT(*) AS stays FROM accommodations;
SELECT COUNT(*) AS feedback FROM feedback;
