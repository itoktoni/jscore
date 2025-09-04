# Environment Configuration

This project supports different environments through environment variables.

## Environment Files

- `.env` - Default environment variables
- `.env.development` - Development environment variables
- `.env.production` - Production environment variables

## Available Environment Variables

- `VITE_API_URL` - The base URL for API requests
- `VITE_APP_ENV` - The application environment (development, production)
- `VITE_APP_NAME` - The application name displayed in the browser title

## Usage

### Development

To use the local development environment with `http://newcore.test`:

1. Make sure you have the `.env.development` file with:
   ```
   VITE_API_URL=http://newcore.test
   VITE_APP_ENV=development
   VITE_APP_NAME=OBSESIMAN REPORT
   ```

2. Run the development server:
   ```bash
   npm run start
   ```

3. To verify the environment configuration is working:
   ```bash
   npm run test:env
   ```

### Production

For production builds, the `.env.production` file will be used:
```
VITE_API_URL=https://newcore.nexeratech.co.id
VITE_APP_ENV=production
VITE_APP_NAME=OBSESIMAN REPORT
```

Run the production build:
```bash
npm run build
```

## Custom Environment

To create a custom environment:

1. Create a new file like `.env.staging`
2. Add your custom variables:
   ```
   VITE_API_URL=https://staging.newcore.example.com
   VITE_APP_ENV=staging
   VITE_APP_NAME=OBSESIMAN REPORT
   ```
3. Run with your custom environment:
   ```bash
   npm run start -- --mode staging
   ```

## Vite Configuration

The `vite.config.js` file automatically loads the appropriate environment variables based on the mode.