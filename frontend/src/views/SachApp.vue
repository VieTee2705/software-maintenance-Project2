<template>
  <div class="container py-4">
    <div class="page-header-card p-4 mb-4">
      <div class="row align-items-center gy-2">
        <div class="col-md-6">
          <h3 class="text-navy fw-bold mb-1">
            <i class="fas fa-book me-2"></i>Thư Viện Sách
          </h3>
          <p class="text-muted mb-0 small">
            Tìm kiếm, lọc theo nhà xuất bản và chọn sách bạn muốn mượn.
          </p>
        </div>
        <div class="col-md-6 text-md-end">
          <span class="status-badge status-borrowed">
            Hiển thị {{ filteredSachs.length }} / {{ sachs.length }} đầu sách
          </span>
        </div>
      </div>

      <div class="row g-3 mt-2">
        <div class="col-md-5">
          <label class="form-label small fw-semibold text-secondary mb-1">Tìm kiếm</label>
          <div class="input-group">
            <span class="input-group-text bg-light"><i class="fas fa-search text-muted"></i></span>
            <input
              type="text"
              class="form-control"
              placeholder="Tìm theo tên sách, tác giả hoặc mã sách..."
              v-model="searchText"
            />
          </div>
        </div>

        <div class="col-md-3">
          <label class="form-label small fw-semibold text-secondary mb-1">Nhà xuất bản</label>
          <select class="form-select" v-model="selectedPublisher">
            <option value="">Tất cả nhà xuất bản</option>
            <option v-for="nxb in publishers" :key="nxb._id" :value="nxb._id">
              {{ nxb.tenNXB }}
            </option>
          </select>
        </div>

        <div class="col-md-2">
          <label class="form-label small fw-semibold text-secondary mb-1">Tình trạng</label>
          <select class="form-select" v-model="stockFilter">
            <option value="all">Tất cả</option>
            <option value="available">Còn sách</option>
            <option value="out">Hết sách</option>
          </select>
        </div>

        <div class="col-md-2">
          <label class="form-label small fw-semibold text-secondary mb-1">Sắp xếp</label>
          <select class="form-select" v-model="sortBy">
            <option value="default">Mặc định</option>
            <option value="name-asc">Tên A → Z</option>
            <option value="price-asc">Giá tăng dần</option>
            <option value="price-desc">Giá giảm dần</option>
            <option value="year-desc">Năm XB mới nhất</option>
          </select>
        </div>
      </div>
    </div>

    <div v-if="isLoading" class="text-center py-5">
      <div class="spinner-border text-navy" role="status"></div>
      <p class="mt-2 text-muted small">Đang tải danh mục sách...</p>
    </div>

    <div v-else class="row g-4">
      <div class="col-lg-3 col-md-4 col-sm-6" v-for="sach in filteredSachs" :key="sach._id">
        <div class="card h-100 book-card" @click="xemChiTiet(sach._id)">
          <div class="img-container bg-light border-bottom">
            <img
              :src="getBookImageUrl(sach.HinhAnh)"
              class="card-img-top"
              :alt="sach.TenSach"
              @error="handleBookImageError"
            />
            <span
              class="position-absolute top-0 end-0 m-2 status-badge py-1 px-2"
              :class="sach.SoQuyen > 0 ? 'status-returned' : 'status-rejected'"
            >
              {{ sach.SoQuyen > 0 ? `Còn ${sach.SoQuyen}` : "Hết hàng" }}
            </span>
          </div>

          <div class="card-body d-flex flex-column">
            <div class="d-flex justify-content-between align-items-center mb-1">
              <small class="text-navy fw-medium text-truncate">
                {{ getPublisherName(sach) }}
              </small>
              <small v-if="sach.NamXuatBan" class="text-muted">{{ sach.NamXuatBan }}</small>
            </div>

            <h6 class="card-title text-dark fw-semibold text-truncate mb-1" :title="sach.TenSach">
              {{ sach.TenSach }}
            </h6>
            <small class="text-muted text-truncate mb-3">
              {{ sach.TacGia || "Chưa rõ tác giả" }}
            </small>

            <div class="mt-auto d-flex justify-content-between align-items-center pt-2 border-top">
              <span class="text-orange fw-bold">{{ formatCurrency(sach.DonGia) }}</span>
              <small class="text-muted">{{ sach.MaSach }}</small>
            </div>
          </div>

          <div class="card-footer bg-white border-top-0 pt-0 pb-3 px-3">
            <button class="btn btn-outline-navy btn-sm w-100">
              <i class="fas fa-eye me-1"></i> Xem chi tiết
            </button>
          </div>
        </div>
      </div>

      <div v-if="filteredSachs.length === 0" class="col-12">
        <div class="minimal-card text-center py-5">
          <i class="fas fa-book-open fa-3x text-muted mb-3 opacity-50"></i>
          <h6 class="text-muted">Không tìm thấy sách nào phù hợp</h6>
          <button class="btn btn-outline-navy btn-sm mt-2" @click="resetFilters">
            <i class="fas fa-undo me-1"></i> Đặt lại bộ lọc
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SachService from "@/services/sach.service";
import NhaXuatBanService from "@/services/nhaxuatban.service";
import {
  formatCurrency,
  getBookImageUrl,
  handleBookImageError,
  resolvePublisherName,
} from "@/utils/formatters";
import { toast } from "@/utils/toast";

export default {
  name: "BookList",
  data() {
    return {
      sachs: [],
      publishers: [],
      searchText: this.$route.query.q || "",
      selectedPublisher: "",
      stockFilter: "all",
      sortBy: "default",
      isLoading: true,
    };
  },
  watch: {
    "$route.query.q"(newQ) {
      this.searchText = newQ || "";
    },
  },
  computed: {
    filteredSachs() {
      let list = [...this.sachs];

      if (this.searchText) {
        const keyword = this.searchText.toLowerCase().trim();
        list = list.filter(
          (sach) =>
            (sach.TenSach || "").toLowerCase().includes(keyword) ||
            (sach.TacGia || "").toLowerCase().includes(keyword) ||
            (sach.MaSach || "").toLowerCase().includes(keyword)
        );
      }

      if (this.selectedPublisher) {
        const selectedNxb = this.publishers.find(
          (n) => n._id === this.selectedPublisher
        );
        list = list.filter(
          (sach) =>
            sach.MaNXB === this.selectedPublisher ||
            (selectedNxb && sach.MaNXB === selectedNxb.maNXB)
        );
      }

      if (this.stockFilter === "available") {
        list = list.filter((sach) => (sach.SoQuyen || 0) > 0);
      } else if (this.stockFilter === "out") {
        list = list.filter((sach) => (sach.SoQuyen || 0) <= 0);
      }

      if (this.sortBy === "name-asc") {
        list.sort((a, b) => (a.TenSach || "").localeCompare(b.TenSach || "", "vi"));
      } else if (this.sortBy === "price-asc") {
        list.sort((a, b) => (a.DonGia || 0) - (b.DonGia || 0));
      } else if (this.sortBy === "price-desc") {
        list.sort((a, b) => (b.DonGia || 0) - (a.DonGia || 0));
      } else if (this.sortBy === "year-desc") {
        list.sort((a, b) => (b.NamXuatBan || 0) - (a.NamXuatBan || 0));
      }

      return list;
    },
  },
  methods: {
    async retrieveSachs() {
      this.isLoading = true;
      try {
        const [sachData, nxbData] = await Promise.all([
          SachService.getAll(),
          NhaXuatBanService.getAll().catch(() => []),
        ]);
        this.sachs = sachData;
        this.publishers = nxbData;
      } catch (error) {
        console.log("Lỗi lấy danh sách sách: ", error);
        toast.error("Không thể tải danh sách sách từ máy chủ.");
      } finally {
        this.isLoading = false;
      }
    },
    getPublisherName(sach) {
      return resolvePublisherName(sach, this.publishers);
    },
    getBookImageUrl,
    handleBookImageError,
    formatCurrency,
    resetFilters() {
      this.searchText = "";
      this.selectedPublisher = "";
      this.stockFilter = "all";
      this.sortBy = "default";
      if (this.$route.query.q) {
        this.$router.replace({ path: "/sach" });
      }
    },
    xemChiTiet(bookId) {
      this.$router.push({ name: "chi-tiet-sach", params: { id: bookId } });
    },
  },
  mounted() {
    this.retrieveSachs();
  },
};
</script>

<style scoped>
.book-card {
  cursor: pointer;
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.book-card:hover {
  transform: translateY(-3px);
  border-color: #93c5fd;
}

.img-container {
  height: 230px;
  overflow: hidden;
  position: relative;
  border-radius: 9px 9px 0 0;
}

.card-img-top {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 10px;
  transition: transform 0.25s ease;
}

.book-card:hover .card-img-top {
  transform: scale(1.03);
}
</style>
