import { WebPlugin } from '@capacitor/core';
import type { WizardBubblePlugin, WizardBubbleOptions } from './definitions';

export class WizardBubbleWeb extends WebPlugin implements WizardBubblePlugin {
  private currentStep = 0;
  private steps: WizardBubbleOptions['steps'] = [];
  private bubbleElement: HTMLElement | null = null;
  private highlightElement: HTMLElement | null = null;
  private options: WizardBubbleOptions | null = null;

  // Test properties
  get testBubbleElement() { return this.bubbleElement; }
  get testCurrentStep() { return this.currentStep; }
  get testCurrentHighlight() { return this.highlightElement; }
  testHighlightTarget(element: HTMLElement) {
    this.highlightTarget(element);
  }

  private highlightTarget(element: HTMLElement) {
    if (!this.highlightElement) {
      this.highlightElement = document.createElement('div');
      this.highlightElement.style.position = 'absolute';
      this.highlightElement.style.border = '2px solid blue';
      this.highlightElement.style.pointerEvents = 'none';
      document.body.appendChild(this.highlightElement);
    }

    const rect = element.getBoundingClientRect();
    this.highlightElement.style.top = `${rect.top}px`;
    this.highlightElement.style.left = `${rect.left}px`;
    this.highlightElement.style.width = `${rect.width}px`;
    this.highlightElement.style.height = `${rect.height}px`;
  }

  async hide(): Promise<void> {
    if (this.bubbleElement) {
      document.body.removeChild(this.bubbleElement);
      this.bubbleElement = null;
    }
    if (this.highlightElement) {
      document.body.removeChild(this.highlightElement);
      this.highlightElement = null;
    }
  }

  async show(options: WizardBubbleOptions): Promise<void> {
    this.steps = options.steps;
    this.currentStep = 0;
    this.options = options;

    // Create bubble element
    this.bubbleElement = document.createElement('div');
    this.bubbleElement.className = 'wizard-bubble';
    document.body.appendChild(this.bubbleElement);

    // Create highlight element
    this.highlightElement = document.createElement('div');
    this.highlightElement.style.position = 'absolute';
    this.highlightElement.style.border = '2px solid blue';
    this.highlightElement.style.pointerEvents = 'none';
    document.body.appendChild(this.highlightElement);

    // Apply theme
    const theme = options.theme || {};
    this.bubbleElement.style.backgroundColor = theme.backgroundColor || '#ffffff';
    this.bubbleElement.style.color = theme.textColor || '#333333';
    this.bubbleElement.style.padding = '15px';
    this.bubbleElement.style.borderRadius = theme.borderRadius || '8px';
    this.bubbleElement.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    this.bubbleElement.style.position = 'absolute';
    this.bubbleElement.style.zIndex = '1000';
    this.bubbleElement.style.maxWidth = '300px';

    await this.showStep();
  }

  private async showStep(): Promise<void> {
    if (!this.bubbleElement || !this.options) return;

    const step = this.steps[this.currentStep];
    const targetElement = document.getElementById(step.targetId);

    if (!targetElement) {
      throw new Error(`Target element with ID ${step.targetId} not found`);
    }

    // Update bubble content
    this.bubbleElement.textContent = step.text;

    // Position bubble near target
    const targetRect = targetElement.getBoundingClientRect();
    this.bubbleElement.style.top = `${targetRect.bottom + 10}px`;
    this.bubbleElement.style.left = `${targetRect.left}px`;

    // Highlight target
    this.highlightTarget(targetElement);
  }

  async next(): Promise<{ isFinished: boolean }> {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
      await this.showStep();
      return { isFinished: false };
    } else {
      await this.hide();
      return { isFinished: true };
    }
  }
}
