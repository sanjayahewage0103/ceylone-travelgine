/**
 * Script to add sample tour package data
 * Run with: node scripts/add-sample-tour-data.js
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const TourPackage = require('../models/tourPackage.model');
const User = require('../models/user.model');
const connectDB = require('../config/db');

dotenv.config();

// Sample tour packages data
const sampleTourPackages = [
  {
    package_name: 'Cultural Triangle Explorer',
    description: 'Discover the rich cultural heritage of Sri Lanka with this comprehensive tour of the Cultural Triangle. Visit ancient ruins, sacred temples, and UNESCO World Heritage sites as you delve into the island\'s fascinating history.',
    duration: 'multi-day',
    max_group_size: 10,
    price_lkr: 69900,
    itinerary: [
      {
        day: 1,
        stops: [
          { stop: 'Pickup from Colombo', time: '08:00' },
          { stop: 'Visit Dambulla Cave Temple', time: '13:00' },
          { stop: 'Check-in to hotel in Sigiriya', time: '16:00' }
        ]
      },
      {
        day: 2,
        stops: [
          { stop: 'Climb Sigiriya Rock Fortress', time: '08:00' },
          { stop: 'Visit Polonnaruwa Ancient City', time: '14:00' },
          { stop: 'Return to hotel', time: '18:00' }
        ]
      },
      {
        day: 3,
        stops: [
          { stop: 'Visit Anuradhapura Sacred City', time: '09:00' },
          { stop: 'Sri Maha Bodhi Tree', time: '14:00' },
          { stop: 'Return to Colombo', time: '18:00' }
        ]
      }
    ],
    inclusions: ['Hotel accommodation', 'Air-conditioned transportation', 'English-speaking guide', 'Entrance fees', 'Daily breakfast'],
    exclusions: 'Lunches, dinners, and personal expenses are not included',
    languages: ['English', 'German', 'French'],
    tourType: 'Cultural',
    tourCategory: 'Premium',
    status: 'published',
    images: ['1756919825357-453823165-SrilankaMap.jpg'] // Using an image from your uploads folder
  },
  {
    package_name: 'Beach Paradise Getaway',
    description: 'Relax and unwind on Sri Lanka\'s stunning southern beaches. Enjoy pristine sands, crystal-clear waters, and luxurious accommodations as you experience the perfect tropical beach holiday.',
    duration: 'multi-day',
    max_group_size: 8,
    price_lkr: 59900,
    itinerary: [
      {
        day: 1,
        stops: [
          { stop: 'Pickup from Colombo', time: '09:00' },
          { stop: 'Beach resort check-in at Mirissa', time: '13:00' },
          { stop: 'Sunset beach dinner', time: '18:00' }
        ]
      },
      {
        day: 2,
        stops: [
          { stop: 'Whale watching tour', time: '06:00' },
          { stop: 'Free time at the beach', time: '12:00' },
          { stop: 'Seafood BBQ dinner', time: '19:00' }
        ]
      },
      {
        day: 3,
        stops: [
          { stop: 'Visit Galle Fort', time: '10:00' },
          { stop: 'Shopping in Galle', time: '13:00' },
          { stop: 'Return to resort', time: '16:00' }
        ]
      }
    ],
    inclusions: ['Beach resort accommodation', 'Transportation', 'Whale watching tour', 'Daily breakfast', 'Welcome drink'],
    exclusions: 'Additional activities, lunches, dinners, and personal expenses are not included',
    languages: ['English', 'Russian'],
    tourType: 'Beach',
    tourCategory: 'Luxury',
    status: 'published',
    images: ['1756919825384-633168789-download.jpeg'] // Using an image from your uploads folder
  },
  {
    package_name: 'Tea Country Explorer',
    description: 'Journey through Sri Lanka\'s picturesque hill country and discover the secrets of Ceylon tea. Visit working tea plantations, stay in colonial bungalows, and enjoy cool mountain air and spectacular scenery.',
    duration: 'multi-day',
    max_group_size: 12,
    price_lkr: 49900,
    itinerary: [
      {
        day: 1,
        stops: [
          { stop: 'Departure from Colombo', time: '07:00' },
          { stop: 'Visit Ramboda Falls', time: '12:00' },
          { stop: 'Check-in to hotel in Nuwara Eliya', time: '15:00' }
        ]
      },
      {
        day: 2,
        stops: [
          { stop: 'Tea plantation tour', time: '09:00' },
          { stop: 'Tea factory visit', time: '11:00' },
          { stop: 'Lunch at colonial club', time: '13:00' },
          { stop: 'Horton Plains hike', time: '15:00' }
        ]
      },
      {
        day: 3,
        stops: [
          { stop: 'Scenic train journey to Ella', time: '09:00' },
          { stop: 'Nine Arch Bridge', time: '13:00' },
          { stop: 'Little Adam\'s Peak hike', time: '15:00' },
          { stop: 'Return to hotel', time: '18:00' }
        ]
      }
    ],
    inclusions: ['Hotel accommodation', 'Transportation', 'English-speaking guide', 'Tea factory tours', 'Daily breakfast'],
    exclusions: 'Train tickets, additional activities, lunches, dinners, and personal expenses are not included',
    languages: ['English', 'Chinese'],
    tourType: 'Nature',
    tourCategory: 'Standard',
    status: 'published',
    images: ['1756919825379-553784552-image.png'] // Using an image from your uploads folder
  }
];

// Add sample tour data function
async function addSampleTourData() {
  try {
    await connectDB();
    console.log('Connected to database');
    
    // Check if tour packages already exist
    const count = await TourPackage.countDocuments();
    if (count > 0) {
      console.log(`${count} tour packages already exist. Skipping sample data creation.`);
      process.exit(0);
    }
    
    // Find a guide user (with role guide or admin if no guide)
    const guideUser = await User.findOne({ role: 'guide' }) || await User.findOne({ role: 'admin' });
    
    if (!guideUser) {
      console.error('No guide or admin user found. Create a user with role guide or admin first.');
      process.exit(1);
    }
    
    // Add guide_id to sample data
    const tourPackagesWithGuide = sampleTourPackages.map(pkg => ({
      ...pkg,
      guide_id: guideUser._id
    }));
    
    // Insert sample tour packages
    const result = await TourPackage.insertMany(tourPackagesWithGuide);
    console.log(`${result.length} sample tour packages added successfully.`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error adding sample tour data:', error);
    process.exit(1);
  }
}

// Run the function
addSampleTourData();
