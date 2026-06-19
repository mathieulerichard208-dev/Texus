import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { phone } = await req.json()
  const otp = Math.floor(100000 + Math.random() * 900000).toString()
  
  try {
    const response = await fetch('https://api.africastalking.com/version1/messaging', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'apiKey': process.env.AFRICAS_TALKING_API_KEY || '',
      },
      body: new URLSearchParams({
        username: process.env.AFRICAS_TALKING_USERNAME || '',
        to: phone,
        message: 'Votre code Texus: ' + otp,
      }).toString()
    })
    
    const data = await response.json()
    console.log('OTP:', otp, 'Response:', JSON.stringify(data))
    return NextResponse.json({ success: true, otp })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
