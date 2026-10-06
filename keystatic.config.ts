import { collection, config, fields, singleton } from "@keystatic/core";

// Your GitHub repo as "username/repo-name"
const REPO = "rehmatullahjan80-del/two-minutes-explained";
const useGitHubStorage =
  process.env.NEXT_PUBLIC_KEYSTATIC_STORAGE === "github" &&
  Boolean(process.env.KEYSTATIC_GITHUB_CLIENT_ID) &&
  Boolean(process.env.KEYSTATIC_GITHUB_CLIENT_SECRET) &&
  Boolean(process.env.KEYSTATIC_SECRET);

export default config({
  storage: useGitHubStorage ? { kind: "github", repo: REPO } : { kind: "local" },
  singletons: {
    site: singleton({
      label: "Site settings",
      path: "content/site",
      schema: {
        siteName: fields.text({ label: "Site name" }),
        tagline: fields.text({
          label: "Short description",
          description: "Shown on the home page and used by Google, like a YouTube channel description.",
          multiline: true,
        }),
        about: fields.text({ label: "About page text", description: "Blank line between paragraphs.", multiline: true }),
        contactEmail: fields.text({ label: "Contact email" }),
        youtubeUrl: fields.text({ label: "YouTube channel link" }),
      },
    }),
  },
  collections: {
    subjects: collection({
      label: "1. Subjects (home cards)",
      slugField: "title",
      path: "content/subjects/*",
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        description: fields.text({ label: "Short description", multiline: true }),
        order: fields.integer({ label: "Order on home page", defaultValue: 1 }),
      },
    }),
    modules: collection({
      label: "2. Modules",
      slugField: "title",
      path: "content/modules/*",
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        subject: fields.relationship({ label: "Subject", collection: "subjects", validation: { isRequired: true } }),
        description: fields.text({ label: "Short description", multiline: true }),
        order: fields.integer({ label: "Order in subject", defaultValue: 1 }),
      },
    }),
    topics: collection({
      label: "3. Topics (videos)",
      slugField: "title",
      path: "content/topics/*",
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        module: fields.relationship({ label: "Module", collection: "modules", validation: { isRequired: true } }),
        videoUrl: fields.text({ label: "YouTube link", validation: { isRequired: true } }),
        uploadDate: fields.date({ label: "Date (filled with today)", defaultValue: { kind: "today" }, validation: { isRequired: true } }),
        order: fields.integer({ label: "Order in module", defaultValue: 1 }),
        definition: fields.text({ label: "One-line definition", multiline: true, validation: { isRequired: true } }),
        notes: fields.text({
          label: "Notes (blank line between paragraphs; start a line with ## for a heading)",
          multiline: true,
        }),
        keyPoints: fields.array(fields.text({ label: "Point" }), {
          label: "Remember this",
          itemLabel: (p) => p.value,
        }),
      },
    }),
  },
});
