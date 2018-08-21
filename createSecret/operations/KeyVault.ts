import keyVaultTaskParameters = require("../models/KeyVaultTaskParameters");
import azureKeyVault = require("azure-keyvault");
import util = require("util");
import tl = require("vsts-task-lib/task");
var randomize = require('randomatic');
var AuthenticationContext = require('adal-node').AuthenticationContext;

export class KeyVault {

    
    private taskParameters: keyVaultTaskParameters.KeyVaultTaskParameters;
    private keyVaultClient: azureKeyVault.KeyVaultClient;

    constructor(taskParameters: keyVaultTaskParameters.KeyVaultTaskParameters) {
        this.taskParameters = taskParameters;
        this.keyVaultClient = new azureKeyVault.KeyVaultClient(this.taskParameters.vaultCredentials);
    }

    createSecret(secretName:string,secretValue:string,secretLength:number,excludeSpecialChars:boolean) {
        try{
            let pattern = excludeSpecialChars ? "Aa0" : "*";

            if(secretValue === undefined && !secretValue){
                secretValue = randomize(pattern,secretLength);
            }

            this.keyVaultClient.setSecret(this.taskParameters.keyVaultUrl,secretName,secretValue);
        }
        catch(e){
            tl.setResult(tl.TaskResult.Failed,"Failed to save key to the Key Vault. => " + e);
        }
    }


}