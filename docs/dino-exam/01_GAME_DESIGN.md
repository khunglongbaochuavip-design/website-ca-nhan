# DINO EXAM RUNNER — GAME DESIGN & CONTRACT SPECIFICATION

**Tên chính thức:** DINO EXAM RUNNER  
**Phụ đề:** Hành trình chinh phục Khảo thí  
**Slogan:** 20 câu hỏi – 3 lựa chọn – 1 hành trình chinh phục  
**Thể loại:** Educational Endless Runner / Question-driven Action Runner  
**Nền tảng:** HTML5 Canvas 2D Pixel Art + Next.js App Router (TypeScript)  

---

## 1. Mục tiêu và Định vị Sản phẩm
DINO EXAM RUNNER là trò chơi tương tác giáo dục được nhúng trực tiếp vào Hero Section của website cá nhân **Hữu Tài Genz** (Chuyên gia Khảo thí & Đo lường Giáo dục). Trò chơi biến kiến thức chuyên sâu về khảo thí (CTT, IRT, Bloom, Rasch, CLO/PLO, độ phân cách, độ khó...) thành trải nghiệm runner 2D sống động, trực quan, có tính tương tác cao.

---

## 2. Kịch bản Vòng lặp Trò chơi (Game Loop Contract)

Mỗi ván chơi bao gồm tối đa **20 câu hỏi**, tuân thủ nghiêm ngặt chu trình trạng thái (Finite State Machine):

```
READY ──> CUSTOMIZING (tùy chọn) ──> START
  │
  └──> READING (10,000 ms cố định)
         │
         ▼
       CHOOSING (Không giới hạn thời gian, 3 phím hành động)
         │
         ▼
       EXECUTING (Khủng long thực hiện hành động & Chướng ngại vật tiếp cận)
         ├──> Đúng: CORRECT_TRANSITION (Sparkles, Chime, +5 điểm)
         │      ├──> Còn câu hỏi: Chuyển sang câu tiếp theo (READING)
         │      └──> Đã xong 20 câu: VICTORY (100/100, Tải Giấy Chứng Nhận)
         └──> Sai: GAME_OVER (Âm thanh va chạm, Giải thích chi tiết, Nút Chơi Lại)
```

### 2.1. Giai đoạn READING (10.000 ms)
- **Đồng hồ:** Đếm ngược chính xác 10.000 ms với thanh tiến trình gradient và chỉ số giây thực tế.
- **T-Rex:** Chạy liên tục trong khu vực an toàn (safe zone), mặt đất cuộn nhịp nhàng.
- **Câu hỏi & Lĩnh vực:** Hiển thị nổi bật ngay trên màn hình từ mili-giây đầu tiên.
- **Khóa nhập liệu:** 3 nút hành động bị khóa (disabled) trong suốt 10 giây để đảm bảo người chơi đọc kỹ đề bài và không nhấn vội vàng.

### 2.2. Giai đoạn CHOOSING
- **Kích hoạt:** Xuất hiện đồng thời 3 nút hành động tương ứng với 3 đáp án:
  - `A - Đi thẳng`: Phím tắt `A` hoặc `←` (Màu Cyan).
  - `B - Nhảy`: Phím tắt `W`, `↑` hoặc `Space` (Màu Rose).
  - `C - Cúi`: Phím tắt `S` hoặc `↓` (Màu Purple).
- **Thời gian:** Không giới hạn thời gian, người chơi có thể suy nghĩ thấu đáo.
- **An toàn:** T-Rex tiếp tục chạy an toàn, chưa xuất hiện va chạm cho đến khi người chơi đưa ra quyết định.

### 2.3. Giai đoạn EXECUTING
- Người chơi chọn một hành động qua bàn phím hoặc nhấn trực tiếp trên giao diện màn hình cảm ứng/chuột.
- Chướng ngại vật đặc thù xuất hiện từ rìa phải màn hình và lao tới:
  - Chướng ngại vật **Cổng Dữ Liệu (Portal Archway)** yêu cầu hành động **ĐI THẲNG**.
  - Chướng ngại vật **Khối Đá Đo Lường (Milestone Hurdle)** yêu cầu hành động **NHẢY**.
  - Chướng ngại vật **Thằn Lằn Bay / Drone (Pterodactyl / Overhead Barrier)** yêu cầu hành động **CÚI**.
- **Kiểm tra va chạm & Logic:**
  - Nếu hành động trùng khớp với `correctAction`: T-Rex thực hiện động tác vượt qua chướng ngại vật an toàn, hiệu ứng pháo hoa tia sáng bùng nổ, âm thanh leng keng (coin chime) phát ra, cộng +5 điểm.
  - Nếu hành động sai: T-Rex va chạm với chướng ngại vật, mắt chuyển hình chữ 'X', âm thanh va chạm 8-bit giòn vang, lập tức chuyển sang màn hình `GAME_OVER`.

---

## 3. Hệ thống Tùy biến (Customization)

### 3.1. Đặt tên Khủng Long
- Cho phép người chơi nhập tên chú khủng long (tối đa 18 ký tự).
- Tên khủng long hiển thị dạng bảng tên lơ lửng (nameplate) ngay trên đầu T-Rex trong suốt quá trình chạy và được in trang trọng lên Giấy Chứng Nhận chiến thắng.

### 3.2. Bảng màu Pixel (6 Palettes)
1. **Xanh Lục Bảo (Emerald Green - Mặc định):** Màu xanh kinh điển của dòng game Dino Runner.
2. **Hổ Phách Rực Rỡ (Amber Orange):** Tông vàng cam ấm áp, phong cách hoàng gia.
3. **Cyber Lam Ngọc (Cyan Neon):** Tông màu tương lai hiện đại khoa học.
4. **Tím Thạch Anh (Amethyst Purple):** Tông tím quý phái bí ẩn.
5. **Hồng Ngọc Chiến Binh (Ruby Crimson):** Tông đỏ rực lửa nhiệt huyết.
6. **Hắc Diện Thạch (Obsidian Shadow):** Tông xám đen bóng đêm với đôi mắt vàng rực.

### 3.3. 5 Bản đồ Parallax Đa tầng (5 Biomes)
Bản đồ tự động chuyển đổi theo từng chặng 4 câu hỏi (hoặc tùy biến):
- **Chặng 1 (Câu 1-4): Sa mạc Khảo thí** – Cát vàng, kim tự tháp cổ đại, nắng ấm tri thức.
- **Chặng 2 (Câu 5-8): Băng tuyết Chuẩn mực** – Đỉnh núi tuyết, thông kim đo lường, không khí trong trẻo.
- **Chặng 3 (Câu 9-12): Núi lửa Áp lực** – Vách đá núi lửa, dung nham đỏ rực, thử thách bản lĩnh.
- **Chặng 4 (Câu 13-16): Đồng cỏ Tri thức** – Đồi cỏ xanh biếc, cột đá cổ tích, mây trôi thanh bình.
- **Chặng 5 (Câu 17-20): Đô thị Học viện** – Thành phố tương lai, mũ cử nhân, bầu trời đêm sao rực rỡ.

---

## 4. Hệ thống Âm thanh Thủ tục (Procedural Web Audio API)
- **100% không dùng tệp MP3/WAV ngoại vi:** Tạo sóng âm trực tiếp bằng các bộ tạo dao động (OscillatorNode) và bộ khuếch đại (GainNode) của trình duyệt.
- **Hiệu ứng SFX:** Nhảy (ascending chirp), Cúi (swoosh slide), Đi thẳng (dash sweep), Đúng (3-note arpeggio), Va chạm (8-bit noise crunch), Chiến thắng (fanfare).
- **Nhạc nền BGM:** Vòng hợp âm chiptune 8-bit nhẹ nhàng, âm lượng êm dịu.
- **Tuân thủ chính sách Autoplay:** Trình duyệt chỉ kích hoạt AudioContext sau khi có tương tác người dùng đầu tiên (nhấn Bắt đầu chơi, Bật âm thanh, hoặc chọn hành động).
- Có nút chuyển đổi Mute / Unmute âm thanh nhanh ngay trên khung điều khiển.

---

## 5. Màn hình Kết thúc & Giấy Chứng Nhận Canvas
- **Màn hình Game Over:** Hiển thị câu hỏi gặp nạn, đáp án người chơi đã chọn (đỏ), đáp án đúng (xanh), điểm số đạt được và đoạn giải thích chuyên môn sâu sắc từ tác giả Hữu Tài Genz.
- **Màn hình Chiến thắng (100/100 Điểm):** Hiệu ứng cúp vàng rực rỡ, lời chúc mừng trang trọng, và nút **Tải Giấy Chứng Nhận Khảo Thí (PNG)**.
- **Giấy Chứng Nhận (Certificate Canvas):**
  - Render trực tiếp trên Canvas với độ phân giải siêu cao (1600 x 1100 px).
  - In tên người chơi, số điểm 100/100 tuyệt đối, biểu tượng hoàn thành Dino Runner, thông tin website Hữu Tài Genz và dòng xác nhận: “Giấy chứng nhận hoàn thành trò chơi — không phải chứng chỉ chuyên môn”.
