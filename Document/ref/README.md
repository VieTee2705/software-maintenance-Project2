# Thư mục Tài liệu Tham chiếu Bảo trì & Quản lý Dự án (`document/ref/`)

Thư mục này chứa toàn bộ tài liệu phân tích kỹ thuật, quản lý dự án và bộ bảng dữ liệu kiểm thử chuẩn hóa cho hệ thống **Quản lý Thư viện (`QLThuVien`)**, dùng làm nguồn dữ liệu gốc (Single Source of Truth) để biên soạn và hoàn thiện các tài liệu `.docx` trong thư mục [document/](../).

---

## Danh mục tài liệu

| Tệp tài liệu | Định dạng | Vai trò biên soạn | Mục đích sử dụng |
|---|---|---|---|
| [01_Review_DuAn_BaoTri.md](01_Review_DuAn_BaoTri.md) | Markdown (`.md`) | Kỹ sư bảo trì phần mềm | Đánh giá tổng quan kiến trúc, review mã nguồn Frontend/Backend, phân tích 12 hạng mục bảo trì (`COR`, `ADP`, `PRF`, `PRV`) và tác động kỹ thuật. |
| [02_KeHoach_VietTaiLieu.md](02_KeHoach_VietTaiLieu.md) | Markdown (`.md`) | Kỹ sư quản lý dự án & Kỹ sư bảo trì | Kế hoạch chuyển đổi và biên soạn đầy đủ 7 tài liệu `.docx` trong `document/`, ánh xạ đề cương, quy chuẩn đánh mã và lịch trình M1–M4. |
| [03_BangPhanCong_CongViec.csv](03_BangPhanCong_CongViec.csv) | CSV (`.csv`) | Kỹ sư quản lý dự án | Bảng phân công công việc theo WBS, ma trận RACI, đầu ra bàn giao và cột mốc thực hiện cho nhóm. |
| [04_DanhSach_YeuCauChucNang.csv](04_DanhSach_YeuCauChucNang.csv) | CSV (`.csv`) | Kỹ sư quản lý dự án & BA | Danh sách toàn bộ yêu cầu chức năng hiện hữu (`FR`) và yêu cầu bảo trì/thay đổi (`CR`/`COR`/`ADP`/`PRF`/`PRV`). |
| [05_TestPlan.csv](05_TestPlan.csv) | CSV (`.csv`) | Kỹ sư kiểm thử & Bảo trì | Bảng kế hoạch kiểm thử theo chu kỳ/phân hệ (`TP-01`..`TP-10`), phạm vi, tiêu chí đạt/không đạt, môi trường và rủi ro. |
| [06_TestScenario.csv](06_TestScenario.csv) | CSV (`.csv`) | Kỹ sư kiểm thử & Bảo trì | Danh sách kịch bản kiểm thử (`TS-01`..`TS-24`) liên kết chéo với `TestPlan` và `YeuCauChucNang`. |
| [07_TestCase.csv](07_TestCase.csv) | CSV (`.csv`) | Kỹ sư kiểm thử & Bảo trì | Bộ Test Case chi tiết (`TC-01`..`TC-42`) phủ cả luồng chức năng Frontend đã sửa và ca tái hiện 12 lỗi/hạng mục bảo trì. |

---

## Quy ước & Hướng dẫn sử dụng

1. **Định dạng `.csv`:** Tất cả file `.csv` được mã hóa **UTF-8 with BOM**, dấu phân tách `,`, bao ngoặc kép `"` với chuỗi chứa dấu phẩy hoặc xuống dòng — có thể mở trực tiếp bằng Microsoft Excel hoặc Google Sheets mà không lỗi font tiếng Việt.
2. **Truy vết liên tài liệu (Traceability):**
   - `Ma_Yeu_Cau` (`FR-xx`, `COR-xx`, `ADP-xx`, `PRF-xx`, `PRV-xx`) xuất phát từ `04_DanhSach_YeuCauChucNang.csv` và [bug-list.md](../../bug-list.md).
   - `05_TestPlan.csv` → `06_TestScenario.csv` (`Ma_TP`) → `07_TestCase.csv` (`Ma_TS`, `Ma_TP`, `Ma_Yeu_Cau`).
3. **Dữ liệu kiểm thử mẫu:** Sử dụng kịch bản `npm run seed` tại [backend/seed.js](../../backend/seed.js) (6 NXB `NXB001`–`NXB006`, 14 đầu sách `S001`–`S014`, 4 độc giả `DG001`–`DG004`, 2 nhân viên `NV001` admin & `NV002` nhanvien).
