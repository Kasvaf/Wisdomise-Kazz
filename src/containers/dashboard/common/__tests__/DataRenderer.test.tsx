import DataRenderer from '../DataRenderer';
import { renderWithContext } from '../../../../test-utils';

describe('DataRenderer.tsx', () => {
  test('Should show empty data message, if the wallet is connected, but the data array is empty', () => {
    const dataText = 'Best data ever';
    const dataRepresentation = <div>{dataText}</div>;

    const { result } = renderWithContext(
      <DataRenderer data={[]} view={dataRepresentation} />,
    );

    const emptyDataMsg = result.getByText('No data found');

    expect(emptyDataMsg).toBeInTheDocument();

    const dataElement = result.queryByText(dataText);

    expect(dataElement).toBeNull();
  });

  test('Should show custom message, if the wallet is connected, data array is empty and custom message is supplied', () => {
    const dataText = 'Best data ever';
    const dataRepresentation = <div>{dataText}</div>;

    const customMessage = 'wisdomise to the moon';
    const { result } = renderWithContext(
      <DataRenderer
        data={[]}
        view={dataRepresentation}
        message={customMessage}
      />,
    );

    const emptyDataMsg = result.queryByText(customMessage);

    expect(emptyDataMsg).toBeInTheDocument();

    const dataElement = result.queryByText(dataText);

    expect(dataElement).toBeNull();
  });

  test('Should show the supplied data view, if the wallet is connected and the data is present in the array', () => {
    const dataText = 'Best data ever';
    const dataRepresentation = <div>{dataText}</div>;

    const { result } = renderWithContext(
      <DataRenderer
        data={[{ value: 'items not empty' }]}
        view={dataRepresentation}
      />,
    );

    const dataElement = result.queryByText(dataText);

    expect(dataElement).toBeInTheDocument();
  });

  test('Should show loading spinner if wallet is connected and "isLoading" is true', () => {
    const dataText = 'Best data ever';
    const dataRepresentation = <div>{dataText}</div>;

    const { result } = renderWithContext(
      <DataRenderer
        data={[{ value: 'not empty' }]}
        view={dataRepresentation}
        isLoading={true}
      />,
    );

    const dataElement = result.queryByText(dataText);

    expect(dataElement).toBeNull();
  });
});
