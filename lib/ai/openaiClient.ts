// import OpenAI from 'openai';
// import { trackOpenAI } from 'opik-openai';
// import { Opik } from 'opik';


// const opikClient = new Opik({
//   apiKey: process.env.NEXT_PUBLIC_OPIK_API_KEY,
//   workspaceName: process.env.NEXT_PUBLIC_OPIK_WORKSPACE,
//   projectName: 'pace-reading-app',
// });

// const openai = new OpenAI({
//   apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
// });


// const trackedOpenAI = trackOpenAI(openai, {
//   client: opikClient,
//   traceMetadata: {
//     tags: ['pace-reading-app', 'reading-analysis'],
//   },
// });

// export default trackedOpenAI;