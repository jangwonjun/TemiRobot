import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const table = searchParams.get('table')

    // In a real scenario, this might fetch a unique session ID from a database
    // For now, we generate a URL based on the table number
    // In production, this points to the Vercel deployment
    const qrData = {
        url: `https://temi-robot.vercel.app/order/${table || 'unknown'}`,
        description: `Table ${table} Order Page`,
        timestamp: new Date().toISOString()
    }

    return NextResponse.json(qrData)
}

