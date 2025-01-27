import { Request } from 'express';
import { RequestPromise } from './request-wrapper';
import { CONST } from '../../constants';
import HTTP_RETRIES = CONST.HTTP_RETRIES;
import RETRY_INTERVAL = CONST.RETRY_INTERVAL;

interface OnlineHearingDecision {
  start_date: string;
  end_date: string;
  decision_state: string;
  decision_state_datetime: string;
  appellant_reply?: string;
  appellant_reply_datetime?: string;
}

interface FinalDecision {
  reason: string;
}

export interface OnlineHearing {
  appellant_name: string;
  case_reference: string;
  online_hearing_id: string;
  decision?: OnlineHearingDecision;
  has_final_decision: boolean;
  final_decision?: FinalDecision;
}

interface ExtendDeadlineResponse {
  deadline_expiry_date: string;
}

export class HearingService {
  private apiUrl: string;

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl;
  }

  async getOnlineHearing(email: string, req: Request) {
    return RequestPromise.request({
      method: 'GET',
      uri: `${this.apiUrl}/api/continuous-online-hearings`,
      qs: { email },
      resolveWithFullResponse: true,
      simple: false
    }, req);
  }

  async getOnlineHearingsForCitizen(email: string, tya: string, req: Request) {
    const path = tya ? `/${tya}` : '';
    return RequestPromise.request({
      method: 'GET',
      retry: HTTP_RETRIES,
      delay: RETRY_INTERVAL,
      uri: `${this.apiUrl}/api/citizen${path}`,
      qs: { email },
      resolveWithFullResponse: true,
      simple: false
    }, req);
  }

  async getActiveOrDormantCasesForCitizen(email: string, caseType: string, req: Request) {
    return RequestPromise.request({
      method: 'GET',
      uri: `${this.apiUrl}/api/citizen/cases/${caseType}`,
      qs: { email },
      resolveWithFullResponse: true,
      simple: false
    }, req);
  }

  async getDormantCasesForCitizen(email: string, req: Request) {
    const path = 'active';
    return RequestPromise.request({
      method: 'GET',
      uri: `${this.apiUrl}/api/citizen${path}`,
      qs: { email },
      resolveWithFullResponse: true,
      simple: false
    }, req);
  }

  async assignOnlineHearingsToCitizen(email: string, tya: string, postcode: string, req: Request) {
    return RequestPromise.request({
      method: 'POST',
      uri: `${this.apiUrl}/api/citizen/${tya}`,
      body: { email, postcode },
      resolveWithFullResponse: true,
      simple: false
    }, req);
  }

}
