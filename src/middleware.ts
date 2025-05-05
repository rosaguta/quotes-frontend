import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_QUOTE_API}/quotes/random`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    console.log("Someone had a token that was incorrect")
    return NextResponse.redirect(new URL('/login', request.url));
  }
  return NextResponse.next()

}

export const config = {
  matcher: ['/', '/quotes', '/rizz', '/insults'], 
}
