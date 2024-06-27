const {
  VertexAI,
  FunctionDeclarationSchemaType,
} = require('@google-cloud/vertexai');

const functionDeclarations = [
  {
    function_declarations: [
      {
        name: 'get_current_weather',
        description: 'get weather in a given location',
        parameters: {
          type: FunctionDeclarationSchemaType.OBJECT,
          properties: {
            location: {type: FunctionDeclarationSchemaType.STRING},
            unit: {
              type: FunctionDeclarationSchemaType.STRING,
              enum: ['celsius', 'fahrenheit'],
            },
          },
          required: ['location'],
        },
      },
    ],
  },
];


const functionResponseParts = [
  {
    functionResponse: {
      name: 'get_current_weather',
      response: {name: 'get_current_weather', content: {weather: 'super nice'}},
    },
  },
];

/**
 * TODO(developer): Update these variables before running the sample.
 */
async function functionCallingStreamContent(
  projectId = 'PROJECT_ID',
  location = 'us-central1',
  model = 'gemini-1.5-flash-001'
) {
  // Initialize Vertex with your Cloud project and location
  const vertexAI = new VertexAI({project: projectId, location: location});

  // Instantiate the model
  const generativeModel = vertexAI.getGenerativeModel({
    model: model,
  });

  const request = {
    contents: [
      {role: 'user', parts: [{text: 'What is the weather in Boston?'}]},
      {
        role: 'model',
        parts: [
          {
            functionCall: {
              name: 'get_current_weather',
              args: {location: 'Boston'},
            },
          },
        ],
      },
      {role: 'user', parts: functionResponseParts},
    ],
    tools: functionDeclarations,
  };
  const streamingResp = await generativeModel.generateContentStream(request);
  var text="";
  for await (const item of streamingResp.stream) {
    text += JSON.stringify(item.candidates[0].content.parts[0].text);
  }
  return text;
}




const axios = require('axios'); // Make sure to install axios if you haven't already

async function callGemini(promptContent, systemContent, previousChat) {
  try {
    const messages = [];

    const userPrompt = {
      role: "user",
      content: promptContent,
    };
    const systemPrompt = {
      role: "system",
      content: systemContent,
    };
    const assistantPrompt = {
      role: "assistant",
      content: previousChat,
    };

    messages.push(userPrompt);
    messages.push(systemPrompt);
    messages.push(assistantPrompt);

    // Adjust the URL and method according to Gemini's API documentation
    const response = await axios.post('https://api.gemin.ai/v1/chat/completions', {
      model: "your_gemini_model_here", // Specify the correct model identifier
      messages: messages,
    }, {
      headers: {
        'Authorization': 'Bearer YOUR_ACCESS_TOKEN_HERE', // Include authentication as needed
        'Content-Type': 'application/json',
      }
    });

    console.log(1);
    console.log(response.data.choices[0].message.content);
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Error:", error);
    return `An error occurred while processing the request: ${error}`;
  }
}



//generateContent();

module.exports = { callGemini };


