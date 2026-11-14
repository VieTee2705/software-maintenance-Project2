<template>
  <div class="container py-4">
    <div class="page-header-card p-4 mb-4">
      <div class="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
        <div>
          <h3 class="text-navy fw-bold mb-1">
            <i class="fas fa-users me-2"></i>Danh Sách Độc Giả
          </h3>
          <p class="text-muted mb-0 small">Quản lý thông tin tài khoản và hồ sơ độc giả trong hệ thống.</p>
        </div>
        <div class="d-flex align-items-center gap-2">
          <span class="status-badge status-borrowed">
            Tổng: {{ readers.length }} độc giả
          </span>
          <button class="btn btn-navy btn-sm" @click="openCreateModal">
            <i class="fas fa-user-plus me-1"></i> Thêm Độc Giả
          </button>
        </div>
      </div>

      <div class="input-group">
        <span class="input-group-text bg-light"><i class="fas fa-search text-muted"></i></span>
        <input
          type="text"
          class="form-control"
          placeholder="Tìm kiếm theo tên độc giả..."
          v-model="searchText"
          @keyup.enter="searchReaders"
        />
        <button class="btn btn-navy" type="button" @click="searchReaders">
          <i class="fas fa-search me-1"></i> Tìm
        </button>
        <button class="btn btn-subtle" type="button" @click="resetSearch">
          <i class="fas fa-times me-1"></i> Hủy
        </button>
      </div>
    </div>

    <div class="minimal-card overflow-hidden">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead>
            <tr>
              <th class="text-center" style="width: 60px;">STT</th>
              <th>Mã ĐG</th>
              <th>Họ và Tên</th>
              <th>Email</th>
              <th>Điện Thoại</th>
              <th>Địa Chỉ</th>
              <th class="text-center">Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(reader, index) in readers" :key="reader._id">
              <td class="text-center fw-semibold">{{ index + 1 }}</td>
              <td>
                <span class="status-badge status-neutral">{{ reader.maDocGia }}</span>
              </td>
              <td class="fw-semibold text-dark">{{ reader.hoLot }} {{ reader.tenDocGia }}</td>
              <td>{{ reader.email }}</td>
              <td>{{ reader.dienThoai || "---" }}</td>
              <td class="text-muted small">{{ reader.diaChi || "Chưa cập nhật" }}</td>
              <td class="text-center">
                <div class="d-inline-flex gap-1">
                  <button
                    class="btn btn-sm btn-subtle"
                    @click="showDetail(reader)"
                    title="Xem chi tiết"
                  >
                    <i class="fas fa-eye"></i>
                  </button>
                  <button
                    class="btn btn-sm btn-outline-orange"
                    @click="openEditModal(reader)"
                    title="Chỉnh sửa"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  <button
                    class="btn btn-sm btn-outline-delete"
                    @click="deleteReader(reader._id)"
                    title="Xóa độc giả"
                  >
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="readers.length === 0">
              <td colspan="7" class="text-center py-5 text-muted">
                <i class="fas fa-user-slash fa-2x mb-2 d-block opacity-50"></i>
                Không tìm thấy dữ liệu độc giả.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="selectedReader" class="modal fade show d-block" style="background: rgba(15, 23, 42, 0.5)">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow-sm rounded-3 overflow-hidden">
          <div class="modal-header bg-white border-bottom">
            <h5 class="modal-title fw-bold text-navy">
              <i class="fas fa-id-badge me-2"></i>Thông tin chi tiết độc giả
            </h5>
            <button type="button" class="btn-close" @click="selectedReader = null"></button>
          </div>
          <div class="modal-body p-4">
            <div class="text-center mb-3">
              <div
                class="avatar-placeholder rounded-circle bg-light d-inline-flex align-items-center justify-content-center text-navy border"
                style="width: 76px; height: 76px; font-size: 1.8rem;"
              >
                {{ (selectedReader.tenDocGia || "?").charAt(0).toUpperCase() }}
              </div>
              <h5 class="mt-2 fw-bold mb-1">{{ selectedReader.hoLot }} {{ selectedReader.tenDocGia }}</h5>
              <span class="status-badge status-neutral">
                Mã ĐG: {{ selectedReader.maDocGia }}
              </span>
            </div>
            <ul class="list-group list-group-flush">
              <li class="list-group-item">
                <strong><i class="fas fa-envelope text-navy me-2"></i>Email:</strong>
                {{ selectedReader.email }}
              </li>
              <li class="list-group-item">
                <strong><i class="fas fa-phone text-navy me-2"></i>Điện thoại:</strong>
                {{ selectedReader.dienThoai || "Chưa cập nhật" }}
              </li>
              <li class="list-group-item">
                <strong><i class="fas fa-map-marker-alt text-navy me-2"></i>Địa chỉ:</strong>
                {{ selectedReader.diaChi || "Chưa cập nhật" }}
              </li>
              <li class="list-group-item">
                <strong><i class="fas fa-birthday-cake text-navy me-2"></i>Ngày sinh:</strong>
                {{ formatDate(selectedReader.ngaySinh) }}
              </li>
            </ul>
          </div>
          <div class="modal-footer bg-light">
            <button type="button" class="btn btn-subtle" @click="selectedReader = null">Đóng</button>
            <button type="button" class="btn btn-orange" @click="openEditFromDetail(selectedReader)">
              <i class="fas fa-edit me-1"></i> Chỉnh sửa
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showFormModal" class="modal fade show d-block" style="background: rgba(15, 23, 42, 0.5)">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow-sm rounded-3 overflow-hidden">
          <div class="modal-header bg-white border-bottom">
            <h5 class="modal-title fw-bold text-navy">
              {{ editingReaderId ? "Cập Nhật Độc Giả" : "Thêm Độc Giả Mới" }}
            </h5>
            <button type="button" class="btn-close" @click="showFormModal = false"></button>
          </div>
          <form @submit.prevent="saveReader">
            <div class="modal-body p-4">
              <div class="row g-3 mb-3">
                <div class="col-6">
                  <label class="form-label small fw-semibold">Họ lót <span class="text-danger">*</span></label>
                  <input type="text" class="form-control" v-model="readerForm.hoLot" required />
                </div>
                <div class="col-6">
                  <label class="form-label small fw-semibold">Tên <span class="text-danger">*</span></label>
                  <input type="text" class="form-control" v-model="readerForm.tenDocGia" required />
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label small fw-semibold">Email <span class="text-danger">*</span></label>
                <input type="email" class="form-control" v-model="readerForm.email" required />
              </div>
              <div v-if="!editingReaderId" class="mb-3">
                <label class="form-label small fw-semibold">Mật khẩu <span class="text-danger">*</span></label>
                <input type="password" class="form-control" v-model="readerForm.password" required />
              </div>
              <div class="row g-3 mb-3">
                <div class="col-6">
                  <label class="form-label small fw-semibold">Điện thoại</label>
                  <input type="tel" class="form-control" v-model="readerForm.dienThoai" />
                </div>
                <div class="col-6">
                  <label class="form-label small fw-semibold">Ngày sinh</label>
                  <input type="date" class="form-control" v-model="readerForm.ngaySinh" />
                </div>
              </div>
              <div class="mb-2">
                <label class="form-label small fw-semibold">Địa chỉ</label>
                <input type="text" class="form-control" v-model="readerForm.diaChi" />
              </div>
            </div>
            <div class="modal-footer bg-light">
              <button type="button" class="btn btn-subtle" @click="showFormModal = false">Hủy</button>
              <button type="submit" class="btn btn-navy" :disabled="isSaving">
                <i class="fas fa-save me-1"></i> {{ isSaving ? "Đang lưu..." : "Lưu" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { formatDate } from "@/utils/formatters";
import { toast } from "@/utils/toast";

const readers = ref([]);
const searchText = ref("");
const selectedReader = ref(null);
const showFormModal = ref(false);
const editingReaderId = ref(null);
const isSaving = ref(false);
const readerForm = ref({
  hoLot: "",
  tenDocGia: "",
  email: "",
  password: "",
  dienThoai: "",
  diaChi: "",
  ngaySinh: "",
});

const fetchReaders = async () => {
  try {
    let url = "http://localhost:3000/api/docgia";

    if (searchText.value) {
      url += `?Ten=${searchText.value}`;
    }

    const response = await axios.get(url);
    readers.value = response.data;
  } catch (error) {
    console.error("Lỗi tải danh sách:", error);
    toast.error("Không thể tải danh sách độc giả.");
  }
};

const searchReaders = () => {
  fetchReaders();
};

const resetSearch = () => {
  searchText.value = "";
  fetchReaders();
};

const showDetail = (reader) => {
  selectedReader.value = reader;
};

const deleteReader = async (id) => {
  if (confirm("Bạn có chắc chắn muốn xóa độc giả này? Hành động này không thể hoàn tác.")) {
    try {
      await axios.delete(`http://localhost:3000/api/docgia/${id}`);
      toast.success("Đã xóa độc giả thành công!");
      fetchReaders();
      if (selectedReader.value && selectedReader.value._id === id) {
        selectedReader.value = null;
      }
    } catch (error) {
      console.error(error);
      toast.error("Xóa độc giả thất bại!");
    }
  }
};

const openCreateModal = () => {
  editingReaderId.value = null;
  readerForm.value = {
    hoLot: "",
    tenDocGia: "",
    email: "",
    password: "",
    dienThoai: "",
    diaChi: "",
    ngaySinh: "",
  };
  showFormModal.value = true;
};

const openEditModal = (reader) => {
  editingReaderId.value = reader._id;
  readerForm.value = {
    hoLot: reader.hoLot || "",
    tenDocGia: reader.tenDocGia || "",
    email: reader.email || "",
    password: "",
    dienThoai: reader.dienThoai || "",
    diaChi: reader.diaChi || "",
    ngaySinh: reader.ngaySinh ? String(reader.ngaySinh).slice(0, 10) : "",
  };
  showFormModal.value = true;
};

const openEditFromDetail = (reader) => {
  selectedReader.value = null;
  openEditModal(reader);
};

const saveReader = async () => {
  isSaving.value = true;
  try {
    if (editingReaderId.value) {
      const { password, ...updatePayload } = readerForm.value;
      await axios.put(`http://localhost:3000/api/docgia/${editingReaderId.value}`, updatePayload);
      toast.success("Cập nhật thông tin độc giả thành công!");
    } else {
      await axios.post("http://localhost:3000/api/docgia", readerForm.value);
      toast.success("Thêm độc giả mới thành công!");
    }
    showFormModal.value = false;
    fetchReaders();
  } catch (error) {
    console.error(error);
    toast.error(error.response?.data?.message || "Lỗi khi lưu thông tin độc giả.");
  } finally {
    isSaving.value = false;
  }
};

onMounted(() => {
  fetchReaders();
});
</script>

<style scoped>
.avatar-placeholder {
  font-weight: bold;
  user-select: none;
}

tbody tr {
  transition: background-color 0.2s;
}
</style>
