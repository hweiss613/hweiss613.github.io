# Twitter API Setup Guide

## Step 1: Get Your Twitter API Key

1. **Visit Twitter Developer Portal**
   - Go to https://developer.twitter.com/en/portal/dashboard
   - Sign in with your Twitter account

2. **Apply for Developer Access**
   - Click "Apply for a developer account"
   - Fill out the application (usually approved within minutes)
   - Verify your email address

3. **Create a New App**
   - Click "Create App"
   - Fill in app details:
     - App name: "National Storyline"
     - Description: "News aggregation from verified sources"
     - Website: Your domain or placeholder
   - Click "Create"

4. **Generate Bearer Token**
   - Go to your app dashboard
   - Click on "Keys and Tokens" tab
   - Under "Bearer Token" section, click "Generate"
   - **COPY THIS TOKEN** - you won't see it again!

## Step 2: Configure Your Environment

Add your Twitter Bearer Token as an environment variable:

### For v0 Preview:
1. Click the "Environment Variables" button in v0
2. Add: `TWITTER_BEARER_TOKEN`
3. Paste your Bearer Token as the value
4. Save and refresh the preview

### For Local Development:
Create `.env.local` in your project root:
\`\`\`
TWITTER_BEARER_TOKEN=your_bearer_token_here
\`\`\`

### For Production Deployment:
Add the environment variable in your hosting platform:
- **Vercel**: Project Settings → Environment Variables
- **Netlify**: Site Settings → Environment Variables
- **Railway**: Variables tab in your project

## Step 3: Verify It's Working

Once configured, you should see:
- ✅ Green "Live Mode" banner
- ✅ Real tweets from verified accounts
- ✅ Auto-refresh every 5 minutes
- ✅ Live indicator in the header

## API Limits & Features

- **Rate Limit**: 300 requests per 15 minutes
- **Tweet Limit**: 100 tweets per request
- **Accounts Monitored**: @JackPosobiec, @charliekirk11, @EndWokeness, @ElonMusk, etc.
- **Auto-refresh**: Every 5 minutes
- **Fallback**: Graceful fallback to demo content if API fails

## Troubleshooting

**"Demo Mode" still showing?**
- Check that your Bearer Token is correctly set
- Ensure the token starts with "AAAA" and is ~100+ characters
- Refresh the page after setting the environment variable

**API errors?**
- Verify your Twitter app has the correct permissions
- Check that your Bearer Token hasn't expired
- Ensure you haven't exceeded rate limits

**Need help?**
- Check the browser console for detailed error messages
- Verify your Twitter Developer account is approved
- Make sure your app has "Read" permissions enabled
