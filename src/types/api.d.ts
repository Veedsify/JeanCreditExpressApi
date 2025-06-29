export interface ApiResponse<T = any> {
    error: boolean;
    message?: string;
    data?: T;
}

export interface PaginatedResponse<T = any> {
    error: boolean;
    message?: string;
    data?: {
        items: T[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    };
}

// Dashboard types
export interface DashboardOverview {
    wallet: {
        balanceNGN: number;
        balanceGHS: number;
        totalBalance: number;
    };
    recentTransactions: any[];
    exchangeRates: {
        ngnToGhs: number;
        ghsToNgn: number;
    };
    quickStats: {
        totalTransactions: number;
        pendingTransactions: number;
        completedTransactions: number;
    };
}

// Wallet types
export interface WalletBalance {
    balanceNGN: number;
    balanceGHS: number;
    totalDeposits: number;
    totalWithdrawals: number;
    isActive: boolean;
}

export interface TopUpRequest {
    amount: number;
    currency: 'NGN' | 'GHS';
    paymentMethod: 'paystack' | 'momo';
    paymentReference?: string;
}

export interface WithdrawRequest {
    amount: number;
    currency: 'NGN' | 'GHS';
    withdrawalMethod: 'bank' | 'momo';
    accountDetails: {
        accountNumber?: string;
        bankCode?: string;
        momoNumber?: string;
        network?: string;
    };
}

// Conversion types
export interface ConversionRequest {
    fromCurrency: 'NGN' | 'GHS';
    toCurrency: 'NGN' | 'GHS';
    amount: number;
}

export interface ConversionResult {
    conversionId: string;
    fromCurrency: string;
    toCurrency: string;
    originalAmount: number;
    fee: number;
    convertedAmount: number;
    rate: number;
    status: string;
}

// Transaction types
export interface TransactionFilter {
    page?: number;
    limit?: number;
    status?: 'pending' | 'completed' | 'failed';
    type?: 'deposit' | 'withdrawal' | 'conversion' | 'transfer';
    currency?: 'NGN' | 'GHS';
    fromDate?: string;
    toDate?: string;
    userId?: string;
    search?: string;
}

// Admin types
export interface AdminLoginRequest {
    email: string;
    password: string;
}

export interface AdminDashboard {
    summary: {
        totalUsers: number;
        totalTransactions: number;
        pendingTransactions: number;
        completedTransactions: number;
        failedTransactions: number;
    };
    monthlyVolume: any[];
    recentTransactions: any[];
}

// Settings types
export interface UserSettingsUpdate {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    email?: string;
}

export interface PasswordChangeRequest {
    currentPassword: string;
    newPassword: string;
}

export interface UserPreferences {
    emailNotifications: boolean;
    smsNotifications: boolean;
    currency: 'NGN' | 'GHS';
}

// Webhook types
export interface PaystackWebhookData {
    event: string;
    data: {
        reference: string;
        amount: number;
        currency: string;
        customer: any;
        [key: string]: any;
    };
}

export interface MomoWebhookData {
    event: string;
    data: {
        reference: string;
        amount: number;
        currency: string;
        [key: string]: any;
    };
}
