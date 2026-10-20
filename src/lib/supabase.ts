import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://isdbsiocqiaxttlfysqq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlzZGJzaW9jcWlheHR0bGZ5c3FxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0MTU4NjUsImV4cCI6MjA3OTk5MTg2NX0.i6LTDU5utlesiWKjwRfDCEvH3jn74LnnH8Hn6lX2O8E';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);














