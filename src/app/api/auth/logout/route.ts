import { NextResponse } from 'next/server'

export async function POST() {
  try {
    // Clear the authentication cookie
    const response = NextResponse.json({ success: true })
    response.cookies.set('admin-auth', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0, // Expire immediately
    })
    
    return response
  } catch (error) {
    console.error('Logout API error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
