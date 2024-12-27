# Welcome to Keizer Blogs

Keizer Blogs is a powerful and customizable blogging platform built to deliver a seamless reading and writing experience. With inspiration drawn from apps like Medium and Hashnode, Keizer Blogs combines modern design, advanced features, and scalability to meet the needs of readers, writers, and admins.

---

## Overview

**Keizer Blogs** is designed for:

- **Normal Users**:
  - Read engaging blogs.
  - Like, share, and comment on blogs to interact with the community.

- **Admins**:
  - Create, edit, and publish blogs.
  - Access a secure editor route to manage content.

---

## Features

### For Users:
- Read blogs with a clean, intuitive interface.
- Share blogs on social media and beyond.
- Like and comment on blogs to foster engagement.

### For Admins:
- Full-featured, secure route for blog creation and management.
- Integrated image management for enhancing blog content.
- Support for real-time content previews during editing.

### Advanced Capabilities:
- Integration with [LangDB.ai](https://langdb.ai/) for AI-powered autocompletions, making writing easier and faster.
- Authentication for user and admin roles.
- Responsive and modern design inspired by [this Figma template](https://www.figma.com/community/file/1216616090937021365/free-blog-template-modern-creative-design).
- Full-stack solution leveraging Sanity and Next.js for an unparalleled authoring and publishing experience.

---

## Tech Stack

### Frontend:
- **Next.js**:
  - High-performance and SEO-friendly.
  - Server-side rendering and static generation for speed.

### Backend:
- **Sanity**:
  - Real-time and collaborative content management.
  - Flexible query language and robust image transformation APIs.

### Additional Tools:
- **LangDB.ai** for AI-enhanced writing assistance.
- **TailwindCSS** for responsive and modern UI design.
- **Authentication** to secure user and admin roles.

---

## Getting Started

### Step 1: Clone the Repository
```bash
# Clone the repo
git clone https://github.com/your-repo/keizer-blogs.git

# Navigate to the project directory
cd keizer-blogs
```

### Step 2: Set Up Environment Variables
Create a `.env.local` file in the root directory with the following:

```env
# Sanity settings
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=your_dataset

# Authentication settings
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=http://localhost:3000

# LangDB.ai settings
NEXT_PUBLIC_LANGDB_API_KEY=your_langdb_api_key
```

### Step 3: Install Dependencies
```bash
npm install
```

### Step 4: Run the Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` to see the app in action. Admins can log in to access the editor at `/admin`.

---

## Key Components

| File/Folder                 | Description                                       |
|-----------------------------|---------------------------------------------------|
| `pages/admin`               | Secure route for admin features.                 |
| `pages/api/auth`            | Authentication logic for users and admins.       |
| `pages/blog/[slug].tsx`     | Individual blog pages.                           |
| `lib/sanity.js`             | Configuration for Sanity client.                 |
| `components/BlogEditor.tsx` | Rich text editor for blog creation and editing.  |

---

## Deploying to Production
Deploy your project to **Vercel** for an optimized production experience.

```bash
# Push changes to the repository
git add .
git commit -m "Initial commit"
git push

# Deploy with Vercel
npx vercel --prod
```

---

## Contributing
Join our community on Discord to contribute to **Keizer Blogs**. We welcome developers, designers, and writers to collaborate on building this powerful platform. 

---

## Resources

- **Sample Blog Applications**:
  - [Stripe Blog](https://stripe.com/blog)
  - [Medium](https://medium.com/)
  - [Hashnode](https://hashnode.com/)
  - [Blog Hub](https://blog-hub-seven.vercel.app/)

- **Design Inspiration**:
  - [Free Blog Template on Figma](https://www.figma.com/community/file/1216616090937021365/free-blog-template-modern-creative-design)

- **Sanity and Next.js Tutorial**:
  - [Watch the Guide](https://youtu.be/Lydgf-Hvla4?si=38SlM353Yulzk6eN)

---

Let’s make blogging better, together. 🚀
