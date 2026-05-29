import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { DOMAIN_META, ALL_DOMAIN_IDS } from './types';

describe('DOMAIN_META integrity', () => {
  it('defines all 8 domains', () => {
    expect(ALL_DOMAIN_IDS.length).toBe(8);
  });

  it('every domain has a label, shortLabel, and graphic', () => {
    for (const id of ALL_DOMAIN_IDS) {
      const meta = DOMAIN_META[id];
      expect(meta, id).toBeTruthy();
      expect(meta.label, id).toBeTruthy();
      expect(meta.shortLabel, id).toBeTruthy();
      expect(meta.graphic, id).toMatch(/^\/domain-graphics\/.+\.webp$/);
    }
  });

  it('every graphic file exists on disk', () => {
    for (const id of ALL_DOMAIN_IDS) {
      const rel = DOMAIN_META[id].graphic.replace(/^\//, '');
      const abs = join(process.cwd(), 'public', rel);
      expect(existsSync(abs), `${id} -> ${rel}`).toBe(true);
    }
  });

  it('maps graphics 1:1 (no duplicate graphic across domains)', () => {
    const graphics = ALL_DOMAIN_IDS.map((id) => DOMAIN_META[id].graphic);
    expect(new Set(graphics).size).toBe(graphics.length);
  });
});
