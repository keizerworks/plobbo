# Keizer-Blogs

**Keizer Blogs** is an open-source, static blogging platform built with Astro and Novel Editor, designed for simplicity, performance, and extensibility. This platform allows users to read articles seamlessly, while administrators can create and manage content with advanced tools like LangDB for AI-driven auto-completions.

---

## Features

- **Static Site with Astro**: Ultra-fast performance, optimized for static content.
- **Rich Text Editor**: Administrators can create and edit blogs using Novel Editor.
- **Database**: SQLite for lightweight, efficient data management.
- **AI-Powered Auto-Completion**: LangDB is integrated as a separate input field to assist in content creation.
- **Open Source**: Perfect for startups, developers, and businesses to self-host and customize.

### For Readers:

- Browse and read articles easily.

### For Admins:

- Access a secure route to manage blog posts.
- Create and edit content with advanced auto-completion tools.
- Upload and manage images seamlessly.

---

## Upcoming Premium Features

1. **Custom Branding**: Ability to add logos, themes, and personalized branding to the blog.
2. **Advanced Analytics**: Track user engagement, page views, and other metrics.
3. **Monetization Tools**: Enable ad placements or paid subscriptions for premium content.

These features will be available as premium add-ons to help monetize your blog.

---

## Tech Stack

- **Frontend**: Astro for a static and fast blog.
- **Editor**: Novel Editor for rich text editing.
- **Database**: SQLite for simplicity and reliability.
- **AI Tool**: [LangDB](https://langdb.ai/) for AI-driven auto-completions.
- **Figma Design**: [https://www.figma.com/design/xO495XLex9ybzXTYJkgAqS/Untitled?node-id=0-1&t=yr7rZYNjVKccXx3m-1 ](https://www.figma.com/design/xO495XLex9ybzXTYJkgAqS/Untitled?node-id=0-1&t=yr7rZYNjVKccXx3m-1)

---

## Schema Design for Blog Website

This schema design outlines the structure for a blog website supporting multiple organizations, custom domains, and user management. Each component is designed to ensure scalability, flexibility, and ease of integration.

### Blog Post Schema

Represents individual blog posts created and managed by organizations.

| Field             | Type          | Description                                             |
| ----------------- | ------------- | ------------------------------------------------------- |
| `id`              | UUID          | Unique identifier for the blog post.                    |
| `organization_id` | UUID          | References the organization that owns the post.         |
| `title`           | String        | Title of the blog post.                                 |
| `slug`            | String        | URL-friendly identifier for the post.                   |
| `image`           | String        | URL of the cover image for the post.                    |
| `author`          | Object        | Contains `id` (UUID) and `name` (String) of the author. |
| `body`            | Text          | Content of the blog post.                               |
| `tags`            | Array[String] | Tags associated with the post.                          |
| `likes`           | Number        | Number of likes the post has received.                  |
| `created_at`      | Datetime      | Timestamp when the post was created.                    |
| `updated_at`      | Datetime      | Timestamp when the post was last updated.               |
| `status`          | String        | Status of the post (e.g., "draft", "published").        |

### Organization Schema

Defines the structure for organizations that use the blog platform.

| Field           | Type     | Description                                                                                             |
| --------------- | -------- | ------------------------------------------------------------------------------------------------------- |
| `id`            | UUID     | Unique identifier for the organization.                                                                 |
| `name`          | String   | Name of the organization.                                                                               |
| `subdomain`     | String   | Subdomain for the organization (e.g., `a` for `a.keizerblog.com`).                                      |
| `custom_domain` | String   | Custom domain used by the organization.                                                                 |
| `settings`      | Object   | Organization-specific settings including `theme` (String), `logo` (String), and `description` (String). |
| `created_at`    | Datetime | Timestamp when the organization was created.                                                            |
| `updated_at`    | Datetime | Timestamp when the organization was last updated.                                                       |

### User Schema

Manages users who interact with the platform as administrators, editors, or viewers.

| Field             | Type     | Description                                                |
| ----------------- | -------- | ---------------------------------------------------------- |
| `id`              | UUID     | Unique identifier for the user.                            |
| `name`            | String   | Name of the user.                                          |
| `email`           | String   | Email address of the user.                                 |
| `role`            | String   | Role of the user (e.g., "admin", "editor").                |
| `organization_id` | UUID     | Nullable; references the organization the user belongs to. |
| `created_at`      | Datetime | Timestamp when the user was created.                       |
| `updated_at`      | Datetime | Timestamp when the user was last updated.                  |

### Relationships

1. **Organizations and Blog Posts**:

   - Each organization can create and manage multiple blog posts.
   - Blog posts reference their owning organization through `organization_id`.

2. **Custom Domains and Subdomains**:

   - Organizations can either use a subdomain (e.g., `a.keizerblog.com`) or a custom domain for their blog.

3. **Users and Organizations**:
   - Users are associated with organizations via `organization_id`.
   - Users with the roles of "admin" or "editor" can manage blog content for their organization.

### Example Usage

- **Scenario 1**: Startup A uses the platform and opts for the subdomain `a.keizerblog.com`. All their blog posts will be accessible under this subdomain.
- **Scenario 2**: Organization B prefers a custom domain `blog.organizationb.com`. The platform routes traffic accordingly while ensuring data isolation.

### JSON

```
BLOG -

{
  "id": "UUID",
  "organization_id": "UUID",
  "title": "string",
  "slug": "string",
  "image": "string",  // URL to the cover image
  "author": {
    "id": "UUID",
    "name": "string"
  },
  "body": "text",
  "tags": ["string"],
  "likes": "number",
  "created_at": "datetime",
  "updated_at": "datetime",
  "status": "string"   // e.g., "draft", "published", "archived"
}

ORGANIZATION -

{
  "id": "UUID",
  "name": "string",
  "subdomain": "string",  // e.g., "a" for a.keizerblog.com
  "custom_domain": "string",  // e.g., "customdomain.com"
  "settings": {
    "theme": "string",  // Theme or branding details
    "logo": "string",   // URL to organization logo
    "description": "string"  // Short description of the organization
  },
  "created_at": "datetime",
  "updated_at": "datetime"
}

USER -

{
  "id": "UUID",
  "name": "string",
  "email": "string",
  "role": "string",  // e.g., "admin", "editor", "viewer"
  "organization_id": "UUID",  // Nullable if the user is not tied to an org
  "created_at": "datetime",
  "updated_at": "datetime"
}

```

This schema ensures modularity and extensibility, allowing for future features like analytics, comments, and integrations with external services.

## Self-Hosting Instructions

Keizer Blogs can be self-hosted by startups, businesses, or individual users who want to maintain their blog page. Follow the steps below:

### Prerequisites:

1. **Node.js**: Install the latest version from [Node.js](https://nodejs.org).
2. **Astro CLI**: Install Astro globally using `pnpm install -g astro`.

### Steps to Set Up Locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/keizer-org/keizer-blogs.git
   cd keizer-blogs
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Start the development server:
   ```bash
   pnpm run dev
   ```
4. Open your browser and navigate to `http://localhost:3000`.

### Deploying:

Keizer Blogs is optimized for deployment on platforms like Vercel, Netlify, or any static hosting service.

To deploy on Vercel:

1. Install the Vercel CLI:
   ```bash
   pnpm install -g vercel
   ```
2. Link and deploy your project:
   ```bash
   vercel
   ```

Your blog will be live at the Vercel-provided URL!

---

## Contributing

We welcome contributions to Keizer Blogs! Here's how you can get involved:

1. Fork the repository and clone it to your local machine.
2. Create a new branch for your feature or bug fix:
   ```bash
   git checkout -b feature/my-new-feature
   ```
3. Commit your changes and push your branch:
   ```bash
   git commit -m "Add my new feature"
   git push origin feature/my-new-feature
   ```
4. Submit a pull request and describe your changes in detail.

### Guidelines:

- Follow the existing coding style and structure.
- Add comments and documentation for your code.
- Ensure your changes do not break existing functionality.

### Project Structure:

```text
/
├── public/
│   └── favicon.svg
├── src/
│   ├── layouts/
│   │   └── Layout.astro
│   └── pages/
│       └── index.astro
└── package.json
```

To learn more about the folder structure of an Astro project, refer to [our guide on project structure](https://docs.astro.build/en/basics/project-structure/).

### Commands:

All commands are run from the root of the project, from a terminal:

| Command                    | Action                                           |
| :------------------------- | :----------------------------------------------- |
| `pnpm install`             | Installs dependencies                            |
| `pnpm run dev`             | Starts local dev server at `localhost:4321`      |
| `pnpm run build`           | Build your production site to `./dist/`          |
| `pnpm run preview`         | Preview your build locally, before deploying     |
| `pnpm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `pnpm run astro -- --help` | Get help using the Astro CLI                     |

---

## License

Keizer Blogs is open-source software licensed under the MIT License. See the `LICENSE` file for more details.

---

If you have any doubts you can ask in our [discord](https://discord.gg/UGyDwmQs). We are ready help you.

Start building your blog with **Keizer Blogs** today! Stay tuned for more updates and premium features!
