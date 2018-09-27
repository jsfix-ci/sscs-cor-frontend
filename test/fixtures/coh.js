/* eslint-disable no-console, no-magic-numbers */
const { CONST } = require('app/constants');
const rp = require('request-promise');
const moment = require('moment');
const mockData = require('test/mock/cor-backend/services/question').template;

const cohUrl = require('config').get('cohUrl');

const JURISDICTION = 'SSCS';
const PANEL_NAME = 'John Smith';
const PANEL_IDENTITY_TOKEN = 'string';
const HEARING_STATUS = 'continuous_online_hearing_started';

const QUESTION_OWNER_REF = 'SSCS-COR';
const QUESTION_ROUND = '1';

const headers = {
  Authorization: '123',
  ServiceAuthorization: '123',
  'Content-Type': 'application/json'
};

const onlineHearingBody = caseId => {
  return {
    case_id: caseId,
    jurisdiction: JURISDICTION,
    panel: [
      {
        identity_token: PANEL_IDENTITY_TOKEN,
        name: PANEL_NAME
      }
    ],
    start_date: moment().utc().format(),
    state: HEARING_STATUS
  };
};

const questionBody = (mockQuestionRef, ordinal) => {
  return {
    owner_reference: QUESTION_OWNER_REF,
    question_body_text: mockData.question_body_text({ questionId: mockQuestionRef }),
    question_header_text: mockData.question_header_text({ questionId: mockQuestionRef }),
    question_ordinal: ordinal,
    question_round: QUESTION_ROUND
  };
};

const decisionBody = {
  decision_award: 'appeal-upheld',
  decision_header: 'appeal-upheld',
  decision_reason: 'This is the decision.',
  decision_text: 'This is the decision.'
};

async function createOnlineHearing(caseId) {
  const options = {
    url: `${cohUrl}/continuous-online-hearings`,
    headers,
    body: onlineHearingBody(caseId),
    json: true
  };
  const body = await rp.post(options);
  console.log('Created online hearing with ID', body.online_hearing_id);
  return body.online_hearing_id;
}

async function createQuestion(hearingId, mockQuestionRef, ordinal) {
  const options = {
    url: `${cohUrl}/continuous-online-hearings/${hearingId}/questions`,
    headers,
    body: questionBody(mockQuestionRef, ordinal),
    json: true
  };
  const body = await rp.post(options);
  console.log('Created question with ID', body.question_id);
  return body;
}

async function createQuestions(hearingId) {
  const questionList = [];
  questionList.push(await createQuestion(hearingId, '001', 1));
  questionList.push(await createQuestion(hearingId, '002', 2));
  questionList.push(await createQuestion(hearingId, '003', 3));
  return questionList;
}

async function setQuestionRoundToIssued(hearingId) {
  const options = {
    url: `${cohUrl}/continuous-online-hearings/${hearingId}/questionrounds/1`,
    headers,
    body: { state_name: 'question_issue_pending' },
    json: true
  };
  await rp.put(options);
  console.log('Question round issued, status pending');
}

async function getQuestionRound(hearingId, roundNum) {
  const options = {
    url: `${cohUrl}/continuous-online-hearings/${hearingId}/questionrounds/${roundNum}`,
    headers,
    json: true
  };
  const body = await rp.get(options);
  return body;
}

async function createDecision(hearingId) {
  const options = {
    url: `${cohUrl}/continuous-online-hearings/${hearingId}/decisions`,
    headers,
    body: decisionBody,
    json: true
  };
  const body = await rp.post(options);
  console.log('Created decision with ID', body.decision_id);
  return body;
}

async function issueDecision(hearingId) {
  const body = { ...decisionBody, decision_state: CONST.DECISION_ISSUED_STATE };
  const options = {
    url: `${cohUrl}/continuous-online-hearings/${hearingId}/decisions`,
    headers,
    body,
    json: true
  };
  await rp.put(options);
  console.log('Decision issued, status pending');
}

module.exports = {
  createOnlineHearing,
  createQuestions,
  setQuestionRoundToIssued,
  getQuestionRound,
  createDecision,
  issueDecision
};
