# scroom
A scrum-based project management tool bootstrapped with `create-t3-app`.

It was built by the following team during the FIT2101 project at Monash University:
1. Lachlan MacPhee
2. Isabella Moffat
3. Jack Moses
4. Raphael Schwalb
5. Max Fergie
6. Levi Kogan

## Development Environment Setup
1. Create a MySQL database somewhere (or change the Prisma schema to Postgres, SQLite etc)
2. Fill out the necessary environment variables using the example env
    - Database URL can be grabbed from your database provider, otherwise if hosting locally adjust the string to suit.
    - OAuth can be setup with Discord and Google
    - Add your email account details for magic links
3. Run `npm install`
4. Run `npm run dev`
