# Up2 - Setup Guide

A social platform where users share what they're reading, listening to, and watching.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed ([Download here](https://nodejs.org/))
- A GitHub account (for Vercel deployment)
- An X (Twitter) Developer account
- A Supabase account

---

## Step 1: Set Up X (Twitter) Developer Account

1. Go to [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
2. Click "Create Project" → "Create App"
3. Fill in app details:
   - **App name**: Up2
   - **Description**: Social media consumption sharing platform
4. After creation, go to your app settings
5. Click "Keys and tokens" tab
6. Under "OAuth 2.0 Client ID and Client Secret":
   - Click "Generate" 
   - **Save these values** (you'll need them later)
7. Under "User authentication settings":
   - Click "Set up"
   - App permissions: Select "Read"
   - Type of App: "Web App"
   - Callback URL: `http://localhost:3000/api/auth/callback/twitter`
   - Website URL: `http://localhost:3000`
   - Save

---

## Step 2: Set Up Supabase Database

1. Go to [Supabase](https://supabase.com/) and create an account
2. Click "New Project"
3. Fill in:
   - **Project name**: up2
   - **Database password**: (create a strong password)
   - **Region**: Choose closest to you
4. Wait for project to initialize (2-3 minutes)
5. Once ready, go to "Project Settings" → "API"
6. **Save these values**:
   - Project URL (looks like: https://xxxxx.supabase.co)
   - anon/public key (looks like: eyJhbGc...)

### Create Database Tables

1. In Supabase, click "SQL Editor" in left sidebar
2. Click "New Query"
3. Paste this SQL and click "Run":

```sql
-- Users table
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT,
  name TEXT,
  image TEXT,
  twitter_id TEXT UNIQUE,
  twitter_username TEXT,
  twitter_access_token TEXT,
  twitter_refresh_token TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- User following data
CREATE TABLE user_following (
  user_id TEXT PRIMARY KEY REFERENCES users(id),
  following_data JSONB,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Future tables for books, music, podcasts, youtube
CREATE TABLE user_books (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT REFERENCES users(id),
  title TEXT,
  author TEXT,
  status TEXT, -- 'reading', 'finished', 'want-to-read'
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_music (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT REFERENCES users(id),
  track_name TEXT,
  artist TEXT,
  album TEXT,
  spotify_id TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_following ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_music ENABLE ROW LEVEL SECURITY;

-- Allow public read access (for discovery feature)
CREATE POLICY "Public profiles are viewable by everyone"
  ON users FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Similar policies for other tables
CREATE POLICY "Public following lists viewable by everyone"
  ON user_following FOR SELECT
  USING (true);

CREATE POLICY "Users can update own following"
  ON user_following FOR ALL
  USING (auth.uid() = user_id);
```

---

## Step 3: Install and Configure Project

1. **Download the project files** (all files I created above)

2. **Open Terminal/Command Prompt** and navigate to the project folder:
```bash
cd path/to/up2-project
```

3. **Install dependencies**:
```bash
npm install
```

4. **Create environment file**:
   - Copy `.env.local.example` to `.env.local`
   - Fill in your values:

```env
# From Twitter Developer Portal
TWITTER_CLIENT_ID=your_actual_client_id
TWITTER_CLIENT_SECRET=your_actual_client_secret

# Generate a random secret (can use: openssl rand -base64 32)
NEXTAUTH_SECRET=generate_a_random_string_here
NEXTAUTH_URL=http://localhost:3000

# From Supabase Project Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your_key_here
```

---

## Step 4: Run Locally

```bash
npm run dev
```

Visit `http://localhost:3000` in your browser!

You should see:
- Landing page with "Sign in with X" button
- After signing in, your profile and X following list

---

## Step 5: Deploy to Vercel (Free Hosting)

1. Push your code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   # Create a repo on GitHub, then:
   git remote add origin https://github.com/yourusername/up2.git
   git push -u origin main
   ```

2. Go to [Vercel](https://vercel.com/)
3. Click "New Project"
4. Import your GitHub repository
5. Add environment variables (same as your `.env.local`)
6. Click "Deploy"

7. **Update Twitter App Settings**:
   - Go back to Twitter Developer Portal
   - Update callback URL to: `https://your-app.vercel.app/api/auth/callback/twitter`
   - Update website URL to: `https://your-app.vercel.app`

8. **Update Vercel environment**:
   - In Vercel dashboard → Settings → Environment Variables
   - Update `NEXTAUTH_URL` to your Vercel URL

---

## 🎯 Next Steps

The foundation is ready! Here's what to build next:

### Phase 2: Books & Music (Week 2-3)
- Add manual book entry form
- Integrate Spotify API for music
- Display currently reading/listening

### Phase 3: Podcasts & YouTube (Week 4-5)
- Add podcast manual entry
- Integrate YouTube Data API
- Show recent watches

### Phase 4: Social Features (Week 6+)
- User profiles (public pages)
- Discover feed (see what others are into)
- Follow other users
- Activity feed

---

## 📚 Resources for Learning

- [Next.js Tutorial](https://nextjs.org/learn)
- [React Documentation](https://react.dev/learn)
- [Supabase Quickstart](https://supabase.com/docs/guides/getting-started)
- [Twitter API Docs](https://developer.twitter.com/en/docs/twitter-api)

---

## 🐛 Troubleshooting

**"Module not found" errors**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Twitter OAuth fails**
- Double-check callback URLs match exactly
- Ensure environment variables are set correctly
- Check Twitter app has "Read" permissions

**Supabase connection issues**
- Verify URL and anon key are correct
- Check if tables were created successfully
- Ensure RLS policies are enabled

---

## 💡 Tips for Beginners

1. **Start the dev server** before testing (`npm run dev`)
2. **Check browser console** for errors (F12 → Console tab)
3. **Use Supabase Table Editor** to verify data is saving
4. **Test locally first** before deploying to Vercel
5. **Join communities**: NextJS Discord, r/reactjs, r/webdev

Need help? Feel free to ask questions!
