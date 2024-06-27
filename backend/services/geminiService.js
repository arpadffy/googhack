const {VertexAI} = require('@google-cloud/vertexai');

// Initialize Vertex with your Cloud project and location
const vertex_ai = new VertexAI({project: 'genai-cillers24sto-5123', location: 'us-central1'});
const model = 'gemini-1.5-flash-001';

// Instantiate the models
const generativeModel = vertex_ai.preview.getGenerativeModel({
  model: model,
  generationConfig: {
    'maxOutputTokens': 8192,
    'temperature': 1,
    'topP': 0.95,
  },
  safetySettings: [
    {
        'category': 'HARM_CATEGORY_HATE_SPEECH',
        'threshold': 'BLOCK_MEDIUM_AND_ABOVE'
    },
    {
        'category': 'HARM_CATEGORY_DANGEROUS_CONTENT',
        'threshold': 'BLOCK_MEDIUM_AND_ABOVE'
    },
    {
        'category': 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        'threshold': 'BLOCK_MEDIUM_AND_ABOVE'
    },
    {
        'category': 'HARM_CATEGORY_HARASSMENT',
        'threshold': 'BLOCK_MEDIUM_AND_ABOVE'
    }
  ],
});


async function callGemini(promptContent, systemContent, previousChat) {
  const req = {
    contents: [
      {role: 'user', parts: [{text: promptContent}]}
    ],
  };

  const streamingResp = await generativeModel.generateContentStream(req);

  //for await (const item of streamingResp.stream) {
  //  process.stdout.write('stream chunk: ' + JSON.stringify(item) + '\n');
  //}

  return JSON.stringify(await streamingResp.response);
}

module.exports = { callGemini };


