import i18next from 'i18next';
import en from './locales/en';
import pl from './locales/pl';

import './style.css';
import './modules/recognition';

import unknownFinger from './images/wrongfinger.png';

i18next.init({
  lng: APP_LANG,
  resources: {
    en: { translation: en },
    pl: { translation: pl }
  }
}).then(() => {
  document.querySelector('#app').innerHTML = `
  <div class="box box--loading">
    <div class="wrapper">
      <section class="reception">
        <div class="reception_loading">
          <div class="loading"></div>
          <span class="reception_loading_text">${i18next.t('connecting')}</span>
        </div>
      </section>
      <section class="recognition">
        <div class="recognition_fingerprint">
          <svg class="recognition_fingerprint_match" fingerprint width="170px" height="170px" viewBox="0 0 34 34" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
              <g transform="translate(1.000000, 1.000000)" stroke="#3871c2">
                <g transform="translate(7.000000, 6.000000)" stroke-linecap="round">
                  <path class="recognition_fingerprint_line recognition_fingerprint_line--a" d="M3.14414922,1.97419264 C3.14414922,1.97419264 5.30885997,0.506351808 9.06036082,0.506351808 C12.8118617,0.506351808 14.781903,1.97419264 14.781903,1.97419264" id="Path-6"></path>
                  <path class="recognition_fingerprint_line recognition_fingerprint_line--b" d="M0.466210729,7.27628774 C0.466210729,7.27628774 3.19024811,2.75878123 9.09512428,2.96502806 C15.0000005,3.17127489 17.4745821,7.17202872 17.4745821,7.17202872" id="Path-7"></path>
                  <path class="recognition_fingerprint_line recognition_fingerprint_line--c" d="M2,16.4687762 C2,16.4687762 1.12580828,14.9305411 1.27082278,11.9727304 C1.45871447,8.14036841 5.19587478,5.30175361 9.05270871,5.30175361 C12.9095426,5.30175361 15.0000001,7.82879552 15.8975926,9.33195218 C16.5919575,10.4947729 17.7597991,14.4361492 14.6226101,15.0206592 C12.41268,15.4324056 11.5911303,13.4911155 11.5911303,12.9859143 C11.5911303,11.9727302 11.1054172,10.2336826 9.05270848,10.2336826 C6.99999978,10.2336826 6.11384543,11.8665663 6.4593664,13.7955614 C6.6532895,14.8782069 7.59887942,18.3701197 12.0173963,19.5605638" id="Path-8"></path>
                  <path class="recognition_fingerprint_line recognition_fingerprint_line--d" d="M7.0204614,19.6657197 C7.0204614,19.6657197 3.88328263,16.5690127 3.88328268,12.9603117 C3.88328274,9.35161068 6.59923746,7.80642537 9.0076008,7.80642554 C11.4159641,7.8064257 14.1798468,9.55747124 14.1798468,12.759562" id="Path-9"></path>
                  <path class="recognition_fingerprint_line recognition_fingerprint_line--e" d="M8.95538742,12.6694189 C8.95538742,12.6694189 9.04883608,18.1288401 15.069217,17.3610597" id="Path-10"></path>
                </g>
              </g>
            </g>
          </svg>
          <img class="recognition_fingerprint_unknown">
        </div>
        <p class="recognition_person">
          <span class="recognition_person_firstname"></span>
          <span class="recognition_person_lastname"></span>
        </p>
      </section>
    </div>
  </div>
  `;

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.recognition_fingerprint_unknown').src = unknownFinger;
  });
});
