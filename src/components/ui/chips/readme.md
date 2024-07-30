## ChipsGroup Component Documentation

### Introduction

The `ChipsGroup` component is a custom React component designed for handling chip-based selection functionality. It allows users to select or deselect various options from a list of predefined choices. This component is primarily used for filtering and sorting data.

### Dependencies

- React
- zod
- next/navigation
- next/image
- clsx

### Usage

```jsx
<ChipsGroup
  smartdataFilterKey="exampleName"
  label="Example Label"
  options={[
    { value: 'value1', label: 'Label 1' },
    { value: 'value2', label: 'Label 2' },
    // Add as much options as needed
  ]}
  defaultValues={['value1']}
/>;
```

### Props

- `smartdataFilterKey` (string): The unique identifier for the ChipsGroup component.
- `label` (string): The label associated with the ChipsGroup component.\
- `options` (array): An array of objects representing available options for selection, each containing a **value** and a **label**.\
  Labels are automaticly capitalized.
- `defaultValues` (array): An array of default selected values.

### Functionality

- The component can handle both query string values and {smartdata} from Store. Query string values have a priority. They affectes values in {smartdata} and localStoreage as follows.
- Query string and {smartdata} values are saved on page reloading. But they are setting to default values on clicking on corresponding page link.
- It allows selecting and deselecting options from the provided list.
- Options can be selected or deselected individually or as a group.
- Supports the rendering of country flags if the **paramName** is set to '_countries_'.

### Note

- If the options array is empty, the component will not render any chips.
- If user deselects all chips, values automaticly would be resetted to defaultValues on next reload.
- Smartdata filter name (prop `smartdataFilterKey`) should be defined in Smartdata Store too. For example, filter name is `countries`:

```jsx
const useSmartdataFiltersStore = create<TSmartdataStore>()(
  devtools(
    subscribeWithSelector(
      persist(
        (set) => ({
          smartdata: {
            eco_growth_nowcast: {
              countries: [],
              years: [],
              indicator: 'yty',
              approach: 'short',
              frequency: 'daily',
            },
```
