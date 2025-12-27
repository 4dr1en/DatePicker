# date-picker

[![Node.js CI](https://github.com/4dr1en/DatePicker/actions/workflows/node.js.yml/badge.svg)](https://github.com/4dr1en/DatePicker/actions/workflows/node.js.yml)
[![codecov](https://codecov.io/gh/4dr1en/DatePicker/branch/main/graph/badge.svg)](https://codecov.io/gh/4dr1en/DatePicker) (vitest only)

A date picker component in Vue.js
---

## Props:

- `modelValue` (String | Date): The selected date value. Can be a string or a Date object.
- `format` (String): The format in which the date should be displayed. (e.g., 'YYYY-MM-DD', 'MM/DD/YYYY', etc.)
- `label` (String): The label for the date picker input field.
- `placeholder` (String): Placeholder text for the input field when no date is selected.
- `hint` (String): Hint text to guide the user on how to use the date picker.


## Events:

- `update:modelValue` (Date | undefined) Emitted when the selected date changes.