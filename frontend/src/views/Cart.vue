<template>
  <div class="container py-4">
    <div class="page-header-card p-4 mb-4 d-flex flex-wrap justify-content-between align-items-center gap-3">
      <div>
        <h3 class="text-navy fw-bold mb-1">
          <i class="fas fa-shopping-bag me-2"></i>Xác Nhận Mượn Sách
        </h3>
        <p class="text-muted mb-0 small">
          Kiểm tra lại danh sách sách và thông tin độc giả trước khi gửi yêu cầu mượn.
        </p>
      </div>
      <router-link to="/sach" class="btn btn-outline-navy btn-sm">
        <i class="fas fa-plus me-1"></i> Chọn thêm sách
      </router-link>
    </div>

    <div v-if="cartItems.length > 0" class="row g-4">
      <div class="col-lg-8">
        <div class="minimal-card overflow-hidden">
          <div class="p-3 bg-white border-bottom d-flex justify-content-between align-items-center">
            <h6 class="mb-0 fw-semibold text-dark">Danh sách sách trong giỏ</h6>
            <span class="status-badge status-borrowed">
              Tổng: {{ totalQuantity }} / {{ MAX_BOOKS_ALLOWED }} quyển
            </span>
          </div>

          <div class="table-responsive">
            <table class="table table-hover align-middle mb-0 bg-white">
              <thead>
                <tr>
                  <th class="py-3 ps-4">Sách</th>
                  <th class="py-3">Mã Sách</th>
                  <th class="py-3 text-center" style="width: 150px;">Số lượng</th>
                  <th class="py-3 text-center" style="width: 90px;">Xóa</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in cartItems" :key="index">
                  <td class="ps-4">
                    <div class="d-flex align-items-center gap-3">
                      <img
                        :src="getBookImageUrl(item.HinhAnh)"
                        class="rounded border flex-shrink-0"
                        width="48"
                        height="66"
                        style="object-fit: cover;"
                        :alt="item.TenSach"
                        @error="handleBookImageError"
                      />
                      <div>
                        <div class="fw-semibold text-dark">{{ item.TenSach }}</div>
                        <small class="text-muted d-block">{{ item.TacGia || "Chưa rõ tác giả" }}</small>
                        <small class="text-orange fw-semibold">{{ formatCurrency(item.DonGia) }}</small>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span class="badge bg-light text-secondary border">{{ item.MaSach }}</span>
                  </td>

                  <td>
                    <div class="d-flex justify-content-center align-items-center">
                      <div class="input-group input-group-sm" style="width: 112px;">
                        <button class="btn btn-subtle" type="button" @click="decreaseQty(index)">
                          <i class="fas fa-minus"></i>
                        </button>
                        <input
                          type="text"
                          class="form-control text-center fw-semibold text-navy bg-white"
                          :value="item.SoLuong || 1"
                          readonly
                        />
                        <button class="btn btn-subtle" type="button" @click="increaseQty(index)">
                          <i class="fas fa-plus"></i>
                        </button>
                      </div>
                    </div>
                  </td>

                  <td class="text-center">
                    <button
                      class="btn btn-sm btn-outline-delete"
                      @click="removeItem(index)"
                      title="Xóa khỏi giỏ"
                    >
                      <i class="fas fa-trash-alt"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="col-lg-4">
        <div class="minimal-card p-4">
          <h6 class="mb-3 fw-bold text-navy border-bottom pb-2">
            <i class="fas fa-user-check me-2"></i>Thông Tin Người Mượn
          </h6>

          <div class="mb-3">
            <small class="text-muted d-block">Họ và tên</small>
            <div class="fw-semibold text-dark">
              {{ `${currentUser.hoLot || ""} ${currentUser.tenDocGia || currentUser.HoTenNV || ""}`.trim() || "Chưa cập nhật" }}
            </div>
          </div>

          <div class="mb-3">
            <small class="text-muted d-block">Mã độc giả / Mã định danh</small>
            <span class="status-badge status-neutral mt-1">
              {{ currentUser.maDocGia || currentUser.MSNV || "Chưa có mã" }}
            </span>
          </div>

          <div class="mb-3" v-if="currentUser.email">
            <small class="text-muted d-block">Email</small>
            <div class="small fw-medium">{{ currentUser.email }}</div>
          </div>

          <div class="mb-3" v-if="currentUser.dienThoai || currentUser.SoDienThoai">
            <small class="text-muted d-block">Điện thoại</small>
            <div class="small fw-medium">{{ currentUser.dienThoai || currentUser.SoDienThoai }}</div>
          </div>

          <div class="p-3 bg-light rounded-2 mb-4 border">
            <div class="d-flex justify-content-between small mb-1">
              <span class="text-muted">Ngày hẹn trả dự kiến:</span>
              <span class="fw-semibold text-dark">{{ expectedReturnDate }}</span>
            </div>
            <div class="d-flex justify-content-between small">
              <span class="text-muted">Tổng số lượng mượn:</span>
              <span class="fw-bold text-navy">{{ totalQuantity }} quyển</span>
            </div>
          </div>

          <button class="btn btn-navy btn-lg w-100" :disabled="isSubmitting" @click="submitRequest">
            <i class="fas fa-paper-plane me-2"></i>
            {{ isSubmitting ? "Đang gửi..." : "Gửi Yêu Cầu Mượn" }}
          </button>
        </div>
      </div>
    </div>

    <div v-else class="minimal-card text-center py-5">
      <i class="fas fa-shopping-basket fa-3x text-muted mb-3 opacity-50"></i>
      <h5 class="text-dark fw-semibold">Giỏ mượn sách của bạn đang trống</h5>
      <p class="text-muted small mb-4">Hãy khám phá thư viện để chọn những cuốn sách yêu thích.</p>
      <router-link to="/sach" class="btn btn-navy px-4">
        <i class="fas fa-book me-2"></i>Đi chọn sách
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { formatCurrency, formatDate, getBookImageUrl, handleBookImageError } from "@/utils/formatters";
import { toast } from "@/utils/toast";

const MAX_BOOKS_ALLOWED = 3;
const API_URL = "http://localhost:3000/api/yeucaumuonsach";

const cartItems = ref([]);
const currentUser = ref({});
const isSubmitting = ref(false);
const router = useRouter();

const totalQuantity = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + (Number(item.SoLuong) || 1), 0);
});

const expectedReturnDate = computed(() => {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return formatDate(date);
});

const updateCartStorage = () => {
  localStorage.setItem("cart", JSON.stringify(cartItems.value));
  window.dispatchEvent(new Event("cart-updated"));
};

onMounted(() => {
  const storedCart = localStorage.getItem("cart");
  if (storedCart) {
    cartItems.value = JSON.parse(storedCart);
  }

  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    currentUser.value = JSON.parse(storedUser);
  } else {
    toast.warning("Vui lòng đăng nhập để mượn sách!");
    router.push("/dangnhap");
  }
});

const increaseQty = (index) => {
  if (!cartItems.value[index].SoLuong) {
    cartItems.value[index].SoLuong = 1;
  }

  if (totalQuantity.value >= MAX_BOOKS_ALLOWED) {
    toast.warning(`Bạn chỉ được mượn tối đa ${MAX_BOOKS_ALLOWED} quyển sách mỗi lần!`);
    return;
  }

  const stock = cartItems.value[index].SoQuyen;
  if (typeof stock === "number" && cartItems.value[index].SoLuong >= stock) {
    toast.warning(`Sách "${cartItems.value[index].TenSach}" chỉ còn ${stock} quyển trong kho.`);
    return;
  }

  cartItems.value[index].SoLuong++;
  updateCartStorage();
};

const decreaseQty = (index) => {
  if (cartItems.value[index].SoLuong > 1) {
    cartItems.value[index].SoLuong--;
    updateCartStorage();
  } else {
    removeItem(index);
  }
};

const removeItem = (index) => {
  const removed = cartItems.value[index];
  cartItems.value.splice(index, 1);
  updateCartStorage();
  toast.info(`Đã xóa "${removed?.TenSach || "sách"}" khỏi giỏ mượn.`);
};

const submitRequest = async () => {
  if (cartItems.value.length === 0) {
    toast.warning("Giỏ hàng đang trống!");
    return;
  }

  if (!currentUser.value.maDocGia) {
    toast.error("Chỉ tài khoản độc giả mới có thể gửi yêu cầu mượn sách.");
    return;
  }

  if (totalQuantity.value > MAX_BOOKS_ALLOWED) {
    toast.error(`Tổng số lượng sách là ${totalQuantity.value}. Bạn chỉ được mượn tối đa ${MAX_BOOKS_ALLOWED} quyển.`);
    return;
  }

  isSubmitting.value = true;
  try {
    const payload = {
      MaDocGia: currentUser.value.maDocGia || currentUser.value._id,
      DanhSachSach: cartItems.value.map((book) => ({
        MaSach: book.MaSach,
        TenSach: book.TenSach,
        SoLuong: Number(book.SoLuong || 1),
      })),
      NgayHenTra: new Date(new Date().setDate(new Date().getDate() + 7)),
      TrangThai: "DangCho",
    };

    await axios.post(API_URL, payload);

    toast.success("Gửi yêu cầu mượn sách thành công!");

    localStorage.removeItem("cart");
    cartItems.value = [];
    window.dispatchEvent(new Event("cart-updated"));
    router.push("/lich-su");
  } catch (error) {
    console.error(error);
    const msg = error.response?.data?.message || "Lỗi khi gửi yêu cầu mượn sách!";
    toast.error(msg);
  } finally {
    isSubmitting.value = false;
  }
};
</script>
