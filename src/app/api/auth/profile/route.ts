import { NextRequest, NextResponse } from 'next/server';
import { getUserDogs } from '@/actions/auth';

export async function GET(request: NextRequest) {
  const phoneNumber = request.nextUrl.searchParams.get('phone');

  if (!phoneNumber) {
    return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
  }

  try {
    const result = await getUserDogs(phoneNumber);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in /auth/profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}