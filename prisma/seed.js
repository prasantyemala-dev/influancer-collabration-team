const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Sample Locations: Mumbai, Delhi, Goa, Vizag, Chennai
  const locations = [
    { city: 'Mumbai', lat: 19.0760, lng: 72.8777 },
    { city: 'Delhi', lat: 28.7041, lng: 77.1025 },
    { city: 'Goa', lat: 15.2993, lng: 74.1240 },
    { city: 'Vizag', lat: 17.6868, lng: 83.2185 },
    { city: 'Chennai', lat: 13.0827, lng: 80.2707 },
  ];

  const usersData = [
    {
      name: 'Amit Vlogs',
      email: 'amit@example.com',
      bio: 'Travel vlogger exploring India.',
      category_tags: 'Travel,Vlog',
      subscriber_range: '10k-100k',
      skills: 'Editing,Drone',
      verified: true,
      locIndex: 0,
    },
    {
      name: 'Sara Tech',
      email: 'sara@example.com',
      bio: 'Tech reviews and unboxing.',
      category_tags: 'Tech,Reviews',
      subscriber_range: '1k-10k',
      skills: 'Camera,Lighting',
      verified: false,
      locIndex: 1,
    },
    {
      name: 'Goa Guide',
      email: 'goa@example.com',
      bio: 'Showing the best of Goa.',
      category_tags: 'Travel,Lifestyle',
      subscriber_range: '10k-100k',
      skills: 'Guide,Host',
      verified: true,
      locIndex: 2,
    },
    {
      name: 'Vizag Foodie',
      email: 'foodie@example.com',
      bio: 'Street food hunter.',
      category_tags: 'Food,Vlog',
      subscriber_range: '1k-10k',
      skills: 'Editing',
      verified: false,
      locIndex: 3,
    },
    {
      name: 'Chennai Music',
      email: 'music@example.com',
      bio: 'Indie music producer.',
      category_tags: 'Music,Production',
      subscriber_range: '100k+',
      skills: 'Audio,Mixing',
      verified: true,
      locIndex: 4,
    },
    {
      name: 'Rohan Films',
      email: 'rohan@example.com',
      bio: 'Short filmmaker.',
      category_tags: 'Film,Drama',
      subscriber_range: '0-1k',
      skills: 'Directing,Scripting',
      verified: false,
      locIndex: 0,
    },
    {
      name: 'Delhi Explorer',
      email: 'delhi@example.com',
      bio: 'Historical places in Delhi.',
      category_tags: 'Travel,History',
      subscriber_range: '1k-10k',
      skills: 'Photography',
      verified: false,
      locIndex: 1,
    },
     {
      name: 'Beach Vibes',
      email: 'beach@example.com',
      bio: 'Surfing and sun.',
      category_tags: 'Lifestyle,Sports',
      subscriber_range: '10k-100k',
      skills: 'Action Cam',
      verified: true,
      locIndex: 2,
    },
    {
      name: 'South Spice',
      email: 'spice@example.com',
      bio: 'Cooking traditional recipes.',
      category_tags: 'Cooking,Food',
      subscriber_range: '100k+',
      skills: 'Cooking,Presentation',
      verified: true,
      locIndex: 4,
    },
    {
      name: 'Urban Lens',
      email: 'lens@example.com',
      bio: 'Street photography and videography.',
      category_tags: 'Photography,Art',
      subscriber_range: '1k-10k',
      skills: 'Editing,Color Grading',
      verified: false,
      locIndex: 0,
    },
  ];

  for (const u of usersData) {
    const loc = locations[u.locIndex];
    // Randomize location slightly so they don't overlap perfectly
    const lat = loc.lat + (Math.random() - 0.5) * 0.01;
    const lng = loc.lng + (Math.random() - 0.5) * 0.01;

    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        name: u.name,
        email: u.email,
        password: 'password', // Mock password
        bio: u.bio,
        category_tags: u.category_tags,
        subscriber_range: u.subscriber_range,
        skills: u.skills,
        verified: u.verified,
        city: loc.city,
        country: 'India',
        lat: lat,
        lng: lng,
        profile_pic: `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=random`,
      },
    });
  }

  // Posts
  const postsData = [
    {
      creator_email: 'amit@example.com',
      title: 'Drone operator needed',
      description: 'Need a drone shot for my travel vlog intro. 2 hours work.',
      city: 'Mumbai',
      pay_amount: '₹2000',
      tags: 'Drone,Camera',
    },
    {
      creator_email: 'goa@example.com',
      title: 'Editor for 2-day project',
      description: 'Looking for someone to edit 3 vlogs. fast turnaround needed.',
      city: 'Goa',
      pay_amount: '₹5000',
      tags: 'Editing,Premiere Pro',
    },
    {
      creator_email: 'delhi@example.com',
      title: 'Local guide for vlogs',
      description: 'Visiting Old Delhi, need a local who knows hidden spots.',
      city: 'Delhi',
      pay_amount: '₹1500',
      tags: 'Guide,History',
    },
     {
      creator_email: 'music@example.com',
      title: 'Videographer for music video',
      description: 'Shooting a cover song on the beach.',
      city: 'Chennai',
      pay_amount: '₹8000',
      tags: 'Camera,Music Video',
    },
     {
      creator_email: 'foodie@example.com',
      title: 'Collab for food challenge',
      description: 'Eating the spiciest curry in Vizag. Need a partner!',
      city: 'Vizag',
      pay_amount: 'Collab',
      tags: 'Food,Fun',
    }
  ];

  for (const p of postsData) {
    const creator = await prisma.user.findUnique({ where: { email: p.creator_email } });
    if (creator) {
      await prisma.post.create({
        data: {
          creator_id: creator.id,
          title: p.title,
          description: p.description,
          city: p.city,
          lat: creator.lat, // Approximate
          lng: creator.lng,
          pay_amount: p.pay_amount,
          tags: p.tags,
        },
      });
    }
  }

  console.log('Seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
