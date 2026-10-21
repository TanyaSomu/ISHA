import app from './app.js';
import { config } from './config/index.js';

// Avoid starting a persistent listening server in serverless / Vercel or test environments
if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  const server = app.listen(config.port, () => {
    console.log(`=========================================`);
    console.log(`🌿 ${config.brand.name} Server Active`);
    console.log(`📡 URL: http://localhost:${config.port}`);
    console.log(`🧘 Environment: ${config.nodeEnv}`);
    console.log(`=========================================`);
  });

  // Handle graceful shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
      console.log('HTTP server closed');
    });
  });

  process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing HTTP server');
    server.close(() => {
      console.log('HTTP server closed');
    });
  });
}

export default app;
