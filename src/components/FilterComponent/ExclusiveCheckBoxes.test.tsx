import { fireEvent, render, RenderResult } from '@testing-library/react';
import ExclusiveCheckBoxes from './ExclusiveCheckBoxes'; // Adjust the import path as per your project structure
import { MemoryRouter } from 'react-router-dom';

describe('ExclusiveCheckBoxes component', () => {
  const options = [{label:"Admin", value:"Admin"}, {label:"Staff", value:"Staff"}];
  const paramName = 'type';

  let component: RenderResult;

  beforeEach(() => {
    component = render(
    <MemoryRouter>
        <ExclusiveCheckBoxes options={options} paramName={paramName} />
    </MemoryRouter>
      );
  });

  test('renders checkboxes with correct options', () => {
    options.forEach(option => {
      const checkbox = component.getByLabelText(option.label);
      expect(checkbox).toBeInTheDocument();
    });
  });

  test('changes search parameters when checkboxes are clicked', () => {
    const optionCheckbox = component.getByLabelText(options[1].label);
    fireEvent.click(optionCheckbox);

    expect(optionCheckbox).toBeChecked()
    const allCheckbox = component.getByLabelText('All');
    fireEvent.click(allCheckbox);

    expect(allCheckbox).toBeChecked()
  });
});