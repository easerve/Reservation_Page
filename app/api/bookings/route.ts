
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const booking = await request.json();
    
    // Get the data directory path
    const dataDir = path.join(process.cwd(), 'data');
    const filePath = path.join(dataDir, 'bookings.json');

    // Create data directory if it doesn't exist
    try {
      await fs.access(dataDir);
    } catch {
      await fs.mkdir(dataDir, { recursive: true });
    }

    // Read existing bookings or create empty array
    let bookings = [];
    try {
      const fileContent = await fs.readFile(filePath, 'utf-8');
      bookings = JSON.parse(fileContent);
    } catch {
      // File doesn't exist yet, start with empty array
    }

    // Add new booking
    bookings.push(booking);

    // Write back to file
    await fs.writeFile(filePath, JSON.stringify(bookings, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to save booking:', error);
    return NextResponse.json(
      { error: 'Failed to save booking' },
      { status: 500 }
    );
  }
}
