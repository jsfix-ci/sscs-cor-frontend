import * as govUK from 'govuk-frontend';
import * as expandingTextBox from './expanding-textbox';
import { EvidenceUpload } from './evidence-upload';
import { EvidenceUploadAudioVideo } from './evidence-upload-audio-video';
import { CheckCookies } from './check-cookies';
import { SessionInactivity } from './session-inactivity';
import { DetailsTabIndexToggle } from './detailsToggle';
import { RequestType } from './request-type';
import { EvidenceStatement } from './evidence-statement';

const domready = require('domready');

function goBack() {
  window.history.go(-1);
  return false;
}

function initCookieBanner() {
  if (document.querySelector('#app-cookie-banner')) {
    const checkCookies = new CheckCookies();
    checkCookies.init();
  }
}

const onReady = () => {
  const evidence = new EvidenceUpload();
  const evidenceAudioVideo = new EvidenceUploadAudioVideo();
  const sessionInactivity = new SessionInactivity();
  const detailsToggle = new DetailsTabIndexToggle();
  const requestType = new RequestType();
  const evidenceStatement = new EvidenceStatement();

  initCookieBanner();
  govUK.initAll();
  expandingTextBox.init();
  sessionInactivity.init();
  detailsToggle.init();
  evidenceStatement.init();

  document.querySelectorAll('#buttonBack').forEach(element => element.addEventListener('click', goBack));
};

domready(onReady);

export {
  onReady
};
