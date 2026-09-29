class Patient {
constructor(patientID = null, firstName = '', lastName = '',
        dateOfBirth = null, email = '', phone = '', address = '', gender = '') {
        this.patientID = patientID;
        this.firstName = firstName;
        this.lastName = lastName;
        this.dateOfBirth = dateOfBirth;
        this.email = email;
        this.phone = phone;
        this.address = address;
        this.gender = gender;
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
    const raw = localStorage.getItem("currentPatient");
        console.log("raw:", raw); 
                                    // string or null
            if (raw) {
            CurrentPatient = JSON.parse(raw);
            console.log("parsed:", CurrentPatient);          // object
            }
    return CurrentPatient;
}