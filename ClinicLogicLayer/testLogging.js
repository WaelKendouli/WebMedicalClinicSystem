
    const raw = localStorage.getItem("currentPatient");
        console.log("raw:", raw);                     // string or null
        if (raw) {
    const patient = JSON.parse(raw);
    console.log("parsed:", patient);          // object
    }
    
