import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

export async function GET() {
  const filePath = path.join(process.cwd(), 'src', 'data', 'cases.json');
  
  try {
    const jsonData = await fs.readFile(filePath, 'utf-8');
    const cases = JSON.parse(jsonData);
    return NextResponse.json(cases);
  } catch (error) {
    console.error('Error loading cases:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}