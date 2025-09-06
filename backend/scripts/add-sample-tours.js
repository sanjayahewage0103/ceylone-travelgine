const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/user.model');
const TourPackage = require('../models/tourPackage.model');
const path = require('path');

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ceylone-travelgine')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

const createSampleTours = async () => {
  try {
    // First, check if we have any users with guide role
    const guideUser = await User.findOne({ role: 'guide' });
    
    let guideId;
    if (!guideUser) {
      console.log('No guide user found, creating one...');
      // Create a guide user if none exists
      const newGuide = new User({
        fullName: 'Sample Guide',
        email: 'guide@example.com',
        contact: '+94771234567',
        nic: '901234567V',
        passwordHash: '$2a$10$XFPJgp5bSG9HK8W.hzoDm.vwz7MmSMGuGCqvp5g1x8MpIwlUBJW0K', // Password: password123
        role: 'guide'
      });
      const savedGuide = await newGuide.save();
      guideId = savedGuide._id;
      console.log('Created new guide user with ID:', guideId);
    } else {
      guideId = guideUser._id;
      console.log('Using existing guide user with ID:', guideId);
    }

    // Check if we already have tour packages
    const existingCount = await TourPackage.countDocuments();
    if (existingCount > 0) {
      console.log(`${existingCount} tour packages already exist. Skipping creation.`);
      return;
    }

    // Sample tours data
    const sampleTours = [
      {
        package_name: 'Kandy Cultural Heritage Tour',
        guide_id: guideId,
        description: 'Explore the ancient city of Kandy, including the Temple of the Tooth Relic and the Royal Botanical Gardens.',
        duration: 'full-day',
        max_group_size: 10,
        price_lkr: 12500,
        itinerary: [
          {
            day: 1,
            stops: [
              { stop: 'Temple of the Tooth Relic', time: '09:00 AM' },
              { stop: 'Royal Botanical Gardens', time: '12:00 PM' },
              { stop: 'Kandy Lake', time: '03:00 PM' },
              { stop: 'Cultural Dance Show', time: '05:00 PM' }
            ]
          }
        ],
        inclusions: ['Transportation', 'English-speaking guide', 'Entrance fees', 'Bottled water'],
        exclusions: 'Meals and personal expenses are not included',
        availability: ['2023-09-01', '2023-09-02', '2023-09-03'],
        languages: ['English', 'Sinhala'],
        images: ['/uploads/1756919825357-453823165-SrilankaMap.jpg', '/uploads/1756919825379-553784552-image.png'],
        status: 'published',
        tourType: 'Cultural',
        tourCategory: 'Day Tour'
      },
      {
        package_name: 'Sigiriya Rock Fortress Adventure',
        guide_id: guideId,
        description: 'Climb the iconic Sigiriya Rock Fortress and explore the ancient ruins and beautiful gardens.',
        duration: 'full-day',
        max_group_size: 8,
        price_lkr: 15000,
        itinerary: [
          {
            day: 1,
            stops: [
              { stop: 'Sigiriya Rock Fortress', time: '08:00 AM' },
              { stop: 'Water Gardens', time: '11:30 AM' },
              { stop: 'Pidurangala Rock', time: '02:00 PM' }
            ]
          }
        ],
        inclusions: ['Transportation', 'English-speaking guide', 'Entrance fees', 'Lunch', 'Bottled water'],
        exclusions: 'Personal expenses and souvenirs are not included',
        availability: ['2023-09-05', '2023-09-06', '2023-09-07'],
        languages: ['English', 'Sinhala', 'German'],
        images: ['/uploads/1756919825384-633168789-download.jpeg', '/uploads/1756919825384-921330818-Slide_13_Roadmap_Timeline.png'],
        status: 'published',
        tourType: 'Adventure',
        tourCategory: 'Day Tour'
      },
      {
        package_name: 'Galle Fort Walking Tour',
        guide_id: guideId,
        description: 'Discover the colonial charm of Galle Fort with its Dutch architecture, boutique shops, and ocean views.',
        duration: 'half-day',
        max_group_size: 12,
        price_lkr: 8000,
        itinerary: [
          {
            day: 1,
            stops: [
              { stop: 'Galle Lighthouse', time: '10:00 AM' },
              { stop: 'Dutch Reformed Church', time: '11:30 AM' },
              { stop: 'Maritime Museum', time: '01:00 PM' },
              { stop: 'Sunset at Flag Rock', time: '05:30 PM' }
            ]
          }
        ],
        inclusions: ['English-speaking guide', 'Bottled water'],
        exclusions: 'Transportation, meals, and entrance fees are not included',
        availability: ['2023-09-10', '2023-09-11', '2023-09-12'],
        languages: ['English', 'Sinhala', 'French'],
        images: ['/uploads/1756922758868-728739561-image.png', '/uploads/1756922794322-32711981-SrilankaMap.jpg'],
        status: 'published',
        tourType: 'Cultural',
        tourCategory: 'Walking Tour'
      },
      {
        package_name: 'Yala Safari Experience',
        guide_id: guideId,
        description: 'Embark on an exciting safari in Yala National Park to spot leopards, elephants, and diverse birdlife.',
        duration: 'full-day',
        max_group_size: 6,
        price_lkr: 18000,
        itinerary: [
          {
            day: 1,
            stops: [
              { stop: 'Morning Safari', time: '05:30 AM' },
              { stop: 'Breakfast at the Park', time: '09:00 AM' },
              { stop: 'Evening Safari', time: '03:00 PM' }
            ]
          }
        ],
        inclusions: ['Safari jeep', 'Park entrance fees', 'English-speaking guide', 'Breakfast', 'Bottled water'],
        exclusions: 'Transportation to Yala and personal expenses are not included',
        availability: ['2023-09-15', '2023-09-16', '2023-09-17'],
        languages: ['English', 'Sinhala'],
        images: ['/uploads/1756922808857-485270120-image.png', '/uploads/1c2ebb20e3f4a049ca038db4e13e15db'],
        status: 'published',
        tourType: 'Wildlife',
        tourCategory: 'Safari'
      },
      {
        package_name: 'Ella Highlands Trek',
        guide_id: guideId,
        description: 'Trek through the beautiful tea plantations and misty mountains of Ella, including Little Adam\'s Peak and Nine Arch Bridge.',
        duration: 'full-day',
        max_group_size: 10,
        price_lkr: 10000,
        itinerary: [
          {
            day: 1,
            stops: [
              { stop: 'Little Adam\'s Peak', time: '08:00 AM' },
              { stop: 'Nine Arch Bridge', time: '11:00 AM' },
              { stop: 'Ravana Falls', time: '02:00 PM' },
              { stop: 'Tea Factory Tour', time: '04:00 PM' }
            ]
          }
        ],
        inclusions: ['Local transportation', 'English-speaking guide', 'Tea factory entrance', 'Bottled water'],
        exclusions: 'Meals and personal expenses are not included',
        availability: ['2023-09-20', '2023-09-21', '2023-09-22'],
        languages: ['English', 'Sinhala'],
        images: ['/uploads/54f2adab312bdc42328fc21df6b8be6e', '/uploads/620b0c174363990406a35243f6bfd6ff'],
        status: 'published',
        tourType: 'Adventure',
        tourCategory: 'Trekking'
      }
    ];

    // Insert the sample tours
    await TourPackage.insertMany(sampleTours);
    console.log('5 sample tour packages added successfully!');
    
  } catch (error) {
    console.error('Error adding sample tours:', error);
  } finally {
    mongoose.connection.close();
    console.log('Database connection closed');
  }
};

createSampleTours();
