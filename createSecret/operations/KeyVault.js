"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const msRestAzure = require("ms-rest-azure");
const azureKV = require("azure-keyvault");
const tl = require("vsts-task-lib/task");
var randomize = require('randomatic');
class KeyVault {
    constructor(taskParameters) {
        this.taskParameters = taskParameters;
    }
    createSecret(creds, secretName, secretValue, secretLength, excludeSpecialChars, keepSecret) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.keyVaultClient = new azureKV.KeyVaultClient(creds);
                if (keepSecret) {
                    let secrets = yield this.keyVaultClient.getSecrets(this.taskParameters.keyVaultUrl);
                    if (secrets) {
                        for (let index = 0; index < secrets.length; index++) {
                            if (secrets[index].id == "https://" + this.taskParameters.keyVaultName + ".vault.azure.net/secrets/" + secretName) {
                                console.log("Existing secret found. Stopping...");
                                return;
                            }
                        }
                    }
                }
                let pattern = excludeSpecialChars ? "Aa0" : "*";
                if (!secretValue) {
                    secretValue = randomize(pattern, secretLength);
                }
                msRestAzure.loginWithServicePrincipalSecret(this.taskParameters.servicePrincipalId, this.taskParameters.servicePrincipalKey, this.taskParameters.tenantId, (err, credentials, subs) => {
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
        });
    }
}
exports.KeyVault = KeyVault;
