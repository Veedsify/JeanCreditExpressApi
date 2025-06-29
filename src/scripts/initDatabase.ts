#!/usr/bin/env ts-node

import { connectDB } from '../database/connection';
import { seedDatabase, createSampleData } from '../utils/seedDatabase';

async function initializeDatabase() {
    try {
        console.log('🚀 Initializing JeanPay Database...\n');

        // Connect to database
        console.log('📦 Connecting to database...');
        await connectDB();
        console.log('✅ Database connected successfully\n');

        // Run seeding
        await seedDatabase();
        console.log('');

        // Ask if user wants sample data (in production, this would be false)
        const createSamples = process.env.NODE_ENV === 'development';

        if (createSamples) {
            console.log('🧪 Development mode detected - creating sample data...');
            await createSampleData();
            console.log('');
        }

        console.log('🎉 Database initialization completed!');
        console.log('\n📋 Summary:');
        console.log('   - Admin user: admin@jeanpay.com (password: admin123)');

        if (createSamples) {
            console.log('   - Test users: john@example.com, jane@example.com (password: password123)');
        }

        console.log('   - Default exchange rates configured');
        console.log('\n🚀 Your JeanPay API is ready to use!');

        process.exit(0);
    } catch (error) {
        console.error('❌ Database initialization failed:', error);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    initializeDatabase();
}

export default initializeDatabase;
