import { createClient } from "@supabase/supabase-js"

const supabaseUrl: string = "https://yfmmccwzpmiftkcygdny.supabase.co"
const supabaseKey: string = "sb_publishable_EiVYgwhhnuZfBdvHbqyoUg_UwoAg2oL"

export const supabase = createClient(supabaseUrl, supabaseKey)
