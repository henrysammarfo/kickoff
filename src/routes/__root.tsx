import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import type { ReactNode } from "react";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4">
      <div className="max-w-md text-center">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#A0A0A0]">// 404 · off pitch</p>
        <h1 className="mt-4 font-display text-7xl text-white">Not found</h1>
        <p className="mt-4 text-sm text-[#A0A0A0]">
          This page never made the roster.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-[#C6FF3D]"
          >
            Back to KICKOFF
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4">
      <div className="max-w-md text-center">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#A0A0A0]">// error</p>
        <h1 className="mt-4 font-display text-4xl text-white">Broken play</h1>
        <p className="mt-4 text-sm text-[#A0A0A0]">
          Something went sideways. Retry or head back to the pitch.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="inline-flex items-center justify-center rounded-full bg-[#C6FF3D] px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-white"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-white hover:bg-white/5"
          >
            Home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "KICKOFF — P2P football intelligence for WC26" },
      { name: "description", content: "Local AI, peer-to-peer match rooms, self-custodial USDt tipping. Football, without the middlemen." },
      { name: "author", content: "KICKOFF" },
      { property: "og:title", content: "KICKOFF — P2P football intelligence for WC26" },
      { property: "og:description", content: "Local AI, peer-to-peer match rooms, self-custodial USDt tipping. Football, without the middlemen." },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "KICKOFF" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "KICKOFF — P2P football intelligence for WC26" },
      { name: "twitter:description", content: "Local AI, peer-to-peer match rooms, self-custodial USDt tipping." },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body className="bg-black text-white">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
