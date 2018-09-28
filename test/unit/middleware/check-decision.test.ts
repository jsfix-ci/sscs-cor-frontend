import { NextFunction, Request, Response } from 'express'
const { expect, sinon } = require('test/chai-sinon');
import { checkDecision } from 'app/server/middleware/check-decision.ts';
import * as Paths from 'app/server/paths';

describe('middleware/check-decision', () => {
  let req: Request;
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      session: {
        id: '123',
        hearing: {
          online_hearing_id: '1',
          case_reference: 'SC/123/456',
          appellant_name: 'John Smith',
          decision: {
            decision_award: 'appeal-upheld',
            decision_header: 'appeal-upheld',
            decision_reason: 'The decision',
            decision_text: 'The decision',
            decision_state: 'decision_issued'
          }
        }
      }
    } as any;
    res = {
      redirect: sinon.spy()
    } as any;
    next = sinon.spy();
  });

  it('calls next when decision that is not issued exists in the session', () => {
    req.session.hearing.decision.decision_state = 'decision_drafted';
    checkDecision(req, res, next);
    expect(next).to.have.been.calledOnce.calledWith();
  });

  it('calls next when no decision exists in the session', () => {
    delete req.session.hearing.decision;
    checkDecision(req, res, next);
    expect(next).to.have.been.calledOnce.calledWith();
  });

  it('redirects to decision page if decision is issued', () => {
    checkDecision(req, res, next);
    expect(res.redirect).to.have.been.calledOnce.calledWith(Paths.decision);
  });
});

export {};