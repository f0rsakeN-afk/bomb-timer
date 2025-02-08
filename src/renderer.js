let minutes = 10;
let seconds = 0;
let initialMinutes = 30;  // Store initial values
let initialSeconds = 0;
let refreshIntervalId = 0;
let isRunning = false;

function playAudio(filename) {
    try {
        const remote = require('@electron/remote');
        const path = require('path');
        const rootPath = remote.getGlobal('rootPath');

        const audioPath = path.join(rootPath, 'src', 'assets', filename);
        const audio = new Audio(audioPath);
        audio.volume = 0.5;

        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.error('Audio play error:', error);
            });
        }
    } catch (error) {
        console.error('Audio error:', error);
    }
}

function startTimer() {
    if (!isRunning) {
        isRunning = true;
        decrementTimer();
        refreshIntervalId = setInterval(decrementTimer, 1000);
        playAudio('armbomb.wav');
    }
}

function stopTimer() {
    if (isRunning) {
        isRunning = false;
        clearInterval(refreshIntervalId);
        updateDisplay();
    }
}

function resetTimer() {
    stopTimer();  // Stop the timer if it's running
    minutes = initialMinutes;
    seconds = initialSeconds;
    updateDisplay();
    console.log('Timer reset to:', initialMinutes, ':', initialSeconds); // Debug log
}

function updateDisplay() {
    let displayMinutes = minutes < 10 ? "0" + minutes : minutes;
    let displaySeconds = seconds < 10 ? "0" + seconds : seconds;
    let displayText = `${displayMinutes}:${displaySeconds}`;
    document.getElementById("timer").innerHTML = displayText;
    document.getElementById("timerBG").innerHTML = displayText;
}

function decrementTimer() {
    if (minutes === 0 && seconds === 0) {
        playAudio('explode.wav');
        clearInterval(refreshIntervalId);
        isRunning = false;
        updateDisplay();
        return;
    }

    if (minutes === 0 && seconds <= 10 && seconds > 0) {
        playAudio('beep.wav');
    }
    if (minutes === 0 && seconds === 1) {
        playAudio('doublebeep.wav');
    }

    updateDisplay();

    if (seconds === 0) {
        if (minutes > 0) {
            minutes--;
            seconds = 59;
        }
    } else {
        seconds--;
    }
}

function setTime(timeStr) {
    const parts = timeStr.split(':');
    if (parts.length === 2) {
        const mins = parseInt(parts[0]);
        const secs = parseInt(parts[1]);
        if (!isNaN(mins) && !isNaN(secs) && mins >= 0 && secs >= 0 && secs < 60) {
            minutes = mins;
            seconds = secs;
            // Update initial values when new time is set
            initialMinutes = mins;
            initialSeconds = secs;
            updateDisplay();
        }
    }
}

window.onload = () => {
    updateDisplay();

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            e.preventDefault();
            if (isRunning) {
                stopTimer();
            } else {
                startTimer();
            }
        }
        else if (e.key === 'Tab') {
            e.preventDefault();
            resetTimer();
        }
        else if (e.key === 'Escape') {
            window.close();
        }
        else if (e.key === 'Enter') {
            if (!isRunning) {
                const timeStr = document.getElementById('timer').innerHTML;
                setTime(timeStr);
            }
        }
        else if (!isRunning && e.key.match(/[0-9:]/)) {
            let currentTime = document.getElementById('timer').innerHTML;
            if (e.key === ':' && currentTime.includes(':')) {
                return;
            }
            if (currentTime === '00:00') {
                currentTime = '';
            }
            currentTime += e.key;
            if (currentTime.length === 2) {
                currentTime += ':';
            }
            if (currentTime.length <= 5) {
                document.getElementById('timer').innerHTML = currentTime;
                document.getElementById('timerBG').innerHTML = currentTime;
            }
        }
        else if (e.key === 'Backspace' && !isRunning) {
            let currentTime = document.getElementById('timer').innerHTML;
            if (currentTime.length > 0) {
                currentTime = currentTime.slice(0, -1);
                if (currentTime.length === 0) {
                    currentTime = '00:00';
                }
                document.getElementById('timer').innerHTML = currentTime;
                document.getElementById('timerBG').innerHTML = currentTime;
            }
        }
    });
};