# Tài liệu Review Dự án & Đánh giá Hiện trạng Bảo trì Hệ thống `QLThuVien`

**Vai trò thực hiện:** Kỹ sư Bảo trì Phần mềm & Kỹ sư Quản lý Dự án Phần mềm  
**Phiên bản rà soát:** 1.0 (Baseline phục vụ giai đoạn Bảo trì Phần mềm)  
**Ngày lập:** 16/11/2026  
**Nguồn đối chiếu mã nguồn:** [backend/app.js](../../backend/app.js), [frontend/src/router/index.js](../../frontend/src/router/index.js), [bug-list.md](../../bug-list.md), [backend/seed.js](../../backend/seed.js)

---

## 1. Tóm tắt Điều hành (Executive Summary)

Hệ thống **Quản lý Thư viện (`QLThuVien`)** là ứng dụng web mô hình Client–Server phân tách Frontend/Backend nhằm phục vụ hai nhóm người dùng chính: **Độc giả** (tra cứu sách, quản lý giỏ sách, gửi yêu cầu mượn, theo dõi lịch sử mượn/trả, cập nhật hồ sơ) và **Nhân viên / Quản trị viên thư viện** (quản lý danh mục sách, nhà xuất bản, độc giả và duyệt/trả phiếu mượn).

Qua rà soát toàn diện mã nguồn và môi trường triển khai:
- **Tầng Frontend** đã được chuẩn hóa về giao diện Minimalist, bổ sung thông báo Toast, tính năng **Chỉnh sửa sách** (`/sach/sua/:id`), hoàn thiện hiển thị **Lịch sử mượn sách** (trạng thái, tiến trình 3 bước, cảnh báo quá hạn, số lượng thực) và khắc phục các lỗi lập trình nghiêm trọng ở phía giao diện/service gọi API.
- **Tầng Backend, Cơ sở dữ liệu và Vận hành** hiện vẫn còn **12 hạng mục lỗi và tồn đọng kỹ thuật** được giữ lại có chủ đích nhằm phục vụ quy trình kiểm thử phát hiện lỗi và lập kế hoạch/thực thi bảo trì đầy đủ 4 loại hình: **Hiệu chỉnh (Corrective)**, **Thích ứng (Adaptive)**, **Hoàn thiện (Perfective)** và **Dự phòng (Preventive)**.

---

## 2. Kiến trúc Công nghệ & Thành phần Hệ thống

### 2.1. Ngăn xếp công nghệ (Tech Stack)

| Tầng | Công nghệ & Phiên bản (`package.json`) | Vai trò |
|---|---|---|
| **Frontend** | Vue `^3.3.4`, Vue Router `^4.2.4`, Vite `^7.2.6` | Ứng dụng SPA, định tuyến phía client và build đóng gói |
| **UI & Form** | Bootstrap `^5.3.8`, FontAwesome `^7.1.0`, Vee-Validate `^4.11.1`, Yup `^1.2.0` | Giao diện Minimalist (`App.vue`), icon, kiểm tra form phía client |
| **HTTP Client** | Axios `^1.13.2` | Giao tiếp REST API với Backend (`/api/*`) |
| **Backend** | Node.js (ESM), Express `^5.1.0`, CORS `^2.8.5`, Dotenv `^17.2.3` | RESTful Web Service, xử lý nghiệp vụ và phục vụ ảnh tĩnh `/uploads` |
| **Database** | MongoDB + Mongoose `^8.19.3` | Lưu trữ 6 collection: `Sach`, `NhaXuatBan`, `DocGia`, `NhanVien`, `YeuCauMuonSach`, `TheoDoiMuonSach` |
| **Upload & Auth libs** | Multer `^2.0.2`, `bcrypt ^6.0.0`, `bcryptjs ^3.0.3`, `jsonwebtoken ^9.0.2` | Upload ảnh bìa sách (`public/uploads`), thư viện mã hóa/JWT (chưa tích hợp đồng bộ) |

### 2.2. Ma trận Ánh xạ Route Frontend — API Backend — Model Dữ liệu

| Phân hệ | Route Frontend ([router/index.js](../../frontend/src/router/index.js)) | API Backend ([app.js](../../backend/app.js)) | Model CSDL ([backend/app/models](../../backend/app/models)) |
|---|---|---|---|
| **Trang chủ & Tra cứu** | `/`, `/sach`, `/sach/:id` | `GET /api/sach`, `GET /api/sach/:id`, `GET /api/nhaxuatban` | `Sach`, `NhaXuatBan` |
| **Quản lý Sách** | `/admin/quanlysach`, `/sach/them`, `/sach/sua/:id` | `POST /api/sach`, `PUT /api/sach/:id`, `DELETE /api/sach/:id` | `Sach` |
| **Quản lý NXB** | `/nxb`, `/nxb/add`, `/nxb/edit/:id` | `GET/POST /api/nhaxuatban`, `GET/PUT/DELETE /api/nhaxuatban/:id` | `NhaXuatBan` |
| **Xác thực & Hồ sơ** | `/dangky`, `/dangnhap`, `/ho-so` | `POST /api/auth/login`, `POST /api/docgia`, `PUT /api/docgia/:id`, `PUT /api/nhanvien/:id` | `DocGia`, `NhanVien` |
| **Quản lý Độc giả** | `/admin/docgia` | `GET/POST /api/docgia`, `GET/PUT/DELETE /api/docgia/:id` | `DocGia` |
| **Mượn / Trả & Lịch sử** | `/gio-hang`, `/muon-sach`, `/lich-su`, `/admin/muonsach` | `GET/POST /api/yeucaumuonsach`, `PUT /api/yeucaumuonsach/:id`, `GET /api/yeucaumuonsach/history/:maDocGia` | `YeuCauMuonSach`, `Sach`, `DocGia` |
| **Module dư thừa (Legacy)** | `/test-api` (kiểm thử kết nối) | `GET/POST/PUT/DELETE /api/muonsach` | `TheoDoiMuonSach` |

### 2.3. Bộ Dữ liệu Nền (Baseline Seed Data — `backend/seed.js`)
- **Nhà xuất bản (6):** `NXB001` (NXB Trẻ) đến `NXB006` (Prentice Hall / Sách Công Nghệ).
- **Sách (14):** `S001`–`S014` kèm ảnh bìa thật đồng bộ tên sách/tác giả lưu tại `backend/public/uploads/seed-S001.jpg`..`seed-S014.jpg`.
- **Tài khoản mẫu:**
  - Độc giả: `DG001`–`DG004` (mật khẩu `123456`).
  - Quản trị viên (`admin`): `NV001` (mật khẩu `admin12345`); Thủ thư (`nhanvien`): `NV002` (mật khẩu `staff12345`).

---

## 3. Đánh giá Chi tiết Hiện trạng Kỹ thuật (Code & Architecture Review)

### 3.1. Điểm đạt yêu cầu (Strengths & Frontend Baseline)
1. **Phân tách Frontend/Backend rõ ràng:** Giao diện SPA Vite/Vue 3 biên dịch sạch (`npm run build` thành công với 119 module, không lỗi cú pháp/import).
2. **Trải nghiệm người dùng (UX) nhất quán:** Hệ thống thông báo Toast (`toast.js`, `ToastContainer.vue`), bảng màu Minimalist (`--tone-navy`, `--tone-orange`, `--tone-forest`, `--tone-delete`), luồng Giỏ sách → Đặt mượn → Lịch sử mượn có kiểm soát giới hạn tối đa 3 quyển phía client.
3. **Chuẩn hóa dữ liệu hiển thị:** Tên NXB, tên độc giả, số lượng từng đầu sách và thanh tiến trình 3 bước của phiếu mượn được ánh xạ thân thiện thay vì hiển thị ID thô.

### 3.2. Các Lỗi & Điểm Yếu Kỹ Thuật Tồn Đọng (12 Hạng mục Bảo trì)

#### Nhóm A — Bảo trì Hiệu chỉnh (Corrective Maintenance — 4 lỗi nghiêm trọng)
| Mã | Mô tả ngắn | Tệp ảnh hưởng | Mức độ | Tác động thực tế khi kiểm thử |
|---|---|---|---|---|
| `COR-01` | Thiếu kiểm soát tồn kho (`SoQuyen`) và chuyển trạng thái mượn/trả | `backend/app/services/yeucaumuonsach.service.js` | **Critical** | Duyệt phiếu mượn không trừ `SoQuyen`, trả sách không hoàn lại `SoQuyen`, có thể duyệt khi sách hết hoặc duyệt lại phiếu đã từ chối/đã trả. |
| `COR-02` | Sai tên hàm `findByTen` vs `findByTenSach` và tham số `?ten` vs `?Ten` | `sach.controller.js`, `sach.service.js`, `docgia.controller.js` | **High** | Gọi API lọc sách theo `TenSach` văng `TypeError`; tìm kiếm độc giả ở `/admin/docgia` với `?Ten=` không lọc đúng trên server. |
| `COR-03` | `upsert: true` trong `create` và `.populate()` trên trường `String` | `sach.service.js`, `nhaxuatban.service.js`, `theodoimuonsach.service.js` | **High** | Tạo mới trùng mã/điều kiện có nguy cơ ghi đè bản ghi cũ; `.populate('MaNXB')` / `.populate('MaDocGia')` sai kiểu chuỗi không trả về object tham chiếu. |
| `COR-04` | Chưa import `ApiError` ở `yeucaumuonsach.controller.js` (dòng 50) & `sach.controller.js` `update` bỏ qua `req.file` | `yeucaumuonsach.controller.js`, `sach.controller.js` | **High** | Nhánh lỗi `catch` gây `ReferenceError: ApiError is not defined`; sửa sách có chọn ảnh mới không cập nhật `HinhAnh`. |

#### Nhóm B — Bảo trì Thích ứng (Adaptive Maintenance — 3 hạng mục)
| Mã | Mô tả ngắn | Phạm vi ảnh hưởng | Mức độ | Tác động |
|---|---|---|---|---|
| `ADP-01` | Thiếu middleware xác thực JWT/RBAC và mã hóa mật khẩu không đồng bộ | `routes/*.js`, `auth.controller.js`, `docgia.*`, `nhanvien.*` | **Critical** | Bất kỳ client nào cũng có thể gọi thẳng API quản trị (`POST/PUT/DELETE`); mật khẩu `DocGia` lưu plain-text & bị trả ra JSON; `NhanVien` thiếu hook bcrypt khi tạo mới. |
| `ADP-02` | Thiếu đóng gói môi trường (`Docker`, Nginx, chuẩn hóa `.env`) | Toàn bộ `backend/`, `frontend/` | **Medium** | Khó triển khai đồng nhất trên server mới hoặc nâng cấp phiên bản Node/MongoDB; phụ thuộc cấu hình cứng cục bộ. |
| `ADP-03` | Hợp đồng payload JSON chưa nhất quán (`tenNXB` vs `TenNXB`, `gioiTinh` vs `phai`) | Models & Controllers | **Medium** | Gây phát sinh logic vá nhiều tên trường ở Frontend (`formatters.js`, `HoSoCaNhan.vue`), chưa có envelope chuẩn `{ success, data, error }`. |

#### Nhóm C — Bảo trì Hoàn thiện (Perfective Maintenance — 3 hạng mục)
| Mã | Mô tả ngắn | Phạm vi ảnh hưởng | Mức độ | Tác động |
|---|---|---|---|---|
| `PRF-01` | Thiếu định nghĩa Index MongoDB trên các trường truy vấn/sắp xếp | 6 file trong `backend/app/models/` | **Medium** | Truy vấn tìm sách, lọc theo `TrangThai`, `MaDocGia`, `NgayYeuCau` bị full collection scan khi dữ liệu tăng. |
| `PRF-02` | Thiếu API thống kê tổng hợp & chức năng xuất báo cáo Excel/CSV | Backend API & Admin Views | **Medium** | Thủ thư chưa xuất được báo cáo danh sách mượn trả/quá hạn/tồn kho ra `.xlsx`/`.csv`. |
| `PRF-03` | Thiếu tầng Validation dữ liệu đầu vào phía Server & schema còn thiếu trường | `yeucaumuonsach.service.js`, Models | **High** | Client có thể bypass giới hạn tối đa 3 quyển hoặc gửi ngày trả nhỏ hơn ngày mượn trực tiếp qua API; thiếu trường `gioiTinh`, `MoTa`, `GhiChu` trong DB. |

#### Nhóm D — Bảo trì Dự phòng (Preventive Maintenance — 2 hạng mục)
| Mã | Mô tả ngắn | Phạm vi ảnh hưởng | Mức độ | Tác động |
|---|---|---|---|---|
| `PRV-01` | Chồng chéo `TheoDoiMuonSach` với `YeuCauMuonSach` và phân tầng chưa thuần | `theodoimuonsach.*`, Controllers, Views | **Medium** | Dư thừa code chết, gây nhầm lẫn khi bảo trì nghiệp vụ mượn trả; thiếu lớp Repository/Validator tách biệt. |
| `PRV-02` | Thiếu hệ thống ghi log tập trung (Winston/Morgan) và tài liệu API (OpenAPI/JSDoc) | `backend/app.js`, Controllers/Services | **Low** | Khó truy vết lỗi sản xuất và audit hành vi duyệt/xóa dữ liệu của nhân viên; thiếu tài liệu API chuẩn. |

---

## 4. Đánh giá Rủi ro & Khuyến nghị Lộ trình Bảo trì (Góc độ PM & Maintainer)

### 4.1. Ma trận Rủi ro Dự án
1. **Rủi ro tính toàn vẹn dữ liệu & bảo mật (`COR-01`, `COR-03`, `ADP-01`):** Mức độ **Rất cao** — Nếu không xử lý đồng bộ tồn kho và middleware phân quyền JWT trước khi đưa vào sử dụng thực tế, dữ liệu số lượng sách và tài khoản độc giả dễ bị sai lệch hoặc lộ thông tin (`password`).
2. **Rủi ro kiểm thử & hồi quy (Regression):** Việc sửa `ADP-03` (chuẩn hóa tên trường JSON) và `PRV-01` (gỡ bỏ/hợp nhất `TheoDoiMuonSach`) có phạm vi tác động rộng sang các service Frontend (`sach.service.js`, `muonsach.service.js`, `formatters.js`). Cần thực hiện **sau** khi có bộ Test Case hồi quy đầy đủ (`07_TestCase.csv`).
3. **Rủi ro thiếu hụt tài liệu kế thừa (`PRV-02`):** Các file `.docx` mẫu trong `document/` đang gắn với đề tài cũ (*Euler Cycle Visualisation / CTU-Scheduler*), nếu không đối chiếu kỹ sẽ dẫn tới lệch nội dung báo cáo.

### 4.2. Thứ tự Ưu tiên Thực thi Bảo trì Đề xuất
- **Đợt 1 (Ưu tiên cao — Ổn định & Đúng nghiệp vụ):** Xử lý nhóm Corrective (`COR-01` → `COR-04`) và Server Validation (`PRF-03`).
- **Đợt 2 (Ưu tiên trung/cao — Bảo mật & Tương thích):** Xử lý `ADP-01` (JWT/RBAC + bcrypt) và `PRF-01` (MongoDB Indexes).
- **Đợt 3 (Hoàn thiện & Chuẩn hóa dài hạn):** Xử lý `ADP-03` (Payload contract), `PRF-02` (Thống kê/Excel), `PRV-01` (Refactor MVC), `PRV-02` (Logging + Swagger) và `ADP-02` (Docker/Nginx).
