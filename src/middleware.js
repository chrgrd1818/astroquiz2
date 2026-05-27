import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;
  const protectedRoutes = ['/account'];

  // Only check auth on protected routes
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    // Get auth token from cookies
    const authToken = context.request.headers.get('cookie');

    if (!authToken) {
      return context.redirect('/');
    }

    // Set a flag that user is authenticated (can be verified server-side)
    context.locals.authenticated = true;
  }

  return next();
});