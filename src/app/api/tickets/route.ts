import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Validate required fields
    if (!data.workorderNumber) {
      return NextResponse.json({ error: 'Workorder Number is required' }, { status: 400 });
    }

    // Create the ticket in the database
    const ticket = await prisma.ticket.create({
      data: {
        workorderNumber: data.workorderNumber,
        ticketNumber: data.ticketNumber || null,
        status: 'PENDING',
        dispatcher: data.dispatcher || null,
        customer: data.customer || null,
        nationalAccount: data.nationalAccount || null,
        nationalAccountType: data.nationalAccountType || null,
        callTime: data.callTime || null,
        truckOrTrailer: data.truckOrTrailer || null,
        unitNumber: data.unitNumber || null,
        tirePosition: data.tirePosition || null,
        tireSize: data.tireSize || null,
        replacementModel: data.replacementModel || null,
        location: data.location || null,
        dispatchPhone: data.dispatchPhone || null,
        driverName: data.driverName || null,
        driverNumber: data.driverNumber || null,
        rimDamage: data.rimDamage || null,
        mudFlapDamage: data.mudFlapDamage || null,
        dispatchComments: data.dispatchComments || null,
      }
    });

    return NextResponse.json(ticket, { status: 201 });
  } catch (error: any) {
    console.error('Error creating ticket:', error);

    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A ticket with this Workorder Number already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create ticket', details: error.message },
      { status: 500 }
    );
  }
}
