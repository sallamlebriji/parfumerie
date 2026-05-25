export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN_TENANT: "ADMIN_TENANT",
  MANAGER: "MANAGER",
  EMPLOYEE: "EMPLOYEE",
  CLIENT: "CLIENT"
};

export const normalizeRole = (role) => ({
  superadmin: ROLES.SUPER_ADMIN,
  admin: ROLES.ADMIN_TENANT,
  manager: ROLES.MANAGER
}[role] || role);

export const MODULE_PERMISSIONS = {
  dashboard: [ROLES.SUPER_ADMIN, ROLES.ADMIN_TENANT, ROLES.MANAGER],
  tenants: [ROLES.SUPER_ADMIN],
  users: [ROLES.SUPER_ADMIN, ROLES.ADMIN_TENANT],
  products: [ROLES.SUPER_ADMIN, ROLES.ADMIN_TENANT, ROLES.MANAGER],
  orders: [ROLES.SUPER_ADMIN, ROLES.ADMIN_TENANT, ROLES.MANAGER, ROLES.EMPLOYEE],
  customers: [ROLES.SUPER_ADMIN, ROLES.ADMIN_TENANT, ROLES.MANAGER],
  stocks: [ROLES.SUPER_ADMIN, ROLES.ADMIN_TENANT, ROLES.MANAGER, ROLES.EMPLOYEE],
  promotions: [ROLES.SUPER_ADMIN, ROLES.ADMIN_TENANT, ROLES.MANAGER],
  billing: [ROLES.SUPER_ADMIN, ROLES.ADMIN_TENANT],
  reports: [ROLES.SUPER_ADMIN, ROLES.ADMIN_TENANT, ROLES.MANAGER],
  settings: [ROLES.SUPER_ADMIN, ROLES.ADMIN_TENANT]
};

export const canAccessModule = (user, moduleName) => {
  const role = normalizeRole(user?.role);
  if (!role || !MODULE_PERMISSIONS[moduleName]?.includes(role)) return false;
  if (role === ROLES.SUPER_ADMIN) return true;

  const enabledModules = user?.enabledModules?.length
    ? user.enabledModules
    : user?.tenant?.modules?.length
      ? user.tenant.modules
      : user?.subscription?.enabledModules;

  return !enabledModules?.length || enabledModules.includes(moduleName);
};
