/* this js file is a module for repetitve
 essensial data loading method it depeends on CRUD helper.js */

 import * as CRUDHelper from './CRUDhelper.js';

 export async function LoadDoctors(RenderingFunction)
 {
   try {
     const data = await CRUDHelper.Get("Doctors" , "GetAllDoctors");
       RenderingFunction(data);
   } catch (error) {
     console.log(error.message);
   }

 }

 export async function LoadClinicServices(RenderingFunction)
 {
   try {
     const data = await CRUDHelper.Get("ClinicServices" , "GetAllSerives");
       RenderingFunction(data);
   } catch (error) {
     console.log(error.message);
   }
 }

 export async function LoadAllAppointmentsForPatient(RenderingFunction , patientID)
 {
   try {
     const data = await CRUDHelper.GetByAttribute("Appointment" ,"GetAppointmentList" , patientID);
       RenderingFunction(data);
   } catch (error) {
     console.log(error.message);
   }
 }

 export async function LoadAllAppointmentsForDoctor(RenderingFunction , doctorID)
 {
   try {
     const data = await CRUDHelper.GetByAttribute("Doctors" ,"GetListOfAppointmentsByDoctorID" , doctorID);
       RenderingFunction(data);
   } catch (error) {
     console.log(error.message);
   }
 }

  export async function LoadAllCancledAppointmentsForPatient(RenderingFunction , patientID)
 {
   try {
     const data = await CRUDHelper.GetByAttribute("Appointment" ,"GetCancelledAppointmentList" , patientID);
       RenderingFunction(data);
   } catch (error) {
     console.log(error.message);
   }
 }

 export async function LoadAllSpeicialities(RenderingFunction)
 {
    try {
     const data = await CRUDHelper.Get("Doctors" ,"GetSpecializations");
       RenderingFunction(data);
   } catch (error) {
     console.log(error.message);
   }
 }

 export async function LoadAllMedications(RenderingFunction)
 {
  try {
    const data = await CRUDHelper.Get("Medications" , "GetListOfMedications");
    await RenderingFunction(data);
  } catch (error) {
    throw new Error(error.message);
  }
 }

 export async function LoadAllCategories(RenderingFunction)
 {
  try {
    const data = await CRUDHelper.Get("Medications" , "GetListOfMedicationCategories");
    await RenderingFunction(data);
  } catch (error) {
    throw new Error(error.message);
  }
 }

 export async function LoadAllDosageForms(RenderingFunction)
 {
  try {
    const data = await CRUDHelper.Get("Medications" , "GetListOfDosageForm");
    await RenderingFunction(data);
  } catch (error) {
    throw new Error(error.message);
  }
 }