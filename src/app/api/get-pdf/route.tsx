import { NextRequest, NextResponse } from 'next/server';
import { renderToStream } from '@react-pdf/renderer';
import { InvoiceDocument } from './InvoiceDocument';
import React from 'react';
import fs from 'fs';
import path from 'path';

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
    const data = await res.json();

    // read logo and convert to base64
    const logoPath = path.resolve(process.cwd(), 'public/garage-logo.png');
    const logoBuffer = fs.readFileSync(logoPath);
    const logoBase64 = `data:image/png;base64,${logoBuffer.toString('base64')}`;

    const stream = await renderToStream(<InvoiceDocument data={{...data, name, email, logo: logoBase64}} />);

    const title = data.listingTitle || 'invoice';

    return new NextResponse(stream as any, {
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