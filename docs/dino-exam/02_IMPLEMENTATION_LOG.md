# DINO EXAM RUNNER — NHẬT KÝ TRIỂN KHAI (IMPLEMENTATION LOG)

**Dự án:** Website cá nhân Hữu Tài Genz  
**Phiên bản:** v1.0.0  
**Ngày thực hiện:** 16/10/2026  
**Trạng thái Build:** ✅ Compiled Successfully (0 errors, 0 warnings)  

---

## 1. Nhật ký Thay đổi Chi tiết

### Bước 1: Khảo sát Hiện trạng & Lập Baseline (Phase 0)
- **Tác vụ:** Kiểm tra Git, package manager, Next.js App Router, Tailwind v4, cơ sở dữ liệu Vercel Blob và các route website.
- **Tệp tạo:** `docs/dino-exam/00_REPOSITORY_BASELINE.md`.
- **Kết quả:** Xác nhận repository hoạt động sạch sẽ trên nhánh `main`, sẵn sàng tích hợp mà không làm gián đoạn bất kỳ tính năng hiện có nào.

### Bước 2: Thiết lập Ngân hàng Câu hỏi & Kiểm thử Dữ liệu (Phase 3 - Data First)
- **Tác vụ:** Khởi tạo `lib/dino-exam/types.ts` và `lib/dino-exam/questions.ts`.
- **Bảo toàn dữ liệu:** Giữ nguyên 100% văn phong, thuật ngữ, lĩnh vực, ba lựa chọn (A - Đi thẳng, B - Nhảy, C - Cúi), đáp án và giải thích cho toàn bộ 20 câu hỏi do người dùng cung cấp.
- **Tệp tạo:** `tests/dino-exam/verify-questions.mjs`.
- **Kết quả:** Chạy kiểm thử tự động, xác nhận 20 câu hỏi độc nhất, max score 100 điểm, phân bổ chuẩn xác: 7 Đi thẳng, 7 Nhảy, 6 Cúi.

### Bước 3: Động cơ Game Pixel Art & Hệ thống Theme/Palette (Phase 1 & 2)
- **Tác vụ:**
  - `lib/dino-exam/constants.ts`: Định nghĩa 6 bảng màu Pixel Art (Emerald, Amber, Cyan, Amethyst, Ruby, Obsidian) và 5 bản đồ Parallax (Sa mạc, Băng tuyết, Núi lửa, Đồng cỏ, Đô thị).
  - `lib/dino-exam/audio.ts`: Lập trình bộ tổng hợp âm thanh Web Audio API thuần túy (SFX & Chiptune BGM), không phụ thuộc tệp âm thanh bên ngoài, chống nghẽn mạng và tuân thủ Autoplay Policy.
  - `components/dino-exam/DinoCanvas.tsx`: Vẽ T-Rex 2D Pixel Art với đầy đủ chu kỳ hoạt ảnh (chạy, nhảy parabol, cúi thấp người, va chạm mắt chữ X, ăn mừng), nền Parallax đa tầng cuộn độc lập theo tốc độ và cơ chế phát hiện va chạm chướng ngại vật theo thời gian thực (60 FPS).
  - `components/dino-exam/QuestionOverlay.tsx`: Thiết kế đồng hồ đếm ngược 10 giây trực quan, khóa nút bấm trong giai đoạn Reading, hiển thị đồng thời 3 hành động cùng phím tắt trong giai đoạn Choosing.

### Bước 4: Màn hình Kết thúc & Giấy Chứng Nhận Tự Động (Phase 5)
- **Tác vụ:**
  - `components/dino-exam/GameOverModal.tsx`: Thông báo thất bại, chỉ rõ câu đã chọn, đáp án đúng và trích dẫn nguyên văn giải thích chuyên môn khảo thí.
  - `lib/dino-exam/certificate.ts`: Vẽ Giấy Chứng Nhận hoàn thành trò chơi trên HTML5 Canvas (1600x1100 px), hoa văn viền vàng, logo và thương hiệu website Hữu Tài Genz, kèm tuyên bố miễn trừ: “Giấy chứng nhận hoàn thành trò chơi — không phải chứng chỉ chuyên môn” và xuất tệp PNG tức thì.

### Bước 5: Điều phối Game FSM & Tích hợp Trang Chủ (Phase 4)
- **Tác vụ:**
  - `components/dino-exam/DinoGame.tsx`: Quản lý Finite State Machine (`READY` -> `READING` -> `CHOOSING` -> `EXECUTING` -> `CORRECT_TRANSITION` -> `GAME_OVER`/`VICTORY`), lắng nghe phím tắt bàn phím toàn cục (A, W/Space, S) và bộ điều khiển âm lượng.
  - `app/page.tsx`: Nâng cấp Hero Section thành bố cục 2 cột chuyên nghiệp trên Desktop (Cột trái: Thông tin chuyên gia Hữu Tài Genz, CTAs, chỉ số; Cột phải: Bàn điều khiển game tương tác Dino Exam Runner). Trên thiết bị di động, bố cục xếp tầng dọc mượt mà.

### Bước 6: Kiểm thử & Biên dịch Toàn diện (Phase 6 & 7)
- **Tác vụ:** Chạy `npm run build` trên Next.js 16.3.4 (Turbopack).
- **Kết quả:** Biên dịch thành công 100% trong 12.0s, kiểm tra TypeScript không có lỗi nào, tất cả các route tĩnh và động hoạt động bình thường.
