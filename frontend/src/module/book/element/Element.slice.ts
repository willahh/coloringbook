import { createSlice } from '@reduxjs/toolkit';
import { addElementToPage } from './Element.action';

interface ElementState {
  elements: Element[];
}
const initialState: ElementState = {
  elements: [],
};

const slice = createSlice({
  name: 'elements',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      addElementToPage,
      (state, { payload: { element, pageId } }) => {
        const page = state.pages.find((p) => p.pageId === pageId);
        if (page) {
          page.elements.push(element);
        }
      }
    );
  },
});

export default slice.reducer;
