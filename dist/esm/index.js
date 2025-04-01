import { registerPlugin } from '@capacitor/core';
const WizardBubble = registerPlugin('WizardBubble', {
    web: () => import('./web').then(m => new m.WizardBubbleWeb()),
});
export * from './definitions';
export { WizardBubble };
//# sourceMappingURL=index.js.map