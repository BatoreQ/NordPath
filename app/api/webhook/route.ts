import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const { user_id, country_slug, purchase_id } = session.metadata!

    await supabase
      .from('purchases')
      .update({
        status: 'paid',
        stripe_session_id: session.id,
        stripe_payment_intent: session.payment_intent as string,
        paid_at: new Date().toISOString()
      })
      .eq('id', purchase_id)

    console.log(`Payment confirmed: user=${user_id}, country=${country_slug}`)
  }

  return NextResponse.json({ received: true })
}
