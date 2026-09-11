import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding Trendmark Database...')

  // 1. Create Packages
  const bronze = await prisma.package.upsert({
    where: { id: 'pkg-bronze' },
    update: {},
    create: {
      id: 'pkg-bronze',
      name: 'Bronze Package',
      price: 300,
      ratePerView: 1.0,
      description: 'Activation KSh 300 | Earn KSh 1.00 per approved WhatsApp view',
    },
  })

  const silver = await prisma.package.upsert({
    where: { id: 'pkg-silver' },
    update: {},
    create: {
      id: 'pkg-silver',
      name: 'Silver Package',
      price: 500,
      ratePerView: 2.0,
      description: 'Activation KSh 500 | Earn KSh 2.00 per approved WhatsApp view',
    },
  })

  const gold = await prisma.package.upsert({
    where: { id: 'pkg-gold' },
    update: {},
    create: {
      id: 'pkg-gold',
      name: 'Gold Package',
      price: 1000,
      ratePerView: 3.5,
      description: 'Activation KSh 1,000 | Earn KSh 3.50 per approved WhatsApp view (VIP)',
    },
  })

  console.log('Packages created:', [bronze.name, silver.name, gold.name])

  // 2. Create Default Admin & User
  const adminPassword = await bcrypt.hash('admin123', 10)
  const userPassword = await bcrypt.hash('user123', 10)

  const admin = await prisma.user.upsert({
    where: { phone: '0700000000' },
    update: {},
    create: {
      fullName: 'System Administrator',
      phone: '0700000000',
      whatsappNumber: '254700000000',
      email: 'admin@trendmark.co.ke',
      mpesaNumber: '254700000000',
      passwordHash: adminPassword,
      role: 'ADMIN',
      profileComplete: true,
    },
  })

  const demoUser = await prisma.user.upsert({
    where: { phone: '0712345678' },
    update: {},
    create: {
      fullName: 'John Kamau',
      phone: '0712345678',
      whatsappNumber: '254712345678',
      email: 'john@gmail.com',
      mpesaNumber: '254712345678',
      passwordHash: userPassword,
      role: 'USER',
      profileComplete: true,
    },
  })

  // Assign Active Silver Package to demoUser for instant testing
  await prisma.userPackage.create({
    data: {
      userId: demoUser.id,
      packageId: silver.id,
      status: 'ACTIVE',
      activatedAt: new Date(),
    },
  })

  console.log('Users created:', { admin: admin.phone, demoUser: demoUser.phone })

  // 3. Create Sample Products
  const prod1 = await prisma.product.create({
    data: {
      name: 'Trendmark Ultra Smart Watch v2',
      description: '1.96-inch HD AMOLED Display, Bluetooth Calling, 10-day battery life, Waterproof IP68.',
      price: 3500,
      image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=800',
      category: 'Smartwatches',
      stock: 45,
    },
  })

  const prod2 = await prisma.product.create({
    data: {
      name: 'Trendmark Bass Pro Wireless Earbuds',
      description: 'Active Noise Cancellation (ANC), 30-hour playback with case, Deep Bass boost.',
      price: 2200,
      image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=800',
      category: 'Audio',
      stock: 60,
    },
  })

  // 4. Create Today's Campaign (2026-09-08)
  const todayStr = '2026-09-08'
  await prisma.campaign.upsert({
    where: { campaignDate: todayStr },
    update: {},
    create: {
      productId: prod1.id,
      campaignDate: todayStr,
      promoText: `🔥 SPECIAL OFFER TODAY at Trendmark Electronics! 🔥\n\nGet the Trendmark Ultra Smart Watch v2 for only KSh 3,500!\n✅ 1.96" AMOLED HD Screen\n✅ Bluetooth Phone Calls\n✅ 10 Days Battery\n\nOrder via M-Pesa & Get Free Delivery in Nairobi! 📦 Call/WhatsApp: 0700000000`,
      status: 'ACTIVE',
    },
  })

  console.log(`Campaign created for date ${todayStr}`)
  console.log('Seeding finished successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
