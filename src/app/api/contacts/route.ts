import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { contactTable } from '@/db/schema';

export async function GET() {
  try {
    const contacts = await db.select().from(contactTable);
    return NextResponse.json({ contacts });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contacts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, email, address } = body;

    if (!name || !phone || !address) {
      return NextResponse.json(
        { error: 'Name, phone, and address are required' },
        { status: 400 }
      );
    }

    const newContact = await db.insert(contactTable).values({
      name,
      phone,
      email,
      address,
    }).returning();

    return NextResponse.json({ contact: newContact[0] }, { status: 201 });
  } catch (error) {
    console.error('Error creating contact:', error);
    return NextResponse.json(
      { error: 'Failed to create contact' },
      { status: 500 }
    );
  }
} 