# Google OAuth Setup Instructions

To enable Google login functionality, you need to set up Google OAuth credentials:

## 1. Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API (or Google Identity API)

## 2. Configure OAuth Consent Screen

1. Go to "APIs & Services" > "OAuth consent screen"
2. Choose "External" user type
3. Fill in the required information:
   - App name: "zcreens"
   - User support email: your email
   - Developer contact information: your email

## 3. Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Add authorized redirect URIs:
   - `http://localhost:3001/api/auth/callback/google` (for development)
   - `https://yourdomain.com/api/auth/callback/google` (for production)

## 4. Update Environment Variables

Replace the placeholder values in `.env.local`:

```env
GOOGLE_CLIENT_ID=your-actual-google-client-id-here
GOOGLE_CLIENT_SECRET=your-actual-google-client-secret-here
```

## 5. Test the Integration

1. Start your development server: `npm run dev`
2. Navigate to `http://localhost:3001`
3. Click "Continue with Google" to test the OAuth flow

## Notes

- The current setup uses placeholder credentials that won't work
- You must replace them with real Google OAuth credentials
- For production, make sure to update the redirect URI to your production domain
- Keep your client secret secure and never commit it to version control
