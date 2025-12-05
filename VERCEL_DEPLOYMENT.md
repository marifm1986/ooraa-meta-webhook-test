# Vercel Serverless Deployment Guide

## ⚠️ Important: Environment Variables for Vercel

**DO NOT** push `.env.local` or `.env` files to your repository. These files are git-ignored for security.

Instead, you must configure environment variables directly in the Vercel Dashboard.

## Step-by-Step Deployment

### Step 1: Push Your Code to GitHub

```bash
git add .
git commit -m "Add Facebook webhook integration"
git push origin main
```

### Step 2: Deploy to Vercel

#### Option A: Deploy via Vercel Dashboard (Recommended)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New"** → **"Project"**
3. Import your GitHub repository
4. Vercel will auto-detect it's a Next.js project
5. **DO NOT** click Deploy yet - go to Step 3 first

#### Option B: Deploy via CLI

```bash
npm install -g vercel
vercel
```

### Step 3: Configure Environment Variables in Vercel

**CRITICAL:** You must add these environment variables BEFORE your first deployment (or redeploy after adding them).

1. In your Vercel project settings, go to **Settings** → **Environment Variables**

2. Add these three variables:

#### Variable 1: FACEBOOK_VERIFY_TOKEN
- **Key:** `FACEBOOK_VERIFY_TOKEN`
- **Value:** `ymyMetawebhookOoraa2025`
- **Environment:** Check all (Production, Preview, Development)

#### Variable 2: FACEBOOK_PAGE_ACCESS_TOKEN
- **Key:** `FACEBOOK_PAGE_ACCESS_TOKEN`
- **Value:** `EAASmryecK9QBQDj0v7Oi7lTT0t0h3exgZBVUPC99oOUewCUv6o024nDishTJm6ZAn48VXjJDZAXkyRoRFL8gsZAbOQhqjtho5OJSTTMKbSv54ZB7riLTsVuXOUItoTJa2O9UF5gcWJTsV2ZBcBltAecO95C8riQ6KsZBKICrAaDRCgzz2eWJxx2PxZAnh8iD107qH7GCuRAa4MyeW2LkZBwI5usUja8W625HXve3Wp4dTg5TFF1KIX8CkLry9xZCLP2myysoITcf9Qdu15dmxCZBRIeZBZCZAY8qZCx7ARwshf9rzzCNUTbPucwOXPVPVj4cZCQKQNVhA93wuAZDZD`
- **Environment:** Check all (Production, Preview, Development)

#### Variable 3: FORTHCRM_POST_URL
- **Key:** `FORTHCRM_POST_URL`
- **Value:** `https://login.forthcrm.com/post/8cff5e1b3e11b891fe021f9e4c64ff2d169ece58/`
- **Environment:** Check all (Production, Preview, Development)

3. Click **"Save"** for each variable

### Step 4: Deploy (or Redeploy)

If you already deployed, you MUST redeploy for environment variables to take effect:

1. Go to **Deployments** tab
2. Click the **"..."** menu on the latest deployment
3. Click **"Redeploy"**

OR

Just push a new commit:
```bash
git commit --allow-empty -m "Trigger redeploy with env vars"
git push
```

### Step 5: Verify Environment Variables Are Set

After deployment completes:

1. Go to your deployment
2. Click **Functions** tab
3. Click on any function (e.g., `facebook/webhook`)
4. Check **Environment Variables** section
5. You should see all three variables listed (values are hidden for security)

## Your Production Webhook URL

```
https://ooraa-meta-webhook-test.vercel.app/facebook/webhook
```

## Test Your Deployment

### Test 1: Webhook Verification

Open this URL in your browser:
```
https://ooraa-meta-webhook-test.vercel.app/facebook/webhook?hub.mode=subscribe&hub.verify_token=ymyMetawebhookOoraa2025&hub.challenge=test123
```

**Expected Response:** `test123`

✅ If you see `test123` - Your webhook is working!
❌ If you see an error - Check that environment variables are set and redeploy

### Test 2: Check Function Logs

1. Go to Vercel Dashboard → Your Project
2. Click **Deployments** → Click your latest deployment
3. Click **Functions** tab
4. Look for the `/facebook/webhook` function
5. You should see logs when you access the URL

## Configure Facebook Webhook

Now that your Vercel deployment is working, configure Facebook:

1. Go to [Facebook App Dashboard](https://developers.facebook.com/apps)
2. Select your App
3. Go to **Products** → **Webhooks**
4. Click **Configure** next to **Page**
5. Click **Add Subscription**

**Enter these values:**
- **Callback URL:** `https://ooraa-meta-webhook-test.vercel.app/facebook/webhook`
- **Verify Token:** `ymyMetawebhookOoraa2025`
- **Subscription Fields:** Check `leadgen`

6. Click **"Verify and Save"**

You should see a green checkmark ✓

## Monitoring and Debugging

### View Real-time Logs

1. Go to Vercel Dashboard → Your Project
2. Click **Deployments** → Latest deployment
3. Click **Functions** tab
4. Logs appear in real-time as webhooks are received

### Common Issues

#### Issue 1: Environment variables not working

**Symptoms:**
- Webhook returns 403 Forbidden
- Logs show `undefined` for environment variables

**Solution:**
1. Check that env vars are set in Vercel Dashboard
2. Ensure you checked all environments (Production, Preview, Development)
3. Redeploy after adding env vars
4. Wait 1-2 minutes for deployment to complete

#### Issue 2: Facebook verification fails

**Symptoms:**
- Facebook shows "Webhook verification failed"
- Test URL returns 403

**Solution:**
1. Verify the token in Vercel matches: `ymyMetawebhookOoraa2025`
2. Test the verification URL manually first
3. Check Function logs for error messages
4. Ensure deployment is live (not building)

#### Issue 3: Leads not reaching ForthCRM

**Symptoms:**
- Webhook receives lead
- Logs show lead data
- ForthCRM doesn't receive it

**Solution:**
1. Check `FORTHCRM_POST_URL` is correct in Vercel
2. Look for error messages in Function logs
3. Verify Facebook token has `leads_retrieval` permission
4. Test with a real lead submission

## Security Best Practices for Vercel

✅ **DO:**
- Set all secrets in Vercel Dashboard Environment Variables
- Keep `.env.local` in `.gitignore` (already done)
- Use different tokens for Production vs Preview environments if needed
- Rotate Facebook tokens periodically

❌ **DON'T:**
- Push `.env` or `.env.local` to GitHub
- Hardcode secrets in your code
- Share your Facebook Page Access Token
- Commit sensitive credentials

## Updating Environment Variables

If you need to update a token (e.g., Facebook token expires):

1. Go to Vercel Dashboard → Settings → Environment Variables
2. Click **"Edit"** on the variable
3. Update the value
4. Click **"Save"**
5. **IMPORTANT:** Redeploy for changes to take effect
   - Go to Deployments → Click "..." → "Redeploy"

## Vercel Serverless Function Limits

- **Execution Time:** 10 seconds (Hobby), 60 seconds (Pro)
- **Payload Size:** 4.5 MB
- **Memory:** 1024 MB (Hobby), 3008 MB (Pro)

Your webhook is optimized to:
- Return 200 OK immediately to Facebook (< 1 second)
- Process leads asynchronously
- Stay well within these limits

## Domain Configuration (Optional)

If you want to use a custom domain:

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain
3. Update Facebook webhook URL to use your custom domain
4. Update DNS records as instructed by Vercel

## Quick Reference Commands

### Deploy to Vercel (CLI)
```bash
vercel --prod
```

### View Logs (CLI)
```bash
vercel logs
```

### Check Environment Variables (CLI)
```bash
vercel env ls
```

### Add Environment Variable (CLI)
```bash
vercel env add FACEBOOK_VERIFY_TOKEN
```

## Support Resources

- [Vercel Environment Variables Docs](https://vercel.com/docs/environment-variables)
- [Vercel Serverless Functions Docs](https://vercel.com/docs/serverless-functions)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)

---

**Your Webhook URL:** https://ooraa-meta-webhook-test.vercel.app/facebook/webhook
**Verify Token:** ymyMetawebhookOoraa2025
**Deployment:** Vercel Serverless
