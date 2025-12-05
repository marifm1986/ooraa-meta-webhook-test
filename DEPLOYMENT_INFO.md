# Deployment Information

## Your Production URLs

**Main Domain:** https://ooraa-meta-webhook-test.vercel.app/

**Facebook Webhook Callback URL:**
```
https://ooraa-meta-webhook-test.vercel.app/facebook/webhook
```

## Facebook App Configuration

### Step 1: Configure Webhook in Facebook App Dashboard

1. Go to [Facebook App Dashboard](https://developers.facebook.com/apps)
2. Select your App
3. Navigate to **Products** > **Webhooks**
4. Click **Configure** next to **Page**
5. Click **Add Subscription**

### Step 2: Enter These Values

**Callback URL:**
```
https://ooraa-meta-webhook-test.vercel.app/facebook/webhook
```

**Verify Token:**
```
ymyMetawebhookOoraa2025
```

**Subscription Fields:**
- ✅ Check `leadgen`

### Step 3: Click "Verify and Save"

Facebook will send a GET request to verify your webhook. If configured correctly, you'll see a green checkmark ✓

## Testing Your Webhook

### Test 1: Verify Webhook is Live

Open this URL in your browser:
```
https://ooraa-meta-webhook-test.vercel.app/facebook/webhook?hub.mode=subscribe&hub.verify_token=ymyMetawebhookOoraa2025&hub.challenge=test123
```

**Expected Response:** `test123`

If you see `test123`, your webhook is working! ✅

### Test 2: Check Environment Variables in Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: `ooraa-meta-webhook-test`
3. Go to **Settings** > **Environment Variables**
4. Verify these are set:

```
FACEBOOK_VERIFY_TOKEN=ymyMetawebhookOoraa2025
FACEBOOK_PAGE_ACCESS_TOKEN=EAASmryecK9QBQDj0v7Oi7lTT0t0h3exgZBVUPC99oOUewCUv6o024nDishTJm6ZAn48VXjJDZAXkyRoRFL8gsZAbOQhqjtho5OJSTTMKbSv54ZB7riLTsVuXOUItoTJa2O9UF5gcWJTsV2ZBcBltAecO95C8riQ6KsZBKICrAaDRCgzz2eWJxx2PxZAnh8iD107qH7GCuRAa4MyeW2LkZBwI5usUja8W625HXve3Wp4dTg5TFF1KIX8CkLry9xZCLP2myysoITcf9Qdu15dmxCZBRIeZBZCZAY8qZCx7ARwshf9rzzCNUTbPucwOXPVPVj4cZCQKQNVhA93wuAZDZD
FORTHCRM_POST_URL=https://login.forthcrm.com/post/8cff5e1b3e11b891fe021f9e4c64ff2d169ece58/
```

⚠️ **Important:** After adding/changing environment variables, you must redeploy your app for changes to take effect.

### Test 3: Submit a Test Lead

1. Go to your Facebook Page
2. Create or use an existing Lead Ad
3. Submit a test lead
4. Check Vercel logs to see the webhook processing:
   - Go to Vercel Dashboard > Your Project > Deployments
   - Click on your latest deployment
   - Click **Functions** tab to see logs

## Data Flow

```
User Submits Lead on Facebook
        ↓
Facebook sends POST to:
https://ooraa-meta-webhook-test.vercel.app/facebook/webhook
        ↓
Your webhook receives leadgen_id
        ↓
Fetches full lead data from Facebook Graph API
        ↓
Transforms data (name, email, phone, etc.)
        ↓
Sends to ForthCRM:
https://login.forthcrm.com/post/8cff5e1b3e11b891fe021f9e4c64ff2d169ece58/
        ↓
Lead appears in ForthCRM ✅
```

## Monitoring Logs

### View Real-time Logs in Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select `ooraa-meta-webhook-test`
3. Click **Deployments**
4. Click on your latest deployment
5. Click **Functions** tab
6. You'll see logs for:
   - Webhook verification attempts
   - Incoming lead notifications
   - Lead data fetched from Facebook
   - Data sent to ForthCRM
   - Any errors

### What to Look For in Logs

**Successful verification:**
```
Facebook verification request received: { mode: 'subscribe', token: 'ymyMetawebhookOoraa2025', challenge: '...' }
Webhook verified successfully
```

**Successful lead processing:**
```
Lead generation event: { leadgenId: '...', formId: '...', pageId: '...' }
Processing lead: ...
Lead data fetched: { ... }
Transformed data for ForthCRM: { ... }
Lead sent to ForthCRM: ...
```

## Troubleshooting

### Issue: Webhook verification fails in Facebook

**Solution:**
1. Make sure the Verify Token in Facebook exactly matches: `ymyMetawebhookOoraa2025`
2. Test the verification URL in your browser first
3. Check that your Vercel deployment is live
4. Verify the callback URL has no typos

### Issue: Not receiving leads in ForthCRM

**Solution:**
1. Check Vercel Function logs for errors
2. Verify `FACEBOOK_PAGE_ACCESS_TOKEN` is valid
3. Test by submitting a lead and watching the logs
4. Ensure ForthCRM URL is correct

### Issue: Facebook token expired

**Solution:**
1. Facebook tokens expire periodically
2. Generate a new Page Access Token
3. Update `FACEBOOK_PAGE_ACCESS_TOKEN` in Vercel
4. Redeploy the application

## Quick Reference

| Item | Value |
|------|-------|
| Webhook URL | https://ooraa-meta-webhook-test.vercel.app/facebook/webhook |
| Verify Token | ymyMetawebhookOoraa2025 |
| Subscription Field | leadgen |
| ForthCRM URL | https://login.forthcrm.com/post/8cff5e1b3e11b891fe021f9e4c64ff2d169ece58/ |

## Next Steps

1. ✅ Deploy to Vercel (if not already done)
2. ✅ Set environment variables in Vercel
3. ✅ Test verification URL in browser
4. ✅ Configure webhook in Facebook App Dashboard
5. ✅ Subscribe to Page events
6. ✅ Submit test lead
7. ✅ Verify lead appears in ForthCRM

---

**Last Updated:** December 6, 2025
**Domain:** https://ooraa-meta-webhook-test.vercel.app/
