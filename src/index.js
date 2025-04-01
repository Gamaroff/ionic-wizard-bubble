import { registerPlugin } from '@capacitor/core';

import type { WizardBubblePlugin } from './definitions';

const WizardBubble = registerPlugin<WizardBubblePlugin>('WizardBubble', {
  web: () => import('./web').then(m => new m.WizardBubbleWeb()),
});

export * from './definitions';
export { WizardBubble };
