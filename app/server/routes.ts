const express = require('express');
import { Paths } from 'app/server/paths';
const { ensureAuthenticated } = require('app/server/middleware/ensure-authenticated');

import { setupQuestionController } from './controllers/question';
import { setupSubmitQuestionController } from './controllers/submit-question';
import { setupQuestionsCompletedController } from './controllers/questions-completed';
import { setupTaskListController } from './controllers/task-list';
import { setupLoginController, getLogin } from './controllers/login';

// eslint-disable-next-line new-cap
const router = express.Router();

const getQuestionService = require('app/server/services/getQuestion');
const getAllQuestionsService = require('app/server/services/getAllQuestions');
const getOnlineHearingService = require('app/server/services/getOnlineHearing');
const { saveAnswer: saveAnswerService, submitAnswer: submitAnswerService } = require('app/server/services/updateAnswer');

const questionController = setupQuestionController({
  getQuestionService,
  saveAnswerService,
  ensureAuthenticated
});
const submitQuestionController = setupSubmitQuestionController({ submitAnswerService, getAllQuestionsService, ensureAuthenticated });
const questionsCompletedController = setupQuestionsCompletedController({ ensureAuthenticated });
const taskListController = setupTaskListController({ getAllQuestionsService, ensureAuthenticated });
const loginController = setupLoginController({ getOnlineHearingService });

router.use(loginController);
router.use(submitQuestionController);
router.use(questionsCompletedController);
router.use(Paths.question, questionController);
router.use(taskListController);
router.get('/', getLogin);

export { router };