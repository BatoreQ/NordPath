import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const COUNTRY_PRICES: Record<string, { amount: number; name: string }> = {
  norway: { amount: 2900, name: 'EmiDoc — Norwegia' },
  austria: { amount: 2900, name: 'EmiDoc — Austria' },
  iceland: { amount: 2900, name: 'EmiDoc — Islandia' }
}

export async function POST(req: NextRequest) {
  try {
    const { countrySlug } = await req.json()
    const cookieStore = await cookies()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: () => {}
        }
      }
    )

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: existing } = await supabase
      .from('purchases')
      .select('id')
      .eq('user_id', user.id)
      .eq('country_slug', countrySlug)
      .eq('status', 'paid')
      .single()

    if (existing) {
      return NextResponse.json({ error: 'Already purchased' }, { status: 400 })
    }

    const countryData = COUNTRY_PRICES[countrySlug]
    if (!countryData) {
      return NextResponse.json({ error: 'Invalid country' }, { status: 400 })
    }

    const adminSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: purchase } = await adminSupabase
      .from('purchases')
      .insert({
        user_id: user.id,
        country_slug: countrySlug,
        amount_pln: countryData.amount,
        status: 'pending'
      })
      .select()
      .single()

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'blik', 'p24'],
      line_items: [{
        price_data: {
          currency: 'pln',
          product_data: { name: countryData.name },
          unit_amount: countryData.amount
        },
        quantity: 1
      }],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/country/${countrySlug}?payment=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/country/${countrySlug}?payment=cancelled`,
      customer_email: user.email,
      metadata: {
        user_id: user.id,
        country_slug: countrySlug,
        purchase_id: purchase.id
      }
    })

    await adminSupabase
      .from('purchases')
      .update({ stripe_session_id: session.id })
      .eq('id', purchase.id)

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
