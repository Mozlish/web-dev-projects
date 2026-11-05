// A reducer is a plain function: (currentState, action) => newState
// It never changes the old state — it always returns a NEW object.
// Keep it "pure": no toasts, no API calls, no randomness in here.

export const initialCartState = {
  items: [],
};

export function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_TO_CART":
      return {
        ...state,
        items: [...state.items, action.payload],
      };

    case "REMOVE_FROM_CART":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload.id),
      };

    case "CLEAR_CART":
      return {
        ...state,
        items: [],
      };

    default:
      return state;
  }
}
