# Frontend Development Guide

## Project Structure

```
frontend/
├── src/
│   ├── app/                 # Next.js app router
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Home page
│   │   └── dashboard/       # Dashboard pages
│   │       ├── layout.tsx
│   │       ├── page.tsx
│   │       ├── audit/
│   │       ├── keywords/
│   │       └── reports/
│   ├── components/          # React components
│   │   ├── layout/          # Layout components
│   │   │   ├── Navbar.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Footer.tsx
│   │   ├── dashboard/       # Dashboard components
│   │   │   ├── WebsiteCard.tsx
│   │   │   └── CreateWebsiteModal.tsx
│   │   ├── audit/           # Audit components
│   │   │   ├── AuditHeader.tsx
│   │   │   ├── AuditTabs.tsx
│   │   │   └── IssuesList.tsx
│   │   └── keywords/        # Keyword components
│   │       └── KeywordResearch.tsx
│   ├── services/            # API service functions
│   │   ├── websiteService.ts
│   │   ├── auditService.ts
│   │   ├── keywordService.ts
│   │   └── reportService.ts
│   ├── styles/              # Global and component styles
│   │   └── globals.css
│   ├── types/               # TypeScript types
│   │   └── api.ts
│   └── hooks/               # Custom React hooks
├── public/                  # Static assets
├── .env.local.example       # Environment variables template
├── Dockerfile               # Docker configuration
├── package.json             # Node dependencies
├── tsconfig.json            # TypeScript configuration
├── tailwind.config.ts       # Tailwind CSS configuration
├── postcss.config.js        # PostCSS configuration
└── next.config.js           # Next.js configuration
```

## Running the Frontend

### Development
```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000 in your browser.

### Production Build
```bash
cd frontend
npm run build
npm run start
```

## Page Structure

### Dashboard Pages

**`/dashboard`** - Main dashboard with website list
- List all websites
- Create new website
- Quick access to audits

**`/dashboard/audit/[id]`** - Detailed audit results
- Audit overview with statistics
- Issues list with filtering
- Recommendations and fixes
- Download report option

**`/dashboard/keywords`** - Keyword research and tracking
- Keyword research interface
- Track new keywords
- View keyword rankings
- Ranking history charts

**`/dashboard/reports`** - Generated reports
- List all reports
- Download reports
- Schedule new reports

## Component Architecture

### Layout Components

**Navbar** - Top navigation bar
```tsx
<Navbar onMenuClick={handleMenuClick} />
```

**Sidebar** - Left navigation menu
```tsx
<Sidebar />
```

**Footer** - Page footer
```tsx
<Footer />
```

### Dashboard Components

**WebsiteCard** - Display website information
```tsx
<WebsiteCard website={website} />
```

**CreateWebsiteModal** - Form to add new website
```tsx
<CreateWebsiteModal onClose={handleClose} />
```

### Audit Components

**AuditHeader** - Audit title and download options
```tsx
<AuditHeader audit={audit} auditId={auditId} />
```

**AuditTabs** - Tab navigation for audit sections
```tsx
<AuditTabs activeTab={tab} setActiveTab={setTab} />
```

**IssuesList** - Display audit issues with filtering
```tsx
<IssuesList issues={issues} />
```

## Services

API communication is handled through service functions in `src/services/`:

### Website Service
```typescript
import { getWebsites, createWebsite, updateWebsite, deleteWebsite } from '@/services/websiteService'

const websites = await getWebsites()
await createWebsite({ domain, name, description, pageCount })
```

### Audit Service
```typescript
import { startAudit, getAudit, getAuditIssues } from '@/services/auditService'

const audit = await startAudit(websiteId)
const issues = await getAuditIssues(auditId)
```

### Keyword Service
```typescript
import { researchKeywords, trackKeyword, getRankingHistory } from '@/services/keywordService'

const keywords = await researchKeywords('seo optimization')
await trackKeyword(websiteId, { keyword, url })
```

### Report Service
```typescript
import { generateReport, downloadReport } from '@/services/reportService'

const report = await generateReport(auditId, 'pdf')
const blob = await downloadReport(reportId)
```

## Styling

The application uses **Tailwind CSS** for styling. Key configuration:

### Colors
- `primary`: #2563eb (Blue)
- `secondary`: #7c3aed (Purple)
- `success`: #10b981 (Green)
- `warning`: #f59e0b (Amber)
- `danger`: #ef4444 (Red)
- `dark`: #1f2937 (Gray)
- `light`: #f9fafb (Light Gray)

### Common Patterns

```tsx
// Buttons
<button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600">
  Click me
</button>

// Cards
<div className="bg-white rounded-lg border border-gray-200 p-6">
  Content
</div>

// Forms
<input className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
```

## State Management

The application uses:
- **React hooks** for component state
- **React Query** for server state (via axios)
- **Zustand** for global state (if needed)

## Adding New Pages

1. Create folder in `src/app/dashboard/new-page/`
2. Add `page.tsx` with your page component
3. Add `layout.tsx` if custom layout needed
4. Import and use components
5. Add navigation link in Sidebar

## Adding New Components

1. Create file in appropriate `src/components/` subfolder
2. Write React component with TypeScript
3. Export component as default
4. Import in pages where needed

## Testing

### Run Tests
```bash
npm run test
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

## Code Quality

### Linting
```bash
npm run lint
```

### Type Checking
```bash
npm run type-check
```

## Environment Variables

See `.env.local.example` for configuration.

## Performance Optimization

1. Use Next.js Image component for images
2. Implement lazy loading for components
3. Optimize bundle size with code splitting
4. Cache API responses with React Query
5. Use dynamic imports for heavy components

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Accessibility

- Use semantic HTML
- Ensure proper color contrast
- Add ARIA labels where needed
- Support keyboard navigation
- Test with screen readers

## Common Issues

### API Connection
Make sure `NEXT_PUBLIC_API_URL` is correctly set in `.env.local`.

### Port Already in Use
```bash
lsof -ti:3000 | xargs kill -9
```

### Clear Next.js Cache
```bash
rm -rf .next
npm run dev
```
