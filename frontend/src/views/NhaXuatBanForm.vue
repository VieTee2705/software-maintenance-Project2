<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import NhaXuatBanService from "@/services/nhaxuatban.service";
import { toast } from "@/utils/toast";

const route = useRoute();
const router = useRouter();

const isEditMode = ref(false);
const message = ref("");
const isError = ref(false);
const isLoading = ref(false);

const nxb = ref({
  maNXB: "",
  tenNXB: "",
  diaChi: "",
});

const pageTitle = computed(() =>
  isEditMode.value ? "Cập Nhật Nhà Xuất Bản" : "Thêm Nhà Xuất Bản Mới"
);

const getNXB = async (id) => {
  isLoading.value = true;
  try {
    const data = await NhaXuatBanService.get(id);
    if (data) {
      nxb.value = data;
      isEditMode.value = true;
    }
  } catch (error) {
    console.log("Lỗi tải NXB:", error);
    isError.value = true;
    message.value = "Không tìm thấy Nhà xuất bản này!";
    toast.error(message.value);
  } finally {
    isLoading.value = false;
  }
};

const submitForm = async () => {
  message.value = "";
  isError.value = false;

  if (!nxb.value.maNXB || !nxb.value.tenNXB) {
    isError.value = true;
    message.value = "Vui lòng nhập Mã và Tên NXB!";
    toast.warning(message.value);
    return;
  }

  try {
    if (isEditMode.value) {
      await NhaXuatBanService.update(nxb.value._id, nxb.value);
      message.value = "Cập nhật thành công!";
      toast.success("Cập nhật nhà xuất bản thành công!");
    } else {
      await NhaXuatBanService.create(nxb.value);
      message.value = "Thêm mới thành công!";
      toast.success("Thêm nhà xuất bản mới thành công!");
      nxb.value = { maNXB: "", tenNXB: "", diaChi: "" };
      isEditMode.value = false;
    }
  } catch (error) {
    console.error("Lỗi submit:", error);
    isError.value = true;
    message.value = error.response?.data?.message || "Lỗi khi lưu dữ liệu!";
    toast.error(message.value);
  }
};

onMounted(() => {
  if (route.params.id) {
    getNXB(route.params.id);
  }
});
</script>

<template>
  <div class="container py-4">
    <div class="minimal-card mx-auto overflow-hidden" style="max-width: 720px;">
      <div class="p-3 bg-white border-bottom d-flex justify-content-between align-items-center">
        <h5 class="mb-0 fw-bold text-navy">
          <i class="fas fa-building me-2"></i>{{ pageTitle }}
        </h5>
        <button @click="router.push('/nxb')" class="btn btn-sm btn-subtle">
          <i class="fas fa-arrow-left me-1"></i> Quay lại
        </button>
      </div>

      <div class="p-4">
        <div v-if="isLoading" class="text-center py-4">
          <div class="spinner-border text-navy" role="status"></div>
          <p class="mt-2 text-muted small">Đang tải dữ liệu...</p>
        </div>

        <form v-else @submit.prevent="submitForm">
          <div class="mb-3">
            <label class="form-label fw-semibold small">
              Mã NXB <span class="text-danger">*</span>
            </label>
            <input
              type="text"
              class="form-control"
              v-model="nxb.maNXB"
              placeholder="VD: NXB001"
              required
              :disabled="isEditMode"
            />
            <small v-if="isEditMode" class="text-muted">Mã NXB không thể thay đổi.</small>
          </div>

          <div class="mb-3">
            <label class="form-label fw-semibold small">
              Tên Nhà Xuất Bản <span class="text-danger">*</span>
            </label>
            <input
              type="text"
              class="form-control"
              v-model="nxb.tenNXB"
              placeholder="VD: Nhà Xuất Bản Kim Đồng"
              required
            />
          </div>

          <div class="mb-4">
            <label class="form-label fw-semibold small">Địa Chỉ</label>
            <textarea
              class="form-control"
              v-model="nxb.diaChi"
              rows="3"
              placeholder="Nhập địa chỉ trụ sở..."
            ></textarea>
          </div>

          <div v-if="message" :class="['alert small py-2', isError ? 'alert-danger' : 'alert-success']">
            <i :class="['fas me-2', isError ? 'fa-exclamation-triangle' : 'fa-check-circle']"></i>
            {{ message }}
          </div>

          <div class="d-flex justify-content-end gap-2">
            <button
              v-if="!isEditMode"
              type="button"
              class="btn btn-subtle"
              @click="nxb = { maNXB: '', tenNXB: '', diaChi: '' }"
            >
              <i class="fas fa-redo me-1"></i> Làm mới
            </button>
            <button type="submit" class="btn btn-navy px-4">
              <i class="fas fa-save me-2"></i>
              {{ isEditMode ? "Lưu Thay Đổi" : "Tạo Mới" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
