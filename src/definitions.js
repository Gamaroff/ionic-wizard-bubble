export interface WizardBubblePlugin {
  show(options: WizardBubbleOptions): Promise<void>;
  hide(): Promise<void>;
  next(): Promise<{ isFinished: boolean }>;
}

export interface WizardBubbleStep {
  targetId: string;
  text: string;
  icon?: string;
}

export interface WizardBubbleOptions {
  steps: WizardBubbleStep[];
  buttonText?: {
    next?: string;
    finish?: string;
  };
  theme?: {
    backgroundColor?: string;
    textColor?: string;
    buttonColor?: string;
    buttonTextColor?: string;
  };
}
