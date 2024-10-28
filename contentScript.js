// contentScript.js
(function () {
  debugger;
    console.log('Content script loaded: Floating Mic');
  
    // Check if the mic icon is already added to prevent duplicates
    if (document.getElementById('floatingMicIcon')) {
      return;
    }
  
    // Create the floating mic icon
    var micIcon = document.createElement('div');
    micIcon.id = 'floatingMicIcon';
    micIcon.style.position = 'fixed';
    micIcon.style.bottom = '20px'; // Adjust as needed
    micIcon.style.right = '20px'; // Adjust as needed
    micIcon.style.width = '50px'; // Adjust size as needed
    micIcon.style.height = '50px';
    micIcon.style.backgroundColor = '#008e4f'; // Background color or image
    micIcon.style.borderRadius = '50%';
    micIcon.style.cursor = 'pointer';
    micIcon.style.zIndex = '9999'; // Ensure it's on top
  
    // Use an image for the mic icon
    micIcon.style.backgroundImage = 'url(' + chrome.runtime.getURL('icons/mic.png') + ')';
    micIcon.style.backgroundSize = 'contain';
    micIcon.style.backgroundRepeat = 'no-repeat';
    micIcon.style.backgroundPosition = 'center';
  
    document.body.appendChild(micIcon);
  
    // Make the icon draggable
    micIcon.onmousedown = function (event) {
      event.preventDefault();
  
      var shiftX = event.clientX - micIcon.getBoundingClientRect().left;
      var shiftY = event.clientY - micIcon.getBoundingClientRect().top;
  
      function moveAt(pageX, pageY) {
        micIcon.style.left = pageX - shiftX + 'px';
        micIcon.style.top = pageY - shiftY + 'px';
        micIcon.style.bottom = 'auto';
        micIcon.style.right = 'auto';
      }
  
      function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
      }
  
      document.addEventListener('mousemove', onMouseMove);
  
      micIcon.onmouseup = function () {
        document.removeEventListener('mousemove', onMouseMove);
        micIcon.onmouseup = null;
      };
    };
  
    micIcon.ondragstart = function () {
      return false;
    };
  
    // Handle click on mic icon to start voice recognition
    micIcon.addEventListener('click', function () {
      console.log('Floating mic icon clicked: starting voice recognition');
  
      // Speech recognition code
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        console.error('Speech Recognition API not supported in this browser.');
        alert('Speech Recognition API not supported in this browser.');
      } else {
        const recognition = new SpeechRecognition();
        recognition.interimResults = false; // Get final results only
        recognition.lang = 'en-US'; // Set language for recognition
  
        recognition.start(); // Start listening for voice commands
  
        // Provide feedback that recognition has started
        micIcon.style.opacity = '0.6'; // Example visual feedback
  
        recognition.onresult = (event) => {
          micIcon.style.opacity = '1'; // Reset visual feedback
          const transcript = event.results[0][0].transcript.toUpperCase(); // Get the spoken command
          console.log('Command received:', transcript); // Debugging line
          handleCommand(transcript); // Handle the recognized command
        };
  
        recognition.onerror = (event) => {
          micIcon.style.opacity = '1'; // Reset visual feedback
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
      }
  
      // Function to handle recognized commands
      function handleCommand(command) {
        console.log(`Handling command: ${command}`);
  
        if (command.includes("OPEN MEDITECH")) {
          console.log('Command recognized: OPEN MEDITECH');
          chrome.runtime.sendMessage({ action: "openMeditech" }, (response) => {
            console.log('Response from background:', response ? response.status : 'No response');
          });
        } else if (command.includes("FIND PATIENT")) {
          const patientName = command.split("FIND PATIENT ")[1];
          if (patientName) {
            console.log(`Searching for patient: ${patientName}`);
            chrome.runtime.sendMessage({ action: "findPatient", patientName: patientName }, (response) => {
              console.log('Response from background:', response ? response.status : 'No response');
            });
          } else {
            console.log('No patient name provided.');
          }
        } else {
          console.log('Command not recognized.');
        }
      }
    });
  })();