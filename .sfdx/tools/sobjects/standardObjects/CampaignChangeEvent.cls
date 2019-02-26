// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class CampaignChangeEvent {
    global Decimal ActualCost;
    global Decimal AmountAllOpportunities;
    global Decimal AmountWonOpportunities;
    global Decimal BudgetedCost;
    global RecordType CampaignMemberRecordType;
    global Id CampaignMemberRecordTypeId;
    global Object ChangeEventHeader;
    global User CreatedBy;
    global Id CreatedById;
    global Datetime CreatedDate;
    global String Description;
    global Date EndDate;
    global Double ExpectedResponse;
    global Decimal ExpectedRevenue;
    global Id Id;
    global Boolean IsActive;
    global User LastModifiedBy;
    global Id LastModifiedById;
    global Datetime LastModifiedDate;
    global String Name;
    global Integer NumberOfContacts;
    global Integer NumberOfConvertedLeads;
    global Integer NumberOfLeads;
    global Integer NumberOfOpportunities;
    global Integer NumberOfResponses;
    global Integer NumberOfWonOpportunities;
    global Double NumberSent;
    global User Owner;
    global Id OwnerId;
    global Campaign Parent;
    global Id ParentId;
    global String ReplayId;
    global Date StartDate;
    global String Status;
    global String Type;

    global CampaignChangeEvent () 
    {
    }
}