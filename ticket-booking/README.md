# RailGo: Ticket Booking

Effortless railway ticket booking at your fingertips. A Reactive Accelerator practice project built with Next.js 16 (App Router), React 19 and Tailwind CSS v4.

## Run it

1. Install the packages:

   ```bash
   npm install
   ```

2. Create `.env.local` in this folder with a random secret (at least 32 characters). This prints one:

   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

   ```bash
   SESSION_SECRET=paste-the-64-characters-here
   ```

3. Start the dev server and open <http://localhost:3000>:

   ```bash
   npm run dev
   ```

Demo account: `demo@railgo.test` / `railgo123`.

`data/db.json` is created from `data/seed.js` on the first run. Delete it to start over with fresh sample data.

Train names are real Bangladesh Railway trains; times, fares and seat sales are sample data. No real payment is taken.
