# HyperConstructor Admin Setup Instructions

## Prerequisites
1. Node.js 18 or higher
2. MongoDB access (local or remote)
3. Your HyperConstructor database populated with data

## Installation Steps

1. **Navigate to the admin directory:**
   ```bash
   cd hyperconstructor_admin
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` and set your MongoDB connection string:
   ```env
   MONGODB_URI=mongodb://localhost:27017/hyperconstructor_core
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Features

### 📊 Dashboard Overview
- Real-time statistics for all collections
- User activity metrics
- Workflow execution summary
- Schedule monitoring

### 👥 Users Management
- View all registered users
- Track wallet connections
- Monitor Hyperliquid account status
- User activity timeline

### 📁 Projects Tracking
- Browse user projects
- Project creation dates
- Associated workflows count

### ⚙️ Workflows Monitoring
- Workflow definitions and status
- Node and connection counts
- Execution statistics
- Active/inactive status

### ⏰ Schedule Management
- Cron expression monitoring
- Next execution times
- Running status tracking
- Overdue schedule detection

### 🚀 Execution Logs
- Detailed workflow run history
- Success/error status tracking
- Execution duration analysis
- Log entry counts and truncation status

## Database Collections Monitored

The admin portal directly queries these MongoDB collections:
- `users` - User accounts and profiles
- `projects` - User projects and metadata
- `workflows` - Workflow definitions and configurations
- `workflow_schedules` - Cron-based execution schedules
- `workflow_runs` - Execution history and logs

## Security Note

⚠️ **This admin portal connects directly to your MongoDB database and should never be deployed publicly.** It's designed for local development and internal administration only.

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running and accessible
- Check connection string format in `.env.local`
- Verify database name matches your Encore backend configuration

### Missing Dependencies
- Run `npm install` to ensure all packages are installed
- Check Node.js version (should be 18+)

### Build Errors
- The TypeScript errors in the editor are expected due to missing dependencies in the editor context
- The app should build and run correctly with `npm run dev`

## Development

### Adding New Views
1. Create new page in `src/app/[page-name]/page.tsx`
2. Add database query function in `src/lib/database.ts`
3. Update navigation links in main dashboard

### Customizing Styles
- Edit `src/app/globals.css` for global styles
- Modify Tailwind classes in components
- Update color scheme in CSS variables

## Support

This admin portal is designed to work with the HyperConstructor project structure. Ensure your MongoDB database follows the same schema as defined in the `hyperconstructor_core_api` project.
