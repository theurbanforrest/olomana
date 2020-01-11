/// routes.js


/// Public + static
export const LANDING = '/';
export const SANDBOX = '/sandbox';

/// Public + real-time database
export const LOGIN = '/login';
export const SIGN_UP = '/signup';
export const PASSWORD_FORGET = '/pw-forget';

/// Public + firestore
export const VIEW_ALL_THREADS = '/threads';
export const VIEW_ALL_THREADS_PAGINATED_SLUG = '/threads?page=';


/// Protected + static
export const HOME = '/home';

/// Protected + real-time database
export const ACCOUNT = '/account';
export const ADMIN = '/admin';
export const THREAD = '/thread/:uid';
export const THREADEDITOR = '/thread/:uid/edit';
export const THREADDYNAMIC = '/thread/:uid/dynamic';

/// Protected + firestore
export const DASHBOARD = '/dashboard';
export const DASHBOARD_PAGINATED_SLUG = '/dashboard?page=';
export const CREATE_THREAD = '/create-thread';


