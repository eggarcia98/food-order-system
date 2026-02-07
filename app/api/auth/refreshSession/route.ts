import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const AUTH_ENDPOINT = process.env.AUTH_ENDPOINT || 'http://localhost:8080/api/v1/auth';

export async function POST(request: Request) {
  try {
    
    // Validate token with AUTH_ENDPOINT
    const validateResponse = await fetch(`${AUTH_ENDPOINT}/validate-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
    });

    const validateData = await validateResponse.json();

    if (validateResponse.ok) {
      return NextResponse.json({
        valid: true,
        message: 'Token is valid',
        user: validateData.user,
      });
    } else {
      return NextResponse.json(
        {
          valid: false,
          message: validateData.message || 'Token validation failed',
        },
        { status: validateResponse.status }
      );
    }
  } catch (error) {
    console.error('Session refresh error:', error);
    return NextResponse.json(
      {
        valid: false,
        message: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
