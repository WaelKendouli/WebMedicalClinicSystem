// module for shared repetitive action between almost every Role

import * as objCRUD from "./CRUDhelper.js"

export async function UpdateAppointementForPatient(patientID , newObj)
{
try {
 const res = objCRUD.Put(patientID , newObj , "Appointment" , "UpdateAppointment");
 return res;  
} catch (error) {
    throw new Error(error.message);
}
return false;
}