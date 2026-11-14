<script setup>
import { toastState, removeToast } from "@/utils/toast";

const typeConfig = {
  success: {
    icon: "fas fa-check-circle",
    className: "toast-success",
    title: "Thành công",
  },
  error: {
    icon: "fas fa-exclamation-circle",
    className: "toast-error",
    title: "Lỗi",
  },
  warning: {
    icon: "fas fa-exclamation-triangle",
    className: "toast-warning",
    title: "Lưu ý",
  },
  info: {
    icon: "fas fa-info-circle",
    className: "toast-info",
    title: "Thông báo",
  },
};

const getConfig = (type) => typeConfig[type] || typeConfig.info;
</script>

<template>
  <div class="toast-stack" aria-live="polite" aria-atomic="true">
    <TransitionGroup name="toast-slide">
      <div
        v-for="item in toastState.items"
        :key="item.id"
        class="minimal-toast"
        :class="getConfig(item.type).className"
        role="alert"
      >
        <div class="toast-icon">
          <i :class="getConfig(item.type).icon"></i>
        </div>
        <div class="toast-content">
          <div class="toast-title">{{ getConfig(item.type).title }}</div>
          <div class="toast-message">{{ item.message }}</div>
        </div>
        <button
          type="button"
          class="toast-close"
          @click="removeToast(item.id)"
          aria-label="Đóng thông báo"
        >
          <i class="fas fa-times"></i>
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-stack {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 380px;
  width: calc(100vw - 40px);
  pointer-events: none;
}

.minimal-toast {
  pointer-events: auto;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-left-width: 4px;
  border-radius: 8px;
  padding: 12px 14px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
  color: #1e293b;
}

.toast-success {
  border-left-color: #15803d;
}
.toast-success .toast-icon {
  color: #15803d;
}

.toast-error {
  border-left-color: #b91c1c;
}
.toast-error .toast-icon {
  color: #b91c1c;
}

.toast-warning {
  border-left-color: #c2410c;
}
.toast-warning .toast-icon {
  color: #c2410c;
}

.toast-info {
  border-left-color: #1e3a8a;
}
.toast-info .toast-icon {
  color: #1e3a8a;
}

.toast-icon {
  font-size: 1.05rem;
  margin-top: 2px;
  flex-shrink: 0;
}

.toast-content {
  flex: 1;
  min-width: 0;
}

.toast-title {
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: #475569;
  margin-bottom: 2px;
}

.toast-message {
  font-size: 0.9rem;
  line-height: 1.4;
  color: #0f172a;
  word-break: break-word;
}

.toast-close {
  background: transparent;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 2px 4px;
  line-height: 1;
  transition: color 0.15s;
}

.toast-close:hover {
  color: #334155;
}

.toast-slide-enter-active,
.toast-slide-leave-active {
  transition: all 0.25s ease;
}

.toast-slide-enter-from {
  opacity: 0;
  transform: translateX(24px);
}

.toast-slide-leave-to {
  opacity: 0;
  transform: translateX(24px);
}
</style>
