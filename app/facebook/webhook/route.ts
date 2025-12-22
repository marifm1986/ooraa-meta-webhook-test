import { NextRequest, NextResponse } from 'next/server';

// Environment variables
const VERIFY_TOKEN = process.env.FACEBOOK_VERIFY_TOKEN || 'myMetawebhookOoraa2025';
const PAGE_ACCESS_TOKEN = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
const FORTHCRM_POST_URL = process.env.FORTHCRM_POST_URL || 'https://login.forthcrm.com/post/8cff5e1b3e11b891fe021f9e4c64ff2d169ece58/';

// Validate required environment variables
if (!PAGE_ACCESS_TOKEN) {
  console.error('⚠️ WARNING: FACEBOOK_PAGE_ACCESS_TOKEN is not set. Lead fetching will fail.');
}

/**
 * GET handler - Facebook webhook verification
 * Facebook sends a GET request with hub.mode, hub.verify_token, and hub.challenge
 * We must respond with the hub.challenge value if the verify_token matches
 */
export async function GET(request: NextRequest) {
  try {
   const searchParams = request.nextUrl.searchParams;
    const mode = searchParams.get('hub.mode') || 'subscribe';
    const token = searchParams.get('hub.verify_token') || 'ymyMetawebhookOoraa2025';
    const challenge = searchParams.get('hub.challenge');


    console.log('Facebook verification request received:', { mode, token, challenge });

    // Check if mode and token are present
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      // Respond with the challenge token from the request
      console.log('Webhook verified successfully');
      return new NextResponse(challenge ?? '', { status: 200 });
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      console.error('Webhook verification failed - token mismatch', {
        receivedToken: token,
        expectedToken: VERIFY_TOKEN
      });
      return NextResponse.json(
        { error: 'Verification failed' },
        { status: 403 }
      );
    }
  } catch (error) {
    console.error('Error in GET webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST handler - Receives webhook events from Facebook
 * When a lead is generated, Facebook sends a POST request with leadgen_id
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  try {
    const body = await request.json();
    console.log('[WEBHOOK] POST received:', {
      object: body.object,
      entryCount: body.entry?.length || 0,
      timestamp: new Date().toISOString(),
    });

    // Facebook sends data in a specific structure
    // body.entry[].changes[].value contains the lead data
    if (body.object === 'page') {
      let leadCount = 0;
      for (const entry of body.entry || []) {
        for (const change of entry.changes || []) {
          if (change.field === 'leadgen') {
            const leadgenId = change.value?.leadgen_id;
            const formId = change.value?.form_id;
            const pageId = change.value?.page_id;

            console.log('[WEBHOOK] Lead generation event detected:', {
              leadgenId,
              formId,
              pageId,
              timestamp: new Date().toISOString(),
            });

            if (leadgenId) {
              leadCount++;
              // Process the lead asynchronously
              processLead(leadgenId, formId, pageId).catch((error) => {
                console.error('[ERROR] Failed to process lead:', {
                  leadgenId,
                  error: error instanceof Error ? error.message : String(error),
                  timestamp: new Date().toISOString(),
                });
              });
            }
          }
        }
      }

      const processingTime = Date.now() - startTime;
      console.log('[WEBHOOK] Processed:', {
        leadCount,
        processingTimeMs: processingTime,
        status: 'success',
      });

      // Facebook expects a 200 OK response quickly
      return NextResponse.json({ success: true, leadsReceived: leadCount }, { status: 200 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    const processingTime = Date.now() - startTime;
    console.error('[ERROR] POST webhook error:', {
      error: error instanceof Error ? error.message : String(error),
      processingTimeMs: processingTime,
      timestamp: new Date().toISOString(),
    });
    // Still return 200 to Facebook to avoid retries
    return NextResponse.json({ success: true }, { status: 200 });
  }
}

/**
 * Process the lead by fetching data from Facebook Graph API
 * and sending it to ForthCRM
 */
async function processLead(leadgenId: string, formId?: string, pageId?: string) {
  const startTime = Date.now();
  try {
    console.log('[LEAD] Processing started:', {
      leadgenId,
      formId,
      pageId,
      timestamp: new Date().toISOString(),
    });

    // Step 1: Fetch lead data from Facebook Graph API
    const leadData = await fetchLeadDataFromFacebook(leadgenId);

    if (!leadData) {
      console.error('[LEAD] Failed to fetch lead data from Facebook:', { leadgenId });
      return;
    }

    console.log('[LEAD] Data fetched from Facebook:', {
      leadgenId,
      fieldCount: leadData.field_data?.length || 0,
      createdTime: leadData.created_time,
    });

    // Step 2: Transform the data to ForthCRM format
    const forthcrmData = transformLeadDataForForthCRM(leadData, formId, pageId);

    console.log('[LEAD] Data transformed for ForthCRM:', {
      leadgenId,
      hasEmail: !!forthcrmData.email,
      hasPhone: !!forthcrmData.phone,
      hasName: !!(forthcrmData.first_name || forthcrmData.last_name),
    });

    // Step 3: Send data to ForthCRM
    const result = await sendToForthCRM(forthcrmData);

    const processingTime = Date.now() - startTime;
    console.log('[LEAD] Successfully sent to ForthCRM:', {
      leadgenId,
      processingTimeMs: processingTime,
      timestamp: new Date().toISOString(),
    });

    return result;
  } catch (error) {
    const processingTime = Date.now() - startTime;
    console.error('[LEAD] Processing failed:', {
      leadgenId,
      error: error instanceof Error ? error.message : String(error),
      processingTimeMs: processingTime,
      timestamp: new Date().toISOString(),
    });
    throw error;
  }
}

/**
 * Fetch lead data from Facebook Graph API
 */
async function fetchLeadDataFromFacebook(leadgenId: string) {
  try {
    if (!PAGE_ACCESS_TOKEN) {
      throw new Error('FACEBOOK_PAGE_ACCESS_TOKEN is not configured. Cannot fetch lead data.');
    }

    const url = `https://graph.facebook.com/v20.0/${leadgenId}?access_token=${PAGE_ACCESS_TOKEN}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Facebook API error:', errorText);
      throw new Error(`Facebook API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching lead data from Facebook:', error);
    throw error;
  }
}

/**
 * Transform Facebook lead data to ForthCRM format
 * Maps the field_data array to the expected format
 */
function transformLeadDataForForthCRM(leadData: any, formId?: string, pageId?: string) {
  const fieldData: Record<string, string> = {};

  // Facebook returns field_data as an array of {name, values} objects
  if (leadData.field_data) {
    for (const field of leadData.field_data) {
      // Take the first value if multiple values exist
      fieldData[field.name.toLowerCase()] = field.values?.[0] || '';
    }
  }

  // Extract and map common fields
  // Adjust these field names based on your Facebook Lead Form configuration
  const firstName = fieldData['first_name'] || fieldData['full_name']?.split(' ')[0] || '';
  const lastName = fieldData['last_name'] || fieldData['full_name']?.split(' ').slice(1).join(' ') || '';
  const email = fieldData['email'] || '';
  const phone = fieldData['phone_number'] || fieldData['phone'] || '';
  const debtAmount = fieldData['debt_amount'] || fieldData['how_much_debt'] || '';
  const state = fieldData['state'] || fieldData['location'] || '';

  return {
    first_name: firstName,
    last_name: lastName,
    email: email,
    phone: phone,
    debt_amount: debtAmount,
    state: state,
    form_id: formId,
    page_id: pageId,
    leadgen_id: leadData.id,
    created_time: leadData.created_time,
    // Include all other fields as metadata
    metadata: fieldData,
  };
}

/**
 * Send transformed data to ForthCRM
 */
async function sendToForthCRM(data: any) {
  try {
    const response = await fetch(FORTHCRM_POST_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ForthCRM API error:', errorText);
      throw new Error(`ForthCRM API error: ${response.status}`);
    }

    const result = await response.text();
    return result;
  } catch (error) {
    console.error('Error sending data to ForthCRM:', error);
    throw error;
  }
}
