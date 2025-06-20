
export async function checkAllDocumentsVerified(loanId) {
  const unverifiedDocs = await Document.countDocuments({
    loan: loanId,
    status: "pending",
  });
  return unverifiedDocs === 0;
}

