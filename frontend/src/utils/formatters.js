const API_BASE_URL = "http://localhost:3000";

export const formatCurrency = (value) => {
  const num = Number(value) || 0;
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(num);
};

export const formatDate = (dateString) => {
  if (!dateString) return "Chưa cập nhật";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "Không hợp lệ";
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export const formatDateTime = (dateString) => {
  if (!dateString) return "Chưa cập nhật";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "Không hợp lệ";
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getBookImageUrl = (imagePath) => {
  if (!imagePath) {
    return "https://placehold.co/400x560/f1f5f9/64748b?text=No+Image";
  }
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }
  return `${API_BASE_URL}${imagePath}`;
};

export const handleBookImageError = (event) => {
  event.target.src =
    "https://placehold.co/400x560/f1f5f9/64748b?text=No+Image";
};

export const resolvePublisherName = (book, publishers = []) => {
  if (!book) return "Đang cập nhật";
  if (book.thongTinNXB?.tenNXB) return book.thongTinNXB.tenNXB;
  if (book.MaNXB && typeof book.MaNXB === "object" && book.MaNXB.tenNXB) {
    return book.MaNXB.tenNXB;
  }
  const found = publishers.find(
    (nxb) => nxb._id === book.MaNXB || nxb.maNXB === book.MaNXB
  );
  if (found?.tenNXB) return found.tenNXB;
  return "Chưa rõ nhà xuất bản";
};

export const resolveReaderInfo = (req, readers = []) => {
  if (req?.ThongTinDocGia) {
    const r = req.ThongTinDocGia;
    return {
      fullName: `${r.hoLot || ""} ${r.tenDocGia || ""}`.trim() || r.tenDocGia || "Độc giả",
      maDocGia: r.maDocGia || "",
      email: r.email || "",
      dienThoai: r.dienThoai || "",
    };
  }
  if (req?.MaDocGia && typeof req.MaDocGia === "object") {
    const r = req.MaDocGia;
    return {
      fullName: `${r.hoLot || ""} ${r.tenDocGia || ""}`.trim() || r.tenDocGia || "Độc giả",
      maDocGia: r.maDocGia || "",
      email: r.email || "",
      dienThoai: r.dienThoai || "",
    };
  }
  const key = req?.MaDocGia;
  if (key) {
    const found = readers.find((r) => r._id === key || r.maDocGia === key);
    if (found) {
      return {
        fullName: `${found.hoLot || ""} ${found.tenDocGia || ""}`.trim() || found.tenDocGia || "Độc giả",
        maDocGia: found.maDocGia || "",
        email: found.email || "",
        dienThoai: found.dienThoai || "",
      };
    }
  }
  return {
    fullName: "Độc giả chưa xác định",
    maDocGia: "",
    email: "",
    dienThoai: "",
  };
};

export const isOverdueBorrow = (req) => {
  if (!req || req.TrangThai !== "DaDuyet" || !req.NgayHenTra) return false;
  const due = new Date(req.NgayHenTra);
  if (Number.isNaN(due.getTime())) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  return due < today;
};

export const getBorrowStatusInfo = (status, req = null) => {
  if (req && isOverdueBorrow(req)) {
    return {
      text: "Quá hạn trả",
      description: "Đã quá ngày hẹn trả, vui lòng hoàn trả sách sớm",
      badgeClass: "status-badge status-overdue",
      icon: "fas fa-exclamation-triangle",
      step: 2,
    };
  }

  switch (status) {
    case "DangCho":
    case "ChoDuyet":
      return {
        text: "Đang chờ duyệt",
        description: "Yêu cầu đã được gửi, đang chờ thủ thư xác nhận",
        badgeClass: "status-badge status-pending",
        icon: "fas fa-clock",
        step: 1,
      };
    case "DaDuyet":
      return {
        text: "Đang mượn",
        description: "Thủ thư đã duyệt, bạn đang giữ sách",
        badgeClass: "status-badge status-borrowed",
        icon: "fas fa-book-reader",
        step: 2,
      };
    case "DaTra":
      return {
        text: "Đã trả",
        description: "Đã hoàn tất trả sách cho thư viện",
        badgeClass: "status-badge status-returned",
        icon: "fas fa-check-circle",
        step: 3,
      };
    case "TuChoi":
      return {
        text: "Từ chối",
        description: "Yêu cầu mượn sách không được chấp thuận",
        badgeClass: "status-badge status-rejected",
        icon: "fas fa-times-circle",
        step: 0,
      };
    default:
      return {
        text: status || "Không xác định",
        description: "Trạng thái không xác định",
        badgeClass: "status-badge status-neutral",
        icon: "fas fa-info-circle",
        step: 0,
      };
  }
};
