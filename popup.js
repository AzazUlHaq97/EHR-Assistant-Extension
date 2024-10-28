// popup.js

// Check for Speech Recognition API
console.log('popup.js loaded successfully');

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (!SpeechRecognition) {
    debugger;
    console.error('Speech Recognition API not supported in this browser.');
} else {
    const recognition = new SpeechRecognition();
    recognition.interimResults = false; // Set to false to get final results only
    recognition.lang = 'en-US'; // Set language for recognition

    document.getElementById('startButton').addEventListener('click', () => {
        console.log('Starting voice recognition...');
        recognition.start(); // Start listening for voice commands
    });

    // Process voice commands
    recognition.onresult = (event) => {
        debugger;
        const transcript = event.results[0][0].transcript.toUpperCase(); // Get the spoken command
        console.log('Command received:', transcript); // Debugging line
        interpretCommand(transcript); // Handle the recognized command
    };

    recognition.onerror = (event) => {
        debugger;
        switch (event.error) {
            case 'not-allowed':
                console.error('Microphone access denied. Please allow microphone access in your browser settings.');
                alert('Microphone access denied. Please check your browser settings.');
                break;
            case 'service-not-allowed':
                console.error('Speech recognition service not allowed. Check your browser settings.');
                alert('Speech recognition service not allowed. Please check your browser settings.');
                break;
            default:
                console.error('Speech recognition error:', event.error); // Log other errors
        }
    };

    async function interpretCommand(transcript) {
        const openaiApiKey = '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'; // Replace with your actual API key
        debugger;
        const messages = [
            { role: "system", content: "You are a helpful assistant that classifies commands for a physician based on voice input." },
            { role: "user", content: `Here is a transcription of the physician's voice: "${transcript}".` },
            { role: "user", content: `
                Decide which command best matches what the physician wants. The possible commands are:
                1. FIND PATIENT <PATIENTNAME>
                2. SHOW LABS
                3. SHOW PROBLEMS
                4. SHOW ALLERGIES
                5. SHOW MEDICATIONS
                6. SHOW IMMUNIZATIONS
                7. SHOW VISITS                
                Respond with one of the three options exactly as written. If the command is "FIND PATIENT," only include the patient's actual name without any additional words or phrases (e.g., ignore words like "Ka Record" or "Dikhaain" in other languages).
            `}
        ];
    
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${openaiApiKey}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: messages,
                max_tokens: 50, // Keep this short since we just need a command response
                temperature: 0 // Lower temperature for deterministic output
            })
        });
        debugger;
        const data = await response.json();
        const commandOutput = data.choices[0].message.content.trim();
        console.log('OpenAI Command Output:', commandOutput);
        
        // Handle the command based on OpenAI's response
        handleCommand(commandOutput);
    }

    // Function to handle recognized commands
    function handleCommand(command) {
        debugger;
        console.log(`Handling command: ${command}`);
        debugger; // Pause execution for debugging
        if (command.includes("OPEN MEDITECH")) {
            console.log('Command recognized: OPEN MEDITECH');
            chrome.runtime.sendMessage({ action: "openMeditech" }, response => {
                console.log('Response from background:', response.status); // Log the response status
            });
        } else if (command.includes("FIND PATIENT")) {
            const patientName = command.split("FIND PATIENT ")[1];
            if (patientName) {
                console.log(`Searching for patient: ${patientName}`);
                chrome.runtime.sendMessage({ action: "findPatient", patientName: patientName }, response => {
                    console.log('Response from background:', response.status, response.patientName); // Log the response
                });
            } else {
                console.log('No patient name provided.');
            }
        } 
        else if (command.toUpperCase().includes("SHOW") && command.toUpperCase().includes("PROBLEMS")) {
            debugger;
                chrome.runtime.sendMessage({ action: "showProblems"}, response => {
                    console.log('Response from background:', response.status); // Log the response
                });         
        } 
        else if (command.toUpperCase().includes("SHOW") && command.toUpperCase().includes("ALLERGIES")) {
            debugger;
                chrome.runtime.sendMessage({ action: "showAllergies"}, response => {
                    console.log('Response from background:', response.status); // Log the response
                });         
        } 
        else if (command.toUpperCase().includes("SHOW") && command.toUpperCase().includes("MEDICATIONS")) {
            debugger;
                chrome.runtime.sendMessage({ action: "showMedications"}, response => {
                    console.log('Response from background:', response.status); // Log the response
                });         
        } 
        else if (command.toUpperCase().includes("SHOW") && command.toUpperCase().includes("IMMUNIZATIONS")) {
            debugger;
                chrome.runtime.sendMessage({ action: "showImmunizations"}, response => {
                    console.log('Response from background:', response.status); // Log the response
                });         
        } 
        else if (command.toUpperCase().includes("SHOW") && command.toUpperCase().includes("VISITS")) {
            debugger;
                chrome.runtime.sendMessage({ action: "showVisits"}, response => {
                    console.log('Response from background:', response.status); // Log the response
                });         
        } 
        else {
            console.log('Command not recognized.');
        }
    }
}
