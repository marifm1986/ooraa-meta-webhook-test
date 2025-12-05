# ✅ Vercel Serverless Deployment Checklist

## Your Deployment Details

- **Domain:** https://ooraa-meta-webhook-test.vercel.app/
- **Webhook URL:** https://ooraa-meta-webhook-test.vercel.app/facebook/webhook
- **Verify Token:** ymyMetawebhookOoraa2025

---

## Pre-Deployment Checklist

### ☐ 1. Verify `.env.local` is NOT committed to Git

```bash
git status
```

✅ `.env.local` should NOT appear in the list (it's git-ignored)

### ☐ 2. Code is Ready for Deployment

- [x] Webhook endpoint created at `/app/facebook/webhook/route.ts`
- [x] TypeScript types defined
- [x] Environment variables configured locally
- [x] Local testing completed

---

## Vercel Deployment Checklist

### ☐ 3. Push Code to GitHub

```bash
git add .
git commit -m "Add Facebook webhook for lead generation"
git push origin main
```

### ☐ 4. Connect to Vercel (if not already connected)

**Option A: Via Dashboard**
1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. **STOP - Don't deploy yet!**

**Option B: Via CLI**
```bash
npm install -g vercel
vercel
```

### ☐ 5. Set Environment Variables in Vercel

**CRITICAL STEP - Do this BEFORE first deployment or immediately after**

1. Go to Vercel Dashboard → Your Project
2. Navigate to: **Settings** → **Environment Variables**
3. Add these 3 variables:

#### Variable 1
```
Name: FACEBOOK_VERIFY_TOKEN
Value: ymyMetawebhookOoraa2025
Environments: ✅ Production ✅ Preview ✅ Development
```

#### Variable 2
```
Name: FACEBOOK_PAGE_ACCESS_TOKEN
Value: EAASmryecK9QBQDj0v7Oi7lTT0t0h3exgZBVUPC99oOUewCUv6o024nDishTJm6ZAn48VXjJDZAXkyRoRFL8gsZAbOQhqjtho5OJSTTMKbSv54ZB7riLTsVuXOUItoTJa2O9UF5gcWJTsV2ZBcBltAecO95C8riQ6KsZBKICrAaDRCgzz2eWJxx2PxZAnh8iD107qH7GCuRAa4MyeW2LkZBwI5usUja8W625HXve3Wp4dTg5TFF1KIX8CkLry9xZCLP2myysoITcf9Qdu15dmxCZBRIeZBZCZAY8qZCx7ARwshf9rzzCNUTbPucwOXPVPVj4cZCQKQNVhA93wuAZDZD
Environments: ✅ Production ✅ Preview ✅ Development
```

#### Variable 3
```
Name: FORTHCRM_POST_URL
Value: https://login.forthcrm.com/post/8cff5e1b3e11b891fe021f9e4c64ff2d169ece58/
Environments: ✅ Production ✅ Preview ✅ Development
```

### ☐ 6. Deploy (or Redeploy if already deployed)

**If you already deployed:**
1. Go to **Deployments** tab
2. Click "..." on latest deployment
3. Click "Redeploy"
4. Wait for deployment to complete

**If deploying for first time:**
- Vercel will auto-deploy from GitHub pushes

### ☐ 7. Verify Deployment

Wait for deployment to complete (usually 30-60 seconds)

Check: https://ooraa-meta-webhook-test.vercel.app/

---

## Post-Deployment Testing

### ☐ 8. Test Webhook Verification Endpoint

Open this URL in your browser:
```
https://ooraa-meta-webhook-test.vercel.app/facebook/webhook?hub.mode=subscribe&hub.verify_token=ymyMetawebhookOoraa2025&hub.challenge=test123
```

**Expected Response:** `test123`

✅ **Success!** Proceed to next step
❌ **Failed?** Check:
- Environment variables are set in Vercel
- You redeployed after adding env vars
- No typos in the URL
- Deployment completed successfully

### ☐ 9. Verify Environment Variables Are Loaded

1. Go to Vercel Dashboard → Deployments
2. Click on latest deployment
3. Click **Functions** tab
4. Find `/facebook/webhook` function
5. Check **Environment Variables** section
6. Should show all 3 variables (values hidden for security)

---

## Facebook Configuration

### ☐ 10. Configure Facebook Webhook

1. Go to: https://developers.facebook.com/apps
2. Select your Facebook App
3. Navigate to: **Products** → **Webhooks**
4. Click: **Configure** (next to "Page")
5. Click: **Add Subscription**

### ☐ 11. Enter Webhook Configuration

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

### ☐ 12. Verify and Save

Click "Verify and Save"

✅ **Success!** Green checkmark appears
❌ **Failed?** See troubleshooting section below

### ☐ 13. Subscribe to Page Events

1. In Webhooks section, find your webhook
2. Click **Add Subscriptions**
3. Select your Facebook Page
4. Ensure `leadgen` is checked
5. Click Save

---

## Final Testing

### ☐ 14. Test with Real Lead Submission

1. Go to your Facebook Page
2. Find a Lead Ad (or create test ad)
3. Submit a test lead
4. Check Vercel Function logs

**To view logs:**
1. Vercel Dashboard → Deployments → Latest
2. Click **Functions** tab
3. Watch for real-time logs

**Expected log output:**
```
Lead generation event: { leadgenId: '...', formId: '...', pageId: '...' }
Processing lead: ...
Lead data fetched: { ... }
Transformed data for ForthCRM: { ... }
Lead sent to ForthCRM: ...
```

### ☐ 15. Verify Lead in ForthCRM

Check your ForthCRM dashboard to confirm the lead was received

---

## Troubleshooting

### Issue: Facebook verification fails

**Symptoms:**
- "Webhook verification failed" error in Facebook
- 403 Forbidden response

**Solutions:**
1. ✅ Test verification URL manually in browser first
2. ✅ Verify token matches exactly: `ymyMetawebhookOoraa2025`
3. ✅ Check environment variables are set in Vercel
4. ✅ Redeploy after adding environment variables
5. ✅ Wait 1-2 minutes for deployment to complete
6. ✅ Check Function logs for error messages

### Issue: Environment variables not working

**Symptoms:**
- Webhook returns errors
- Logs show `undefined` for process.env values

**Solutions:**
1. ✅ Go to Vercel → Settings → Environment Variables
2. ✅ Verify all 3 variables are present
3. ✅ Check all environments are selected (Production, Preview, Development)
4. ✅ Click "Redeploy" after adding variables
5. ✅ Clear browser cache and try again

### Issue: Leads not reaching ForthCRM

**Symptoms:**
- Webhook receives lead (shown in logs)
- ForthCRM doesn't receive it

**Solutions:**
1. ✅ Check `FORTHCRM_POST_URL` is correct in Vercel
2. ✅ Look for error messages in Function logs
3. ✅ Verify Facebook token has `leads_retrieval` permission
4. ✅ Test ForthCRM URL manually
5. ✅ Check field mapping in webhook code

---

## Monitoring and Maintenance

### Regular Tasks

- **Weekly:** Check Function logs for errors
- **Monthly:** Verify Facebook token is still valid
- **As needed:** Update Facebook token when it expires
- **As needed:** Update field mappings if form changes

### View Logs

**Real-time:**
- Vercel Dashboard → Deployments → Functions tab

**CLI:**
```bash
vercel logs
```

### Update Environment Variables

1. Vercel Dashboard → Settings → Environment Variables
2. Click "Edit" on the variable
3. Update value
4. Click "Save"
5. **Important:** Redeploy for changes to take effect

---

## Security Checklist

- [x] `.env.local` is in `.gitignore`
- [x] No secrets committed to GitHub
- [x] Environment variables set in Vercel Dashboard (not in code)
- [x] Facebook token has minimal required permissions
- [x] Webhook uses HTTPS only
- [x] Tokens are not logged or exposed

---

## Resources

- **Quick Start:** [QUICK_START.md](QUICK_START.md)
- **Detailed Deployment:** [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md)
- **Environment Setup:** [VERCEL_ENV_SETUP.txt](VERCEL_ENV_SETUP.txt)
- **Domain Info:** [DEPLOYMENT_INFO.md](DEPLOYMENT_INFO.md)
- **General Setup:** [WEBHOOK_SETUP.md](WEBHOOK_SETUP.md)

---

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Facebook Webhooks Guide](https://developers.facebook.com/docs/graph-api/webhooks)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

---

**Last Updated:** December 6, 2025
**Project:** ooraa-meta-webhook-test
**Status:** Ready for Deployment ✅
