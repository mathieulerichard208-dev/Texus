import { NextRequest, NextResponse } from 'next/server'
import AfricasTalking from 'africastalking'

export async function POST(req: NextRequest) {
  const { phone } = await req.json()
  const otp = Math.floor(100000 + Math.random() * 900000).toString()
  
  try {
    const client = AfricasTalking({
      apiKey: process.env.AFRICAS_TALKING_API_KEY || '',
      username: process.env.AFRICAS_TALKING_USERNAME || '',
    })
    
    await client.SMS.send({
      to: [phone],
      message: 'Votre code Texus: ' + otp,
    })
    
    return NextResponse.json({ success: true, otp })
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
