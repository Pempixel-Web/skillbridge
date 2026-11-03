# SkillBridge: Supabase Setup Guide

Follow these steps in order. Total time: about 15 minutes.

---

## Step 1. Install the Supabase package

In your project folder (where `package.json` is), run:

```bash
npm install @supabase/supabase-js
```

---

## Step 2. Create your Supabase project

1. Go to https://supabase.com and sign in (GitHub login works).
2. Click **New project**. Give it a name (e.g. `skillbridge`).
3. Set a **database password** and save it somewhere safe.
4. Pick the **region closest to your students**, then click **Create new project**. Wait 1 to 2 minutes.

---

## Step 3. Create the database

1. In the left menu, open **SQL Editor** → **New query**.
2. Open the file `supabase/schema.sql` from this project, copy **everything**, and paste it into the editor.
3. Click **Run**. You should see "Success".

This creates the tables (`profiles`, `profile_contacts`, `saved_profiles`, `reports`), the security rules, the automatic profile creation on signup, the delete-account function, and the `avatars` storage bucket.

To check: open **Table Editor**. You should see the four tables.

---

## Step 4. Connect your keys (the only place you paste them)

1. In Supabase, go to **Project Settings → API** (in newer versions it may be under the **Connect** button).
2. Copy the **Project URL** and the **anon / public key**.
3. Open the `.env` file in your project root and replace the placeholders:

```
VITE_SUPABASE_URL=https://abcdxyz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...your-long-key...
```

4. Stop the dev server (Ctrl + C) and run `npm run dev` again. Vite only reads `.env` on start.

> **Never** paste the `service_role` key anywhere in this project. The anon key is designed to be public; your data is protected by the security rules from Step 3.

**Keep `.env` out of GitHub.** Open `.gitignore` and add these two lines at the bottom:

```
.env
.env.local
```

---

## Step 5. Configure sign-in and emails

In Supabase go to **Authentication**:

1. **Sign In / Providers → Email**: make sure Email is **enabled** and **Confirm email** is **ON**. Set the minimum password length to **8**.
2. **URL Configuration**:
   - **Site URL**: `http://localhost:5173` (change to your live URL when you launch)
   - **Redirect URLs**: add both of these:
     - `http://localhost:5173/**`
     - `https://skillbridggeeee.vercel.app/**` (your Vercel URL)

   Without this, the links in verification and password-reset emails will not work.
3. **Emails → Templates** (optional): edit the wording of "Confirm signup" and "Reset password" so they say SkillBridge.

### Important before real students use it: set up custom email (SMTP)

Supabase's built-in email sender allows only a **few emails per hour**. Real students signing up will hit that limit. Before launch:

**Authentication → Emails → SMTP Settings** → enable custom SMTP using a provider like **Resend**, **Brevo**, or **Mailgun** (all have free tiers).

---

## Step 6. Test it (checklist)

Run `npm run dev` and try this yourself:

- [ ] Click **Join the community** → sign up with a real email you can open.
- [ ] You land on "Check your inbox". Open the email, click the link.
- [ ] You arrive on the 3-step onboarding. Fill it in and click **Finish & join**.
- [ ] You land on Home and your own card appears in **Explore Students**.
- [ ] Log out. As a guest, click **Save** or **View profile** on a card → you are sent to Sign up.
- [ ] Log in again → you return and the student is saved. Check the **Saved** page.
- [ ] Open another student, click **Report profile** and send a report.
- [ ] Try **Forgot password**.
- [ ] Profile page: edit your details, upload a photo, save.

The directory will be empty at first, since the old sample students were fictional. Create 2 or 3 test accounts (use Gmail's `+` trick: `you+test1@gmail.com`) so there are profiles to browse.

---

## Step 7. Deploy to Vercel

1. In Vercel → your project → **Settings → Environment Variables**, add the **same two** variables (`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`) for Production, Preview and Development.
2. **Redeploy** (Deployments → ⋯ → Redeploy).
3. The included `vercel.json` makes direct links like `/about` or `/students/123` work after a refresh. Without it, they show a 404.
4. Back in Supabase **URL Configuration**, set **Site URL** to your live Vercel URL.

---

## Moderation (your admin tasks)

Everything is in the Supabase dashboard:

- **See reports:** Table Editor → `reports`. Change `status` to `reviewed` or `dismissed` when handled.
- **Hide a bad profile quickly:** Table Editor → `profiles` → set `visibility` to `hidden`.
- **Remove an abusive user completely:** Authentication → Users → ⋯ → Delete user. Their profile and bookmarks are removed automatically.

---

## Optional: allow only your university's emails

1. In `src/config.js`, set `ALLOWED_EMAIL_DOMAINS = ["youruni.edu.ng"]` (students see a friendly message).
2. In `supabase/schema.sql`, section 10, remove the `--` comment marks, change the domain, and run it again. This makes the database itself refuse other emails, so nobody can bypass the form.

---

## What each file does

| File | Purpose |
|---|---|
| `.env` | Your Supabase URL + anon key |
| `supabase/schema.sql` | Run once in Supabase SQL Editor |
| `src/lib/supabaseClient.js` | Creates the Supabase connection |
| `src/context/AuthContext.jsx` | Knows who is logged in; signup, login, logout, bookmarks |
| `src/components/ProtectedRoute.jsx` | Blocks pages for guests / unfinished profiles |
| `src/api/students.js`, `src/api/profiles.js` | All database calls |
| `src/pages/*` | Signup, Login, Verify, Forgot/Reset password, Onboarding, Profile, Saved, Student profile, Guidelines |

You can now delete `public/students.json` (no longer used).
