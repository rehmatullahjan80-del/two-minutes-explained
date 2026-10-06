# 2 Minutes Explained

## Run locally
    npm install
    npm run dev

Open http://localhost:3000/keystatic. Create Subjects, then Modules, then Topics. Locally, saving writes files into `content/`.

## Publish from anywhere (one-time setup)
1. Push this project to GitHub and put your repo name in `keystatic.config.ts` (`REPO`).
2. Add `NEXT_PUBLIC_KEYSTATIC_STORAGE=github` to a `.env.local` file, run `npm run dev`, open `/keystatic`, and follow the prompts to create the GitHub app. Keystatic saves the keys it needs into `.env.local`.
3. Deploy on Vercel and add the same variables there, plus `NEXT_PUBLIC_SITE_URL` (your domain).
4. Use `https://yourdomain.com/keystatic`. You log in with GitHub, and only people with write access to the repo can save. Each save rebuilds the site (about a minute).

## Site settings
In `/keystatic`, open **Site settings** to edit the site name, the short description (shown on the home page and used by Google), the About page text, the contact email, and your YouTube channel link.

## Analytics
- **Google Analytics:** create a GA4 property, copy the Measurement ID (starts with `G-`), and add it on Vercel as `NEXT_PUBLIC_GA_ID`. It stays off until a visitor accepts the cookie banner.
- **Vercel Analytics:** open your project on Vercel, go to the Analytics tab, and click Enable. It doesn't use cookies.
- Google Analytics report: Reports → Acquisition → Traffic acquisition → Session source / medium.
- Add a privacy policy page for EU visitors; this project doesn't include one, and this isn't legal advice.

## Tagging links so you can see where visitors come from
- YouTube default description (main site link): `https://yourdomain.com/networking?utm_source=youtube&utm_medium=default-description`
- Link for one video: `https://yourdomain.com/networking/module/topic?utm_source=youtube&utm_medium=video-link&utm_campaign=topic`
- Anywhere else, change the source: `utm_source=whatsapp`, `facebook`, `reddit`, etc.
Google search visitors and other websites are detected automatically.

## Google and other search engines (one-time)
1. Set `NEXT_PUBLIC_SITE_URL` to your real domain (with `https://`). The sitemap and canonical links depend on it.
2. In Google Search Console, add your domain, copy the verification code into `NEXT_PUBLIC_GOOGLE_VERIFICATION`, redeploy, verify, and submit `https://yourdomain.com/sitemap.xml`.
3. In Bing Webmaster Tools, import the site from Search Console (this also covers DuckDuckGo and Yahoo), or set `NEXT_PUBLIC_BING_VERIFICATION`.
4. On Vercel, add both `yourdomain.com` and `www.yourdomain.com`, and make one redirect to the other.
5. After the first deploy, paste a topic URL into Google's Rich Results Test to confirm the video markup is valid.

Built in: page titles and descriptions, canonical links, Open Graph and Twitter previews using the video thumbnail, video and breadcrumb structured data, a video sitemap, robots.txt, a favicon, a fast click-to-load video player, and internal links between topics.

## Notes
- A topic's page is `/<subject>/<module>/<topic>`, made from the titles. Put it in the YouTube description and don't rename it later.
- Module and topic names should be unique across the whole site.
- Deleting a module doesn't delete its topics. They just stop appearing, so delete the topics first.
