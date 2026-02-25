# Certificate Generation Dashboard

This is a Next.js application generated from Figma design using the Locofy plugin. The dashboard displays a certificate generation interface for the SportsKeyz platform.

## Features

- **Certificate Dashboard**: View past certificates and upcoming tournaments
- **Search Functionality**: Search through certificates
- **Statistics**: Track certificates created and remaining
- **Multi-category Support**: Academic, Sports, Co-Curricular, and Other categories
- **Responsive Design**: Matches the original Figma design

## Design Source

Figma Design: [Navya Nair_Sportskeyz Web App](https://www.figma.com/design/in0f2iH3VnnO4TIdr8xuju/Navya-Nair_Sportskeyz-Web-App--New-File-?node-id=863-27400&m=dev)

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open your browser and navigate to:
```
http://localhost:3000
```

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the production application
- `npm start` - Start the production server
- `npm run lint` - Run ESLint

## Project Structure

```
figma/
├── pages/
│   ├── _app.tsx       # Custom App component
│   └── index.tsx      # Main dashboard page
├── index.module.css   # Component styles (CSS Modules)
├── global.css         # Global styles and fonts
├── package.json       # Dependencies and scripts
├── next.config.js     # Next.js configuration
└── tsconfig.json      # TypeScript configuration
```

## Technology Stack

- **Framework**: Next.js 14 (Pages Router)
- **UI Library**: React 18
- **Language**: TypeScript
- **Styling**: CSS Modules
- **Font**: Montserrat (Google Fonts)
- **Image Assets**: Figma API (7-day expiration)

## Important Notes

### Asset Expiration

⚠️ **Warning**: Image assets are hosted on Figma's API and expire after 7 days from generation. If images stop loading:

1. Regenerate assets from Figma
2. Update image URLs in `pages/index.tsx`
3. Or download and host images locally in the `public/` folder

### Image URLs

All image assets are defined as constants at the top of `pages/index.tsx`:
- `imgLogo` - SportsKeyz logo
- `imgSidebarDashboard`, `imgSidebarTable`, etc. - Navigation icons
- `imgEventAvatar1-6` - Event thumbnail images
- `imgArrow` - Chevron/arrow icons
- `imgArtwork` - Decorative graphics
- `imgTranslationIcon` - Language switcher

## Design Tokens

Colors used in the design:
- Background: `#19191a`
- Secondary Background: `#23282e`
- Surface: `#1d1e20`
- Accent (Green): `#30dfa0`
- Blue: `#0ea0fb`
- Purple: `#9a73f0`
- Red: `#e30b5c`
- Royal Blue: `#1a51f4`
- Yellow: `#ffc530`

Typography:
- Font Family: Montserrat
- Weights: 400 (Regular), 500 (Medium), 600 (Semi-Bold), 700 (Bold)

## Troubleshooting

### Port Already in Use

If port 3000 is already in use, Next.js will automatically try the next available port (3001, 3002, etc.).

To specify a custom port:
```bash
npm run dev -- -p 3001
```

### Images Not Loading

1. Check that Figma asset URLs are still valid (7-day expiration)
2. Ensure you have internet connectivity
3. Check the browser console for CORS or network errors
4. Try refreshing the page

### Build Errors

If you encounter TypeScript errors:
```bash
npm run build
```

Check the output for specific error messages and fix accordingly.

## License

© 2026 SportsKeyz. Powered by SporTech Innovation. All rights reserved.

## Support

For issues or questions, please refer to the original Figma design or contact the development team.
