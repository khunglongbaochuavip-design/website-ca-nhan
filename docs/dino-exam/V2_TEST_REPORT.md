# DINO EXAM RUNNER V2.0 — TEST & VERIFICATION REPORT
## Báo Cáo Kiểm Thử Tự Động & Nghiệm Thu Chức Năng

**Dự án:** Website cá nhân Hữu Tài Genz (`https://huutaigenz.vercel.app/`)  
**Môi trường kiểm thử:** Node.js v24.14.1, Chrome 134+ Headless (CDP Protocol), Next.js 16.3.4 (Turbopack)  
**Ngày thực hiện:** 16/10/2026  
**Trạng thái kiểm thử:** **100% ĐẠT (PASS)**

---

## 1. TỔNG HỢP KẾT QUẢ CÁC BÀI KIỂM THỬ

| Nhóm Kiểm Thử | Công cụ / Kịch bản | Kết quả | Ghi chú |
| :--- | :--- | :---: | :--- |
| **Xác thực dữ liệu câu hỏi** | `tests/dino-exam/verify-questions.mjs` | **40/40 PASS** | Đủ 40 câu hỏi, đúng tỷ lệ 20 JUMP / 20 RUN, 2.5 điểm/câu. |
| **Kiểm tra kiểu dữ liệu (TypeScript)** | `npx tsc --noEmit` | **0 ERROR** | Không còn bất kỳ type mismatch hay thuộc tính lỗi nào. |
| **Biên dịch Production** | `npm run build` | **SUCCESS** | Biên dịch thành công 12 route tĩnh và động trong 3.0s. |
| **Kiểm thử giao diện đa kích thước** | CDP Automation (Chrome Headless) | **4/4 PASS** | Nghiệm thu 1920x1080, 1366x768, 390x844, 360x800. |
| **Gameplay: Đọc đề 7 giây** | CDP Automation (`browser-audit-v2.mjs`) | **PASS** | Đếm ngược chính xác từ 7s về 0s, thanh tiến trình co đều. |
| **Gameplay: Cụm cổng đáp án** | CDP Automation (`browser-audit-v2.mjs`) | **PASS** | Cụm cổng bay từ mép phải sang trái ở vận tốc 290 px/s. |
| **Gameplay: Cơ chế Nhảy (JUMP)** | Phím Spacebar / ArrowUp / Touch | **PASS** | T-Rex bật nhảy lên $y=205\text{px}$, khớp hitbox cổng trên. |
| **Gameplay: Cơ chế Đi thẳng (RUN)** | Giữ nguyên chạy trên đất | **PASS** | T-Rex chạy xuyên qua cổng dưới khi không nhấn phím. |
| **Xử lý Thua cuộc & Review** | Kịch bản cố tình chọn sai câu 3 | **PASS** | Modal va chạm hiển thị rõ đáp án chọn, đáp án đúng & giải thích. |
| **Xuất Giấy Chứng Nhận** | Canvas Engine (1600x1100 px) | **PASS** | Xuất tệp PNG chuẩn, bảo đảm tuyên bố miễn trừ trách nhiệm. |

---

## 2. CHI TIẾT CÁC KỊCH BẢN KIỂM THỬ

### 2.1. Kiểm thử Tính toàn vẹn Dữ liệu 40 Câu hỏi
```
=== VERIFYING DINO EXAM RUNNER V2 QUESTIONS ===
Total Questions: 40
Total Points: 100
Points per Question: 2.5
Choice Balance:
  - JUMP: 20 (50.0%)
  - RUN: 20 (50.0%)
All 40 questions passed 100% data integrity verification!
```

### 2.2. Kiểm thử Biên dịch Next.js 16.3.4 (Turbopack)
```
▲ Next.js 16.3.4 (Turbopack)
- Environments: .env.local
✓ Running next.config.ts took 79ms
  Creating an optimized production build ...
✓ Compiled successfully in 3.0s
  Running TypeScript ...
  Finished TypeScript in 5.5s ...
✓ Generating static pages using 7 workers (12/12) in 749ms
  Finalizing page optimization ...

Route (app)
┌ ƒ /
├ ○ /_not-found
├ ƒ /admin
├ ○ /admin/login
├ ƒ /admin/phan-mem
├ ƒ /admin/blog
├ ƒ /blog
└ ƒ /phan-mem
✓ Build complete with 0 errors!
```

### 2.3. Kiểm thử Trình duyệt Trực tiếp qua Chrome DevTools Protocol (CDP)
- **Kiểm tra lỗi Console:** `window.__errors` trả về `[]` (Không có lỗi JavaScript hay cảnh báo React nào).
- **Hero Composition:**
  - Tiêu đề thương hiệu: *Hữu Tài Genz*
  - Badge chuyên môn: *Chuyên Gia Khảo Thí & Đo Lường Giáo Dục*
  - 4 khối chỉ số uy tín (10+ Năm, 100K+ Bài thi, 4+ Phần mềm, 100% Chuẩn MOET) hiển thị đầy đủ, không bị đè lấn.
  - Tựa game: *DINO EXAM RUNNER v2.0*
  - Canvas: $840 \times 420\text{px}$, responsive theo tỷ lệ 2:1.
- **Kịch bản Gameplay V2.0:**
  1. *Khởi động game:* Click "Bắt Đầu Chơi Ngay" -> Khủng long sải bước, thế giới bắt đầu cuộn mượt mà.
  2. *Thời gian đọc đề:* Banner nóc hiển thị `[Khảo thí] CTT là viết tắt của lý thuyết nào?` kèm thanh đếm ngược 7s.
  3. *Tiếp cận cổng:* Hết 7s, cụm cổng bay từ phải sang trái. Cổng trên: `NHẢY: Lý thuyết kiểm tra cổ điển`, Cổng dưới: `ĐI THẲNG: Lý thuyết ứng đáp câu hỏi`.
  4. *Thực hiện Nhảy:* Nhấn `Spacebar` tại $t=1.8\text{s}$, T-Rex bay bổng qua vạch quyết định ở độ cao $y=205\text{px}$. Lựa chọn được khóa là `JUMP`.
  5. *Chấm điểm câu 1:* Khớp với `correctChoice: JUMP` -> Phun pháo hoa ánh vàng, phát âm thanh Correct, điểm số tăng lên `2.5/100`, chuyển mượt sang câu 2 mà không dừng chạy.
  6. *Kịch bản Đi thẳng câu 2:* Người chơi không nhấn phím, T-Rex chạy thẳng qua cổng dưới. Khớp với `correctChoice: RUN` -> Nhận tiếp 2.5 điểm (tổng 5.0/100).
  7. *Kịch bản Thua cuộc câu 3:* Cố tình nhấn Nhảy ở câu hỏi có đáp án đúng là Đi thẳng -> Hiệu ứng va đập đỏ xuất hiện, mở `GameOverModal`.
  8. *Kiểm tra GameOverModal:*
     - Tiêu đề: *VẤP NGÃ TRÊN ĐƯỜNG ĐUA!*
     - Lựa chọn của bạn: *❌ Bạn đã chọn: NHẢY: Khó.*
     - Đáp án đúng: *✅ Đáp án chính xác: ĐI THẲNG: Dễ.*
     - Giải thích: *Với câu hỏi chấm điểm nhị phân, p thường là tỷ lệ trả lời đúng...*
     - Nút "Thử Lại Ngay" hoạt động trơn tru.
  9. *Kiểm tra Chứng nhận:* Tạo thành công tệp PNG $1600 \times 1100\text{px}$ chứa đầy đủ disclaimer: `★ CHỨNG NHẬN HOÀN THÀNH TRÒ CHƠI — KHÔNG PHẢI CHỨNG CHỈ CHUYÊN MÔN ★`.
