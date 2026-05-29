// src/pages/api/auth/login.js

/**
 * API route: POST /api/auth/login
 *
 * - Accepts form submissions (FormData) with fields like `action`, `email`, `password`, etc.
 * - If the request includes header `x-internal-request: 1`, the origin/referrer guard is skipped.
 * - Returns JSON responses with appropriate status codes.
 *
 * Replace `authenticateUser` with your real authentication logic (DB lookup, bcrypt, etc.).
 */

export async function POST({ request }) {
  try {
    // Detect internal server-side calls
    const internal = request.headers.get('x-internal-request') === '1';

    // If not internal, perform origin/referrer checks to prevent cross-site POSTs
    if (!internal) {
      const origin = request.headers.get('origin') || '';
      const referer = request.headers.get('referer') || '';

      // Adjust expectedOrigin to match your dev/prod origin if needed
      const expectedOrigin = process.env.SITE || 'http://localhost:3000';

      const originOk = origin === '' || origin.startsWith(expectedOrigin);
      const refererOk = referer === '' || referer.startsWith(expectedOrigin);

      if (!originOk && !refererOk) {
        return new Response('Cross-site POST form submissions are forbidden', {
          status: 403,
          headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        });
      }
    }

    // Parse incoming form data
    const formData = await request.formData();
    const action = formData.get('action') || '';
    const email = String(formData.get('email') || '').trim();
    const password = formData.get('password') || null;
    const hasPassword = formData.get('hasPassword') === 'true' || !!password;

    // Only handle login action here
    if (action !== 'login') {
      return new Response(JSON.stringify({ error: 'Unsupported action' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Simple authentication stub
    // Replace this with your real authentication (DB lookup, password hash check, session creation, etc.)
    async function authenticateUser(email, password, hasPassword) {
      // Example behavior:
      // - If hasPassword is false, treat as "magic link" or passwordless login attempt -> reject here
      // - If email is empty -> reject
      // - For demo: accept any non-empty email when hasPassword is false (you should change this)
      if (!email) {
        return { ok: false, status: 400, body: { error: 'Email is required' } };
      }

      if (!hasPassword) {
        // Example: you might send a magic link here; for now, reject
        return { ok: false, status: 400, body: { error: 'Password required for login' } };
      }

      // Demo password check: accept if password equals "password" (replace with real check)
      if (typeof password === 'string' && password.length > 0) {
        const demoAccept = password === 'password';
        if (demoAccept) {
          return { ok: true, status: 200, body: { message: 'Login successful', email } };
        } else {
          return { ok: false, status: 401, body: { error: 'Invalid credentials' } };
        }
      }

      return { ok: false, status: 400, body: { error: 'Invalid login request' } };
    }

    // Call authentication logic
    const result = await authenticateUser(email, password, hasPassword);

    // Return JSON response
    return new Response(JSON.stringify(result.body), {
      status: result.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Login handler error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export default POST;
