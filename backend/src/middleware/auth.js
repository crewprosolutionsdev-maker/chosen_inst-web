import jwt from 'jsonwebtoken';

export function requireAdmin(req, res, next) {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, '');
  if (!token || !process.env.JWT_SECRET) return res.status(401).json({ message: 'Acceso no autorizado' });
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch { res.status(401).json({ message: 'Sesión inválida o vencida' }); }
}
