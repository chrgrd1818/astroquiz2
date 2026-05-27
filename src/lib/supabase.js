import { createServerClient } from '@supabase/ssr';

export const getSupabaseClient = (request, response) => {
  return createServerClient(
    import.meta.env.SUPABASE_URL,
    import.meta.env.SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return Object.entries(request.headers)
            .filter(([key]) => key.toLowerCase() === 'cookie')
            .map(([, value]) => ({ name: '', value }));
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.headers.append(
              'Set-Cookie',
              `${name}=${value}; Path=${options?.path || '/'}; ${options?.secure ? 'Secure;' : ''} ${options?.sameSite ? `SameSite=${options.sameSite};` : ''}`
            );
          });
        },
      },
    }
  );
};

export const getSupabaseClientFromContext = (context) => {
  const supabase = createServerClient(
    import.meta.env.SUPABASE_URL,
    import.meta.env.SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return context.request.headers
            .getSetCookie()
            .map((cookie) => {
              const [name, ...rest] = cookie.split('=');
              return { name, value: rest.join('=') };
            });
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            context.response.headers.append('Set-Cookie', `${name}=${value}`);
          });
        },
      },
    }
  );
  return supabase;
};