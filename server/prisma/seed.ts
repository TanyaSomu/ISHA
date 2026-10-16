import { PrismaClient, Role, OrderStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Sattva Living database...');

  // Clean existing data
  await prisma.analyticsEvent.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // 1. Create Users
  const adminPasswordHash = bcrypt.hashSync('Admin@Sattva2026!', 10);
  const admin = await prisma.user.create({
    data: {
      name: 'Sattva Admin',
      email: 'admin@sattvaliving.com',
      passwordHash: adminPasswordHash,
      role: Role.ADMIN,
      phone: '+91 98765 43210',
      address: 'Sattva Sanctuary, 108 Shanti Marg',
      city: 'Coimbatore',
      state: 'Tamil Nadu',
      postalCode: '641114',
    },
  });

  const customerPasswordHash = bcrypt.hashSync('Customer@1234', 10);
  const customer = await prisma.user.create({
    data: {
      name: 'Aarav Patel',
      email: 'aarav@example.com',
      passwordHash: customerPasswordHash,
      role: Role.CUSTOMER,
      phone: '+91 98111 22334',
      address: 'Flat 402, Lotus Residency, Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560038',
    },
  });

  console.log(`Created admin: ${admin.email} and customer: ${customer.email}`);

  // 2. Create Categories
  const categoriesData = [
    {
      name: 'Yoga Mats',
      slug: 'yoga-mats',
      description: 'Consciously crafted natural mats offering sacred grip, grounding support, and earth-friendly materials.',
      image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80',
      displayOrder: 1,
    },
    {
      name: 'Meditation Cushions',
      slug: 'meditation-cushions',
      description: 'Ergonomic zafus and zabutons filled with organic hulls to cultivate effortless stillness and spinal alignment.',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
      displayOrder: 2,
    },
    {
      name: 'Yoga Blocks & Straps',
      slug: 'yoga-blocks-straps',
      description: 'Natural cork blocks and woven cotton straps designed to deepen your asana practice with integrity.',
      image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
      displayOrder: 3,
    },
    {
      name: 'Yoga Clothing',
      slug: 'yoga-clothing',
      description: 'Breathable, unbleached organic cotton and khadi attire tailored for unrestricted yogic flow.',
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
      displayOrder: 4,
    },
    {
      name: 'Meditation Accessories',
      slug: 'meditation-accessories',
      description: 'Handcrafted bell metal singing bowls, brass oil lamps, and sacred Japa malas for focused contemplation.',
      image: 'https://images.unsplash.com/photo-1602192509154-0b900ee1f851?auto=format&fit=crop&w=800&q=80',
      displayOrder: 5,
    },
    {
      name: 'Wellness & Lifestyle',
      slug: 'wellness-lifestyle',
      description: 'Pure copper vessels, herbal dhoop cones, and cold-pressed botanical oils for conscious daily living.',
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
      displayOrder: 6,
    },
  ];

  const categoryMap: Record<string, string> = {};
  for (const cat of categoriesData) {
    const created = await prisma.category.create({ data: cat });
    categoryMap[cat.slug] = created.id;
  }
  console.log(`Created ${Object.keys(categoryMap).length} categories`);

  // 3. Create 16 Realistic Products
  const productsData = [
    // Yoga Mats
    {
      name: 'Prana Natural Tree Rubber Yoga Mat (5mm)',
      slug: 'prana-natural-tree-rubber-yoga-mat',
      description: 'Sustainably tapped natural tree rubber surface fused with a soft absorbent microfiber top. Provides unmatched wet and dry traction, gentle joint cushioning, and 100% biodegradable composition.',
      price: 349900, // ₹3,499.00
      compareAtPrice: 399900,
      categoryId: categoryMap['yoga-mats'],
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1592417817098-8f3d6ef23ef9?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80',
      ]),
      stock: 35,
      material: '100% Natural Tree Rubber & Eco-Polyurethane',
      dimensions: '183 cm x 68 cm x 5 mm (Weight: 2.8 kg)',
      careInstructions: 'Wipe down with a damp cloth and mild lavender water. Roll with the smooth surface facing outward. Keep away from direct harsh sunlight.',
      intendedUse: 'Dynamic Vinyasa, Hatha Yoga, and intensive daily asana practice requiring superior wet traction.',
      experienceLevel: 'ALL_LEVELS',
      isFeatured: true,
      isBestseller: true,
      isActive: true,
      collectionTags: JSON.stringify(['eco-friendly', 'high-traction', 'daily-practice']),
    },
    {
      name: 'Kallol Organic Jute & Rubber Grip Mat (4mm)',
      slug: 'kallol-organic-jute-rubber-mat',
      description: 'Handwoven natural golden jute fiber bonded directly with dense natural rubber base. Offers an earthy textured feel under palms and feet with grounding organic presence.',
      price: 249900, // ₹2,499.00
      compareAtPrice: 289900,
      categoryId: categoryMap['yoga-mats'],
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
      ]),
      stock: 18,
      material: 'Hand-harvested Raw Jute Fiber & Natural Rubber',
      dimensions: '180 cm x 61 cm x 4 mm (Weight: 2.1 kg)',
      careInstructions: 'Air dry after practice. Spot clean with natural tea-tree oil spray. Do not machine wash.',
      intendedUse: 'Classical Hatha, Iyengar yoga, breathwork, and mindful standing sequences.',
      experienceLevel: 'BEGINNER',
      isFeatured: false,
      isBestseller: true,
      isActive: true,
      collectionTags: JSON.stringify(['handcrafted', 'jute', 'beginner-friendly']),
    },
    {
      name: 'Mandala Cork Alignment Yoga Mat (4.5mm)',
      slug: 'mandala-cork-alignment-yoga-mat',
      description: 'Naturally antimicrobial Mediterranean oak bark cork top layer laser-etched with sacred geometric alignment cues. Provides natural non-slip grip that activates as warmth increases.',
      price: 299900, // ₹2,999.00
      compareAtPrice: 349900,
      categoryId: categoryMap['yoga-mats'],
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
      ]),
      stock: 4, // Low stock demo
      material: 'Organic Renewable Cork & Natural Tree Rubber backing',
      dimensions: '183 cm x 66 cm x 4.5 mm (Weight: 2.4 kg)',
      careInstructions: 'Naturally antibacterial—requires minimal cleaning. Wipe with a damp cloth once a week. Never fold; always roll cork side out.',
      intendedUse: 'Alignment-focused yoga, Ashtanga, Hot Yoga, and balance posture training.',
      experienceLevel: 'INTERMEDIATE',
      isFeatured: true,
      isBestseller: false,
      isActive: true,
      collectionTags: JSON.stringify(['cork', 'alignment-guide', 'antimicrobial']),
    },
    {
      name: 'Khadi Handloom Cotton Yoga Dhurrie Mat',
      slug: 'khadi-handloom-cotton-yoga-dhurrie',
      description: 'Woven on traditional village wooden pit-looms using unbleached raw organic cotton. Beloved by traditional Mysore Ashtanga practitioners to absorb sweat during deep meditative movement.',
      price: 189900, // ₹1,899.00
      compareAtPrice: null,
      categoryId: categoryMap['yoga-mats'],
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80',
      ]),
      stock: 22,
      material: '100% Pure Unbleached Organic Indian Cotton',
      dimensions: '190 cm x 70 cm x 3 mm (Weight: 1.4 kg)',
      careInstructions: 'Gentle hand wash or cold machine cycle with eco-friendly soap nut detergent. Line dry in shade.',
      intendedUse: 'Traditional Mysore style Ashtanga, Pranayama sessions, outdoor lawn practice.',
      experienceLevel: 'ALL_LEVELS',
      isFeatured: false,
      isBestseller: false,
      isActive: true,
      collectionTags: JSON.stringify(['handloom', 'traditional', 'khadi']),
    },

    // Meditation Cushions
    {
      name: 'Shanti Buckwheat Hull Zafu Meditation Cushion',
      slug: 'shanti-buckwheat-hull-zafu-cushion',
      description: 'Pleated circular meditation cushion stuffed with organic triple-cleaned buckwheat hulls that mold smoothly to your pelvic curve, relieving tension in hips and lower spine.',
      price: 179900, // ₹1,799.00
      compareAtPrice: 219900,
      categoryId: categoryMap['meditation-cushions'],
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
      ]),
      stock: 28,
      material: 'GOTS Certified Organic Heavy Cotton Twill & Organic Buckwheat Hulls',
      dimensions: '36 cm diameter x 15 cm height (Weight: 2.2 kg)',
      careInstructions: 'Removable zippered outer cover is machine washable. Do not get buckwheat hulls wet; sun-dry inner pouch twice yearly.',
      intendedUse: 'Cross-legged sitting posture (Sukhasana, Padmasana, Siddhasana) for extended silent meditation.',
      experienceLevel: 'ALL_LEVELS',
      isFeatured: true,
      isBestseller: true,
      isActive: true,
      collectionTags: JSON.stringify(['meditation', 'spine-support', 'organic']),
    },
    {
      name: 'Samadhi Zabuton Floor Meditation Base Mat',
      slug: 'samadhi-zabuton-floor-mat',
      description: 'Deeply padded rectangular floor cushion that cradles knees, shins, and ankles against cold hard floors during prolonged sitting meditation.',
      price: 249900, // ₹2,499.00
      compareAtPrice: 299900,
      categoryId: categoryMap['meditation-cushions'],
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1602192509154-0b900ee1f851?auto=format&fit=crop&w=800&q=80',
      ]),
      stock: 14,
      material: '100% Recycled Cotton Batting & Heavy Canvas Outer Shell',
      dimensions: '85 cm x 75 cm x 7 cm (Weight: 3.1 kg)',
      careInstructions: 'Removable cover washable in cold water. Fluff batting regularly.',
      intendedUse: 'Floor grounding, knee joint protection when paired with a Zafu cushion.',
      experienceLevel: 'ALL_LEVELS',
      isFeatured: false,
      isBestseller: false,
      isActive: true,
      collectionTags: JSON.stringify(['cushioning', 'sacred-corner', 'floor-support']),
    },
    {
      name: 'Crescent Moon Ergonomic Meditation Pillow',
      slug: 'crescent-moon-meditation-pillow',
      description: 'Tapered curve design gently supports the sacrum while allowing heels to tuck closely toward the perineum, ideal for practitioners with tighter hip flexors.',
      price: 159900, // ₹1,599.00
      compareAtPrice: 189900,
      categoryId: categoryMap['meditation-cushions'],
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80',
      ]),
      stock: 19,
      material: 'Organic Cotton Canvas & Kapok Natural Silk-Cotton Fiber',
      dimensions: '42 cm x 24 cm x 13 cm (Weight: 1.3 kg)',
      careInstructions: 'Spot clean outer fabric. Sun-air periodically.',
      intendedUse: 'Meditative seated poses with open hip positioning and pelvic tilting.',
      experienceLevel: 'BEGINNER',
      isFeatured: false,
      isBestseller: false,
      isActive: true,
      collectionTags: JSON.stringify(['ergonomic', 'hip-relief', 'beginner-friendly']),
    },

    // Yoga Blocks & Straps
    {
      name: 'Renewable Dense Cork Yoga Block (Pair)',
      slug: 'renewable-dense-cork-yoga-block-pair',
      description: 'Solid high-density cork blocks with radiused beveled edges for comfortable hand and back support. Firmer and significantly more stable than lightweight foam alternatives.',
      price: 129900, // ₹1,299.00
      compareAtPrice: 159900,
      categoryId: categoryMap['yoga-blocks-straps'],
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
      ]),
      stock: 45,
      material: '100% Sustainable Portuguese Cork',
      dimensions: '23 cm x 12 cm x 7.5 cm each (Weight: 750g per block)',
      careInstructions: 'Wipe clean with a damp cloth. Natural antimicrobial properties prevent odor retention.',
      intendedUse: 'Restorative yoga, bridge support, spinal opening, and arm reach extension in standing asanas.',
      experienceLevel: 'ALL_LEVELS',
      isFeatured: true,
      isBestseller: true,
      isActive: true,
      collectionTags: JSON.stringify(['cork-block', 'props', 'stability']),
    },
    {
      name: 'Heavy Cotton Yoga Alignment Strap with Brass D-Ring (8ft)',
      slug: 'heavy-cotton-yoga-strap-brass-d-ring',
      description: 'Thick non-slip woven cotton webbing with robust solid brass dual D-rings. Tested for up to 250 kg tensile load to safely extend reach and assist deep hamstring opening.',
      price: 59900, // ₹599.00
      compareAtPrice: 79900,
      categoryId: categoryMap['yoga-blocks-straps'],
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
      ]),
      stock: 60,
      material: '100% Unbleached Cotton Webbing & Solid Brass Hardware',
      dimensions: '240 cm (8 feet) length x 3.8 cm width',
      careInstructions: 'Hand wash in cold water to preserve metal finish. Air dry completely.',
      intendedUse: 'Bound postures, shoulder opening, hamstring stretches, and posture stabilization.',
      experienceLevel: 'ALL_LEVELS',
      isFeatured: false,
      isBestseller: true,
      isActive: true,
      collectionTags: JSON.stringify(['strap', 'brass-hardware', 'deep-stretching']),
    },

    // Yoga Clothing
    {
      name: 'Sadhana Pure Khadi Cotton Yoga Kurta',
      slug: 'sadhana-pure-khadi-cotton-yoga-kurta',
      description: 'Handspun and handwoven authentic khadi cotton tunic with mandarin collar and side slit gussets. Allows complete circular arm freedom without bunching or riding up.',
      price: 169900, // ₹1,699.00
      compareAtPrice: 199900,
      categoryId: categoryMap['yoga-clothing'],
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
      ]),
      stock: 25,
      material: '100% Handspun Indian Khadi Cotton (Undyed)',
      dimensions: 'Available sizes: S, M, L, XL (Relaxed Fit)',
      careInstructions: 'Wash with mild organic liquid detergent. Natural wrinkles celebrate traditional weaving.',
      intendedUse: 'Yogic sadhana, meditation, temple visits, and comfortable mindful living.',
      experienceLevel: 'ALL_LEVELS',
      isFeatured: true,
      isBestseller: false,
      isActive: true,
      collectionTags: JSON.stringify(['khadi', 'breathable', 'handspun']),
    },
    {
      name: 'Vayu Organic Hemp Flow Movement Pants',
      slug: 'vayu-organic-hemp-flow-movement-pants',
      description: 'Relaxed drop-crotch harem-inspired movement pants with gathered elastic ankles and wide waistband with natural cotton drawstring. Stays in place during inverted asanas.',
      price: 219900, // ₹2,199.00
      compareAtPrice: 249900,
      categoryId: categoryMap['yoga-clothing'],
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
      ]),
      stock: 16,
      material: '55% Organic Hemp & 45% Organic Cotton Blend',
      dimensions: 'Unisex Relaxed Cut (Fits waist 28-38 inches)',
      careInstructions: 'Cold wash on gentle cycle. Naturally softens and gains drape with every wash.',
      intendedUse: 'Dynamic movement, inverted postures, Pranayama, and temple walk meditations.',
      experienceLevel: 'ALL_LEVELS',
      isFeatured: false,
      isBestseller: true,
      isActive: true,
      collectionTags: JSON.stringify(['hemp', 'breathable-pants', 'inversion-ready']),
    },

    // Meditation Accessories
    {
      name: 'Handcrafted Bell Metal Tibetan Singing Bowl (7-Metal Alloy)',
      slug: 'handcrafted-bell-metal-tibetan-singing-bowl',
      description: 'Hammered by multi-generational Himalayan artisans with seven sacred planetary metals. Produces a sustained 432Hz harmonic vibration that clears cognitive chatter and anchors the mind in present awareness.',
      price: 389900, // ₹3,899.00
      compareAtPrice: 449900,
      categoryId: categoryMap['meditation-accessories'],
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1602192509154-0b900ee1f851?auto=format&fit=crop&w=800&q=80',
      ]),
      stock: 11,
      material: 'Bronze Alloy (Copper, Tin, with trace sacred metals) & Rosewood Striker with Suede',
      dimensions: '18 cm diameter x 9.5 cm height (Weight: 1.15 kg)',
      careInstructions: 'Clean gently with lemon rind and salt paste; buff with dry cotton cloth. Do not use chemical brass polishers.',
      intendedUse: 'Beginning and concluding meditation sits, sound immersion, and space purification.',
      experienceLevel: 'ALL_LEVELS',
      isFeatured: true,
      isBestseller: true,
      isActive: true,
      collectionTags: JSON.stringify(['sound-healing', '432hz', 'handcrafted']),
    },
    {
      name: 'Sacred Neem Wood Japa Mala (108+1 Beads)',
      slug: 'sacred-neem-wood-japa-mala',
      description: 'Hand-carved from sacred seasoned Indian neem wood known for its cooling energy and natural medicinal properties. Strung on pure cotton cord with traditional knots between each bead.',
      price: 69900, // ₹699.00
      compareAtPrice: 89900,
      categoryId: categoryMap['meditation-accessories'],
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1602192509154-0b900ee1f851?auto=format&fit=crop&w=800&q=80',
      ]),
      stock: 40,
      material: 'Naturally Seasoned Indian Neem Heartwood & Cotton Tassel',
      dimensions: '108 prayer beads (8mm each) + 1 Guru bead (Total length: 48 cm)',
      careInstructions: 'Avoid contact with water and harsh synthetic perfumes. Occasionally oil with sandalwood drops.',
      intendedUse: 'Mantra chanting, breath counting, mental focus during silent meditation.',
      experienceLevel: 'BEGINNER',
      isFeatured: false,
      isBestseller: false,
      isActive: true,
      collectionTags: JSON.stringify(['japa-mala', 'neem', 'mantra']),
    },
    {
      name: 'Kansa Traditional Meditation Ghee Diya Lamp',
      slug: 'kansa-traditional-meditation-ghee-diya',
      description: 'Cast from heavy pure Kansa bronze alloy to burn pure cow ghee or sesame oil with cotton wick. Emits a steady, soot-free sacred flame for Trataka (candle gazing) concentration practice.',
      price: 119900, // ₹1,199.00
      compareAtPrice: 139900,
      categoryId: categoryMap['meditation-accessories'],
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1602192509154-0b900ee1f851?auto=format&fit=crop&w=800&q=80',
      ]),
      stock: 20,
      material: 'Traditional Kansa Bronze (78% Copper, 22% Tin)',
      dimensions: '10 cm base diameter x 12 cm height (Weight: 480g)',
      careInstructions: 'Clean spent wick residue with tamarind pulp and warm water.',
      intendedUse: 'Trataka meditation, altar sanctification, evening mindfulness.',
      experienceLevel: 'ALL_LEVELS',
      isFeatured: false,
      isBestseller: false,
      isActive: true,
      collectionTags: JSON.stringify(['trataka', 'bronze', 'altar-diya']),
    },

    // Wellness & Lifestyle
    {
      name: 'Hammered Ayurvedic Pure Copper Water Carafe (1 Liter)',
      slug: 'hammered-ayurvedic-pure-copper-water-carafe',
      description: 'Handcrafted pure copper water vessel with a fitted silicone-sealed lid. Storing water overnight naturally ionizes the water (Tamra Jal), supporting digestive fire and conscious vitality.',
      price: 189900, // ₹1,899.00
      compareAtPrice: 229900,
      categoryId: categoryMap['wellness-lifestyle'],
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
      ]),
      stock: 24,
      material: '100% Certified Food-Grade Pure Copper',
      dimensions: '1000 ml capacity (Height: 25 cm, Weight: 420g)',
      careInstructions: 'Use only for plain drinking water (no citrus or dairy). Clean exterior with lime juice and salt solution.',
      intendedUse: 'Daily Ayurvedic hydration, conscious morning water ritual.',
      experienceLevel: 'ALL_LEVELS',
      isFeatured: true,
      isBestseller: true,
      isActive: true,
      collectionTags: JSON.stringify(['copper', 'ayurveda', 'hydration']),
    },
    {
      name: 'Wildcrafted Guggal & Frankincense Herbal Dhoop Cones (Box of 30)',
      slug: 'wildcrafted-guggal-herbal-dhoop-cones',
      description: 'Charcoal-free sacred dhoop cones blended from ethically gathered Indian frankincense resin, sacred temple flowers, and desi cow dung base. Cleanses the ambient atmosphere without stinging the eyes.',
      price: 49900, // ₹499.00
      compareAtPrice: 59900,
      categoryId: categoryMap['wellness-lifestyle'],
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
      ]),
      stock: 50,
      material: 'Natural Resins, Flower Powders, Desi Cow Dung (Zero Charcoal)',
      dimensions: '30 cones + Terracotta ceramic burning holder (Burn time: ~35 mins each)',
      careInstructions: 'Store in airtight box away from damp areas. Keep out of reach of unattended children.',
      intendedUse: 'Creating a serene practice atmosphere, morning and evening puja, space energy reset.',
      experienceLevel: 'ALL_LEVELS',
      isFeatured: false,
      isBestseller: true,
      isActive: true,
      collectionTags: JSON.stringify(['dhoop', 'charcoal-free', 'sacred-aroma']),
    },
    // Out of stock / Discontinued Demo Product
    {
      name: 'Heritage Sandalwood Sacred Mala (Discontinued Edition)',
      slug: 'heritage-sandalwood-sacred-mala',
      description: 'Traditional Mysore red sandalwood beads. Currently out of stock and awaiting ethical forest department harvest approval.',
      price: 459900, // ₹4,599.00
      compareAtPrice: 499900,
      categoryId: categoryMap['meditation-accessories'],
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1602192509154-0b900ee1f851?auto=format&fit=crop&w=800&q=80',
      ]),
      stock: 0, // 0 Stock demo
      material: 'Aged Mysore Sandalwood',
      dimensions: '108 beads (6mm)',
      careInstructions: 'Store in velvet pouch.',
      intendedUse: 'Contemplation and meditation.',
      experienceLevel: 'ADVANCED',
      isFeatured: false,
      isBestseller: false,
      isActive: false, // Discontinued demo
      collectionTags: JSON.stringify(['heritage', 'sandalwood']),
    },
  ];

  const createdProducts = [];
  for (const prod of productsData) {
    const p = await prisma.product.create({ data: prod });
    createdProducts.push(p);
  }
  console.log(`Created ${createdProducts.length} realistic products`);

  // 4. Create a Sample Completed Order for Aarav
  const sampleMat = createdProducts[0];
  const sampleStrap = createdProducts[8];

  const subtotal = sampleMat.price + sampleStrap.price; // 349900 + 59900 = 409800 paise
  const deliveryCharge = 0; // Free delivery over ₹1,999
  const totalAmount = subtotal + deliveryCharge;

  const sampleOrder = await prisma.order.create({
    data: {
      orderNumber: 'SL-2026-1001',
      userId: customer.id,
      customerName: customer.name,
      customerEmail: customer.email,
      customerPhone: customer.phone || '+91 98111 22334',
      address: customer.address || 'Flat 402, Lotus Residency',
      city: customer.city || 'Bengaluru',
      state: customer.state || 'Karnataka',
      postalCode: customer.postalCode || '560038',
      subtotal,
      deliveryCharge,
      totalAmount,
      status: OrderStatus.CONFIRMED,
      paymentMethod: 'SIMULATED_CHECKOUT',
      paymentStatus: 'SIMULATED_PAID',
      items: {
        create: [
          {
            productId: sampleMat.id,
            productName: sampleMat.name,
            productImage: JSON.parse(sampleMat.images)[0],
            unitPrice: sampleMat.price,
            quantity: 1,
            subtotal: sampleMat.price,
          },
          {
            productId: sampleStrap.id,
            productName: sampleStrap.name,
            productImage: JSON.parse(sampleStrap.images)[0],
            unitPrice: sampleStrap.price,
            quantity: 1,
            subtotal: sampleStrap.price,
          },
        ],
      },
    },
  });
  console.log(`Created sample order: ${sampleOrder.orderNumber}`);

  // 5. Seed Initial Analytics Events to provide realistic baseline metrics
  const session1 = 'sess_demo_alpha_101';
  const session2 = 'sess_demo_beta_102';
  const session3 = 'sess_demo_gamma_103';

  const analyticsEvents = [
    { eventType: 'PAGE_VIEW', sessionId: session1, eventData: JSON.stringify({ page: '/' }), userId: customer.id },
    { eventType: 'PRODUCT_VIEW', sessionId: session1, eventData: JSON.stringify({ productId: sampleMat.id, name: sampleMat.name }), userId: customer.id },
    { eventType: 'ADD_TO_CART', sessionId: session1, eventData: JSON.stringify({ productId: sampleMat.id }), userId: customer.id },
    { eventType: 'PRODUCT_VIEW', sessionId: session1, eventData: JSON.stringify({ productId: sampleStrap.id, name: sampleStrap.name }), userId: customer.id },
    { eventType: 'ADD_TO_CART', sessionId: session1, eventData: JSON.stringify({ productId: sampleStrap.id }), userId: customer.id },
    { eventType: 'CHECKOUT_STARTED', sessionId: session1, eventData: JSON.stringify({ subtotal }), userId: customer.id },
    { eventType: 'ORDER_COMPLETED', sessionId: session1, eventData: JSON.stringify({ orderId: sampleOrder.id, totalAmount }), userId: customer.id },

    { eventType: 'PAGE_VIEW', sessionId: session2, eventData: JSON.stringify({ page: '/' }) },
    { eventType: 'SEARCH', sessionId: session2, eventData: JSON.stringify({ query: 'cork' }) },
    { eventType: 'PRODUCT_VIEW', sessionId: session2, eventData: JSON.stringify({ productId: createdProducts[2].id, name: createdProducts[2].name }) },
    { eventType: 'ADD_TO_CART', sessionId: session2, eventData: JSON.stringify({ productId: createdProducts[2].id }) },

    { eventType: 'PAGE_VIEW', sessionId: session3, eventData: JSON.stringify({ page: '/catalogue' }) },
    { eventType: 'FILTER_APPLIED', sessionId: session3, eventData: JSON.stringify({ category: 'meditation-accessories' }) },
    { eventType: 'PRODUCT_VIEW', sessionId: session3, eventData: JSON.stringify({ productId: createdProducts[11].id, name: createdProducts[11].name }) },
  ];

  for (const event of analyticsEvents) {
    await prisma.analyticsEvent.create({ data: event });
  }

  console.log(`Created ${analyticsEvents.length} baseline analytics events`);
  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error in seed script:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
