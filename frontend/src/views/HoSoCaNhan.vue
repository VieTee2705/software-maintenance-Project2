<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { formatDate } from "@/utils/formatters";
import { toast } from "@/utils/toast";

const router = useRouter();
const user = ref({});
const showEditModal = ref(false);
const isSaving = ref(false);
const editForm = ref({
  hoLot: "",
  tenDocGia: "",
  HoTenNV: "",
  dienThoai: "",
  diaChi: "",
  ngaySinh: "",
});

const fullName = computed(() => {
  if (!user.value) return "Khách";
  return `${user.value.hoLot || ""} ${user.value.tenDocGia || user.value.HoTenNV || ""}`.trim();
});

const roleLabel = computed(() => {
  if (user.value?.Chucvu === "admin") return "Quản trị viên";
  if (user.value?.Chucvu === "nhanvien") return "Nhân viên thư viện";
  return "Độc giả";
});

const isStaff = computed(() => Boolean(user.value?.MSNV));

onMounted(() => {
  const userStr = localStorage.getItem("user");
  if (userStr) {
    user.value = JSON.parse(userStr);
  } else {
    router.push("/dangnhap");
  }
});

const openEditModal = () => {
  editForm.value = {
    hoLot: user.value.hoLot || "",
    tenDocGia: user.value.tenDocGia || "",
    HoTenNV: user.value.HoTenNV || "",
    dienThoai: user.value.dienThoai || user.value.SoDienThoai || "",
    diaChi: user.value.diaChi || user.value.Diachi || "",
    ngaySinh: user.value.ngaySinh ? String(user.value.ngaySinh).slice(0, 10) : "",
  };
  showEditModal.value = true;
};

const saveProfile = async () => {
  isSaving.value = true;
  try {
    if (isStaff.value) {
      const payload = {
        HoTenNV: editForm.value.HoTenNV,
        SoDienThoai: editForm.value.dienThoai,
        Diachi: editForm.value.diaChi,
      };
      await axios.put(`http://localhost:3000/api/nhanvien/${user.value._id}`, payload);
      user.value = { ...user.value, ...payload };
    } else {
      const payload = {
        hoLot: editForm.value.hoLot,
        tenDocGia: editForm.value.tenDocGia,
        dienThoai: editForm.value.dienThoai,
        diaChi: editForm.value.diaChi,
        ngaySinh: editForm.value.ngaySinh || user.value.ngaySinh,
      };
      await axios.put(`http://localhost:3000/api/docgia/${user.value._id}`, payload);
      user.value = { ...user.value, ...payload };
    }

    localStorage.setItem("user", JSON.stringify(user.value));
    window.dispatchEvent(new Event("auth-updated"));
    showEditModal.value = false;
    toast.success("Cập nhật hồ sơ cá nhân thành công!");
  } catch (error) {
    console.error(error);
    toast.error(error.response?.data?.message || "Không thể cập nhật thông tin cá nhân.");
  } finally {
    isSaving.value = false;
  }
};

const handleLogout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("role");
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("token");
  localStorage.removeItem("cart");
  window.dispatchEvent(new Event("auth-updated"));
  window.dispatchEvent(new Event("cart-updated"));
  toast.info("Bạn đã đăng xuất.");
  router.push("/dangnhap");
};
</script>

<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-9 col-lg-7">
        <div class="minimal-card overflow-hidden">
          <div class="p-4 bg-white border-bottom d-flex justify-content-between align-items-center">
            <h4 class="mb-0 fw-bold text-navy">
              <i class="fas fa-id-card me-2"></i>Hồ Sơ Của Tôi
            </h4>
            <button @click="handleLogout" class="btn btn-outline-delete btn-sm">
              <i class="fas fa-sign-out-alt me-1"></i> Đăng xuất
            </button>
          </div>

          <div class="p-4 p-md-5">
            <div class="text-center mb-4">
              <img
                :src="`https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=1E3A8A&color=fff&size=128&bold=true`"
                class="rounded-circle border"
                width="104"
                height="104"
                alt="Avatar"
              />
              <h4 class="fw-bold mt-3 mb-1">{{ fullName }}</h4>
              <div class="d-flex justify-content-center gap-2 mt-2">
                <span class="status-badge status-borrowed">{{ roleLabel }}</span>
                <span class="status-badge status-neutral">
                  {{ user.maDocGia ? `Mã ĐG: ${user.maDocGia}` : `MSNV: ${user.MSNV || "---"}` }}
                </span>
              </div>
            </div>

            <h6 class="text-navy fw-semibold text-uppercase border-bottom pb-2 mb-3 small">
              Thông tin cá nhân
            </h6>

            <div class="row g-3">
              <div class="col-md-6">
                <div class="p-3 bg-light rounded border h-100">
                  <small class="text-muted fw-semibold d-block mb-1">Email</small>
                  <div class="fw-medium text-dark text-break">
                    {{ user.email || user.emailNV || "Chưa cập nhật" }}
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="p-3 bg-light rounded border h-100">
                  <small class="text-muted fw-semibold d-block mb-1">Số điện thoại</small>
                  <div class="fw-medium text-dark">
                    {{ user.dienThoai || user.SoDienThoai || "Chưa cập nhật" }}
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="p-3 bg-light rounded border h-100">
                  <small class="text-muted fw-semibold d-block mb-1">Ngày sinh</small>
                  <div class="fw-medium text-dark">
                    {{ formatDate(user.ngaySinh) }}
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="p-3 bg-light rounded border h-100">
                  <small class="text-muted fw-semibold d-block mb-1">Giới tính</small>
                  <div class="fw-medium text-dark">
                    {{ user.gioiTinh || user.phai || "Chưa cập nhật" }}
                  </div>
                </div>
              </div>
              <div class="col-12">
                <div class="p-3 bg-light rounded border h-100">
                  <small class="text-muted fw-semibold d-block mb-1">Địa chỉ</small>
                  <div class="fw-medium text-dark">
                    {{ user.diaChi || user.Diachi || "Chưa cập nhật địa chỉ" }}
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-4 pt-2 d-flex flex-wrap justify-content-center gap-3">
              <button class="btn btn-outline-orange px-4" @click="openEditModal">
                <i class="fas fa-edit me-1"></i> Cập nhật thông tin
              </button>
              <router-link to="/lich-su" class="btn btn-navy px-4">
                <i class="fas fa-history me-1"></i> Lịch sử mượn sách
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showEditModal" class="modal fade show d-block" style="background: rgba(15, 23, 42, 0.5)">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow-sm rounded-3 overflow-hidden">
          <div class="modal-header bg-white border-bottom">
            <h5 class="modal-title fw-bold text-navy">Cập nhật thông tin cá nhân</h5>
            <button type="button" class="btn-close" @click="showEditModal = false"></button>
          </div>
          <form @submit.prevent="saveProfile">
            <div class="modal-body p-4">
              <div v-if="isStaff" class="mb-3">
                <label class="form-label fw-semibold small">Họ tên nhân viên</label>
                <input type="text" class="form-control" v-model="editForm.HoTenNV" required />
              </div>
              <div v-else class="row g-3 mb-3">
                <div class="col-6">
                  <label class="form-label fw-semibold small">Họ lót</label>
                  <input type="text" class="form-control" v-model="editForm.hoLot" required />
                </div>
                <div class="col-6">
                  <label class="form-label fw-semibold small">Tên</label>
                  <input type="text" class="form-control" v-model="editForm.tenDocGia" required />
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label fw-semibold small">Số điện thoại</label>
                <input type="tel" class="form-control" v-model="editForm.dienThoai" />
              </div>

              <div class="mb-3" v-if="!isStaff">
                <label class="form-label fw-semibold small">Ngày sinh</label>
                <input type="date" class="form-control" v-model="editForm.ngaySinh" />
              </div>

              <div class="mb-2">
                <label class="form-label fw-semibold small">Địa chỉ</label>
                <input type="text" class="form-control" v-model="editForm.diaChi" />
              </div>
            </div>
            <div class="modal-footer bg-light">
              <button type="button" class="btn btn-subtle" @click="showEditModal = false">Hủy</button>
              <button type="submit" class="btn btn-navy" :disabled="isSaving">
                <i class="fas fa-save me-1"></i> {{ isSaving ? "Đang lưu..." : "Lưu thay đổi" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
