import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://rcyhwyuylexlxjwtcmbr.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjeWh3eXV5bGV4bHhqd3RjbWJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzNjM5MDIsImV4cCI6MjA4OTkzOTkwMn0.-5jdfCxpxftU9FFtMMQCepEemDUA5ybTHUL0FErvYt8"

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function main() {
  const { data, error } = await supabase.auth.signUp({
    email: 'gabriel.lima@southti.com.br',
    password: '123456'
  })
  
  if (error) {
    console.error("Erro:", error.message)
    process.exit(1)
  }
  
  console.log("Sucesso:", JSON.stringify(data, null, 2))
}

main()
