import { createRouter, createWebHistory } from "vue-router";
import SachApp from "@/views/SachApp.vue";
import { toast } from "@/utils/toast";

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("@/views/Home.vue"),
  },
  {
    path: "/sach",
    name: "sachApp",
    component: SachApp,
  },
  {
    path: "/sach/them",
    name: "sach-add",
    component: () => import("@/views/themSach.vue"),
    meta: { requiresAuth: true, role: ["admin", "nhanvien"] },
  },
  {
    path: "/sach/sua/:id",
    name: "sach-edit",
    component: () => import("@/views/themSach.vue"),
    meta: { requiresAuth: true, role: ["admin", "nhanvien"] },
    props: true,
  },
  {
    path: "/nxb",
    name: "nxb-list",
    component: () => import("@/views/nxbList.vue"),
  },
  {
    path: "/nxb/add",
    name: "nxb-add",
    component: () => import("@/views/NhaXuatBanForm.vue"),
    meta: { requiresAuth: true, role: ["admin", "nhanvien"] },
  },
  {
    path: "/nxb/edit/:id",
    name: "nxb-edit",
    component: () => import("@/views/NhaXuatBanForm.vue"),
    meta: { requiresAuth: true, role: ["admin", "nhanvien"] },
    props: true,
  },
  {
    path: "/admin/docgia",
    name: "AdminDocGia",
    component: () => import("@/views/admin/docgia.vue"),
    meta: { requiresAuth: true, role: ["admin", "nhanvien"] },
  },
  {
    path: "/ho-so",
    name: "ho-so",
    component: () => import("@/views/HoSoCaNhan.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/admin/quanlysach",
    name: "QuanLySach",
    component: () => import("@/views/admin/QuanLySach.vue"),
    meta: { requiresAuth: true, role: ["admin", "nhanvien"] },
  },
  {
    path: "/lich-su",
    name: "lich-su",
    component: () => import("@/views/LichSuMuon.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/dangky",
    name: "dangky",
    component: () => import("@/views/DangKy.vue"),
  },
  {
    path: "/dangnhap",
    name: "dangnhap",
    component: () => import("@/views/DangNhap.vue"),
  },
  {
    path: "/sach/:id",
    name: "chi-tiet-sach",
    component: () => import("@/views/ChiTietSach.vue"),
  },
  {
    path: "/gio-hang",
    name: "Cart",
    component: () => import("@/views/Cart.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/muon-sach",
    name: "MuonSach",
    component: () => import("@/views/MuonSach.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/admin/muonsach",
    name: "AdminMuonSach",
    component: () => import("@/views/admin/muonsach.vue"),
    meta: { requiresAuth: true, role: ["admin", "nhanvien"] },
  },
  {
    path: "/test-api",
    name: "test-api",
    component: () => import("@/views/testApi.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: () => import("@/views/notFound.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const userJson = localStorage.getItem("user");
  const loggedInUser = userJson ? JSON.parse(userJson) : null;

  if (to.meta.requiresAuth && !loggedInUser) {
    toast.warning("Vui lòng đăng nhập để tiếp tục!");
    return next({ name: "dangnhap" });
  }

  if (to.meta.role && loggedInUser) {
    if (!to.meta.role.includes(loggedInUser.Chucvu)) {
      toast.error("Bạn không có quyền truy cập trang này!");
      return next({ name: "home" });
    }
  }

  next();
});

export default router;
