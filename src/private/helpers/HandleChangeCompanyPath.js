// will need this function when the company UUID is change in the path
// in cases like :
// --> change company in header from the drop down
// when update data for quickbooks company
export const handleChangeCompanyPathIsDone = ({ newCompany, location }) => {
  let newPath = null;
  // if the path related to the company
  // then we need to replace the company.UUID with the new one
  // else will use the same path
  if (location.pathname.startsWith("/company")) {
    let beginningOfPathIndex = -1;
    if (location.pathname.includes("/analysis")) {
      beginningOfPathIndex = location.pathname.indexOf("/analysis");
    } else if (location.pathname.includes("/kpis")) {
      beginningOfPathIndex = location.pathname.indexOf("/kpis");
    } else if (location.pathname.includes("/forecast")) {
      beginningOfPathIndex = location.pathname.indexOf("/forecast");
    } else if (location.pathname.includes("/reports")) {
      beginningOfPathIndex = location.pathname.indexOf("/reports");
    }
    let absolutePath = location.pathname.substring(beginningOfPathIndex);
    newPath = `/company/${newCompany?.uuid}${absolutePath}`;
  } else {
    newPath = location.pathname;
  }
  // here we should check this company is enabled first
  // so we don't fetch the timeframe of a disable company
  if (newCompany && newCompany.is_enabled && newCompany.uuid && newPath) {
    localStorage.removeItem(`selectedCompanyId`);
    localStorage.setItem(
      `${newCompany.uuid}_companyFreq`,
      newCompany.period_frequency
    );
    localStorage.setItem("selectedCompanyId", JSON.stringify(newCompany));
  }
  return newPath;
};
