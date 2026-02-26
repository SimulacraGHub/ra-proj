import { render } from '@testing-library/react';

import RaProjShared from './shared';

describe('RaProjShared', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<RaProjShared />);
    expect(baseElement).toBeTruthy();
  });
});
