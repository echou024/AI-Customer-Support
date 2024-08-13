import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { message } = await request.json()

  // Replace this URL with your Colab notebook's ngrok URL
  const COLAB_URL = 'https://ffe1-35-233-241-123.ngrok-free.app/chat'

  try {
    const response = await fetch(COLAB_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    })

    if (!response.ok) {
      throw new Error('Failed to fetch from Colab')
    }

    const data = await response.json()
    return NextResponse.json({ reply: data.reply })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}