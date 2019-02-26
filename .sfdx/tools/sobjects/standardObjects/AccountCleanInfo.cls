// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class AccountCleanInfo {
    global Account Account;
    global Id AccountId;
    global String AccountSite;
    global Address Address;
    global Decimal AnnualRevenue;
    global String City;
    global Boolean CleanedByJob;
    global Boolean CleanedByUser;
    global String CompanyName;
    global String CompanyStatusDataDotCom;
    global String Country;
    global User CreatedBy;
    global Id CreatedById;
    global Datetime CreatedDate;
    global String DandBCompanyDunsNumber;
    global String DataDotComId;
    global String Description;
    global String DunsNumber;
    global Integer DunsRightMatchConfidence;
    global String DunsRightMatchGrade;
    global String Fax;
    global String GeocodeAccuracy;
    global Id Id;
    global String Industry;
    global Boolean IsDeleted;
    global Boolean IsDifferentAccountSite;
    global Boolean IsDifferentAnnualRevenue;
    global Boolean IsDifferentCity;
    global Boolean IsDifferentCompanyName;
    global Boolean IsDifferentCountry;
    global Boolean IsDifferentCountryCode;
    global Boolean IsDifferentDandBCompanyDunsNumber;
    global Boolean IsDifferentDescription;
    global Boolean IsDifferentDunsNumber;
    global Boolean IsDifferentFax;
    global Boolean IsDifferentIndustry;
    global Boolean IsDifferentNaicsCode;
    global Boolean IsDifferentNaicsDescription;
    global Boolean IsDifferentNumberOfEmployees;
    global Boolean IsDifferentOwnership;
    global Boolean IsDifferentPhone;
    global Boolean IsDifferentPostalCode;
    global Boolean IsDifferentSic;
    global Boolean IsDifferentSicDescription;
    global Boolean IsDifferentState;
    global Boolean IsDifferentStateCode;
    global Boolean IsDifferentStreet;
    global Boolean IsDifferentTickerSymbol;
    global Boolean IsDifferentTradestyle;
    global Boolean IsDifferentWebsite;
    global Boolean IsDifferentYearStarted;
    global Boolean IsFlaggedWrongAccountSite;
    global Boolean IsFlaggedWrongAddress;
    global Boolean IsFlaggedWrongAnnualRevenue;
    global Boolean IsFlaggedWrongCompanyName;
    global Boolean IsFlaggedWrongDescription;
    global Boolean IsFlaggedWrongDunsNumber;
    global Boolean IsFlaggedWrongFax;
    global Boolean IsFlaggedWrongIndustry;
    global Boolean IsFlaggedWrongNaicsCode;
    global Boolean IsFlaggedWrongNaicsDescription;
    global Boolean IsFlaggedWrongNumberOfEmployees;
    global Boolean IsFlaggedWrongOwnership;
    global Boolean IsFlaggedWrongPhone;
    global Boolean IsFlaggedWrongSic;
    global Boolean IsFlaggedWrongSicDescription;
    global Boolean IsFlaggedWrongTickerSymbol;
    global Boolean IsFlaggedWrongTradestyle;
    global Boolean IsFlaggedWrongWebsite;
    global Boolean IsFlaggedWrongYearStarted;
    global Boolean IsInactive;
    global Boolean IsReviewedAccountSite;
    global Boolean IsReviewedAddress;
    global Boolean IsReviewedAnnualRevenue;
    global Boolean IsReviewedCompanyName;
    global Boolean IsReviewedDandBCompanyDunsNumber;
    global Boolean IsReviewedDescription;
    global Boolean IsReviewedDunsNumber;
    global Boolean IsReviewedFax;
    global Boolean IsReviewedIndustry;
    global Boolean IsReviewedNaicsCode;
    global Boolean IsReviewedNaicsDescription;
    global Boolean IsReviewedNumberOfEmployees;
    global Boolean IsReviewedOwnership;
    global Boolean IsReviewedPhone;
    global Boolean IsReviewedSic;
    global Boolean IsReviewedSicDescription;
    global Boolean IsReviewedTickerSymbol;
    global Boolean IsReviewedTradestyle;
    global Boolean IsReviewedWebsite;
    global Boolean IsReviewedYearStarted;
    global Datetime LastMatchedDate;
    global User LastModifiedBy;
    global Id LastModifiedById;
    global Datetime LastModifiedDate;
    global User LastStatusChangedBy;
    global Id LastStatusChangedById;
    global Datetime LastStatusChangedDate;
    global Double Latitude;
    global Double Longitude;
    global String NaicsCode;
    global String NaicsDescription;
    global String Name;
    global Integer NumberOfEmployees;
    global String Ownership;
    global String Phone;
    global String PostalCode;
    global List<FlowRecordRelation> RelatedRecord;
    global String Sic;
    global String SicDescription;
    global String State;
    global String Street;
    global Datetime SystemModstamp;
    global String TickerSymbol;
    global String Tradestyle;
    global String Website;
    global String YearStarted;

    global AccountCleanInfo () 
    {
    }
}