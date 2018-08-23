"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const msRestAzure = require("ms-rest-azure");
const azureKV = require("azure-keyvault");
const tl = require("vsts-task-lib/task");
var randomize = require('randomatic');
class KeyVault {
    constructor(taskParameters) {
        this.taskParameters = taskParameters;
    }
    createSecret(creds, secretName, secretValue, secretLength, excludeSpecialChars) {
        try {
            let pattern = excludeSpecialChars ? "Aa0" : "*";
            if (!secretValue) {
                secretValue = randomize(pattern, secretLength);
            }
            msRestAzure.loginWithServicePrincipalSecret(this.taskParameters.servicePrincipalId, this.taskParameters.servicePrincipalKey, this.taskParameters.tenantId, (err, credentials, subs) => {
                this.keyVaultClient = new azureKV.KeyVaultClient(creds);
                this.keyVaultClient.setSecret(this.taskParameters.keyVaultUrl, secretName, secretValue)
                    .then((kvSecretBundle) => {
                    console.log("Secret saved!");
                })
                    .catch((e) => {
                    tl.setResult(tl.TaskResult.Failed, "Failed to save key to the Key Vault. => " + e);
                });
            });
        }
        catch (e) {
            tl.setResult(tl.TaskResult.Failed, "Creating secret failed. => " + e);
        }
    }
}
exports.KeyVault = KeyVault;
