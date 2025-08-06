import React from 'react';
import './App.css';

import * as Sentry from "@sentry/react";

// Debug function to check profiling support
function checkProfilingSupport() {
  console.log('🔍 Checking profiling support...');
  
  // Check if the browser supports the profiling API
  if ('Profiler' in window) {
    console.log('✅ Browser supports Profiler API');
  } else {
    console.log('❌ Browser does not support Profiler API');
  }
  
  // Check if Sentry is initialized
  console.log('✅ Sentry client is initialized');
  console.log('Sentry DSN:', "https://7ba3dd399bcd09c145c91ac1ce022568@o4509714332450816.ingest.us.sentry.io/4509725614735360");
  console.log('Profiles sample rate: 1.0');
}

Sentry.init({
  dsn: "https://7ba3dd399bcd09c145c91ac1ce022568@o4509714332450816.ingest.us.sentry.io/4509725614735360",
  
  release: `test-app@1.0.0`,
  
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
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
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
  React.useEffect(() => {
    // Check profiling support when component mounts
    checkProfilingSupport();
    
    console.log('✅ App mounted, profiling should be active');
  }, []);

  const performHeavyOperation = () => {
    console.log('🚀 Starting heavy operation for profiling...');
    
    // Simulate heavy computation to generate profiling data
    const start = performance.now();
    
    // Create some CPU-intensive work (reduced iterations to avoid rate limits)
    let result = 0;
    for (let i = 0; i < 100000; i++) {
      result += Math.sqrt(i) * Math.sin(i);
    }
    
    const end = performance.now();
    console.log(`⏱️ Heavy operation completed in ${(end - start).toFixed(2)}ms`);
    console.log(`📊 Result: ${result.toFixed(2)}`);
    
    return result;
  };

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <div style={{ marginTop: '20px' }}>
          <button 
            onClick={performHeavyOperation}
            style={{ marginRight: '10px', padding: '10px 20px' }}
          >
            Test Profiling
          </button>
          <button 
            onClick={() => {
              console.log('🚀 Triggering error and profiling...');
              throw new Error("What's happening!");
            }}
            style={{ padding: '10px 20px' }}
          >
            Trigger Error
          </button>
        </div>
      </header>
    </div>
  );
}

export default App;
