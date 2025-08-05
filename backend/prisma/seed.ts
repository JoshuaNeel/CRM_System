import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create a test user
  const hashedPassword = await bcrypt.hash('password123', 10)
  const user = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  console.log('✅ Created user:', user.email)

  // Create sample customers
  const customers = await Promise.all([
    prisma.customer.create({
      data: {
        name: 'John Smith',
        email: 'john.smith@acme.com',
        phone: '+1-555-0123',
        company: 'Acme Corporation',
        industry: 'Technology',
        status: 'LEAD',
        source: 'Website',
        notes: 'Interested in our enterprise solution',
        userId: user.id,
      },
    }),
    prisma.customer.create({
      data: {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@techstart.com',
        phone: '+1-555-0456',
        company: 'TechStart Inc',
        industry: 'Startup',
        status: 'QUALIFIED',
        source: 'Referral',
        notes: 'Looking for scalable solutions',
        userId: user.id,
      },
    }),
    prisma.customer.create({
      data: {
        name: 'Mike Wilson',
        email: 'mike.wilson@globalcorp.com',
        phone: '+1-555-0789',
        company: 'Global Corp',
        industry: 'Manufacturing',
        status: 'PROPOSAL',
        source: 'Trade Show',
        notes: 'Enterprise client, high potential',
        userId: user.id,
      },
    }),
  ])

  console.log('✅ Created customers:', customers.length)

  // Create sample contacts
  const contacts = await Promise.all([
    prisma.contact.create({
      data: {
        customerId: customers[0].id,
        type: 'CALL',
        subject: 'Initial Contact',
        description: 'Called to introduce our services',
        date: new Date('2024-01-15'),
        status: 'COMPLETED',
        userId: user.id,
      },
    }),
    prisma.contact.create({
      data: {
        customerId: customers[0].id,
        type: 'EMAIL',
        subject: 'Follow-up Email',
        description: 'Sent product information and pricing',
        date: new Date('2024-01-20'),
        status: 'COMPLETED',
        userId: user.id,
      },
    }),
    prisma.contact.create({
      data: {
        customerId: customers[1].id,
        type: 'MEETING',
        subject: 'Product Demo',
        description: 'Scheduled demo for next week',
        date: new Date('2024-01-25'),
        status: 'PLANNED',
        userId: user.id,
      },
    }),
  ])

  console.log('✅ Created contacts:', contacts.length)

  // Create sample sales pipeline entries
  const pipelines = await Promise.all([
    prisma.salesPipeline.create({
      data: {
        customerId: customers[1].id,
        stage: 'QUALIFIED',
        value: 25000,
        probability: 60,
        expectedCloseDate: new Date('2024-03-15'),
        notes: 'Good fit for our solution',
      },
    }),
    prisma.salesPipeline.create({
      data: {
        customerId: customers[2].id,
        stage: 'PROPOSAL',
        value: 75000,
        probability: 80,
        expectedCloseDate: new Date('2024-02-28'),
        notes: 'Enterprise deal in progress',
      },
    }),
  ])

  console.log('✅ Created pipeline entries:', pipelines.length)

  // Create sample tasks
  const tasks = await Promise.all([
    prisma.task.create({
      data: {
        title: 'Follow up with John Smith',
        description: 'Call to discuss pricing options',
        dueDate: new Date('2024-01-30'),
        priority: 'HIGH',
        status: 'PENDING',
        customerId: customers[0].id,
        userId: user.id,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Prepare demo for Sarah',
        description: 'Create custom demo for TechStart',
        dueDate: new Date('2024-02-05'),
        priority: 'MEDIUM',
        status: 'PENDING',
        customerId: customers[1].id,
        userId: user.id,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Send proposal to Mike',
        description: 'Finalize and send enterprise proposal',
        dueDate: new Date('2024-02-10'),
        priority: 'HIGH',
        status: 'IN_PROGRESS',
        customerId: customers[2].id,
        userId: user.id,
      },
    }),
  ])

  console.log('✅ Created tasks:', tasks.length)

  console.log('🎉 Database seeding completed!')
  console.log('\n📋 Test Credentials:')
  console.log('Email: admin@example.com')
  console.log('Password: password123')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 