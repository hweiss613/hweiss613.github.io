# National Storyline - Twitter API Integration

This implementation connects to the X (Twitter) API v2 to pull live tweets from verified accounts.

## Setup Instructions

### 1. Get Twitter API Access

1. Go to [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
2. Create a new app or use an existing one
3. Generate a Bearer Token for API v2
4. Copy the Bearer Token

### 2. Environment Configuration

1. Copy `.env.example` to `.env.local`
2. Add your Twitter Bearer Token:
   \`\`\`
   TWITTER_BEARER_TOKEN=your_actual_bearer_token_here
   \`\`\`

⚠️ Security Note: Never use NEXT_PUBLIC_ prefix for API keys as it exposes them to the client.

### 3. API Features

- **Real-time Tweet Fetching**: Pulls latest tweets from verified conservative accounts
- **Category Filtering**: Automatically categorizes tweets by content
- **Search Functionality**: Search across tweet content and authors
- **Rate Limit Handling**: Respects Twitter API rate limits
- **Fallback Support**: Shows mock data if API fails

### 4. Verified Accounts Included

- @JackPosobiec
- @charliekirk11
- @DC_Draino
- @EndWokeness
- @Cernovich
- @VivekGRamaswamy
- @TheChiefNerd
- @libsoftiktok
- @RealJamesWoods
- @elonmusk

### 5. API Limits

- **Rate Limit**: 300 requests per 15-minute window
- **Tweet Limit**: 100 tweets per request
- **Refresh Interval**: 5 minutes (configurable)

### 6. Production Deployment

For production deployment:

1. Set environment variables in your hosting platform
2. Consider implementing server-side caching
3. Add error monitoring and logging
4. Implement webhook endpoints for real-time updates

### 7. Customization

You can customize:
- Refresh intervals in `useTwitterData` hook
- Account lists in `twitter-api.ts`
- Category keywords in `TweetProcessor`
- UI components in `TweetCard`

### 8. Error Handling

The implementation includes:
- Graceful API error handling
- Fallback to cached/mock data
- User-friendly error messages
- Automatic retry mechanisms
