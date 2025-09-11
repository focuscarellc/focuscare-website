import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  let formData;
  let supabase;
  
  try {
    // Parse the request body
    formData = await request.json()
    console.log('Received form data:', formData)
    
    // Validate the form data
    const { firstName, lastName, email, phone, organization, service, message } = formData
    
    if (!firstName || !lastName || !email || !message) {
      console.log('Validation failed:', { firstName, lastName, email, message })
      return NextResponse.json(
        { error: "Required fields are missing" },
        { status: 400 }
      )
    }

    // Step 1: Initialize Supabase client
    try {
      const cookieStore = cookies()
      supabase = createClient(cookieStore)
      console.log('Supabase client initialized successfully')
    } catch (supabaseClientError) {
      console.error('Failed to initialize Supabase client:', supabaseClientError)
      return NextResponse.json(
        { error: `Failed to connect to database: ${supabaseClientError.message}` },
        { status: 500 }
      )
    }
    
    // Step 2: Check if table exists
    try {
      const { data: tableExists, error: tableCheckError } = await supabase
        .from('contact_submissions')
        .select('id')
        .limit(1)
      
      console.log('Table check result:', { tableExists, tableCheckError })
      
      if (tableCheckError) {
        if (tableCheckError.code === '42P01') { // Postgres error code for undefined_table
          console.error('Table does not exist: contact_submissions')
          return NextResponse.json(
            { error: "Database table 'contact_submissions' does not exist" },
            { status: 500 }
          )
        } else {
          console.error('Error checking table:', tableCheckError)
          return NextResponse.json(
            { error: `Database error: ${tableCheckError.message}` },
            { status: 500 }
          )
        }
      }
    } catch (tableCheckError) {
      console.error('Failed to check if table exists:', tableCheckError)
      return NextResponse.json(
        { error: `Database connection error: ${tableCheckError.message}` },
        { status: 500 }
      )
    }
    
    // Step 3: Insert data
    try {
      console.log('Attempting to insert data into contact_submissions:', {
        first_name: firstName,
        last_name: lastName,
        email,
        phone: phone || null,
        organization: organization || null,
        service: service || 'all',
        message
      })
      
      const { data, error } = await supabase
        .from('contact_submissions')
        .insert([
          {
            first_name: firstName,
            last_name: lastName,
            email,
            phone: phone || null,
            organization: organization || null,
            service: service || 'all',
            message,
            submitted_at: new Date().toISOString(),
          }
        ])
        .select()
      
      if (error) {
        console.error('Supabase insert error:', error)
        return NextResponse.json(
          { error: `Failed to store contact information: ${error.message}` },
          { status: 500 }
        )
      }
      
      console.log('Contact form submission saved successfully:', data)
      
      // Return success response
      return NextResponse.json({ 
        success: true,
        message: "Thank you for your message. We'll get back to you soon!",
        id: data?.[0]?.id
      })
    } catch (insertError) {
      console.error('Error during insert operation:', insertError)
      return NextResponse.json(
        { error: `Database operation failed: ${insertError.message}` },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('General error processing contact form:', error)
    return NextResponse.json(
      { error: `Failed to process your request: ${error.message}` },
      { status: 500 }
    )
  }
} 