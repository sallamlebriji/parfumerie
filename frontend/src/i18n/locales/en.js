export default {
  nav: {
    home: "Home",
    shop: "Shop",
    collections: "Collections",
    brands: "Brands",
    about: "About",
    contact: "Contact",
    track: "Track my order",
    favorites: "Favorites",
    cart: "Cart",
    language: "Language",
    menu: "Menu",
    close: "Close",
    orderNow: "Order",
    skip: "Skip to content"
  },
  common: {
    addToCart: "Add to cart",
    added: "{{name}} added to cart",
    viewProduct: "View fragrance",
    outOfStock: "Out of stock",
    inStock: "In stock",
    lowStock: "Only {{count}} left",
    promo: "Sale",
    new: "New",
    loading: "Loading…",
    backToShop: "Back to the shop",
    seeAll: "See all",
    orderOnWhatsapp: "Order on WhatsApp",
    writeOnWhatsapp: "Message us on WhatsApp",
    search: "Search",
    reset: "Reset",
    remove: "Remove",
    quantity: "Quantity",
    total: "Total",
    subtotal: "Subtotal",
    results_one: "{{count}} fragrance",
    results_other: "{{count}} fragrances",
    decrease: "Decrease quantity",
    increase: "Increase quantity",
    addFavorite: "Add to favorites",
    removeFavorite: "Remove from favorites",
    error: "Something went wrong. Please try again in a moment."
  },
  genders: { Homme: "Men", Femme: "Women", Mixte: "Unisex" },
  families: {
    oud: "Oud", ambre: "Amber", musc: "Musk", floral: "Floral", boise: "Woody", frais: "Fresh", gourmand: "Gourmand",
    aromatique: "Aromatic", oriental: "Oriental", luxe: "Luxury", cuir: "Leather", epice: "Spicy", fruite: "Fruity", musque: "Musky", coffrets: "Gift sets"
  },
  home: {
    hero: {
      eyebrow: "Online perfumery",
      title: "Oud, amber, musk: choose your signature.",
      text: "From great houses to oriental essences, a selection of fragrances you can order in a few clicks. We confirm every order with you on WhatsApp.",
      primary: "Explore the shop",
      pick: "Our pick"
    },
    families: {
      eyebrow: "Fragrance families",
      title: "Start from what you love",
      text: "Woody, amber, floral or fresh: browse the shop by family."
    },
    featured: {
      eyebrow: "Selection",
      title: "This season's selection",
      text: "Fragrances to discover, to treat yourself or to give."
    },
    ritual: {
      eyebrow: "How to order",
      title: "As simple as a message",
      text: "No account to create: pick your fragrances, leave your details and confirm on WhatsApp.",
      steps: [
        { title: "Choose", text: "Browse the shop and add your fragrances to the cart." },
        { title: "Leave your details", text: "Name, phone, address. Nothing else." },
        { title: "Confirm on WhatsApp", text: "We check availability and arrange delivery with you." }
      ],
      videoLabel: "Play the video",
      pauseLabel: "Pause the video"
    },
    offers: { eyebrow: "Offers", title: "Reduced prices right now" },
    brands: { eyebrow: "Houses", title: "Brands in the shop", text: "Find their fragrances in one click." },
    newest: { eyebrow: "New in", title: "Latest arrivals" },
    cta: { title: "Torn between two fragrances?", text: "Message us on WhatsApp, we'll be happy to help." }
  },
  shop: {
    eyebrow: "Shop",
    title: "All fragrances",
    text: "Filter by family, brand or budget to find yours.",
    searchPlaceholder: "Search a fragrance or a brand",
    filters: "Filters",
    allFamilies: "All families",
    sortLabel: "Sort by",
    sort: { recommended: "Selection", priceAsc: "Price: low to high", priceDesc: "Price: high to low", newest: "Newest" },
    gender: "For",
    allGenders: "All",
    brand: "Brand",
    allBrands: "All brands",
    price: "Budget (DH)",
    min: "Min",
    max: "Max",
    availableOnly: "In stock only",
    promoOnly: "Offers only",
    clear: "Clear filters",
    none: { title: "No fragrance matches", text: "Try another family or widen your budget." }
  },
  product: {
    pyramid: "Fragrance pyramid",
    notesEyebrow: "Fragrance notes",
    top: "Top notes",
    heart: "Heart notes",
    base: "Base notes",
    pyramidText: "Top notes open first, heart notes give the fragrance its character, base notes stay on the skin.",
    noNotes: "The notes of this fragrance will be added soon.",
    description: "Description",
    similar: "You may also like",
    volume: "Size",
    orderMessage: "Hello, I would like to order {{name}} ({{volume}}).",
    reassurance: ["Order confirmed on WhatsApp", "Pay on delivery or by bank transfer"],
    notFound: { title: "This fragrance can't be found", text: "It is no longer in the catalogue or the link is wrong." }
  },
  cart: {
    eyebrow: "Cart",
    title: "Your cart",
    empty: { title: "Your cart is empty", text: "Add a fragrance to start your order." },
    deliveryNote: "Any delivery fee is confirmed with you on WhatsApp.",
    checkout: "Checkout",
    continue: "Continue shopping",
    items_one: "{{count}} item",
    items_other: "{{count}} items"
  },
  checkout: {
    eyebrow: "Order",
    title: "Complete your order",
    text: "No account needed. Your details are only used to deliver your order.",
    contact: "Your details",
    fullName: "Full name",
    phone: "Phone",
    phoneHint: "A number where we can reach you, preferably on WhatsApp.",
    city: "City",
    address: "Delivery address",
    notes: "Note for the shop (optional)",
    delivery: { label: "Delivery", home: "To your door", pickup: "Pick up in store" },
    payment: { label: "Payment", cash: "On delivery", transfer: "Bank transfer" },
    submit: "Send the order",
    submitting: "Sending…",
    summary: "Summary",
    consent: "By sending the order, you agree to be contacted on WhatsApp at the number provided.",
    errors: {
      name: "Enter your full name.",
      phone: "Enter a valid phone number.",
      city: "Enter your city.",
      address: "Enter your address."
    },
    failed: "The order could not be saved. Check your connection or send it directly on WhatsApp.",
    sendAnyway: "Send on WhatsApp without saving",
    empty: { title: "Nothing to order yet", text: "Add a fragrance to your cart first." },
    pickupAddress: "Pick up in store"
  },
  success: {
    eyebrow: "Order sent",
    title: "Thank you, we received your order",
    text: "Last step: confirm it on WhatsApp so we can process it faster.",
    reference: "Your reference",
    keep: "Keep this reference: it lets you track your order.",
    whatsapp: "Confirm on WhatsApp",
    track: "Track my order",
    home: "Back to home",
    noOrder: "No recent order to show."
  },
  track: {
    eyebrow: "Tracking",
    title: "Where is my order?",
    text: "Enter the reference you received and the phone number used for the order.",
    reference: "Reference",
    referencePlaceholder: "E.g. 8F3A2C",
    phone: "Phone",
    submit: "Track my order",
    searching: "Searching…",
    notFound: "No order matches this information.",
    placedOn: "Order of {{date}}",
    items: "Items",
    help: "A question about this order?",
    status: { pending: "Received", confirmed: "Confirmed", delivered: "Delivered", cancelled: "Cancelled" },
    statusText: {
      pending: "We received your order and will confirm it with you.",
      confirmed: "Your order is confirmed and being prepared.",
      delivered: "Your order has been delivered.",
      cancelled: "This order was cancelled. Message us if this is a mistake."
    }
  },
  collections: {
    eyebrow: "Collections",
    title: "Explore by fragrance family",
    text: "Each family gathers fragrances with similar notes."
  },
  brandsPage: {
    eyebrow: "Brands",
    title: "The houses in the shop",
    text: "Pick a brand to see its fragrances."
  },
  faq: {
    eyebrow: "Help",
    title: "Frequently asked questions",
    text: "The essentials to order with confidence.",
    items: [
      { q: "How do I place an order?", a: "Add your fragrances to the cart, fill in your details and send the order. We confirm it with you on WhatsApp." },
      { q: "Do I need an account?", a: "No. Your name, phone number and address are enough." },
      { q: "Which payment methods do you accept?", a: "Payment on delivery or by bank transfer. Details are confirmed with you on WhatsApp." },
      { q: "What are the delivery times and fees?", a: "They depend on your city. We tell you before delivery is confirmed." },
      { q: "How do I track my order?", a: "Go to the tracking page and enter your reference and phone number." },
      { q: "A fragrance is out of stock, what can I do?", a: "Message us on WhatsApp to find out about upcoming availability." },
      { q: "Can I change or cancel my order?", a: "Contact us as soon as possible on WhatsApp with your reference." }
    ]
  },
  about: {
    eyebrow: "About",
    title: "Carefully chosen fragrances, a simple order.",
    text: "Maison Parfumée brings together fragrances from great houses and oriental essences. Every order is confirmed with you on WhatsApp, so you receive the right fragrance.",
    blocks: [
      { title: "A clear selection", text: "Each page lists top, heart and base notes so you can choose without guessing." },
      { title: "A straightforward order", text: "No account to create. You leave your details, we confirm on WhatsApp." },
      { title: "Simple tracking", text: "Your reference and phone number are all you need to follow your order." }
    ]
  },
  contact: {
    eyebrow: "Contact",
    title: "Let's talk about your next fragrance",
    text: "Fastest is a WhatsApp message. You can also write below, the message opens in WhatsApp.",
    name: "Your name",
    message: "Your message",
    send: "Send on WhatsApp",
    direct: "Or message us directly",
    defaultMessage: "Hello, I have a question about your fragrances."
  },
  favorites: {
    title: "Your favorites",
    text: "The fragrances you set aside on this device.",
    empty: { title: "No favorites yet", text: "Tap the heart on a fragrance to find it here." }
  },
  footer: {
    tagline: "Designer and oriental fragrances, ordered in a few clicks.",
    shop: "Shop",
    help: "Help",
    confirmation: "Order confirmed on WhatsApp",
    payments: "Pay on delivery or by bank transfer",
    rights: "© {{year}} Maison Parfumée. All rights reserved."
  },
  notFound: { title: "This page doesn't exist", text: "The link may be wrong or the page has moved.", home: "Back to home" },
  denied: { title: "Access denied", text: "Your role or plan doesn't allow you to open this page." }
};
