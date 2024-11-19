import { NextRequest, NextResponse } from 'next/server';
import { getBreeds } from '@/actions/pets';

export async function GET(request: NextRequest) {
	try {
		const result = await getBreeds();
		return NextResponse.json(result);
	} catch (error) {
		console.error('Error in /pets/breed:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}
