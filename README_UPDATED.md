# Physics & Mathematics Teacher Website

A multilingual (Ukrainian/English) responsive website for physics and mathematics teaching, featuring blog posts, news, online lessons, and more.

## Features

- 📚 **Blog & News System**: Share articles and announcements in multiple languages
- 🎓 **Online Lessons**: Conduct video lessons using Jitsi Meet integration
- 🌐 **Multilingual Support**: Full Ukrainian and English language support
- 👤 **User Authentication**: Secure login/signup with Supabase Auth
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile devices
- 🔍 **SEO Optimized**: Server-side rendering for better search engine visibility
- 🛠️ **Admin Panel**: Manage content, moderate comments, and handle lessons

## Tech Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Authentication, Storage)
- **Video Conferencing**: Jitsi Meet
- **Deployment**: Vercel

## Project Structure

The project is organized as follows:

```
teacher-website
├── src
│   ├── app                     # Next.js app router components
│   │   ├── [locale]            # Root layout with locale parameter
│   │   └── api                 # API routes
│   ├── components              # React components
│   │   ├── admin               # Admin panel components
│   │   ├── blog                # Blog-related components
│   │   ├── common              # Common UI components
│   │   ├── jitsi               # Jitsi meeting components
│   │   ├── layouts             # Layout components
│   │   ├── news                # News-related components
│   │   └── ui                  # Reusable UI components
│   ├── hooks                   # Custom React hooks
│   ├── lib                     # Utility libraries
│   ├── types                   # TypeScript type definitions
│   └── utils                   # Utility functions
├── public                      # Static assets
│   └── locales                 # Translation files
│       ├── en                  # English translations
│       └── uk                  # Ukrainian translations
├── supabase                    # Supabase configuration
│   └── schema.sql              # Database schema
├── cypress                     # End-to-end testing
│   └── e2e                     # E2E test files
└── ...                         # Configuration files
```

## Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm or yarn
- Supabase account (for backend services)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/teacher-website.git
   cd teacher-website
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables
   ```bash
   cp .env.local.example .env.local
   ```
   Then edit `.env.local` with your Supabase credentials and other settings.

4. Run the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Testing

The project includes automated tests to ensure reliability:

### Running Tests

```bash
# Run all tests
npm test

# Run end-to-end tests
npm run cypress:run

# Open Cypress test runner
npm run cypress:open
```

See `TEST_PLAN.md` for a comprehensive testing strategy.

## Deployment

Deployment is managed through Vercel. Use the provided deployment scripts:

### Windows (PowerShell)

```powershell
./deploy.ps1
```

### Linux/Mac

```bash
chmod +x deploy.sh
./deploy.sh
```

See `DEPLOYMENT.md` for detailed deployment instructions and `PRE_DEPLOYMENT_CHECKLIST.md` for a pre-launch verification list.

## Multilingual Support

The website supports Ukrainian and English languages. Content is stored with language-specific fields:

- `title_uk` / `title_en` - Titles in Ukrainian/English
- `content_uk` / `content_en` - Content in Ukrainian/English
- `description_uk` / `description_en` - Descriptions in Ukrainian/English

UI translations are stored in `/public/locales/[lang]/dictionary.json`.

## Jitsi Integration

The website integrates with Jitsi Meet for video lessons:

- Teachers can create lessons with virtual rooms
- Students can join these rooms for interactive learning
- Rooms are secured with access controls

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase](https://supabase.io/)
- [Jitsi Meet](https://jitsi.org/)
