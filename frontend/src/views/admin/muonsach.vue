<template>
  <div class="container py-4">
    <div class="page-header-card p-4 mb-4">
      <div class="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
        <div>
          <h3 class="text-navy fw-bold mb-1">
            <i class="fas fa-clipboard-list me-2"></i>Quản Lý Mượn Trả Sách
          </h3>
          <p class="text-muted mb-0 small">
            Xem thông tin độc giả, duyệt yêu cầu mượn sách và xác nhận trả sách.
          </p>
        </div>
        <button class="btn btn-subtle btn-sm" @click="fetchAllData(true)">
          <i class="fas fa-sync-alt me-1"></i> Làm mới
        </button>
      </div>

      <div class="row g-3 mb-3">
        <div class="col-6 col-md-3">
          <div class="p-3 rounded bg-light border">
            <small class="d-block text-muted">Chờ duyệt</small>
            <span class="fs-4 fw-bold text-orange">{{ statusCounts.DangCho }}</span>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="p-3 rounded bg-light border">
            <small class="d-block text-muted">Đang mượn</small>
            <span class="fs-4 fw-bold text-navy">{{ statusCounts.DaDuyet }}</span>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="p-3 rounded bg-light border">
            <small class="d-block text-muted">Đã trả</small>
            <span class="fs-4 fw-bold" style="color: #15803d;">{{ statusCounts.DaTra }}</span>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="p-3 rounded bg-light border">
            <small class="d-block text-muted">Từ chối</small>
            <span class="fs-4 fw-bold" style="color: #b91c1c;">{{ statusCounts.TuChoi }}</span>
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
              placeholder="Tìm theo tên độc giả, mã độc giả hoặc tên sách..."
              v-model="searchText"
            />
          </div>
        </div>
        <div class="col-md-5">
          <select class="form-select" v-model="statusFilter">
            <option value="ALL">Tất cả trạng thái ({{ requests.length }})</option>
            <option value="DangCho">Chờ duyệt ({{ statusCounts.DangCho }})</option>
            <option value="DaDuyet">Đang mượn ({{ statusCounts.DaDuyet }})</option>
            <option value="DaTra">Đã trả ({{ statusCounts.DaTra }})</option>
            <option value="TuChoi">Từ chối ({{ statusCounts.TuChoi }})</option>
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
              <th class="ps-4">Ngày Yêu Cầu</th>
              <th>Hẹn Trả</th>
              <th>Độc Giả</th>
              <th class="text-center">Sách Mượn</th>
              <th class="text-center">Trạng Thái</th>
              <th class="text-center">Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="req in filteredRequests" :key="req._id">
              <td class="ps-4 small text-muted">{{ formatDateTime(req.NgayYeuCau) }}</td>
              <td class="small fw-medium">{{ formatDate(req.NgayHenTra) }}</td>
              <td>
                <div v-if="req.MaDocGia">
                  <div class="fw-semibold text-dark">
                    {{ getReaderDisplay(req).fullName }}
                  </div>
                  <small class="text-muted d-block" v-if="getReaderDisplay(req).maDocGia">
                    Mã ĐG: {{ getReaderDisplay(req).maDocGia }}
                  </small>
                  <small class="text-muted" v-if="getReaderDisplay(req).email">
                    {{ getReaderDisplay(req).email }}
                  </small>
                </div>
                <div v-else class="text-danger small fw-semibold">Độc giả không tồn tại</div>
              </td>

              <td class="text-center">
                <button class="btn btn-sm btn-subtle" @click="viewDetails(req)">
                  <i class="fas fa-book-open me-1"></i>
                  Xem {{ req.DanhSachSach.length }} đầu sách
                </button>
              </td>

              <td class="text-center">
                <span :class="getBorrowStatusInfo(req.TrangThai, req).badgeClass">
                  <i :class="getBorrowStatusInfo(req.TrangThai, req).icon"></i>
                  {{ getBorrowStatusInfo(req.TrangThai, req).text }}
                </span>
              </td>

              <td class="text-center">
                <div v-if="req.TrangThai === 'DangCho'" class="d-inline-flex gap-2">
                  <button class="btn btn-forest btn-sm" @click="updateStatus(req._id, 'DaDuyet')">
                    <i class="fas fa-check me-1"></i> Duyệt
                  </button>
                  <button class="btn btn-outline-delete btn-sm" @click="updateStatus(req._id, 'TuChoi')">
                    <i class="fas fa-times me-1"></i> Từ chối
                  </button>
                </div>
                <div v-else-if="req.TrangThai === 'DaDuyet'">
                  <button class="btn btn-orange btn-sm" @click="updateStatus(req._id, 'DaTra')">
                    <i class="fas fa-undo-alt me-1"></i> Xác nhận trả
                  </button>
                </div>
                <span v-else class="text-muted small">Đã hoàn tất</span>
              </td>
            </tr>

            <tr v-if="filteredRequests.length === 0">
              <td colspan="6" class="text-center py-5 text-muted">
                <i class="fas fa-inbox fa-2x mb-2 d-block opacity-50"></i>
                Không có yêu cầu mượn sách nào phù hợp.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="selectedRequest" class="modal fade show d-block" style="background: rgba(15, 23, 42, 0.5)">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content border-0 shadow-sm rounded-3 overflow-hidden">
          <div class="modal-header bg-white border-bottom">
            <h5 class="modal-title fw-bold text-navy">
              <i class="fas fa-book-reader me-2"></i>Chi tiết phiếu mượn sách
            </h5>
            <button type="button" class="btn-close" @click="selectedRequest = null"></button>
          </div>
          <div class="modal-body p-4">
            <div class="row g-3 mb-4 p-3 bg-light rounded border">
              <div class="col-md-6">
                <small class="text-muted d-block">Độc giả mượn</small>
                <div class="fw-bold text-dark">{{ getReaderDisplay(selectedRequest).fullName }}</div>
                <small class="text-muted" v-if="getReaderDisplay(selectedRequest).maDocGia">
                  Mã ĐG: {{ getReaderDisplay(selectedRequest).maDocGia }}
                </small>
              </div>
              <div class="col-md-6">
                <small class="text-muted d-block">Thời gian</small>
                <div class="small">Ngày yêu cầu: <strong>{{ formatDateTime(selectedRequest.NgayYeuCau) }}</strong></div>
                <div class="small">Ngày hẹn trả: <strong>{{ formatDate(selectedRequest.NgayHenTra) }}</strong></div>
              </div>
            </div>

            <h6 class="fw-semibold text-dark mb-3">Danh sách sách yêu cầu</h6>
            <ul class="list-group">
              <li
                v-for="(book, idx) in selectedRequest.DanhSachSach"
                :key="book._id || idx"
                class="list-group-item d-flex justify-content-between align-items-center py-3"
              >
                <div class="d-flex align-items-center">
                  <img
                    :src="getModalBookImage(book)"
                    class="rounded border me-3"
                    style="width: 48px; height: 66px; object-fit: cover;"
                    alt="Book cover"
                    @error="handleBookImageError"
                  />
                  <div>
                    <h6 class="mb-1 fw-semibold text-dark">{{ getModalBookTitle(book) }}</h6>
                    <small class="text-muted d-block" v-if="getModalBookAuthor(book)">
                      Tác giả: {{ getModalBookAuthor(book) }}
                    </small>
                    <small class="text-muted">Mã sách: {{ book.MaSach }}</small>
                  </div>
                </div>
                <span class="status-badge status-borrowed">
                  SL: {{ book.SoLuong || 1 }}
                </span>
              </li>
            </ul>
          </div>
          <div class="modal-footer bg-light">
            <button type="button" class="btn btn-subtle" @click="selectedRequest = null">Đóng</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import {
  formatDate,
  formatDateTime,
  getBookImageUrl,
  handleBookImageError,
  resolveReaderInfo,
  getBorrowStatusInfo,
} from "@/utils/formatters";
import { toast } from "@/utils/toast";

const requests = ref([]);
const readers = ref([]);
const books = ref([]);
const selectedRequest = ref(null);
const isLoading = ref(true);
const searchText = ref("");
const statusFilter = ref("ALL");

const fetchAllData = async (showNotice = false) => {
  isLoading.value = true;
  try {
    const [reqRes, readerRes, bookRes] = await Promise.all([
      axios.get("http://localhost:3000/api/yeucaumuonsach"),
      axios.get("http://localhost:3000/api/docgia").catch(() => ({ data: [] })),
      axios.get("http://localhost:3000/api/sach").catch(() => ({ data: [] })),
    ]);
    requests.value = reqRes.data;
    readers.value = readerRes.data;
    books.value = bookRes.data;
    if (showNotice) {
      toast.info("Đã làm mới danh sách phiếu mượn.");
    }
  } catch (error) {
    console.error("Lỗi lấy danh sách:", error);
    toast.error("Không thể tải danh sách yêu cầu mượn sách.");
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchAllData(false);
});

const getReaderDisplay = (req) => resolveReaderInfo(req, readers.value);

const findBookInfo = (item) => {
  if (item.ThongTinSach) return item.ThongTinSach;
  return books.value.find((b) => b.MaSach === item.MaSach || b._id === item.MaSach);
};

const getModalBookTitle = (item) => {
  const info = findBookInfo(item);
  return info?.TenSach || item.TenSach || "Sách không xác định";
};

const getModalBookAuthor = (item) => {
  const info = findBookInfo(item);
  return info?.TacGia || "";
};

const getModalBookImage = (item) => {
  const info = findBookInfo(item);
  return getBookImageUrl(info?.HinhAnh);
};

const statusCounts = computed(() => {
  const counts = { DangCho: 0, DaDuyet: 0, DaTra: 0, TuChoi: 0 };
  for (const r of requests.value) {
    if (counts[r.TrangThai] !== undefined) counts[r.TrangThai]++;
  }
  return counts;
});

const filteredRequests = computed(() => {
  return requests.value.filter((req) => {
    const matchStatus =
      statusFilter.value === "ALL" || req.TrangThai === statusFilter.value;
    if (!matchStatus) return false;

    if (!searchText.value.trim()) return true;
    const kw = searchText.value.toLowerCase().trim();
    const reader = getReaderDisplay(req);
    const matchReader =
      reader.fullName.toLowerCase().includes(kw) ||
      reader.maDocGia.toLowerCase().includes(kw) ||
      reader.email.toLowerCase().includes(kw);
    const matchBooks = (req.DanhSachSach || []).some((b) =>
      getModalBookTitle(b).toLowerCase().includes(kw) ||
      (b.MaSach || "").toLowerCase().includes(kw)
    );
    return matchReader || matchBooks;
  });
});

const statusActionLabels = {
  DaDuyet: "Đã duyệt yêu cầu mượn sách.",
  TuChoi: "Đã từ chối yêu cầu mượn sách.",
  DaTra: "Đã xác nhận độc giả trả sách.",
};

const updateStatus = async (id, status) => {
  if (!confirm("Bạn chắc chắn muốn đổi trạng thái phiếu mượn này?")) return;
  try {
    await axios.put(`http://localhost:3000/api/yeucaumuonsach/${id}`, { TrangThai: status });
    toast.success(statusActionLabels[status] || "Cập nhật trạng thái thành công!");
    fetchAllData(false);
  } catch (error) {
    toast.error(error.response?.data?.message || "Lỗi cập nhật trạng thái!");
  }
};

const viewDetails = (req) => {
  selectedRequest.value = req;
};
</script>
