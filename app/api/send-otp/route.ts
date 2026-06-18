import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { phone } = await req.json()
  const otp = Math.floor(100000 + Math.random() * 900000).toString()
  
  try {
    const AT = require('africastalking')
    const client = AT({
      apiKey: process.env.AFRICAS_TALKING_API_KEY,
      username: process.env.AFRICAS_TALKING_USERNAME,
    })
    
    await client.SMS.send({
      to: [phone],
      message: Votre code Texus: ${otp},
      from: 'Texus',
    })
    
    return NextResponse.json({ success: true, otp })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur envoi SMS' }, { status: 500 })
  }
}
