
export default {
  Base: '/api',
  Auth: {
    Base: '/auth',
    Login: '/login',
    Signup: '/signup',
    Logout: '/logout',
  },
  Users: {
    Base: '/users',
    Get: '/all',
    Add: '/add',
    Update: '/update',
    Delete: '/delete/:id',
  },
  Wallet: {
    Base: '/wallet',
    Get: '/all',
    Create: '/add',
    Update: '/update',
    Delete: '/delete/:id',
  }
} as const;
