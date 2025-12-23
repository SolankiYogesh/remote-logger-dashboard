# Remote Logger Dashboard

![Remote Logger Dashboard](https://img.shields.io/badge/Next.js-16.1.1-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

A modern, real-time logging dashboard for monitoring application events with beautiful visualizations and live updates. Built with Next.js 14, TypeScript, and Supabase.

## 🚀 Live Demo

**Live Application:** [https://remote-logger-dashboard.vercel.app/](https://remote-logger-dashboard.vercel.app/)

## ✨ Features

- **Real-time Log Monitoring**: Live updates with Supabase Realtime subscriptions
- **Modern UI/UX**: Clean, dark/light mode ready interface with Tailwind CSS
- **Package-based Isolation**: Separate logging sessions for different applications
- **Live Connection Status**: Visual indicator showing real-time connection state
- **Shareable Sessions**: Generate shareable URLs for collaborative monitoring
- **Bulk Operations**: Clear logs or delete entire sessions with one click
- **Responsive Design**: Fully responsive across mobile, tablet, and desktop
- **Type Safety**: Full TypeScript support for better developer experience

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS 4, clsx, tailwind-merge
- **Database**: Supabase (PostgreSQL with Realtime)
- **Authentication**: Custom package-based authentication
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Deployment**: Vercel
- **Code Quality**: ESLint, TypeScript

## 📦 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm/bun
- Supabase account (free tier works)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/SolankiYogesh/remote-logger-dashboard.git
   cd remote-logger-dashboard/apps/dashboard
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase Database**

   - Create a new Supabase project
   - Run the following SQL to create the logs table:

   ```sql
   CREATE TABLE logs (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     package_name TEXT NOT NULL,
     level TEXT NOT NULL,
     message TEXT NOT NULL,
     timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Enable Row Level Security
   ALTER TABLE logs ENABLE ROW LEVEL SECURITY;

   -- Create policy to allow all operations (adjust based on your needs)
   CREATE POLICY "Allow all operations" ON logs FOR ALL USING (true);

   -- Enable Realtime
   ALTER PUBLICATION supabase_realtime ADD TABLE logs;
   ```

5. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🚀 Deployment

### Deploy on Vercel

The easiest way to deploy this Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

1. Push your code to GitHub/GitLab/Bitbucket
2. Import your repository to Vercel
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy!

### Other Platforms

You can also deploy to other platforms supporting Next.js:

- **Netlify**: Use the Next.js build plugin
- **Railway**: One-click deployment with their Next.js template
- **AWS**: Using Amplify or custom deployment

## 📁 Project Structure

```
dashboard/
├── src/
│   ├── app/                 # Next.js app router pages
│   │   ├── api/            # API routes
│   │   │   ├── auth/       # Authentication endpoints
│   │   │   └── log/        # Log management endpoints
│   │   ├── globals.css     # Global styles
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Home page
│   ├── components/         # React components
│   │   ├── LoginScreen.tsx # Login interface
│   │   ├── LogTable.tsx    # Log table component
│   │   └── SetupScreen.tsx # Setup interface
│   ├── contexts/           # React contexts
│   │   └── SupabaseContext.tsx # Supabase auth/logic context
│   ├── lib/               # Utility libraries
│   │   ├── auth.ts        # Authentication helpers
│   │   └── supabase.ts    # Supabase client setup
│   └── types/             # TypeScript definitions
│       └── index.ts       # Type definitions
├── public/                # Static assets
├── package.json          # Dependencies and scripts
├── next.config.ts        # Next.js configuration
├── tailwind.config.ts    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
└── README.md            # This file
```

## 🔧 API Reference

### Authentication

- `POST /api/auth` - Authenticate with package name

### Log Management

- `GET /api/log` - Retrieve logs for a package
- `POST /api/log` - Create a new log entry

### Client Integration

To send logs from your application:

```javascript
// Example: Send a log from any JavaScript application
async function sendLog(packageName, level, message) {
  const response = await fetch(
    "https://remote-logger-dashboard.vercel.app/api/log",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        package_name: packageName,
        level: level,
        message: message,
      }),
    }
  );
  return response.json();
}

// Usage
sendLog("my-app", "info", "Application started successfully");
```

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Write meaningful commit messages
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org) for the amazing React framework
- [Supabase](https://supabase.com) for the fantastic backend-as-a-service
- [Tailwind CSS](https://tailwindcss.com) for the utility-first CSS framework
- [Vercel](https://vercel.com) for seamless deployment

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/SolankiYogesh/remote-logger-dashboard/issues)
- **Email**: [Your Email]
- **Twitter**: [@YourTwitterHandle]

---

Built with ❤️ by [Yogesh Solanki](https://github.com/SolankiYogesh)
