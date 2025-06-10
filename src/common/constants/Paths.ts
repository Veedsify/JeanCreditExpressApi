
export default {
  Base: '/api',
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
