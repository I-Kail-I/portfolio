import { describe, expect, it } from 'bun:test';
import { imageFileUrl } from './images';

describe('imageFileUrl', () => {
  it('builds byte-stream url under default prefix', () => {
    expect(imageFileUrl('img_1')).toBe('/api/file-upload/img_1');
  });
});
