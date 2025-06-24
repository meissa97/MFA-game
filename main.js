// import { balloons } from "balloons-js";
let wrongCount = 0;
let rightCount = 0;
let score = document.querySelector('.score .inner')
let mistakes = document.querySelector('.mistakes .inner')
let username = document.querySelector('.username .inner')
let leftButton = document.querySelector('.left-button')
let rightButton = document.querySelector('.right-button')
let restartButton = document.querySelector('.restart')
let surveyButton = document.querySelector('.survey')
let user = document.querySelector('.overlay .user #un')
let staff = document.querySelector('.overlay .staff-id #staff')
let overlay = document.querySelector('.overlay')
let startButton = document.querySelector('.start')
startButton.onclick = function (){
  if (user.value == null || user.value == "") {
    alert("Please enter your username!");
  } else{
    if (staff.value == null || staff.value == "") {
          alert("Please enter your staff ID!");
    }else{
      username.innerHTML = user.value
      username.style.textTransform = "capitalize"
      overlay.style.display = 'none'
      document.getElementById('start').play()
      // Fetch hits here
        logStartClick(user.value.trim(), staff.value.trim())
    }
  }
}

restartButton.onclick = function(){
  window.location.reload()
}
score.innerHTML = rightCount
mistakes.innerHTML = wrongCount
function shuffleArray(array) {
  
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
const cases = [
    { text: "Add static IP", factor: 1 },
    // { text: "DSL/Fixed deactivation", factor: 1 },
    // { text: "DSL/Fixed activation", factor: 1 },
    // { text: "DSL reactivation", factor: 1 },
    // { text: "DSL renewal / early renewal (pre)", factor: 1 },
    // { text: "Repurchase (post)", factor: 1 },
    // { text: "DSL add-on", factor: 1 },
    // { text: "At home add-on", factor: 1 },
    // { text: "Activate/deactivate MI bundles", factor: 1 },
    // { text: "DSL suspension vacation", factor: 2 },
    // { text: "At home change rateplan", factor: 2 },
    // { text: "At home repurchase / renew (post or pre)", factor: 2 },
    // { text: "DSL remove suspension", factor: 2 },
    // { text: "Ana Vodafone delete account", factor: 2 },
    // { text: "DSL upgrade / downgrade", factor: 2 },
    // { text: "DSL Wi-Fi password", factor: 2 },
    // { text: "DSL MAC filter settings", factor: 2 },
    // { text: "DSL router admin", factor: 2 },
    // { text: "Deny usage at home (usage details)", factor: 2 },
    // { text: "DSL deny usage report (procera)", factor: 2 },
    // { text: "At home suspension vacation / lost or stolen", factor: 2 },
    // { text: "At home remove suspension", factor: 2 }
  ];
  
  shuffleArray(cases);

  let currentIndex = 0;
  let winBanner = document.querySelector('.banner.win')
  function showNextCard() {
    const cardArea = document.getElementById("card-area");
    cardArea.innerHTML = "";
  
    if (currentIndex >= cases.length) {
      console.log("📤 Sending to Google Sheet...");
      sendToSheet(user.value,staff.value, rightCount, wrongCount);
      cardArea.innerHTML = `<div style="font-size: 24px; color: #ED1C24;font-weight: bold;">👏 Bravo, ${user.value.toUpperCase()}👏 <br>
      You have finished the game <br> with score: ${rightCount} <br> and only ${wrongCount} mistakes 💪</div>`;
      leftButton.style.display = "none";
      rightButton.style.display = "none";
      restartButton.style.display = "block"
      surveyButton.style.display = "block"
      setTimeout(() => {
confetti({
  particleCount: 120,
  spread: 90,
  origin: { y: 0.6 }
});

setTimeout(() => {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.5 }
  });
}, 1000);

setTimeout(() => {
  confetti({
    particleCount: 80,
    spread: 120,
    origin: { y: 0.4 }
  });
}, 2000);
releaseBalloons(30); 
        document.getElementById('win').play()
        winBanner.classList.add("visible");
    }, 1000);
      return;
    }
  
    const currentCase = cases[currentIndex];
  
    const card = document.createElement("div");
    card.className = "card";
    card.draggable = true;
    card.textContent = currentCase.text;
    card.dataset.factor = currentCase.factor;
  
    card.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", card.dataset.factor);
    });
  
    cardArea.appendChild(card);
  }
  
  function setupDropZones() {
    const one = document.getElementById("one-factor");
    const two = document.getElementById("two-factors");
  
    [one, two].forEach((zone) => {
      zone.addEventListener("dragover", (e) => e.preventDefault());
  
      zone.addEventListener("drop", (e) => {
        e.preventDefault();
        const expectedFactor = parseInt(e.dataTransfer.getData("text/plain"));
        const droppedOn = zone.id === "one-factor" ? 1 : 2;
  
        checkAnswer(expectedFactor, droppedOn);
      });
    });
  }
  
  function handleDropManual(targetFactor) {
    if (currentIndex >= cases.length) return;
  
    const currentCase = cases[currentIndex];
    checkAnswer(currentCase.factor, targetFactor);
  }
  
  function checkAnswer(expectedFactor, droppedOn) {
    // const cardArea = document.getElementById("card-area");
    const currentCase = cases[currentIndex];
  
    const card = document.createElement("div");
    card.className = "card";
    card.textContent = currentCase.text;
    card.style.cursor = "default";
  
    const columnId = droppedOn === 1 ? "one-factor" : "two-factors";
    const column = document.getElementById(columnId);
    
    if (expectedFactor === droppedOn) {
      column.appendChild(card);
      correctAnswer()
      currentIndex++;
      showNextCard();
      rightCount++;
      score.innerHTML = rightCount
    } else {
      wrongAnswer()
      wrongCount++;
      mistakes.innerHTML = wrongCount
    }

  }
  let goodAnswer = document.querySelector('.banner.good')
  let badAnswer = document.querySelector('.banner.bad')
  
  function correctAnswer(){
    document.getElementById('yes').play()
    goodAnswer.classList.add("visible");
    setTimeout(() => {
      goodAnswer.classList.remove("visible");
    }, 600);
  }
  function wrongAnswer(){
    document.getElementById('no').play()
    badAnswer.classList.add("visible");
    setTimeout(() => {
      badAnswer.classList.remove("visible");
    }, 500);
  }
  
  setupDropZones();
  showNextCard();
// Balloons

function releaseBalloons(count = 50) {
  const container = document.querySelector('.balloons-container');

  for (let i = 0; i < count; i++) {
    const balloon = document.createElement('div');
    balloon.classList.add('balloon');

    // Random position
    balloon.style.left = Math.random() * 100 + "%";

    // Random colors
    balloon.style.backgroundColor = getRandomColor();

    // Random size
    const width = 30 + Math.random() * 20;
    const height = 45 + Math.random() * 20;
    balloon.style.width = `${width}px`;
    balloon.style.height = `${height}px`;

    // Random animation speed (faster now)
    const duration = 2 + Math.random() * 2; // Between 2 and 4 seconds
    balloon.style.setProperty('--duration', `${duration}s`);

    // Random movement (sideways)
    const sideMove = (Math.random() - 0.5) * 200; // -100px to +100px
    balloon.style.setProperty('--x-move', `${sideMove}px`);

    // Random rotation
    const rotation = (Math.random() - 0.5) * 60; // -30deg to +30deg
    balloon.style.setProperty('--rotation', `${rotation}deg`);

    container.appendChild(balloon);

    // Remove balloon after animation
    setTimeout(() => {
      container.removeChild(balloon);
    }, duration * 1000 + 500);
  }
}

function getRandomColor() {
  const colors = ["#FF4C4C", "#FFD93D", "#6BCB77", "#4D96FF", "#D76EF5", "#FF6F91", "#845EC2", "#00C9A7"];
  return colors[Math.floor(Math.random() * colors.length)];
}

  //Data fetching code

function sendToSheet(username, staffId, score, mistakes) {
  fetch("https://api.sheetbest.com/sheets/4571d8fb-b86b-4caf-843d-2931950ec2b9", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "Username": username,
      "Staff ID": staffId,
      "Score": score,
      "Mistakes": mistakes,
      "Date": new Date().toLocaleString()
    })
  })
  .then(res => res.json())
  .then(data => console.log("✅ Sent to Sheet.best:", data))
  .catch(err => console.error("❌ Error sending to Sheet.best:", err));
}

function logStartClick(username, staffId) {
  fetch("https://api.sheetbest.com/sheets/c3a1e689-f058-4b01-a220-7f78902649ea", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "Username": username,
      "Staff ID": staffId,
      "Start Time": new Date().toLocaleString()
    })
  })
  .then(res => res.json())
  .then(data => console.log("✅ Start logged:", data))
  .catch(err => console.error("❌ Error logging start:", err));
}
