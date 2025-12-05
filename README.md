# Facebook Lead Gen to ForthCRM Webhook

A Next.js application that acts as a middleware webhook to receive Facebook Lead Ads data and forward it to ForthCRM.

## Why This Solution?

Facebook webhooks cannot point directly to ForthCRM because:

1. ❌ ForthCRM cannot respond to Facebook's verification challenge
2. ❌ ForthCRM cannot fetch complete lead data from Facebook Graph API
3. ❌ Facebook only sends `leadgen_id`, not the actual lead details

This middleware webhook solves all these problems by:

1. ✅ Handling Facebook's verification GET request
2. ✅ Receiving POST webhook notifications from Facebook
3. ✅ Fetching complete lead data from Facebook Graph API
4. ✅ Transforming and mapping the data
5. ✅ Sending formatted data to ForthCRM

## Architecture

```
Facebook Lead Ad → Facebook Webhook → This Middleware → ForthCRM
                   (leadgen_id)       (fetches full data)  (receives complete lead)
```

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your values:

```env
FACEBOOK_VERIFY_TOKEN=your_secure_random_token_here
FACEBOOK_PAGE_ACCESS_TOKEN=your_facebook_page_access_token_here
FORTHCRM_POST_URL=https://login.forthcrm.com/post/8cff5e1b3e11b891fe021f9e4c64ff2d169ece58/
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

The webhook endpoint will be available at:
```
http://localhost:3000/api/facebook/webhook
```

### 4. Deploy to Production

Deploy to Vercel (recommended):

```bash
npm install -g vercel
vercel --prod
```

Or deploy to any platform that supports Next.js and HTTPS.

### 5. Configure Facebook Webhook

See [WEBHOOK_SETUP.md](./WEBHOOK_SETUP.md) for detailed setup instructions.

## Project Structure

```
.
├── app/
│   ├── api/
│   │   └── facebook/
│   │       └── webhook/
│   │           └── route.ts          # Main webhook endpoint
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── types/
│   └── facebook.ts                    # TypeScript type definitions
├── .env.example                       # Environment variables template
├── .env.local                         # Your local environment variables (git-ignored)
├── WEBHOOK_SETUP.md                   # Detailed setup guide
└── README.md
```

## Webhook Endpoints

### GET `/api/facebook/webhook`

Handles Facebook webhook verification.

**Parameters:**
- `hub.mode` - Should be "subscribe"
- `hub.verify_token` - Must match `FACEBOOK_VERIFY_TOKEN`
- `hub.challenge` - Random string to echo back

**Response:**
- Returns `hub.challenge` value if verification succeeds
- Returns 403 if verification fails

### POST `/api/facebook/webhook`

Receives lead generation events from Facebook.

**Request Body:**
```json
{
  "object": "page",
  "entry": [
    {
      "id": "page_id",
      "time": 1234567890,
      "changes": [
        {
          "field": "leadgen",
          "value": {
            "leadgen_id": "123456789",
            "form_id": "987654321",
            "page_id": "page_id"
          }
        }
      ]
    }
  ]
}
```

**Process:**
1. Receives webhook notification
2. Extracts `leadgen_id`
3. Fetches full lead data from Facebook Graph API
4. Transforms data to ForthCRM format
5. Sends to ForthCRM POST URL

## Data Mapping

The webhook automatically maps Facebook Lead Form fields to ForthCRM format:

| Facebook Field | ForthCRM Field | Fallback Fields |
|---------------|----------------|-----------------|
| first_name | first_name | full_name (split) |
| last_name | last_name | full_name (split) |
| email | email | - |
| phone_number | phone | phone |
| debt_amount | debt_amount | how_much_debt |
| state | state | location |

All fields are also included in a `metadata` object for reference.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `FACEBOOK_VERIFY_TOKEN` | Token for webhook verification (you choose this) | Yes |
| `FACEBOOK_PAGE_ACCESS_TOKEN` | Facebook Page Access Token for Graph API | Yes |
| `FORTHCRM_POST_URL` | ForthCRM destination URL | Yes |

## Development

### Running Locally

```bash
npm run dev
```

### Testing Webhook Verification

Visit in your browser:
```
http://localhost:3000/api/facebook/webhook?hub.mode=subscribe&hub.verify_token=YOUR_TOKEN&hub.challenge=test
```

Should return: `test`

### Testing with Facebook

For local development, use a tool like [ngrok](https://ngrok.com/) to expose your local server:

```bash
ngrok http 3000
```

Use the ngrok HTTPS URL in Facebook webhook settings.

## Production Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

This is a standard Next.js app and can be deployed to:
- Netlify
- AWS Amplify
- Railway
- Your own server (requires Node.js and HTTPS)

## Monitoring

### Logs

All webhook events are logged with detailed information:

- Verification requests
- Incoming webhook payloads
- Lead data fetched from Facebook
- Data sent to ForthCRM
- Any errors that occur

Check your deployment platform's logs to monitor activity.

### Error Handling

The webhook is designed to:
- Always return 200 OK to Facebook (prevents retries)
- Process leads asynchronously
- Log errors without breaking the webhook
- Continue processing even if one lead fails

## Troubleshooting

### Webhook verification fails
- Verify `FACEBOOK_VERIFY_TOKEN` matches exactly (case-sensitive)
- Check URL is correct and accessible via HTTPS
- Ensure app is deployed and running

### Not receiving leads
- Verify webhook is subscribed to correct Page
- Check `FACEBOOK_PAGE_ACCESS_TOKEN` has `leads_retrieval` permission
- Review server logs for errors
- Test with a real lead submission

### ForthCRM not receiving data
- Verify `FORTHCRM_POST_URL` is correct
- Check server logs for ForthCRM API errors
- Verify data format matches ForthCRM expectations

## Security

- ✅ Environment variables kept secure
- ✅ `.env.local` excluded from git
- ✅ HTTPS required for production
- ✅ Token verification for webhook requests
- ⚠️ Consider adding Facebook signature verification for production

## Learn More

- [Facebook Webhooks Documentation](https://developers.facebook.com/docs/graph-api/webhooks)
- [Facebook Lead Ads API](https://developers.facebook.com/docs/marketing-api/guides/lead-ads)
- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

## License

MIT
