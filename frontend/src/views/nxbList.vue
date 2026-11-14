<script setup>
import { ref, computed, onMounted } from "vue";
import NhaXuatBanService from "@/services/nhaxuatban.service";
import { useRouter } from "vue-router";
import { toast } from "@/utils/toast";

const router = useRouter();

const nxbs = ref([]);
const searchText = ref("");
const isLoading = ref(false);
const userRole = ref(localStorage.getItem("role"));

const isAdminOrStaff = computed(() => {
  return userRole.value === "admin" || userRole.value === "nhanvien";
});

const retrieveNXBs = async () => {
  isLoading.value = true;
  try {
    nxbs.value = await NhaXuatBanService.getAll();
  } catch (error) {
    console.error(error);
    toast.error("Lỗi khi tải danh sách Nhà xuất bản.");
  } finally {
    isLoading.value = false;
  }
};

const filteredNXBs = computed(() => {
  if (!searchText.value) return nxbs.value;
  const kw = searchText.value.toLowerCase().trim();
  return nxbs.value.filter(
    (nxb) =>
      (nxb.tenNXB || "").toLowerCase().includes(kw) ||
      (nxb.maNXB || "").toLowerCase().includes(kw) ||
      (nxb.diaChi || "").toLowerCase().includes(kw)
  );
});

const goToEdit = (id) => {
  router.push({ name: "nxb-edit", params: { id } });
};

const deleteNXB = async (id, tenNXB) => {
  if (confirm(`Bạn có chắc muốn xóa NXB: "${tenNXB}" không?`)) {
    try {
      await NhaXuatBanService.delete(id);
      await retrieveNXBs();
      toast.success(`Đã xóa nhà xuất bản "${tenNXB}".`);
    } catch (error) {
      console.error(error);
      toast.error("Xóa thất bại! Có thể NXB này đang có sách liên kết.");
    }
  }
};

onMounted(() => {
  retrieveNXBs();
});
</script>

<template>
  <div class="container py-4">
    <div class="page-header-card p-4 mb-4">
      <div class="row align-items-center gy-3">
        <div class="col-md-6">
          <h3 class="mb-1 text-navy fw-bold">
            <i class="fas fa-building me-2"></i>Danh Sách Nhà Xuất Bản
          </h3>
          <p class="text-muted mb-0 small">
            Tra cứu thông tin các nhà xuất bản đang liên kết với thư viện.
          </p>
        </div>
        <div class="col-md-6 text-md-end d-flex justify-content-md-end align-items-center gap-2">
          <span class="status-badge status-borrowed">
            {{ filteredNXBs.length }} nhà xuất bản
          </span>
          <router-link v-if="isAdminOrStaff" to="/nxb/add" class="btn btn-navy btn-sm">
            <i class="fas fa-plus me-1"></i> Thêm NXB Mới
          </router-link>
        </div>
      </div>

      <div class="row mt-3">
        <div class="col-md-6">
          <div class="input-group">
            <span class="input-group-text bg-light"><i class="fas fa-search text-muted"></i></span>
            <input
              type="text"
              class="form-control"
              placeholder="Tìm theo Tên NXB, Mã NXB hoặc Địa chỉ..."
              v-model="searchText"
            />
          </div>
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
              <th class="text-center" style="width: 60px;">STT</th>
              <th style="width: 130px;">Mã NXB</th>
              <th>Tên Nhà Xuất Bản</th>
              <th>Địa Chỉ</th>
              <th v-if="isAdminOrStaff" class="text-center" style="width: 140px;">Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(nxb, index) in filteredNXBs" :key="nxb._id">
              <td class="text-center fw-semibold">{{ index + 1 }}</td>
              <td>
                <span class="status-badge status-neutral">{{ nxb.maNXB }}</span>
              </td>
              <td class="fw-semibold text-dark">{{ nxb.tenNXB }}</td>
              <td class="text-muted small">{{ nxb.diaChi || "Chưa cập nhật" }}</td>
              <td v-if="isAdminOrStaff" class="text-center">
                <button
                  class="btn btn-sm btn-outline-orange me-2"
                  @click="goToEdit(nxb._id)"
                  title="Chỉnh sửa"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button
                  class="btn btn-sm btn-outline-delete"
                  @click="deleteNXB(nxb._id, nxb.tenNXB)"
                  title="Xóa"
                >
                  <i class="fas fa-trash-alt"></i>
                </button>
              </td>
            </tr>

            <tr v-if="filteredNXBs.length === 0">
              <td :colspan="isAdminOrStaff ? 5 : 4" class="text-center py-5 text-muted">
                <i class="fas fa-inbox fa-2x mb-2 d-block opacity-50"></i>
                Không tìm thấy nhà xuất bản nào.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
