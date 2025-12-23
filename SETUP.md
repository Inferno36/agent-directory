# Setup Guide

## Step 1: Navigate to Project

```bash
cd agent-directory
```

## Step 2: Install Dependencies

```bash
npm install
```

## Step 3: Change Default Password

**IMPORTANT**: Change the default password before deploying!

1. Open `lib/auth.ts`
2. Find this line:
   ```typescript
   const ADMIN_PASSWORD_HASH = bcrypt.hashSync("admin123", 10);
   ```
3. Replace `"admin123"` with your own secure password
4. Save the file

## Step 4: Run Development Server

```bash
npm run dev
```

The app will start at http://localhost:3000

## Step 5: Login to Admin Panel

1. Navigate to http://localhost:3000/admin
2. Enter your password (default: `admin123` if you haven't changed it)
3. Start adding your agents!

## Step 6: Deploy to Vercel

### Option A: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Option B: Using Vercel Dashboard

1. Push your code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. Go to https://vercel.com
3. Click "Add New Project"
4. Import your GitHub repository
5. Click "Deploy"

## Usage Tips

### Adding a New Agent

1. Go to `/admin`
2. Fill in the form with agent details
3. Click "Add Agent"

### Editing an Agent

1. Go to `/admin`
2. Find the agent in the list
3. Click "Edit"
4. Make changes and click "Update Agent"

### Deleting an Agent

1. Go to `/admin`
2. Find the agent in the list
3. Click "Delete"
4. Confirm deletion

## Customization

### Change Colors

Edit `app/globals.css` and modify the color variables in the `@theme` block.

### Add New Categories

1. Edit `lib/types.ts` to add new category to `AgentCategory` type
2. Edit `app/admin/page.tsx` to add new option in category select dropdown

### Change Password After Deployment

1. Update `lib/auth.ts` with new password hash
2. Run `npm run build`
3. Redeploy to Vercel

## Troubleshooting

### Build Fails

- Make sure you're using Node.js 18 or later
- Delete `.next` folder and `node_modules`, then run `npm install` again

### Can't Login

- Check that you're using the correct password
- Clear browser cookies and try again

### Changes Not Showing

- Stop the dev server (Ctrl+C) and start it again
- Clear your browser cache

## Need Help?

Check the main README.md for more detailed information.
