import { getSupabaseClientFromContext } from '../../../lib/supabase.js';
import { loginSchema } from '../../../schemas/authSchema.js';

export async function POST(context) {
  try {
    const formData = await context.request.formData();
    const email = formData.get('email');
    const password = formData.get('password');

    console.log('🔐 Login attempt for:', email);
    console.log('📝 Supabase URL:', import.meta.env.SUPABASE_URL);
    console.log('🔑 Anon key exists:', !!import.meta.env.SUPABASE_ANON_KEY);

    // Validate input
    const validation = loginSchema.safeParse({ email, password });
    if (!validation.success) {
      console.error('❌ Validation failed:', validation.error.flatten());
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
    console.log('🚀 Creating Supabase client...');
    const supabase = getSupabaseClientFromContext(context);
    console.log('✅ Supabase client created');

    console.log('🔄 Attempting sign in with password...');
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('❌ Login error from Supabase:', {
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
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('✅ Login successful for:', email);
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
  } catch (e) {
    const error = e instanceof Error ? e : new Error(String(e));
    console.error('💥 Unexpected error during login:', {
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