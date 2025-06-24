let wrongCount = 0;
let rightCount = 0;
let score = document.querySelector('.score .inner')
let mistakes = document.querySelector('.mistakes .inner')
let username = document.querySelector('.username .inner')
let leftButton = document.querySelector('.left-button')
let rightButton = document.querySelector('.right-button')
let restartButton = document.querySelector('.restart')
let user = document.querySelector('.overlay .user input')
let overlay = document.querySelector('.overlay')
let startButton = document.querySelector('.start')
startButton.onclick = function (){
  if (user.value == null || user.value == "") {
    alert("Please enter your username!");
  } else{
    username.innerHTML = user.value
    username.style.textTransform = "capitalize"
    overlay.style.display = 'none'
    document.getElementById('start').play()
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
    { text: "DSL/Fixed deactivation", factor: 1 },
    { text: "DSL/Fixed activation", factor: 1 },
    { text: "DSL reactivation", factor: 1 },
    { text: "DSL renewal / early renewal (pre)", factor: 1 },
    { text: "Repurchase (post)", factor: 1 },
    { text: "DSL add-on", factor: 1 },
    { text: "At home add-on", factor: 1 },
    { text: "Activate/deactivate MI bundles", factor: 1 },
    { text: "DSL suspension vacation", factor: 2 },
    { text: "At home change rateplan", factor: 2 },
    { text: "At home repurchase / renew (post or pre)", factor: 2 },
    { text: "DSL remove suspension", factor: 2 },
    { text: "Ana Vodafone delete account", factor: 2 },
    { text: "DSL upgrade / downgrade", factor: 2 },
    { text: "DSL Wi-Fi password", factor: 2 },
    { text: "DSL MAC filter settings", factor: 2 },
    { text: "DSL router admin", factor: 2 },
    { text: "Deny usage at home (usage details)", factor: 2 },
    { text: "DSL deny usage report (procera)", factor: 2 },
    { text: "At home suspension vacation / lost or stolen", factor: 2 },
    { text: "At home remove suspension", factor: 2 }
  ];
  
  shuffleArray(cases);

  let currentIndex = 0;
  let winBanner = document.querySelector('.banner.win')
  function showNextCard() {
    const cardArea = document.getElementById("card-area");
    cardArea.innerHTML = "";
  
    if (currentIndex >= cases.length) {
      console.log("📤 Sending to Google Sheet...");
      sendToSheet(user.value.trim(), rightCount, wrongCount);
      cardArea.innerHTML = `<div style="font-size: 24px; color: #ED1C24;font-weight: bold;">👏 Bravo, ${user.value.toUpperCase()}👏 <br>
      You have finished the game <br> with score: ${rightCount} <br> and only ${wrongCount} mistakes 💪</div>`;
      leftButton.style.display = "none";
      rightButton.style.display = "none";
      restartButton.style.display = "block"
      setTimeout(() => {
        document.getElementById('win').play()
        winBanner.classList.add("visible");
        setTimeout(() => {
          winBanner.classList.remove("visible");
          // window.location.reload()
        }, 3000);
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

 function sendToSheet(username, score, mistakes) {
  fetch("https://v1.nocodeapi.com/meissa9701/google_sheets/mMMMRkorSEFQUMii?tabId=mfa", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify([
      [username.trim(), new Date().toLocaleString(), mistakes, score]
    ])
  })
  .then(res => res.json())
  .then(data => {
    console.log("✅ Data sent to sheet:", data);
  })
  .catch(err => {
    console.error("❌ Error sending to sheet:", err);
  });
}
