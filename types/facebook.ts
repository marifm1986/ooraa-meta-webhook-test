/**
 * Facebook Webhook Types
 * These types define the structure of data received from Facebook webhooks
 * and used throughout the lead processing flow
 */

// Facebook Webhook Entry
export interface FacebookWebhookEntry {
  id: string;
  time: number;
  changes: FacebookWebhookChange[];
}

// Facebook Webhook Change
export interface FacebookWebhookChange {
  field: string;
  value: FacebookLeadgenValue;
}

// Facebook Leadgen Value
export interface FacebookLeadgenValue {
  leadgen_id: string;
  form_id: string;
  page_id: string;
  ad_id?: string;
  adgroup_id?: string;
  created_time?: number;
}

// Facebook Webhook Payload
export interface FacebookWebhookPayload {
  object: string;
  entry: FacebookWebhookEntry[];
}

// Facebook Lead Field Data
export interface FacebookFieldData {
  name: string;
  values: string[];
}

// Facebook Lead Data Response from Graph API
export interface FacebookLeadData {
  id: string;
  created_time: string;
  ad_id?: string;
  form_id?: string;
  field_data: FacebookFieldData[];
}

// Transformed Lead Data for ForthCRM
export interface ForthCRMLeadData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  debt_amount: string;
  state: string;
  form_id?: string;
  page_id?: string;
  leadgen_id: string;
  created_time: string;
  metadata: Record<string, string>;
}

// Facebook Verification Query Parameters
export interface FacebookVerificationParams {
  'hub.mode': string;
  'hub.verify_token': string;
  'hub.challenge': string;
}
