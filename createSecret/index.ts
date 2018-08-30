
import tl = require('vsts-task-lib');
import kv = require('./operations/KeyVault');
import keyVaultTaskParameters = require("./models/KeyVaultTaskParameters");

async function run() {
    try {
        validateInput();
        let taskParameters = new keyVaultTaskParameters.KeyVaultTaskParameters();
        let keyvault = new kv.KeyVault(taskParameters);
        for (let sName of tl.getInput("SecretName").split(',')) {
            await keyvault.createSecret(taskParameters.vaultCredentials, sName.trim(), tl.getInput("SecretValue"), parseInt(tl.getInput("SecretLength")), tl.getBoolInput("ExcludeSpecialChars"), tl.getBoolInput("KeepValue"));
        }        
    } 
    catch (error) {
        tl.setResult(tl.TaskResult.Failed, "Error occured -> "+error);
    }

}

function validateInput(){
    try{
        let length = parseInt(tl.getInput("SecretLength"));
        if(length <= 0){
            tl.setResult(tl.TaskResult.Failed, "Not a valid secret length.");
        }
    }
    catch(e){
        tl.setResult(tl.TaskResult.Failed, "Not a valid secret length.");
    }
}

run();