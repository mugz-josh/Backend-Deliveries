# Backend MySQL Migration Tasks

## Completed Tasks
- [x] Update `backend/src/db.ts` to use mysql2 instead of pg
- [x] Create/update `backend/.env` with MySQL environment variables
- [x] Verify MySQL connection works (shows "✅ Connected to MySQL successfully!")
- [x] Test backend startup with MySQL (confirmed working)
- [x] Fix SQL syntax error in test query

## Pending Tasks
- [ ] Check if database tables exist or need creation
- [ ] Update any hardcoded database references if needed
- [ ] Fix email authentication (Gmail credentials invalid)

## Notes
- Assumed local MySQL credentials: host=localhost, user=root, password=, database=deliveries, port=3306
- If different credentials are needed, update .env accordingly
- Ensure MySQL server is running locally
