import jwt from 'jsonwebtoken';

export function login(req, res) {
  if (!process.env.ADMIN_PASSWORD || !process.env.JWT_SECRET) {
    return res.status(503).json({ message: 'Administración no configurada' });
  }
  if (req.body.password !== process.env.ADMIN_PASSWORD) return res.status(401).json({ message: 'Contraseña incorrecta' });
  const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '8h' });
  res.json({ token });
}
