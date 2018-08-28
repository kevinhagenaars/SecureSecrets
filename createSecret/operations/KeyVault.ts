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

    async createSecret(creds:msRestAzure.ApplicationTokenCredentials,secretName:string,secretValue:string,secretLength:number,excludeSpecialChars:boolean,keepSecret:boolean) {
        try{
            this.keyVaultClient = new azureKV.KeyVaultClient(creds);
            if(keepSecret){
                let secrets = await this.keyVaultClient.getSecrets(this.taskParameters.keyVaultUrl);             
                if(secrets){
                    for (let index = 0; index < secrets.length; index++) {
                        if(secrets[index].id == "https://"+this.taskParameters.keyVaultName+".vault.azure.net/secrets/"+secretName){
                            console.log("Existing secret found. Stopping...");
                            return;
                        }                        
                    }
                }
            }

            let pattern = excludeSpecialChars ? "Aa0" : "*";
            
            if(!secretValue){
                secretValue = randomize(pattern,secretLength);
            }
            
            msRestAzure.loginWithServicePrincipalSecret(this.taskParameters.servicePrincipalId, this.taskParameters.servicePrincipalKey, this.taskParameters.tenantId,(err,credentials,subs) => {       
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