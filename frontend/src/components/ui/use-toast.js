// src/components/ui/use-toast.js

import * as React from "react";
import { v4 as uuid } from "uuid";

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000; // Define um valor alto ou `Infinity` se não quiser remoção automática

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
};

let count = 0;

function genId() {
  return uuid();
}

function reducer(state, action) {
  switch (action.type) {
    case actionTypes.ADD_TOAST:
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case actionTypes.UPDATE_TOAST:
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };

    case actionTypes.DISMISS_TOAST:
      const { toastId } = action;
      if (toastId) {
        return {
          ...state,
          toasts: state.toasts.map((t) =>
            t.id === toastId ? { ...t, open: false } : t
          ),
        };
      }
      return {
        ...state,
        toasts: [],
      };

    case actionTypes.REMOVE_TOAST:
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

const listeners = [];

const createToaster = () => {
  let state = {
    toasts: [],
  };

  const setState = (updater) => {
    state = updater(state);
    listeners.forEach((listener) => {
      listener(state);
    });
  };

  const toast = ({ ...props }) => {
    const id = genId();
    const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });
    const update = (props) =>
      dispatch({ type: "UPDATE_TOAST", toast: { id, ...props } });
    const toast = {
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss();
      },
      onActionClick: () => {},
      ...props,
    };
    dispatch({ type: "ADD_TOAST", toast });
    if (toast.duration !== Infinity) {
      setTimeout(() => dismiss(), toast.duration || TOAST_REMOVE_DELAY);
    }
    return { id, dismiss, update };
  };

  const dispatch = (action) => {
    setState((prevState) => reducer(prevState, action));
  };

  return {
    get toasts() {
      return state.toasts;
    },
    toast,
    dismiss: (toastId) => dispatch({ type: "DISMISS_TOAST", toastId }),
    subscribe: (listener) => {
      listeners.push(listener);
      return () => {
        const index = listeners.indexOf(listener);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      };
    },
    update: (id, props) =>
      dispatch({ type: "UPDATE_TOAST", toast: { id, ...props } }),
  };
};

const toaster = createToaster();

export function useToast() {
  const [state, setState] = React.useState(toaster.toasts);

  React.useEffect(() => {
    return toaster.subscribe(setState);
  }, []);

  return {
    ...state,
    toast: toaster.toast,
    dismiss: toaster.dismiss,
  };
}