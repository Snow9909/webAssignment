(function () {
  'use strict';

  // ─── Data ───────────────────────────────────────────────────────────────

  const EMAIL_CONFIG = {
    serviceId: 'service_foac1dn',
    templateId: 'template_88jxhvk',
    publicKey: 'XkNmBezLjzbOnq_Km',
    fromName: 'The Tabletop Tavern',
    notifyEmail: 'tangqy-wp24@student.tarc.edu.my'
  };

  function initEmailJS() {
    if (typeof emailjs !== 'undefined') {
      emailjs.init({ publicKey: EMAIL_CONFIG.publicKey });
    }
  }

  function formatPriceNum(amount) {
    return Number(amount || 0).toFixed(2);
  }

  function makeOrderId(prefix = 'TT') {
    return prefix + Date.now().toString(36).toUpperCase();
  }

  function orderLinesTotal(orders) {
    return orders.reduce((sum, o) => sum + Number(o.price || 0), 0);
  }

  /** Sends email using EmailJS "Order Confirmation" template */
  async function sendOrderEmail(email, orderId, orders, cost = {}) {
    if (typeof emailjs === 'undefined') {
      console.warn('EmailJS script not loaded on this page');
      return false;
    }

    const shipping = Number(cost.shipping ?? 0);
    const tax = Number(cost.tax ?? 0);
    const itemsTotal = orderLinesTotal(orders);
    const total = cost.total != null ? Number(cost.total) : itemsTotal + shipping + tax;

    const payload = {
      email,
      order_id: orderId,
      orders: orders.map(o => ({
        name: o.name,
        units: String(o.units ?? 1),
        price: formatPriceNum(o.price)
      })),
      cost: {
        shipping: formatPriceNum(shipping),
        tax: formatPriceNum(tax),
        total: formatPriceNum(total)
      },
      from_name: EMAIL_CONFIG.fromName
    };

    try {
      await emailjs.send(EMAIL_CONFIG.serviceId, EMAIL_CONFIG.templateId, payload);
      return true;
    } catch (err) {
      console.error('EmailJS error:', err);
      return false;
    }
  }

  const TABLE_CAPACITY = {
    standard: { min: 2, max: 6, suggested: 'Ideal for 4–6 players' },
    premium: { min: 4, max: 8, suggested: 'Ideal for 6–8 players' },
    private: { min: 6, max: 12, suggested: 'Ideal for 8–12 players (parties)' },
    tcg: { min: 2, max: 32, suggested: '2–4 per match; area seats up to 32' },
    workshop: { min: 2, max: 12, suggested: 'Ideal for 4–8 painters' }
  };

  const BOARD_GAMES = [
    { id: 'g1', title: 'Catan', category: 'Strategy', players: '3-4', age: '10+', duration: '60-90 min', difficulty: 3, price: 12, deposit: 50, available: true, popularity: 98, image: 'images/games/catan-board-game.jpg' },
    { id: 'g2', title: 'Ticket to Ride', category: 'Family', players: '2-5', age: '8+', duration: '45-60 min', difficulty: 2, price: 10, deposit: 40, available: true, popularity: 95, image: 'images/games/ticket-to-ride.jpg' },
    { id: 'g3', title: 'Codenames', category: 'Party', players: '4-8', age: '14+', duration: '15 min', difficulty: 1, price: 8, deposit: 25, available: true, popularity: 92, image: 'images/games/codenames.jpg' },
    { id: 'g4', title: 'Pandemic', category: 'Coop', players: '2-4', age: '8+', duration: '45 min', difficulty: 3, price: 11, deposit: 45, available: false, popularity: 90, image: 'images/games/pandemic.jpg' },
    { id: 'g5', title: 'Exploding Kittens', category: 'Card', players: '2-5', age: '7+', duration: '15 min', difficulty: 1, price: 7, deposit: 20, available: true, popularity: 88, image: 'images/games/exploding-kittens.jpg' },
    { id: 'g6', title: 'Betrayal at House on the Hill', category: 'Mystery', players: '3-6', age: '12+', duration: '60 min', difficulty: 4, price: 14, deposit: 55, available: true, popularity: 85, image: 'images/games/Betrayal-at-House-on-the-Hill.jpg' },
    { id: 'g7', title: 'Gloomhaven', category: 'Fantasy', players: '1-4', age: '14+', duration: '120+ min', difficulty: 5, price: 18, deposit: 80, available: true, popularity: 94, image: 'images/games/gloomhaven.jpg' },
    { id: 'g8', title: 'Azul', category: 'Strategy', players: '2-4', age: '8+', duration: '30-45 min', difficulty: 2, price: 9, deposit: 35, available: true, popularity: 91, image: 'images/games/azul.jpg' },
    { id: 'g9', title: 'Wingspan', category: 'Strategy', players: '1-5', age: '10+', duration: '40-70 min', difficulty: 3, price: 13, deposit: 50, available: true, popularity: 96, image: 'images/games/wingspan.jpg' },
    { id: 'g10', title: 'Scrabble', category: 'Edu', players: '2-4', age: '8+', duration: '60 min', difficulty: 2, price: 8, deposit: 30, available: true, popularity: 80, image: 'images/games/scrabble.jpg' },
    { id: 'g11', title: 'Dixit', category: 'Party', players: '3-6', age: '8+', duration: '30 min', difficulty: 1, price: 9, deposit: 30, available: true, popularity: 87, image: 'images/games/dixit.jpg' },
    { id: 'g12', title: 'Spirit Island', category: 'Coop', players: '1-4', age: '13+', duration: '90-120 min', difficulty: 5, price: 16, deposit: 70, available: false, popularity: 89, image: 'images/games/spirit-island.jpg' }
  ];

  const PRODUCTS = [
    { id: 'p1', title: 'Pokémon Scarlet & Violet Booster Box', category: 'Pokemon', price: 189, stock: 12, discount: 0, rating: 4.5, image: 'images/products/Pokemon-TCG.jpg' },
    { id: 'p2', title: 'Yu-Gi-Oh! Structure Deck', category: 'YuGiOh', price: 45, stock: 25, discount: 10, rating: 4.0, image: 'images/products/Yu-Gi-Oh!.jpg' },
    { id: 'p3', title: 'MTG Commander Deck — Murders at Karlov Manor', category: 'MTG', price: 165, stock: 8, discount: 0, rating: 3.5, image: 'images/products/MTG-murder.jpg' },
    { id: 'p4', title: 'One Piece TCG Starter Deck', category: 'OnePiece', price: 55, stock: 3, discount: 0, rating: 4.7, image: 'images/products/One-Piece-TCG.jpg' },
    { id: 'p5', title: 'Disney Lorcana Illumineer\'s Trove', category: 'Lorcana', price: 220, stock: 15, discount: 15, rating: 4.0, image: 'images/products/disney-lorcana-shimmering.jpg' },
    { id: 'p6', title: 'Chessex 7-Dice Set — Gemini', category: 'Dice', price: 28, stock: 50, discount: 0, rating: 4.6, image: 'images/products/Chessex-7.jpg' },
    { id: 'p7', title: 'Dragon Shield Matte Sleeves (100)', category: 'Sleeves', price: 35, stock: 40, discount: 0, rating: 3.0, image: 'images/products/Dragon-Shield-Matte-Sleeves.jpg' },
    { id: 'p8', title: 'Ultimate Guard Boulder Deck Box', category: 'DeckBoxes', price: 42, stock: 20, discount: 5, rating: 4.0, image: 'images/products/Ultimate-Guard-Boulder.jpg' },
    { id: 'p9', title: 'Custom Art Playmat — Dragon\'s Lair', category: 'Playmats', price: 89, stock: 10, discount: 0, rating: 5.0, image: 'images/products/Custom-Art-Playmat.jpg' },
    { id: 'p10', title: 'Warhammer 40K Intercessors Squad', category: 'Miniatures', price: 145, stock: 6, discount: 0, rating: 5.0, image: 'images/products/Warhammer-Intercessors-Squad.jpg' },
    { id: 'p11', title: 'Citadel Base Paint Set (12 colours)', category: 'Paints', price: 120, stock: 14, discount: 0, rating: 5.0, image: 'images/products/Paint-Set.jpg' },
    { id: 'p12', title: 'Pokémon Elite Trainer Box', category: 'Pokemon', price: 95, stock: 2, discount: 0, rating: 4.5, image: 'images/products/Pokémon-Elite.jpg' }
  ];

  const EVENTS = [
    { id: 'e1', title: 'Friday Night Magic', date: '2026-08-01T19:00:00', fee: 25, seats: 32, seatsLeft: 3, type: 'TCG', skill: 'Intermediate', prize: 'RM 500', status: 'almost', image: 'images/events/Friday-Night-Magic.jpg' },
    { id: 'e2', title: 'Beginner Board Game Night', date: '2026-08-05T18:00:00', fee: 0, seats: 20, seatsLeft: 12, type: 'Board Game', skill: 'Beginner', prize: 'Prizes & Fun', status: 'open', image: 'images/events/family-board-game-night.jpg' },
    { id: 'e3', title: 'Yu-Gi-Oh! Regional Qualifier', date: '2026-08-10T10:00:00', fee: 50, seats: 64, seatsLeft: 0, type: 'TCG', skill: 'Pro', prize: 'RM 2,000', status: 'soldout', image: 'images/events/Regional-Qualifier.jpg' },
    { id: 'e4', title: 'Miniature Painting Workshop', date: '2026-08-12T14:00:00', fee: 35, seats: 12, seatsLeft: 5, type: 'Workshop', skill: 'Beginner', prize: 'Take home mini', status: 'open', image: 'images/events/painter.jpg' },
    { id: 'e5', title: 'Catan Championship', date: '2026-07-20T13:00:00', fee: 30, seats: 16, seatsLeft: 0, type: 'Board Game', skill: 'Advanced', prize: 'RM 300', status: 'completed', image: 'images/games/catan-board-game.jpg' },
    { id: 'e6', title: 'Pokémon League Cup', date: '2026-08-15T11:00:00', fee: 40, seats: 48, seatsLeft: 18, type: 'TCG', skill: 'Intermediate', prize: 'RM 800', status: 'open', image: 'images/events/Pokémon-League-Cup.jpg' }
  ];

  const TEAM = [
    { id: 't1', name: 'Marcus Chen', role: 'Co-Founder & GM', bio: 'Strategy game enthusiast with 15 years in hospitality. Marcus curates our game library and runs weekly strategy nights.', image: 'images/team/marcus.jpg' },
    { id: 't2', name: 'Priya Sharma', role: 'Co-Founder & Events Director', bio: 'Former pro TCG player who brings tournament expertise and community-building passion to every event.', image: 'images/team/priya.jpg' },
    { id: 't3', name: 'Alex Rivera', role: 'Retail Manager', bio: 'Hobby boutique expert specializing in TCG singles, sealed product, and miniature supplies.', image: 'images/team/Alex.jpg' },
    { id: 't4', name: 'Jamie Ong', role: 'Floor Manager', bio: 'Keeps the lounge running smoothly — table assignments, game rentals, and first-time visitor tours.', image: 'images/team/Jamie.jpg' }
  ];

  const FAQ_DATA = [
    { id: 'f1', category: 'Rentals', q: 'How do game rentals work?', a: 'Choose a game from our catalogue, pay the daily rental fee plus a refundable deposit. Return all pieces intact before closing time.' },
    { id: 'f2', category: 'Rentals', q: 'Can I reserve a game in advance?', a: 'Yes! Add game rentals when booking your table online, or call us to hold a specific title.' },
    { id: 'f3', category: 'Late Charges', q: 'What happens if I return a game late?', a: 'Late returns incur RM 5 per hour after closing. After 24 hours, the full deposit may be retained.' },
    { id: 'f4', category: 'Damage', q: 'What if a game piece is missing?', a: 'Report damage immediately. Minor wear is expected; missing pieces are charged at replacement cost from your deposit.' },
    { id: 'f5', category: 'Cancellations', q: 'What is your cancellation policy?', a: 'Cancel 24+ hours before your booking for a full refund. Within 24 hours, 50% is retained.' },
    { id: 'f6', category: 'Food/Drink', q: 'Can I bring outside food?', a: 'Outside food is welcome at standard tables. TCG tournament areas are drink-free; snacks from our bar are encouraged.' },
    { id: 'f7', category: 'Payments', q: 'What payment methods do you accept?', a: 'We accept credit/debit cards, FPX online banking, Touch \'n Go, GrabPay, and QR payments.' },
    { id: 'f8', category: 'Payments', q: 'Do members get discounts?', a: 'Bronze 5%, Silver 10%, Gold 20% off rentals and retail. Gold members get priority booking.' }
  ];

  const REVIEWS = [
    { id: 'r1', author: 'Sarah L.', rating: 5, date: '2026-07-15', text: 'Best game lounge in KL! Huge selection and super friendly staff. The private room was perfect for our birthday party.', activity: 'Private Booking' },
    { id: 'r2', author: 'Ahmad K.', rating: 5, date: '2026-07-10', text: 'Friday Night Magic is always well-organized. Great prize support and a welcoming community for new players.', activity: 'TCG Tournament' },
    { id: 'r3', author: 'Emily T.', rating: 4, date: '2026-07-05', text: 'Love the rental system — tried 3 new games in one evening. Wingspan is now on my buy list!', activity: 'Board Game Night' },
    { id: 'r4', author: 'David W.', rating: 5, date: '2026-06-28', text: 'The painting workshop was fantastic. Bought all my supplies here too. Knowledgeable staff.', activity: 'Workshop' }
  ];

  const GALLERY = [
    { id: 'ph1', src: 'images/gallery/boardgame-night-1.jpg', tag: 'Board Game Nights', caption: 'Weekly game night crowd' },
    { id: 'ph2', src: 'images/gallery/TCG-Tournament-1.jpg', tag: 'TCG Tournaments', caption: 'Friday Night Magic finals' },
    { id: 'ph3', src: 'images/gallery/Workshops.jpg', tag: 'Workshops', caption: 'Miniature painting session' },
    { id: 'ph4', src: 'images/gallery/Private-Bookings.jpg', tag: 'Private Bookings', caption: 'Birthday party in private room' },
    { id: 'ph5', src: 'images/gallery/boardgame-night-2.jpg', tag: 'Board Game Nights', caption: 'Strategy game showdown' },
    { id: 'ph6', src: 'images/gallery/TCG-Tournaments.jpg', tag: 'TCG Tournaments', caption: 'Pokémon League Cup' }
  ];

  const FLOOR_AREAS = [
    { id: 'reception', name: 'Reception', grid: '1/2 / 1/3', status: 'available', bookable: false, capacity: '—', maxPlayers: 0, suggestedPlayers: 'Check-in desk', price: '—', facilities: 'Check-in, day passes, membership sign-up', rules: 'Please check in upon arrival.' },
    { id: 'retail', name: 'Retail Store', grid: '1/2 / 3/7', status: 'available', bookable: false, capacity: '—', maxPlayers: 0, suggestedPlayers: 'Walk-through shopping', price: '—', facilities: 'TCG singles, sealed product, hobby supplies', rules: 'Ask staff for assistance with high-value items.' },
    { id: 'std1', name: 'Standard Table 1', grid: '2/3 / 1/2', status: 'occupied', bookable: true, tableType: 'standard', capacity: '4-6', maxPlayers: 6, suggestedPlayers: 'Ideal: 4 players', price: 'RM 15/hr', facilities: 'Power outlets, cup holders', rules: 'Snacks allowed with coasters.' },
    { id: 'std2', name: 'Standard Table 2', grid: '2/3 / 2/3', status: 'available', bookable: true, tableType: 'standard', capacity: '4-6', maxPlayers: 6, suggestedPlayers: 'Ideal: 4–6 players', price: 'RM 15/hr', facilities: 'Power outlets, cup holders', rules: 'Snacks allowed with coasters.' },
    { id: 'std3', name: 'Standard Table 3', grid: '2/3 / 3/4', status: 'available', bookable: true, tableType: 'standard', capacity: '4-6', maxPlayers: 6, suggestedPlayers: 'Ideal: 4–6 players', price: 'RM 15/hr', facilities: 'Power outlets, cup holders', rules: 'Snacks allowed with coasters.' },
    { id: 'prem1', name: 'Premium Table 1', grid: '2/3 / 4/5', status: 'available', bookable: true, tableType: 'premium', capacity: '6-8', maxPlayers: 8, suggestedPlayers: 'Ideal: 6–8 players', price: 'RM 25/hr', facilities: 'Leather seating, dedicated lighting', rules: 'Reserved for groups of 4+.' },
    { id: 'prem2', name: 'Premium Table 2', grid: '2/3 / 5/6', status: 'occupied', bookable: true, tableType: 'premium', capacity: '6-8', maxPlayers: 8, suggestedPlayers: 'Ideal: 6–8 players', price: 'RM 25/hr', facilities: 'Leather seating, dedicated lighting', rules: 'Reserved for groups of 4+.' },
    { id: 'tcg', name: 'TCG Tournament Area', grid: '3/4 / 1/5', status: 'available', bookable: true, tableType: 'tcg', capacity: '32', maxPlayers: 32, suggestedPlayers: '2–4 per match; up to 32 seated', price: 'RM 20/hr', facilities: 'Tournament timers, playmats provided', rules: 'No food or drinks on tables.' },
    { id: 'private', name: 'Private Room', grid: '3/4 / 5/7', status: 'available', bookable: true, tableType: 'private', capacity: '8-12', maxPlayers: 12, suggestedPlayers: 'Ideal: 8–12 for parties', price: 'RM 50/hr', facilities: 'Soundproof, AV screen, mini fridge', rules: 'Book 48hrs ahead for parties.' },
    { id: 'paint', name: 'Painting Zone', grid: '4/5 / 1/3', status: 'available', bookable: true, tableType: 'workshop', capacity: '12', maxPlayers: 12, suggestedPlayers: 'Ideal: 4–8 painters', price: 'RM 18/hr', facilities: 'Airbrush booth, tool rental', rules: 'Ventilation on at all times.' },
    { id: 'lounge', name: 'Lounge', grid: '4/5 / 3/6', status: 'available', bookable: false, capacity: '20', maxPlayers: 20, suggestedPlayers: 'Casual groups of 2–6', price: 'Free', facilities: 'Sofas, magazines, casual play', rules: 'Quiet conversation area.' },
    { id: 'restroom', name: 'Restrooms', grid: '4/5 / 6/7', status: 'available', bookable: false, capacity: '—', maxPlayers: 0, suggestedPlayers: '—', price: '—', facilities: 'Accessible facilities', rules: '—' },
    { id: 'snack', name: 'Snack Bar', grid: '5/6 / 1/4', status: 'available', bookable: false, capacity: '—', maxPlayers: 0, suggestedPlayers: '—', price: '—', facilities: 'Drinks, snacks, microwave', rules: 'No outside alcohol.' }
  ];

  const TABLE_TYPE_AREAS = {
    standard: ['std1', 'std2', 'std3'],
    premium: ['prem1', 'prem2'],
    private: ['private'],
    tcg: ['tcg'],
    workshop: ['paint']
  };

  const MAX_GAME_SLOTS = 5;

  const TABLE_RATES = { standard: 15, premium: 25, private: 50, tcg: 20, workshop: 18 };

  const MEMBERSHIP_TIERS = [
    { id: 'bronze', name: 'Bronze', monthly: 29, yearly: 278, color: 'tier-bronze', benefits: ['5% off rentals & retail', '1 free rental/month', 'Newsletter perks', 'Member events access'] },
    { id: 'silver', name: 'Silver', monthly: 49, yearly: 470, color: 'tier-silver', featured: false, benefits: ['10% off rentals & retail', '3 free rentals/month', 'Priority booking', 'Free workshop entry (1/mo)', 'Birthday bonus game'] },
    { id: 'gold', name: 'Gold', monthly: 79, yearly: 758, color: 'tier-gold', featured: true, benefits: ['20% off rentals & retail', 'Unlimited free rentals', 'Priority booking + private room discount', 'All workshops free', 'Exclusive tournament invites', '2hr free parking'] }
  ];

  const COMPARISON_FEATURES = [
    { feature: 'Rental Discount', bronze: '5%', silver: '10%', gold: '20%' },
    { feature: 'Free Rentals/Month', bronze: '1', silver: '3', gold: 'Unlimited' },
    { feature: 'Priority Booking', bronze: '—', silver: '✓', gold: '✓' },
    { feature: 'Workshop Access', bronze: '—', silver: '1 free/mo', gold: 'Unlimited' },
    { feature: 'Parking', bronze: '—', silver: '—', gold: '2hr free' }
  ];

  const PROMO_CODES = { WELCOME10: 0.1, TAVERN20: 0.2, GUILD15: 0.15 };

  const MEMBERSHIP_PERKS = {
    bronze: { discount: 0.05, freeRentals: 1, freeWorkshops: 0, priority: false, privateDiscount: 0, parking: false },
    silver: { discount: 0.10, freeRentals: 3, freeWorkshops: 1, priority: true, privateDiscount: 0, parking: false },
    gold: { discount: 0.20, freeRentals: Infinity, freeWorkshops: Infinity, priority: true, privateDiscount: 0.10, parking: true }
  };

  // ─── State ────────────────────────────────────────────────────────────

  const state = {
    cart: [],
    wishlist: [],
    compare: [],
    promoCode: null,
    promoDiscount: 0,
    theme: 'dark',
    selectedRentalId: null,
    faqVotes: {},
    visitorChecklist: [],
    billingYearly: false,
    membership: null
  };

  // ─── Storage ──────────────────────────────────────────────────────────

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem('tavernState') || '{}');
      if (saved.cart) state.cart = saved.cart;
      if (saved.wishlist) state.wishlist = saved.wishlist;
      if (saved.theme) state.theme = saved.theme;
      if (saved.faqVotes) state.faqVotes = saved.faqVotes;
      if (saved.visitorChecklist) state.visitorChecklist = saved.visitorChecklist;
      if (saved.selectedRentalId) state.selectedRentalId = saved.selectedRentalId;
      if (saved.membership) state.membership = saved.membership;
      ensureMembershipPeriod();
    } catch (_) { /* ignore corrupt storage */ }
  }

  function saveState() {
    localStorage.setItem('tavernState', JSON.stringify({
      cart: state.cart,
      wishlist: state.wishlist,
      theme: state.theme,
      faqVotes: state.faqVotes,
      visitorChecklist: state.visitorChecklist,
      selectedRentalId: state.selectedRentalId,
      membership: state.membership
    }));
  }

  // ─── Membership perks ─────────────────────────────────────────────────

  function ensureMembershipPeriod() {
    if (!state.membership) return;
    const period = new Date().toISOString().slice(0, 7);
    if (state.membership.periodStart !== period) {
      state.membership.periodStart = period;
      state.membership.freeRentalsUsed = 0;
      state.membership.freeWorkshopsUsed = 0;
    }
  }

  function getMembershipPerks() {
    ensureMembershipPeriod();
    const tier = state.membership?.tier;
    return tier ? MEMBERSHIP_PERKS[tier] : null;
  }

  function getMembershipDiscount() {
    return getMembershipPerks()?.discount || 0;
  }

  function getFreeRentalsRemaining() {
    const perks = getMembershipPerks();
    if (!perks || !state.membership) return 0;
    if (state.membership.tier === 'gold') return Infinity;
    return Math.max(0, perks.freeRentals - (state.membership.freeRentalsUsed || 0));
  }

  function canUseFreeWorkshop() {
    const perks = getMembershipPerks();
    if (!perks || !state.membership || !perks.freeWorkshops) return false;
    if (state.membership.tier === 'gold') return true;
    return (state.membership.freeWorkshopsUsed || 0) < perks.freeWorkshops;
  }

  function calculateBookingCosts() {
    const duration = Number($('#book-duration')?.value || 2);
    const tableType = $('#book-table-type')?.value || 'standard';
    const baseRate = TABLE_RATES[tableType] || 15;
    const discount = getMembershipDiscount();
    const perks = getMembershipPerks();

    const tableCostBefore = baseRate * duration;
    let tableCost = tableCostBefore;
    let workshopFree = false;

    if (tableType === 'workshop' && canUseFreeWorkshop()) {
      tableCost = 0;
      workshopFree = true;
    } else {
      tableCost = tableCostBefore * (1 - discount);
      if (tableType === 'private' && perks?.privateDiscount) {
        tableCost *= (1 - perks.privateDiscount);
      }
    }

    const selectedGames = getSelectedBookingGames();
    let freeLeft = getFreeRentalsRemaining();
    const unlimitedFree = state.membership?.tier === 'gold';
    let freeRentalsApplied = 0;

    const gameBreakdown = selectedGames.map(g => {
      let price = g.price;
      let free = false;
      if (unlimitedFree || freeLeft > 0) {
        price = 0;
        free = true;
        freeRentalsApplied++;
        if (!unlimitedFree) freeLeft--;
      } else if (discount) {
        price = g.price * (1 - discount);
      }
      return { game: g, price, free };
    });

    const gamesCost = gameBreakdown.reduce((sum, x) => sum + x.price, 0);
    const gamesCostBefore = selectedGames.reduce((sum, g) => sum + g.price, 0);
    const depositTotal = selectedGames.reduce((sum, g) => sum + g.deposit, 0);
    const memberSavings = (tableCostBefore - tableCost) + (gamesCostBefore - gamesCost);

    return {
      duration,
      tableType,
      tableCost,
      gamesCost,
      depositTotal,
      memberSavings,
      freeRentalsApplied,
      workshopFree,
      priority: !!perks?.priority,
      parking: !!perks?.parking,
      gameBreakdown
    };
  }

  function renderMemberBadge() {
    const actions = $('.header-actions');
    if (!actions) return;
    let badge = $('#member-badge');
    if (!state.membership) {
      badge?.remove();
      return;
    }
    const tier = MEMBERSHIP_TIERS.find(t => t.id === state.membership.tier);
    if (!badge) {
      badge = document.createElement('span');
      badge.id = 'member-badge';
      badge.className = 'member-badge';
      actions.insertBefore(badge, actions.firstChild);
    }
    badge.textContent = tier ? `${tier.name} Member` : 'Member';
    badge.title = `${getMembershipDiscount() * 100}% member discount active`;
  }

  function renderMemberStatus() {
    const el = $('#member-status');
    if (!el) return;
    if (!state.membership) {
      el.innerHTML = '';
      el.classList.add('hidden');
      return;
    }
    const tier = MEMBERSHIP_TIERS.find(t => t.id === state.membership.tier);
    const perks = MEMBERSHIP_PERKS[state.membership.tier];
    const freeLeft = state.membership.tier === 'gold' ? 'Unlimited' : getFreeRentalsRemaining();
    const workshopLeft = state.membership.tier === 'gold'
      ? 'Unlimited'
      : Math.max(0, perks.freeWorkshops - (state.membership.freeWorkshopsUsed || 0));

    el.classList.remove('hidden');
    el.innerHTML = `
      <div class="member-status-card ${tier?.color || ''}">
        <h3>Your ${tier?.name || ''} Membership</h3>
        <p class="member-since">Active perks apply automatically at checkout and booking.</p>
        <ul class="member-perks-list">
          <li>${perks.discount * 100}% off rentals &amp; retail</li>
          <li>Free rentals left this month: <strong>${freeLeft}</strong></li>
          ${perks.freeWorkshops ? `<li>Free workshops left: <strong>${workshopLeft}</strong></li>` : ''}
          ${perks.priority ? '<li>Priority booking</li>' : ''}
          ${perks.privateDiscount ? `<li>${perks.privateDiscount * 100}% off private rooms</li>` : ''}
          ${perks.parking ? '<li>2hr free parking on visits</li>' : ''}
        </ul>
      </div>`;
  }

  // ─── Utilities ────────────────────────────────────────────────────────

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  function formatRM(n) {
    return `RM ${n.toFixed(2)}`;
  }

  function difficultyDots(level) {
    return Array.from({ length: 5 }, (_, i) =>
      `<span class="${i < level ? 'filled' : ''}"></span>`
    ).join('');
  }

  function stars(n) {
    return '★'.repeat(Math.floor(n)) + (n % 1 >= 0.5 ? '½' : '') + '☆'.repeat(5 - Math.ceil(n));
  }

  function parseGrid(grid) {
    const [row, col] = grid.split(' / ');
    const [rs, re] = row.split('/').map(Number);
    const [cs, ce] = col.split('/').map(Number);
    return { gridRow: `${rs} / ${re}`, gridColumn: `${cs} / ${ce}` };
  }

  function showModal(title, bodyHTML) {
    const modal = $('#modal');
    $('#modal-title').textContent = title;
    $('#modal-body').innerHTML = bodyHTML;
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    $('#modal').classList.add('hidden');
    document.body.style.overflow = '';
  }

  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3500);
  }

  function eventStatusClass(status) {
    return { open: 'status-open', almost: 'status-almost', soldout: 'status-soldout', completed: 'status-completed' }[status] || '';
  }

  function eventStatusLabel(status) {
    return { open: 'Open', almost: 'Almost Full', soldout: 'Sold Out', completed: 'Completed' }[status] || status;
  }

  // ─── Navigation ───────────────────────────────────────────────────────

  function getCurrentPage() {
    return document.body.dataset.page || 'home';
  }

  function initNavigation() {
    const navToggle = $('#nav-toggle');
    const mainNav = $('#main-nav');

    navToggle?.addEventListener('click', () => {
      const open = mainNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open);
    });

    $$('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    const sections = $$('section[id]');
    if (getCurrentPage() === 'home' && sections.length) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            $$('.nav-link').forEach(l => l.classList.remove('active'));
            const link = $(`.nav-link[href="#${entry.target.id}"], .nav-link[href="index.html#${entry.target.id}"]`);
            link?.classList.add('active');
          }
        });
      }, { rootMargin: '-40% 0px -50% 0px' });
      sections.forEach(s => observer.observe(s));
    }
  }

  // ─── Theme ────────────────────────────────────────────────────────────

  function updateIconTooltips() {
    const themeBtn = $('#theme-toggle');
    if (themeBtn) {
      themeBtn.dataset.tooltip = state.theme === 'dark' ? 'Light theme' : 'Dark theme';
    }
    const musicBtn = $('#music-toggle');
    if (musicBtn) {
      const playing = musicBtn.getAttribute('aria-pressed') === 'true';
      musicBtn.dataset.tooltip = playing ? 'Pause music' : 'Play music';
    }
    const cartBtn = $('#cart-toggle');
    if (cartBtn) cartBtn.dataset.tooltip = 'Shopping cart';
  }

  function initIconTooltips() {
    updateIconTooltips();
  }

  function initTheme() {
    document.documentElement.setAttribute('data-theme', state.theme);
    $('#theme-toggle').textContent = state.theme === 'dark' ? '🌙' : '☀️';
    updateIconTooltips();

    $('#theme-toggle')?.addEventListener('click', () => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', state.theme);
      $('#theme-toggle').textContent = state.theme === 'dark' ? '🌙' : '☀️';
      updateIconTooltips();
      saveState();
    });
  }

  // ─── Background Music ─────────────────────────────────────────────────

  const MUSIC_SRC = 'audio/alex-morgan-jazz-restaurant-music-556244.mp3';

  function initMusic() {
    const btn = $('#music-toggle');
    if (!btn) return;

    let bgAudio = $('#bg-music');
    if (!bgAudio) {
      bgAudio = document.createElement('audio');
      bgAudio.id = 'bg-music';
      bgAudio.preload = 'auto';
      bgAudio.loop = true;
      bgAudio.src = MUSIC_SRC;
      document.body.appendChild(bgAudio);
    }

    bgAudio.volume = 0.55;
    let playing = false;
    let userPaused = localStorage.getItem('tavernMusic') === 'off';

    function updateBtn() {
      btn.textContent = playing ? '⏸️' : '🎵';
      btn.setAttribute('aria-pressed', String(playing));
      btn.setAttribute('aria-label', playing ? 'Pause background music' : 'Play background music');
      updateIconTooltips();
    }

    function stopMusic() {
      bgAudio.pause();
      playing = false;
      updateBtn();
    }

    async function startMusic() {
      if (playing) return true;
      try {
        await bgAudio.play();
        playing = true;
        localStorage.setItem('tavernMusic', 'on');
        userPaused = false;
        updateBtn();
        return true;
      } catch (err) {
        console.warn('Music autoplay blocked or failed:', err);
        return false;
      }
    }

    btn.addEventListener('click', () => {
      if (playing) {
        stopMusic();
        localStorage.setItem('tavernMusic', 'off');
        userPaused = true;
      } else {
        startMusic();
      }
    });

    async function tryAutoplay() {
      if (userPaused) return;
      await startMusic();
    }

    updateBtn();

    if (!userPaused) {
      tryAutoplay();
      const unlock = () => {
        if (!playing && !userPaused) tryAutoplay();
      };
      ['pointerdown', 'keydown', 'touchstart', 'click', 'scroll'].forEach(evt => {
        document.addEventListener(evt, unlock, { once: true, passive: true });
      });
    }
  }
  // ─── Accordions ─────────────────────────────────────────────────────────

  function initAccordions() {
    document.addEventListener('click', e => {
      const trigger = e.target.closest('.accordion-trigger');
      if (!trigger) return;
      const item = trigger.closest('.accordion-item');
      const expanded = trigger.getAttribute('aria-expanded') === 'true';
      trigger.setAttribute('aria-expanded', !expanded);
      item.classList.toggle('open', !expanded);
    });
  }

  // ─── Board Games / Rentals ──────────────────────────────────────────────

  function getFilteredGames() {
    const search = ($('#rental-search')?.value || '').toLowerCase();
    const category = $('#rental-category')?.value || '';
    const difficulty = $('#rental-difficulty')?.value || '';
    const players = $('#rental-players')?.value || '';
    const availableOnly = $('#rental-available')?.checked;
    const sort = $('#rental-sort')?.value || 'popularity';

    let games = BOARD_GAMES.filter(g => {
      if (search && !g.title.toLowerCase().includes(search) && !g.category.toLowerCase().includes(search)) return false;
      if (category && g.category !== category) return false;
      if (difficulty && g.difficulty !== Number(difficulty)) return false;
      if (players) {
        const min = parseInt(g.players);
        if (players === '2' && min > 2) return false;
        if (players === '3' && min > 3) return false;
        if (players === '4' && min > 4) return false;
        if (players === '6' && !g.players.includes('6') && !g.players.includes('8')) return false;
      }
      if (availableOnly && !g.available) return false;
      return true;
    });

    if (sort === 'price-asc') games.sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') games.sort((a, b) => b.price - a.price);
    else games.sort((a, b) => b.popularity - a.popularity);

    return games;
  }

  function renderGameCard(game) {
    const detailUrl = `rental-detail.html?id=${game.id}`;
    const wished = state.wishlist.includes(game.id);
    return `
      <article class="game-card" data-id="${game.id}">
        <div class="card-img-wrap">
          <button type="button" class="wishlist-btn card-wishlist-overlay ${wished ? 'active' : ''}" data-id="${game.id}" aria-label="Add ${game.title} to favourites">${wished ? '❤️' : '🤍'}</button>
          <a href="${detailUrl}" class="game-card-link card-img-link" aria-label="View ${game.title} details">
            <img src="${game.image}" alt="${game.title} board game" loading="lazy">
            <span class="card-badge ${game.available ? 'badge-available' : 'badge-unavailable'}">${game.available ? 'Available' : 'Rented'}</span>
          </a>
        </div>
        <div class="card-body">
          <a href="${detailUrl}" class="game-card-link"><h3>${game.title}</h3></a>
          <p class="card-meta">
            <span>${game.category}</span>
            <span>👥 ${game.players}</span>
            <span>⏱ ${game.duration}</span>
          </p>
          <p class="card-meta">Age: ${game.age} · Difficulty: <span class="difficulty-dots">${difficultyDots(game.difficulty)}</span></p>
          <p class="card-price">${formatRM(game.price)}/day <small class="deposit-note">+ ${formatRM(game.deposit)} deposit</small></p>
          <div class="card-actions">
            <button class="btn btn-primary btn-sm rent-btn" data-id="${game.id}" ${!game.available ? 'disabled' : ''}>Rent Game</button>
            <button type="button" class="btn btn-outline btn-sm select-calc-btn" data-id="${game.id}">Calculator</button>
          </div>
        </div>
      </article>`;
  }

  function scrollToCalculator(gameId) {
    if (gameId) {
      state.selectedRentalId = gameId;
      saveState();
    }
    const calcSelect = $('#calc-game');
    if (calcSelect && gameId) calcSelect.value = gameId;
    updateRentalCalculator();
    const calc = $('#rental-calculator');
    if (calc) {
      calc.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.location.href = `explore-book.html?calc=${gameId || state.selectedRentalId || ''}#rental-calculator`;
    }
  }

  function renderRentals() {
    const grid = $('#rental-grid');
    if (!grid) return;
    const games = getFilteredGames();
    grid.innerHTML = games.length
      ? games.map(g => renderGameCard(g)).join('')
      : '<p class="empty-state">No games match your filters.</p>';
    updateRentalCalculator();
    populateBookingGames();
  }

  function renderFeaturedGames() {
    const el = $('#featured-games');
    if (!el) return;
    const top = [...BOARD_GAMES].sort((a, b) => b.popularity - a.popularity).slice(0, 3);
    el.innerHTML = top.map(g => renderGameCard(g, true)).join('');
  }

  function populateCalcGameSelect() {
    const sel = $('#calc-game');
    if (!sel) return;
    const current = state.selectedRentalId || sel.value;
    sel.innerHTML = '<option value="">— Select a game —</option>' +
      BOARD_GAMES.filter(g => g.available)
        .map(g => `<option value="${g.id}">${g.title} — ${formatRM(g.price)}/day</option>`)
        .join('');
    if (current) sel.value = current;
  }

  function updateRentalCalculator() {
    const daysInput = $('#calc-days');
    let days = Number(daysInput?.value || 1);
    if (days < 1) days = 1;
    if (days > 30) days = 30;
    if (daysInput) daysInput.value = days;

    const calcSelect = $('#calc-game');
    const gameId = calcSelect?.value || state.selectedRentalId;
    if (calcSelect && gameId) calcSelect.value = gameId;

    const game = gameId ? BOARD_GAMES.find(g => g.id === gameId) : null;
    if (game) state.selectedRentalId = game.id;

    if (game) {
      const dailyRate = game.price * (1 - getMembershipDiscount());
      if ($('#calc-base')) $('#calc-base').textContent = formatRM(dailyRate);
      if ($('#calc-total')) $('#calc-total').textContent = formatRM(dailyRate * days);
      if ($('#calc-deposit')) $('#calc-deposit').textContent = formatRM(game.deposit);
      const note = $('#calc-member-note');
      if (note) {
        if (getMembershipDiscount()) {
          note.textContent = `Member ${getMembershipDiscount() * 100}% rental discount applied`;
          note.classList.remove('hidden');
        } else {
          note.classList.add('hidden');
        }
      }
    } else {
      if ($('#calc-base')) $('#calc-base').textContent = formatRM(0);
      if ($('#calc-total')) $('#calc-total').textContent = formatRM(0);
      if ($('#calc-deposit')) $('#calc-deposit').textContent = formatRM(0);
    }
  }

  function renderRentalDetailPage() {
    const container = $('#rental-detail-content');
    if (!container) return;
    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    const g = BOARD_GAMES.find(x => x.id === id);
    if (!g) {
      const bannerTitle = document.querySelector('.page-banner--detail h1');
      if (bannerTitle) bannerTitle.textContent = 'Game Not Found';
      container.innerHTML = '<p>Game not found. <a href="explore-book.html#rentals">Browse rentals</a></p>';
      return;
    }
    const bannerTitle = document.querySelector('.page-banner--detail h1');
    if (bannerTitle) bannerTitle.textContent = g.title;
    container.innerHTML = `
      <article class="rental-detail-layout">
        <img class="modal-detail-img" src="${g.image}" alt="${g.title}">
        <div class="rental-detail-info">
          <h1>${g.title}</h1>
          <span class="card-badge ${g.available ? 'badge-available' : 'badge-unavailable'}">${g.available ? 'Available' : 'Rented'}</span>
          <div class="modal-detail-grid">
            <div><strong>Category:</strong> ${g.category}</div>
            <div><strong>Players:</strong> ${g.players}</div>
            <div><strong>Age:</strong> ${g.age}</div>
            <div><strong>Duration:</strong> ${g.duration}</div>
            <div><strong>Difficulty:</strong> ${g.difficulty}/5</div>
            <div><strong>Rental:</strong> ${formatRM(g.price)}/day</div>
            <div><strong>Deposit:</strong> ${formatRM(g.deposit)}</div>
          </div>
          <p>Popular with ${g.popularity}% of our visitors. All games are sanitized between rentals.</p>
          <div class="card-actions">
            ${g.available ? `<button class="btn btn-primary rent-btn" data-id="${g.id}">Add to Booking</button>` : ''}
            <button class="btn btn-outline select-calc-btn" data-id="${g.id}">Open Calculator</button>
          </div>
        </div>
      </article>`;
  }

  function renderRoomPlayerGuide() {
    const el = $('#room-player-guide');
    if (!el) return;
    const bookable = FLOOR_AREAS.filter(a => a.bookable);
    el.innerHTML = `
      <h3>Suggested Players per Room</h3>
      <ul class="room-guide-list">
        ${bookable.map(a => `<li><strong>${a.name}</strong> — ${a.suggestedPlayers} (max ${a.maxPlayers})</li>`).join('')}
      </ul>`;
  }

  function validatePlayerCapacity() {
    const tableType = $('#book-table-type')?.value || 'standard';
    const players = Number($('#book-players')?.value || 0);
    const cap = TABLE_CAPACITY[tableType];
    const hint = $('#player-capacity-hint');
    const warn = $('#player-capacity-warning');
    if (!cap || !hint) return true;

    hint.textContent = `${cap.suggested} · Maximum ${cap.max} players`;
    hint.className = 'form-hint';

    if (players > cap.max) {
      if (warn) {
        warn.textContent = `⚠️ ${players} players exceeds the ${cap.max}-person limit for this table type. Please choose a larger room or reduce your group size.`;
        warn.classList.remove('hidden');
      }
      return false;
    }
    if (players < cap.min && players > 0) {
      if (warn) {
        warn.textContent = `Note: This table type works best with at least ${cap.min} players.`;
        warn.classList.remove('hidden');
      }
      return true;
    }
    warn?.classList.add('hidden');
    return true;
  }

  // ─── Shop / Products ────────────────────────────────────────────────────

  function getFilteredProducts() {
    const search = ($('#shop-search')?.value || '').toLowerCase();
    const category = $('#shop-category')?.value || '';
    const rangeVal = $('#price-range')?.value || '';
    let minPrice = 0;
    let maxPrice = 500;
    if (rangeVal) {
      const [min, max] = rangeVal.split('-').map(Number);
      minPrice = min;
      maxPrice = max;
    }

    return PRODUCTS.filter(p => {
      if (search && !p.title.toLowerCase().includes(search)) return false;
      if (category && p.category !== category) return false;
      const finalPrice = p.price * (1 - p.discount / 100);
      if (finalPrice < minPrice || finalPrice > maxPrice) return false;
      return true;
    });
  }

  function getProductPrice(p) {
    let price = p.price * (1 - p.discount / 100);
    const memberRate = getMembershipDiscount();
    if (memberRate) price *= (1 - memberRate);
    return price;
  }

  function getProductPriceBeforeMember(p) {
    return p.price * (1 - p.discount / 100);
  }

  function renderProductCard(p, showCompare = true) {
    const price = getProductPrice(p);
    const wished = state.wishlist.includes(p.id);
    const compared = state.compare.includes(p.id);
    return `
      <article class="product-card" data-id="${p.id}">
        <div class="card-img-wrap">
          <button type="button" class="wishlist-btn card-wishlist-overlay ${wished ? 'active' : ''}" data-id="${p.id}" aria-label="Add ${p.title} to favourites">${wished ? '❤️' : '🤍'}</button>
          <img src="${p.image}" alt="${p.title}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1613771404721-1e92d1e3d026?w=400&q=80'">
          ${p.discount ? `<span class="card-badge badge-discount">-${p.discount}%</span>` : ''}
          ${p.stock <= 5 ? `<span class="card-badge badge-stock">${p.stock <= 2 ? 'Low Stock' : 'Limited'}</span>` : ''}
        </div>
        <div class="card-body">
          <h3>${p.title}</h3>
          <p class="card-meta"><span>${p.category}</span> <span class="rating">${stars(p.rating)}</span></p>
          <p class="card-price">
            ${formatRM(price)}
            ${p.discount ? `<s style="font-size:0.8rem;color:var(--text-secondary)">${formatRM(p.price)}</s>` : ''}
          </p>
          <div class="card-actions">
            <button class="btn btn-primary btn-sm add-cart-btn" data-id="${p.id}">Add to Cart</button>
            ${showCompare ? `<button class="btn btn-outline btn-sm compare-btn" data-id="${p.id}">${compared ? '✓ Compare' : 'Compare'}</button>` : ''}
          </div>
        </div>
      </article>`;
  }

  function renderShop() {
    const grid = $('#shop-grid');
    if (!grid) return;
    const products = getFilteredProducts();
    grid.innerHTML = products.length
      ? products.map(renderProductCard).join('')
      : '<p class="empty-state">No products match your filters.</p>';
  }

  function renderFeaturedProducts() {
    const el = $('#featured-products');
    if (!el) return;
    const top = [...PRODUCTS].sort((a, b) => b.rating - a.rating).slice(0, 3);
    el.innerHTML = top.map(p => renderProductCard(p, false)).join('');
  }

  // ─── Cart ───────────────────────────────────────────────────────────────

  function addToCart(productId, qty = 1) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;
    const existing = state.cart.find(i => i.id === productId);
    if (existing) {
      existing.qty = Math.min(existing.qty + qty, product.stock);
    } else {
      state.cart.push({ id: productId, qty: Math.min(qty, product.stock) });
    }
    saveState();
    updateCartUI();
    showToast(`${product.title} added to cart`);
  }

  function removeFromCart(productId) {
    if (!confirm('Remove this item from your cart?')) return;
    state.cart = state.cart.filter(i => i.id !== productId);
    saveState();
    updateCartUI();
    renderCheckout();
    showToast('Item removed', 'info');
  }

  function updateCartQty(productId, delta) {
    const item = state.cart.find(i => i.id === productId);
    const product = PRODUCTS.find(p => p.id === productId);
    if (!item || !product) return;
    item.qty = Math.max(1, Math.min(item.qty + delta, product.stock));
    saveState();
    updateCartUI();
    renderCheckout();
  }

  function getCartSubtotal() {
    return state.cart.reduce((sum, item) => {
      const p = PRODUCTS.find(x => x.id === item.id);
      return sum + (p ? getProductPrice(p) * item.qty : 0);
    }, 0);
  }

  function getCartSubtotalBeforeMember() {
    return state.cart.reduce((sum, item) => {
      const p = PRODUCTS.find(x => x.id === item.id);
      return sum + (p ? getProductPriceBeforeMember(p) * item.qty : 0);
    }, 0);
  }

  function updateCartUI() {
    const count = state.cart.reduce((s, i) => s + i.qty, 0);
    const countEl = $('#cart-count');
    if (countEl) countEl.textContent = count;

    const itemsEl = $('#cart-items');
    if (!itemsEl) return;

    if (!state.cart.length) {
      itemsEl.innerHTML = '<div class="cart-empty-state"><p>Your cart is empty</p><a href="shop.html" class="btn btn-primary">Browse Shop</a></div>';
      $('#cart-subtotal').textContent = formatRM(0);
      return;
    }

    itemsEl.innerHTML = state.cart.map(item => {
      const p = PRODUCTS.find(x => x.id === item.id);
      if (!p) return '';
      const price = getProductPrice(p);
      return `
        <div class="cart-item" data-id="${item.id}">
          <img src="${p.image}" alt="">
          <div class="cart-item-info">
            <h4>${p.title}</h4>
            <p>${formatRM(price)} each</p>
            <div class="qty-control">
              <button class="qty-minus" data-id="${item.id}" aria-label="Decrease quantity">−</button>
              <span>${item.qty}</span>
              <button class="qty-plus" data-id="${item.id}" aria-label="Increase quantity">+</button>
            </div>
          </div>
          <div>
            <p><strong>${formatRM(price * item.qty)}</strong></p>
            <button class="cart-item-remove" data-id="${item.id}">Remove</button>
          </div>
        </div>`;
    }).join('');

    const subtotal = getCartSubtotal();
    const discount = subtotal * state.promoDiscount;
    $('#cart-subtotal').textContent = formatRM(subtotal - discount);
  }

  function initCart() {
    const panel = $('#cart-panel');
    const overlay = $('#cart-overlay');

    function openCart() {
      panel.classList.add('open');
      panel.setAttribute('aria-hidden', 'false');
      overlay.classList.remove('hidden');
    }

    function closeCart() {
      panel.classList.remove('open');
      panel.setAttribute('aria-hidden', 'true');
      overlay.classList.add('hidden');
    }

    $('#cart-toggle')?.addEventListener('click', openCart);
    $('#cart-close')?.addEventListener('click', closeCart);
    overlay?.addEventListener('click', closeCart);

    $('#cart-checkout')?.addEventListener('click', closeCart);

    $('#cart-empty')?.addEventListener('click', () => {
      if (!state.cart.length) return;
      if (confirm('Empty your entire cart?')) {
        state.cart = [];
        state.promoCode = null;
        state.promoDiscount = 0;
        saveState();
        updateCartUI();
        renderCheckout();
        showToast('Cart emptied', 'info');
      }
    });

    $('#cart-apply-promo')?.addEventListener('click', () => {
      const code = ($('#cart-promo')?.value || '').toUpperCase().trim();
      if (PROMO_CODES[code]) {
        state.promoCode = code;
        state.promoDiscount = PROMO_CODES[code];
        saveState();
        updateCartUI();
        showToast(`Promo ${code} applied!`);
      } else {
        showToast('Invalid promo code', 'error');
      }
    });
  }

  // ─── Compare ──────────────────────────────────────────────────────────

  function toggleCompare(id) {
    const idx = state.compare.indexOf(id);
    if (idx >= 0) state.compare.splice(idx, 1);
    else if (state.compare.length < 3) state.compare.push(id);
    else { showToast('Compare up to 3 products', 'error'); return; }
    renderShop();
    renderCompareDrawer();
    $('#compare-count').textContent = state.compare.length;
  }

  function closeCompareDrawer() {
    const drawer = $('#compare-drawer');
    drawer?.classList.remove('open');
    document.body.classList.remove('compare-open');
    state.compare = [];
    const countEl = $('#compare-count');
    if (countEl) countEl.textContent = '0';
    renderShop();
    const target = $('#shop-products') || $('#shop-grid');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function openCompareDrawer() {
    const drawer = $('#compare-drawer');
    if (!drawer || !state.compare.length) return;
    drawer.classList.add('open');
    document.body.classList.add('compare-open');
  }

  function renderCompareDrawer() {
    const drawer = $('#compare-drawer');
    const content = $('#compare-content');
    if (!drawer || !content) return;

    if (!state.compare.length) {
      drawer.classList.remove('open');
      document.body.classList.remove('compare-open');
      return;
    }

    openCompareDrawer();
    content.innerHTML = state.compare.map(id => {
      const p = PRODUCTS.find(x => x.id === id);
      if (!p) return '';
      return `
        <div class="compare-card">
          <img src="${p.image}" alt="" style="width:80px;height:80px;object-fit:cover;border-radius:8px;margin:0 auto 0.5rem" onerror="this.src='https://images.unsplash.com/photo-1613771404721-1e92d1e3d026?w=400&q=80'">
          <h4>${p.title}</h4>
          <p>${formatRM(getProductPrice(p))}</p>
          <p class="rating">${stars(p.rating)}</p>
          <p>Stock: ${p.stock}</p>
        </div>`;
    }).join('');
  }

  function initCompare() {
    $('#compare-toggle')?.addEventListener('click', () => {
      if (!state.compare.length) {
        showToast('Select products to compare first', 'info');
        return;
      }
      const drawer = $('#compare-drawer');
      const isOpen = drawer.classList.contains('open');
      if (isOpen) {
        drawer.classList.remove('open');
        document.body.classList.remove('compare-open');
      } else {
        openCompareDrawer();
      }
    });
    $('#compare-close')?.addEventListener('click', closeCompareDrawer);
  }

  // ─── Floor Plan (natural spatial mapping) ─────────────────────────────

  function hashAvailability(date, time, areaId) {
    return (date + time + areaId).split('').reduce((s, c) => s + c.charCodeAt(0), 0);
  }

  function getAreaAvailability(areaId, date, time) {
    if (!date || !time) return null;
    const area = FLOOR_AREAS.find(a => a.id === areaId);
    if (!area?.bookable) return 'non-bookable';
    return hashAvailability(date, time, areaId) % 3 === 0 ? 'occupied' : 'available';
  }

  function isTableTypeAvailable(tableType, date, time) {
    const ids = TABLE_TYPE_AREAS[tableType] || [];
    return ids.some(id => getAreaAvailability(id, date, time) === 'available');
  }

  function getPlanDateTime() {
    return {
      date: $('#plan-date')?.value || $('#book-date')?.value || '',
      time: $('#plan-time')?.value || $('#book-time')?.value || ''
    };
  }

  function renderFloorPlan() {
    const plan = $('#floor-plan');
    if (!plan) return;

    const { date, time } = getPlanDateTime();
    const hasSchedule = Boolean(date && time);

    plan.innerHTML = FLOOR_AREAS.map(area => {
      const pos = parseGrid(area.grid);
      let statusClass = area.bookable ? area.status : 'non-bookable';
      let statusLabel = area.bookable ? area.status : 'not for booking';

      if (area.bookable && hasSchedule) {
        const live = getAreaAvailability(area.id, date, time);
        statusClass = live;
        statusLabel = live;
      }

      const tag = !area.bookable
        ? '<span class="floor-area-tag">Not for booking</span>'
        : (hasSchedule ? `<span class="floor-area-tag">${statusLabel === 'available' ? 'Available' : 'Occupied'}</span>` : '');

      return `
        <button type="button" class="floor-area ${statusClass}${area.bookable ? '' : ' is-non-bookable'}"
          style="grid-row:${pos.gridRow};grid-column:${pos.gridColumn}"
          data-id="${area.id}"
          data-bookable="${area.bookable}"
          aria-label="${area.name} — ${statusLabel}">
          <span class="floor-area-name">${area.name}</span>
          ${tag}
        </button>`;
    }).join('');

    const hint = $('#floor-plan-hint');
    if (hint) {
      hint.textContent = hasSchedule
        ? `Showing availability for ${date} at ${time}. Green = available, red = occupied.`
        : 'Select a date and time below to see live availability on the map.';
    }
  }

  function initFloorPlan() {
    const planDate = $('#plan-date');
    const planTime = $('#plan-time');
    if (planDate) {
      planDate.min = new Date().toISOString().split('T')[0];
    }

    const refresh = () => renderFloorPlan();

    planDate?.addEventListener('change', refresh);
    planTime?.addEventListener('change', refresh);

    $('#book-date')?.addEventListener('change', () => {
      if (planDate && $('#book-date')?.value) planDate.value = $('#book-date').value;
      refresh();
    });
    $('#book-time')?.addEventListener('change', () => {
      if (planTime && $('#book-time')?.value) planTime.value = $('#book-time').value;
      refresh();
    });

    refresh();
  }

  function showFloorAreaDetail(id) {
    const area = FLOOR_AREAS.find(a => a.id === id);
    if (!area) return;

    const { date, time } = getPlanDateTime();
    let statusHtml = '';
    if (!area.bookable) {
      statusHtml = '<p><span class="floor-status-badge non-bookable">Not for booking</span></p><p class="form-hint">This area cannot be reserved online. Walk in or ask staff at reception.</p>';
    } else if (date && time) {
      const live = getAreaAvailability(area.id, date, time);
      statusHtml = `<p><strong>Availability (${date} ${time}):</strong> <span class="floor-status-badge ${live}">${live === 'available' ? 'Available' : 'Occupied'}</span></p>`;
    } else {
      statusHtml = '<p class="form-hint">Select date and time on the floor plan to check availability.</p>';
    }

    const bookBtn = area.bookable
      ? '<a href="#booking" class="btn btn-primary modal-close-link">Book a Table</a>'
      : '';

    showModal(area.name, `
      ${statusHtml}
      <p><strong>Capacity:</strong> ${area.capacity}</p>
      <p><strong>Suggested:</strong> ${area.suggestedPlayers}</p>
      ${area.maxPlayers ? `<p><strong>Max players:</strong> ${area.maxPlayers}</p>` : ''}
      <p><strong>Pricing:</strong> ${area.price}</p>
      <p><strong>Facilities:</strong> ${area.facilities}</p>
      <p><strong>House Rules:</strong> ${area.rules}</p>
      ${bookBtn}
    `);
    $$('.modal-close-link').forEach(l => l.addEventListener('click', closeModal));
  }

  // ─── FAQ ──────────────────────────────────────────────────────────────

  function renderFAQ() {
    const container = $('#faq-accordion');
    if (!container) return;

    const search = ($('#faq-search')?.value || '').toLowerCase();
    const category = $('#faq-category')?.value || '';

    const filtered = FAQ_DATA.filter(f => {
      if (search && !f.q.toLowerCase().includes(search) && !f.a.toLowerCase().includes(search)) return false;
      if (category && f.category !== category) return false;
      return true;
    });

    container.innerHTML = filtered.map(f => {
      const votes = state.faqVotes[f.id] || { yes: 0, no: 0 };
      return `
        <div class="accordion-item" data-faq="${f.id}">
          <button class="accordion-trigger" aria-expanded="false">${f.q} <small style="color:var(--text-secondary)">[${f.category}]</small></button>
          <div class="accordion-panel">
            <p class="faq-answer">${f.a}</p>
            <div class="faq-vote">
              <span>Was this helpful?</span>
              <button data-vote="yes" data-id="${f.id}">👍 Yes (${votes.yes})</button>
              <button data-vote="no" data-id="${f.id}">👎 No (${votes.no})</button>
            </div>
          </div>
        </div>`;
    }).join('') || '<p>No FAQ matches your search.</p>';
  }

  // ─── Reviews & Gallery ────────────────────────────────────────────────

  function renderReviews() {
    const slider = $('#reviews-slider');
    const grid = $('#all-reviews');
    const card = r => `
      <div class="review-card">
        <div class="review-stars">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</div>
        <p>"${r.text}"</p>
        <p class="review-author">${r.author}</p>
        <p class="review-date">${r.date} · ${r.activity}</p>
      </div>`;

    if (slider) slider.innerHTML = REVIEWS.map(card).join('');
    if (grid) grid.innerHTML = REVIEWS.map(card).join('');
  }

  function renderGallery(filter = 'all') {
    const gallery = $('#photo-gallery');
    if (!gallery) return;
    const items = filter === 'all' ? GALLERY : GALLERY.filter(g => g.tag === filter);
    gallery.innerHTML = items.map(g => `
      <div class="gallery-item" data-src="${g.src}" data-caption="${g.caption}">
        <img src="${g.src}" alt="${g.caption}" loading="lazy">
        <span class="gallery-tag">${g.tag}</span>
      </div>`).join('');
  }

  function initGallery() {
    $$('.gallery-filter').forEach(btn => {
      btn.addEventListener('click', () => {
        $$('.gallery-filter').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderGallery(btn.dataset.filter);
      });
    });

    $('#photo-gallery')?.addEventListener('click', e => {
      const item = e.target.closest('.gallery-item');
      if (!item) return;
      $('#lightbox-img').src = item.dataset.src;
      $('#lightbox-caption').textContent = item.dataset.caption;
      $('#lightbox').classList.remove('hidden');
    });

    $('.lightbox-close')?.addEventListener('click', () => $('#lightbox').classList.add('hidden'));
    $('#lightbox')?.addEventListener('click', e => {
      if (e.target.id === 'lightbox') $('#lightbox').classList.add('hidden');
    });
  }

  function initReviewForm() {
    $('#submit-review-btn')?.addEventListener('click', () => {
      showModal('Submit a Review', `
        <form id="review-form">
          <div class="form-group"><label>Your Name</label><input type="text" id="rev-name" required></div>
          <div class="form-group"><label>Rating</label>
            <select id="rev-rating" required>
              <option value="5">5 — Excellent</option>
              <option value="4">4 — Good</option>
              <option value="3">3 — Average</option>
              <option value="2">2 — Poor</option>
              <option value="1">1 — Terrible</option>
            </select>
          </div>
          <div class="form-group"><label>Review</label><textarea id="rev-text" rows="4" required></textarea></div>
          <div class="form-group"><label>Activity</label>
            <select id="rev-activity">
              <option>Board Game Night</option>
              <option>TCG Tournament</option>
              <option>Workshop</option>
              <option>Private Booking</option>
            </select>
          </div>
          <button type="submit" class="btn btn-primary">Submit Review</button>
        </form>
      `);

      $('#review-form')?.addEventListener('submit', e => {
        e.preventDefault();
        closeModal();
        showToast('Thank you for your review!');
      });
    });
  }

  // ─── Team ─────────────────────────────────────────────────────────────

  function renderTeam() {
    const grid = $('#team-grid');
    if (!grid) return;
    grid.innerHTML = TEAM.map(t => `
      <div class="team-card" data-id="${t.id}">
        <img src="${t.image}" alt="${t.name}">
        <h4>${t.name}</h4>
        <p>${t.role}</p>
      </div>`).join('');
  }

  function showTeamMember(id) {
    const t = TEAM.find(x => x.id === id);
    if (!t) return;
    showModal(t.name, `
      <img src="${t.image}" alt="${t.name}" style="width:120px;height:120px;border-radius:50%;margin:0 auto 1rem;display:block">
      <p style="text-align:center;color:var(--accent)">${t.role}</p>
      <p>${t.bio}</p>
    `);
  }

  // ─── Events ───────────────────────────────────────────────────────────

  function getFilteredEvents() {
    const skill = $('#event-skill')?.value || '';
    const type = $('#event-type')?.value || '';
    return EVENTS.filter(e => {
      if (skill && e.skill !== skill) return false;
      if (type && e.type !== type) return false;
      return true;
    });
  }

  function renderEvents() {
    const grid = $('#events-grid');
    if (!grid) return;
    grid.innerHTML = getFilteredEvents().map(e => {
      const d = new Date(e.date);
      return `
        <article class="event-card">
          <div class="card-img-wrap">
            <img src="${e.image}" alt="${e.title}" loading="lazy">
            <span class="card-badge ${eventStatusClass(e.status)}">${eventStatusLabel(e.status)}</span>
          </div>
          <div class="card-body">
            <h3>${e.title}</h3>
            <p class="card-meta">
              <span>📅 ${d.toLocaleDateString('en-MY', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
              <span>🕐 ${d.toLocaleTimeString('en-MY', { hour: '2-digit', minute: '2-digit' })}</span>
            </p>
            <p class="card-meta"><span>${e.type}</span> <span>${e.skill}</span></p>
            <p class="card-meta">Entry: ${e.fee ? formatRM(e.fee) : 'Free'} · Prize: ${e.prize}</p>
            <p class="card-meta">${e.status === 'soldout' || e.status === 'completed' ? 'No seats available' : `${e.seatsLeft} seats left`}</p>
            <div class="card-actions">
              <button class="btn btn-primary btn-sm register-event-btn" data-id="${e.id}"
                ${e.status === 'soldout' || e.status === 'completed' ? 'disabled' : ''}>
                ${e.status === 'completed' ? 'Completed' : e.status === 'soldout' ? 'Sold Out' : 'Register'}
              </button>
            </div>
          </div>
        </article>`;
    }).join('');
  }

  function showEventRegistration(id) {
    const e = EVENTS.find(x => x.id === id);
    if (!e || e.status === 'soldout' || e.status === 'completed') return;
    showModal(`Register: ${e.title}`, `
      <form id="event-reg-form">
        <div class="form-group"><label>Name</label><input type="text" id="ereg-name" required></div>
        <div class="form-group"><label>Email</label><input type="email" id="ereg-email" required></div>
        <p>Entry fee: ${e.fee ? formatRM(e.fee) : 'Free'} · ${e.seatsLeft} seats remaining</p>
        <button type="submit" class="btn btn-primary">Confirm Registration</button>
      </form>
    `);
    $('#event-reg-form')?.addEventListener('submit', async ev => {
      ev.preventDefault();
      const name = $('#ereg-name').value.trim();
      const email = $('#ereg-email').value.trim();
      e.seatsLeft = Math.max(0, e.seatsLeft - 1);
      if (e.seatsLeft <= 3) e.status = 'almost';
      if (e.seatsLeft === 0) e.status = 'soldout';
      await sendOrderEmail(email, makeOrderId('EV'), [{
        name: `${e.title} — Event Registration`,
        units: 1,
        price: e.fee || 0
      }]);
      closeModal();
      renderEvents();
      showToast('Registration confirmed! Check your email.');
    });
  }

  // ─── Tournament Countdown ─────────────────────────────────────────────

  function initCountdown() {
    const nextEvent = EVENTS.filter(e => new Date(e.date) > new Date() && e.status !== 'completed')
      .sort((a, b) => new Date(a.date) - new Date(b.date))[0];
    if (!nextEvent) return;

    $('#countdown-event-name').textContent = nextEvent.title;

    function tick() {
      const diff = new Date(nextEvent.date) - new Date();
      if (diff <= 0) return;
      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      $('#cd-days').textContent = String(days).padStart(2, '0');
      $('#cd-hours').textContent = String(hours).padStart(2, '0');
      $('#cd-mins').textContent = String(mins).padStart(2, '0');
      $('#cd-secs').textContent = String(secs).padStart(2, '0');
    }
    tick();
    setInterval(tick, 1000);
  }

  // ─── Booking ──────────────────────────────────────────────────────────

  function getSavedGameSlotValues() {
    const values = {};
    for (let i = 1; i <= MAX_GAME_SLOTS; i++) {
      values[i] = $(`#book-game-${i}`)?.value || '';
    }
    return values;
  }

  function getVisibleGameSlotCount(saved = null) {
    const vals = saved || getSavedGameSlotValues();
    for (let i = 1; i <= MAX_GAME_SLOTS; i++) {
      if (!vals[i]) return i;
    }
    return MAX_GAME_SLOTS;
  }

  function populateBookingGames() {
    const container = $('#game-rental-picks');
    if (!container) return;

    const saved = getSavedGameSlotValues();
    const visible = getVisibleGameSlotCount(saved);
    const gameOptions = BOARD_GAMES.filter(g => g.available)
      .map(g => `<option value="${g.id}">${g.title} — ${formatRM(g.price)}/day + ${formatRM(g.deposit)} deposit</option>`)
      .join('');

    container.innerHTML = Array.from({ length: visible }, (_, idx) => {
      const i = idx + 1;
      return `
        <div class="form-group game-slot" data-slot="${i}">
          <label for="book-game-${i}">Game ${i} (optional)</label>
          <select id="book-game-${i}" aria-label="Optional game rental ${i}">
            <option value="">— No game selected —</option>
            ${gameOptions}
          </select>
        </div>`;
    }).join('');

    for (let i = 1; i <= visible; i++) {
      const sel = $(`#book-game-${i}`);
      if (sel && saved[i]) sel.value = saved[i];
      sel?.addEventListener('change', () => {
        syncGameRentalOptions();
        populateBookingGames();
        updateBookingSummary();
      });
    }
    syncGameRentalOptions();
  }

  function getSelectedBookingGames() {
    return Array.from({ length: MAX_GAME_SLOTS }, (_, i) => $(`#book-game-${i + 1}`)?.value)
      .filter(Boolean)
      .map(id => BOARD_GAMES.find(g => g.id === id))
      .filter(Boolean);
  }

  function syncGameRentalOptions() {
    const selected = Array.from({ length: MAX_GAME_SLOTS }, (_, i) => $(`#book-game-${i + 1}`)?.value).filter(Boolean);
    for (let i = 1; i <= MAX_GAME_SLOTS; i++) {
      const sel = $(`#book-game-${i}`);
      if (!sel) continue;
      const current = sel.value;
      [...sel.options].forEach(opt => {
        if (!opt.value) return;
        opt.disabled = selected.includes(opt.value) && opt.value !== current;
      });
    }
  }

  function updateBookingSummary() {
    const costs = calculateBookingCosts();

    $('#summary-table').textContent = formatRM(costs.tableCost);
    $('#summary-games').textContent = formatRM(costs.gamesCost);
    $('#summary-deposit').textContent = formatRM(costs.depositTotal);
    $('#summary-deposit-inline').textContent = formatRM(costs.depositTotal);
    $('#summary-total').textContent = formatRM(costs.tableCost + costs.gamesCost);

    const memberLine = $('#summary-member-line');
    const savingsEl = $('#summary-member-savings');
    if (memberLine && savingsEl) {
      if (costs.memberSavings > 0) {
        memberLine.classList.remove('hidden');
        savingsEl.textContent = formatRM(costs.memberSavings);
      } else {
        memberLine.classList.add('hidden');
      }
    }

    const priorityLine = $('#summary-priority-line');
    if (priorityLine) {
      priorityLine.classList.toggle('hidden', !costs.priority);
    }
  }

  function initBooking() {
    const dateInput = $('#book-date');
    if (dateInput) {
      const today = new Date().toISOString().split('T')[0];
      dateInput.min = today;
    }

    ['book-duration', 'book-table-type', 'book-date', 'book-time', 'book-players'].forEach(id => {
      $(`#${id}`)?.addEventListener('input', () => {
        validatePlayerCapacity();
        updateBookingSummary();
        renderFloorPlan();
      });
      $(`#${id}`)?.addEventListener('change', () => {
        validatePlayerCapacity();
        updateBookingSummary();
        renderFloorPlan();
      });
    });
    populateBookingGames();

    $('#booking-form')?.addEventListener('submit', async e => {
      e.preventDefault();
      const form = e.target;
      const name = $('#book-name').value.trim();
      const email = $('#book-email').value.trim();
      const phone = $('#book-phone').value.trim();
      const date = $('#book-date').value;
      const time = $('#book-time').value;

      let valid = true;
      if (!name) { valid = false; $('#book-name').classList.add('error'); }
      else $('#book-name').classList.remove('error');

      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        valid = false; $('#book-email').classList.add('error');
      } else $('#book-email').classList.remove('error');

      if (!phone) { valid = false; $('#book-phone').classList.add('error'); }
      else $('#book-phone').classList.remove('error');

      if (!date) { valid = false; showToast('Please select a date', 'error'); return; }

      const selected = new Date(date);
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      if (selected < now) {
        showToast('Cannot book past dates — please check the date (mistake prevention)', 'error');
        return;
      }

      if (!time) { valid = false; showToast('Please select a time slot', 'error'); return; }
      if (!valid) { showToast('Please fill in all required fields', 'error'); return; }
      if (!validatePlayerCapacity()) {
        showToast('Too many players for the selected table type', 'error');
        return;
      }

      const tableType = $('#book-table-type').value;
      if (!isTableTypeAvailable(tableType, date, time)) {
        showToast('No tables available for that type at the selected date and time. Please choose another slot or check the floor plan.', 'error');
        return;
      }

      const costs = calculateBookingCosts();
      const orderId = makeOrderId('BK');

      const orders = [
        { name: `Table Reservation — ${costs.tableType} (${costs.duration}h, ${date} ${time})${costs.workshopFree ? ' — Member workshop' : ''}`, units: 1, price: costs.tableCost }
      ];
      costs.gameBreakdown.forEach(({ game, price, free }) => {
        orders.push({
          name: `Game Rental — ${game.title}${free ? ' (Member free rental)' : ''}`,
          units: 1,
          price
        });
      });
      if (costs.depositTotal > 0) {
        orders.push({ name: 'Refundable Game Deposit', units: 1, price: costs.depositTotal });
      }

      const orderTotal = costs.tableCost + costs.gamesCost + costs.depositTotal;
      const sent = await sendOrderEmail(email, orderId, orders, { shipping: 0, tax: 0, total: orderTotal });

      if (state.membership) {
        if (costs.workshopFree) state.membership.freeWorkshopsUsed = (state.membership.freeWorkshopsUsed || 0) + 1;
        if (costs.freeRentalsApplied) state.membership.freeRentalsUsed = (state.membership.freeRentalsUsed || 0) + costs.freeRentalsApplied;
        saveState();
        renderMemberBadge();
        renderMemberStatus();
      }

      const total = $('#summary-total').textContent;
      const deposit = $('#summary-deposit').textContent;
      const perksMsg = [
        costs.priority ? 'Priority booking confirmed.' : '',
        costs.parking ? 'Show your membership for 2hr free parking.' : ''
      ].filter(Boolean).join(' ');

      showModal('Reservation Confirmed!', `
        <p>Thank you, <strong>${name}</strong>!</p>
        <p>Your table is reserved for <strong>${date}</strong> at <strong>${time}</strong>.</p>
        <p>Total: <strong>${total}</strong> + Deposit: <strong>${deposit}</strong></p>
        ${costs.memberSavings > 0 ? `<p>Member savings: <strong>${formatRM(costs.memberSavings)}</strong></p>` : ''}
        ${perksMsg ? `<p>${perksMsg}</p>` : ''}
        <p>${sent ? `A confirmation email has been sent to ${email}.` : 'Email could not be sent — please contact us to confirm.'}</p>
      `);
      form.reset();
      populateBookingGames();
      updateBookingSummary();
    });

    updateBookingSummary();
    validatePlayerCapacity();
  }

  // ─── Membership ───────────────────────────────────────────────────────

  function renderMembership() {
    const grid = $('#membership-tiers');
    if (!grid) return;
    const yearly = state.billingYearly;

    grid.innerHTML = MEMBERSHIP_TIERS.map(t => {
      const price = yearly ? t.yearly : t.monthly;
      const period = yearly ? '/year' : '/month';
      const isCurrent = state.membership?.tier === t.id;
      const btnLabel = isCurrent ? 'Current Plan' : (state.membership ? `Switch to ${t.name}` : `Join ${t.name}`);
      return `
        <div class="tier-card ${t.color} ${t.featured ? 'featured' : ''}">
          <h3>${t.name}</h3>
          <p class="tier-price">${formatRM(price)}<small>${period}</small></p>
          ${yearly ? `<p style="color:var(--success);font-size:0.85rem">Save ${formatRM(t.monthly * 12 - t.yearly)}</p>` : ''}
          <ul class="tier-benefits">${t.benefits.map(b => `<li>${b}</li>`).join('')}</ul>
          <button class="btn btn-primary join-plan-btn" data-tier="${t.id}" ${isCurrent ? 'disabled' : ''}>${btnLabel}</button>
        </div>`;
    }).join('');

    renderMemberStatus();

    const matrix = $('#membership-comparison');
    if (matrix) {
      matrix.innerHTML = `
        <table>
          <thead><tr><th>Feature</th><th>Bronze</th><th>Silver</th><th>Gold</th></tr></thead>
          <tbody>${COMPARISON_FEATURES.map(f => `
            <tr><td>${f.feature}</td><td>${f.bronze}</td><td>${f.silver}</td><td>${f.gold}</td></tr>
          `).join('')}</tbody>
        </table>`;
    }
  }

  function initMembership() {
    $('#billing-toggle')?.addEventListener('change', e => {
      state.billingYearly = e.target.checked;
      renderMembership();
    });
  }

  function showJoinPlan(tierId) {
    const tier = MEMBERSHIP_TIERS.find(t => t.id === tierId);
    if (!tier) return;
    const price = state.billingYearly ? tier.yearly : tier.monthly;
    showModal(`Join ${tier.name}`, `
      <form id="join-form">
        <div class="form-group"><label>Full Name</label><input type="text" id="join-name" required></div>
        <div class="form-group"><label>Email</label><input type="email" id="join-email" required></div>
        <p>Plan: <strong>${tier.name}</strong> — ${formatRM(price)}${state.billingYearly ? '/year' : '/month'}</p>
        <button type="submit" class="btn btn-primary">Confirm Membership</button>
      </form>
    `);
    $('#join-form')?.addEventListener('submit', async e => {
      e.preventDefault();
      const name = $('#join-name').value.trim();
      const email = $('#join-email').value.trim();
      await sendOrderEmail(email, makeOrderId('MB'), [{
        name: `${tier.name} Membership${state.billingYearly ? ' (Yearly)' : ' (Monthly)'}`,
        units: 1,
        price
      }]);
      state.membership = {
        tier: tierId,
        name,
        email,
        billingYearly: state.billingYearly,
        joinedAt: Date.now(),
        periodStart: new Date().toISOString().slice(0, 7),
        freeRentalsUsed: 0,
        freeWorkshopsUsed: 0
      };
      saveState();
      closeModal();
      renderMembership();
      renderMemberBadge();
      updateCartUI();
      renderCheckout();
      updateBookingSummary();
      updateRentalCalculator();
      showToast(`Welcome to ${tier.name}! Your perks are now active.`);
    });
  }

  // ─── Checkout ─────────────────────────────────────────────────────────

  function renderCheckout() {
    const itemsEl = $('#checkout-items');
    if (!itemsEl) return;

    if (!state.cart.length) {
      itemsEl.innerHTML = '<p>Your cart is empty. <a href="#shop">Browse the shop</a></p>';
      $('#co-subtotal').textContent = formatRM(0);
      $('#co-total').textContent = formatRM(0);
      return;
    }

    itemsEl.innerHTML = state.cart.map(item => {
      const p = PRODUCTS.find(x => x.id === item.id);
      if (!p) return '';
      return `<div class="checkout-item"><span>${p.title} × ${item.qty}</span><span>${formatRM(getProductPrice(p) * item.qty)}</span></div>`;
    }).join('');

    const subtotal = getCartSubtotal();
    const memberSavings = getCartSubtotalBeforeMember() - subtotal;
    const discount = subtotal * state.promoDiscount;
    const shipping = $('input[name="delivery"]:checked')?.value === 'shipping' ? 12 : 0;
    const total = subtotal - discount + shipping;

    $('#co-subtotal').textContent = formatRM(subtotal);
    $('#co-shipping').textContent = formatRM(shipping);

    const memberLine = $('#co-member-line');
    if (memberLine) {
      if (memberSavings > 0) {
        memberLine.classList.remove('hidden');
        $('#co-member-discount').textContent = `-${formatRM(memberSavings)}`;
      } else {
        memberLine.classList.add('hidden');
      }
    }

    const discountLine = $('#co-discount-line');
    if (state.promoDiscount > 0) {
      discountLine.classList.remove('hidden');
      $('#co-discount').textContent = `-${formatRM(discount)}`;
    } else {
      discountLine.classList.add('hidden');
    }

    $('#co-total').textContent = formatRM(total);
  }

  function initCheckout() {
    $$('input[name="delivery"]').forEach(r => r.addEventListener('change', renderCheckout));

    $('#apply-promo')?.addEventListener('click', () => {
      const code = ($('#co-promo')?.value || '').toUpperCase().trim();
      const msg = $('#promo-msg');
      if (PROMO_CODES[code]) {
        state.promoCode = code;
        state.promoDiscount = PROMO_CODES[code];
        msg.textContent = `Promo ${code} applied — ${state.promoDiscount * 100}% off`;
        msg.className = 'form-hint success';
        renderCheckout();
        updateCartUI();
      } else {
        msg.textContent = 'Invalid promo code';
        msg.className = 'form-hint error';
      }
    });

    const cardInput = $('#co-card');
    cardInput?.addEventListener('input', e => {
      let v = e.target.value.replace(/\D/g, '').slice(0, 16);
      e.target.value = v.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
    });

    $('#co-expiry')?.addEventListener('input', e => {
      let v = e.target.value.replace(/\D/g, '').slice(0, 4);
      if (v.length >= 2) v = v.slice(0, 2) + '/' + v.slice(2);
      e.target.value = v;
    });

    $('#co-cvv')?.addEventListener('input', e => {
      e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4);
    });

    $$('input[name="payment"]').forEach(r => {
      r.addEventListener('change', () => {
        const cardFields = $('#card-fields');
        if (cardFields) cardFields.style.display = $('input[name="payment"]:checked')?.value === 'card' ? '' : 'none';
      });
    });

    $('#checkout-form')?.addEventListener('submit', async e => {
      e.preventDefault();
      if (!state.cart.length) {
        showToast('Your cart is empty', 'error');
        return;
      }

      const payment = $('input[name="payment"]:checked')?.value;
      if (payment === 'card') {
        const card = ($('#co-card')?.value || '').replace(/\s/g, '');
        const expiry = $('#co-expiry')?.value || '';
        const cvv = $('#co-cvv')?.value || '';
        if (card.length < 16) { showToast('Enter a valid 16-digit card number', 'error'); return; }
        if (!/^\d{2}\/\d{2}$/.test(expiry)) { showToast('Enter expiry as MM/YY', 'error'); return; }
        if (cvv.length < 3) { showToast('Enter a valid CVV', 'error'); return; }
      }

      const required = ['co-name', 'co-email', 'co-phone', 'co-address', 'co-city', 'co-postcode'];
      for (const id of required) {
        const el = $(`#${id}`);
        if (!el?.value.trim()) {
          el?.classList.add('error');
          showToast('Please complete all required fields', 'error');
          return;
        }
        el.classList.remove('error');
      }

      const orderId = makeOrderId('TT');
      const email = $('#co-email').value.trim();

      const orders = state.cart.map(item => {
        const p = PRODUCTS.find(x => x.id === item.id);
        if (!p) return null;
        const unitPrice = getProductPrice(p);
        return { name: p.title, units: item.qty, price: unitPrice * item.qty };
      }).filter(Boolean);

      const subtotal = orders.reduce((sum, o) => sum + Number(o.price), 0);
      const discount = subtotal * state.promoDiscount;
      const shipping = $('input[name="delivery"]:checked')?.value === 'shipping' ? 12 : 0;
      if (state.promoDiscount > 0) {
        orders.push({ name: `Promo Discount (${state.promoCode})`, units: 1, price: -discount });
      }

      const orderTotal = subtotal - discount + shipping;
      const sent = await sendOrderEmail(email, orderId, orders, { shipping, tax: 0, total: orderTotal });

      const total = $('#co-total').textContent;

      state.cart = [];
      state.promoCode = null;
      state.promoDiscount = 0;
      saveState();
      updateCartUI();
      renderCheckout();

      showModal('Order Placed!', `
        <p style="text-align:center;font-size:3rem">✅</p>
        <p><strong>Order #${orderId}</strong></p>
        <p>Total paid: <strong>${total}</strong></p>
        <p>Thank you for shopping at The Tabletop Tavern!</p>
        <p>${sent ? `A receipt has been sent to ${email}.` : 'Receipt email could not be sent — please contact us.'}</p>
      `);
      e.target.reset();
    });
  }

  // ─── Contact Form ─────────────────────────────────────────────────────

  function initContact() {
    const msg = $('#contact-message');
    const counter = $('#char-count');

    msg?.addEventListener('input', () => {
      counter.textContent = `${msg.value.length}/500`;
    });

    $('#copy-address')?.addEventListener('click', () => {
      const addr = $('#contact-address')?.textContent || '';
      navigator.clipboard.writeText(addr).then(() => showToast('Address copied!'));
    });

    $('#contact-form')?.addEventListener('submit', async e => {
      e.preventDefault();
      const name = $('#contact-name').value.trim();
      const email = $('#contact-email').value.trim();
      const purpose = $('#contact-purpose').value;
      const message = $('#contact-message').value.trim();

      let valid = true;
      [$('#contact-name'), $('#contact-email'), $('#contact-message')].forEach(el => {
        if (!el?.value.trim()) { el?.classList.add('error'); valid = false; }
        else el?.classList.remove('error');
      });

      if (!purpose) { showToast('Please select a purpose', 'error'); return; }
      if (!valid) { showToast('Please fill in all required fields', 'error'); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showToast('Please enter a valid email address', 'error');
        return;
      }

      await sendOrderEmail(email, makeOrderId('MSG'), [{
        name: `Contact — ${purpose}: ${message.slice(0, 120)}${message.length > 120 ? '…' : ''}`,
        units: 1,
        price: 0
      }]);

      showToast('Message sent successfully! We\'ll reply within 24 hours.');
      e.target.reset();
      counter.textContent = '0/500';
    });
  }

  // ─── Visitor Checklist ────────────────────────────────────────────────

  function initVisitorChecklist() {
    const list = $('#visitor-checklist');
    if (!list) return;

    $$('#visitor-checklist input').forEach((cb, i) => {
      cb.checked = state.visitorChecklist.includes(i);
      cb.addEventListener('change', () => {
        if (cb.checked) {
          if (!state.visitorChecklist.includes(i)) state.visitorChecklist.push(i);
        } else {
          state.visitorChecklist = state.visitorChecklist.filter(x => x !== i);
        }
        saveState();
      });
    });
  }

  // ─── Membership Popup ─────────────────────────────────────────────────

  function initMembershipPopup() {
    if (sessionStorage.getItem('popupDismissed')) return;
    setTimeout(() => $('#membership-popup')?.classList.remove('hidden'), 3000);

    $('.popup-close')?.addEventListener('click', () => {
      $('#membership-popup').classList.add('hidden');
      sessionStorage.setItem('popupDismissed', '1');
    });

    $('#popup-subscribe')?.addEventListener('click', () => {
      const email = $('#popup-email')?.value.trim();
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showToast('Please enter a valid email', 'error');
        return;
      }
      $('#membership-popup').classList.add('hidden');
      sessionStorage.setItem('popupDismissed', '1');
      showToast('Subscribed! Check your inbox for 10% off.');
    });
  }

  // ─── Modal & Global Events ────────────────────────────────────────────

  function initModal() {
    $$('.modal-close').forEach(btn => btn.addEventListener('click', closeModal));
    document.addEventListener('click', e => {
      if (e.target.classList.contains('modal-backdrop')) closeModal();
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        closeModal();
        $('#lightbox')?.classList.add('hidden');
        $('#cart-panel')?.classList.remove('open');
        $('#cart-overlay')?.classList.add('hidden');
      }
    });
  }

  function initGlobalClicks() {
    document.addEventListener('click', e => {
      const target = e.target;

      if (target.closest('.rent-btn')) {
        const id = target.closest('.rent-btn').dataset.id;
        const game = BOARD_GAMES.find(g => g.id === id);
        if (game?.available) {
          state.selectedRentalId = id;
          saveState();
          updateRentalCalculator();
          showToast(`${game.title} selected — complete your booking below`);
          if ($('#booking-form')) {
            $('#booking')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } else {
            window.location.href = 'explore-book.html#booking';
          }
        }
      }

      if (target.closest('.select-calc-btn')) {
        e.preventDefault();
        const id = target.closest('.select-calc-btn').dataset.id;
        scrollToCalculator(id);
        showToast('Game added to rental calculator');
      }

      if (target.closest('.add-cart-btn')) addToCart(target.closest('.add-cart-btn').dataset.id);

      if (target.closest('.wishlist-btn')) {
        e.preventDefault();
        e.stopPropagation();
        const id = target.closest('.wishlist-btn').dataset.id;
        const idx = state.wishlist.indexOf(id);
        if (idx >= 0) state.wishlist.splice(idx, 1);
        else state.wishlist.push(id);
        saveState();
        renderShop();
        renderFeaturedProducts();
        renderRentals();
        renderFeaturedGames();
      }

      if (target.closest('.compare-btn')) toggleCompare(target.closest('.compare-btn').dataset.id);

      if (target.closest('.qty-minus')) updateCartQty(target.closest('.qty-minus').dataset.id, -1);
      if (target.closest('.qty-plus')) updateCartQty(target.closest('.qty-plus').dataset.id, 1);
      if (target.closest('.cart-item-remove')) removeFromCart(target.closest('.cart-item-remove').dataset.id);

      if (target.closest('.floor-area')) showFloorAreaDetail(target.closest('.floor-area').dataset.id);

      if (target.closest('.team-card')) showTeamMember(target.closest('.team-card').dataset.id);

      if (target.closest('.register-event-btn')) showEventRegistration(target.closest('.register-event-btn').dataset.id);

      if (target.closest('.join-plan-btn')) showJoinPlan(target.closest('.join-plan-btn').dataset.tier);

      if (target.closest('[data-vote]')) {
        const btn = target.closest('[data-vote]');
        const id = btn.dataset.id;
        const vote = btn.dataset.vote;
        if (!state.faqVotes[id]) state.faqVotes[id] = { yes: 0, no: 0 };
        state.faqVotes[id][vote]++;
        saveState();
        renderFAQ();
      }
    });
  }

  function initFilters() {
    const rentalFilterIds = ['rental-search', 'rental-category', 'rental-difficulty', 'rental-players', 'rental-sort', 'rental-available'];
    rentalFilterIds.forEach(id => {
      const el = $(`#${id}`);
      el?.addEventListener(id === 'rental-search' ? 'input' : 'change', renderRentals);
    });

    ['shop-search', 'shop-category', 'price-range'].forEach(id => {
      const el = $(`#${id}`);
      el?.addEventListener(id === 'shop-search' ? 'input' : 'change', renderShop);
    });

    ['faq-search', 'faq-category'].forEach(id => {
      $(`#${id}`)?.addEventListener(id === 'faq-search' ? 'input' : 'change', renderFAQ);
    });

    ['event-skill', 'event-type'].forEach(id => {
      $(`#${id}`)?.addEventListener('change', renderEvents);
    });

    $('#calc-days')?.addEventListener('input', updateRentalCalculator);
    $('#calc-days')?.addEventListener('change', updateRentalCalculator);
    $('#calc-game')?.addEventListener('change', e => {
      state.selectedRentalId = e.target.value || null;
      saveState();
      updateRentalCalculator();
    });
  }

  // ─── Init ─────────────────────────────────────────────────────────────

  function init() {
    const page = getCurrentPage();
    loadState();
    initEmailJS();
    initTheme();
    initMusic();
    initIconTooltips();
    initNavigation();
    initAccordions();
    initCart();
    initModal();
    initGlobalClicks();
    initMembershipPopup();
    renderMemberBadge();

    if (page === 'home') {
      initContact();
      initCountdown();
      initFilters();
      renderFeaturedGames();
      renderFeaturedProducts();
      renderReviews();
      renderTeam();
    }

    if (page === 'explore-book') {
      const calcParam = new URLSearchParams(location.search).get('calc');
      if (calcParam) state.selectedRentalId = calcParam;
      initFilters();
      initBooking();
      initFloorPlan();
      renderRentals();
      populateCalcGameSelect();
      renderRoomPlayerGuide();
      updateRentalCalculator();
      if (location.hash === '#rental-calculator' || calcParam) {
        setTimeout(() => $('#rental-calculator')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300);
      }
    }

    if (page === 'rental-detail') {
      renderRentalDetailPage();
    }

    if (page === 'events') {
      initFilters();
      renderEvents();
    }

    if (page === 'shop') {
      initCompare();
      initCheckout();
      initFilters();
      renderShop();
      renderCheckout();
      $('#compare-count').textContent = state.compare.length;
    }

    if (page === 'membership') {
      initMembership();
      renderMembership();
    }

    if (page === 'faq') {
      initVisitorChecklist();
      initGallery();
      initReviewForm();
      initFilters();
      renderFAQ();
      renderReviews();
      renderGallery();
    }

    updateCartUI();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
