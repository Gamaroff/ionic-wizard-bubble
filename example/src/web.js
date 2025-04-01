/* global document, window */

/**
 * @typedef {Object} WizardBubbleOptions
 * @property {Array<{targetId: string, text: string, icon?: string}>} steps
 * @property {{next?: string, finish?: string}} [buttonText]
 * @property {{backgroundColor?: string, textColor?: string, buttonColor?: string, buttonTextColor?: string, highlightColor?: string}} [theme]
 */

export class WizardBubbleWeb {
  /**
   * @type {number}
   */
  currentStep;

  /**
   * @type {Array<{targetId: string, text: string, icon?: string}>}
   */
  steps;

  /**
   * @type {HTMLElement|null}
   */
  bubbleElement;

  /**
   * @type {HTMLElement|null}
   */
  currentHighlight;

  constructor() {
    this.currentStep = 0;
    this.steps = [];
    this.bubbleElement = null;
    this.currentHighlight = null;
  }

  /**
   * @param {WizardBubbleOptions} options
   * @returns {Promise<void>}
   */
  async show(options) {
    this.addGlobalStyles(options);
    this.steps = options.steps;
    this.currentStep = 0;
    await this.showCurrentStep(options);
  }

  /**
   * @returns {Promise<void>}
   */
  async hide() {
    if (this.bubbleElement) {
      this.bubbleElement.remove();
      this.bubbleElement = null;
    }
    if (this.currentHighlight) {
      this.currentHighlight.remove();
      this.currentHighlight = null;
    }
  }

  /**
   * @returns {Promise<{isFinished: boolean}>}
   */
  async next() {
    if (this.currentStep >= this.steps.length - 1) {
      await this.hide();
      return { isFinished: true };
    }

    this.currentStep++;
    await this.showCurrentStep();
    return { isFinished: false };
  }

  /**
   * @param {WizardBubbleOptions} options
   * @returns {void}
   */
  addGlobalStyles(options) {
    const theme = options?.theme || {};
    const highlightColor = theme.highlightColor || '#007bff';
    
    const styles = `
      @keyframes wizardPulse {
        0% {
          box-shadow: 0 0 0 0 ${highlightColor}40;
        }
        70% {
          box-shadow: 0 0 0 10px ${highlightColor}00;
        }
        100% {
          box-shadow: 0 0 0 0 ${highlightColor}00;
        }
      }
      
      .wizard-highlight {
        position: absolute;
        pointer-events: none;
        z-index: 9999;
        border: 2px solid ${highlightColor};
        border-radius: 4px;
        animation: wizardPulse 2s infinite;
        transition: all 0.3s ease;
      }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
  }

  /**
   * @param {HTMLElement} targetElement
   * @returns {void}
   */
  highlightTarget(targetElement) {
    if (this.currentHighlight) {
      this.currentHighlight.remove();
    }

    const rect = targetElement.getBoundingClientRect();
    const highlight = document.createElement('div');
    highlight.className = 'wizard-highlight';
    
    highlight.style.top = `${rect.top + window.scrollY}px`;
    highlight.style.left = `${rect.left + window.scrollX}px`;
    highlight.style.width = `${rect.width}px`;
    highlight.style.height = `${rect.height}px`;

    document.body.appendChild(highlight);
    this.currentHighlight = highlight;
  }

  /**
   * @param {WizardBubbleOptions} [options]
   * @returns {Promise<void>}
   */
  async showCurrentStep(options) {
    const step = this.steps[this.currentStep];
    const targetElement = document.getElementById(step.targetId);

    if (!targetElement) {
      throw new Error(`Target element with ID ${step.targetId} not found`);
    }

    await this.hide();
    this.highlightTarget(targetElement);

    this.bubbleElement = document.createElement('div');
    this.bubbleElement.className = 'wizard-bubble';
    
    const theme = options?.theme || {};
    
    const styles = `
      .wizard-bubble {
        position: fixed;
        background: ${theme.backgroundColor || '#ffffff'};
        color: ${theme.textColor || '#000000'};
        padding: 15px;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        max-width: 300px;
        z-index: 10000;
        transition: all 0.3s ease;
      }
      .wizard-bubble::before {
        content: '';
        position: absolute;
        border: 10px solid transparent;
        pointer-events: none;
      }
      .wizard-bubble.position-top::before {
        border-top-color: ${theme.backgroundColor || '#ffffff'};
        bottom: -20px;
        left: 50%;
        transform: translateX(-50%);
      }
      .wizard-bubble.position-bottom::before {
        border-bottom-color: ${theme.backgroundColor || '#ffffff'};
        top: -20px;
        left: 50%;
        transform: translateX(-50%);
      }
      .wizard-bubble.position-left::before {
        border-left-color: ${theme.backgroundColor || '#ffffff'};
        right: -20px;
        top: 50%;
        transform: translateY(-50%);
      }
      .wizard-bubble.position-right::before {
        border-right-color: ${theme.backgroundColor || '#ffffff'};
        left: -20px;
        top: 50%;
        transform: translateY(-50%);
      }
      .wizard-bubble-content {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
      }
      .wizard-bubble-icon {
        margin-right: 10px;
        width: 24px;
        height: 24px;
        flex-shrink: 0;
      }
      .wizard-bubble-button {
        background: ${theme.buttonColor || '#007bff'};
        color: ${theme.buttonTextColor || '#ffffff'};
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        float: right;
        transition: background-color 0.2s;
      }
      .wizard-bubble-button:hover {
        background: ${theme.buttonColor ? this.adjustBrightness(theme.buttonColor, -10) : '#0056b3'};
      }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    const content = document.createElement('div');
    content.className = 'wizard-bubble-content';

    if (step.icon) {
      const icon = document.createElement('img');
      icon.src = step.icon;
      icon.className = 'wizard-bubble-icon';
      content.appendChild(icon);
    }

    const text = document.createElement('span');
    text.textContent = step.text;
    content.appendChild(text);

    const button = document.createElement('button');
    button.className = 'wizard-bubble-button';
    const isLastStep = this.currentStep === this.steps.length - 1;
    button.textContent = isLastStep 
      ? (options?.buttonText?.finish || 'Finish')
      : (options?.buttonText?.next || 'Next');
    button.onclick = () => this.next();

    this.bubbleElement.appendChild(content);
    this.bubbleElement.appendChild(button);
    document.body.appendChild(this.bubbleElement);

    // Position the bubble
    const targetRect = targetElement.getBoundingClientRect();
    const bubbleRect = this.bubbleElement.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    // Calculate available space in each direction
    const spaceAbove = targetRect.top;
    const spaceBelow = viewportHeight - targetRect.bottom;
    const spaceRight = viewportWidth - targetRect.right;

    // Determine best position
    let position;
    let top;
    let left;

    // Prefer positioning above or below if there's enough space
    if (spaceBelow >= bubbleRect.height + 20 || spaceAbove >= bubbleRect.height + 20) {
      // Position above or below based on available space
      if (spaceBelow >= bubbleRect.height + 20) {
        position = 'bottom';
        top = targetRect.bottom + 20;
      } else {
        position = 'top';
        top = targetRect.top - bubbleRect.height - 20;
      }
      // Center horizontally
      left = targetRect.left + (targetRect.width / 2) - (bubbleRect.width / 2);
    } else {
      // Position left or right based on available space
      if (spaceRight >= bubbleRect.width + 20) {
        position = 'right';
        left = targetRect.right + 20;
      } else {
        position = 'left';
        left = targetRect.left - bubbleRect.width - 20;
      }
      // Center vertically
      top = targetRect.top + (targetRect.height / 2) - (bubbleRect.height / 2);
    }

    // Ensure bubble stays within viewport
    if (left < 10) left = 10;
    if (left + bubbleRect.width > viewportWidth - 10) {
      left = viewportWidth - bubbleRect.width - 10;
    }
    if (top < 10) top = 10;
    if (top + bubbleRect.height > viewportHeight - 10) {
      top = viewportHeight - bubbleRect.height - 10;
    }

    this.bubbleElement.style.top = `${top}px`;
    this.bubbleElement.style.left = `${left}px`;
    this.bubbleElement.classList.add(`position-${position}`);
  }

  /**
   * @param {string} color - Hex color code
   * @param {number} percent - Brightness adjustment percentage
   * @returns {string} - Adjusted hex color code
   */
  adjustBrightness(color, percent) {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return '#' + (0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    ).toString(16).slice(1);
  }
}
