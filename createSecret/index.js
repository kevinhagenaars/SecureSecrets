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
const tl = require("vsts-task-lib");
const kv = require("./operations/KeyVault");
const keyVaultTaskParameters = require("./models/KeyVaultTaskParameters");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            validateInput();
            let taskParameters = new keyVaultTaskParameters.KeyVaultTaskParameters();
            let keyvault = new kv.KeyVault(taskParameters);
            keyvault.createSecret(tl.getInput("SecretName"), tl.getInput("SecretValue"), parseInt(tl.getInput("SecretLength")), tl.getBoolInput("ExcludeSpecialChars"));
        }
        catch (error) {
            tl.setResult(tl.TaskResult.Failed, "Error occured -> " + error);
        }
    });
}
function validateInput() {
    try {
        let length = parseInt(tl.getInput("SecretLength"));
        if (length <= 0) {
            tl.setResult(tl.TaskResult.Failed, "Not a valid secret length.");
        }
    }
    catch (e) {
        tl.setResult(tl.TaskResult.Failed, "Not a valid secret length.");
    }
}
run();
