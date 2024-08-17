
import getStripe from "../util/get-stripe";

export const handleStripeSubmit = async () => {
    try{
    const checkoutSession = await fetch('/api/stripe-session', {
      method: 'POST',
      headers: { origin: 'http://localhost:3000' },
    })
    const checkoutSessionJson = await checkoutSession.json()
    const stripe = await getStripe()
    const {error} = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    })
  
    if (error) {
      console.warn(error.message)
    }
}
catch(error){
    console.log(error.message)
    console.log(error)
}
}
  

