import { NextRequest, NextResponse } from 'next/server';
import { deleteAvailability, getAvailability, postAvailability } from './service';
import { bulkAvailabilitySchema, deleteIdsSchema } from '@/db/types';
import { z } from 'zod';

export async function GET() {
  const availability = await getAvailability();
  return NextResponse.json({ data: availability });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the request body using zod
    const validatedData = bulkAvailabilitySchema.parse(body);
    
    const newAvailability = await postAvailability(validatedData);
    return NextResponse.json({ data: newAvailability }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the request body using zod
    const validatedIds = deleteIdsSchema.parse(body);
    
    const deletedAvailability = await deleteAvailability(validatedIds);
    return NextResponse.json({ data: deletedAvailability });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 