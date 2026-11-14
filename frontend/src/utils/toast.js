import { reactive } from "vue";

export const toastState = reactive({
  items: [],
});

let nextId = 1;

export const showToast = (message, type = "info", duration = 3500) => {
  const id = nextId++;
  toastState.items.push({ id, message, type });
  if (duration > 0) {
    setTimeout(() => {
      removeToast(id);
    }, duration);
  }
};

export const removeToast = (id) => {
  const idx = toastState.items.findIndex((item) => item.id === id);
  if (idx !== -1) {
    toastState.items.splice(idx, 1);
  }
};

export const toast = {
  success: (msg, duration) => showToast(msg, "success", duration),
  error: (msg, duration) => showToast(msg, "error", duration),
  warning: (msg, duration) => showToast(msg, "warning", duration),
  info: (msg, duration) => showToast(msg, "info", duration),
};
