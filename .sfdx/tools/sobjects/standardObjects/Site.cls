// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class Site {
    global User Admin;
    global Id AdminId;
    global String AnalyticsTrackingCode;
    global List<AttachedContentDocument> AttachedContentDocuments;
    global String ClickjackProtectionLevel;
    global List<CombinedAttachment> CombinedAttachments;
    global List<ContentDocumentLink> ContentDocumentLinks;
    global User CreatedBy;
    global Id CreatedById;
    global Datetime CreatedDate;
    global Integer DailyBandwidthLimit;
    global Integer DailyBandwidthUsed;
    global Integer DailyRequestTimeLimit;
    global Integer DailyRequestTimeUsed;
    global String Description;
    global List<EntitySubscription> FeedSubscriptionsForEntity;
    global List<SiteFeed> Feeds;
    global List<ContentVersion> FirstPublishLocation;
    global User GuestUser;
    global Id GuestUserId;
    global List<SiteHistory> Histories;
    global Id Id;
    global User LastModifiedBy;
    global Id LastModifiedById;
    global Datetime LastModifiedDate;
    global String MasterLabel;
    global Integer MonthlyPageViewsEntitlement;
    global String Name;
    global Boolean OptionsAllowGuestSupportApi;
    global Boolean OptionsAllowHomePage;
    global Boolean OptionsAllowStandardAnswersPages;
    global Boolean OptionsAllowStandardIdeasPages;
    global Boolean OptionsAllowStandardLookups;
    global Boolean OptionsAllowStandardPortalPages;
    global Boolean OptionsAllowStandardSearch;
    global Boolean OptionsBrowserXssProtection;
    global Boolean OptionsContentSniffingProtection;
    global Boolean OptionsCspUpgradeInsecureRequests;
    global Boolean OptionsEnableFeeds;
    global Boolean OptionsReferrerPolicyOriginWhenCrossOrigin;
    global Boolean OptionsRequireHttps;
    global List<FeedComment> Parent;
    global List<DomainSite> SiteDomainPaths;
    global List<SiteIframeWhiteListUrl> SiteIframeWhiteListUrls;
    global String SiteType;
    global String Status;
    global String Subdomain;
    global Datetime SystemModstamp;
    global String UrlPathPrefix;

    global Site () 
    {
    }
}