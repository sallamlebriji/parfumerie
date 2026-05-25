import jwt from "jsonwebtoken";
import { MODULE_PERMISSIONS, normalizeRole, ROLES } from "../config/roles.js";
import Parfumerie from "../models/Parfumerie.js";
import Subscription from "../models/Subscription.js";
import User from "../models/User.js";

export const isSuperAdmin = (user) => normalizeRole(user?.role) === ROLES.SUPER_ADMIN;

export const protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Acces refuse. Token manquant." });
    }

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId || decoded.id;
    req.user = await User.findById(userId).select("-password");

    if (!req.user) return res.status(401).json({ message: "Utilisateur introuvable." });
    if (!req.user.isActive) return res.status(403).json({ message: "Compte desactive." });
    req.user.role = normalizeRole(req.user.role);
    req.tenantId = decoded.tenantId?._id || decoded.tenantId || req.user.tenantId?._id || req.user.tenantId || req.user.parfumerie?._id || req.user.parfumerie || null;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token invalide ou expire." });
  }
};

export const optionalProtect = async (req, _res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) return next();

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId || decoded.id;
    const user = await User.findById(userId).select("-password");
    if (!user || !user.isActive) return next();

    user.role = normalizeRole(user.role);
    req.user = user;
    req.tenantId = decoded.tenantId?._id || decoded.tenantId || user.tenantId?._id || user.tenantId || user.parfumerie?._id || user.parfumerie || null;
  } catch (_error) {
    // Public routes continue without auth context when the optional token is absent or invalid.
  }
  next();
};

export const allowRoles = (...roles) => (req, res, next) => {
  const allowed = roles.map(normalizeRole);
  if (!allowed.includes(normalizeRole(req.user?.role))) {
    return res.status(403).json({ message: "Droits insuffisants pour cette action." });
  }
  next();
};

export const authorize = allowRoles;

export const scopeTenant = (req, _res, next) => {
  if (!req.user || isSuperAdmin(req.user)) return next();
  if (!req.tenantId) return next();

  req.query.tenantId = req.tenantId.toString();
  req.query.parfumerie = req.tenantId.toString();
  req.body.tenantId = req.tenantId.toString();
  req.body.parfumerie = req.tenantId.toString();
  next();
};

export const checkTenantActive = async (req, res, next) => {
  if (!req.user || isSuperAdmin(req.user)) return next();
  if (!req.tenantId) return res.status(403).json({ message: "Aucun tenant associe a cet utilisateur." });

  const tenant = await Parfumerie.findById(req.tenantId);
  if (!tenant || !tenant.isActive) return res.status(403).json({ message: "Tenant suspendu ou introuvable." });
  req.tenant = tenant;
  next();
};

export const requireModule = (moduleName) => async (req, res, next) => {
  const role = normalizeRole(req.user?.role);
  const allowedRoles = MODULE_PERMISSIONS[moduleName] || [];
  if (!allowedRoles.includes(role)) return res.status(403).json({ message: "Module non autorise pour ce role." });
  if (role === ROLES.SUPER_ADMIN) return next();

  const subscription = await Subscription.findOne({ tenantId: req.tenantId });
  if (!subscription || ["past_due", "canceled"].includes(subscription.status)) {
    return res.status(403).json({ message: "Abonnement inactif ou en retard de paiement." });
  }
  if (subscription.endDate && subscription.endDate < new Date()) {
    return res.status(403).json({ message: "Abonnement expire." });
  }
  const tenantModules = req.tenant?.modules?.length ? req.tenant.modules : subscription?.enabledModules;
  if (tenantModules?.length && !tenantModules.includes(moduleName)) {
    return res.status(403).json({ message: "Module desactive pour ce tenant." });
  }
  next();
};
