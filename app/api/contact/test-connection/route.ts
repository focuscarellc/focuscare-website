export const runtime = 'edge';
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    
    // Simple test query
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('id')
      .limit(1)
    
    if (error) {
      return NextResponse.json({ 
        success: false, 
        error: error.message 
      })
    }
    
    return NextResponse.json({ 
      success: true, 
      message: "Supabase connection successful",
      data
    })
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    })
  }
} 