# FlexType

A typing test application with multiple modes and features.

## Features

- Multiple typing modes: Normal, Flirty, Developer (with programming languages)
- Different test durations: 15s, 30s, 60s, 120s
- Real-time WPM and accuracy tracking
- Detailed results with statistics
- Keyboard sound effects

## Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev
```

## Deployment to Render.com (Free)

1. Create a new account on [Render.com](https://render.com) if you don't have one
2. Click on "New +" and select "Web Service"
3. Connect your GitHub repository or use the "Public Git repository" option
4. Enter your repository URL
5. Configure the service:
   - Name: typeninja (or your preferred name)
   - Environment: Node
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
6. Click "Create Web Service"

Render will automatically deploy your application and provide you with a URL.

### Render Deployment Notes

- The free tier of Render will automatically spin down your web service after 15 minutes of inactivity
- When a new request comes in, Render will spin up your service again, which might take a few seconds
- This is perfect for personal projects and demos