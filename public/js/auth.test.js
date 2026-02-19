
// Mock Firebase services
const mockAuth = {
  onAuthStateChanged: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  signInWithPopup: jest.fn(),
  signOut: jest.fn(),
};

const mockDb = {
  collection: jest.fn(() => ({
    doc: jest.fn(() => ({
      get: jest.fn(() => Promise.resolve({ exists: false })),
      set: jest.fn(),
    })),
  })),
};

// Mock Firebase module
const firebase = {
  auth: () => mockAuth,
  firestore: () => mockDb,
};

// Mock DOM elements
document.body.innerHTML = `
  <div id="auth-buttons-container"></div>
  <div id="user-avatar-container" style="display: none;">
    <img id="user-avatar-img" src="" />
  </div>
  <a id="logout-link"></a>
  <form id="signup-form">
    <input id="signup-email" />
    <input id="signup-password" />
  </form>
  <form id="login-form">
    <input id="login-email" />
    <input id="login-password" />
  </form>
  <button id="google-signin-button"></button>
`;

// Run the script
require('./auth.js');

describe('Authentication flow', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('onAuthStateChanged', () => {
    it('should show user avatar when user is logged in and verified', () => {
      const user = { emailVerified: true, photoURL: 'test.jpg' };
      mockAuth.onAuthStateChanged.mock.calls[0][0](user);

      expect(document.querySelector('#auth-buttons-container').style.display).toBe('none');
      expect(document.querySelector('#user-avatar-container').style.display).toBe('block');
      expect(document.querySelector('#user-avatar-img').src).toContain('test.jpg');
    });

    it('should show login buttons when user is not verified', () => {
      const user = { emailVerified: false };
      mockAuth.onAuthStateChanged.mock.calls[0][0](user);

      expect(document.querySelector('#auth-buttons-container').style.display).toBe('flex');
      expect(document.querySelector('#user-avatar-container').style.display).toBe('none');
    });

    it('should show login buttons when user is logged out', () => {
      mockAuth.onAuthStateChanged.mock.calls[0][0](null);

      expect(document.querySelector('#auth-buttons-container').style.display).toBe('flex');
      expect(document.querySelector('#user-avatar-container').style.display).toBe('none');
    });
  });

  describe('Logout', () => {
    it('should sign out the user and redirect', async () => {
      const preventDefault = jest.fn();
      const signOut = jest.fn(() => Promise.resolve());
      mockAuth.signOut = signOut;

      document.querySelector('#logout-link').dispatchEvent(new Event('click', { preventDefault }));
      await Promise.resolve(); // Wait for promises to resolve

      expect(preventDefault).toHaveBeenCalled();
      expect(signOut).toHaveBeenCalled();
      expect(window.location.href).toBe('/index.html');
    });
  });

  describe('Signup', () => {
    it('should create a new user and send verification email', async () => {
      const user = { sendEmailVerification: jest.fn(() => Promise.resolve()) };
      const userCredential = { user };
      mockAuth.createUserWithEmailAndPassword.mockResolvedValue(userCredential);

      document.querySelector('#signup-form').dispatchEvent(new Event('submit'));
      await Promise.resolve();

      expect(mockAuth.createUserWithEmailAndPassword).toHaveBeenCalled();
      expect(user.sendEmailVerification).toHaveBeenCalled();
    });
  });

  describe('Login', () => {
    it('should login the user and redirect if email is verified', async () => {
      const user = { emailVerified: true };
      const userCredential = { user };
      mockAuth.signInWithEmailAndPassword.mockResolvedValue(userCredential);

      document.querySelector('#login-form').dispatchEvent(new Event('submit'));
      await Promise.resolve();

      expect(mockAuth.signInWithEmailAndPassword).toHaveBeenCalled();
      expect(window.location.href).toBe('/index.html');
    });

    it('should show alert if email is not verified', async () => {
      const user = { emailVerified: false, sendEmailVerification: jest.fn() };
      const userCredential = { user };
      window.alert = jest.fn();
      mockAuth.signInWithEmailAndPassword.mockResolvedValue(userCredential);

      document.querySelector('#login-form').dispatchEvent(new Event('submit'));
      await Promise.resolve();

      expect(mockAuth.signInWithEmailAndPassword).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalled();
      expect(user.sendEmailVerification).toHaveBeenCalled();
    });
  });

  describe('Google Sign-in', () => {
    it('should initiate Google sign-in and redirect', async () => {
      const user = {};
      const result = { user };
      mockAuth.signInWithPopup.mockResolvedValue(result);

      document.querySelector('#google-signin-button').dispatchEvent(new Event('click'));
      await Promise.resolve();

      expect(mockAuth.signInWithPopup).toHaveBeenCalled();
      expect(window.location.href).toBe('/index.html');
    });
  });
});
