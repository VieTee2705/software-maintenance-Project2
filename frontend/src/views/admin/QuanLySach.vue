<script setup>
import { ref, computed, onMounted } from "vue";
import SachService from "@/services/sach.service";
import NhaXuatBanService from "@/services/nhaxuatban.service";
import { useRouter } from "vue-router";
import axios from "axios";
import {
  formatCurrency,
  getBookImageUrl,
  handleBookImageError,
  resolvePublisherName,
} from "@/utils/formatters";
import { toast } from "@/utils/toast";

const router = useRouter();
const books = ref([]);
const publishers = ref([]);
const searchText = ref("");
const selectedPublisher = ref("");
const stockFilter = ref("all");
const sortBy = ref("default");
const isLoading = ref(true);

const retrieveBooks = async () => {
  isLoading.value = true;
  try {
    const [sachData, nxbData] = await Promise.all([
      SachService.getAll(),
      NhaXuatBanService.getAll().catch(() => []),
    ]);
    books.value = sachData;
    publishers.value = nxbData;
  } catch (error) {
    console.error("Lỗi lấy danh sách sách:", error);
    toast.error("Không thể tải danh sách sách.");
  } finally {
    isLoading.value = false;
  }
};

const totalCopies = computed(() =>
  books.value.reduce((sum, b) => sum + (Number(b.SoQuyen) || 0), 0)
);

const outOfStockCount = computed(() =>
  books.value.filter((b) => (Number(b.SoQuyen) || 0) <= 0).length
);

const filteredBooks = computed(() => {
  let list = [...books.value];

  if (searchText.value) {
    const text = searchText.value.toLowerCase().trim();
    list = list.filter(
      (book) =>
        (book.TenSach || "").toLowerCase().includes(text) ||
        (book.MaSach || "").toLowerCase().includes(text) ||
        (book.TacGia || "").toLowerCase().includes(text)
    );
  }

  if (selectedPublisher.value) {
    const nxbObj = publishers.value.find((n) => n._id === selectedPublisher.value);
    list = list.filter(
      (book) =>
        book.MaNXB === selectedPublisher.value ||
        (nxbObj && book.MaNXB === nxbObj.maNXB)
    );
  }

  if (stockFilter.value === "available") {
    list = list.filter((b) => (b.SoQuyen || 0) > 0);
  } else if (stockFilter.value === "out") {
    list = list.filter((b) => (b.SoQuyen || 0) <= 0);
  }

  if (sortBy.value === "name-asc") {
    list.sort((a, b) => (a.TenSach || "").localeCompare(b.TenSach || "", "vi"));
  } else if (sortBy.value === "stock-asc") {
    list.sort((a, b) => (a.SoQuyen || 0) - (b.SoQuyen || 0));
  } else if (sortBy.value === "price-desc") {
    list.sort((a, b) => (b.DonGia || 0) - (a.DonGia || 0));
  }

  return list;
});

const deleteBook = async (id, tenSach) => {
  if (confirm(`Bạn có chắc chắn muốn xóa sách "${tenSach}" không?`)) {
    try {
      await axios.delete(`http://localhost:3000/api/sach/${id}`);
      toast.success(`Đã xóa sách "${tenSach}".`);
      retrieveBooks();
    } catch (error) {
      console.error(error);
      toast.error("Xóa sách thất bại.");
    }
  }
};

const xemBook = (id) => {
  router.push(`/sach/${id}`);
};

const suaBook = (id) => {
  router.push(`/sach/sua/${id}`);
};

const resetFilters = () => {
  searchText.value = "";
  selectedPublisher.value = "";
  stockFilter.value = "all";
  sortBy.value = "default";
};

onMounted(() => {
  retrieveBooks();
});
</script>

<template>
  <div class="container py-4">
    <div class="page-header-card p-4 mb-4">
      <div class="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
        <div>
          <h3 class="fw-bold text-navy mb-1">
            <i class="fas fa-book me-2"></i>Quản Lý Đầu Sách
          </h3>
          <p class="text-muted mb-0 small">Theo dõi tồn kho, nhà xuất bản và cập nhật thông tin sách.</p>
        </div>
        <router-link to="/sach/them" class="btn btn-navy btn-sm">
          <i class="fas fa-plus me-1"></i> Thêm Sách Mới
        </router-link>
      </div>

      <div class="row g-3 mb-3">
        <div class="col-md-4">
          <div class="p-3 rounded bg-light border">
            <small class="d-block text-muted">Tổng đầu sách</small>
            <span class="fs-4 fw-bold text-navy">{{ books.length }}</span>
          </div>
        </div>
        <div class="col-md-4">
          <div class="p-3 rounded bg-light border">
            <small class="d-block text-muted">Tổng số quyển trong kho</small>
            <span class="fs-4 fw-bold" style="color: #15803d;">{{ totalCopies }}</span>
          </div>
        </div>
        <div class="col-md-4">
          <div class="p-3 rounded bg-light border">
            <small class="d-block text-muted">Đầu sách hết hàng</small>
            <span class="fs-4 fw-bold" style="color: #b91c1c;">{{ outOfStockCount }}</span>
          </div>
        </div>
      </div>

      <div class="row g-3">
        <div class="col-md-5">
          <div class="input-group">
            <span class="input-group-text bg-light"><i class="fas fa-search text-muted"></i></span>
            <input
              type="text"
              class="form-control"
              placeholder="Tìm theo tên sách, mã sách hoặc tác giả..."
              v-model="searchText"
            />
          </div>
        </div>
        <div class="col-md-3">
          <select class="form-select" v-model="selectedPublisher">
            <option value="">Tất cả nhà xuất bản</option>
            <option v-for="nxb in publishers" :key="nxb._id" :value="nxb._id">
              {{ nxb.tenNXB }}
            </option>
          </select>
        </div>
        <div class="col-md-2">
          <select class="form-select" v-model="stockFilter">
            <option value="all">Tất cả kho</option>
            <option value="available">Còn hàng</option>
            <option value="out">Hết hàng</option>
          </select>
        </div>
        <div class="col-md-2">
          <select class="form-select" v-model="sortBy">
            <option value="default">Mặc định</option>
            <option value="name-asc">Tên A → Z</option>
            <option value="stock-asc">Tồn kho thấp nhất</option>
            <option value="price-desc">Giá cao nhất</option>
          </select>
        </div>
      </div>
    </div>

    <div class="minimal-card overflow-hidden">
      <div v-if="isLoading" class="text-center py-5">
        <div class="spinner-border text-navy" role="status"></div>
      </div>

      <div v-else class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead>
            <tr>
              <th class="ps-4">Sách</th>
              <th>Mã Sách</th>
              <th>Nhà Xuất Bản</th>
              <th>Giá bán</th>
              <th>Kho</th>
              <th>Năm XB</th>
              <th class="text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="book in filteredBooks" :key="book._id">
              <td class="ps-4">
                <div class="d-flex align-items-center">
                  <img
                    :src="getBookImageUrl(book.HinhAnh)"
                    class="rounded border me-3 object-fit-cover"
                    width="44"
                    height="62"
                    :alt="book.TenSach"
                    @error="handleBookImageError"
                  />
                  <div>
                    <div class="fw-semibold text-dark">{{ book.TenSach }}</div>
                    <small class="text-muted">{{ book.TacGia || "Chưa rõ tác giả" }}</small>
                  </div>
                </div>
              </td>
              <td><span class="status-badge status-neutral">{{ book.MaSach }}</span></td>
              <td class="text-dark small fw-medium">
                {{ resolvePublisherName(book, publishers) }}
              </td>
              <td class="fw-semibold text-orange">{{ formatCurrency(book.DonGia) }}</td>
              <td>
                <span
                  class="status-badge"
                  :class="book.SoQuyen > 0 ? 'status-returned' : 'status-rejected'"
                >
                  {{ book.SoQuyen > 0 ? `${book.SoQuyen} quyển` : "Hết hàng" }}
                </span>
              </td>
              <td class="text-muted">{{ book.NamXuatBan || "---" }}</td>
              <td class="text-center">
                <div class="d-inline-flex gap-1">
                  <button
                    class="btn btn-sm btn-subtle"
                    @click="xemBook(book._id)"
                    title="Xem chi tiết"
                  >
                    <i class="fas fa-eye"></i>
                  </button>
                  <button
                    class="btn btn-sm btn-outline-orange"
                    @click="suaBook(book._id)"
                    title="Chỉnh sửa sách"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  <button
                    class="btn btn-sm btn-outline-delete"
                    @click="deleteBook(book._id, book.TenSach)"
                    title="Xóa sách"
                  >
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredBooks.length === 0">
              <td colspan="7" class="text-center py-5 text-muted">
                <i class="fas fa-inbox fa-2x mb-2 d-block opacity-50"></i>
                Không tìm thấy sách nào phù hợp.
                <div class="mt-2">
                  <button class="btn btn-sm btn-outline-navy" @click="resetFilters">Đặt lại bộ lọc</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="bg-white border-top py-3 px-4 d-flex justify-content-between align-items-center">
        <small class="text-muted">Đang hiển thị {{ filteredBooks.length }} / {{ books.length }} đầu sách</small>
      </div>
    </div>
  </div>
</template>

<style scoped>
.object-fit-cover {
  object-fit: cover;
}
</style>
