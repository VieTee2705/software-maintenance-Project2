<template>
  <div class="container py-4">
    <div class="page-header-card p-4 mb-4">
      <h3 class="text-navy fw-bold mb-1">
        <i class="fas fa-clipboard-check me-2"></i>Xác Nhận Yêu Cầu Mượn Sách
      </h3>
      <p class="text-muted mb-0 small">Kiểm tra danh sách sách và bổ sung ghi chú cho thủ thư.</p>
    </div>

    <div v-if="cart.length > 0" class="row g-4">
      <div class="col-lg-7">
        <div class="minimal-card overflow-hidden">
          <div class="p-3 bg-white border-bottom">
            <h6 class="mb-0 fw-semibold text-dark">Danh sách sách đã chọn</h6>
          </div>
          <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th class="ps-3">STT</th>
                  <th>Mã Sách</th>
                  <th>Tên Sách</th>
                  <th class="text-center">Số lượng</th>
                  <th class="text-center">Hành động</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(book, index) in cart" :key="book.MaSach || index">
                  <td class="ps-3 fw-semibold">{{ index + 1 }}</td>
                  <td><span class="badge bg-light text-dark border">{{ book.MaSach }}</span></td>
                  <td class="fw-semibold text-dark">{{ book.TenSach }}</td>
                  <td class="text-center fw-bold text-navy">{{ book.SoLuong || 1 }}</td>
                  <td class="text-center">
                    <button @click="removeFromCart(index)" class="btn btn-sm btn-outline-delete" title="Xóa">
                      <i class="fas fa-trash-alt"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
              <tfoot class="table-light">
                <tr :class="{ 'table-danger': isOverLimit }">
                  <td colspan="3" class="text-end fw-semibold">Tổng số lượng:</td>
                  <td class="text-center fw-bold">
                    {{ totalQuantity }} / {{ CONFIG.MAX_BOOKS_ALLOWED }}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <div v-if="isOverLimit" class="alert alert-danger mt-3 mb-0 small">
          <i class="fas fa-exclamation-triangle me-2"></i>
          Bạn đang chọn <strong>{{ totalQuantity }}</strong> cuốn. Chỉ được mượn tối đa
          <strong>{{ CONFIG.MAX_BOOKS_ALLOWED }}</strong> cuốn mỗi lần. Vui lòng bỏ bớt sách.
        </div>
      </div>

      <div class="col-lg-5">
        <div class="minimal-card p-4">
          <h6 class="fw-bold text-navy border-bottom pb-2 mb-3">
            <i class="fas fa-calendar-alt me-2"></i>Thông tin phiếu mượn
          </h6>

          <div class="mb-3">
            <label class="form-label fw-semibold small">Ngày yêu cầu</label>
            <input type="text" :value="formatDate(new Date())" disabled class="form-control bg-light" />
          </div>

          <div class="mb-3">
            <label class="form-label fw-semibold small">Ngày hẹn trả (Dự kiến)</label>
            <input type="date" v-model="ngayHenTra" disabled class="form-control bg-light" />
            <small class="text-muted">Mặc định là {{ CONFIG.DEFAULT_DAYS }} ngày sau ngày mượn.</small>
          </div>

          <div class="mb-3">
            <label class="form-label fw-semibold small">Ghi chú cho thủ thư</label>
            <textarea
              v-model="ghiChu"
              rows="3"
              class="form-control"
              placeholder="Ví dụ: Em sẽ đến lấy sách vào sáng thứ 2..."
            ></textarea>
          </div>

          <div v-if="serverMessage" :class="['alert small py-2', isError ? 'alert-danger' : 'alert-success']">
            {{ serverMessage }}
          </div>

          <button
            @click="submitRequest"
            :disabled="isLoading || isOverLimit"
            class="btn btn-navy btn-lg w-100"
          >
            <i class="fas fa-paper-plane me-2"></i>
            {{ isLoading ? "Đang xử lý..." : "Gửi Yêu Cầu" }}
          </button>
        </div>
      </div>
    </div>

    <div v-else class="minimal-card text-center py-5">
      <i class="fas fa-box-open fa-3x text-muted mb-3 opacity-50"></i>
      <p class="text-muted mb-3">Giỏ sách đang trống. Vui lòng chọn sách trước.</p>
      <router-link to="/sach" class="btn btn-navy">Quay lại danh mục sách</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { toast } from "@/utils/toast";

const CONFIG = {
  MAX_BOOKS_ALLOWED: 3,
  DEFAULT_DAYS: 7,
  API_URL: "http://localhost:3000/api/yeucaumuonsach",
  REDIRECT_DELAY: 1200,
};

const router = useRouter();

const cart = ref([]);
const ngayHenTra = ref("");
const ghiChu = ref("");
const isLoading = ref(false);
const serverMessage = ref("");
const isError = ref(false);

const totalQuantity = computed(() => {
  return cart.value.reduce((total, item) => {
    const qty = parseInt(item.SoLuong || 1);
    return total + qty;
  }, 0);
});

const isOverLimit = computed(() => {
  return totalQuantity.value > CONFIG.MAX_BOOKS_ALLOWED;
});

const getMaDocGia = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    return user ? user.maDocGia || null : null;
  } catch (e) {
    return null;
  }
};

const formatDate = (date) => new Date(date).toLocaleDateString("vi-VN");

const calculateDefaultReturnDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + CONFIG.DEFAULT_DAYS);
  return date.toISOString().split("T")[0];
};

const syncCartToStorage = () => {
  localStorage.setItem("cart", JSON.stringify(cart.value));
  window.dispatchEvent(new Event("cart-updated"));
};

const initializePage = () => {
  const storedCart = localStorage.getItem("cart");
  if (storedCart) {
    try {
      cart.value = JSON.parse(storedCart);
    } catch (e) {
      cart.value = [];
    }
  }
  ngayHenTra.value = calculateDefaultReturnDate();
};

const removeFromCart = (index) => {
  cart.value.splice(index, 1);
  syncCartToStorage();
  toast.info("Đã xóa sách khỏi danh sách mượn.");

  if (!isOverLimit.value && isError.value) {
    serverMessage.value = "";
    isError.value = false;
  }
};

const validateForm = (maDocGia) => {
  if (!maDocGia) {
    showError("Chỉ tài khoản độc giả đã đăng nhập mới có thể gửi yêu cầu mượn sách.");
    return false;
  }

  if (cart.value.length === 0) {
    showError("Giỏ sách trống.");
    return false;
  }

  if (isOverLimit.value) {
    showError(`Bạn chỉ được mượn tối đa ${CONFIG.MAX_BOOKS_ALLOWED} quyển sách mỗi lần.`);
    return false;
  }

  return true;
};

const preparePayload = (maDocGia) => {
  return {
    MaDocGia: maDocGia,
    DanhSachSach: cart.value.map((item) => ({
      MaSach: item.MaSach,
      TenSach: item.TenSach,
      SoLuong: parseInt(item.SoLuong || 1),
    })),
    NgayHenTra: ngayHenTra.value,
    GhiChu: ghiChu.value,
    TrangThai: "DangCho",
  };
};

const showError = (msg) => {
  isError.value = true;
  serverMessage.value = msg;
  toast.error(msg);
};

const showSuccess = (msg) => {
  isError.value = false;
  serverMessage.value = msg;
  toast.success(msg);
};

const submitRequest = async () => {
  serverMessage.value = "";
  isError.value = false;

  const maDocGia = getMaDocGia();
  if (!validateForm(maDocGia)) return;

  const payload = preparePayload(maDocGia);

  isLoading.value = true;
  try {
    await axios.post(CONFIG.API_URL, payload);

    showSuccess("Gửi yêu cầu mượn sách thành công!");
    localStorage.removeItem("cart");
    cart.value = [];
    window.dispatchEvent(new Event("cart-updated"));

    setTimeout(() => {
      router.push("/lich-su");
    }, CONFIG.REDIRECT_DELAY);
  } catch (error) {
    console.error(error);
    const msg = error.response?.data?.message || "Có lỗi xảy ra khi gửi yêu cầu.";
    showError(msg);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  initializePage();
});
</script>
