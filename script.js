let timer;
let timeLeft;
let isRunning = false;
let canvas;
let context;
let radius;
const startingMinutes = 0.1; // 6 seconds for testing purposes
let animationStartTime;
const animationDuration = 1000; // 1 second
let lastInterpolatedPercent = 0;

function startTimer() {
  if (!isRunning) {
    isRunning = true;
    document.getElementById('startBtn').textContent = 'Pause';
    document.getElementById('resetBtn').disabled = false;
    timeLeft = startingMinutes * 60;

    canvas = document.getElementById('progressCanvas');
    context = canvas.getContext('2d');
    radius = canvas.width / 2;
    context.lineWidth = 5;
    context.strokeStyle = '#4caf50';

    drawProgress(0); // 초기 그래프를 그리기 위해 호출
    animationStartTime = performance.now(); // 애니메이션 시작 시간 기록
    requestAnimationFrame(updateTimer);
  } else {
    pauseTimer();
  }
}

function updateTimer(currentTime) {
  const elapsedTime = currentTime - animationStartTime;
  const animationProgress = Math.min(elapsedTime / animationDuration, 1);

  const percentCompleted = 1 - (timeLeft / (startingMinutes * 60));
  const interpolatedPercent = lastInterpolatedPercent + (percentCompleted - lastInterpolatedPercent) * animationProgress;

  drawProgress(interpolatedPercent);
  lastInterpolatedPercent = interpolatedPercent;

  if (animationProgress < 1) {
    requestAnimationFrame(updateTimer);
  } else {
    if (timeLeft === 0) {
      pauseTimer();
      alert('Time is up! Take a break!');
    } else {
      timeLeft--;
      animationStartTime = performance.now();
      lastInterpolatedPercent = 0; // 새로운 초가 시작되면 이전 상태를 초기화
      requestAnimationFrame(updateTimer);
    }
  }

  const minutes = Math.floor(timeLeft / 60);
  let seconds = timeLeft % 60;
  seconds = seconds < 10 ? '0' + seconds : seconds;
  document.getElementById('time').textContent = `${minutes}:${seconds}`;
}

function drawProgress(percentCompleted) {
  context.clearRect(0, 0, canvas.width, canvas.height);

  const endAngle = (2 * Math.PI * percentCompleted) - (Math.PI / 2);

  context.beginPath();
  context.arc(radius, radius, radius - 10, -Math.PI / 2, endAngle);
  context.stroke();
}

function pauseTimer() {
  isRunning = false;
  document.getElementById('startBtn').textContent = 'Start';
}

function resetTimer() {
  pauseTimer();
  document.getElementById('time').textContent = '00:06'; // Reset time to 6 seconds for testing purposes
  document.getElementById('resetBtn').disabled = true;
  drawProgress(0);
}
