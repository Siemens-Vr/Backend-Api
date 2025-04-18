const passport = require('passport');

exports.authenticateJwt = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      console.error('Passport error:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (!user) {
      let message = 'Unauthorized';
      if (info?.name === 'TokenExpiredError') {
        message = 'Token expired';
      } else if (info?.message === 'No auth token') {
        message = 'No token provided';
      } else if (info?.message) {
        message = info.message;
      }

      return res.status(401).json({ message });
    }

    req.user = user;
    next();
  })(req, res, next);
};
