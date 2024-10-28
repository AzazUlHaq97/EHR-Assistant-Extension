// background.js

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Message received from popup:', request); // Log the received message
  debugger; // Pause execution for debugging

  if (request.action === "openMeditech") {
      console.log('Opening MEDITECH...');
      chrome.tabs.create({ url: "https://mtest.aku.edu/test/" }, (tab) => {
          console.log('MEDITECH opened in new tab:', tab); // Log the opened tab details
          sendResponse({ status: "MEDITECH opened", tabId: tab.id }); // Send response back
      });
      return true; // Keep the message channel open for asynchronous response
  }

  if (request.action === "findPatient") {
      console.log('Finding patient:', request.patientName); // Log patient name
      // chrome.tabs.query({ title: "Acute Status Board - MEDITECH" }, (tabs) => {
        chrome.tabs.query({ url: "https://mtest.aku.edu/test/*" }, (tabs) => {
          if (tabs.length > 0) {
              const tabId = tabs[0].id;
              console.log('Acute Status Board found. Tab ID:', tabId); // Log the found tab ID
              chrome.scripting.executeScript({
                  target: { tabId: tabId },
                  function: searchPatient,
                  args: [request.patientName] // Pass patient name to the function
              });
              // sendResponse({ status: "Searching for patient", patientName: request.patientName });
          } else {
              console.log('No MEDITECH Acute Status Board is open.');
              sendResponse({ status: "MEDITECH Acute Status Board is not open." });
          }
      });
      return true; // Keep the message channel open for asynchronous response
  }

  if (request.action === "showProblems") {
   
    // chrome.tabs.query({ title: "Acute Status Board - MEDITECH" }, (tabs) => {
      chrome.tabs.query({ url: "https://mtest.aku.edu/test/*" }, (tabs) => {
        if (tabs.length > 0) {
            const tabId = tabs[0].id;
            console.log('Acute Status Board found. Tab ID:', tabId); // Log the found tab ID
            chrome.scripting.executeScript({
                target: { tabId: tabId },
                function: showProblems
            });
            // sendResponse({ status: "Searching for patient", patientName: request.patientName });
        } else {
            console.log('No MEDITECH Acute Status Board is open.');
            sendResponse({ status: "MEDITECH Acute Status Board is not open." });
        }
    });
    return true; // Keep the message channel open for asynchronous response
}

if (request.action === "showAllergies") {
   
    // chrome.tabs.query({ title: "Acute Status Board - MEDITECH" }, (tabs) => {
      chrome.tabs.query({ url: "https://mtest.aku.edu/test/*" }, (tabs) => {
        if (tabs.length > 0) {
            const tabId = tabs[0].id;
            console.log('Acute Status Board found. Tab ID:', tabId); // Log the found tab ID
            chrome.scripting.executeScript({
                target: { tabId: tabId },
                function: showAllergies
            });
            // sendResponse({ status: "Searching for patient", patientName: request.patientName });
        } else {
            console.log('No MEDITECH Acute Status Board is open.');
            sendResponse({ status: "MEDITECH Acute Status Board is not open." });
        }
    });
    return true; // Keep the message channel open for asynchronous response
}

});

// Function to show allergies of Patient
function showAllergies() {
    debugger;
    console.log('Atempting to show patient allergies..'); // Log the search action

     // Remove any divs with IDs containing "popovershell" and "shader"
     const popoverShaderDivs = document.querySelectorAll('div[id*="popovershell"][id*="shader"]');
     popoverShaderDivs.forEach(div => {
         div.remove();
         console.log('Removed div with "popovershell" and "shader" in ID.');
     });
 
     // Remove any divs with IDs containing "popovershell" and "outer"
     const popoverOuterDivs = document.querySelectorAll('div[id*="popovershell"][id*="outer"]');
     popoverOuterDivs.forEach(div => {
         div.remove();
         console.log('Removed div with "popovershell" and "outer" in ID.');
     });
     

    // const searchBox = document.getElementById('x3M4_K-ix'); // Select the search input box
    const spans = document.querySelectorAll('span');
    const problemSpan = Array.from(spans).find(span => span.textContent.trim() === 'Allergies');
    
    debugger; // Pause execution for debugging
    if (problemSpan) {
        console.log('Allergies span found.'); // Log when search box is found
        problemSpan.click(); // Trigger a click event
        console.log('Clicked on the span with text "Allergies".');
    } else {
        console.error('Allergies span not found'); // Log error if search box is not found
    }
  }


// Function to show problems of Patient
function showProblems() {
    debugger;
    console.log('Atempting to show patient problems..'); // Log the search action
    // const searchBox = document.getElementById('x3M4_K-ix'); // Select the search input box
    const spans = document.querySelectorAll('span');
    const problemSpan = Array.from(spans).find(span => span.textContent.trim() === 'Problems');
    
    debugger; // Pause execution for debugging
    if (problemSpan) {
        console.log('Problems span found.'); // Log when search box is found
        problemSpan.click(); // Trigger a click event
        console.log('Clicked on the span with text "Problems".');
    } else {
        console.error('Problems span not found'); // Log error if search box is not found
    }
  }


// Function to search for the patient in the open MEDITECH tab
function searchPatient(patientName) {
  debugger;
  console.log('Searching for patient in MEDITECH:', patientName); // Log the search action
  // const searchBox = document.getElementById('x3M4_K-ix'); // Select the search input box
  const searchBox = document.querySelector('input[placeholder="Find Patient"]'); 
  debugger; // Pause execution for debugging
  if (searchBox) {
      console.log('Search box found, typing patient name.'); // Log when search box is found
      searchBox.value = patientName; // Set the patient name in the input box
      searchBox.dispatchEvent(new Event('input', { bubbles: true })); // Trigger input event
      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }); // Create Enter key event
      searchBox.dispatchEvent(enterEvent); // Simulate Enter key press
      console.log('Search executed for patient:', patientName); // Log when search is executed
  } else {
      console.error('Search box not found'); // Log error if search box is not found
  }
}
