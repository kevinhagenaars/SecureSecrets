import keyVaultTaskParameters = require("../models/KeyVaultTaskParameters");
import msRestAzure = require('ms-rest-azure');
import azureKV = require("azure-keyvault");
import util = require("util");
import tl = require("vsts-task-lib/task");
var randomize = require('randomatic');

import KeyVaultManagementClient = require('azure-arm-keyvault');

export class KeyVault {

    
    private taskParameters: keyVaultTaskParameters.KeyVaultTaskParameters;
    private keyVaultClient: azureKV.KeyVaultClient;
    

    constructor(taskParameters: keyVaultTaskParameters.KeyVaultTaskParameters) {
        this.taskParameters = taskParameters;
    }

    createSecret(creds:msRestAzure.ApplicationTokenCredentials,secretName:string,secretValue:string,secretLength:number,excludeSpecialChars:boolean) {
        try{
            let pattern = excludeSpecialChars ? "Aa0" : "*";
            
            if(!secretValue){
                secretValue = randomize(pattern,secretLength);
            }
            
            msRestAzure.loginWithServicePrincipalSecret(this.taskParameters.servicePrincipalId, this.taskParameters.servicePrincipalKey, this.taskParameters.tenantId,(err,credentials,subs) => {
                this.keyVaultClient = new azureKV.KeyVaultClient(creds);
                this.keyVaultClient.setSecret(this.taskParameters.keyVaultUrl,secretName,secretValue)    
                .then( (kvSecretBundle) => {
                    console.log("Secret saved!");
                })
                .catch( (e) => {
                    tl.setResult(tl.TaskResult.Failed,"Failed to save key to the Key Vault. => " + e);
                });
            })




        }
        catch(e){
            tl.setResult(tl.TaskResult.Failed,"Creating secret failed. => " + e);
        }
    }
}