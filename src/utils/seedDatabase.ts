import { User } from '../database/schemas/UserSchema';
import { ExchangeRate } from '../database/schemas/AdminSchema';
import { CreateHashedPassword } from '../libs/HashPassword';
import { GenerateUniqueId } from '../libs/GenerateRandomUuid';

/**
 * Seed database with initial data
 */
export async function seedDatabase() {
    try {
        console.log('🌱 Starting database seeding...');

        // Create admin user if doesn't exist
        const adminEmail = 'admin@jeanpay.com';
        const existingAdmin = await User.findOne({ email: adminEmail });

        if (!existingAdmin) {
            const hashedPassword = await CreateHashedPassword('admin123');

            const adminUser = new User({
                firstName: 'Admin',
                lastName: 'User',
                username: 'admin',
                email: adminEmail,
                password: hashedPassword,
                isAdmin: true,
                isVerified: true,
                isActive: true,
                userId: GenerateUniqueId(),
                country: 'NGN',
            });

            await adminUser.save();
            console.log('✅ Admin user created:', adminEmail);
            console.log('🔑 Admin password: admin123');
        } else {
            console.log('ℹ️  Admin user already exists');
        }

        // Create default exchange rates if they don't exist
        const existingRates = await ExchangeRate.find();

        if (existingRates.length === 0) {
            const defaultRates = [
                {
                    fromCurrency: 'NGN',
                    toCurrency: 'GHS',
                    rate: 0.0053,
                    source: 'manual',
                    setBy: 'system',
                    isActive: true,
                    validFrom: new Date(),
                },
                {
                    fromCurrency: 'GHS',
                    toCurrency: 'NGN',
                    rate: 188.68,
                    source: 'manual',
                    setBy: 'system',
                    isActive: true,
                    validFrom: new Date(),
                }
            ];

            await ExchangeRate.insertMany(defaultRates);
            console.log('✅ Default exchange rates created');
        } else {
            console.log('ℹ️  Exchange rates already exist');
        }

        console.log('🎉 Database seeding completed successfully!');

        return {
            success: true,
            message: 'Database seeded successfully',
        };
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        return {
            success: false,
            message: 'Failed to seed database',
            error,
        };
    }
}

/**
 * Create sample test data for development
 */
export async function createSampleData() {
    try {
        console.log('🧪 Creating sample test data...');

        // Create sample users
        const sampleUsers = [
            {
                firstName: 'John',
                lastName: 'Doe',
                username: 'johndoe',
                email: 'john@example.com',
                password: await CreateHashedPassword('password123'),
                userId: GenerateUniqueId(),
                country: 'NGN',
                isVerified: true,
                phoneNumber: '+2348123456789',
            },
            {
                firstName: 'Jane',
                lastName: 'Smith',
                username: 'janesmith',
                email: 'jane@example.com',
                password: await CreateHashedPassword('password123'),
                userId: GenerateUniqueId(),
                country: 'GHS',
                isVerified: true,
                phoneNumber: '+233123456789',
            }
        ];

        for (const userData of sampleUsers) {
            const existingUser = await User.findOne({ email: userData.email });
            if (!existingUser) {
                const user = new User(userData);
                await user.save();
                console.log(`✅ Sample user created: ${userData.email}`);
            }
        }

        console.log('🎉 Sample data creation completed!');
        console.log('📧 Test user emails: john@example.com, jane@example.com');
        console.log('🔑 Test user password: password123');

        return {
            success: true,
            message: 'Sample data created successfully',
        };
    } catch (error) {
        console.error('❌ Error creating sample data:', error);
        return {
            success: false,
            message: 'Failed to create sample data',
            error,
        };
    }
}

// Export for use in other parts of the application
export default {
    seedDatabase,
    createSampleData,
};
