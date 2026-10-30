import { render, screen } from '@testing-library/react';
import { RouterProvider } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { router } from './router';

describe('router', () => {
  it('redirige "/" a "/hoy"', async () => {
    render(<RouterProvider router={router} />);

    expect(await screen.findByRole('heading', { name: 'Hoy' })).toBeInTheDocument();
    expect(window.location.pathname).toBe('/hoy');
  });
});
