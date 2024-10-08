import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
// Define public routes
const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)']);

// Middleware function
export default clerkMiddleware((auth, request) => {
  if (!isPublicRoute(request) && request.nextUrl.pathname !== '/') {
    auth().protect();
  }

});

// Configuration for the middleware
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};