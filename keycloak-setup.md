# Keycloak 3FA & Social Login Integration Guide

This guide explains how to configure your Keycloak instance (at `http://172.234.229.103:9999`) to support multi-factor authentication (3FA) and social identity providers.

## 1. Enabling 3FA (Three-Factor Authentication)

Typically, 3FA refers to:
1. **Something you know** (Password)
2. **Something you have** (OTP App on Phone)
3. **Something you are/have** (Biometrics or Physical USB Key/WebAuthn)

### Configure OTP (Google Authenticator/Authy)
1. Log in to the Keycloak Admin Console.
2. Go to **Authentication** > **Flows**.
3. Select **Browser** flow.
4. Ensure **OTP Form** is set to `REQUIRED`.
5. In **Authentication** > **OTP Policy**, configure your preferred settings (e.g., Time-based, 6 digits).

### Configure WebAuthn (Physical USB Keys / Yubikey)
1. In the Admin Console, go to **Authentication** > **WebAuthn Policy**.
2. Configure **Signature Algorithms** (usually `ES256`).
3. Set **User Verification Requirement** to `required` if you want Biometrics/PIN as well.
4. Go to **Authentication** > **Flows** > **Browser**.
5. Add a "WebAuthn Authenticator" step and set it to `REQUIRED` to enforce physical keys.

---

## 2. Social Logins (Google, Facebook, GitHub)

### GitHub Integration
1. Register a new OAuth App at [GitHub Developer Settings](https://github.com/settings/developers).
2. Use Homepage URL: `https://TheOfficialBlackSheepCompany.com`.
3. Use Authorization Callback URL: `http://172.234.229.103:9999/realms/TOBSCo/broker/github/endpoint`.
4. In Keycloak: Go to **Identity Providers** > **Add GitHub**.
5. Paste the **Client ID** and **Client Secret**.

### Google Integration
1. Create a project at [Google Cloud Console](https://console.cloud.google.com/).
2. Setup **OAuth 2.0 Client IDs**.
3. Authorized Redirect URIs: `http://172.234.229.103:9999/realms/TOBSCo/broker/google/endpoint`.
4. In Keycloak: Go to **Identity Providers** > **Add Google**.
5. Paste **Client ID** and **Client Secret**.

### Facebook Integration
1. Create an app at [Meta for Developers](https://developers.facebook.com/).
2. Add **Facebook Login**.
3. Valid OAuth Redirect URIs: `http://172.234.229.103:9999/realms/TOBSCo/broker/facebook/endpoint`.
4. In Keycloak: Go to **Identity Providers** > **Add Facebook**.
5. Paste **App ID** and **App Secret**.

---

## 3. Integrating with the Portal

To use these in your website, you should use the [Keycloak JavaScript Adapter](https://www.keycloak.org/docs/latest/securing_apps/index.html#_javascript_adapter).

1. Add the Keycloak script to your HTML:
```html
<script src="http://172.234.229.103:9999/js/keycloak.js"></script>
```
2. Initialize it in your `index.js`:
```javascript
const keycloak = new Keycloak({
    url: 'http://172.234.229.103:9999',
    realm: 'TOBSCo',
    clientId: 'portal-client'
});

keycloak.init({ onLoad: 'check-sso' }).then(authenticated => {
    if (authenticated) {
        // Set user role in localStorage for RBAC
        localStorage.setItem('tbs_user_role', keycloak.tokenParsed.resource_access['portal-client'].roles.includes('employee') ? 'employee' : 'guest');
    }
});
```
