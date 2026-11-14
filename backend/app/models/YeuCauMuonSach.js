// models/YeuCauMuonSach.js
import mongoose from "mongoose";

const ChiTietSachSchema = new mongoose.Schema(
  {
    MaSach: { type: String, required: true },
    TenSach: { type: String },
    SoLuong: { type: Number, required: true, default: 1 },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

ChiTietSachSchema.virtual("ThongTinSach", {
  ref: "Sach",
  localField: "MaSach",
  foreignField: "MaSach",
  justOne: true,
});

const YeuCauMuonSachSchema = new mongoose.Schema(
  {
    MaDocGia: { type: String, required: true },

    DanhSachSach: [ChiTietSachSchema],
    NgayYeuCau: { type: Date, default: Date.now },
    NgayHenTra: { type: Date },
    TrangThai: {
      type: String,
      enum: ["DangCho", "DaDuyet", "DaTra", "TuChoi"],
      default: "DangCho",
    },
  },
  {
    // 2. QUAN TRỌNG: Bật virtuals
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

YeuCauMuonSachSchema.virtual("ThongTinDocGia", {
  ref: "DocGia",
  localField: "MaDocGia",
  foreignField: "maDocGia",
  justOne: true,
});

const YeuCauMuonSach = mongoose.model("YeuCauMuonSach", YeuCauMuonSachSchema);
export default YeuCauMuonSach;
