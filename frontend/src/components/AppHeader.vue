<script setup>
import { ref, onMounted, computed, watch, onUnmounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { formatCurrency, getBookImageUrl, handleBookImageError } from "@/utils/formatters";
import { toast } from "@/utils/toast";

const router = useRouter();
const route = useRoute();

const user = ref(null);
const role = ref(null);
const cartItems = ref([]);
const isCartHover = ref(false);
const showSearchBar = ref(false);
const quickSearch = ref("");

const refreshUserData = () => {
  const userStr = localStorage.getItem("user");
  const roleStr = localStorage.getItem("role");

  if (userStr) {
    user.value = JSON.parse(userStr);
    role.value = roleStr;
  } else {
    user.value = null;
    role.value = null;
  }
};

const refreshCartData = () => {
  try {
    const cartStr = localStorage.getItem("cart");
    cartItems.value = cartStr ? JSON.parse(cartStr) : [];
  } catch (e) {
    console.error("Lỗi đọc giỏ hàng:", e);
    cartItems.value = [];
  }
};

onMounted(() => {
  refreshUserData();
  refreshCartData();
  window.addEventListener("cart-updated", refreshCartData);
  window.addEventListener("auth-updated", refreshUserData);
  window.addEventListener("storage", () => {
    refreshUserData();
    refreshCartData();
  });
});

onUnmounted(() => {
  window.removeEventListener("cart-updated", refreshCartData);
  window.removeEventListener("auth-updated", refreshUserData);
});

watch(route, () => {
  refreshUserData();
  refreshCartData();
  showSearchBar.value = false;
});

const handleLogout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("role");
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("token");
  localStorage.removeItem("cart");
  user.value = null;
  role.value = null;
  cartItems.value = [];
  window.dispatchEvent(new Event("cart-updated"));
  window.dispatchEvent(new Event("auth-updated"));
  toast.info("Đã đăng xuất khỏi hệ thống.");
  router.push("/dangnhap");
};

const handleQuickSearch = () => {
  const q = quickSearch.value.trim();
  showSearchBar.value = false;
  router.push(q ? { path: "/sach", query: { q } } : { path: "/sach" });
};

const isAdminOrStaff = computed(() => {
  return role.value === "admin" || role.value === "nhanvien";
});

const roleDisplay = computed(() => {
  if (role.value === "admin") return "Quản trị viên";
  if (role.value === "nhanvien") return "Nhân viên thư viện";
  return "Độc giả";
});

const fullDisplayName = computed(() => {
  if (!user.value) return "";
  if (user.value.HoTenNV) return user.value.HoTenNV;
  return `${user.value.hoLot || ""} ${user.value.tenDocGia || ""}`.trim() || "Người dùng";
});

const cartCount = computed(() => {
  return cartItems.value.reduce((total, item) => total + (Number(item.SoLuong) || 1), 0);
});

const menuItems = [
  { name: "Trang chủ", path: "/", icon: "fas fa-home" },
  { name: "Danh mục sách", path: "/sach", icon: "fas fa-book" },
  { name: "Nhà xuất bản", path: "/nxb", icon: "fas fa-building" },
];
</script>

<template>
  <header>
    <div class="top-bar py-2">
      <div class="container d-flex flex-column flex-md-row justify-content-between align-items-center small">
        <div class="mb-1 mb-md-0 fw-medium text-slate-200">
          <i class="fas fa-book-reader me-2 text-orange-soft"></i>Thế giới tri thức trong tầm tay bạn
        </div>
        <div class="d-flex gap-3 align-items-center text-slate-300">
          <span><i class="fas fa-envelope me-1"></i> support@ebookstore.com</span>
          <span class="d-none d-sm-inline opacity-50">|</span>
          <span><i class="fas fa-phone-alt me-1"></i> 1900 1000</span>
        </div>
      </div>
    </div>

    <nav class="navbar navbar-expand-lg navbar-light bg-white sticky-top border-bottom">
      <div class="container">
        <router-link to="/" class="navbar-brand d-flex align-items-center gap-2">
          <div class="brand-logo text-white rounded-2 d-flex align-items-center justify-content-center">
            <i class="fas fa-book-open"></i>
          </div>
          <div class="d-flex flex-column" style="line-height: 1.15;">
            <span class="fw-bold text-navy" style="font-size: 1.1rem; letter-spacing: 0.5px;">
              E-BookStore
            </span>
            <span class="text-muted" style="font-size: 0.72rem;">
              Hệ thống thư viện
            </span>
          </div>
        </router-link>

        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNavbar">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse justify-content-center" id="mainNavbar">
          <ul class="navbar-nav mb-2 mb-lg-0 gap-lg-1">
            <li class="nav-item" v-for="item in menuItems" :key="item.name">
              <router-link
                :to="item.path"
                class="nav-link px-3 rounded-2"
                active-class="active-link"
                exact-active-class="active-link"
              >
                <i :class="[item.icon, 'me-1 small']"></i>{{ item.name }}
              </router-link>
            </li>

            <li class="nav-item" v-if="user">
              <router-link to="/lich-su" class="nav-link px-3 rounded-2" active-class="active-link">
                <i class="fas fa-history me-1 small"></i>Lịch sử mượn
              </router-link>
            </li>

            <li class="nav-item dropdown" v-if="isAdminOrStaff">
              <a
                class="nav-link dropdown-toggle text-orange fw-semibold px-3 rounded-2"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
              >
                <i class="fas fa-sliders-h me-1"></i>Quản trị
              </a>
              <ul class="dropdown-menu shadow-sm border rounded-3 mt-1">
                <li>
                  <router-link to="/nxb" class="dropdown-item py-2">
                    <i class="fas fa-building me-2 text-navy"></i>Quản lý Nhà Xuất Bản
                  </router-link>
                </li>
                <li>
                  <router-link to="/admin/quanlysach" class="dropdown-item py-2">
                    <i class="fas fa-book me-2 text-navy"></i>Quản lý Đầu Sách
                  </router-link>
                </li>
                <li>
                  <router-link to="/sach/them" class="dropdown-item py-2">
                    <i class="fas fa-plus-circle me-2 text-orange"></i>Thêm Sách Mới
                  </router-link>
                </li>
                <li><hr class="dropdown-divider" /></li>
                <li>
                  <router-link to="/admin/muonsach" class="dropdown-item py-2">
                    <i class="fas fa-clipboard-list me-2 text-navy"></i>Quản Lý Mượn Trả
                  </router-link>
                </li>
                <li>
                  <router-link to="/admin/docgia" class="dropdown-item py-2">
                    <i class="fas fa-users me-2 text-navy"></i>Danh Sách Độc Giả
                  </router-link>
                </li>
              </ul>
            </li>
          </ul>
        </div>

        <div class="d-flex align-items-center gap-2 action-icons">
          <button
            type="button"
            class="btn btn-subtle btn-sm d-none d-lg-inline-flex align-items-center justify-content-center"
            style="width: 36px; height: 36px;"
            title="Tìm kiếm sách"
            @click="showSearchBar = !showSearchBar"
          >
            <i class="fas fa-search"></i>
          </button>

          <div class="dropdown">
            <button
              class="btn btn-link text-dark p-0 d-flex align-items-center gap-2 text-decoration-none"
              data-bs-toggle="dropdown"
            >
              <img
                v-if="user"
                :src="`https://ui-avatars.com/api/?name=${encodeURIComponent(fullDisplayName)}&background=1E3A8A&color=fff`"
                class="rounded-circle border"
                width="36"
                height="36"
                alt="Avatar"
              />
              <div
                v-else
                class="btn-subtle rounded-circle d-flex align-items-center justify-content-center"
                style="width: 36px; height: 36px;"
              >
                <i class="fas fa-user text-secondary"></i>
              </div>
              <span v-if="user" class="d-none d-xl-inline fw-medium text-dark small">
                {{ fullDisplayName }}
              </span>
            </button>

            <ul class="dropdown-menu dropdown-menu-end shadow-sm border rounded-3 mt-2" style="min-width: 230px;">
              <div v-if="user">
                <li class="px-3 py-2 bg-light border-bottom rounded-top">
                  <div class="fw-semibold text-navy">{{ fullDisplayName }}</div>
                  <small class="text-muted">{{ roleDisplay }}</small>
                </li>
                <li>
                  <router-link to="/ho-so" class="dropdown-item py-2">
                    <i class="fas fa-id-card me-2 text-navy"></i>Hồ sơ cá nhân
                  </router-link>
                </li>
                <li>
                  <router-link to="/lich-su" class="dropdown-item py-2">
                    <i class="fas fa-history me-2 text-navy"></i>Lịch sử mượn
                  </router-link>
                </li>
                <li><hr class="dropdown-divider my-1" /></li>
                <li>
                  <a href="#" @click.prevent="handleLogout" class="dropdown-item py-2 text-danger">
                    <i class="fas fa-sign-out-alt me-2"></i>Đăng xuất
                  </a>
                </li>
              </div>

              <div v-else>
                <li>
                  <router-link to="/dangnhap" class="dropdown-item py-2">
                    <i class="fas fa-sign-in-alt me-2 text-navy"></i>Đăng nhập
                  </router-link>
                </li>
                <li>
                  <router-link to="/dangky" class="dropdown-item py-2">
                    <i class="fas fa-user-plus me-2 text-orange"></i>Đăng ký thành viên
                  </router-link>
                </li>
              </div>
            </ul>
          </div>

          <div class="dropdown" @mouseenter="isCartHover = true" @mouseleave="isCartHover = false">
            <router-link
              to="/gio-hang"
              class="btn btn-subtle position-relative d-flex align-items-center justify-content-center"
              style="width: 38px; height: 38px;"
              title="Giỏ mượn sách"
            >
              <i class="fas fa-shopping-bag text-dark"></i>
              <span
                v-if="cartCount > 0"
                class="position-absolute top-0 start-100 translate-middle badge rounded-pill cart-badge"
              >
                {{ cartCount }}
              </span>
            </router-link>

            <div
              class="dropdown-menu dropdown-menu-end cart-dropdown p-0 shadow-sm border rounded-3"
              :class="{ show: isCartHover }"
            >
              <div class="p-3 bg-white rounded-3">
                <div class="d-flex justify-content-between align-items-center border-bottom pb-2 mb-2">
                  <h6 class="mb-0 fw-semibold text-dark">Giỏ mượn sách</h6>
                  <small class="text-muted">{{ cartCount }} quyển</small>
                </div>

                <div v-if="cartItems.length === 0" class="text-center py-4 text-muted">
                  <i class="fas fa-shopping-basket mb-2 fs-3 opacity-50"></i>
                  <p class="mb-0 small">Giỏ mượn đang trống</p>
                </div>

                <div v-else class="cart-items-list">
                  <div v-for="(book, index) in cartItems" :key="index" class="d-flex gap-2 mb-3 align-items-center">
                    <img
                      :src="getBookImageUrl(book.HinhAnh)"
                      class="rounded border flex-shrink-0"
                      width="46"
                      height="62"
                      style="object-fit: cover;"
                      alt="Book cover"
                      @error="handleBookImageError"
                    />
                    <div class="flex-grow-1 overflow-hidden">
                      <div class="text-truncate small fw-semibold text-dark">{{ book.TenSach }}</div>
                      <div class="text-truncate small text-muted">{{ book.TacGia || "Chưa rõ tác giả" }}</div>
                      <div class="small text-navy fw-semibold mt-1">
                        {{ formatCurrency(book.DonGia) }} × {{ book.SoLuong || 1 }}
                      </div>
                    </div>
                  </div>
                </div>

                <div v-if="cartItems.length > 0" class="border-top pt-2 mt-2">
                  <router-link to="/gio-hang" class="btn btn-navy btn-sm w-100">
                    Xem giỏ &amp; Gửi yêu cầu
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <div v-if="showSearchBar" class="bg-white border-bottom py-2">
      <div class="container">
        <form @submit.prevent="handleQuickSearch" class="d-flex gap-2 mx-auto" style="max-width: 560px;">
          <input
            type="text"
            class="form-control form-control-sm"
            v-model="quickSearch"
            placeholder="Nhập tên sách, tác giả hoặc mã sách cần tìm..."
            autofocus
          />
          <button type="submit" class="btn btn-navy btn-sm px-3">Tìm</button>
        </form>
      </div>
    </div>
  </header>
</template>

<style scoped>
.top-bar {
  background-color: #0f172a;
  color: #cbd5e1;
  font-size: 0.82rem;
}

.text-orange-soft {
  color: #fb923c;
}

.brand-logo {
  width: 38px;
  height: 38px;
  background-color: #1e3a8a;
}

.navbar-nav .nav-link {
  color: #475569;
  transition: all 0.15s ease;
  font-weight: 500;
  font-size: 0.92rem;
}

.navbar-nav .nav-link:hover {
  color: #1e3a8a;
  background-color: #f1f5f9;
}

.active-link {
  color: #1e3a8a !important;
  background-color: #eff6ff;
  font-weight: 600 !important;
}

.cart-badge {
  background-color: #c2410c;
  color: #ffffff;
  font-size: 0.7rem;
}

.cart-dropdown {
  width: 320px;
  margin-top: 8px;
  right: 0;
  left: auto;
}

.cart-items-list {
  max-height: 260px;
  overflow-y: auto;
}
</style>
