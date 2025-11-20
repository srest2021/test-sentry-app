import './App.css';

import * as Sentry from "@sentry/react";

const SENTRY_DSN = ""
const SENTRY_RELEASE = "test-app@1.0";
const SENTRY_ENVIRONMENT = "development";

Sentry.init({
  dsn: SENTRY_DSN,
  release: SENTRY_RELEASE,
  //environment: SENTRY_ENVIRONMENT,
  
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
  integrations: [
    Sentry.replayIntegration(),
    Sentry.browserTracingIntegration(),
    Sentry.browserProfilingIntegration(),
    Sentry.feedbackIntegration({
      // The SDK will automatically create a button and inject it into the DOM
      // You can also customize the button appearance
      colorScheme: "system",
      showBranding: true,
      // You can customize the form fields
      formTitle: "Send us feedback",
      formButtonLabel: "Send feedback",
      // You can add custom fields
      additionalFields: [
        {
          type: "text",
          name: "user_type",
          label: "User Type",
          required: false,
        },
      ],
    }),
  ],
  // Session Replay
  replaysSessionSampleRate: 1.0, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
  // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: ["localhost" ],

  // profiling - reduced sample rate to avoid rate limits
  profilesSampleRate: 0.1, // 10% sampling to avoid 429 errors
});

function App() {

  return (
    <div className="App">
      <header className="App-header">
        <div style={{ 
          backgroundColor: '#282c34', 
          border: '2px solid #61dafb', 
          borderRadius: '8px', 
          padding: '15px', 
          marginBottom: '20px',
          fontSize: '14px',
          textAlign: 'left',
          maxWidth: '600px'
        }}>
          <h3 style={{ marginTop: 0, color: '#61dafb' }}>Sentry Configuration</h3>
          <div>
            <strong>DSN:</strong> <code style={{ backgroundColor: '#1e1e1e', padding: '2px 6px', borderRadius: '4px' }}>{SENTRY_DSN}</code>
          </div>
          <div>
            <strong>Release:</strong> <code style={{ backgroundColor: '#1e1e1e', padding: '2px 6px', borderRadius: '4px' }}>{SENTRY_RELEASE}</code>
          </div>
          <div>
            <strong>Environment:</strong> <code style={{ backgroundColor: '#1e1e1e', padding: '2px 6px', borderRadius: '4px' }}>{SENTRY_ENVIRONMENT}</code>
          </div>
        </div>

        <div style={{ marginTop: '10px' }}>
          <button 
            onClick={() => {
              throw new Error("This is a new test error");
            }}
            style={{ padding: '10px 20px' }}
          >
            Throw Error
          </button>
        </div>
        <div style={{ marginTop: '30px' }}>
          <button 
            onClick={() => {
              throw new TypeError("Invalid type: expected number but got string");
            }}
            style={{ padding: '10px 20px' }}
          >
            Throw TypeError
          </button>
        </div>
        <div style={{ marginTop: '30px' }}>
          <button 
            onClick={() => {
              throw new SyntaxError();
            }}
            style={{ padding: '10px 20px' }}
          >
            Throw SyntaxError
          </button>
        </div>
        <div style={{ marginTop: '30px' }}>
          <button 
            onClick={() => {
              throw new ReferenceError();
            }}
            style={{ padding: '10px 20px' }}
          >
            Throw ReferenceError
          </button>
        </div>
        <div style={{ marginTop: '30px' }}>
          <button 
            onClick={() => {
              throw new RangeError("Index out of bounds: value exceeds maximum array size");
            }}
            style={{ padding: '10px 20px' }}
          >
            Throw RangeError
          </button>
        </div>
        <div style={{ marginTop: '30px' }}>
          <button 
            onClick={() => {
              throw new EvalError();
            }}
            style={{ padding: '10px 20px' }}
          >
            Throw EvalError
          </button>
        </div>
        <div style={{ marginTop: '30px' }}>
          <button 
            onClick={() => {
              throw new URIError();
            }}
            style={{ padding: '10px 20px' }}
          >
            Throw URIError
          </button>
        </div>
      </header>
    </div>
  );
}

export default App;
