module.exports = {
  path: '/continuous-online-hearings/:onlineHearingId/questions/:questionId',
  template: {
    question_id: params => `${params.questionId}`,
    question_header_text: 'How do you interact with people?',
    question_body_text: `You said you avoid interacting with people if possible. We’d like to know 
      more about the times when you see friends and family. Tell us about three separate occasions 
      in 2017 that you have met with friends and family.`
  }
};