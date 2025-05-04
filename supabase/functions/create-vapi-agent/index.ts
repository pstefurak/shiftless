// Simulated Vapi Agent creation edge function

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

interface CreateVapiParams {
  restaurantName: string;
  language: string;
  openHours?: string;
  closeHours?: string;
  phoneNumber?: string;
  userId: string;
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
      status: 204
    });
  }
  
  try {
    // Parse request body as JSON
    const params: CreateVapiParams = await req.json();
    
    // Validate required parameters
    if (!params.restaurantName || !params.userId) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required parameters' }),
        {
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
          status: 400
        }
      );
    }
    
    // In a real implementation, this would call the Vapi API
    console.log('Creating Vapi agent with params:', params);
    
    // Simulate API call with a fake successful response
    const generatedAgentId = 'vapi_' + Math.random().toString(36).substring(2, 11);
    const generatedPhoneNumber = params.phoneNumber || 
      '+1' + Math.floor(5000000000 + Math.random() * 4999999999).toString();
    
    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        agentId: generatedAgentId,
        phoneNumber: generatedPhoneNumber
      }),
      {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        status: 200
      }
    );
    
  } catch (error) {
    console.error('Error creating Vapi agent:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        status: 500
      }
    );
  }
});