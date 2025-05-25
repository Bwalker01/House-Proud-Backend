import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import { householdRoutes } from './api/routes/household';
import { authRoutes } from './api/routes/auth';

const PORT = process.env.PORT || 3000;

const server = Fastify({
  logger: true,
});

// Register plugins
server.register(cors, {
  origin: true,
});

// Add security headers with detailed configuration
server.register(helmet, {
  // Content Security Policy
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"], // Only allow resources from same origin
      scriptSrc: ["'self'", "'unsafe-inline'"], // Allow scripts from same origin and inline scripts
      styleSrc: ["'self'", "'unsafe-inline'"], // Allow styles from same origin and inline styles
      imgSrc: ["'self'", 'data:', 'https:'], // Allow images from same origin, data URLs, and HTTPS sources
      connectSrc: ["'self'", 'https://*.googleapis.com'], // Allow connections to same origin and Google APIs
      fontSrc: ["'self'", 'https:', 'data:'], // Allow fonts from same origin, HTTPS sources, and data URLs
      objectSrc: ["'none'"], // Don't allow object/embed/applet elements
      mediaSrc: ["'self'"], // Only allow media from same origin
      frameSrc: ["'none'"], // Don't allow iframes
    },
  },
  // Cross-Origin Embedder Policy
  crossOriginEmbedderPolicy: true, // Prevents loading of cross-origin resources
  // Cross-Origin Opener Policy
  crossOriginOpenerPolicy: { policy: 'same-origin' }, // Restricts window interactions to same origin
  // Cross-Origin Resource Policy
  crossOriginResourcePolicy: { policy: 'same-site' }, // Restricts resource loading to same site
  // DNS Prefetch Control
  dnsPrefetchControl: { allow: false }, // Disables DNS prefetching
  // Frameguard
  frameguard: { action: 'deny' }, // Prevents site from being embedded in iframes
  // Hide Powered-By
  hidePoweredBy: true, // Removes X-Powered-By header
  // HSTS
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  },
  // IE No Open
  ieNoOpen: true, // Prevents IE from executing downloads
  // NoSniff
  noSniff: true, // Prevents MIME type sniffing
  // Referrer Policy
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  // XSS Filter
  xssFilter: true, // Enables XSS filtering
});

// Register routes
server.register(authRoutes);
server.register(householdRoutes);

// Health check route
server.get('/health', async () => {
  return { status: 'ok' };
});

// Start the server
const start = async () => {
  try {
    await server.listen({ port: Number(PORT), host: '0.0.0.0' });
    console.log(`Server is running on http://localhost:${PORT}`);
  } catch (err: any) {
    if (err.code === 'EADDRINUSE') {
      console.error(
        `Port ${PORT} is already in use. Please try a different port by setting the PORT environment variable.`,
      );
    } else {
      server.log.error(err);
    }
    process.exit(1);
  }
};

start();
