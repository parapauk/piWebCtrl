const apiRequests = {}; // Object to store XMLHttpRequest objects for getApi

async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    return { error: error.message };
  }
}

async function updateElement(elementId, content) {
  const element = document.getElementById(elementId);
  if (element) {
    element.innerHTML = content;
  } else {
    console.error(`Element with ID "${elementId}" not found.`);
  }
}

async function executeCommands(commands) {
  if (Array.isArray(commands)) {
    for (const command of commands) {
      console.log("Executing:", command);
      try {
        eval(command); // Consider alternatives to eval for security
      } catch (error) {
        console.error("Error executing command:", command, error);
      }
    }
  }
}

async function getApi(elementId, endpoint, params = {}) {
  const password = document.getElementById("password").value;

  if (!password) {
    return updateElement(elementId, "Password can't be empty");
  }

  await updateElement(elementId, ""); // Clear previous content

  const urlParams = new URLSearchParams({ ...params, pass: password, tm: Math.random() });
  const apiUrl = `${endpoint}?${urlParams.toString()}`;

  const data = await fetchData(apiUrl);

  if (!data.error) {
    if (data.html) {
      await updateElement(elementId, data.html);
    }
    if (data.cmd) {
      await executeCommands(data.cmd);
    }
  } else {
    await updateElement(elementId, data.error);
  }
}

async function getStats(outputElementId) {
  const apiUrl = `stats.json?tm=${Math.random()}`;
  const data = await fetchData(apiUrl);

  if (!data.error) {
    await updateElement("statsCPUSpeed", data.cpuspeed);
    await updateElement("statsCPUTemp", data.cputemp);
    await updateElement("statsRAMFree", data.ramfree);
    await updateElement("statsRAMTotal", data.ramtotal);
    await updateElement("statsSYSLoad", data.load);
    await updateElement("statsSYSUptime", data.uptime);
    await updateElement("statsSYSIP", data.ip);
    await updateElement("statsWIFI", data.wifi);
      const wifiStatusElement = document.getElementById('statsWIFI');
      const wifiStatusText = wifiStatusElement.innerText || wifiStatusElement.textContent;
      const regex = /Link Quality=(\d+\/\d+)/;
      const match = wifiStatusText.match(regex);
      const strengthSplit = match[1].split("/");
      const strength = strengthSplit[0];
      const total = strengthSplit[1]; 
      const strPerc = (strength/total*100).toFixed(2); 
      const meter = document.getElementById('wifiMeter');
      meter.value = strPerc;
  } else {
    await updateElement(outputElementId, data.error);
  }
  // setTimeout(() => getStats(outputElementId), 10000); // Consider using setInterval outside
}

// Initial stats load
getStats('output');

// Countdown Timer
let timeLeft = 5;
const timerInterval = 1000;
const timerElementId = 'timer';
const pulseElementId = 'stats';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function countdown() {
  const timerElement = document.getElementById(timerElementId);
  const pulseElement = document.getElementById(pulseElementId);

  if (timerElement && pulseElement) {
    if (timeLeft === 0) {
      timerElement.innerHTML = timeLeft;
      timeLeft = 5;
      await getStats('output');
      pulseElement.classList.add("animate");
      await sleep(500);
      pulseElement.classList.remove("animate");
      const wifiStatusElement = document.getElementById('statsWIFI');
      const wifiStatusText = wifiStatusElement.innerText || wifiStatusElement.textContent;
      const regex = /Link Quality=(\d+\/\d+)/;
      const match = wifiStatusText.match(regex);
      const strengthSplit = match[1].split("/");
      const strength = strengthSplit[0];
      const total = strengthSplit[1]; 
      const strPerc = (strength/total*100).toFixed(2); 
      const meter = document.getElementById('wifiMeter');
      meter.value = strPerc;
    } else {
      timerElement.innerHTML = timeLeft;
      timeLeft--;
    }
  } else {
    console.error(`Timer element with ID "${timerElementId}" or pulse element with ID "${pulseElementId}" not found.`);
    clearInterval(timerId); // Stop the interval if elements are missing
  }
}

const timerId = setInterval(countdown, timerInterval);
