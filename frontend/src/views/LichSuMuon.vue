<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import {
  formatCurrency,
  formatDate,
  formatDateTime,
  getBookImageUrl,
  handleBookImageError,
  getBorrowStatusInfo,
  isOverdueBorrow,
} from "@/utils/formatters";
import { toast } from "@/utils/toast";

const router = useRouter();
const requests = ref([]);
const isLoading = ref(true);
const currentUser = ref(null);
const searchText = ref("");
const statusFilter = ref("ALL");

const getImageUrl = (bookDetail) => {
  if (bookDetail.ThongTinSach && bookDetail.ThongTinSach.HinhAnh) {
    return getBookImageUrl(bookDetail.ThongTinSach.HinhAnh);
  }
  return getBookImageUrl("");
};

const getTotalBooks = (req) => {
  return (req.DanhSachSach || []).reduce((sum, item) => sum + (Number(item.SoLuong) || 1), 0);
};

const statusCounts = computed(() => {
  const counts = { DangCho: 0, DaDuyet: 0, DaTra: 0, TuChoi: 0 };
  for (const r of requests.value) {
    if (r.TrangThai === "ChoDuyet" || r.TrangThai === "DangCho") counts.DangCho++;
    else if (counts[r.TrangThai] !== undefined) counts[r.TrangThai]++;
  }
  return counts;
});

const filteredRequests = computed(() => {
  return requests.value.filter((req) => {
    const matchStatus =
      statusFilter.value === "ALL" ||
      req.TrangThai === statusFilter.value ||
      (statusFilter.value === "DangCho" && req.TrangThai === "ChoDuyet");
    if (!matchStatus) return false;

    if (!searchText.value.trim()) return true;
    const kw = searchText.value.toLowerCase().trim();
    return (req.DanhSachSach || []).some(
      (item) =>
        (item.ThongTinSach?.TenSach || item.TenSach || "").toLowerCase().includes(kw) ||
        (item.MaSach || "").toLowerCase().includes(kw)
    );
  });
});

const fetchHistory = async (showNotice = false) => {
  const userStr = localStorage.getItem("user");
  if (!userStr) {
    router.push("/dangnhap");
    return;
  }

  currentUser.value = JSON.parse(userStr);
  const maDocGia = currentUser.value.maDocGia || currentUser.value._id;

  if (!maDocGia) {
    toast.warning("Tài khoản hiện tại không có mã độc giả để tra cứu lịch sử mượn.");
    isLoading.value = false;
    return;
  }

  isLoading.value = true;
  try {
    const response = await axios.get(
      `http://localhost:3000/api/yeucaumuonsach/history/${maDocGia}`
    );
    requests.value = response.data;
    if (showNotice) {
      toast.info("Đã cập nhật lại trạng thái lịch sử mượn sách.");
    }
  } catch (error) {
    console.error("Lỗi tải lịch sử:", error);
    toast.error("Không thể tải lịch sử mượn sách từ máy chủ.");
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchHistory(false);
});
</script>

<template>
  <div class="container py-4">
    <div class="page-header-card p-4 mb-4">
      <div class="row align-items-center gy-3 mb-3">
        <div class="col-md-6">
          <h3 class="mb-1 fw-bold text-navy">
            <i class="fas fa-history me-2"></i>Lịch Sử &amp; Trạng Thái Mượn Sách
          </h3>
          <p class="text-muted mb-0 small">
            Theo dõi tiến trình duyệt phiếu, thời gian mượn và hạn trả sách của bạn.
          </p>
        </div>
        <div class="col-md-6 text-md-end d-flex justify-content-md-end gap-2">
          <button class="btn btn-subtle btn-sm" @click="fetchHistory(true)">
            <i class="fas fa-sync-alt me-1"></i> Cập nhật
          </button>
          <router-link to="/sach" class="btn btn-navy btn-sm">
            <i class="fas fa-book me-1"></i> Mượn thêm sách
          </router-link>
        </div>
      </div>

      <div class="row g-2 mb-3">
        <div class="col-6 col-md-3">
          <div class="p-3 rounded-2 bg-light border">
            <small class="text-muted d-block">Chờ duyệt</small>
            <span class="fs-5 fw-bold text-orange">{{ statusCounts.DangCho }}</span>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="p-3 rounded-2 bg-light border">
            <small class="text-muted d-block">Đang mượn</small>
            <span class="fs-5 fw-bold text-navy">{{ statusCounts.DaDuyet }}</span>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="p-3 rounded-2 bg-light border">
            <small class="text-muted d-block">Đã trả</small>
            <span class="fs-5 fw-bold" style="color: #15803d;">{{ statusCounts.DaTra }}</span>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="p-3 rounded-2 bg-light border">
            <small class="text-muted d-block">Từ chối</small>
            <span class="fs-5 fw-bold" style="color: #b91c1c;">{{ statusCounts.TuChoi }}</span>
          </div>
        </div>
      </div>

      <div class="row g-3">
        <div class="col-md-7">
          <div class="input-group">
            <span class="input-group-text bg-light"><i class="fas fa-search text-muted"></i></span>
            <input
              type="text"
              class="form-control"
              placeholder="Tìm kiếm theo tên sách hoặc mã sách trong lịch sử..."
              v-model="searchText"
            />
          </div>
        </div>
        <div class="col-md-5">
          <select class="form-select" v-model="statusFilter">
            <option value="ALL">Tất cả trạng thái ({{ requests.length }})</option>
            <option value="DangCho">Đang chờ duyệt ({{ statusCounts.DangCho }})</option>
            <option value="DaDuyet">Đang mượn ({{ statusCounts.DaDuyet }})</option>
            <option value="DaTra">Đã trả ({{ statusCounts.DaTra }})</option>
            <option value="TuChoi">Từ chối ({{ statusCounts.TuChoi }})</option>
          </select>
        </div>
      </div>
    </div>

    <div v-if="isLoading" class="text-center py-5">
      <div class="spinner-border text-navy" role="status"></div>
      <p class="mt-2 text-muted small">Đang tải dữ liệu...</p>
    </div>

    <div v-else-if="requests.length === 0" class="minimal-card text-center py-5">
      <i class="fas fa-box-open fs-1 text-muted mb-3 opacity-50"></i>
      <h6 class="fw-semibold">Bạn chưa có lịch sử mượn sách nào.</h6>
      <router-link to="/sach" class="btn btn-navy btn-sm mt-3">Mượn sách ngay</router-link>
    </div>

    <div v-else-if="filteredRequests.length === 0" class="minimal-card text-center py-5">
      <i class="fas fa-filter fs-2 text-muted mb-2 opacity-50"></i>
      <p class="text-muted mb-0">Không có phiếu mượn nào khớp bộ lọc hiện tại.</p>
    </div>

    <div v-else>
      <div v-for="(req, index) in filteredRequests" :key="req._id" class="minimal-card mb-4 overflow-hidden">
        <div class="p-3 bg-white border-bottom d-flex flex-wrap justify-content-between align-items-center gap-2">
          <div>
            <div class="fw-bold text-dark">
              <i class="fas fa-file-alt text-navy me-2"></i>Phiếu mượn #{{ filteredRequests.length - index }}
            </div>
            <div class="small text-muted mt-1">
              <span><i class="far fa-clock me-1"></i>Ngày tạo: {{ formatDateTime(req.NgayYeuCau) }}</span>
              <span v-if="req.NgayHenTra" class="ms-3">
                <i class="far fa-calendar-check me-1"></i>Hẹn trả:
                <strong :class="isOverdueBorrow(req) ? 'text-danger' : 'text-dark'">
                  {{ formatDate(req.NgayHenTra) }}
                </strong>
              </span>
            </div>
          </div>
          <span :class="getBorrowStatusInfo(req.TrangThai, req).badgeClass">
            <i :class="getBorrowStatusInfo(req.TrangThai, req).icon"></i>
            {{ getBorrowStatusInfo(req.TrangThai, req).text }}
          </span>
        </div>

        <div class="px-3 py-2 bg-light border-bottom d-flex flex-wrap justify-content-between align-items-center gap-2 small">
          <span class="text-muted">
            <i class="fas fa-info-circle me-1 text-navy"></i>
            {{ getBorrowStatusInfo(req.TrangThai, req).description }}
          </span>
          <div class="d-flex align-items-center gap-2" v-if="req.TrangThai !== 'TuChoi'">
            <span :class="getBorrowStatusInfo(req.TrangThai, req).step >= 1 ? 'text-navy fw-semibold' : 'text-muted'">
              1. Chờ duyệt
            </span>
            <span class="text-muted">→</span>
            <span :class="getBorrowStatusInfo(req.TrangThai, req).step >= 2 ? 'text-navy fw-semibold' : 'text-muted'">
              2. Đang mượn
            </span>
            <span class="text-muted">→</span>
            <span :class="getBorrowStatusInfo(req.TrangThai, req).step >= 3 ? 'text-success fw-semibold' : 'text-muted'">
              3. Đã trả
            </span>
          </div>
        </div>

        <div class="p-0">
          <div class="table-responsive">
            <table class="table mb-0 align-middle">
              <thead>
                <tr>
                  <th class="ps-4">Sách</th>
                  <th class="text-center">Số lượng</th>
                  <th class="text-end pe-4">Đơn giá</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, idx) in req.DanhSachSach" :key="idx">
                  <td class="ps-4">
                    <div class="d-flex align-items-center">
                      <img
                        :src="getImageUrl(item)"
                        class="rounded border me-3 object-fit-cover"
                        width="48"
                        height="66"
                        alt="Book cover"
                        @error="handleBookImageError"
                      />
                      <div>
                        <div class="fw-semibold text-dark">
                          {{ item.ThongTinSach?.TenSach || item.TenSach || "Sách không tồn tại" }}
                        </div>
                        <small class="text-muted d-block" v-if="item.ThongTinSach?.TacGia">
                          Tác giả: {{ item.ThongTinSach.TacGia }}
                        </small>
                        <small class="text-muted">Mã sách: {{ item.MaSach }}</small>
                      </div>
                    </div>
                  </td>
                  <td class="text-center fw-semibold">{{ item.SoLuong || 1 }}</td>
                  <td class="text-end pe-4 text-orange fw-semibold">
                    {{ formatCurrency(item.ThongTinSach?.DonGia) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="bg-light border-top d-flex justify-content-between align-items-center py-2 px-4 small">
          <span class="text-muted">
            Người mượn:
            <strong class="text-dark">
              {{ `${currentUser?.hoLot || ""} ${currentUser?.tenDocGia || ""}`.trim() || "Bạn" }}
            </strong>
          </span>
          <span class="text-muted">
            Tổng số lượng: <strong class="text-navy">{{ getTotalBooks(req) }}</strong> quyển
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.object-fit-cover {
  object-fit: cover;
}
</style>
