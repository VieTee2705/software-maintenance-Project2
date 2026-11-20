# Đánh giá (Review) 02 Tài liệu Mới trong `Document/raw/`

**Vai trò đánh giá:** Kỹ sư Bảo trì Phần mềm & Kỹ sư Quản lý Dự án Phần mềm  
**Ngày đánh giá:** 20/11/2026  
**Đối tượng rà soát:**
1. [tailieu-dactabaotri.docx](file:///D:/Download/BAITAPLON/QLThuVien/Document/raw/tailieu-dactabaotri.docx) — *Đặc tả Yêu cầu Phần mềm Bảo trì*
2. [Thiet_ke_phan_mem_bao_tri_QLThuVien_theo_mau_Nhom30.docx](file:///D:/Download/BAITAPLON/QLThuVien/Document/raw/Thiet_ke_phan_mem_bao_tri_QLThuVien_theo_mau_Nhom30.docx) — *Thiết kế Phần mềm Bảo trì*

**Căn cứ đối chiếu:** [DactaYCTD_Nhom30.docx](file:///D:/Download/BAITAPLON/QLThuVien/Document/DactaYCTD_Nhom30.docx), [ThietkeYCTD_Nhom30.docx](file:///D:/Download/BAITAPLON/QLThuVien/Document/ThietkeYCTD_Nhom30.docx), [bug-list.md](file:///D:/Download/BAITAPLON/QLThuVien/bug-list.md), [01_Review_DuAn_BaoTri.md](file:///D:/Download/BAITAPLON/QLThuVien/Document/ref/01_Review_DuAn_BaoTri.md) và mã nguồn `QLThuVien`.

---

## 1. Tổng hợp Chấm điểm Nhanh (Executive Scorecard)

| Tiêu chí đánh giá | `tailieu-dactabaotri.docx` | `Thiet_ke_..._QLThuVien_...docx` |
|---|---|---|
| **Mức độ tuân thủ bố cục mẫu** | **9/10** (đủ 3 chương chuẩn mẫu) | **9.5/10** (đủ 5 chương, 64 bảng, 3 hình) |
| **Độ bao phủ 12 hạng mục bảo trì** | **10/10** (đủ `COR-01..PRV-02`) | **10/10** (đủ `REQ01..REQ12` ↔ `COR-01..PRV-02`) |
| **Độ chính xác kỹ thuật so với mã nguồn** | **8.5/10** (sát nghiệp vụ, còn thiếu UML) | **9.5/10** (rất sát thực tế Express/Mongoose/Vue) |
| **Hình thức, trình bày & biên tập** | **6.5/10** (còn placeholder, trống bảng phiên bản, lỗi chính tả) | **7.5/10** (còn từ "trong ZIP", trích dẫn mẫu Nhóm 30, TOC tĩnh) |
| **Trạng thái đề xuất** | **Cần chỉnh sửa nhỏ (Minor Revision)** trước khi nộp | **Cần biên tập hoàn thiện (Polish)** trước khi nộp |

---

## 2. Đánh giá Chi tiết Tài liệu 1: `tailieu-dactabaotri.docx`

### 2.1. Điểm mạnh
- **Bám sát cấu trúc mẫu `DactaYCTD_Nhom30.docx`:** Đầy đủ 3 chương lớn (`1. Giới thiệu`, `2. Yêu cầu của khách hàng` phân rõ `2.1 Yêu cầu chức năng` & `2.2 Yêu cầu phi chức năng`, `3. Các tính năng của hệ thống đề nghị` tách `3.1 Điều chỉnh` và `3.2 Mới`).
- **Bao phủ trọn vẹn 12 hạng mục bảo trì:** Tất cả `COR-01`..`COR-04`, `ADP-01`..`ADP-03`, `PRF-01`..`PRF-03`, `PRV-01`..`PRV-02` đều được phân loại hợp lý giữa `[ĐIỀU CHỈNH]` và `[MỚI]`, có bảng nhóm người đọc và bảng chú giải thuật ngữ (9 thuật ngữ).
- **Trình bày luồng nghiệp vụ rõ ràng:** Các mục chương 3 mô tả rõ vai trò, điều kiện kích hoạt và luồng xử lý chính cho từng hạng mục.

### 2.2. Các lỗi & tồn đọng cần khắc phục

| Mức độ | Vị trí | Mô tả vấn đề phát hiện | Hành động khuyến nghị |
|---|---|---|---|
| **Cao** | Trang bìa phụ (`P26`–`P27`) | Trùng lặp trang bìa (có cả bìa CTU ở đầu và bìa phụ kiểu `ByLine`), trong đó bìa phụ còn sót placeholder **`Phiên bản X.X được phê chuẩn`** và dòng **`Được chuẩn bị bởi`** bị bỏ trống. | Bỏ bìa phụ trùng lặp hoặc điền đủ `Phiên bản 1.0`, tên nhóm/thành viên thực hiện. |
| **Cao** | Bảng Theo dõi phiên bản (`Table 1`) | Bảng gồm 4 cột (`Tên | Ngày | Lý do thay đổi | Phiên bản`) nhưng **dòng dữ liệu bị bỏ trống hoàn toàn**. | Bổ sung ít nhất dòng phiên bản `1.0` với ngày cập nhật (`11/2026`), người lập và lý do khởi tạo tài liệu. |
| **Cao** | Mục `1.5 Tài liệu tham khảo` (`P52`) | Ghi sai mã yêu cầu **`ADA-01 và ADA-02`** (đúng là `ADP-01`, `ADP-02`) và còn sót ghi chú nháp **`[cần sửa lại...]`** trong văn bản (tổng cộng 2 chỗ chứa cụm `cần sửa`). | Sửa `ADA-01/ADA-02` → `ADP-01/ADP-02`, rà soát liệt kê đủ 12 mã và xóa toàn bộ ghi chú nháp. |
| **Trung bình** | Trang bìa (`Table 0`, `P18`) | Sai chính tả **`Giảng viên hướng đẫn`** ("đẫn" → "dẫn"), **`T.S Huỳnh Quang Nghi`** (chuẩn là `TS. Huỳnh Quang Nghi`), MSSV `Đào Quốc Việt` bị cắt cụt chỉ còn **`B230`**, ngày bìa ghi `Cần Thơ , tháng 7 năm 2026` (thừa khoảng trắng trước dấu phẩy và lệch mốc tháng 11/2026). | Chuẩn hóa chính tả, điền đầy đủ MSSV 8 ký tự cho `Đào Quốc Việt` và đồng bộ mốc thời gian `tháng 11 năm 2026`. |
| **Trung bình** | Chương 3 (`P114`) | Tài liệu chỉ có **1 hình ảnh** (logo trang bìa), chưa bổ sung sơ đồ Use Case tổng quát hoặc sơ đồ luồng nghiệp vụ mượn–trả (`COR-01`). | Bổ sung tối thiểu 01 sơ đồ Use Case hệ thống `QLThuVien` và 01 sơ đồ trạng thái phiếu mượn (`DangCho → DaDuyet → DaTra / TuChoi`). |
| **Thấp** | Toàn văn bản | Chưa có Header/Footer đánh số trang; Mục lục (`P32`) chưa có trường TOC tự động. | Chèn Header/Footer đồng bộ với tài liệu Thiết kế và cập nhật Mục lục tự động (`Update Field`). |

---

## 3. Đánh giá Chi tiết Tài liệu 2: `Thiet_ke_phan_mem_bao_tri_QLThuVien_theo_mau_Nhom30.docx`

### 3.1. Điểm mạnh
- **Độ sâu kỹ thuật xuất sắc:** Đạt chuẩn 5 chương theo mẫu `ThietkeYCTD_Nhom30.docx`, có **64 bảng biểu** và **3 hình minh họa**, có Header (`THIẾT KẾ PHẦN MỀM BẢO TRÌ | QLThuVien`) và Footer chỉn chu.
- **Đối chiếu chính xác mã nguồn `QLThuVien`:**
  - Chỉ đúng `PUT /api/sach/:id` đã khai báo `upload.single("HinhAnh")` nhưng `sach.controller.update` bỏ qua `req.file` (`COR-04`).
  - Nêu chính xác ràng buộc triển khai MongoDB Replica Set khi dùng multi-document transaction cho trừ/cộng `SoQuyen` (`COR-01`), và đề xuất phương án bù trừ nếu chạy standalone.
  - Mô tả đầy đủ từ điển dữ liệu cho cả 6 collection (`Sach`, `NhaXuatBan`, `DocGia`, `NhanVien`, `YeuCauMuonSach`, `TheoDoiMuonSach`) cùng định hướng di trú/ngừng ghi `TheoDoiMuonSach` (`PRV-01`).
- **Truy vết đầy đủ:** Chương 5 (`Table 63`) lập ma trận truy vết 12/12 hạng mục `REQ01`–`REQ12` tương ứng `COR-01`..`PRV-02`.

### 3.2. Các lỗi & tồn đọng cần khắc phục

| Mức độ | Vị trí | Mô tả vấn đề phát hiện | Hành động khuyến nghị |
|---|---|---|---|
| **Cao** | Bảng Theo dõi phiên bản (`Table 1`) & Phê duyệt (`Table 3`) | Còn chữ placeholder **`Nhóm thực hiện (điền tên)`**, các dòng dấu chấm **`........................`** và trạng thái **`Chưa xác nhận`** / **`Chưa phê duyệt`**. | Điền tên thành viên phụ trách thực tế (`Đào Quốc Việt`, `Đặng Chí Trung`, `Triệu Tấn Tài`) và tên GVHD `TS. Huỳnh Quang Nghi`. |
| **Cao** | Mục `1.5 Tài liệu tham khảo` (`P65`, `P68`) & toàn văn bản | Trích dẫn tên tài liệu nháp **`"Đặc tả QLThuVien – Kết hợp 3 mẫu"`** và trích dẫn bài mẫu nhóm khác **`"Nhóm 30, ThietkeYCTD_Nhom30.docx"`**; ngoài ra xuất hiện **5 lần cụm từ `"trong ZIP"`** (ví dụ: *"đối chiếu toàn bộ ZIP"*, *"Chưa có Dockerfile... trong ZIP"*). | Đổi tham khảo `[1]` thành tên chính thức *"Đặc tả Yêu cầu Phần mềm Bảo trì – Hệ thống QLThuVien"*, bỏ trích dẫn `"Nhóm 30"`, thay toàn bộ `"trong ZIP"` bằng `"trong kho mã nguồn dự án QLThuVien"`. |
| **Trung bình** | Trang bìa (`Table 0`, `P20`) | Cùng lỗi với Tài liệu 1: **`Giảng viên hướng đẫn`**, **`T.S Huỳnh Quang Nghi`**, MSSV `Đào Quốc Việt` bị thiếu (`B230`), bìa ghi `tháng 7 năm 2026` trong khi bảng phiên bản ghi `16/11/2026`. | Sửa lỗi chính tả, bổ sung đủ MSSV và thống nhất ngày lập `11/2026`. |
| **Trung bình** | Mục lục (`P22`–`P41`) | Mục lục được **gõ tay tĩnh** bằng chuỗi dấu chấm `. . .` kèm số trang cố định (`3..25`), rất dễ lệch trang khi mở trên máy khác hoặc chỉnh sửa văn bản. | Xóa danh sách gõ tay và chèn Automatic Table of Contents của Microsoft Word. |
| **Thấp** | Chương 5 (`Table 63`) & đồng bộ mã với Tài liệu Đặc tả | Cột `Đáp ứng phần mềm` cả 12 dòng ghi `"Chưa xác minh chạy thử"`. Ngoài ra tài liệu dùng song song `REQ01..REQ12` trong khi tài liệu Đặc tả chỉ dùng `COR-01..PRV-02`. | Sau khi chạy kiểm thử baseline (theo `TaiLieuKiemThu_QLThuVien.docx`), cập nhật trạng thái xác minh; bổ sung ghi chú quy đổi `REQ01..12 ↔ COR/ADP/PRF/PRV` ở mục `1.6` của tài liệu Đặc tả để đồng bộ 100%. |

---

## 4. Khuyến nghị Hành động Tiếp theo (Checklist Hoàn thiện Trước Nộp)
1. **Đồng bộ thông tin hành chính trên cả 5 tài liệu `.docx`:** Thống nhất họ tên & đầy đủ MSSV 3 thành viên (`Đào Quốc Việt`, `Đặng Chí Trung – B2303854`, `Triệu Tấn Tài – B2303846`), `TS. Huỳnh Quang Nghi`, học phần `CT244 – Bảo trì phần mềm`, mốc thời gian `11/2026`.
2. **Làm sạch toàn bộ dấu vết nháp:** Xóa `X.X`, `ADA-01`, `[cần sửa...]`, `trong ZIP`, `Nhóm thực hiện (điền tên)` và tên tham khảo `Nhóm 30`.
3. **Liên kết chặt bộ 5 tài liệu:** Sử dụng 03 tài liệu vừa biên soạn mới (`KehoachBT_QLThuVien.docx`, `PhanCongChiTiet_QLThuVien.docx`, `TaiLieuKiemThu_QLThuVien.docx`) để đồng bộ mã yêu cầu, lịch trình và bằng chứng kiểm thử vào báo cáo tổng hợp `Project2_BaoCao`.
