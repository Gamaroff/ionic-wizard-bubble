import { WebPlugin } from '@capacitor/core';
import type { WizardBubblePlugin, WizardBubbleOptions } from './definitions';
export declare class WizardBubbleWeb extends WebPlugin implements WizardBubblePlugin {
    private currentStep;
    private steps;
    private bubbleElement;
    private highlightElement;
    private options;
    get testBubbleElement(): HTMLElement | null;
    get testCurrentStep(): number;
    get testCurrentHighlight(): HTMLElement | null;
    testHighlightTarget(element: HTMLElement): void;
    private highlightTarget;
    hide(): Promise<void>;
    show(options: WizardBubbleOptions): Promise<void>;
    private showStep;
    next(): Promise<{
        isFinished: boolean;
    }>;
}
