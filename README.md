# Agent Directory

A sleek, dark-themed directory for managing and showcasing your team's tools, dashboards, and agents. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Dark Theme**: Elegant black and white design with an AI agent vibe
- **Search & Filter**: Quickly find agents by name, description, tech stack, or category
- **Categorized Display**: Agents automatically grouped by function (Data Processing, Automation, etc.)
- **Admin Panel**: Password-protected interface to add, edit, and delete agents
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Agent Metadata**: Track status (stable/beta/experimental), tech stack, GitHub links, and more

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Password

⚠️ **IMPORTANT**: The default admin password is `admin123`. 

**You MUST change this before deploying to production!**

Open `lib/auth.ts` and change the default password:

```typescript
// Change "admin123" to your desired password
const ADMIN_PASSWORD_HASH = bcrypt.hashSync("your-password-here", 10);
```

### 3. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the directory.

### 4. Access Admin Panel

Navigate to [http://localhost:3000/admin](http://localhost:3000/admin) and login with your password to manage agents.

## Project Structure

```
agent-directory/
├── app/
│   ├── api/
│   │   ├── agents/         # CRUD operations for agents
│   │   └── auth/           # Login/logout endpoints
│   ├── admin/              # Admin panel page
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main directory page
│   └── globals.css         # Global styles
├── components/
│   └── ui/                 # Reusable UI components
├── lib/
│   ├── auth.ts             # Authentication logic
│   ├── types.ts            # TypeScript type definitions
│   └── utils.ts            # Utility functions
├── data/
│   └── agents.json         # Agent data storage
└── public/                 # Static assets
```

## Managing Agents

### Adding a New Agent

1. Navigate to the Admin Panel (`/admin`)
2. Login with your password
3. Fill in the form:
   - **Name**: Agent/tool name
   - **Description**: Brief description of what it does
   - **GitHub URL**: Link to the repository
   - **Demo URL** (optional): Link to live demo
   - **Category**: Select the appropriate function category
   - **Status**: stable, beta, or experimental
   - **Tech Stack**: Comma-separated list (e.g., "Python, FastAPI, PostgreSQL")
4. Click "Add Agent"

### Editing an Agent

1. In the Admin Panel, find the agent in the list
2. Click "Edit"
3. Update the fields
4. Click "Update Agent"

### Deleting an Agent

1. In the Admin Panel, find the agent in the list
2. Click "Delete"
3. Confirm the deletion

## Categories

Available categories for organizing your agents:

- Data Processing
- Automation
- Monitoring
- Analytics
- Communication
- Security
- Development Tools
- Other

You can customize these in `lib/types.ts` and `app/admin/page.tsx`.

## Deployment to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure your project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (or `agent-directory` if in a monorepo)
5. Click "Deploy"

### 3. Important Notes

- The default password is `admin123` - **change this before deploying!**
- Agent data is stored in `data/agents.json` which persists on the server
- For production, consider using a database instead of JSON file storage

## Customization

### Changing Colors

Edit `app/globals.css` to customize the color scheme:

```css
:root {
  --background: 0 0% 0%;        /* Pure black background */
  --foreground: 0 0% 100%;      /* White text */
  --primary: 0 0% 100%;         /* White primary color */
  /* ... more color variables */
}
```

### Adding New Categories

1. Update the `AgentCategory` type in `lib/types.ts`
2. Add the new option in the admin form in `app/admin/page.tsx`

### Changing Password

Open `lib/auth.ts` and update:

```typescript
const ADMIN_PASSWORD_HASH = bcrypt.hashSync("your-new-password", 10);
```

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components based on shadcn/ui
- **Icons**: Lucide React
- **Authentication**: bcryptjs with HTTP-only cookies

## Security Notes

- Passwords are hashed using bcryptjs
- Authentication uses HTTP-only cookies
- Admin routes are protected by authentication checks
- All API mutations require authentication

## Future Enhancements

Consider adding:

- [ ] Database integration (PostgreSQL, MongoDB, etc.)
- [ ] User management (multiple admin accounts)
- [ ] Usage analytics
- [ ] Agent favoriting/bookmarking
- [ ] Comments or notes on agents
- [ ] Version history tracking
- [ ] API key management for programmatic access
- [ ] Email notifications for new agents
- [ ] Integration with GitHub API for auto-updates

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
