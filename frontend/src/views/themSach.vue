<template>
  <div class="container py-4">
    <div class="page-header-card p-4 mb-4 d-flex flex-wrap justify-content-between align-items-center gap-3">
      <div>
        <h3 class="text-navy fw-bold mb-1">
          <i :class="[isEditMode ? 'fas fa-edit' : 'fas fa-book-medical', 'me-2']"></i>
          {{ isEditMode ? "Chỉnh Sửa Thông Tin Sách" : "Thêm Sách Mới" }}
        </h3>
        <p class="text-muted mb-0 small">
          {{ isEditMode ? "Cập nhật thông tin đầu sách hiện có trong thư viện." : "Nhập đầy đủ thông tin đầu sách và hình ảnh bìa để thêm vào thư viện." }}
        </p>
      </div>
      <router-link to="/admin/quanlysach" class="btn btn-subtle btn-sm">
        <i class="fas fa-arrow-left me-1"></i> Danh sách sách
      </router-link>
    </div>

    <div v-if="isLoadingBook" class="text-center py-5">
      <div class="spinner-border text-navy" role="status"></div>
      <p class="mt-2 text-muted small">Đang tải thông tin sách...</p>
    </div>

    <div v-else class="minimal-card p-4">
      <form @submit.prevent="submitBook" enctype="multipart/form-data">
        <div class="row g-4">
          <div class="col-lg-8">
            <div class="row g-3 mb-3">
              <div class="col-md-4">
                <label for="maSach" class="form-label fw-semibold small">
                  Mã Sách <span class="text-danger">*</span>
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="maSach"
                  v-model="book.MaSach"
                  placeholder="VD: S001"
                  :disabled="isEditMode"
                  required
                />
                <small v-if="isEditMode" class="text-muted">Mã sách không thể thay đổi.</small>
              </div>
              <div class="col-md-8">
                <label for="tenSach" class="form-label fw-semibold small">
                  Tên Sách <span class="text-danger">*</span>
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="tenSach"
                  v-model="book.TenSach"
                  placeholder="Nhập tên sách"
                  required
                />
              </div>
            </div>

            <div class="row g-3 mb-3">
              <div class="col-md-4">
                <label for="donGia" class="form-label fw-semibold small">Đơn Giá</label>
                <div class="input-group">
                  <input
                    type="number"
                    class="form-control"
                    id="donGia"
                    v-model="book.DonGia"
                    min="0"
                    step="1000"
                  />
                  <span class="input-group-text">VNĐ</span>
                </div>
              </div>
              <div class="col-md-4">
                <label for="soQuyen" class="form-label fw-semibold small">Số Quyển</label>
                <input
                  type="number"
                  class="form-control"
                  id="soQuyen"
                  v-model="book.SoQuyen"
                  min="0"
                />
              </div>
              <div class="col-md-4">
                <label for="namXB" class="form-label fw-semibold small">Năm Xuất Bản</label>
                <input
                  type="number"
                  class="form-control"
                  id="namXB"
                  v-model="book.NamXuatBan"
                  min="1800"
                  max="2100"
                  placeholder="2025"
                />
              </div>
            </div>

            <div class="row g-3 mb-3">
              <div class="col-md-6">
                <label for="maNXB" class="form-label fw-semibold small">Nhà Xuất Bản</label>
                <select class="form-select" id="maNXB" v-model="book.MaNXB">
                  <option value="" disabled>-- Chọn Nhà Xuất Bản --</option>
                  <option v-for="nxb in publishers" :key="nxb._id" :value="nxb._id">
                    {{ nxb.tenNXB }} ({{ nxb.maNXB }})
                  </option>
                </select>
              </div>
              <div class="col-md-6">
                <label for="tacGia" class="form-label fw-semibold small">Tác Giả</label>
                <input
                  type="text"
                  class="form-control"
                  id="tacGia"
                  v-model="book.TacGia"
                  placeholder="Nhập tên tác giả"
                />
              </div>
            </div>

            <div class="mb-3">
              <label for="moTa" class="form-label fw-semibold small">Mô tả / Giới thiệu nội dung</label>
              <textarea
                class="form-control"
                id="moTa"
                v-model="book.MoTa"
                rows="4"
                placeholder="Nhập tóm tắt nội dung hoặc ghi chú về sách..."
              ></textarea>
            </div>
          </div>

          <div class="col-lg-4">
            <div class="p-3 bg-light rounded border h-100 d-flex flex-column">
              <label for="hinhAnh" class="form-label fw-semibold small">
                <i class="fas fa-image me-1 text-navy"></i>Hình Ảnh Bìa
              </label>
              <input
                type="file"
                class="form-control mb-3"
                id="hinhAnh"
                ref="fileInput"
                @change="handleFileUpload"
                accept="image/*"
              />

              <div class="flex-grow-1 d-flex align-items-center justify-content-center border rounded bg-white p-3" style="min-height: 240px;">
                <img
                  v-if="previewUrl"
                  :src="previewUrl"
                  class="img-fluid rounded"
                  style="max-height: 220px; object-fit: contain;"
                  alt="Xem trước ảnh bìa"
                  @error="handleBookImageError"
                />
                <div v-else class="text-center text-muted small">
                  <i class="fas fa-cloud-upload-alt fa-2x mb-2 opacity-50"></i>
                  <div>Chưa chọn ảnh bìa</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="d-flex justify-content-end gap-2 border-top pt-3 mt-4">
          <button v-if="!isEditMode" type="button" class="btn btn-subtle px-4" @click="resetForm">
            <i class="fas fa-redo me-1"></i> Làm mới
          </button>
          <router-link v-else to="/admin/quanlysach" class="btn btn-subtle px-4">
            Hủy
          </router-link>
          <button type="submit" class="btn btn-navy px-4" :disabled="isSubmitting">
            <i class="fas fa-save me-1"></i>
            {{ isSubmitting ? "Đang lưu..." : isEditMode ? "Cập Nhật Sách" : "Lưu Sách" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import { getBookImageUrl, handleBookImageError } from "@/utils/formatters";
import { toast } from "@/utils/toast";

export default {
  name: "BookForm",
  setup() {
    const route = useRoute();
    const router = useRouter();

    const isEditMode = computed(() => Boolean(route.params.id));
    const isLoadingBook = ref(false);
    const isSubmitting = ref(false);

    const book = ref({
      MaSach: "",
      TenSach: "",
      DonGia: 0,
      SoQuyen: 1,
      NamXuatBan: new Date().getFullYear(),
      MaNXB: "",
      TacGia: "",
      MoTa: "",
    });

    const publishers = ref([]);
    const selectedFile = ref(null);
    const previewUrl = ref("");
    const fileInput = ref(null);

    const API_URL_NXB = "http://localhost:3000/api/nhaxuatban";
    const API_URL_SACH = "http://localhost:3000/api/sach";

    const getPublishers = async () => {
      try {
        const response = await axios.get(API_URL_NXB);
        publishers.value = response.data;
      } catch (error) {
        console.error("Lỗi lấy danh sách NXB:", error);
        toast.error("Không tải được danh sách Nhà xuất bản.");
      }
    };

    const loadBookForEdit = async (id) => {
      isLoadingBook.value = true;
      try {
        const { data } = await axios.get(`${API_URL_SACH}/${id}`);
        const rawNxb =
          typeof data.MaNXB === "object" ? data.MaNXB?._id || data.MaNXB?.maNXB : data.MaNXB;
        const matchedNxb = publishers.value.find(
          (n) => n._id === rawNxb || n.maNXB === rawNxb
        );

        book.value = {
          MaSach: data.MaSach || "",
          TenSach: data.TenSach || "",
          DonGia: data.DonGia ?? 0,
          SoQuyen: data.SoQuyen ?? 0,
          NamXuatBan: data.NamXuatBan || new Date().getFullYear(),
          MaNXB: matchedNxb ? matchedNxb._id : rawNxb || "",
          TacGia: data.TacGia || "",
          MoTa: data.MoTa || "",
        };
        previewUrl.value = data.HinhAnh ? getBookImageUrl(data.HinhAnh) : "";
      } catch (error) {
        console.error("Lỗi tải thông tin sách:", error);
        toast.error("Không tìm thấy thông tin sách cần chỉnh sửa.");
        router.push("/admin/quanlysach");
      } finally {
        isLoadingBook.value = false;
      }
    };

    const handleFileUpload = (event) => {
      const file = event.target.files[0];
      selectedFile.value = file;
      if (file) {
        previewUrl.value = URL.createObjectURL(file);
      }
    };

    const resetForm = () => {
      book.value = {
        MaSach: "",
        TenSach: "",
        DonGia: 0,
        SoQuyen: 1,
        NamXuatBan: new Date().getFullYear(),
        MaNXB: "",
        TacGia: "",
        MoTa: "",
      };
      selectedFile.value = null;
      previewUrl.value = "";
      if (fileInput.value) fileInput.value.value = "";
    };

    const submitBook = async () => {
      if (!book.value.MaSach || !book.value.TenSach) {
        toast.warning("Vui lòng nhập Mã Sách và Tên Sách!");
        return;
      }

      isSubmitting.value = true;
      const formData = new FormData();
      formData.append("MaSach", book.value.MaSach);
      formData.append("TenSach", book.value.TenSach);
      formData.append("DonGia", book.value.DonGia);
      formData.append("SoQuyen", book.value.SoQuyen);
      formData.append("NamXuatBan", book.value.NamXuatBan);
      formData.append("MaNXB", book.value.MaNXB);
      formData.append("TacGia", book.value.TacGia);
      formData.append("MoTa", book.value.MoTa);

      if (selectedFile.value) {
        formData.append("HinhAnh", selectedFile.value);
      }

      try {
        if (isEditMode.value) {
          await axios.put(`${API_URL_SACH}/${route.params.id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          toast.success("Cập nhật thông tin sách thành công!");
          router.push("/admin/quanlysach");
        } else {
          await axios.post(API_URL_SACH, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          toast.success("Thêm sách mới thành công!");
          resetForm();
        }
      } catch (error) {
        console.error(error);
        const mess =
          error.response?.data?.message || "Lỗi hệ thống hoặc kết nối server";
        toast.error("Thất bại: " + mess);
      } finally {
        isSubmitting.value = false;
      }
    };

    onMounted(async () => {
      await getPublishers();
      if (route.params.id) {
        await loadBookForEdit(route.params.id);
      }
    });

    watch(
      () => route.params.id,
      async (newId) => {
        if (newId) {
          await loadBookForEdit(newId);
        } else {
          resetForm();
        }
      }
    );

    return {
      isEditMode,
      isLoadingBook,
      isSubmitting,
      book,
      publishers,
      fileInput,
      previewUrl,
      handleBookImageError,
      handleFileUpload,
      submitBook,
      resetForm,
    };
  },
};
</script>
