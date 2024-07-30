## SelectSingle Component Documentation

### Overview

The SelectSingle component is a customizable dropdown menu used to select a single value from a predefined list of options. It is designed to facilitate the selection and filtration of specific data based on user preferences. This component is integrated with various functionalities to manage and update URL query parameters, enabling seamless interaction with the browser's query string.

### Usage

```jsx
<SelectSingle
  smartdataFilterKey="exampleKey"
  label="Example Label"
  options={[
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    // Add more options as needed
  ]}
  defaultValue="option1"
/>
```

### Props

- `smartdataFilterKey`: Specify the key used for filtering data.
- `label`: Provide a label for the dropdown menu.
- `options`: Pass an array of objects representing the selectable options. Each object should contain a value and a label.
- `defaultValue`: Set the default value for the dropdown menu. Could be "".

### Functionality

- The component automatically manages URL query parameters, ensuring that the dropdown selection is reflected in the browser's query string.
- It updates both the displayed and Smartdata Store values, based on the current query string parameters.
- It facilitates the filtration of specific data based on user selections.

### Note

- All values (options, defaultValue) are formated automaticly to lowercase
- If no default value is provided it is automaticly setted to `options[0].value`
- Invalid value: if user manipulates query string and add a new value which is not presented in possible options
  (or user deletes all value from query value), the query string AND Smartdata Store value (with corresponding filterKey) are reseted to default value.
- Smartdata filter name (prop `smartdataFilterKey`) should be defined in Smartdata Store too. For example, filter name is `city`:

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
              indicator: '',
              approach: '',
              frequency: '',
              city: '',
            },
```
