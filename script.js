// Quering The DOM
const textEl = document.querySelector('.text');
const timerEl = document.querySelector('.time-left');
const mistakesEl = document.querySelector('.mistakes');
const wpmEl = document.querySelector('.wpm');
const cpmEl = document.querySelector('.cpm');
const replayEl = document.getElementById('replay');
const popupEl = document.querySelector('.popup');

// Helping Variables
let idx = 0;
let startTime;
let mainTime;
let int;
let spans;

// Get The Text
function getText() {
  const request = new XMLHttpRequest();
  request.addEventListener('readystatechange', e => {
    if (e.target.readyState === 4 && e.target.status === 200) {
      let data = JSON.parse(e.target.response).content;
      appendText(data)
    }
  });
  request.open('GET', 'https://api.quotable.io/random');
  request.send();
}
getText()

// Append Text
function appendText(text) {
  // Clearing The "textEl" Before Appending The Spans
  textEl.textContent = '';
  // Looping And Creating A Span For Each Character
  text.split('').forEach(char => {
    textEl.innerHTML += `<span ${char.trim() ? '' : 'class="space"'}>${char}</span>`
  });
  // Declare The Spans After Appending It
  spans = textEl.querySelectorAll('span');
  spans[0].classList.add('curr');
}

// "window" Listen To Click Event
window.onkeydown = e => {
  // Set The Time
  if (!startTime) startTime = new Date().getTime();
  mainTime = (new Date().getTime() - startTime) / 1000 / 60;
  if (idx < textEl.textContent.length) {
    // Calling Functions
    typingFunc(e);
    countMistakes();
    calcWPM();
    calcCPM();
    setTimer();
  }
  // Adding Effect On Reload Btn
  if (popupEl.classList.contains('active') && !replayEl.contains(replayEl.querySelector('span'))) reloadBtnEffect();
};

// Typing Function
function typingFunc(event) {
  if (event.key.length === 1) {
    if (idx < spans.length) {
      idx++;
      spans[idx - 1].classList = spans[idx - 1].textContent === event.key ? 'true' : 'false';
      checkSpace(idx - 1);
    };
  }
  if (event.key === 'Backspace') {
    if (idx > 0) {
      idx--;
      try {
        spans[idx + 1].classList = '';
        checkSpace(idx + 1);
      } catch {
        spans[idx].classList = 'curr';
        checkSpace(idx);
      }
    }
  }
  if (idx < spans.length) {
    spans[idx].classList = 'curr';
    checkSpace(idx);
  }
}

// Check Space Function
function checkSpace(index) {
  spans[index].classList += spans[index].textContent.trim() ? '' : ' space';
}

// Count The Mistakes
function countMistakes() {
  mistakesEl.textContent = `Mistakes: ${insertZero(textEl.querySelectorAll('span.false').length)}`;
}

// Calculate The WPM
function calcWPM() {
  wpmEl.textContent = `WPM: ${insertZero(textEl.textContent.slice(0, idx).split(' ').length / mainTime | 0)}`;
}

// Calculate The CPM
function calcCPM() {
  cpmEl.textContent = `CPM: ${insertZero(spans.length / mainTime | 0)}`;
}

// Set A Timer
function setTimer() {
  if (!textEl.querySelectorAll('span.false').length && idx >= textEl.textContent.length) {
    clearInt(int);
    // Show Popup
    popupEl.classList.add('active');
  } else {
    let localTime = (new Date().getTime() - startTime) / 1000 / 60;
    timerEl.textContent = `Counter: ${insertZero(localTime | 0)}:${insertZero(((30 * +(0 + (localTime + '').slice(1))) / 0.5) | 0)}`;
    int = setTimeout(() => setTimer(), 500);
  }
}

// Insert Zero Function
function insertZero(num) {
  return num > 9 ? num : `0${num}`;
}

// Clearing The Timeout
function clearInt(int) {
  clearTimeout(int);
}

// Adding Effect On Reload Btn Function
function reloadBtnEffect() {
  setInterval(() => {
    // Create The Effect Element
    const effectEl = document.createElement('span');
    [...replayEl.children].forEach(child => child.remove());
    replayEl.appendChild(effectEl);
  }, 600);
}

// "replayEl" Listen To Click Event
replayEl.addEventListener('click', () => location.reload());