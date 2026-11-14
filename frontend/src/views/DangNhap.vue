<template>
  <div class="login-page py-5">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-7 col-lg-5 col-xl-4">
          <div class="minimal-card p-4 p-md-5">
            <div class="text-center mb-4">
              <div class="icon-circle bg-light text-navy border mx-auto mb-3">
                <i class="fas fa-book-reader"></i>
              </div>
              <h3 class="fw-bold text-dark mb-1">Đăng Nhập</h3>
              <p class="text-muted small mb-0">Quản lý thư viện &amp; Mượn trả sách</p>
            </div>

            <form @submit.prevent="handleLogin">
              <div class="mb-3">
                <label for="username" class="form-label fw-semibold small">Tài khoản</label>
                <div class="input-group">
                  <span class="input-group-text bg-light"><i class="fas fa-user text-secondary"></i></span>
                  <input
                    type="text"
                    class="form-control"
                    id="username"
                    v-model="username"
                    placeholder="Nhập Email (Độc giả) hoặc MSNV"
                    required
                  />
                </div>
              </div>

              <div class="mb-3">
                <label for="password" class="form-label fw-semibold small">Mật khẩu</label>
                <div class="input-group">
                  <span class="input-group-text bg-light"><i class="fas fa-lock text-secondary"></i></span>
                  <input
                    :type="isShowPassword ? 'text' : 'password'"
                    class="form-control"
                    id="password"
                    v-model="password"
                    placeholder="Nhập mật khẩu"
                    required
                  />
                  <button
                    class="btn btn-subtle"
                    type="button"
                    @click="toggleShowPassword"
                    title="Hiện/Ẩn mật khẩu"
                  >
                    <i :class="isShowPassword ? 'fas fa-eye' : 'fas fa-eye-slash'"></i>
                  </button>
                </div>
              </div>

              <div v-if="errorMessage" class="alert alert-danger py-2 small">
                <i class="fas fa-exclamation-circle me-1"></i>{{ errorMessage }}
              </div>

              <button type="submit" class="btn btn-navy btn-lg w-100 mt-2" :disabled="isLoading">
                <i class="fas fa-sign-in-alt me-2"></i>
                {{ isLoading ? "Đang xử lý..." : "Đăng nhập" }}
              </button>

              <div class="text-center mt-4 pt-3 border-top small">
                <span class="text-muted">Chưa có tài khoản? </span>
                <router-link to="/dangky" class="text-navy fw-semibold text-decoration-none">
                  Đăng ký độc giả
                </router-link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { toast } from "@/utils/toast";

const username = ref("");
const password = ref("");
const isShowPassword = ref(false);
const errorMessage = ref("");
const isLoading = ref(false);
const router = useRouter();

const toggleShowPassword = () => {
  isShowPassword.value = !isShowPassword.value;
};

const handleLogin = async () => {
  errorMessage.value = "";
  isLoading.value = true;

  try {
    const response = await axios.post("http://localhost:3000/api/auth/login", {
      username: username.value,
      password: password.value,
    });

    const { user, role } = response.data;

    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("role", role);
    localStorage.setItem("isLoggedIn", "true");
    window.dispatchEvent(new Event("auth-updated"));

    const roleName =
      role === "admin" ? "Quản trị viên" : role === "nhanvien" ? "Nhân viên" : "Độc giả";
    toast.success(`Đăng nhập thành công (${roleName})`);

    router.push("/");
  } catch (error) {
    if (error.response && error.response.data) {
      errorMessage.value = error.response.data.message;
    } else {
      errorMessage.value = "Lỗi kết nối đến máy chủ";
    }
    toast.error(errorMessage.value);
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.login-page {
  min-height: calc(100vh - 130px);
  display: flex;
  align-items: center;
  background-color: #f8fafc;
}

.icon-circle {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.15rem;
}
</style>
