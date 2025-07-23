# Twitter API Setup Guide

## Quick Start (Demo Mode)
The site works immediately with demo content. No configuration needed for preview.

## Production Setup

### 1. Get Twitter API Access
1. Visit [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
2. Apply for a developer account (free)
3. Create a new app
4. Generate a Bearer Token

### 2. Configure Environment
Create `.env.local` in your project root:
\`\`\`
TWITTER_BEARER_TOKEN=your_bearer_token_here
\`\`\`

### 3. Deploy
Once configured, the site will automatically switch to live Twitter data.

## Features
- ✅ Works immediately with demo data
- ✅ Graceful fallback if API fails  
- ✅ Real-time updates when configured
- ✅ Rate limit handling
- ✅ Error recovery

## API Limits
- 300 requests per 15 minutes
- 100 tweets per request
- Auto-refresh every 5 minutes
