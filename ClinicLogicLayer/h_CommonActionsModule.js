// module for shared repetitive action between almost every Role

import * as objCRUD from "./CRUDhelper.js"

export async function UpdateAppointementForPatient(patientID , newObj)
{
try {
 const res = await objCRUD.Put(patientID , newObj , "Appointment" , "UpdateAppointment");
 return res;  
} catch (error) {
    throw new Error(error.message);
}
return false;
}

export async function ChangeAppointmentStatusToInProgress(appointmentID)
{
try {
 const res = await objCRUD.Put(appointmentID , null , "Appointment" , "InProgressAppointment");
 return res;  
} catch (error) {
    throw new Error(error.message);
}
}