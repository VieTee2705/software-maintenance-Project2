<script setup>
import { reactive, ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { toast } from "@/utils/toast";

const router = useRouter();
const isShowPassword = ref(false);
const isSubmitting = ref(false);

const formData = reactive({
  hoLot: "",
  tenDocGia: "",
  dienThoai: "",
  email: "",
  diaChi: "",
  password: "",
  gioiTinh: "Nam",
  ngaySinh: "",
});

const handleRegister = async () => {
  isSubmitting.value = true;
  try {
    const response = await axios.post("http://localhost:3000/api/docgia", formData);
    toast.success(`Đăng ký thành công! Mã độc giả của bạn: ${response.data.maDocGia}`);
    router.push("/dangnhap");
  } catch (error) {
    console.log(error);
    const msg = error.response?.data?.message || error.message;
    toast.error("Lỗi khi đăng ký: " + msg);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="register-page py-5">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-9 col-lg-7 col-xl-6">
          <div class="minimal-card p-4 p-md-5 position-relative z-1">
            <div class="text-center mb-4">
              <div class="icon-circle bg-light text-navy border mx-auto mb-3">
                <i class="fas fa-user-plus"></i>
              </div>
              <h3 class="text-navy fw-bold mb-1">Đăng Ký Độc Giả</h3>
              <p class="text-muted small mb-0">
                Tạo tài khoản độc giả để mượn sách và theo dõi lịch sử mượn trả.
              </p>
            </div>

            <form @submit.prevent="handleRegister">
              <div class="row g-3 mb-3">
                <div class="col-md-6">
                  <label for="hoLot" class="form-label fw-semibold small">
                    Họ lót <span class="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    class="form-control"
                    id="hoLot"
                    v-model="formData.hoLot"
                    placeholder="Nguyễn Văn"
                    required
                  />
                </div>
                <div class="col-md-6">
                  <label for="tenDocGia" class="form-label fw-semibold small">
                    Tên <span class="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    class="form-control"
                    id="tenDocGia"
                    v-model="formData.tenDocGia"
                    placeholder="An"
                    required
                  />
                </div>
              </div>

              <div class="row g-3 mb-3">
                <div class="col-md-6">
                  <label for="dienThoai" class="form-label fw-semibold small">
                    Số điện thoại <span class="text-danger">*</span>
                  </label>
                  <input
                    type="tel"
                    class="form-control"
                    id="dienThoai"
                    v-model="formData.dienThoai"
                    placeholder="09xxxxxxxx"
                    pattern="[0-9]{9,12}"
                    required
                  />
                </div>

                <div class="col-md-6">
                  <label for="ngaySinh" class="form-label fw-semibold small">
                    Ngày sinh <span class="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    class="form-control"
                    id="ngaySinh"
                    v-model="formData.ngaySinh"
                    required
                  />
                </div>
              </div>

              <div class="mb-3">
                <label for="email" class="form-label fw-semibold small">
                  Email <span class="text-danger">*</span>
                </label>
                <input
                  type="email"
                  class="form-control"
                  id="email"
                  v-model="formData.email"
                  placeholder="email@example.com"
                  required
                />
              </div>

              <div class="mb-3">
                <label for="diaChi" class="form-label fw-semibold small">Địa chỉ</label>
                <input
                  type="text"
                  class="form-control"
                  id="diaChi"
                  v-model="formData.diaChi"
                  placeholder="Số nhà, đường, quận/huyện, tỉnh/thành..."
                />
              </div>

              <div class="mb-3">
                <label for="password" class="form-label fw-semibold small">
                  Mật khẩu <span class="text-danger">*</span>
                </label>
                <div class="input-group">
                  <input
                    :type="isShowPassword ? 'text' : 'password'"
                    class="form-control"
                    id="password"
                    v-model="formData.password"
                    placeholder="Nhập mật khẩu"
                    required
                  />
                  <button
                    class="btn btn-subtle"
                    type="button"
                    @click="isShowPassword = !isShowPassword"
                  >
                    <i :class="isShowPassword ? 'fas fa-eye' : 'fas fa-eye-slash'"></i>
                  </button>
                </div>
              </div>

              <div class="mb-4">
                <label class="form-label fw-semibold small d-block">Giới tính</label>
                <div class="d-flex gap-4">
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="radio"
                      id="nam"
                      value="Nam"
                      v-model="formData.gioiTinh"
                    />
                    <label class="form-check-label" for="nam">Nam</label>
                  </div>
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="radio"
                      id="nu"
                      value="Nu"
                      v-model="formData.gioiTinh"
                    />
                    <label class="form-check-label" for="nu">Nữ</label>
                  </div>
                </div>
              </div>

              <button type="submit" class="btn btn-navy btn-lg w-100" :disabled="isSubmitting">
                <i class="fas fa-user-check me-2"></i>
                {{ isSubmitting ? "Đang đăng ký..." : "Đăng Ký Tài Khoản" }}
              </button>
            </form>

            <div class="mt-4 pt-3 border-top text-center">
              <span class="text-muted small">Bạn đã có tài khoản? </span>
              <router-link to="/dangnhap" class="text-navy fw-semibold small text-decoration-none">
                Đăng nhập ngay
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.register-page {
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
