# Lyniq Beauty Studio

Website for the LYNIQ nail & beauty studio in Děčín, built with Next.js (App Router), TypeScript, Tailwind CSS and next-intl.

## 🌍 Languages

The site is available in Czech (default), English and German:

- `/services` – Czech
- `/en/services` – English
- `/de/services` – German

UI texts live in `messages/cs.json`, `messages/en.json` and `messages/de.json`.

## 📝 Content

There is no database – all content comes from JSON files:

| File | Content |
| --- | --- |
| `components/services.json` | Service groups and services (title, description, price, duration) |
| `components/employees.json` | Team members, their photo and the services they offer |
| `components/gallery.json` | Gallery groups and their images |

Images are served from `public/`:

- Employee photos: `public/employees/` (referenced as `/employees/lyly.png`)
- Gallery images: `public/gallery/` (referenced as `/gallery/<file>`)

### Adding gallery images

Put the images into `public/gallery/` and list them in `components/gallery.json`:

```json
{
  "groups": [
    {
      "id": "manikura",
      "name": "Manikúra",
      "description": null,
      "images": [
        { "src": "/gallery/manikura-1.jpg", "title": "Francouzská manikúra" }
      ]
    }
  ]
}
```

Groups without images are hidden.

## 🔑 Environment Variables

| Variable | Purpose |
| --- | --- |
| `SERPAPI_KEY` (or `SERPAPI`) | Google reviews on the home page (fetched via SerpAPI, cached for 24 h) |
| `GOOGLE_PLACE_ID` | Optional – Google Place ID for reviews (defaults to LYNIQ STUDIO) |
| `GOOGLE_MAPS_API_KEY` | Map on the contact page |

## 🚀 Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## 🛠️ Scripts

- `npm run dev` – Start development server
- `npm run build` – Build for production
- `npm run start` – Start production server
- `npm run lint` – Run ESLint
