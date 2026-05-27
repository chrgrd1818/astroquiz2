import { getSupabaseClientFromContext } from '../../../lib/supabase.js';
import { registerSchema } from '../../../schemas/authSchema.js';

export async function POST(context) {
  try {
    const formData = await context.request.formData();
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');

    console.log('📝 Registration attempt for:', email);

    // Validate input
    const validation = registerSchema.safeParse({
      email,
      password,
      confirmPassword,
    });

    if (!validation.success) {
      console.error('❌ Registration validation failed:', validation.error.flatten());
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
    console.log('🚀 Creating Supabase client for registration...');
    const supabase = getSupabaseClientFromContext(context);
    console.log('✅ Supabase client created');

    console.log('🔄 Attempting sign up...');
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${context.url.origin}/account`,
      },
    });

    if (error) {
      console.error('❌ Registration error from Supabase:', {
        message: error.message,
        status: error.status,
        code: error.code,
      });
      return new Response(
        JSON.stringify({ 
          error: error.message,
          details: {
            code: error.code,
            status: error.status,
          }
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('✅ Registration successful for:', email);
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
  } catch (e) {
    const error = e instanceof Error ? e : new Error(String(e));
    console.error('💥 Unexpected error during registration:', {
      message: error.message,
      stack: error.stack,
    });
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        debug: error.message,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}