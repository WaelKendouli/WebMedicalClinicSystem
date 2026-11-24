import * as objCRUDHelper from  './CRUDhelper.js';

export async function SendEmail(emailObj) {

    try {
        const res = await objCRUDHelper.Post( emailObj, "EmailService" ,"SendEmail");
        return res;
    } catch (error) {
        throw new Error(error.message);
    }

}