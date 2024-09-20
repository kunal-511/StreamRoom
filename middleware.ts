import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
const protectedRoutes = createRouteMatcher([
    '/',
    '/upcoming',
    '/previous',
    'recordings',
    '/personal-room',
    '/meeting(.*)',
])

interface Auth {
  protect: () => void;
}

interface Req {
  url: string;
}

export default clerkMiddleware((auth: () => Auth, req: Req) => {
  if (protectedRoutes(req.url)) auth().protect();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}