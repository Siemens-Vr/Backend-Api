const { ActivityLog } = require('../models');

const activityLogger = (options = {}) => {
  const {
    excludeRoutes = ['/health', '/favicon.ico'],
    excludeMethods = ['OPTIONS'],
    logBody = false,
    logQuery = true
  } = options;

  return async (req, res, next) => {
    // Skip excluded routes and methods
    if (excludeRoutes.includes(req.path) || excludeMethods.includes(req.method)) {
      return next();
    }

    const startTime = Date.now();
    const originalSend = res.send;
    let responseBody = null;

    // Capture response
    res.send = function(body) {
      responseBody = body;
      return originalSend.call(this, body);
    };

    // Continue with request
    next();

    // Log after response
    res.on('finish', async () => {
      try {
        if (!req.user) return; // Skip if no authenticated user

        const duration = Date.now() - startTime;
        const success = res.statusCode < 400;

        // Parse action and resource from route
        const { action, resource, resourceId } = parseRoute(req.path, req.method);

        // Prepare log data
        const logData = {
          userId: req.user.userId,
          sessionId: req.sessionId || 'unknown',
          action,
          resource,
          resourceId,
          method: req.method,
          endpoint: req.path,
          details: {
            ...(logQuery && req.query ? { query: req.query } : {}),
            ...(logBody && req.body ? { body: sanitizeBody(req.body) } : {}),
            statusCode: res.statusCode,
            responseTime: duration
          },
          ipAddress: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
          userAgent: req.headers['user-agent'],
          duration,
          success,
          errorMessage: success ? null : getErrorMessage(responseBody),
          timestamp: new Date()
        };

        // Save to database
        await ActivityLog.create(logData);

      } catch (error) {
        console.error('Activity logging error:', error);
      }
    });
  };
};

// Helper functions
function parseRoute(path, method) {
  const segments = path.split('/').filter(Boolean);
  let action = method.toLowerCase();
  let resource = segments[1] || 'unknown';
  let resourceId = null;

  // Map HTTP methods to actions
  const actionMap = {
    'GET': 'view',
    'POST': 'create',
    'PUT': 'update',
    'PATCH': 'update',
    'DELETE': 'delete'
  };

  // Parse common patterns
  if (segments.length >= 3) {
    // /api/users/123 -> resource: users, resourceId: 123
    if (segments[0] === 'api') {
      resource = segments[1];
      resourceId = segments[2];
    }
  }

  // Special cases
  if (path.includes('/login')) {
    action = 'login';
    resource = 'auth';
  } else if (path.includes('/logout')) {
    action = 'logout';
    resource = 'auth';
  } else if (path.includes('/profile')) {
    action = method === 'GET' ? 'view_profile' : 'update_profile';
    resource = 'user';
  }

  return {
    action: actionMap[method.toUpperCase()] || action,
    resource,
    resourceId
  };
}

function sanitizeBody(body) {
  const sanitized = { ...body };
  
  // Remove sensitive fields
  const sensitiveFields = ['password', 'token', 'secret', 'key'];
  sensitiveFields.forEach(field => {
    if (sanitized[field]) {
      sanitized[field] = '[REDACTED]';
    }
  });
  
  return sanitized;
}

function getErrorMessage(responseBody) {
  try {
    if (typeof responseBody === 'string') {
      const parsed = JSON.parse(responseBody);
      return parsed.message || parsed.error || 'Unknown error';
    }
    return responseBody?.message || responseBody?.error || 'Unknown error';
  } catch {
    return 'Unknown error';
  }
}

module.exports = activityLogger;
