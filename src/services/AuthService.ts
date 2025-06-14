import { User } from "@src/database/schemas/UserSchema";
import { GenerateUniqueId } from "@src/libs/GenerateRandomUuid";
import { CompareHashedPassword, CreateHashedPassword } from "@src/libs/HashPassword";
import { Authenticate } from "@src/libs/Jwt";
import { CountryListType, LoginData, LoginResponse, RegisterUserData, SignupResponse } from "@src/types/auth";
import CountryList from "@src/utils/CountryList";
import { ObjectId } from "mongoose";

async function SignupService(registerUserData: RegisterUserData): Promise<SignupResponse> {
    try {
        const { country, email, lastName, firstName, password, phoneNumber } = registerUserData
        if (!firstName || !lastName || !email || !password) {
            return {
                error: true,
                message: 'Please provide all required fields.',
            };
        }

        if (password.length < 6) {
            return {
                error: true,
                message: 'Password must be at least 6 characters long.',
            };
        }

        if (!CountryList.includes(country as CountryListType)) {
            return {
                error: true,
                message: 'Please provide a valid country.',
            };
        }

        if (!email.includes('@')) {
            return {
                error: true,
                message: 'Please provide a valid email address.',
            };
        }



        const checkEmail = await User.findOne({
            email: email
        })

        if (checkEmail) {
            return {
                error: true,
                message: 'Email already exists.',
            };
        }
        const hashedPassword = await CreateHashedPassword(password);
        const newUser = new User({
            firstName,
            lastName,
            country,
            email,
            username: email.split('@')[0], // Use the part before '@' as username
            password: hashedPassword,
            phoneNumber: phoneNumber || "",
            isVerified: false,
            isActive: true,
            isAdmin: false,
            isBlocked: false,
            userId: GenerateUniqueId(),
        })

        newUser.save();

        if (!newUser) {
            return {
                error: true,
                message: 'Failed to register user. Please try again later.',
            };
        }

        return {
            error: false,
            message: 'User registered successfully.',
            payload: {
                _id: newUser._id as ObjectId,
                userId: newUser.userId,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
                country: newUser?.country!,
                createdAt: newUser.createdAt,
            }
        }

    } catch (error) {
        throw new Error(error.message);
    }
}


// Login Service

async function LoginService(loginData: LoginData): Promise<LoginResponse> {
    try {
        const { email, password } = loginData;
        if (!email || !password) {
            return {
                error: true,
                message: 'Please provide both email and password.'
            };
        }
        const user = await User.findOne({
            email: email
        }).select('+password'); // Ensure password is included for comparison
        if (!user) {
            return {
                error: true,
                message: 'User not found.'
            };
        }
        const isPasswordValid = await CompareHashedPassword(password, user.password);
        if (!isPasswordValid) {
            return {
                error: true,
                message: 'Invalid password.'
            };
        }

        const accessToken = await Authenticate(user)
        if (!accessToken) {
            return {
                error: true,
                message: 'Failed to generate access token. Please try again later.'
            };
        }
        return {
            error: false,
            message: 'Login successful.',
            accessToken: accessToken,
            payload: {
                _id: user._id as ObjectId,
                userId: user.userId,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                createdAt: user.createdAt,
            }
        };
    } catch (error) {
        throw new Error(error.message);
    }
}

export { SignupService, LoginService };