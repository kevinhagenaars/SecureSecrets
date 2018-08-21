"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const azureKeyVault = require("azure-keyvault");
const tl = require("vsts-task-lib/task");
var randomize = require('randomatic');
var AuthenticationContext = require('adal-node').AuthenticationContext;
class KeyVault {
    constructor(taskParameters) {
        this.taskParameters = taskParameters;
        this.keyVaultClient = new azureKeyVault.KeyVaultClient(this.taskParameters.vaultCredentials);
    }
    createSecret(secretName, secretValue, secretLength, excludeSpecialChars) {
        try {
            let pattern = excludeSpecialChars ? "Aa0" : "*";
            if (secretValue === undefined && !secretValue) {
                secretValue = randomize(pattern, secretLength);
            }
            this.keyVaultClient.setSecret(this.taskParameters.keyVaultUrl, secretName, secretValue)
                .then((kvSecretBundle) => {
                console.log("Secret id: '" + kvSecretBundle.id + "'.");
            })
                .catch((e) => {
                tl.setResult(tl.TaskResult.Failed, "Failed to save key to the Key Vault. => " + e);
            });
        }
        catch (e) {
            tl.setResult(tl.TaskResult.Failed, "Failed to save key to the Key Vault. => " + e);
        }
    }
}
exports.KeyVault = KeyVault;
