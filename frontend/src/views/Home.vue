<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import SachService from "@/services/sach.service";
import NhaXuatBanService from "@/services/nhaxuatban.service";
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
const isLoading = ref(true);

const featuredFallback = [
  {
    _id: "BK01",
    TenSach: "Tư duy phản biện",
    TacGia: "Zoe McKey",
    DonGia: 150000,
    SoQuyen: 5,
    HinhAnh: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400",
    thongTinNXB: { tenNXB: "NXB Trẻ" },
  },
  {
    _id: "BK02",
    TenSach: "Đắc Nhân Tâm",
    TacGia: "Dale Carnegie",
    DonGia: 89000,
    SoQuyen: 8,
    HinhAnh: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400",
    thongTinNXB: { tenNXB: "NXB Tổng Hợp" },
  },
  {
    _id: "BK03",
    TenSach: "Nhà Giả Kim",
    TacGia: "Paulo Coelho",
    DonGia: 75000,
    SoQuyen: 3,
    HinhAnh: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400",
    thongTinNXB: { tenNXB: "NXB Văn Học" },
  },
  {
    _id: "BK04",
    TenSach: "Cà phê cùng Tony",
    TacGia: "Tony Buổi Sáng",
    DonGia: 110000,
    SoQuyen: 6,
    HinhAnh: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400",
    thongTinNXB: { tenNXB: "NXB Trẻ" },
  },
];

const loadHomeData = async () => {
  try {
    const [sachData, nxbData] = await Promise.all([
      SachService.getAll(),
      NhaXuatBanService.getAll().catch(() => []),
    ]);
    publishers.value = Array.isArray(nxbData) ? nxbData : [];
    books.value =
      Array.isArray(sachData) && sachData.length > 0
        ? sachData.slice(0, 4)
        : featuredFallback;
  } catch (error) {
    console.error("Lỗi tải sách trang chủ:", error);
    toast.warning("Không thể kết nối máy chủ, đang hiển thị danh sách mẫu.");
    books.value = featuredFallback;
  } finally {
    isLoading.value = false;
  }
};

const goToBook = (book) => {
  if (book.MaSach) {
    router.push({ name: "chi-tiet-sach", params: { id: book._id } });
  } else {
    router.push("/sach");
  }
};

onMounted(() => {
  loadHomeData();
});
</script>

<template>
  <div>
    <section class="hero-section py-5 border-bottom bg-white">
      <div class="container py-3">
        <div class="row align-items-center gy-4">
          <div class="col-lg-8 mx-auto text-center">
            <span class="status-badge status-borrowed mb-3">
              <i class="fas fa-book-open"></i> Thư viện trực tuyến E-BookStore
            </span>
            <h1 class="display-6 fw-bold text-dark mb-3">
              Khám Phá Kho Tri Thức Hiện Đại
            </h1>
            <p class="fs-5 text-muted mb-4">
              Tra cứu đầu sách theo nhà xuất bản, đăng ký mượn trực tuyến nhanh gọn và theo dõi trạng thái mượn trả rõ ràng.
            </p>
            <div class="d-flex justify-content-center flex-wrap gap-3">
              <router-link to="/sach" class="btn btn-navy btn-lg px-4">
                <i class="fas fa-book-reader me-2"></i>Mượn sách ngay
              </router-link>
              <router-link to="/nxb" class="btn btn-subtle btn-lg px-4">
                <i class="fas fa-building me-2"></i>Nhà xuất bản
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="container py-4">
      <div class="row g-3 row-cols-1 row-cols-md-3">
        <div class="col">
          <div class="minimal-card p-3 h-100 d-flex align-items-center gap-3">
            <div class="feature-icon rounded-2 bg-light text-navy border">
              <i class="fas fa-bolt"></i>
            </div>
            <div>
              <h6 class="mb-1 fw-semibold">Đăng ký mượn nhanh</h6>
              <small class="text-muted">Chọn sách và gửi yêu cầu chỉ trong vài bước</small>
            </div>
          </div>
        </div>
        <div class="col">
          <div class="minimal-card p-3 h-100 d-flex align-items-center gap-3">
            <div class="feature-icon rounded-2 bg-light text-orange border">
              <i class="fas fa-check-double"></i>
            </div>
            <div>
              <h6 class="mb-1 fw-semibold">Dữ liệu chính xác</h6>
              <small class="text-muted">Thông tin đầu sách, tác giả và NXB rõ ràng</small>
            </div>
          </div>
        </div>
        <div class="col">
          <div class="minimal-card p-3 h-100 d-flex align-items-center gap-3">
            <div class="feature-icon rounded-2 bg-light text-navy border">
              <i class="fas fa-history"></i>
            </div>
            <div>
              <h6 class="mb-1 fw-semibold">Theo dõi trạng thái</h6>
              <small class="text-muted">Cập nhật liên tục tình trạng duyệt &amp; hạn trả</small>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="container py-4">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h4 class="fw-bold text-dark mb-1">Sách Nổi Bật</h4>
          <p class="text-muted mb-0 small">Một số đầu sách tiêu biểu hiện có tại thư viện</p>
        </div>
        <router-link to="/sach" class="btn btn-outline-navy btn-sm">
          Xem tất cả <i class="fas fa-arrow-right ms-1"></i>
        </router-link>
      </div>

      <div v-if="isLoading" class="text-center py-5">
        <div class="spinner-border text-navy" role="status"></div>
      </div>

      <div v-else class="row g-4">
        <div class="col-lg-3 col-md-4 col-sm-6" v-for="book in books" :key="book._id">
          <div class="card h-100 book-card" @click="goToBook(book)">
            <div class="img-container bg-light border-bottom">
              <img
                :src="getBookImageUrl(book.HinhAnh)"
                class="card-img-top"
                :alt="book.TenSach"
                @error="handleBookImageError"
              />
              <span
                class="position-absolute top-0 end-0 m-2 status-badge py-1 px-2"
                :class="book.SoQuyen > 0 ? 'status-returned' : 'status-rejected'"
              >
                {{ book.SoQuyen > 0 ? `Còn ${book.SoQuyen}` : "Hết sách" }}
              </span>
            </div>
            <div class="card-body d-flex flex-column">
              <small class="text-navy fw-medium text-truncate mb-1">
                {{ resolvePublisherName(book, publishers) }}
              </small>
              <h6 class="card-title fw-semibold text-dark text-truncate mb-1" :title="book.TenSach">
                {{ book.TenSach }}
              </h6>
              <small class="text-muted mb-3 text-truncate">
                {{ book.TacGia || "Chưa rõ tác giả" }}
              </small>
              <div class="mt-auto d-flex justify-content-between align-items-center pt-2 border-top">
                <span class="text-orange fw-bold">{{ formatCurrency(book.DonGia) }}</span>
                <span class="btn btn-subtle btn-sm">Chi tiết</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="container py-4">
      <div class="minimal-card p-4 p-md-5 text-center cta-box">
        <h4 class="fw-bold text-dark mb-2">Bạn đang tìm đầu sách cụ thể?</h4>
        <p class="text-muted mb-3">Khám phá toàn bộ kho sách với bộ lọc theo nhà xuất bản và tình trạng tồn kho.</p>
        <router-link to="/sach" class="btn btn-orange px-4">
          <i class="fas fa-compass me-2"></i>Khám Phá Kho Sách
        </router-link>
      </div>
    </section>
  </div>
</template>

<style scoped>
.feature-icon {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 1.05rem;
}

.book-card {
  cursor: pointer;
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.book-card:hover {
  transform: translateY(-3px);
  border-color: #93c5fd;
}

.img-container {
  height: 220px;
  position: relative;
  overflow: hidden;
  border-radius: 9px 9px 0 0;
}

.card-img-top {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 10px;
}

.cta-box {
  background: #ffffff;
  border-left: 4px solid #1e3a8a;
}
</style>
