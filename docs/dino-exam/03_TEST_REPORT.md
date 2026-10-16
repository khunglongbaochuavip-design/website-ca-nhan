# DINO EXAM RUNNER — BÁO CÁO KIỂM THỬ (TEST REPORT)

**Thời gian kiểm thử:** 16/10/2026  
**Môi trường:** Node.js v24.14.1, Next.js 16.3.4, React 19.2.8, TypeScript 5  
**Trạng thái kiểm thử:** ✅ 100% PASS  

---

## 1. Kiểm thử Ngân hàng Câu hỏi (`verify-questions.mjs`)

| Tiêu chí | Kỳ vọng | Thực tế | Kết quả |
| :--- | :---: | :---: | :---: |
| **Tổng số lượng câu hỏi** | Đúng 20 câu | 20 câu (`q1` đến `q20`) | **PASS** |
| **Tính duy nhất của ID** | 20 ID phân biệt | 20 ID duy nhất | **PASS** |
| **Cấu trúc 3 lựa chọn** | A (Đi thẳng), B (Nhảy), C (Cúi) | 100% đầy đủ 3 lựa chọn | **PASS** |
| **Điểm số tối đa** | 100 điểm (5 điểm x 20 câu) | 100 điểm | **PASS** |
| **Phân bổ hành động** | 7 Đi thẳng, 7 Nhảy, 6 Cúi | 7 STRAIGHT, 7 JUMP, 6 DUCK | **PASS** |
| **Trường thông tin bắt buộc** | Lĩnh vực, đề bài, giải thích | Không có trường rỗng | **PASS** |

---

## 2. Kiểm thử Vòng đời & Finite State Machine (FSM)

| Kịch bản kiểm thử | Hành động kiểm tra | Trạng thái ghi nhận | Kết quả |
| :--- | :--- | :--- | :---: |
| **Khởi động Game** | Nhấn "Bắt đầu chơi" tại màn hình `READY` | Chuyển sang `READING`, câu hỏi 1 hiển thị, đồng hồ đếm từ 10s | **PASS** |
| **Khóa nhập liệu 10s** | Nhấn phím A/W/S hoặc click trong lúc `READING` | Nút bị disabled, không có hành động nào được ghi nhận | **PASS** |
| **Kích hoạt Lựa chọn** | Hết 10.000 ms của `READING` | Tự động sang `CHOOSING`, mở khóa 3 nút hành động | **PASS** |
| **Thực thi hành động đúng** | Chọn hành động khớp với `correctAction` | T-Rex thực hiện động tác vượt chướng ngại vật, cộng 5 điểm, âm thanh chime phát | **PASS** |
| **Thực thi hành động sai** | Chọn hành động sai khác `correctAction` | T-Rex va chạm, phát âm thanh hit, mở modal `GAME_OVER` kèm giải thích | **PASS** |
| **Chiến thắng tuyệt đối** | Vượt qua câu thứ 20 (Điểm = 100) | Mở modal `VICTORY`, phát âm thanh chiến thắng, hiển thị nút tải Giấy Chứng Nhận | **PASS** |
| **Chơi lại sau Game Over** | Nhấn "Thử lại ngay" | Reset điểm về 0, reset về câu 1, bắt đầu vòng lặp mới | **PASS** |

---

## 3. Kiểm thử Động cơ Âm thanh & Autoplay Policy

| Tiêu chí | Kiểm tra | Kết quả |
| :--- | :--- | :---: |
| **Autoplay Policy** | Trình duyệt không chặn âm thanh khi tải trang đầu | **PASS** (Khởi tạo theo tương tác) |
| **Bật/Tắt âm thanh (Mute)** | Nhấn nút SFX chuyển đổi 🔊 / 🔇 | **PASS** (Ngắt/bật GainNode tức thì) |
| **Nhạc nền Chiptune BGM** | Nhấn nút 🎶 BGM | **PASS** (Phát vòng hợp âm 8-bit nhẹ nhàng) |
| **Không dùng tệp ngoại vi** | Kiểm tra Network tab | **PASS** (0 tệp audio ngoài, 0 tải phát sinh) |

---

## 4. Kiểm thử Xuất Giấy Chứng Nhận Canvas PNG

| Tiêu chí | Thông số kỹ thuật | Kết quả |
| :--- | :--- | :---: |
| **Độ phân giải Canvas** | 1600 x 1100 px (Ultra High Resolution) | **PASS** |
| **Độ sắc nét font & viền** | Không bị vỡ nét hay nhòe hình | **PASS** |
| **Tên người chơi tùy biến** | Lấy chính xác tên từ CustomizerModal | **PASS** |
| **Tải tệp về máy tính** | Tạo liên kết blob PNG và kích hoạt tự động | **PASS** |

---

## 5. Kiểm thử Biên dịch & Hiệu năng Production Build

```bash
> next build
▲ Next.js 16.3.4 (Turbopack)
✓ Running next.config.ts took 136ms
✓ Compiled successfully in 12.0s
  Running TypeScript ...
  Finished TypeScript in 5.2s ...
✓ Generating static pages using 7 workers (12/12) in 342ms
```

- **Lỗi biên dịch:** 0
- **Lỗi TypeScript:** 0
- **Tốc độ khung hình Canvas:** ~60 FPS ổn định với delta-time rendering.
- **Dọn dẹp bộ nhớ:** 100% hủy animationFrame, clearTimeout, và gỡ eventListener khi unmount.
