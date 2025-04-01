import { WizardBubbleWeb } from '../web';

describe('WizardBubbleWeb', () => {
  let wizard: WizardBubbleWeb;
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    container.id = 'test-target';
    document.body.appendChild(container);
    wizard = new WizardBubbleWeb();
  });

  afterEach(() => {
    document.body.removeChild(container);
    if (wizard.testBubbleElement) {
      wizard.hide();
    }
  });

  describe('show()', () => {
    it('should create a bubble element', async () => {
      const targetId = 'test-target';
      const targetElement = document.createElement('div');
      targetElement.id = targetId;
      container.appendChild(targetElement);

      await wizard.show({
        steps: [
          {
            targetId,
            text: 'Test message',
          },
        ],
      });

      expect(wizard.testBubbleElement).toBeTruthy();
      expect(wizard.testBubbleElement?.classList.contains('wizard-bubble')).toBe(true);
    });

    it('should throw error if target element not found', async () => {
      await expect(
        wizard.show({
          steps: [
            {
              targetId: 'non-existent',
              text: 'Test message',
            },
          ],
        })
      ).rejects.toThrow('Target element with ID non-existent not found');
    });

    it('should apply custom theme', async () => {
      const targetId = 'themed-target';
      const targetElement = document.createElement('div');
      targetElement.id = targetId;
      container.appendChild(targetElement);

      const customTheme = {
        backgroundColor: '#000000',
        textColor: '#ffffff',
        buttonColor: '#ff0000',
        buttonTextColor: '#ffffff',
        highlightColor: '#00ff00',
      };

      await wizard.show({
        steps: [
          {
            targetId,
            text: 'Themed message',
          },
        ],
        theme: customTheme,
      });

      const computedStyle = window.getComputedStyle(wizard.testBubbleElement as HTMLElement);
      expect(computedStyle.backgroundColor).toBe('rgb(0, 0, 0)');
      expect(computedStyle.color).toBe('rgb(255, 255, 255)');
    });
  });

  describe('next()', () => {
    it('should advance to next step', async () => {
      const steps = ['step1', 'step2'].map(id => {
        const el = document.createElement('div');
        el.id = id;
        container.appendChild(el);
        return { targetId: id, text: `Step ${id}` };
      });

      await wizard.show({ steps });
      expect(wizard.testCurrentStep).toBe(0);

      const result = await wizard.next();
      expect(result.isFinished).toBe(false);
      expect(wizard.testCurrentStep).toBe(1);
    });

    it('should finish on last step', async () => {
      const targetElement = document.createElement('div');
      targetElement.id = 'single-step';
      container.appendChild(targetElement);

      await wizard.show({
        steps: [
          {
            targetId: 'single-step',
            text: 'Only step',
          },
        ],
      });

      const result = await wizard.next();
      expect(result.isFinished).toBe(true);
      expect(wizard.testBubbleElement).toBeNull();
    });
  });

  describe('hide()', () => {
    it('should remove bubble and highlight elements', async () => {
      await wizard.show({
        steps: [
          {
            targetId: 'test-target',
            text: 'Test hide',
          },
        ],
      });

      expect(wizard.testBubbleElement).toBeTruthy();
      expect(wizard.testCurrentHighlight).toBeTruthy();

      await wizard.hide();

      expect(wizard.testBubbleElement).toBeNull();
      expect(wizard.testCurrentHighlight).toBeNull();
    });
  });

  describe('highlightTarget()', () => {
    it('should create highlight element with correct position', () => {
      const targetElement = document.createElement('div');
      container.appendChild(targetElement);
      
      Object.defineProperty(targetElement, 'getBoundingClientRect', {
        value: () => ({
          top: 100,
          left: 100,
          width: 200,
          height: 50,
          bottom: 150,
          right: 300,
        }),
      });

      wizard.testHighlightTarget(targetElement);

      expect(wizard.testCurrentHighlight).toBeTruthy();
      expect(wizard.testCurrentHighlight?.style.top).toBe('100px');
      expect(wizard.testCurrentHighlight?.style.left).toBe('100px');
      expect(wizard.testCurrentHighlight?.style.width).toBe('200px');
      expect(wizard.testCurrentHighlight?.style.height).toBe('50px');
    });
  });
});
