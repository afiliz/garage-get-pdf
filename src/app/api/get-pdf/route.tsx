import { NextRequest, NextResponse } from 'next/server';
import { renderToStream } from '@react-pdf/renderer';
import { InvoiceDocument, InvoiceData } from './InvoiceDocument';
import React from 'react';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const uuid = searchParams.get('uuid');
  const name = searchParams.get('name') || 'Customer';
  const email = searchParams.get('email') || 'their@email.com';

  if (!uuid) {
    return new NextResponse('uuid is required', { status: 400 });
  }

  try {
    const res = await fetch(`https://garage-backend.onrender.com/listings/${uuid}`);
    if (!res.ok) {
        const errorText = await res.text();
        console.error('failed to fetch listing data:', errorText);
        return new NextResponse(`failed to fetch listing data: ${res.statusText}`, { status: res.status });
    }
    const data: InvoiceData = await res.json();
    const pdfStream = await renderToStream(<InvoiceDocument data={{...data, name, email}} />);
    const title = data.listingTitle || 'invoice';

    return new NextResponse(pdfStream as any, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${title.replace(/ /g, '_')}_invoice.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error generating pdf:', error);
    return new NextResponse('Error generating pdf', { status: 500 });
  }
}