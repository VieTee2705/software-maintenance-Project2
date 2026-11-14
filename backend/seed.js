import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import "dotenv/config";

import MongoDB from "./app/utils/util.mongodb.js";
import NhaXuatBan from "./app/models/NhaXuatBan.js";
import Sach from "./app/models/Sach.js";
import DocGia from "./app/models/Docgia.js";
import NhanVien from "./app/models/NhanVien.js";
import YeuCauMuonSach from "./app/models/YeuCauMuonSach.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_DIR = path.join(__dirname, "public", "uploads");

const publishersData = [
  {
    maNXB: "NXB001",
    tenNXB: "Nhà Xuất Bản Trẻ",
    diaChi: "161B Lý Chính Thắng, Phường Võ Thị Sáu, Quận 3, TP. Hồ Chí Minh",
  },
  {
    maNXB: "NXB002",
    tenNXB: "Nhà Xuất Bản Kim Đồng",
    diaChi: "55 Quang Trung, Quận Hai Bà Trưng, Hà Nội",
  },
  {
    maNXB: "NXB003",
    tenNXB: "Nhà Xuất Bản Tổng Hợp TP.HCM",
    diaChi: "62 Nguyễn Thị Minh Khai, Quận 1, TP. Hồ Chí Minh",
  },
  {
    maNXB: "NXB004",
    tenNXB: "Nhà Xuất Bản Hội Nhà Văn (Nhã Nam)",
    diaChi: "59 Đỗ Quang, Trung Hòa, Cầu Giấy, Hà Nội",
  },
  {
    maNXB: "NXB005",
    tenNXB: "Nhà Xuất Bản Thế Giới",
    diaChi: "46 Trần Hưng Đạo, Hoàn Kiếm, Hà Nội",
  },
  {
    maNXB: "NXB006",
    tenNXB: "Prentice Hall / Sách Công Nghệ",
    diaChi: "Upper Saddle River, New Jersey, Hoa Kỳ",
  },
];

// Dữ liệu sách thật, thông tin khớp với ảnh bìa thật từ Open Library Covers (coverId đã đối chiếu theo tên & tác giả)
const booksData = [
  {
    MaSach: "S001",
    TenSach: "Đắc Nhân Tâm (How to Win Friends and Influence People)",
    TacGia: "Dale Carnegie",
    NamXuatBan: 1936,
    DonGia: 89000,
    SoQuyen: 12,
    MaNXB: "NXB003",
    coverId: 13314878,
  },
  {
    MaSach: "S002",
    TenSach: "Nhà Giả Kim (The Alchemist)",
    TacGia: "Paulo Coelho",
    NamXuatBan: 1988,
    DonGia: 79000,
    SoQuyen: 8,
    MaNXB: "NXB004",
    coverId: 7414780,
  },
  {
    MaSach: "S003",
    TenSach: "Mắt Biếc",
    TacGia: "Nguyễn Nhật Ánh",
    NamXuatBan: 2013,
    DonGia: 110000,
    SoQuyen: 10,
    MaNXB: "NXB001",
    coverId: 13258074,
  },
  {
    MaSach: "S004",
    TenSach: "Tôi Thấy Hoa Vàng Trên Cỏ Xanh",
    TacGia: "Nguyễn Nhật Ánh",
    NamXuatBan: 2018,
    DonGia: 125000,
    SoQuyen: 7,
    MaNXB: "NXB001",
    coverId: 13860354,
  },
  {
    MaSach: "S005",
    TenSach: "Cho Tôi Xin Một Vé Đi Tuổi Thơ",
    TacGia: "Nguyễn Nhật Ánh",
    NamXuatBan: 2008,
    DonGia: 85000,
    SoQuyen: 9,
    MaNXB: "NXB001",
    coverId: 8967534,
  },
  {
    MaSach: "S006",
    TenSach: "Dế Mèn Phiêu Lưu Ký",
    TacGia: "Tô Hoài",
    NamXuatBan: 2009,
    DonGia: 65000,
    SoQuyen: 15,
    MaNXB: "NXB002",
    coverId: 15204917,
  },
  {
    MaSach: "S007",
    TenSach: "Clean Code: A Handbook of Agile Software Craftsmanship",
    TacGia: "Robert C. Martin",
    NamXuatBan: 2008,
    DonGia: 320000,
    SoQuyen: 5,
    MaNXB: "NXB006",
    coverId: 8065615,
  },
  {
    MaSach: "S008",
    TenSach: "Sapiens: Lược Sử Loài Người",
    TacGia: "Yuval Noah Harari",
    NamXuatBan: 2011,
    DonGia: 210000,
    SoQuyen: 6,
    MaNXB: "NXB005",
    coverId: 8634250,
  },
  {
    MaSach: "S009",
    TenSach: "Atomic Habits (Thay Đổi Tí Hon Hiệu Quả Bất Ngờ)",
    TacGia: "James Clear",
    NamXuatBan: 2018,
    DonGia: 185000,
    SoQuyen: 11,
    MaNXB: "NXB005",
    coverId: 12539702,
  },
  {
    MaSach: "S010",
    TenSach: "Thinking, Fast and Slow (Tư Duy Nhanh Và Chậm)",
    TacGia: "Daniel Kahneman",
    NamXuatBan: 2011,
    DonGia: 230000,
    SoQuyen: 4,
    MaNXB: "NXB005",
    coverId: 13290711,
  },
  {
    MaSach: "S011",
    TenSach: "Giết Con Chim Nhại (To Kill a Mockingbird)",
    TacGia: "Harper Lee",
    NamXuatBan: 1960,
    DonGia: 135000,
    SoQuyen: 6,
    MaNXB: "NXB004",
    coverId: 14351077,
  },
  {
    MaSach: "S012",
    TenSach: "1984 (Nineteen Eighty-Four)",
    TacGia: "George Orwell",
    NamXuatBan: 1949,
    DonGia: 120000,
    SoQuyen: 0, // Để test trạng thái hết hàng
    MaNXB: "NXB004",
    coverId: 9267242,
  },
  {
    MaSach: "S013",
    TenSach: "Hoàng Tử Bé (Le Petit Prince)",
    TacGia: "Antoine de Saint-Exupéry",
    NamXuatBan: 1943,
    DonGia: 75000,
    SoQuyen: 14,
    MaNXB: "NXB002",
    coverId: 10708272,
  },
  {
    MaSach: "S014",
    TenSach: "Harry Potter và Hòn Đá Phù Thủy",
    TacGia: "J. K. Rowling",
    NamXuatBan: 1997,
    DonGia: 165000,
    SoQuyen: 3,
    MaNXB: "NXB001",
    coverId: 15155833,
  },
];

const readersData = [
  {
    maDocGia: "DG001",
    password: "123456",
    hoLot: "Lê Minh",
    tenDocGia: "Anh",
    diaChi: "123 Đường 3/2, Quận Ninh Kiều, TP. Cần Thơ",
    dienThoai: "0901234567",
    email: "minhanh@gmail.com",
    ngaySinh: new Date("2002-05-14"),
  },
  {
    maDocGia: "DG002",
    password: "123456",
    hoLot: "Phạm Hoàng",
    tenDocGia: "Nam",
    diaChi: "45 Mậu Thân, Quận Ninh Kiều, TP. Cần Thơ",
    dienThoai: "0912345678",
    email: "hoangnam@gmail.com",
    ngaySinh: new Date("2001-11-20"),
  },
  {
    maDocGia: "DG003",
    password: "123456",
    hoLot: "Nguyễn Thảo",
    tenDocGia: "Vy",
    diaChi: "78 Nguyễn Văn Cừ, Quận Bình Thủy, TP. Cần Thơ",
    dienThoai: "0987654321",
    email: "thaovy@gmail.com",
    ngaySinh: new Date("2003-03-08"),
  },
  {
    maDocGia: "DG004",
    password: "123456",
    hoLot: "Trần Quốc",
    tenDocGia: "Bảo",
    diaChi: "12 Trần Hưng Đạo, Quận 1, TP. Hồ Chí Minh",
    dienThoai: "0934567890",
    email: "quocbao@gmail.com",
    ngaySinh: new Date("1999-09-25"),
  },
];

const staffData = [
  {
    MSNV: "NV001",
    HoTenNV: "Nguyễn Văn Quản Trị",
    Password: "admin12345",
    Chucvu: "admin",
    Diachi: "01 Lý Tự Trọng, Quận Ninh Kiều, TP. Cần Thơ",
    SoDienThoai: "0909000111",
  },
  {
    MSNV: "NV002",
    HoTenNV: "Trần Thị Thủ Thư",
    Password: "staff12345",
    Chucvu: "nhanvien",
    Diachi: "22 Ngô Quyền, Quận Ninh Kiều, TP. Cần Thơ",
    SoDienThoai: "0909000222",
  },
];

async function downloadBookCover(maSach, coverId) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  const fileName = `seed-${maSach}.jpg`;
  const filePath = path.join(UPLOADS_DIR, fileName);
  const publicPath = `/uploads/${fileName}`;
  const coverUrl = `https://covers.openlibrary.org/b/id/${coverId}-L.jpg?default=false`;

  if (fs.existsSync(filePath) && fs.statSync(filePath).size > 2000) {
    return publicPath;
  }

  try {
    const response = await fetch(coverUrl, {
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.startsWith("image/")) {
      throw new Error(`Không phải file ảnh (${contentType})`);
    }
    const buffer = Buffer.from(await response.arrayBuffer());
    if (buffer.length < 1000) {
      throw new Error(`Ảnh quá nhỏ (${buffer.length} bytes)`);
    }
    fs.writeFileSync(filePath, buffer);
    console.log(`   📷 Đã tải ảnh bìa ${maSach}: ${fileName} (${Math.round(buffer.length / 1024)} KB)`);
    return publicPath;
  } catch (err) {
    console.warn(`   ⚠️ Không tải được ảnh local cho ${maSach} (${err.message}), dùng URL trực tiếp.`);
    return `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`;
  }
}

async function seed() {
  try {
    await MongoDB.connect();

    console.log("🧹 Đang xóa dữ liệu cũ...");
    await Promise.all([
      YeuCauMuonSach.deleteMany({}),
      Sach.deleteMany({}),
      NhaXuatBan.deleteMany({}),
      DocGia.deleteMany({}),
      NhanVien.deleteMany({}),
    ]);

    console.log("🏢 Đang thêm Nhà Xuất Bản...");
    await NhaXuatBan.insertMany(publishersData);

    console.log("📥 Đang tải ảnh bìa sách thật từ Open Library...");
    const preparedBooks = [];
    for (const item of booksData) {
      const hinhAnh = await downloadBookCover(item.MaSach, item.coverId);
      const { coverId, ...bookDoc } = item;
      preparedBooks.push({
        ...bookDoc,
        HinhAnh: hinhAnh,
      });
    }

    console.log("📚 Đang thêm Sách...");
    await Sach.insertMany(preparedBooks);

    console.log("👤 Đang thêm Độc Giả & Nhân Viên...");
    const insertedReaders = await DocGia.insertMany(readersData);
    await NhanVien.insertMany(staffData);

    const now = new Date();
    const daysOffset = (d) => new Date(now.getTime() + d * 86400000);

    console.log("📝 Đang thêm Yêu Cầu Mượn Sách mẫu...");
    const borrowRequestsData = [
      {
        MaDocGia: "DG001",
        DanhSachSach: [
          { MaSach: "S001", TenSach: "Đắc Nhân Tâm (How to Win Friends and Influence People)", SoLuong: 2 },
          { MaSach: "S003", TenSach: "Mắt Biếc", SoLuong: 1 },
        ],
        NgayYeuCau: daysOffset(-2),
        NgayHenTra: daysOffset(5),
        TrangThai: "DangCho",
      },
      {
        MaDocGia: "DG002",
        DanhSachSach: [
          { MaSach: "S007", TenSach: "Clean Code: A Handbook of Agile Software Craftsmanship", SoLuong: 1 },
          { MaSach: "S008", TenSach: "Sapiens: Lược Sử Loài Người", SoLuong: 1 },
        ],
        NgayYeuCau: daysOffset(-5),
        NgayHenTra: daysOffset(2),
        TrangThai: "DaDuyet",
      },
      {
        MaDocGia: "DG001",
        DanhSachSach: [
          { MaSach: "S006", TenSach: "Dế Mèn Phiêu Lưu Ký", SoLuong: 1 },
          { MaSach: "S013", TenSach: "Hoàng Tử Bé (Le Petit Prince)", SoLuong: 1 },
        ],
        NgayYeuCau: daysOffset(-15),
        NgayHenTra: daysOffset(-8),
        TrangThai: "DaTra",
      },
      {
        MaDocGia: "DG003",
        DanhSachSach: [
          { MaSach: "S012", TenSach: "1984 (Nineteen Eighty-Four)", SoLuong: 1 },
        ],
        NgayYeuCau: daysOffset(-3),
        NgayHenTra: daysOffset(4),
        TrangThai: "TuChoi",
      },
      {
        // Bản ghi mô phỏng lỗi FE-01 (Cart.vue lưu _id thay vì maDocGia)
        MaDocGia: insertedReaders[3]._id.toString(),
        DanhSachSach: [
          { MaSach: "S009", TenSach: "Atomic Habits (Thay Đổi Tí Hon Hiệu Quả Bất Ngờ)", SoLuong: 1 },
        ],
        NgayYeuCau: daysOffset(-1),
        NgayHenTra: daysOffset(6),
        TrangThai: "DangCho",
      },
    ];

    await YeuCauMuonSach.insertMany(borrowRequestsData);

    console.log("\n✅ Đổ dữ liệu thành công!");
    console.log(`   - Nhà xuất bản : ${publishersData.length}`);
    console.log(`   - Đầu sách     : ${preparedBooks.length}`);
    console.log(`   - Độc giả      : ${readersData.length}`);
    console.log(`   - Nhân viên    : ${staffData.length}`);
    console.log(`   - Phiếu mượn   : ${borrowRequestsData.length}`);
    console.log("\n🔑 Tài khoản đăng nhập mẫu (/dangnhap):");
    console.log("   - Admin     : NV001 / admin12345");
    console.log("   - Nhân viên : NV002 / staff12345");
    console.log("   - Độc giả   : minhanh@gmail.com / 123456");
  } catch (error) {
    console.error("❌ Lỗi khi đổ dữ liệu:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seed();
