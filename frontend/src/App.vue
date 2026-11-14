<script setup>
import AppHeader from "@/components/AppHeader.vue";
import ToastContainer from "@/components/ToastContainer.vue";
</script>

<template>
  <div id="app" class="d-flex flex-column min-vh-100">
    <ToastContainer />
    <AppHeader />

    <main class="flex-grow-1 pb-5">
      <router-view />
    </main>

    <footer class="minimal-footer py-4 mt-auto">
      <div class="container">
        <div class="row align-items-center gy-2">
          <div class="col-md-6 text-center text-md-start">
            <div class="fw-semibold text-dark d-flex align-items-center justify-content-center justify-content-md-start gap-2">
              <i class="fas fa-book-open text-navy"></i>
              <span>E-BookStore — Hệ thống Quản lý Thư viện</span>
            </div>
            <small class="text-muted">
              Tra cứu đầu sách, đăng ký mượn trực tuyến và theo dõi trạng thái mượn trả.
            </small>
          </div>
          <div class="col-md-6 text-center text-md-end small text-muted">
            <span><i class="fas fa-envelope me-1"></i> support@ebookstore.com</span>
            <span class="mx-2">·</span>
            <span><i class="fas fa-phone-alt me-1"></i> 1900 1000</span>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style>
:root {
  --tone-navy: #1e3a8a;
  --tone-navy-hover: #172554;
  --tone-orange: #c2410c;
  --tone-orange-hover: #9a3412;
  --tone-delete: #b91c1c;
  --tone-delete-hover: #991b1b;
  --tone-forest: #15803d;
  --tone-forest-hover: #166534;
  --surface-bg: #f8fafc;
  --border-subtle: #e2e8f0;
  --text-main: #0f172a;
  --text-muted: #64748b;
}

#app {
  font-family: "Inter", "Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif;
  background-color: var(--surface-bg);
  color: var(--text-main);
}

.text-navy {
  color: var(--tone-navy) !important;
}

.text-orange {
  color: var(--tone-orange) !important;
}

.page-header-card,
.minimal-card {
  background: #ffffff;
  border: 1px solid var(--border-subtle);
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
}

.card {
  border-radius: 10px;
  border: 1px solid var(--border-subtle);
}

.minimal-footer {
  background: #ffffff;
  border-top: 1px solid var(--border-subtle);
}

/* Minimalist Button System */
.btn-navy {
  background-color: var(--tone-navy);
  border: 1px solid var(--tone-navy);
  color: #ffffff;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.15s ease;
}
.btn-navy:hover,
.btn-navy:focus {
  background-color: var(--tone-navy-hover);
  border-color: var(--tone-navy-hover);
  color: #ffffff;
}
.btn-navy:disabled {
  opacity: 0.6;
}

.btn-outline-navy {
  background-color: transparent;
  border: 1px solid var(--tone-navy);
  color: var(--tone-navy);
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.15s ease;
}
.btn-outline-navy:hover {
  background-color: var(--tone-navy);
  color: #ffffff;
}

.btn-orange {
  background-color: var(--tone-orange);
  border: 1px solid var(--tone-orange);
  color: #ffffff;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.15s ease;
}
.btn-orange:hover {
  background-color: var(--tone-orange-hover);
  border-color: var(--tone-orange-hover);
  color: #ffffff;
}

.btn-outline-orange {
  background-color: transparent;
  border: 1px solid #fdba74;
  color: var(--tone-orange);
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.15s ease;
}
.btn-outline-orange:hover {
  background-color: var(--tone-orange);
  border-color: var(--tone-orange);
  color: #ffffff;
}

.btn-delete {
  background-color: var(--tone-delete);
  border: 1px solid var(--tone-delete);
  color: #ffffff;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.15s ease;
}
.btn-delete:hover {
  background-color: var(--tone-delete-hover);
  border-color: var(--tone-delete-hover);
  color: #ffffff;
}

.btn-outline-delete {
  background-color: transparent;
  border: 1px solid #fecaca;
  color: var(--tone-delete);
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.15s ease;
}
.btn-outline-delete:hover {
  background-color: var(--tone-delete);
  border-color: var(--tone-delete);
  color: #ffffff;
}

.btn-forest {
  background-color: var(--tone-forest);
  border: 1px solid var(--tone-forest);
  color: #ffffff;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.15s ease;
}
.btn-forest:hover {
  background-color: var(--tone-forest-hover);
  border-color: var(--tone-forest-hover);
  color: #ffffff;
}

.btn-subtle {
  background-color: #f1f5f9;
  border: 1px solid #e2e8f0;
  color: #334155;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.15s ease;
}
.btn-subtle:hover {
  background-color: #e2e8f0;
  color: #0f172a;
}

/* Minimalist Status Badges */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 600;
  border: 1px solid transparent;
}

.status-pending {
  background-color: #fff7ed;
  color: #c2410c;
  border-color: #fed7aa;
}

.status-borrowed {
  background-color: #eff6ff;
  color: #1e3a8a;
  border-color: #bfdbfe;
}

.status-returned {
  background-color: #f0fdf4;
  color: #15803d;
  border-color: #bbf7d0;
}

.status-rejected,
.status-overdue {
  background-color: #fef2f2;
  color: #b91c1c;
  border-color: #fecaca;
}

.status-neutral {
  background-color: #f1f5f9;
  color: #475569;
  border-color: #cbd5e1;
}

.table thead th {
  font-weight: 600;
  font-size: 0.82rem;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: #475569;
  background-color: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.form-control:focus,
.form-select:focus {
  border-color: #93c5fd;
  box-shadow: 0 0 0 3px rgba(30, 58, 138, 0.08);
}
</style>
