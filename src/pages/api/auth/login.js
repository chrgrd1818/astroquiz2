import { getSupabaseClientFromContext } from '../../../lib/supabase.js';
import { loginSchema } from '../../../schemas/authSchema.js';

export async function POST(context) {
  try {
    const formData = await context.request.formData();
    const email = formData.get('email');
    const password = formData.get('password');

    // Validate input
    const validation = loginSchema.safeParse({ email, password });
    if (!validation.success) {
      return new Response(
        JSON.stringify({
          error: 'Validation failed',
          details: validation.error.flatten(),
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Authenticate with Supabase
    const supabase = getSupabaseClientFromContext(context);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Successful login
    return new Response(
      JSON.stringify({
        success: true,
        user: data.user,
        message: 'Logged in successfully',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Login error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}