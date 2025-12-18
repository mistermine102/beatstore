import Track from '../models/Track.js'
import AppError from '../classes/AppError.js'
import { stripe } from '../stripe.js'
import { generateSignedUrl } from '../s3.js'
import User from '../models/User.js'

const createStripeConnectedAccount = async user => {
  const account = await stripe.accounts.create({
    country: 'US',
    email: user.email,
    controller: {
      losses: {
        payments: 'application',
      },
      fees: {
        payer: 'application',
      },
      stripe_dashboard: {
        type: 'express',
      },
    },
  })

  user.stripe.connectedAccountId = account.id
  await user.save()

  return account.id
}

const getConnectedAccountId = async user => {
  if (!user.connectedAccountId) {
    const id = await createStripeConnectedAccount(user)
    return id
  } else {
    return user.connectedAccountId
  }
}

export const createCheckoutSession = async (req, res) => {
  const { trackId, licenseId } = req.body

  const track = await Track.findById(trackId).populate('author').populate('tiers.license')
  if (!track) throw new AppError('Track not found', 404)

  const tier = track.tiers.find(t => t.license._id.toString() === licenseId)
  if (!tier) throw new AppError('License tier not found for this track', 404)

  if (tier.price === 0) {
    throw new AppError('Cannot create a checkout session for a free tier', 400)
  }

  // Validate seller's Stripe account is still connected
  if (!track.author.stripe?.connectedAccountId) {
    throw new AppError('Seller has not set up payment account', 400)
  }

  if (!track.author.stripe?.isConnectedAccountLinked) {
    throw new AppError('Seller payment account is not available. Please contact the seller.', 400)
  }

  const trackImageUrl = await generateSignedUrl(track.image.filename)

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'usd',
          unit_amount: tier.price,
          product_data: {
            name: `${track.title} - ${tier.license.title}`,
            description: tier.license.shortDescription,
            images: [trackImageUrl],
          },
        },
        quantity: 1,
      },
    ],
    payment_intent_data: {
      transfer_data: {
        destination: track.author.stripe.connectedAccountId,
      },
    },
    metadata: {
      trackId: track._id.toString(),
      licenseId: tier.license._id.toString(),
    },
    success_url: `${process.env.FRONTEND_URL}/payment/success`,
    cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
  })

  res.json({ url: session.url })
}

export const createConnectedAccount = async (req, res) => {
  const userId = req.userId
  const user = await User.findById(userId)

  const connectedAccountId = await getConnectedAccountId(user)

  const accountLink = await stripe.accountLinks.create({
    account: connectedAccountId,
    refresh_url: `${process.env.FRONTEND_URL}/settings/payments/refresh`,
    return_url: `${process.env.FRONTEND_URL}/settings/payments/return`,
    type: 'account_onboarding',
  })

  res.json({ url: accountLink.url })
}

export const getDashboardLoginLink = async (req, res) => {
  const userId = req.userId
  const user = await User.findById(userId)

  if (!user.stripe.connectedAccountId) {
    throw new AppError('No connected account found', 404)
  }

  const loginLink = await stripe.accounts.createLoginLink(user.stripe.connectedAccountId)

  res.json({ url: loginLink.url })
}

export const handleStripeEvents = async (req, res) => {
  const signature = req.headers['stripe-signature']
  let event

  try {
    event = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    throw new AppError(`Webhook signature verification failed: ${err.message}`, 400)
  }

  if (event.type === 'account.updated') {
    const account = event.data.object

    const user = await User.findOne({ 'stripe.connectedAccountId': account.id })
    if (!user) {
      return res.json({ received: true })
    }

    const isLinked = account.capabilities.transfers === 'active'

    user.stripe.isConnectedAccountLinked = isLinked
    await user.save()
  }

  res.json({ received: true })
}
