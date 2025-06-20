export const rolePermissions = {
  admin: {
    system: {
      dashboard: true,
      manageSettings: true,
      auditLogs: true,
      apiIntegrations: true,
    },
    lead: {
      rejectApproveLeads: true,
      requestDocuments: true,
      viewVerifyDocuments: true,
      viewLoanHistory: true,
    },
    loan: {
      createAssignApplications: true,
      approveRejectLoans: true,
      modifyConditions: true,
      viewAllHistory: true,
    },
    staff: {
      viewAll: true,
      addRemove: true,
      assignEditRoles: true,
      deactivateActivate: true,
    },
    finance: {
      processLoanDisbursements: true,
      managePartnerTransactions: true,
      generateReports: true,
      viewTotal: true,
    },
    affiliate: {
      addManagePartners: true,
      assignLoanFiles: true,
      viewAllPartners: true,
      manageCommission: true,
    },
  },
  subAdmin: {
    system: {
      dashboard: true,
      manageSettings: false,
      auditLogs: false,
      apiIntegrations: false,
    },
    lead: {
      rejectApproveLeads: true,
      requestDocuments: false,
      viewVerifyDocuments: false,
      viewLoanHistory: true,
    },
    loan: {
      createAssignApplications: false,
      approveRejectLoans: true,
      modifyConditions: false,
      viewAllHistory: true,
    },
    staff: {
      viewAll: true,
      addRemove: false,
      assignEditRoles: false,
      deactivateActivate: false,
    },
    finance: {
      processLoanDisbursements: false,
      managePartnerTransactions: false,
      generateReports: false,
      viewTotal: false,
    },
    affiliate: {
      addManagePartners: false,
      assignLoanFiles: false,
      viewAllPartners: true,
      manageCommission: false,
    },
  },
};
