import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const url = request.nextUrl.searchParams.get('url');

    if (!url) {
        return new NextResponse('Missing url parameter', { status: 400 });
    }

    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            },
        });

        if (!response.ok) {
            // Return a simple gray placeholder SVG
            const placeholderSvg = `
        <svg width="600" height="400" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="#232323"/>
          <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="24" fill="#FFE66D" text-anchor="middle" dy=".3em">BotsNANO</text>
        </svg>
      `;
            return new NextResponse(placeholderSvg, {
                status: 200,
                headers: {
                    'Content-Type': 'image/svg+xml',
                    'Cache-Control': 'public, max-age=31536000',
                },
            });
        }

        const contentType = response.headers.get('content-type') || 'image/jpeg';
        const arrayBuffer = await response.arrayBuffer();

        return new NextResponse(arrayBuffer, {
            status: 200,
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=31536000',
            },
        });
    } catch (error) {
        // Return placeholder on error
        const placeholderSvg = `
      <svg width="600" height="400" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#232323"/>
        <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="24" fill="#FFE66D" text-anchor="middle" dy=".3em">BotsNANO</text>
      </svg>
    `;
        return new NextResponse(placeholderSvg, {
            status: 200,
            headers: {
                'Content-Type': 'image/svg+xml',
            },
        });
    }
}
