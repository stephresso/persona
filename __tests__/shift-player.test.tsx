/**
 * Plays both "Try a shift" mechanics end to end through the real ShiftScreen:
 * intro → every beat (choice → outcome → advance) → verdict → back.
 */
import React from 'react';
import { describe, expect, it, jest } from '@jest/globals';
import renderer, { ReactTestInstance, act } from 'react-test-renderer';

import careersData from '../data/careers.json';
import { Career } from '../types';

// Visual chrome not under test — swap for light stand-ins so the player
// logic renders without safe-area/svg native modules.
jest.mock('../components/Screen', () => {
  const { View } = require('react-native');
  return ({ children }: { children: React.ReactNode }) =>
    require('react').createElement(View, null, children);
});
jest.mock('../components/Shapes', () => {
  const { View } = require('react-native');
  return { WavyBadge: () => require('react').createElement(View) };
});
jest.mock('../constants/characters', () => ({
  characterTintForCard: () => '#FFB088',
}));

import ShiftScreen from '../screens/ShiftScreen';

const careers = careersData.careers as unknown as Career[];
const careerById = (id: string) => careers.find((c) => c.id === id)!;

const renderedTexts = (root: ReactTestInstance): string[] =>
  root
    .findAllByType(require('react-native').Text)
    .map((t) => (Array.isArray(t.props.children) ? t.props.children.join('') : String(t.props.children)));

const pressByText = (root: ReactTestInstance, label: string) => {
  const pressables = root.findAll(
    (node) =>
      typeof node.props.onPress === 'function' &&
      renderedTexts(node).some((t) => t.includes(label)),
  );
  expect(pressables.length).toBeGreaterThan(0);
  // Innermost matching pressable = the actual button.
  act(() => pressables[pressables.length - 1].props.onPress());
};

const playThrough = (careerId: string, pickChoice: (texts: string[]) => string) => {
  const goBack = jest.fn();
  const tree = renderer.create(
    <ShiftScreen
      route={{ params: { career: careerById(careerId) } }}
      navigation={{ goBack }}
    />,
  );
  const root = tree.root;

  pressByText(root, 'Clock in');

  // Walk every beat: pick a choice, check an outcome chip appears, advance.
  for (let guard = 0; guard < 20; guard++) {
    const texts = renderedTexts(root);
    if (texts.some((t) => t.includes('Shift complete') || t.includes('pro moves'))) break;
    pressByText(root, pickChoice(texts));
    const after = renderedTexts(root);
    expect(
      after.some((t) => ['Pro move', 'Fair call', 'Risky call'].includes(t)),
    ).toBe(true);
    pressByText(root, after.some((t) => t === 'Clock out') ? 'Clock out' : 'Next');
  }

  return { tree, root, goBack };
};

describe('ShiftScreen player', () => {
  it('plays the electrician photo-story to a pro verdict', () => {
    const scenario = require('../data/scenarios.json').scenarios.find(
      (s: any) => s.careerId === 'electrician',
    );
    let beat = 0;
    const { root, goBack } = playThrough('electrician', () => {
      const best = scenario.beats[beat].choices.find((c: any) => c.quality === 'best');
      beat += 1;
      return best.text.slice(0, 24);
    });

    const texts = renderedTexts(root);
    expect(texts.some((t) => t.includes('You moved like a pro'))).toBe(true);
    expect(texts.some((t) => t.includes('5 of 5 pro moves'))).toBe(true);
    expect(texts.some((t) => t.includes('half detective, half craftsman'))).toBe(true);

    pressByText(root, 'Back to the career');
    expect(goBack).toHaveBeenCalled();
  });

  it('renders the scene card for photo-story beats', () => {
    const tree = renderer.create(
      <ShiftScreen
        route={{ params: { career: careerById('electrician') } }}
        navigation={{ goBack: jest.fn() }}
      />,
    );
    pressByText(tree.root, 'Clock in');
    const texts = renderedTexts(tree.root);
    expect(texts.some((t) => t.includes('You pull up in the van'))).toBe(true);
    expect(texts).toContain('🚐');
  });

  it('plays a dialogue shift and renders the chat thread', () => {
    const scenario = require('../data/scenarios.json').scenarios.find(
      (s: any) => s.careerId === 'counselor',
    );
    let beat = 0;
    const { root } = playThrough('counselor', (texts) => {
      const firstMessage = scenario.beats[beat].messages[0].text.slice(0, 20);
      expect(texts.some((t) => t.includes(firstMessage))).toBe(true);
      const best = scenario.beats[beat].choices.find((c: any) => c.quality === 'best');
      beat += 1;
      return best.text.slice(0, 24);
    });
    expect(renderedTexts(root).some((t) => t.includes('pro moves'))).toBe(true);
  });

  it('plays a printout shift and renders the paper artifact', () => {
    const scenario = require('../data/scenarios.json').scenarios.find(
      (s: any) => s.careerId === 'data-analyst',
    );
    let beat = 0;
    const { root } = playThrough('data-analyst', (texts) => {
      const title = scenario.beats[beat].paper.title.toUpperCase();
      expect(texts.some((t) => t.toUpperCase().includes(title))).toBe(true);
      const best = scenario.beats[beat].choices.find((c: any) => c.quality === 'best');
      beat += 1;
      return best.text.slice(0, 24);
    });
    expect(renderedTexts(root).some((t) => t.includes('pro moves'))).toBe(true);
  });

  it('plays the chef sequencing shift and renders the ticket board', () => {
    const scenario = require('../data/scenarios.json').scenarios.find(
      (s: any) => s.careerId === 'chef',
    );
    let beat = 0;
    const { root } = playThrough('chef', (texts) => {
      // Ticket board renders before each decision (paper tickets print in caps).
      const expectedTicket = scenario.beats[beat].tickets[0].item.toUpperCase();
      expect(texts.some((t) => t.toUpperCase().includes(expectedTicket))).toBe(true);
      // Pick the worst option every time.
      const bad = scenario.beats[beat].choices.find((c: any) => c.quality === 'bad');
      beat += 1;
      return bad.text.slice(0, 24);
    });

    const texts = renderedTexts(root);
    expect(texts.some((t) => t.includes('Now you know what it takes'))).toBe(true);
    expect(texts.some((t) => t.includes('0 of 5 pro moves'))).toBe(true);
  });
});
