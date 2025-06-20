export const ROLES = {
  ADMIN: "admin",
  SUBADMIN: "subadmin",
  STAFF: "staff",
};

export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: {
    canManageAllUsers: true,
    canViewAllData: true,
    canManageBankingPartners: true,
    canManageAffiliatePartners: true,
    canManageStaff: true,
    canManageCreditManagers: true,
    canViewReports: true,
    canManageSystemSettings: true,
    canApproveLoans: true,
    canViewFinancials: true,
    canManageRoles: true,
  },
  [ROLES.SUBADMIN]: {
    canManageStaff: true,
    canViewAssignedData: true,
    canViewReports: true,
    canApproveLoans: false,
    canManageBankingPartners: false,
    canViewFinancials: true,
    canManageCustomers: true,
  },

  [ROLES.STAFF]: {
    canViewAssignedCustomers: true,
    canProcessApplications: true,
    canUploadDocuments: true,
    canCommunicateWithCustomers: true,
    canViewBasicReports: true,
    canCreateCustomers: true,
  },
};

export const ROLE_ROUTES = {
  [ROLES.ADMIN]: "/admin/dashboard",
  [ROLES.SUBADMIN]: "/subadmin/dashboard",
  [ROLES.STAFF]: "/staff/dashboard",
};
