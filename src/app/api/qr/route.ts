import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const table = searchParams.get('table')

    // In a real scenario, this might fetch a unique session ID from a database
    // For now, we generate a URL based on the table number
    // Get the host from the request (e.g., localhost:3000 or my-site.vercel.app)
    const host = request.headers.get('host')
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'

    const qrData = {
        url: `${protocol}://${host}/order/${table || 'unknown'}`,
        description: `Table ${table} Order Page`,
        timestamp: new Date().toISOString()
    }

    return NextResponse.json(qrData)
}
