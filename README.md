
# Firebase Studio - Next.js Starter

This is a Next.js starter project bootstrapped in Firebase Studio. It provides a full-stack portfolio application with an integrated admin panel for content management.

## Key Features

- **Next.js App Router**: Modern, performant routing and layout system.
- **Server Components**: Data is fetched on the server for faster page loads and better SEO.
- **ShadCN UI & Tailwind CSS**: A beautiful and customizable component library.
- **Firebase Integration**: Uses Firestore as a database for all site content.
- **Admin Panel**: A secure section to manage portfolio projects, skills, about page content, site settings, and more.
- **Production-Ready**: Includes security headers, optimized build configurations, and environment variable management for easy deployment.

## Getting Started

First, ensure you have Node.js and pnpm installed.

Then, run the development server:

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.

## Admin Panel

The admin panel is located at `/admin`. To log in, you will need to set up your environment variables as described below.

- **URL**: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

## Environment Variables

To run this project, you will need to create a `.env.local` file in the root of your project and add the necessary environment variables. You can use the `.env.example` file as a template.

**Required Variables:**

-   **Firebase Credentials**: You can get these from your Firebase project settings.
    -   `NEXT_PUBLIC_FIREBASE_API_KEY`
    -   `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
    -   `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
    -   `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
    -   `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
    -   `NEXT_PUBLIC_FIREBASE_APP_ID`
-   **Admin Credentials**: These are used for the basic authentication of the admin panel.
    -   `ADMIN_EMAIL`
    -   `ADMIN_PASSWORD`

**Note:** The built-in admin authentication is basic. For applications requiring higher security or multiple users, it is strongly recommended to replace it with a dedicated provider like Firebase Authentication or NextAuth.js.

## Deployment on Vercel

This project is optimized for deployment on [Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

### Steps to Deploy:

1.  **Push to GitHub**: Push your project code to a GitHub repository.
2.  **Import Project on Vercel**: From your Vercel dashboard, import the GitHub repository. Vercel will automatically detect that it is a Next.js project.
3.  **Configure Environment Variables**: In the Vercel project settings, navigate to the "Environment Variables" section. Add all the variables from your `.env.local` file. Ensure they are correctly set for the "Production" environment (and "Preview" / "Development" if needed).
4.  **Deploy**: Trigger a deployment. Vercel will build and deploy your application.

Your application will be live at the URL provided by Vercel!
