import i18next from 'i18next';

const recognition = () => {
  const box = document.querySelector('.box');
  const recognition = document.querySelector('.recognition');
  const fingerprintLines = document.querySelectorAll('.recognition_fingerprint_line');
  const personFirstName = document.querySelector('.recognition_person_firstname');
  const personLastName = document.querySelector('.recognition_person_lastname');

  const showLoadingMsg = () => box.classList.add('box--loading');
  const hideLoadingMsg = () => box.classList.remove('box--loading');

  const goToReception = () => {
    box.classList.remove('box--recognition');
    fingerprintLines.forEach((line) => {
      line.classList.remove('active');
    });
  };
  const goToRecognition = (time) => {
    box.classList.add('box--recognition');
    setTimeout(goToReception, time);
  };

  const unknown = () => {
    recognition.classList.add('recognition--unknown');
    personFirstName.textContent = i18next.t('unknownFingerprint.unknown');
    personLastName.textContent = i18next.t('unknownFingerprint.fingerprint');
    goToRecognition(2000);
  };
  const fingerprintAnimation = () => {
    fingerprintLines.forEach((line) => {
      line.classList.add('active');
    });
  };
  const match = (user) => {
    recognition.classList.remove('recognition--unknown');
    personFirstName.textContent = user.firstName;
    personLastName.textContent = user.lastName;
    goToRecognition(3000);
    fingerprintAnimation();
  };

  ipcRenderer.on('ready', hideLoadingMsg);
  ipcRenderer.on('error', showLoadingMsg);
  ipcRenderer.on('unknown', unknown);
  ipcRenderer.on('match', (ev, msg) => match(msg));

  ipcRenderer.send('guiReady');
};

document.addEventListener("DOMContentLoaded", recognition);
