# 🚀 Quick Start - Vercel Deployment

## Your Webhook URL
```
https://ooraa-meta-webhook-test.vercel.app/facebook/webhook
```

## ⚡ Fast Setup (3 Steps)

### Step 1: Set Environment Variables in Vercel

**Open:** [Vercel Dashboard](https://vercel.com/dashboard) → Your Project → Settings → Environment Variables

Add these 3 variables (copy from `VERCEL_ENV_SETUP.txt`):

1. `FACEBOOK_VERIFY_TOKEN` = `ymyMetawebhookOoraa2025`
2. `FACEBOOK_PAGE_ACCESS_TOKEN` = (your token from .env.local)
3. `FORTHCRM_POST_URL` = `https://login.forthcrm.com/post/8cff5e1b3e11b891fe021f9e4c64ff2d169ece58/`

### Step 2: Deploy/Redeploy

Push to GitHub or click "Redeploy" in Vercel Dashboard

### Step 3: Configure Facebook

**Facebook App Dashboard** → Webhooks → Add Subscription

- **Callback URL:** `https://ooraa-meta-webhook-test.vercel.app/facebook/webhook`
- **Verify Token:** `ymyMetawebhookOoraa2025`
- **Fields:** ✅ leadgen

## ✅ Test It

Open this URL:
```
https://ooraa-meta-webhook-test.vercel.app/facebook/webhook?hub.mode=subscribe&hub.verify_token=ymyMetawebhookOoraa2025&hub.challenge=test123
```

Should see: `test123`

## 📚 Detailed Guides

- **Deployment:** See [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md)
- **Environment Variables:** See [VERCEL_ENV_SETUP.txt](VERCEL_ENV_SETUP.txt)
- **Your Domain Setup:** See [DEPLOYMENT_INFO.md](DEPLOYMENT_INFO.md)
- **General Setup:** See [WEBHOOK_SETUP.md](WEBHOOK_SETUP.md)

## 🔒 Security

✅ `.env.local` is git-ignored (never pushed to GitHub)
✅ All secrets stored in Vercel Dashboard
✅ Environment variables encrypted by Vercel

## 📊 Monitor Logs

**Vercel Dashboard** → Deployments → Latest → Functions tab

Real-time logs show:
- Webhook verifications
- Incoming leads
- Data sent to ForthCRM
- Any errors
