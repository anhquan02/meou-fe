import { ADD_TO_CART, REMOVE_FROM_CART, CLEAR_CART } from "../action/cart";

interface CartState {
  items: any[];
}

const initialState: CartState = {
  items: [],
};

if (typeof window !== "undefined" && localStorage?.getItem("cart")) {
  initialState.items = JSON.parse(localStorage.getItem("cart") || "{}");
  console.log(initialState.items);
} else {
  initialState.items = [];
}

export default function CartReducer(state = initialState, content: any) {
  const { type, payload } = content;
  switch (type) {
    case ADD_TO_CART:
      //  check duplicate
      const checkDuplicate = state.items.find(
        (item: any) => item.id === payload.id
      );
      if (checkDuplicate) {
        return state;
      }

      return {
        ...state,
        items: [...state.items, payload],
      };
    case REMOVE_FROM_CART:
      return {
        ...state,
        items: state.items.filter((item: any) => item.id !== payload.id),
      };
    case CLEAR_CART:
      return {
        ...state,
        items: [],
      };
    default:
      return state;
  }
}
