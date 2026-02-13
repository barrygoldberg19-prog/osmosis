# 🚀 ABSOLUTE BEGINNER'S QUICK START

## What You Need First

1. **Node.js** - The JavaScript runtime
   - Download: https://nodejs.org/
   - Get the LTS version (currently 20.x)
   - Install it (click next, next, finish)
   - Verify: Open terminal/command prompt, type `node --version`

2. **VS Code** - Code editor (optional but helpful)
   - Download: https://code.visualstudio.com/
   - Free and easy to use

3. **Terminal/Command Prompt**
   - Mac: Search "Terminal" in Spotlight
   - Windows: Search "Command Prompt" or "PowerShell"

---

## 5-Minute Setup (After Getting API Keys)

### Step 1: Download Project
Download the `up2-project` folder to your computer

### Step 2: Open Terminal
Navigate to the project:
```bash
cd Downloads/up2-project
```
(Adjust path based on where you saved it)

### Step 3: Install Dependencies
```bash
npm install
```
Wait 1-2 minutes while it downloads everything

### Step 4: Set Up Environment Variables
1. Copy `.env.local.example` file
2. Rename the copy to `.env.local`
3. Open `.env.local` in any text editor
4. Fill in your API keys (see main README for how to get these)

### Step 5: Run It!
```bash
npm run dev
```

Open your browser to: `http://localhost:3000`

---

## Common First-Time Issues

**"npm: command not found"**
→ You need to install Node.js first (see above)

**"Module not found"**
→ Run `npm install` again

**"Port 3000 is already in use"**
→ Close any other apps running on port 3000, or change the port:
```bash
PORT=3001 npm run dev
```

**Can't sign in with Twitter**
→ Double-check your Twitter app callback URL matches exactly

---

## How to Stop the Server

Press `Ctrl + C` in the terminal

---

## Next Steps After It Works

1. Read the main README.md for detailed deployment instructions
2. Try adding your first book manually (future feature)
3. Deploy to Vercel to share with friends

---

## Learning Resources (If You Want to Understand the Code)

- **JavaScript Basics**: https://javascript.info/
- **React Tutorial**: https://react.dev/learn
- **Next.js Tutorial**: https://nextjs.org/learn
- **YouTube**: Search "Next.js tutorial for beginners"

---

## Getting Help

1. Check the browser console for errors (Press F12 → Console tab)
2. Read the error message carefully
3. Google the error (seriously, this is what pros do!)
4. Ask in communities:
   - r/webdev on Reddit
   - Next.js Discord
   - Stack Overflow

You got this! 🎉
