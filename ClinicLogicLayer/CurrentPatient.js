class Patient {
    constructor(patientID , firstName , lastName ,
         dateOfBirth , email , phone , address , gender )
{
    this.patientID = patientID;
    this.firstName = firstName;
    this.lastName = lastName;
    this.dateOfBirth = dateOfBirth;
    this.email = email;
    this.phone = phone;
    this.address = address;
    this.gender = gender;
}
constructor()
{

}
}

export let CurrentPatient = new Patient();

export function SetPatientInfos(patient)
{
    CurrentPatient = new Patient(patient.patientID , patient.firstName , patient.lastName ,
         patient.dateOfBirth , patient.email ,
          patient.phone , patient.address , patient.gender);
}

export function GetPatientInfos()
{
    return CurrentPatient;
}