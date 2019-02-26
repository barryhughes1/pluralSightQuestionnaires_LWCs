// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class AuthProvider {
    global List<AuthConfigProviders> AuthProvider;
    global List<LoginHistory> AuthenticationService;
    global String AuthorizeUrl;
    global String ConsumerKey;
    global String ConsumerSecret;
    global Datetime CreatedDate;
    global String CustomMetadataTypeRecord;
    global String DefaultScopes;
    global String DeveloperName;
    global String ErrorUrl;
    global User ExecutionUser;
    global Id ExecutionUserId;
    global String FriendlyName;
    global String IconUrl;
    global Id Id;
    global String IdTokenIssuer;
    global String LinkKickoffUrl;
    global String LogoutUrl;
    global String OauthKickoffUrl;
    global Boolean OptionsIncludeOrgIdInId;
    global Boolean OptionsSendAccessTokenInHeader;
    global Boolean OptionsSendClientCredentialsInHeader;
    global ApexClass Plugin;
    global Id PluginId;
    global String ProviderType;
    global ApexClass RegistrationHandler;
    global Id RegistrationHandlerId;
    global String SsoKickoffUrl;
    global List<ThirdPartyAccountLink> SsoProvider;
    global String TokenUrl;
    global String UserInfoUrl;

    global AuthProvider () 
    {
    }
}