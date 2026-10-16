# DINO EXAM RUNNER V2.0 — GAMEPLAY SPECIFICATION
## Continuous Runner & Binary Choice Architecture

**Dự án:** Website cá nhân Hữu Tài Genz (`https://huutaigenz.vercel.app/`)  
**Phiên bản Game:** v2.0 Continuous Runner  
**Ngày hoàn thiện:** 16/10/2026  
**Tác giả:** Senior HTML5 Game Engineer & Full-stack Architect

---

## 1. TỔNG QUAN NÂNG CẤP TỪ V1.0 LÊN V2.0

| Hạng mục | V1.0 (Bản cũ) | V2.0 (Bản nâng cấp) |
| :--- | :--- | :--- |
| **Cơ chế trả lời** | 3 nút hành động riêng biệt (Đi thẳng / Nhảy / Cúi). | **Binary Choice Continuous Runner**: Nhảy (JUMP) hoặc Không nhảy (RUN). |
| **Vị trí câu hỏi** | Panel bên ngoài, nằm tách rời dưới Canvas. | **In-Game HUD Banner** nhúng trực tiếp trên nóc Canvas. |
| **Tính liên tục thế giới** | Reset offset mặt đất/núi/mây sau mỗi câu hỏi. | **Hoàn toàn liên tục**; 1 loop duy nhất duy trì vận tốc và offset qua 40 câu. |
| **Thời gian đọc đề** | 10 giây đếm ngược cố định. | **7 giây đếm ngược** với thanh tiến trình trực quan. |
| **Cụm đáp án** | Chướng ngại vật vật lý tĩnh. | **2 cổng đáp án bay lượn trong thế giới game** (Cổng trên: Nhảy, Cổng dưới: Đi thẳng). |
| **Ngân hàng câu hỏi** | 20 câu hỏi (5 điểm/câu). | **40 câu hỏi** (20 JUMP, 20 RUN, 2.5 điểm/câu = 100 điểm tối đa). |
| **Chứng nhận** | Tùy chọn 20 câu. | **Giấy chứng nhận 40 câu / 100 điểm chuẩn hóa**, tuân thủ pháp lý và disclaimer. |

---

## 2. KIẾN TRÚC THẾ GIỚI LIÊN TỤC (CONTINUOUS WORLD SYSTEM)

### 2.1. Chu kỳ Animation và Quản lý State
- Game canvas render ở tỷ lệ `840 x 420` (aspect ratio 2:1), tương thích Retina trên cả Desktop và Mobile.
- Vòng lặp `requestAnimationFrame` được khởi tạo **duy nhất một lần** khi `DinoCanvas` mount (`useEffect(..., [])`).
- Tất cả props biến thiên (`gameState`, `currentQuestion`, `currentQuestionIndex`, callbacks) được đồng bộ qua `stateRef.current`, loại bỏ hoàn toàn hiện tượng reset thế giới hoặc remount canvas.
- Vận tốc di chuyển thế giới: `worldSpeed = 290 px/s`.
  - Mặt đất: `groundOffset = (groundOffset + 290 * dt) % 840`
  - Núi gần: `mountainNearOffset = (mountainNearOffset + 290 * 0.45 * dt) % 840`
  - Núi xa: `mountainFarOffset = (mountainFarOffset + 290 * 0.2 * dt) % 840`
  - Mây trời: `cloudOffset = (cloudOffset + 24 * dt) % 840`

---

## 3. CƠ CHẾ ĐIỀU KHIỂN & VẬT LÝ NHẢY (PHYSICS CONTRACT)

### 3.1. Phím Điều Khiển
- **Nhảy (JUMP):**
  - Phím `Space` (ngăn cuộn trang qua `e.preventDefault()`).
  - Phím `ArrowUp` hoặc `W`.
  - Chuột click vào Canvas.
  - Nút cảm ứng nổi `[ ⬆️ NHẢY ]` trên màn hình điện thoại di động.
- **Không nhảy (RUN):**
  - Người chơi không thực hiện thao tác nhảy; khủng long tiếp tục sải bước trên mặt đất đi xuyên qua cổng dưới.

### 3.2. Thông số Vật lý T-Rex & Hitbox Cổng Đáp Án
- Tọa độ T-Rex: `dinoX = 140px`, Mặt đất: `groundY = 330px`.
- Vận tốc bật nhảy ban đầu: `dinoVy = -580 px/s`.
- Trọng lực: `gravity = 1350 px/s²`.
- Thời gian lên đỉnh bước nhảy: $t_{peak} = 580 / 1350 \approx 0.43 \text{ giây}$.
- Tổng thời gian một bước nhảy: $t_{jump} \approx 0.86 \text{ giây}$.
- Đỉnh cao nhất đạt được: $y_{min} = 330 - \frac{580^2}{2 \times 1350} \approx 330 - 124.6 = 205.4\text{px}$.
- **Hitbox Cổng Trên (JUMP Target):** $y = 190\text{px}$, kích thước $220 \times 50\text{px}$. T-Rex đang nhảy đạt trọn vẹn không gian này.
- **Hitbox Cổng Dưới (RUN Target):** $y = 280\text{px}$, kích thước $220 \times 50\text{px}$. T-Rex chạy thẳng đi xuyên qua tự nhiên.

---

## 4. QUY TRÌNH CHẤM ĐIỂM & ĐIỂM QUYẾT ĐỊNH (DECISION & RESOLUTION)

```
[Mép phải: 880px] -----------> [Vạch Quyết định: 250px] --------> [Điểm Va chạm: 170px]
 Cụm cổng xuất hiện              Khóa lựa chọn (JUMP / RUN)         Chấm điểm & Nổ hiệu ứng
 (APPROACHING)                   (DECISION)                        (RESOLUTION)
```

1. **Giai đoạn Đọc Đề (READING - 7 giây):**
   - Thế giới cuộn liên tục, khủng long sải bước.
   - Banner HUD trên nóc hiển thị câu hỏi, lĩnh vực và thanh countdown 7s.
   - Cụm cổng đáp án chưa xuất hiện.
2. **Giai đoạn Tiếp Cận (APPROACHING):**
   - Hết 7s, cụm 2 cổng đáp án xuất hiện tại mép phải (`x = 880px`) và lướt sang trái với vận tốc `290 px/s`.
   - Cổng trên mang phương án `JUMP`, cổng dưới mang phương án `RUN`.
3. **Vạch Quyết Định (DECISION - $x = 250\text{px}$):**
   - Khi cụm cổng chạm `dinoX + 110`:
   - Nếu khủng long đang ở trên không (`isJumping === true`), lựa chọn được khóa là `JUMP`.
   - Nếu khủng long đang chạy trên đất, lựa chọn được khóa là `RUN`.
   - Hộp đáp án được chọn phát sáng viền vàng hổ phách.
4. **Điểm Va Chạm & Chấm Điểm (RESOLUTION - $x = 170\text{px}$):**
   - Khi cụm cổng tiếp xúc thân T-Rex (`dinoX + 30`):
   - So khớp `chosenAction === correctChoice`.
   - **ĐÚNG:** Nổ chùm hạt ánh sao lấp lánh màu vàng (`#fbbf24`), phát âm thanh Correct, cộng `+2.5` điểm. Sau 1 giây chuyển mượt mà sang câu tiếp theo mà không dừng runner.
   - **SAI:** Nổ chùm hạt đỏ va đập (`#ef4444`), phát âm thanh Hit, sau 0.5s hiển thị `GameOverModal` kèm phân tích chuyên môn.
   - **HOÀN THÀNH 40 CÂU:** Sau câu 40 đạt 100/100 điểm, phát âm thanh Victory và mở `VictoryModal` vinh danh.
