import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Presentation from '@/lib/models/Presentation';

interface MockPresentation {
  id: string;
  title: string;
  screenCode: string;
  slides: { id: number; image: string; title: string }[];
  totalSlides: number;
  createdAt: string;
  autoPlay: boolean;
  slideInterval: number;
}

const mockPresentations: Record<string, MockPresentation> = {
  'ABC123': {
    id: 'demo-q4-sales',
    title: 'Q4 Sales Report',
    screenCode: 'ABC123',
    slides: [
      {
        id: 1,
        image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyMCIgaGVpZ2h0PSIxMDgwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iYmciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNmOGZhZmM7c3RvcC1vcGFjaXR5OjEiIC8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojZTJlOGYwO3N0b3Atb3BhY2l0eToxIiAvPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2JnKSIvPjxyZWN0IHg9IjEwMCIgeT0iMTAwIiB3aWR0aD0iMTcyMCIgaGVpZ2h0PSI4ODAiIGZpbGw9IndoaXRlIiBzdHJva2U9IiNjYmQ1ZTEiIHN0cm9rZS13aWR0aD0iMiIgcng9IjgiLz48cmVjdCB4PSIxNTAiIHk9IjE1MCIgd2lkdGg9IjE2MjAiIGhlaWdodD0iODAiIGZpbGw9IiMxZTQwYWYiIHJ4PSI0Ii8+PHRleHQgeD0iOTYwIiB5PSIyMDAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIzNiIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtd2VpZ2h0PSJib2xkIj5RNSBTY8VzIFJlcG9ydCAtIFBhZ2UgMTwvdGV4dD48cmVjdCB4PSIyMDAiIHk9IjI4MCIgd2lkdGg9IjE1MjAiIGhlaWdodD0iNjAwIiBmaWxsPSIjZjFmNWY5IiByeD0iNCIvPjxyZWN0IHg9IjI1MCIgeT0iMzMwIiB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzNiODJmNiIgcng9IjQiLz48cmVjdCB4PSI3MDAiIHk9IjMzMCIgd2lkdGg9IjQwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiMxMGI5ODEiIHJ4PSI0Ii8+PHJlY3QgeD0iMTE1MCIgeT0iMzMwIiB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y1OWUwYiIgcng9IjQiLz48cmVjdCB4PSIyNTAiIHk9IjU4MCIgd2lkdGg9IjYwMCIgaGVpZ2h0PSIyMCIgZmlsbD0iIzZiNzI4MCIgcng9IjIiLz48cmVjdCB4PSIyNTAiIHk9IjYyMCIgd2lkdGg9IjgwMCIgaGVpZ2h0PSIyMCIgZmlsbD0iIzZiNzI4MCIgcng9IjIiLz48cmVjdCB4PSIyNTAiIHk9IjY2MCIgd2lkdGg9IjUwMCIgaGVpZ2h0PSIyMCIgZmlsbD0iIzZiNzI4MCIgcng9IjIiLz48Y2lyY2xlIGN4PSIxMzAwIiBjeT0iNjUwIiByPSIxMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzhiNWNmNiIgc3Ryb2tlLXdpZHRoPSI4Ii8+PHBhdGggZD0iTSAxMjAwIDY1MCBRIDI1MCA2MDAgMTMwMCA2NTAgUSAxMzUwIDcwMCAxNDAwIDY1MCIgc3Ryb2tlPSIjZWY0NDQ0IiBzdHJva2Utd2lkdGg9IjQiIGZpbGw9Im5vbmUiLz48dGV4dCB4PSI5NjAiIHk9Ijk1MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjI0IiBmaWxsPSIjNmI3MjgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5TbGlkZSAxIOKAoiBHZW5lcmF0ZWQgYnkgemNyZWVuczwvdGV4dD48L3N2Zz4=",
        title: "Title Page"
      },
      {
        id: 2,
        image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyMCIgaGVpZ2h0PSIxMDgwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNmMGY5ZmYiLz48dGV4dCB4PSI1MCUiIHk9IjIwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjQwIiBmaWxsPSIjMTA3M2FhIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5TYWxlcyBPdmVydmlldzwvdGV4dD48cmVjdCB4PSIxMDAiIHk9IjE1MCIgd2lkdGg9IjEwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiMxMDczYWEiLz48cmVjdCB4PSIyNTAiIHk9IjIwMCIgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxNTAiIGZpbGw9IiMzNDg0ZDMiLz48cmVjdCB4PSI0MDAiIHk9IjEwMCIgd2lkdGg9IjEwMCIgaGVpZ2h0PSIyNTAiIGZpbGw9IiMxZTg4ZTUiLz48cmVjdCB4PSI1NTAiIHk9IjgwIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjI3MCIgZmlsbD0iIzBmNzBmZiIvPjwvc3ZnPg==",
        title: "Sales Overview"
      },
      {
        id: 3,
        image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyMCIgaGVpZ2h0PSIxMDgwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNmMGY5ZmYiLz48dGV4dCB4PSI1MCUiIHk9IjIwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjQwIiBmaWxsPSIjMTk3YTNlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5RdWFydGVybHkgUmVzdWx0czwvdGV4dD48Y2lyY2xlIGN4PSI5NjAiIGN5PSI1NDAiIHI9IjE1MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMTk3YTNlIiBzdHJva2Utd2lkdGg9IjMwIi8+PGNpcmNsZSBjeD0iOTYwIiBjeT0iNTQwIiByPSIxNTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2RjZjhlOCIgc3Ryb2tlLXdpZHRoPSIzMCIgc3Ryb2tlLWRhc2hhcnJheT0iNzA3IDIzNiIvPjx0ZXh0IHg9Ijk2MCIgeT0iNTYwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iNjAiIGZpbGw9IiMxOTdhM2UiIHRleHQtYW5jaG9yPSJtaWRkbGUiPjc1JTwvdGV4dD48L3N2Zz4=",
        title: "Quarterly Results"
      },
      {
        id: 4,
        image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyMCIgaGVpZ2h0PSIxMDgwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNmOWY5ZjkiLz48dGV4dCB4PSI1MCUiIHk9IjQwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjY0IiBmaWxsPSIjMzMzIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5UaGFuayB5b3U8L3RleHQ+PHRleHQgeD0iNTAlIiB5PSI2MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIzNiIgZmlsbD0iIzY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+UXVlc3Rpb25zPzwvdGV4dD48L3N2Zz4=",
        title: "Thank You"
      }
    ],
    totalSlides: 4,
    createdAt: '2024-01-15T10:30:00Z',
    autoPlay: false,
    slideInterval: 5000
  },
  'DEMO': {
    id: 'demo-product',
    title: 'Product Demo Presentation',
    screenCode: 'DEMO',
    slides: [
      {
        id: 1,
        image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyMCIgaGVpZ2h0PSIxMDgwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNmNWY3ZmEiLz48dGV4dCB4PSI1MCUiIHk9IjQ1JSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjY0IiBmaWxsPSIjMWU0MGFmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXdlaWdodD0iYm9sZCI+UHJvZHVjdCBEZW1vPC90ZXh0Pjx0ZXh0IHg9IjUwJSIgeT0iNjAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMzIiIGZpbGw9IiM2Yjcy4DAiIHRleHQtYW5jaG9yPSJtaWRkbGUiPjIwMjQgSW5ub3ZhdGlvbiBTaG93Y2FzZTwvdGV4dD48L3N2Zz4=",
        title: "Product Demo Title"
      },
      {
        id: 2,
        image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyMCIgaGVpZ2h0PSIxMDgwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNmMGY5ZmYiLz48dGV4dCB4PSI1MCUiIHk9IjIwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjQ4IiBmaWxsPSIjMGY3MGZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5GZWF0dXJlIEhpZ2hsaWdodHM8L3RleHQ+PHJlY3QgeD0iMjAwIiB5PSIzMDAiIHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjMGY3MGZmIiByeD0iMTAiLz48cmVjdCB4PSI3NjAiIHk9IjMwMCIgd2lkdGg9IjQwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiMzNDg0ZDMiIHJ4PSIxMCIvPjxyZWN0IHg9IjEzMjAiIHk9IjMwMCIgd2lkdGg9IjQwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiMxZTg4ZTUiIHJ4PSIxMCIvPjwvc3ZnPg==",
        title: "Feature Highlights"
      }
    ],
    totalSlides: 2,
    createdAt: '2024-01-16T14:20:00Z',
    autoPlay: false,
    slideInterval: 8000
  }
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const screenCode = code.toUpperCase();

    // Connect to database
    await connectDB();

    // First check database for uploaded presentations
    const uploadedPresentation = await Presentation.findOne({ screenCode });
    
    if (uploadedPresentation) {
      // Check if uploaded presentation has expired
      const now = new Date();
      
      if (now > uploadedPresentation.expiresAt) {
        // Remove expired presentation
        await Presentation.findByIdAndDelete(uploadedPresentation._id);
        return NextResponse.json(
          {
            error: 'Presentation expired',
            message: 'This presentation has expired. Please upload a new one.'
          },
          { status: 410 }
        );
      }

      // Convert uploaded presentation to expected format
      const presentation = {
        id: uploadedPresentation._id.toString(),
        title: uploadedPresentation.fileName.replace(/\.[^/.]+$/, ""), // Remove file extension
        screenCode: uploadedPresentation.screenCode,
        slides: uploadedPresentation.slides.map((slide: any) => ({
          id: slide.pageNumber,
          image: slide.image,
          title: `Slide ${slide.pageNumber}`
        })),
        totalSlides: uploadedPresentation.totalSlides,
        createdAt: uploadedPresentation.createdAt.toISOString(),
        autoPlay: false,
        slideInterval: 5000
      };

      return NextResponse.json({
        success: true,
        presentation
      });
    }

    // Fall back to mock presentations
    const mockPresentation = mockPresentations[screenCode];

    if (!mockPresentation) {
      return NextResponse.json(
        {
          error: 'Presentation not found',
          message: `No presentation found for screen code: ${screenCode}`
        },
        { status: 404 }
      );
    }

    // Check if mock presentation has expired (in real app)
    const createdAt = new Date(mockPresentation.createdAt);
    const now = new Date();
    const hoursSinceCreated = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);

    if (hoursSinceCreated > 24) {
      return NextResponse.json(
        {
          error: 'Presentation expired',
          message: 'This presentation has expired. Please upload a new one.'
        },
        { status: 410 }
      );
    }

    return NextResponse.json({
      success: true,
      presentation: mockPresentation
    });

  } catch (error) {
    console.error('Presentation fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
