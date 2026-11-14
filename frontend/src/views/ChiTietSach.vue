<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import SachService from "@/services/sach.service";
import NhaXuatBanService from "@/services/nhaxuatban.service";
import {
  formatCurrency,
  getBookImageUrl,
  handleBookImageError,
  resolvePublisherName,
} from "@/utils/formatters";
import { toast } from "@/utils/toast";

const route = useRoute();
const router = useRouter();

const book = ref(null);
const quantity = ref(1);
const isLoading = ref(true);
const error = ref(null);

const MAX_BOOKS_ALLOWED = 3;

const getBook = async () => {
  try {
    const id = route.params.id;
    const data = await SachService.get(id);

    let publisherName = data.thongTinNXB?.tenNXB || "";
    if (!publisherName && data.MaNXB) {
      try {
        const nxbData = await NhaXuatBanService.get(data.MaNXB);
        publisherName = nxbData?.tenNXB || "";
      } catch {
        const allNxbs = await NhaXuatBanService.getAll().catch(() => []);
        publisherName = resolvePublisherName(data, allNxbs);
      }
    }

    book.value = {
      id: data._id,
      maSach: data.MaSach,
      tenSach: data.TenSach,
      gia: data.DonGia || 0,
      soLuongTon: data.SoQuyen || 0,
      namXuatBan: data.NamXuatBan || "Chưa cập nhật",
      nhaXuatBan: publisherName || "Đang cập nhật...",
      tacGia: data.TacGia || "Chưa cập nhật",
      moTa: data.MoTa || "Đang cập nhật mô tả nội dung cho đầu sách này...",
      anhChinh: getBookImageUrl(data.HinhAnh),
    };
  } catch (err) {
    console.log(err);
    error.value = "Không tìm thấy sách hoặc lỗi kết nối!";
    toast.error("Không thể tải thông tin chi tiết sách.");
  } finally {
    isLoading.value = false;
  }
};

const increaseQty = () => {
  const maxAllowed = Math.min(book.value?.soLuongTon || 1, MAX_BOOKS_ALLOWED);
  if (quantity.value >= maxAllowed) {
    toast.warning(`Chỉ có thể chọn tối đa ${maxAllowed} quyển.`);
    return;
  }
  quantity.value++;
};

const decreaseQty = () => {
  if (quantity.value > 1) quantity.value--;
};

const addToCart = () => {
  const userJson = localStorage.getItem("user");

  if (!userJson) {
    toast.warning("Vui lòng đăng nhập để thêm sách vào giỏ mượn.");
    router.push("/dangnhap");
    return;
  }

  let cart = [];
  try {
    const savedCart = localStorage.getItem("cart");
    cart = savedCart ? JSON.parse(savedCart) : [];
  } catch (e) {
    console.error("Lỗi đọc giỏ hàng", e);
    cart = [];
  }

  const currentTotal = cart.reduce((sum, item) => sum + (Number(item.SoLuong) || 1), 0);
  if (currentTotal + quantity.value > MAX_BOOKS_ALLOWED) {
    toast.warning(`Giỏ mượn tối đa ${MAX_BOOKS_ALLOWED} quyển (hiện có ${currentTotal} quyển).`);
    return;
  }

  const itemToAdd = {
    _id: book.value.id,
    MaSach: book.value.maSach,
    TenSach: book.value.tenSach,
    HinhAnh: book.value.anhChinh,
    TacGia: book.value.tacGia,
    DonGia: book.value.gia,
    SoQuyen: book.value.soLuongTon,
    SoLuong: quantity.value,
  };

  const existingItemIndex = cart.findIndex((item) => item._id === itemToAdd._id);

  if (existingItemIndex !== -1) {
    const nextQty = cart[existingItemIndex].SoLuong + quantity.value;
    if (nextQty > book.value.soLuongTon) {
      toast.warning(`Số lượng vượt quá tồn kho (${book.value.soLuongTon} quyển).`);
      return;
    }
    cart[existingItemIndex].SoLuong = nextQty;
  } else {
    cart.push(itemToAdd);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  window.dispatchEvent(new Event("cart-updated"));

  toast.success(`Đã thêm ${quantity.value} quyển "${book.value.tenSach}" vào giỏ mượn.`);
};

onMounted(() => {
  getBook();
});
</script>

<template>
  <div class="container py-4">
    <div v-if="isLoading" class="text-center py-5">
      <div class="spinner-border text-navy" role="status"></div>
      <p class="mt-2 text-muted small">Đang tải thông tin sách...</p>
    </div>

    <div v-else-if="error" class="minimal-card p-4 text-center">
      <div class="text-danger fw-semibold mb-2">
        <i class="fas fa-exclamation-triangle me-2"></i>{{ error }}
      </div>
      <router-link to="/sach" class="btn btn-subtle btn-sm mt-2">
        <i class="fas fa-arrow-left me-1"></i> Quay lại danh sách
      </router-link>
    </div>

    <div v-else-if="book" class="minimal-card p-4">
      <nav aria-label="breadcrumb" class="mb-4 pb-2 border-bottom">
        <ol class="breadcrumb mb-0 small">
          <li class="breadcrumb-item"><router-link to="/" class="text-navy text-decoration-none">Trang chủ</router-link></li>
          <li class="breadcrumb-item"><router-link to="/sach" class="text-navy text-decoration-none">Danh mục sách</router-link></li>
          <li class="breadcrumb-item active text-truncate" style="max-width: 300px;">{{ book.tenSach }}</li>
        </ol>
      </nav>

      <div class="row g-4 align-items-start">
        <div class="col-md-5">
          <div class="border rounded-3 overflow-hidden bg-light p-3 text-center">
            <img
              :src="book.anhChinh"
              class="img-fluid rounded object-fit-contain"
              style="max-height: 420px;"
              :alt="book.tenSach"
              @error="handleBookImageError"
            />
          </div>
        </div>

        <div class="col-md-7 ps-md-4">
          <div class="d-flex flex-wrap gap-2 mb-2">
            <span class="status-badge status-neutral">Mã: {{ book.maSach }}</span>
            <span
              class="status-badge"
              :class="book.soLuongTon > 0 ? 'status-returned' : 'status-rejected'"
            >
              {{ book.soLuongTon > 0 ? `Còn ${book.soLuongTon} quyển` : "Tạm hết hàng" }}
            </span>
          </div>

          <h2 class="fw-bold text-dark mb-3">{{ book.tenSach }}</h2>

          <div class="row g-2 mb-3">
            <div class="col-sm-6">
              <div class="p-3 bg-light rounded border">
                <small class="text-muted d-block">Tác giả</small>
                <span class="fw-semibold text-dark">{{ book.tacGia }}</span>
              </div>
            </div>
            <div class="col-sm-6">
              <div class="p-3 bg-light rounded border">
                <small class="text-muted d-block">Nhà xuất bản</small>
                <span class="fw-semibold text-dark">{{ book.nhaXuatBan }}</span>
              </div>
            </div>
            <div class="col-sm-6">
              <div class="p-3 bg-light rounded border">
                <small class="text-muted d-block">Năm xuất bản</small>
                <span class="fw-semibold text-dark">{{ book.namXuatBan }}</span>
              </div>
            </div>
            <div class="col-sm-6">
              <div class="p-3 bg-light rounded border">
                <small class="text-muted d-block">Đơn giá tham khảo</small>
                <span class="fw-bold text-orange fs-5">{{ formatCurrency(book.gia) }}</span>
              </div>
            </div>
          </div>

          <div class="mb-4 p-3 bg-light rounded border">
            <h6 class="fw-semibold text-dark mb-1 small text-uppercase">Giới thiệu nội dung</h6>
            <p class="mb-0 text-muted small" style="white-space: pre-line;">{{ book.moTa }}</p>
          </div>

          <div class="d-flex flex-wrap align-items-center gap-3">
            <div class="input-group" style="width: 135px;">
              <button class="btn btn-subtle" type="button" @click="decreaseQty">
                <i class="fas fa-minus"></i>
              </button>
              <input type="text" class="form-control text-center bg-white fw-semibold" :value="quantity" readonly />
              <button class="btn btn-subtle" type="button" @click="increaseQty">
                <i class="fas fa-plus"></i>
              </button>
            </div>
            <button
              class="btn btn-navy btn-lg flex-grow-1"
              @click="addToCart"
              :disabled="book.soLuongTon <= 0"
            >
              <i class="fas fa-cart-plus me-2"></i>
              {{ book.soLuongTon > 0 ? "Thêm vào giỏ mượn" : "Tạm hết hàng" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
