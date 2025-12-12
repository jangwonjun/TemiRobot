import { NextRequest, NextResponse } from 'next/server'

// Simple in-memory store for demonstration purposes
// In a real app, use a database (Redis/Postgres)
let orders: Record<string, any> = {}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { tableId, items, totalPrice } = body

        if (!tableId || !items) {
            return NextResponse.json({ error: 'Missing tableId or items' }, { status: 400 })
        }

        // Save order
        orders[tableId] = {
            items,
            totalPrice,
            timestamp: new Date().toISOString(),
            status: 'pending_payment'
        }

        console.log(`[API] Order received for Table ${tableId}:`, orders[tableId])

        return NextResponse.json({ success: true, message: 'Order synced' })
    } catch (error) {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const tableId = searchParams.get('tableId')

    if (!tableId) {
        return NextResponse.json({ error: 'Missing tableId' }, { status: 400 })
    }

    const order = orders[tableId]

    if (order && order.status === 'pending_payment') {
        // Return the order and CLEAR it (or mark as fetched) to avoid repeated fetches if needed
        // For polling, we might want to keep it until payment is confirmed. 
        // Here we just return it. The client handles clearing after payment.
        return NextResponse.json({ success: true, order })
    }

    // 결제 완료 상태도 반환 (Temi가 폴링으로 확인)
    if (order && order.status === 'payment_completed') {
        return NextResponse.json({ success: true, order, paymentCompleted: true })
    }

    return NextResponse.json({ success: false, message: 'No new orders' })
}

// 결제 완료 처리 (핸드폰에서 호출)
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json()
        const { tableId } = body

        if (!tableId) {
            return NextResponse.json({ error: 'Missing tableId' }, { status: 400 })
        }

        if (orders[tableId]) {
            orders[tableId].status = 'payment_completed'
            orders[tableId].paymentCompletedAt = new Date().toISOString()
            console.log(`[API] Payment completed for Table ${tableId}`)
            return NextResponse.json({ success: true, message: 'Payment status updated' })
        }

        return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    } catch (error) {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }
}

// Endpoint to clear order (after payment)
export async function DELETE(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const tableId = searchParams.get('tableId')

    if (tableId && orders[tableId]) {
        delete orders[tableId]
        return NextResponse.json({ success: true, message: 'Order cleared' })
    }
    return NextResponse.json({ success: false })
}
