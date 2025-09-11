import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    
    // Check if we can connect
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('id')
      .limit(1)
    
    if (error) {
      if (error.code === '42P01') {
        return NextResponse.json({
          success: false,
          message: "Table 'contact_submissions' doesn't exist",
          error: error.message,
          code: error.code,
          hint: "You need to create the contact_submissions table in your Supabase database"
        })
      }
      
      return NextResponse.json({
        success: false,
        message: "Database error",
        error: error.message,
        code: error.code
      })
    }
    
    return NextResponse.json({
      success: true,
      message: "Successfully connected to Supabase and found the contact_submissions table",
      data: { tableFound: true, rowCount: data.length }
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Error connecting to Supabase",
      error: error.message
    })
  }
} 