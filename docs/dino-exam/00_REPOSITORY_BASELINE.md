# DINO EXAM RUNNER — REPOSITORY BASELINE & ARCHITECTURE AUDIT

**Dự án:** Website cá nhân Hữu Tài Genz  
**Production URL:** https://huutaigenz.vercel.app/  
**Thời gian lập:** 16/10/2026  
**Tác giả:** Senior Full-stack Engineer & Game Integration Architect  

---

## 1. Cấu trúc và Kiến trúc Hiện tại của Website

### 1.1. Công nghệ nền tảng (Stack)
- **Framework:** Next.js 16.3.4 (App Router, Turbopack support)
- **UI Library:** React 19.2.8 / React DOM 19.2.8
- **Styling:** Tailwind CSS v4 (`@tailwindcss/postcss`, `tailwindcss: ^4`) với CSS variables cho typography
- **Typography:** Google Fonts qua `next/font/google`: Inter (`--font-inter`) và Playfair Display (`--font-playfair`)
- **Animation & Icons:** `framer-motion` (v12.12.1), `lucide-react` (v0.511.0)
- **Data & Storage:** 
  - `@vercel/blob` (v2.8.0) cho cơ sở dữ liệu động và tệp media
  - `@supabase/supabase-js` (v2.49.4) & `@aws-sdk/client-s3` sẵn sàng cho mở rộng
- **Rich Text Editor (Admin):** Tiptap editor (`@tiptap/react`, extensions)

### 1.2. Cấu trúc Routing (App Router)
- `app/layout.tsx`: Root layout bọc toàn bộ trang với `EduBackground`, `Header`, `Footer`.
- `app/page.tsx`: Server Component trang chủ (dynamic = 'force-dynamic', revalidate = 0). Tải danh sách phần mềm và blog từ `@/lib/supabase` (thực tế nối với Vercel Blob store) và render Hero Section, 4 Phần mềm tiêu biểu, 3 Bài viết chuyên môn, và Form liên hệ.
- `app/phan-mem/`: Danh sách và chi tiết phần mềm (`app/phan-mem/[slug]`).
- `app/blog/`: Danh sách và chi tiết bài viết (`app/blog/[slug]`).
- `app/admin/`: Khu vực quản trị phần mềm, bài viết, và tài nguyên.
- `app/api/`: Các endpoint API quản trị, tải lên và cập nhật dữ liệu.

### 1.3. Tình trạng Git và Nhánh
- **Branch:** `main`
- **Trạng thái:** Clean working tree, không có uncommitted changes.
- **Vercel Project:** `huutaigenz` (ID: `prj_RfBNmyqk36icWygeBGjQEOvz56q0`).

---

## 2. Phạm vi Thay đổi & Danh sách Tệp

### 2.1. Tệp được thêm mới (Zero Collision)
Toàn bộ logic trò chơi được đóng gói độc lập trong các thư mục riêng biệt:
- `lib/dino-exam/questions.ts`: Ngân hàng 20 câu hỏi khảo thí bảo toàn nguyên văn.
- `lib/dino-exam/types.ts`: Định nghĩa kiểu dữ liệu FSM, Question, Obstacle, Theme, Customization.
- `lib/dino-exam/audio.ts`: Procedural Web Audio API sound engine (SFX & chiptune BGM).
- `lib/dino-exam/certificate.ts`: Canvas engine vẽ Giấy Chứng Nhận chất lượng cao và xuất PNG.
- `components/dino-exam/DinoGame.tsx`: Container component giao diện điều khiển, HUD, modal, controls.
- `components/dino-exam/DinoCanvas.tsx`: Canvas pixel art renderer (T-Rex animation, 5 parallax maps, obstacles, collision).
- `components/dino-exam/QuestionOverlay.tsx`: Giao diện hiển thị câu hỏi, đếm ngược 10 giây, và 3 nút lựa chọn hành động.
- `components/dino-exam/GameOverModal.tsx`: Modal kết thúc ván chơi với giải thích câu hỏi và điểm số.
- `components/dino-exam/VictoryModal.tsx`: Modal chiến thắng 100/100, hiệu ứng ăn mừng và nút tải Giấy Chứng Nhận.
- `components/dino-exam/CustomizerModal.tsx`: Modal tùy biến tên chú khủng long và bảng màu.
- `tests/dino-exam/questions.test.ts`: Script kiểm thử tự động xác thực ngân hàng câu hỏi.

### 2.2. Tệp được cập nhật (Tích hợp có kiểm soát)
- `app/page.tsx`:
  - Chuyển đổi Hero Section sang cấu trúc 2 cột linh hoạt (Desktop: Cột trái chứa thông tin chuyên gia Hữu Tài Genz + CTAs + Metrics; Cột phải nhúng bảng điều khiển Dino Exam Runner; Mobile: xếp chồng dọc mượt mà).
  - Giữ nguyên vẹn 100% các section phía dưới: Phần Mềm Khảo Thí, Bài Viết Chuyên Môn, Hợp Tác & Tư Vấn Khảo Thí.

### 2.3. Tệp tuyệt đối KHÔNG can thiệp
- `app/layout.tsx`: Giữ nguyên typography, metadata, `EduBackground`, `Header`, `Footer`.
- `app/phan-mem/**`: Không sửa đổi bất kỳ logic hay giao diện phần mềm nào.
- `app/blog/**`: Không sửa đổi bài viết.
- `app/admin/**`: Không can thiệp CMS, admin routes, mật khẩu hay logic lưu trữ.
- `lib/store.ts`, `lib/supabase.ts`, `lib/mockData.ts`: Giữ nguyên dữ liệu Vercel Blob của website.

---

## 3. Phân tích Rủi ro & Giải pháp Phòng ngừa

| Rủi ro | Mức độ | Biện pháp kiểm soát & giải quyết |
| :--- | :---: | :--- |
| **Ảnh hưởng Bundle Size & Tốc độ tải** | Thấp | Không dùng thư viện game nặng (như Phaser ~1MB+). Sử dụng HTML5 Canvas thuần túy và TypeScript. Kích thước thêm vào < 45KB. |
| **Autoplay Audio bị trình duyệt chặn** | Trung bình | Sử dụng Web Audio API và chỉ khởi tạo / kích hoạt `AudioContext` sau tương tác đầu tiên của người dùng (nhấn nút Chơi hoặc Bật âm thanh). |
| **Tràn bộ nhớ (Memory Leak) từ game loop** | Trung bình | Đảm bảo hủy `requestAnimationFrame`, gỡ toàn bộ `eventListener` bàn phím và đóng `AudioContext` khi component unmount. |
| **Lỗi Hydration trên Next.js App Router** | Thấp | Game client-side sử dụng `'use client'` và component loading state thích hợp. |
| **Lệch layout trên màn hình điện thoại (<768px)** | Trung bình | Thiết kế responsive canvas co giãn tự động theo tỷ lệ khung hình 16:9 / 4:3, bổ sung nút bấm cảm ứng to rõ, chống zoom ngoài ý muốn (`touch-action: manipulation`). |

---

## 4. Kế hoạch Triển khai (Execution Phases)

1. **Phase 0:** Hoàn thành khảo sát baseline và báo cáo kiểm tra (Tệp hiện tại).
2. **Phase 3 (Data First):** Thiết lập ngân hàng câu hỏi `lib/dino-exam/questions.ts` và chạy test xác nhận 20 câu hỏi.
3. **Phase 1 & 2:** Xây dựng Types, Procedural Audio Engine, Canvas Pixel Art Engine, Animation Cycles, 5 Parallax Maps, 6 Palettes.
4. **Phase 5:** Xây dựng Game Over, Victory và Giấy Chứng Nhận Canvas PNG download.
5. **Phase 4:** Tích hợp Hero Section 2 cột trên `app/page.tsx` và tối ưu responsive mobile.
6. **Phase 6 & 7:** Kiểm thử FSM, test suite và kiểm tra `npm run build`.
7. **Phase 8:** Hoàn thiện bộ tài liệu chuẩn chỉnh trong `docs/dino-exam/`.

---

## 5. Phương án Rollback

Nếu có bất kỳ sự cố nào xảy ra trong quá trình tích hợp:
1. `git checkout main -- app/page.tsx` để khôi phục Hero Section nguyên bản tức thì.
2. Xóa hoặc cách ly thư mục `lib/dino-exam/` và `components/dino-exam/`.
3. Kiểm tra lại `npm run build` để xác nhận website trở lại trạng thái ban đầu mà không làm mất bất kỳ dữ liệu nào.
