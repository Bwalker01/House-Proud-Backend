import { generateInviteCode } from '../../api/utils/inviteCodeGenerator';

describe('Invite Code Generator', () => {
  let originalMathRandom: () => number;
  let randomValues: number[];
  let currentIndex: number;

  beforeEach(() => {
    // Store original Math.random
    originalMathRandom = Math.random;
    // Reset index for each test
    currentIndex = 0;
    // Mock Math.random to return values in sequence
    randomValues = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6];
    Math.random = jest.fn(() => randomValues[currentIndex++]);
  });

  afterEach(() => {
    // Restore original Math.random
    Math.random = originalMathRandom;
  });

  it('should generate a 6-character invite code using predictable random values', () => {
    const inviteCode = generateInviteCode();

    // With our mocked values, we expect:
    // 0.1 * 62 ≈ 6.2 -> index 6 -> 'G'
    // 0.2 * 62 ≈ 12.4 -> index 12 -> 'M'
    // 0.3 * 62 ≈ 18.6 -> index 18 -> 'S'
    // 0.4 * 62 ≈ 24.8 -> index 24 -> 'Y'
    // 0.5 * 62 ≈ 31.0 -> index 31 -> 'f'
    // 0.6 * 62 ≈ 37.2 -> index 37 -> 'l'
    expect(inviteCode).toBe('GMSYfl');
    expect(inviteCode.length).toBe(6);
    expect(Math.random).toHaveBeenCalledTimes(6);
  });
});
