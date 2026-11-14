# Danh sách lỗi & Hạng mục Bảo trì Hệ thống Quản lý Thư viện (QLThuVien)

Tài liệu này ghi nhận **12 hạng mục lỗi / tồn đọng chủ đích** ở tầng Backend, CSDL, Kiến trúc và Vận hành để phục vụ kiểm thử và thực hành **4 loại hình bảo trì phần mềm**, cùng với tóm tắt các lỗi Frontend đã được khắc phục.

---

## Phần A: 12 Hạng mục Bảo trì Phần mềm (Còn lại để kiểm thử & bảo trì)

### 1. Bảo trì Hiệu chỉnh (Corrective Maintenance — 04 lỗi)

1. **`[COR-01]` Thiếu kiểm soát tồn kho (`SoQuyen`) và chuyển trạng thái mượn trả trong Service**
   - **Vị trí:** `backend/app/services/yeucaumuonsach.service.js`
   - **Hiện trạng:** Khi duyệt yêu cầu mượn (`DaDuyet`) hoặc xác nhận trả sách (`DaTra`), service không kiểm tra số lượng tồn `SoQuyen`, không tự động trừ/cộng `SoQuyen` của sách trong CSDL và không chặn chuyển trạng thái bất hợp lệ (ví dụ: duyệt lại phiếu đã từ chối/đã trả, hoặc không khóa số lượng sách đang mượn tối đa trên server).

2. **`[COR-02]` Sai lệch tên hàm truy vấn và tham số query giữa Controller, Service và Frontend**
   - **Vị trí:**
     - `backend/app/controllers/sach.controller.js` (`findAll`) gọi `SachService.findByTen(TenSach)`, trong khi `backend/app/services/sach.service.js` định nghĩa `findByTenSach`.
     - `backend/app/controllers/docgia.controller.js` (`findAll`) đọc `req.query.ten` (chữ thường), trong khi `frontend/src/views/admin/docgia.vue` gửi query `?Ten=...` (chữ hoa).
   - **Hiện trạng:** Tìm kiếm sách theo `TenSach` qua API có thể ném lỗi `TypeError: SachService.findByTen is not a function`, và lọc độc giả theo `?Ten=` không trả về kết quả đúng.

3. **`[COR-03]` Lỗi `upsert: true` ghi đè dữ liệu và `.populate()` sai kiểu `String` trong CSDL**
   - **Vị trí:**
     - `backend/app/services/sach.service.js` & `backend/app/services/nhaxuatban.service.js`: hàm `create` sử dụng `{ upsert: true }`, dẫn đến việc tạo mới bản ghi có mã/điều kiện trùng sẽ âm thầm ghi đè bản ghi cũ thay vì báo lỗi trùng lặp.
     - `backend/app/services/sach.service.js` (`findById` gọi `.populate("MaNXB", "tenNXB")`) và `backend/app/services/theodoimuonsach.service.js` (gọi `.populate('MaDocGia')`, `.populate('MaSach')`) trên các trường khai báo kiểu `String` thay vì `ObjectId` ref.
   - **Hiện trạng:** Populate không trả về object liên kết đúng chuẩn Mongoose hoặc gây lỗi/thiếu dữ liệu nếu phụ thuộc vào kết quả populate từ server.

4. **`[COR-04]` Exception chưa import (`ApiError`) và bỏ sót `req.file` khi cập nhật sách**
   - **Vị trí:**
     - `backend/app/controllers/yeucaumuonsach.controller.js` (dòng 50): sử dụng `new ApiError(500, ...)` nhưng chưa `require/import` lớp `ApiError`, gây `ReferenceError` khi nhánh lỗi thực thi.
     - `backend/app/controllers/sach.controller.js` (`update`): không xử lý `req.file` từ Multer để cập nhật trường `HinhAnh` khi chỉnh sửa thông tin sách kèm ảnh bìa mới.

---

### 2. Bảo trì Thích ứng (Adaptive Maintenance — 03 hạng mục)

5. **`[ADP-01]` Thiếu Middleware xác thực (JWT/Session), phân quyền RBAC và mã hóa mật khẩu đồng bộ**
   - **Vị trí:** `backend/app/routes/*.js`, `backend/app/controllers/auth.controller.js`, `backend/app/controllers/docgia.controller.js`, `backend/app/services/docgia.service.js`, `backend/app/controllers/nhanvien.controller.js`, `backend/app/models/NhanVien.js`
   - **Hiện trạng:**
     - Các route quản trị và nghiệp vụ chưa có middleware kiểm tra token và phân quyền vai trò (`NhanVien` vs `DocGia`).
     - `DocGia` lưu và so sánh mật khẩu dạng plain-text (`docgia.service.js`, `auth.controller.js`), đồng thời `docgia.controller.js` vẫn trả về trường `password` trong JSON response.
     - `nhanvien.controller.js` dùng `bcrypt.compare` khi đăng nhập nhưng model `NhanVien.js` chưa có hook tự động hash mật khẩu khi tạo/sửa.

6. **`[ADP-02]` Chưa đóng gói môi trường thực thi (Docker, Web Server / Reverse Proxy, biến môi trường)**
   - **Vị trí:** Toàn cục dự án (`backend/`, `frontend/`)
   - **Hiện trạng:** Thiếu cấu hình `Dockerfile`, `docker-compose.yml`, cấu hình nâng cấp/tách biệt biến môi trường (`.env` cho URI MongoDB, port, CORS origin, JWT secret) và cấu hình Web Server (Nginx) để triển khai đồng bộ trên môi trường mới hoặc nâng cấp phiên bản Node/MongoDB.

7. **`[ADP-03]` Chưa chuẩn hóa hợp đồng dữ liệu giao tiếp (JSON Payload & Schema Contract)**
   - **Vị trí:** Toàn bộ API Backend & Models (`Docgia.js`, `NhaXuatBan.js`, `Sach.js`, `YeuCauMuonSach.js`)
   - **Hiện trạng:** Tên trường JSON không nhất quán giữa các model/API (`tenNXB` vs `TenNXB`, `maDocGia` vs `MaDocGia`, `gioiTinh` vs `phai`, `SoQuyen`, `TrangThai`), chưa có chuẩn cấu trúc phản hồi thống nhất (envelope `{ success, data, error, meta }`) hoặc cơ chế versioning `/api/v1`.

---

### 3. Bảo trì Hoàn thiện (Perfective Maintenance — 03 hạng mục)

8. **`[PRF-01]` Tối ưu hóa truy vấn và bổ sung Chỉ mục (Index) trong MongoDB**
   - **Vị trí:** `backend/app/models/{Docgia,NhanVien,NhaXuatBan,Sach,TheoDoiMuonSach,YeuCauMuonSach}.js`
   - **Hiện trạng:** Các schema chưa định nghĩa `index` (unique/compound/text index) cho các trường truy vấn và sắp xếp thường xuyên như `MaSach`, `TenSach`, `MaDocGia`, `MaNXB`, `TrangThai`, `NgayYeuCau`, dẫn đến full collection scan khi dữ liệu lớn.

9. **`[PRF-02]` Mở rộng tính năng thống kê & xuất báo cáo (Excel/CSV/Dashboard API)**
   - **Vị trí:** Backend API & Trang quản trị
   - **Hiện trạng:** Chưa có API tổng hợp số liệu thống kê phía server (top sách mượn nhiều, tỷ lệ quá hạn theo tháng, tồn kho theo NXB) và chưa có tính năng xuất báo cáo danh sách mượn trả / sách / độc giả ra file Excel (`.xlsx`) hoặc CSV.

10. **`[PRF-03]` Hoàn thiện kiểm tra dữ liệu đầu vào (Server-side Validation) và trường thông tin mở rộng**
    - **Vị trí:** `backend/app/services/yeucaumuonsach.service.js`, các Controller và Mongoose Models
    - **Hiện trạng:** Thiếu lớp validation dữ liệu đầu vào tập trung (như Joi/Zod/express-validator) để kiểm tra giới hạn tối đa sách được mượn trên server (`MAX_BOOKS_ALLOWED`), định dạng ngày mượn/hạn trả, số lượng hợp lệ, cũng như bổ sung đầy đủ các trường `gioiTinh`, `MoTa`, `GhiChu` vào schema.

---

### 4. Bảo trì Dự phòng (Preventive Maintenance — 02 hạng mục)

11. **`[PRV-01]` Tái cấu trúc mã nguồn theo chuẩn phân tầng MVC/Service và loại bỏ mã dư thừa**
    - **Vị trí:** `backend/app/services/theodoimuonsach.service.js`, `backend/app/models/TheoDoiMuonSach.js`, các Controller & Frontend Views
    - **Hiện trạng:** Tồn tại song song hai module `TheoDoiMuonSach` và `YeuCauMuonSach` gây chồng chéo nghiệp vụ; một số logic xử lý/ánh xạ dữ liệu vẫn đang nằm rải rác ở Controller hoặc Frontend thay vì tách rõ Repository/Service/Controller.

12. **`[PRV-02]` Bổ sung hệ thống ghi nhận nhật ký (Logging) và chuẩn hóa tài liệu mã nguồn / API Docs**
    - **Vị trí:** `backend/app.js`, toàn bộ Controllers/Services
    - **Hiện trạng:** Chưa tích hợp thư viện logging tập trung (ví dụ Winston/Pino + Morgan HTTP logger) để lưu vết lỗi, truy vấn chậm và lịch sử thao tác quản trị (duyệt/trả/xóa); thiếu JSDoc chuẩn và tài liệu OpenAPI/Swagger cho các endpoint.

---

## Phần B: Tóm tắt các lỗi Frontend & Hiển thị đã được khắc phục

- **Lịch sử mượn sách (`frontend/src/views/LichSuMuon.vue`, `frontend/src/utils/formatters.js`):**
  - Sửa lỗi hardcode số lượng `1` khi hiển thị từng đầu sách; hiển thị đúng `item.SoLuong || 1` và tổng số quyển thực tế.
  - Hiển thị rõ các trạng thái (`DangCho`, `ChoDuyet`, `DaDuyet`, `DaTra`, `TuChoi`), cảnh báo quá hạn (`isOverdueBorrow`), thanh tiến trình 3 bước (`Chờ duyệt → Đang mượn → Đã trả`) và mô tả chi tiết từng trạng thái.
- **Hệ thống thông báo giao diện (`frontend/src/utils/toast.js`, `frontend/src/components/ToastContainer.vue`):**
  - Thay thế `alert(...)` thô bằng hộp thông báo Toast tối giản khi thêm/sửa/xóa, đăng nhập/đăng xuất, mượn sách hoặc phát sinh lỗi.
- **Chức năng Chỉnh sửa sách (`frontend/src/views/themSach.vue`, `frontend/src/router/index.js`, `frontend/src/views/admin/QuanLySach.vue`):**
  - Bổ sung route `/sach/sua/:id` (`name: "sach-edit"`) và chế độ chỉnh sửa trực tiếp trên `themSach.vue`, tự động nạp dữ liệu sách và ảnh bìa hiện có.
- **Sửa lỗi lập trình Frontend khó phát hiện:**
  - `nhanvien.service.js`: thay thế nhầm code Mongoose backend bằng Axios client `/api/nhanvien`.
  - `muonsach.service.js`: sửa endpoint `getHistory` từ `/user/${userId}` sang `/history/${maDocGia}`.
  - `MuonSach.vue`: sửa `CONFIG.MAX_BOOKS` → `CONFIG.MAX_BOOKS_ALLOWED`, `validateForm(get)` → `validateForm(maDocGia)`, `TrangThai: "ChoDuyet"` → `"DangCho"`, redirect `/lich-su-muon` → `/lich-su`, và đọc `maDocGia` đúng trong `submitRequest`.
  - `Cart.vue` & `ChiTietSach.vue`: đồng bộ `MaDocGia` (`maDocGia || _id`), kiểm tra giới hạn tồn kho và tối đa 3 quyển, cập nhật badge giỏ hàng theo tổng số lượng `SoLuong`.
  - `HoSoCaNhan.vue`: sửa lỗi nút đăng xuất không xóa sạch `localStorage`, sửa hiển thị giới tính (`gioiTinh || phai`) và hoàn thiện modal chỉnh sửa hồ sơ.
  - `router/index.js`: sửa import phân biệt chữ hoa/thường (`notFound.vue`, `testApi.vue`) và bổ sung `meta: { requiresAuth: true }`.
- **Chuẩn hóa giao diện Minimalist:**
  - Thay thế các nút màu vàng chói (`btn-warning`) bằng bảng màu hài hòa: xanh đậm (`#1e3a8a`), cam trầm (`#c2410c`), đỏ xóa (`#b91c1c`), xanh lá trầm (`#15803d`) và các thẻ `.minimal-card`.
