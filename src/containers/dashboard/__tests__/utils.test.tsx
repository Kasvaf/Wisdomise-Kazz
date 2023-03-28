import { render, screen } from '@testing-library/react';
import { renderSide, titleWTooltipRenderer } from '../utils';
import capitalize from 'lodash/capitalize';

describe('utils.tsx', () => {
  describe('renderSide()', () => {
    test('Should render a div with the capitalized side text', () => {
      const sideValue = 'testside';

      const result = render(renderSide(sideValue));

      const targetDiv = result.queryByText(capitalize(sideValue));

      expect(targetDiv).toBeInTheDocument();
      expect(targetDiv).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('titleTooltipRenderer()', () => {
    test('Should render a title with tooltip that appears on icon hover', async () => {
      const tooltipText = 'I am tooltip';
      const tooltipContent = <div>{tooltipText}</div>;
      const titleValue = <>I am title</>;

      const result = render(titleWTooltipRenderer(titleValue, tooltipContent));

      const targetTitle = result.queryByText('I am title');

      expect(targetTitle).toBeInTheDocument();

      const hoverIcon = result.container.querySelector('svg');

      expect(hoverIcon).toBeInTheDocument();

      const tooltipDisabled = screen.queryByText(tooltipText);
      expect(tooltipDisabled).not.toBeInTheDocument();
    });
  });
});
