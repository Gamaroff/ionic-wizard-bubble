# @gamaroff/ionic-wizard-bubbles

A beautiful and customizable Ionic Capacitor plugin for creating interactive guided tours, tutorials, and onboarding experiences in your app. The plugin displays wizard bubbles that automatically align themselves to target elements on the screen.

## Features

- 🎯 Smart positioning: Bubbles automatically position themselves around target elements
- 💫 Smooth animations and transitions
- 🎨 Customizable themes and colors
- 📱 Responsive design that works on all screen sizes
- ✨ Highlight effect with pulsing animation for target elements
- 🔄 Navigation controls (next/finish buttons)
- 🖼️ Optional icon support
- 📦 Easy to integrate with any Ionic/Capacitor project
- 🎨 Customizable border radius

## Installation

### Installing in Your Ionic Capacitor App

1. Install the plugin:
```bash
npm install @gamaroff/ionic-wizard-bubbles
```

2. Sync the plugin with your native projects:
```bash
npx cap sync
```

3. Import and use in your app:
```typescript
import { WizardBubble } from '@gamaroff/ionic-wizard-bubbles';
```

### Setting Up for Development

1. Clone the repository:
```bash
git clone https://github.com/Gamaroff/ionic-wizard-bubbles.git
cd ionic-wizard-bubbles
```

2. Install dependencies:
```bash
npm install
```

3. Run the demo server:
```bash
npm run demo
```

4. Build the plugin:
```bash
npm run build
```

### Publishing the Plugin

1. Update version in package.json:
```bash
npm version [patch|minor|major]
```

2. Build the plugin:
```bash
npm run build
```

3. Login to npm:
```bash
npm login
```

4. Publish:
```bash
npm publish --access public
```

## Usage in an Ionic App

### Basic Integration

1. Import the plugin in your component:
```typescript
import { Component } from '@angular/core';
import { WizardBubble } from '@gamaroff/ionic-wizard-bubbles';

@Component({
  selector: 'app-home',
  template: `
    <ion-content>
      <div id="feature1">Feature 1</div>
      <div id="feature2">Feature 2</div>
      <button (click)="startTutorial()">Start Tutorial</button>
    </ion-content>
  `
})
export class HomeComponent {
  async startTutorial() {
    const wizard = new WizardBubble();
    
    await wizard.show({
      steps: [
        {
          targetId: 'feature1',
          text: 'This is an amazing feature!',
          icon: '🚀'
        },
        {
          targetId: 'feature2',
          text: 'And here is another cool thing!'
        }
      ],
      buttonText: {
        next: 'Continue',
        finish: 'Got it!'
      },
      theme: {
        backgroundColor: '#ffffff',
        textColor: '#333333',
        buttonColor: '#007bff',
        buttonTextColor: '#ffffff',
        highlightColor: '#007bff',
        borderRadius: '12px' // Optional, defaults to '8px'
      }
    });
  }
}
```

### Advanced Usage

#### Custom Navigation

```typescript
const wizard = new WizardBubble();

// Start the wizard
await wizard.show({
  steps: [/* ... */]
});

// Handle navigation manually
wizard.next().then(({ isFinished }) => {
  if (isFinished) {
    console.log('Tour completed!');
  }
});

// Hide the wizard programmatically
await wizard.hide();
```

#### Custom Styling

```typescript
const wizard = new WizardBubble();

await wizard.show({
  steps: [/* ... */],
  theme: {
    backgroundColor: '#2c3e50',
    textColor: '#ecf0f1',
    buttonColor: '#3498db',
    buttonTextColor: '#ffffff',
    highlightColor: '#e74c3c',
    borderRadius: '16px' // Optional, defaults to '8px'
  }
});
```

## API Reference

### WizardBubble

#### show(options: WizardBubbleOptions): Promise<void>
Starts the wizard with the specified options.

```typescript
interface WizardBubbleOptions {
  steps: Array<{
    targetId: string;    // ID of the element to point to
    text: string;        // Text to display in the bubble
    icon?: string;       // Optional icon (emoji or URL)
  }>;
  buttonText?: {
    next?: string;       // Text for the next button (default: "Next")
    finish?: string;     // Text for the finish button (default: "Finish")
  };
  theme?: {
    backgroundColor?: string;    // Background color of the bubble
    textColor?: string;         // Text color
    buttonColor?: string;       // Button background color
    buttonTextColor?: string;   // Button text color
    highlightColor?: string;    // Color for the target element highlight
    borderRadius?: string;      // Border radius for bubble and highlight (default: '8px')
  };
}
```

#### next(): Promise<{ isFinished: boolean }>
Advances to the next step. Returns an object with `isFinished` indicating whether the wizard has completed.

#### hide(): Promise<void>
Manually hides the wizard bubble.

## Development

### Project Structure

```
ionic-wizard-bubbles/
├── android/              # Android platform code
├── ios/                 # iOS platform code
├── src/                # TypeScript source files
├── dist/               # Built files
├── example/            # Demo application
├── rollup.config.js    # Build configuration
└── package.json        # Project configuration
```

### Building

The plugin uses rollup for building:

```bash
npm run build          # Build the plugin
npm run clean         # Clean the dist directory
npm run watch         # Watch for changes and rebuild
```

### Testing

The project uses Jest for unit testing. The test suite includes:
- Unit tests for core functionality
- DOM manipulation tests
- Theme and styling tests
- Navigation and state management tests

#### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode during development
npm run test:watch

# Generate test coverage report
npm run test:coverage

# Run tests in CI environment
npm run test:ci
```

#### Test Coverage Requirements

The project maintains a minimum of 80% test coverage across:
- Branches
- Functions
- Lines
- Statements

#### Writing Tests

Tests are located in `src/__tests__` directory. Follow these guidelines when writing tests:

1. Test file naming: `*.test.ts`
2. Group related tests using `describe` blocks
3. Use clear test descriptions with `it`
4. Set up and tear down test environment using `beforeEach` and `afterEach`
5. Mock DOM elements and events when needed
6. Test both success and error cases
7. Verify component state and DOM changes

Example test structure:

```typescript
describe('ComponentName', () => {
  beforeEach(() => {
    // Set up test environment
  });

  afterEach(() => {
    // Clean up after tests
  });

  describe('methodName()', () => {
    it('should do something specific', () => {
      // Test implementation
    });

    it('should handle error case', () => {
      // Test error handling
    });
  });
});
```

#### Debugging Tests

1. Use Jest's debugging features:
```bash
# Run specific tests
npm test -- -t "test name"

# Debug tests
npm test -- --debug
```

2. Use console.log or debugger:
```typescript
test('debugging example', () => {
  debugger; // IDE will break here when running in debug mode
  console.log('test state:', someValue);
});
```

3. View detailed test output:
```bash
npm test -- --verbose
```

#### Continuous Integration

Tests are automatically run in CI environments. The pipeline:
1. Installs dependencies
2. Builds the project
3. Runs tests with coverage
4. Fails if coverage thresholds are not met

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Author

Lorien Gamaroff (lorien@gamaroff.org)

## Support

If you encounter any issues or have questions, please [open an issue](https://github.com/Gamaroff/ionic-wizard-bubbles/issues).
