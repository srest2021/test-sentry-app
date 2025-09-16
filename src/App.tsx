import './App.css';

import * as Sentry from "@sentry/react";
import * as SentryBrowser from "@sentry/browser";

Sentry.init({
  dsn: "http://e71dbe7c02a12374ed65462a439a2283@localhost:8000/2",
  
  release: `test-app@1.0`,
  
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
  const performHeavyOperation = () => {
    console.log('🚀 Starting heavy operation for profiling...');
    
    // Create a Sentry span to ensure profiling data is captured
    SentryBrowser.startSpan({
      name: "Heavy Operation Test",
      op: "test.profiling",
    }, (span) => {
      console.log('✅ Span created:', span ? 'Success' : 'Failed');
      
      // Simulate heavy computation to generate profiling data
      const start = performance.now();
      
      // Create some CPU-intensive work (reduced iterations to avoid rate limits)
      let result = 0;
      for (let i = 0; i < 100000; i++) {
        result += Math.sqrt(i) * Math.sin(i);
      }
      
      const end = performance.now();
      console.log(`⏱️ Heavy operation completed in ${(end - start).toFixed(2)}ms`);
    });
  };

  // Function to manually trigger session replay capture
  const triggerSessionReplay = () => {
    console.log('🎬 Triggering session replay capture...');
    
    // Add a custom breadcrumb to mark this as a manual trigger
    SentryBrowser.addBreadcrumb({
      category: 'session-replay',
      message: 'Manual session replay trigger',
      level: 'info',
      data: {
        trigger_type: 'manual',
        timestamp: new Date().toISOString(),
      },
    });

    // Create a custom event that will be captured with session replay
    SentryBrowser.captureMessage('Manual session replay trigger', 'info');
    
    console.log('✅ Session replay trigger sent to Sentry');
  };

  // Function to simulate user interactions that will be captured
  const simulateUserInteractions = () => {
    console.log('👆 Simulating user interactions for session replay...');
    
    // Simulate various user interactions that will be captured
    const testElement = document.createElement('div');
    testElement.id = 'test-interaction-element';
    testElement.textContent = 'Test interaction element';
    testElement.style.position = 'absolute';
    testElement.style.top = '10px';
    testElement.style.left = '10px';
    testElement.style.padding = '10px';
    testElement.style.background = '#f0f0f0';
    testElement.style.cursor = 'pointer';
    
    document.body.appendChild(testElement);
    
    // Simulate clicks, typing, and other interactions
    setTimeout(() => {
      testElement.click();
      console.log('✅ Clicked test element');
    }, 100);
    
    setTimeout(() => {
      testElement.style.background = '#e0e0e0';
      console.log('✅ Changed element style');
    }, 200);
    
    setTimeout(() => {
      testElement.remove();
      console.log('✅ Removed test element');
    }, 3000);
  };

  // Function to create a guaranteed error that will trigger session replay
  const triggerErrorWithReplay = () => {
    console.log('🚨 Triggering error with guaranteed session replay...');
    
    // Add breadcrumb before error
    SentryBrowser.addBreadcrumb({
      category: 'error',
      message: 'About to trigger error for session replay',
      level: 'warning',
    });
    
    // This error will definitely trigger session replay due to replaysOnErrorSampleRate: 1.0
    throw new Error("Manual error trigger for session replay capture");
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
              throw new Error("Can you please work omg");
            }}
            style={{ padding: '10px 20px' }}
          >
            Throw Error
          </button>
        </div>
        
        {/* New Session Replay Controls */}
        <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '15px', borderRadius: '5px' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#61dafb' }}>Session Replay Controls</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            <button 
              onClick={triggerSessionReplay}
              style={{ padding: '8px 16px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px' }}
            >
              🎬 Trigger Session Replay
            </button>
            <button 
              onClick={simulateUserInteractions}
              style={{ padding: '8px 16px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '4px' }}
            >
              👆 Simulate Interactions
            </button>
            <button 
              onClick={triggerErrorWithReplay}
              style={{ padding: '8px 16px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px' }}
            >
              🚨 Error + Replay
            </button>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
