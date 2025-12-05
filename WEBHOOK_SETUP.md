# Facebook Lead Gen Webhook Setup Guide

This guide explains how to set up the Facebook webhook integration to capture leads and send them to ForthCRM.

## Overview

The webhook handles the complete flow:
1. Verifies Facebook webhook requests (GET)
2. Receives lead notifications from Facebook (POST)
3. Fetches complete lead data from Facebook Graph API
4. Transforms and sends data to ForthCRM

## Prerequisites

- Facebook Business account
- Facebook Page
- Facebook App with Lead Ads permissions
- ForthCRM account with POST URL
- Deployed Next.js application with HTTPS

## Step 1: Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

2. Edit `.env.local` and add your values:

```env
# Choose a secure random string (e.g., "mySecureToken123")
FACEBOOK_VERIFY_TOKEN=your_secure_random_token_here

# Get this from Facebook App Dashboard
FACEBOOK_PAGE_ACCESS_TOKEN=your_facebook_page_access_token_here

# Your ForthCRM destination URL (already provided)
FORTHCRM_POST_URL=https://login.forthcrm.com/post/8cff5e1b3e11b891fe021f9e4c64ff2d169ece58/
```

### How to Get Facebook Page Access Token

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Select your App
3. Go to **Tools** > **Graph API Explorer**
4. Select your Page
5. Add permissions: `leads_retrieval`, `pages_manage_ads`, `pages_read_engagement`
6. Click **Generate Access Token**
7. For production, convert to long-lived token:
   ```
   https://graph.facebook.com/v20.0/oauth/access_token?
     grant_type=fb_exchange_token&
     client_id={app-id}&
     client_secret={app-secret}&
     fb_exchange_token={short-lived-token}
   ```

## Step 2: Deploy Your Application

Deploy to a hosting provider that supports HTTPS (required by Facebook):

### Option 1: Vercel (Recommended)
```bash
npm install -g vercel
vercel --prod
```

### Option 2: Other platforms
- Netlify
- AWS Amplify
- Railway
- Your own server with HTTPS

Your webhook URL will be:
```
https://yourdomain.com/facebook/webhook
```

## Step 3: Configure Facebook Webhook

1. Go to [Facebook App Dashboard](https://developers.facebook.com/apps)
2. Select your App
3. Go to **Products** > **Webhooks**
4. Click **Configure** next to **Page**
5. Click **Add Subscription**

### Webhook Configuration:

**Callback URL:**
```
https://yourdomain.com/facebook/webhook
```

**Verify Token:**
```
(Use the same value as FACEBOOK_VERIFY_TOKEN in your .env.local)
```

**Subscription Fields:**
- Check `leadgen` (Lead Generation)

6. Click **Verify and Save**

If successful, you'll see a green checkmark ✓

## Step 4: Subscribe to Page Events

1. In Facebook App Dashboard, go to **Webhooks**
2. Under **Page**, click **Add Subscriptions**
3. Select your Facebook Page
4. Subscribe to `leadgen` events

## Step 5: Test the Webhook

### Test Verification (GET Request)

Visit this URL in your browser:
```
https://yourdomain.com/facebook/webhook?hub.mode=subscribe&hub.verify_token=YOUR_VERIFY_TOKEN&hub.challenge=test123
```

You should see: `test123`

### Test Lead Submission

1. Go to your Facebook Page
2. Create a test Lead Ad or use an existing one
3. Submit a test lead
4. Check your server logs to see the webhook processing

## Step 6: Configure Lead Form Field Mapping

The webhook automatically maps common Facebook Lead Form fields. If your form uses custom field names, update the mapping in `transformLeadDataForForthCRM()` function:

```typescript
// Default mappings
const firstName = fieldData['first_name'] || fieldData['full_name']?.split(' ')[0] || '';
const lastName = fieldData['last_name'] || fieldData['full_name']?.split(' ').slice(1).join(' ') || '';
const email = fieldData['email'] || '';
const phone = fieldData['phone_number'] || fieldData['phone'] || '';
const debtAmount = fieldData['debt_amount'] || fieldData['how_much_debt'] || '';
const state = fieldData['state'] || fieldData['location'] || '';
```

Add your custom field names as alternatives.

## Monitoring and Debugging

### View Logs

Check your deployment platform's logs to monitor webhook activity:

**Vercel:**
```bash
vercel logs
```

**Local Development:**
```bash
npm run dev
```

Then check the terminal output.

### Common Issues

#### 1. Verification Failed (403)
- Check that `FACEBOOK_VERIFY_TOKEN` matches the value in Facebook App settings
- Ensure the token is exactly the same (case-sensitive)

#### 2. Lead Data Not Received
- Verify `FACEBOOK_PAGE_ACCESS_TOKEN` is valid and has correct permissions
- Check token permissions include `leads_retrieval`
- Ensure webhook is subscribed to the correct Page

#### 3. ForthCRM Not Receiving Data
- Check `FORTHCRM_POST_URL` is correct
- Verify the data format matches ForthCRM's expected structure
- Check server logs for error messages

#### 4. Webhook Timeout
- Facebook expects a 200 response within 20 seconds
- The webhook processes leads asynchronously to respond quickly
- Check server performance if timeouts occur

## Data Flow

```
┌─────────────────┐
│  Facebook User  │
│  Submits Lead   │
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│  Facebook Lead Ad Form  │
└────────┬────────────────┘
         │
         ▼
┌──────────────────────────────┐
│  Facebook Webhook (POST)     │
│  Sends: leadgen_id, form_id  │
└────────┬─────────────────────┘
         │
         ▼
┌────────────────────────────────┐
│  Your Webhook Endpoint         │
│  /facebook/webhook             │
└────────┬───────────────────────┘
         │
         ▼
┌────────────────────────────────┐
│  Fetch Lead from Graph API     │
│  GET /{leadgen_id}             │
└────────┬───────────────────────┘
         │
         ▼
┌────────────────────────────────┐
│  Transform Data                │
│  Map to ForthCRM format        │
└────────┬───────────────────────┘
         │
         ▼
┌────────────────────────────────┐
│  Send to ForthCRM              │
│  POST to ForthCRM URL          │
└────────────────────────────────┘
```

## Security Best Practices

1. **Keep tokens secure**: Never commit `.env.local` to git
2. **Use long-lived tokens**: Convert short-lived tokens to long-lived for production
3. **Verify webhook signature**: Consider adding signature verification for production
4. **Rate limiting**: Implement rate limiting if handling high volume
5. **Error handling**: Monitor and log errors for troubleshooting

## Facebook API Versions

This implementation uses Facebook Graph API v20.0. To update:

1. Change the version in the Graph API URL:
```typescript
const url = `https://graph.facebook.com/v21.0/${leadgenId}?access_token=${PAGE_ACCESS_TOKEN}`;
```

2. Test thoroughly as field names may change between versions

## Support

If you encounter issues:

1. Check Facebook's [Webhook Documentation](https://developers.facebook.com/docs/graph-api/webhooks)
2. Review [Lead Ads API Documentation](https://developers.facebook.com/docs/marketing-api/guides/lead-ads)
3. Check server logs for detailed error messages
4. Verify all environment variables are set correctly
