/// routes.js


/// Public + static
export const LANDING = '/';

/// Public + real-time database
export const LOGIN = '/login';
export const SIGN_UP = '/signup';
export const PASSWORD_FORGET = '/pw-forget';

/// Public + firestore
export const VIEW_ALL_THREADS = '/threads';


/// Protected + static
export const HOME = '/home';

/// Protected + real-time database
export const ACCOUNT = '/account';
export const ADMIN = '/admin';
export const THREAD = '/thread/:uid';

/// Protected + firestore
export const DASHBOARD = '/dashboard';
export const CREATE_THREAD = '/create-thread';


