"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const msRestAzure = require("ms-rest-azure");
const tl = require("vsts-task-lib");
const util = require("util");
class KeyVaultTaskParameters {
    constructor() {
        var connectedService = tl.getInput("ConnectedServiceName", true);
        this.subscriptionId = tl.getEndpointDataParameter(connectedService, "SubscriptionId", true);
        this.keyVaultName = tl.getInput("KeyVaultName", true);
        var azureKeyVaultDnsSuffix = tl.getEndpointDataParameter(connectedService, "AzureKeyVaultDnsSuffix", true);
        this.servicePrincipalId = tl.getEndpointAuthorizationParameter(connectedService, 'serviceprincipalid', true);
        this.keyVaultUrl = util.format("https://%s.%s", this.keyVaultName, azureKeyVaultDnsSuffix);
        this.scheme = tl.getEndpointAuthorizationScheme(connectedService, false);
        this.vaultCredentials = this.getVaultCredentials(connectedService, azureKeyVaultDnsSuffix);
    }
    getVaultCredentials(connectedService, azureKeyVaultDnsSuffix) {
        var vaultUrl = util.format("https://%s", azureKeyVaultDnsSuffix);
        var servicePrincipalKey = tl.getEndpointAuthorizationParameter(connectedService, 'serviceprincipalkey', true);
        var tenantId = tl.getEndpointAuthorizationParameter(connectedService, 'tenantid', false);
        var armUrl = tl.getEndpointUrl(connectedService, true);
        var envAuthorityUrl = tl.getEndpointDataParameter(connectedService, 'environmentAuthorityUrl', true);
        envAuthorityUrl = (envAuthorityUrl != null) ? envAuthorityUrl : "https://login.windows.net/";
        var msiClientId = tl.getEndpointDataParameter(connectedService, 'msiclientId', true);
        this.tenantId = tenantId;
        this.servicePrincipalKey = servicePrincipalKey;
        var credentials = new msRestAzure.ApplicationTokenCredentials(this.servicePrincipalId, tenantId, servicePrincipalKey);
        return credentials;
    }
}
exports.KeyVaultTaskParameters = KeyVaultTaskParameters;
