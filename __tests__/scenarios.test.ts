/**
 * Data validation for "Try a shift" scenarios — keeps authored content
 * consistent with what the player screen expects.
 */
import { describe, expect, it } from '@jest/globals';

import careersData from '../data/careers.json';
import scenariosData from '../data/scenarios.json';
import { Career, ShiftScenario } from '../types';

const careers = careersData.careers as unknown as Career[];
const scenarios = scenariosData.scenarios as unknown as ShiftScenario[];

const MECHANICS = ['photoStory', 'sequencing', 'dialogue', 'printout'];
const QUALITIES = ['best', 'ok', 'bad'];

describe('shift scenarios', () => {
  it('has at least one scenario', () => {
    expect(scenarios.length).toBeGreaterThan(0);
  });

  scenarios.forEach((s) => {
    describe(s.id, () => {
      it('points at a real career and a known mechanic', () => {
        expect(careers.map((c) => c.id)).toContain(s.careerId);
        expect(MECHANICS).toContain(s.mechanic);
        expect(s.title.length).toBeGreaterThan(0);
        expect(s.setting.length).toBeGreaterThan(0);
        expect(s.debrief.length).toBeGreaterThan(0);
      });

      it('has 3–8 beats, each with 2–4 choices and exactly one best', () => {
        expect(s.beats.length).toBeGreaterThanOrEqual(3);
        expect(s.beats.length).toBeLessThanOrEqual(8);
        s.beats.forEach((beat) => {
          expect(beat.prompt.length).toBeGreaterThan(0);
          expect(beat.choices.length).toBeGreaterThanOrEqual(2);
          expect(beat.choices.length).toBeLessThanOrEqual(4);
          beat.choices.forEach((choice) => {
            expect(choice.text.length).toBeGreaterThan(0);
            expect(choice.outcome.length).toBeGreaterThan(0);
            expect(QUALITIES).toContain(choice.quality);
          });
          const bests = beat.choices.filter((c) => c.quality === 'best');
          expect(bests).toHaveLength(1);
        });
      });

      it('beats carry the payload their mechanic renders', () => {
        s.beats.forEach((beat) => {
          if (s.mechanic === 'photoStory') {
            expect(beat.scene?.length).toBeGreaterThan(0);
            expect(beat.sceneEmoji?.length).toBeGreaterThan(0);
          }
          if (s.mechanic === 'sequencing') {
            expect(beat.tickets?.length).toBeGreaterThan(0);
            beat.tickets?.forEach((t) => {
              expect(t.item.length).toBeGreaterThan(0);
              expect(['new', 'cooking', 'dying']).toContain(t.status);
            });
          }
          if (s.mechanic === 'dialogue') {
            expect(beat.messages?.length).toBeGreaterThan(0);
            beat.messages?.forEach((m) => {
              expect(['them', 'you']).toContain(m.from);
              expect(m.text.length).toBeGreaterThan(0);
            });
          }
          if (s.mechanic === 'printout') {
            expect(beat.paper?.title.length).toBeGreaterThan(0);
            expect(beat.paper?.lines.length).toBeGreaterThan(0);
          }
        });
      });

      it('beat ids are unique (used as React keys)', () => {
        const ids = s.beats.map((b) => b.id);
        expect(new Set(ids).size).toBe(ids.length);
      });
    });
  });

  it('one scenario per career at most', () => {
    const ids = scenarios.map((s) => s.careerId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('no em dashes or dash-as-punctuation in any copy (house style)', () => {
    const text = JSON.stringify(scenariosData);
    expect(text).not.toMatch(/—|–/);
    // Dash used as a pause (" - ") is banned; hyphenated words are fine.
    expect(text).not.toMatch(/ - /);
  });
});
