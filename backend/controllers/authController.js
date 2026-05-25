import jwt from "jsonwebtoken";
import { normalizeRole, ROLES } from "../config/roles.js";
import Parfumerie from "../models/Parfumerie.js";
import Subscription from "../models/Subscription.js";
import User from "../models/User.js";

const idOf = (value) => value?._id || value || null;

const createToken = (user) => jwt.sign(
  { userId: user._id, role: normalizeRole(user.role), tenantId: idOf(user.tenantId) || idOf(user.parfumerie) },
  process.env.JWT_SECRET,
  { expiresIn: "7d" }
);

const authUserDto = async (user) => {
  const tenantId = idOf(user.tenantId) || idOf(user.parfumerie);
  const subscription = tenantId ? await Subscription.findOne({ tenantId }) : null;
  const tenant = user.tenantId?._id ? user.tenantId : tenantId ? await Parfumerie.findById(tenantId).select("name city slug logo primaryColor isActive modules") : null;

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: normalizeRole(user.role),
    tenantId,
    tenant,
    subscription,
    enabledModules: tenant?.modules?.length ? tenant.modules : subscription?.enabledModules || []
  };
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email et mot de passe requis." });

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: "Identifiants invalides." });
  }
  if (!user.isActive) return res.status(403).json({ message: "Compte desactive." });

  user.role = normalizeRole(user.role);
  if (!user.tenantId && user.parfumerie) {
    user.tenantId = user.parfumerie;
    await user.save();
  }
  await user.populate("tenantId", "name city slug logo primaryColor isActive modules");
  if (user.role !== ROLES.SUPER_ADMIN && (!user.tenantId || user.tenantId.isActive === false)) {
    return res.status(403).json({ message: "Tenant suspendu ou introuvable." });
  }

  res.json({
    token: createToken(user),
    user: await authUserDto(user)
  });
};

export const profile = async (req, res) => {
  await req.user.populate("tenantId", "name city slug logo primaryColor isActive modules");
  res.json(await authUserDto(req.user));
};
