import { getSupabaseClientFromContext } from '../../lib/supabase.js';
import { registerSchema } from '../../schemas/authSchema.js';

export async function POST(context) {
  try {
    const formData = await context.request.formData();
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');

    // Validate input
    const validation = registerSchema.safeParse({
      email,
      password,
      confirmPassword,
    });

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

    // Register with Supabase
    const supabase = getSupabaseClientFromContext(context);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${context.url.origin}/account`,
      },
    });

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Successful registration
    return new Response(
      JSON.stringify({
        success: true,
        user: data.user,
        message: 'Registration successful. Please check your email to confirm.',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}