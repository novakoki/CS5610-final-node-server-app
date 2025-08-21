export function protect(req, res, next) {
  if (req.session.user) {
    req.user = req.session.user;
    next();
  } else {
    res.status(401).json({ error: 'Not authorized' });
  }
}

export function admin(req, res, next) {
  if (req.session.user && req.session.user.role === 'ADMIN') {
    next();
  } else {
    res.status(401).json({ error: 'Not authorized as an admin' });
  }
}

export function author(req, res, next) {
  if (req.session.user && req.session.user.role === 'AUTHOR') {
    next();
  } else {
    res.status(401).json({ error: 'Not authorized as an author' });
  }
}


