# BÁO CÁO NGHIỆM THU & TÀI LIỆU KỸ THUẬT
# HỆ SINH THÁI GAME KHẢO THÍ & DINO QUEST V1.0
## Multi-Game Hub + Four Doors Adventure

> **Dự án:** Website Hữu Tài Genz  
> **Production URL:** [https://huutaigenz.vercel.app/](https://huutaigenz.vercel.app/)  
> **Nhánh phát triển:** `feat/game-hub-dino-quest`  
> **Commit cơ sở (Production Baseline):** `997e25a` (Dino Exam Runner V2.1)  
> **Trạng thái:** Hoàn tất triển khai local, đã kiểm thử tự động 100%, sẵn sàng bàn giao kiểm toán. **CHƯA COMMIT, CHƯA PUSH, CHƯA DEPLOY PRODUCTION.**

---

## 1. TỔNG QUAN DỰ ÁN & MỤC TIÊU TRIỂN KHAI

Nhằm nâng tầm trang web cá nhân Hữu Tài Genz thành một trung tâm trải nghiệm khảo thí tương tác trực quan và chuyên nghiệp, phiên bản nâng cấp lần này thực hiện hai mục tiêu cốt lõi:

1. **Xây dựng Game Hub (Trung tâm Game Khảo thí):** Thay thế việc hiển thị trực tiếp một trò chơi duy nhất trên Hero section bằng một giao diện chọn game đa năng, hiện đại theo lưới 2x2, cho phép mở rộng không giới hạn các trò chơi giáo dục trong tương lai.
2. **Phát triển game thứ hai — DINO QUEST (Bí Ẩn Tứ Đại Cánh Cửa):** Một trò chơi phiêu lưu nhập vai 2.5D khám phá 10 vùng đất tri thức khảo thí, trả lời bằng cách điều khiển chú khủng long T-Rex tiến vào 1 trong 4 cánh cửa bí ẩn (A, B, C, D).
3. **Bảo toàn tuyệt đối Dino Exam Runner V2.1:** Giữ nguyên 100% cơ chế chạy liên tục, 40 nhận định Đúng/Sai, logic nhảy/chạy, tính điểm, âm thanh, tùy biến và đồ họa pixel art của bản V2.1 đã được chủ dự án nghiệm thu.

---

## 2. KIẾN TRÚC GAME HUB (`components/game-hub/GameHub.tsx`)

### 2.1. Giao diện & Trải nghiệm người dùng
- **Tiêu đề trung tâm:** `GAME KHẢO THÍ` với phong cách typography hiện đại, gradient ánh kim sang trọng.
- **Phụ đề:** *"Khám phá kiến thức qua những trò chơi tương tác."*
- **Lưới hiển thị:** Grid 2 cột x 2 hàng (responsive 1 cột trên mobile, 2 cột trên tablet/desktop) tối ưu hoàn hảo cho cột bên phải của Hero Section.
- **4 Thẻ trò chơi (Game Cards):**
  1. **DINO EXAM RUNNER:**
     - Huy hiệu: `SẴN SÀNG` (màu xanh lục emerald).
     - Phụ đề: Chạy vô tận né chướng ngại vật & phán đoán 40 nhận định Đúng/Sai khảo thí.
     - Icon: 🦖. Nhấp vào mở ngay Dino Exam Runner V2.1.
  2. **DINO QUEST: 4 CÁNH CỬA:**
     - Huy hiệu: `SẴN SÀNG` (màu hổ phách amber rực rỡ).
     - Phụ đề: Hành trình 10 vùng đất, giải mã 4 cánh cửa bí ẩn và tiến vào Học viện Khảo thí.
     - Icon: 🏛️. Nhấp vào mở ngay Dino Quest.
  3. **DINO MATCH (Nối thẻ khảo thí):**
     - Huy hiệu: `SẮP RA MẮT` (màu xám / viền dash).
     - Phụ đề: Nối các cặp thuật ngữ, công thức và khái niệm khảo thí tương ứng.
     - Icon: 🃏. Nhấp vào mở Modal thông báo tính năng đang hoàn thiện.
  4. **CAT RUNNER (Đố vui cùng Mèo):**
     - Huy hiệu: `SẮP RA MẮT` (màu xám / viền dash).
     - Phụ đề: Phiêu lưu cùng chú mèo thông minh vượt qua các cạm bẫy câu hỏi hóc búa.
     - Icon: 🐱. Nhấp vào mở Modal thông báo tính năng đang hoàn thiện.

### 2.2. Điều hướng hai chiều & Bảo vệ tiến trình (Two-way Navigation)
- Cả hai trò chơi đều tích hợp nút điều hướng `← Game Khảo thí` ở thanh tiêu đề HUD.
- **Cơ chế xác nhận thông minh:** Nếu người chơi đang trong một phiên chơi dở dang (điểm số > 0 hoặc đang vượt ải), trò chơi sẽ hiển thị hộp thoại xác nhận trước khi thoát để tránh việc người chơi vô tình làm mất kết quả đang chơi.
- **Client Mount tức thì:** Các component trò chơi được nạp trực tiếp ở phía client với trạng thái state được cô lập, chuyển đổi mượt mà giữa Game Hub và các trò chơi mà không gây reload trang hay gián đoạn tài nguyên mạng.

---

## 3. THIẾT KẾ CHI TIẾT TRÒ CHƠI DINO QUEST (V1.0)

### 3.1. Hành trình 10 Vùng đất Khảo thí (`lib/dino-quest/worlds.ts`)
Mỗi câu hỏi tương ứng với một vùng đất mang bản sắc đồ họa, bảng màu và hiệu ứng hạt riêng biệt:
1. **Vùng 1: Đồng cỏ Tri thức** (Green/Emerald, hạt phấn hoa bay, chủ đề Tổng quan đo lường).
2. **Vùng 2: Rừng Ma trận đề** (Forest/Teal, hạt lá rơi, chủ đề Ma trận & Đặc tả đề thi).
3. **Vùng 3: Sa mạc CTT** (Amber/Sand, hạt cát bay, chủ đề Lý thuyết kiểm tra cổ điển).
4. **Vùng 4: Thung lũng IRT** (Indigo/Cyan, hạt năng lượng lam, chủ đề Lý thuyết ứng đáp câu hỏi).
5. **Vùng 5: Núi tuyết Rasch** (Sky/White, bông tuyết rơi, chủ đề Mô hình Rasch 1-PL).
6. **Vùng 6: Đầm lầy DIF** (Violet/Purple, đốm sáng đầm lầy, chủ đề Chức năng câu hỏi vi sai).
7. **Vùng 7: Hang động Độ giá trị** (Rose/Crimson, bụi phát quang, chủ đề Độ giá trị & Tin cậy).
8. **Vùng 8: Thành phố Đảm bảo chất lượng** (Sky/Blue, bụi sao công nghệ, chủ đề Kiểm định AUN/MOET).
9. **Vùng 9: Đền thờ Chuẩn đầu ra** (Yellow/Gold, tia sáng thần thánh, chủ đề Chuẩn đầu ra CLO/PLO).
10. **Vùng 10: Học viện Khảo thí** (Fuchsia/Purple, ánh hào quang tối cao, chủ đề Khảo thí học hiện đại).

### 3.2. Ngân hàng 10 Câu hỏi Nguyên văn Phụ lục (`lib/dino-quest/questions.ts`)
Bảo toàn 100% nguyên văn câu hỏi, thứ tự các phương án A-D, đáp án chuẩn xác và phần giải thích khoa học:
- **Q01 (Vùng 1):** Độ giá trị (Validity) -> **Đáp án B**: Mức độ mà bài thi đo lường đúng cái nó dự định đo.
- **Q02 (Vùng 2):** Bước đầu tiên trong xây dựng đề thi -> **Đáp án D**: Xây dựng ma trận đề thi (Test Blueprint).
- **Q03 (Vùng 3):** Tham số p-value trong CTT -> **Đáp án A**: Tỷ lệ thí sinh trả lời đúng câu hỏi (độ khó).
- **Q04 (Vùng 4):** Đặc tính cốt lõi của IRT -> **Đáp án C**: Độc lập tham số người làm bài và đặc tính câu hỏi (Invariance).
- **Q05 (Vùng 5):** Giả định cơ bản của mô hình Rasch -> **Đáp án B**: Độ phân biệt câu hỏi cố định, không có tham số đoán mò.
- **Q06 (Vùng 6):** DIF biểu thị hiện tượng gì -> **Đáp án D**: Các nhóm thí sinh có cùng năng lực nhưng xác suất trả lời đúng khác nhau.
- **Q07 (Vùng 7):** Mối quan hệ giữa Reliability và Validity -> **Đáp án A**: Độ tin cậy là điều kiện cần nhưng không đủ cho độ giá trị.
- **Q08 (Vùng 8):** Phân biệt Đánh giá quá trình và Đánh giá tổng kết -> **Đáp án C**: Cải tiến quá trình học tập liên tục so với xếp loại cuối kỳ.
- **Q09 (Vùng 9):** Thang nhận thức Bloom (1956) bậc cao nhất -> **Đáp án B**: Đánh giá (Evaluation).
- **Q10 (Vùng 10):** Mục tiêu tối hậu của khảo thí hiện đại -> **Đáp án D**: Thúc đẩy học tập và nâng cao chất lượng đào tạo (Assessment FOR/AS learning).

### 3.3. Cơ chế Đồ họa 2.5D Canvas & Tương tác Cánh cửa (`DinoQuestCanvas.tsx`)
- **Phối cảnh 2.5D:** Nền trời gradient theo vùng đất, mặt sàn đá phối cảnh có các đường lưới hội tụ về điểm vô cực, 4 cánh cửa đặt đối xứng ở hậu cảnh (tọa độ trục X: 12%, 37%, 62%, 87%).
- **Hoạt ảnh Khủng long T-Rex:**
  - Trạng thái Chờ (`CHOOSING`): T-Rex nhún nhảy nhịp nhàng ở tiền cảnh trung tâm.
  - Trạng thái Di chuyển (`WALKING`): T-Rex quay người và chạy từng bước chân sinh động về phía cánh cửa mà người chơi vừa chọn.
  - Cánh cửa trượt mở (`DOOR_OPEN`): 2 cánh cửa tách đôi hé lộ thế giới phía sau.
- **Trường hợp CHỌN ĐÚNG:**
  - Cổng không gian Hoàng kim (Golden Portal) rực sáng rực rỡ với các tia hào quang xoay tròn và hạt tinh thể vàng bay lên.
  - T-Rex bước qua cổng tiến vào chiều không gian tiếp theo.
  - Điểm số cộng ngay +10 điểm (tối đa 100 điểm).
  - Tự động chuyển cảnh mượt sang Vùng đất tiếp theo.
- **Trường hợp CHỌN SAI:**
  - 1 trong 3 con vật bất ngờ xuất hiện từ cánh cửa (Cá sấu lao ra ngoạm, Hà mã húc ngã hoặc Capybara nhảy xồ ra).
  - T-Rex ngã bật ngửa, choáng váng với vòng xoáy sao xoay trên đầu.
  - Âm thanh bất ngờ vang lên.
  - Hiển thị ngay `GameOverModal`:
    - Biểu tượng và tên con vật bất ngờ.
    - Điểm số và số vòng đã vượt qua.
    - Phương án người chơi đã chọn vs. Đáp án đúng chuẩn xác.
    - **Lời giải thích khoa học chi tiết** giúp người chơi củng cố ngay kiến thức vừa sai sót.
    - Nút "Thử Lại" hoặc "Về Game Hub".

### 3.4. Chiến thắng 10/10 Vòng & Giấy Chứng Nhận Bản Quyền
- Vượt qua trọn vẹn 10/10 câu hỏi đạt **100/100 điểm tuyệt đối**, người chơi bước vào Học viện Khảo thí và được tôn vinh với danh hiệu **"NHÀ THÁM HIỂM TRI THỨC"**.
- Màn hình `VictoryModal` xuất hiện rực rỡ với hiệu ứng pháo hoa, cúp vàng và âm thanh Fanfare chiến thắng.
- **Giấy chứng nhận số hóa (`lib/dino-quest/certificate.ts`):**
  - Sinh trực tiếp bằng Canvas 2D độ phân giải cao (1600 x 1100 px), xuất tệp ảnh PNG sắc nét.
  - Tên người chơi tùy biến (mặc định hoặc do người chơi tự đặt).
  - Khung viền hoa văn cổ điển sang trọng tông vàng kim hoàng gia.
  - Con dấu hình hoa văn số hóa độc bản mang dòng chữ *"BẢN QUYỀN TRÍ TUỆ HUUTAIGENZ"*.
  - **Khước từ trách nhiệm minh bạch & trung thực:** Ghi rõ chứng chỉ lưu niệm mang tính giáo dục giải trí cho trò chơi Dino Quest, không giả mạo con dấu hay chữ ký của Bộ GD&ĐT hay bất kỳ tổ chức nào bên ngoài.

### 3.5. Hệ thống Âm thanh Thuần Web Audio API (`lib/dino-quest/audio.ts`)
- Toàn bộ hiệu ứng âm thanh được tổng hợp thời gian thực thông qua Web Audio API (sử dụng OscillatorNode dạng sine/square/triangle/sawtooth, GainNode điều biên ADSR, và BiquadFilterNode lọc âm).
- Không cần tải bất kỳ tệp MP3 bên ngoài nào, đảm bảo 0% lỗi 404, không hao tốn băng thông CDN và không bị trễ âm.
- Bao gồm:
  - Tiếng bước chân T-Rex (`step`).
  - Tiếng cánh cửa trượt mở (`doorOpen`).
  - Tiếng chuông cổng hoàng kim (`correctChime`).
  - Tiếng gầm cá sấu (`crocodileGrowl`), tiếng hà mã va chạm (`hippoThud`), tiếng capybara nhảy nhót (`capybaraSqueak`).
  - Nhạc nền vi vu ambient tĩnh lặng (`ambientBgm`).
  - Hợp âm kèn đồng chiến thắng (`victoryFanfare`).
  - Nút bật/tắt âm thanh (Mute/Unmute) tiện lợi trên thanh công cụ.

### 3.6. Tùy biến Khủng long & Chế độ Toàn Màn Hình
- **Modal Tùy biến (`CustomizerModal.tsx`):**
  - Cho phép người chơi đổi tên nhân vật hiển thị trên Giấy chứng nhận.
  - Chọn 1 trong 6 màu da T-Rex phong phú: Ngọc lục bảo (Emerald), Hồng ngọc (Ruby), Vàng hoàng gia (Gold), Lam ngọc (Cyan), Thạch anh tím (Amethyst), Hắc diện thạch (Obsidian).
- **Fullscreen API:** Nút chuyển đổi nhanh chế độ Toàn màn hình giúp bao trọn không gian trải nghiệm 2.5D.
- **Phím tắt nhanh:** Hỗ trợ bàn phím `1`, `2`, `3`, `4` hoặc `A`, `B`, `C`, `D` để chọn cửa nhanh như trên các dòng máy game arcade.

---

## 4. BẢO TOÀN DINO EXAM RUNNER V2.1

Để bảo vệ thành quả của bản V2.1:
- Toàn bộ logic lõi của `DinoGame.tsx`, `useContinuousRunnerGame.ts`, `continuousPhysics.ts`, `dino-exam/questions.ts` (40 nhận định Đúng/Sai), cơ chế va chạm, tính điểm và đồ họa pixel art được giữ nguyên 100%.
- Chỉ bổ sung một prop tùy chọn duy nhất: `onBackToHub?: () => void` vào `DinoGame.tsx`. Khi có prop này, giao diện game hiển thị thêm nút `← Game Khảo thí` ở góc trên bên trái thanh công cụ để người chơi dễ dàng quay lại sảnh chọn game bất kỳ lúc nào.

---

## 5. BÁO CÁO KIỂM THỬ TOÀN DIỆN (AUDIT & VERIFICATION)

### 5.1. Kiểm tra Kiểu dữ liệu TypeScript
- Lệnh chạy: `npx tsc --noEmit`
- Kết quả: **PASS (0 lỗi, 0 cảnh báo)**.

### 5.2. Kiểm tra Đóng gói Bản dựng Next.js
- Lệnh chạy: `npm run build`
- Kết quả: **PASS (100% thành công trong 9.1s)**.
  - 12/12 routes tĩnh và động được tạo trơn tru.
  - Dung lượng First Load JS tối ưu hoàn hảo (Trang chủ `/`: 161 kB).

### 5.3. Kiểm thử Toàn vẹn Ngân hàng Câu hỏi (`verify-quest-questions.mjs`)
- Lệnh chạy: `node tests/game-hub/verify-quest-questions.mjs`
- Kết quả: **PASS (10/10 câu hỏi, phương án và đáp án khớp 100% theo phụ lục đề bài)**:
  - Q01: B (Độ giá trị)
  - Q02: D (Xây dựng ma trận đề)
  - Q03: A (p-value CTT)
  - Q04: C (Độc lập tham số IRT)
  - Q05: B (Mô hình Rasch)
  - Q06: D (Hiện tượng DIF)
  - Q07: A (Reliability & Validity)
  - Q08: C (Đánh giá quá trình vs tổng kết)
  - Q09: B (Thang Bloom bậc cao nhất)
  - Q10: D (Mục tiêu khảo thí hiện đại)

### 5.4. Kiểm thử Tự động E2E Trình duyệt (Chrome CDP Automation)
Hai kịch bản kiểm thử E2E độc lập đã được thực thi trực tiếp trên trình duyệt Chrome headless kết nối qua Chrome DevTools Protocol:

1. **Kịch bản `test-game-hub-e2e.mjs`:**
   - Xác nhận Game Hub hiển thị đầy đủ tiêu đề, phụ đề và 4 thẻ game.
   - Kiểm tra mở Placeholder Modal cho game sắp ra mắt (Dino Match).
   - Kiểm tra mở Dino Exam Runner V2.1: xác nhận trò chơi nguyên vẹn, canvas hoạt động, có nút `← Game Khảo thí`, bấm quay về Game Hub thành công.
   - Kiểm tra mở Dino Quest: xác nhận màn hình khởi động, bấm "Bắt Đầu Thám Hiểm".
   - Vượt Vùng 1 thành công (chọn Cửa B đúng -> cổng vàng mở, điểm lên 10).
   - Thử nghiệm chọn sai tại Vùng 2 (chọn Cửa C sai -> Cá sấu lao ra, T-Rex choáng váng, `GameOverModal` xuất hiện với giải thích khoa học chuẩn xác).

2. **Kịch bản `test-quest-victory.mjs`:**
   - Thực hiện chuỗi trả lời đúng liên tục 10/10 Vùng đất từ Vùng 1 đến Vùng 10 theo đúng bảng đáp án chuẩn: `['B', 'D', 'A', 'C', 'B', 'D', 'A', 'C', 'B', 'D']`.
   - Xác nhận `VictoryModal` xuất hiện với điểm số tuyệt đối `100/100`, danh hiệu "Nhà thám hiểm Tri thức".
   - Bấm nút "Xem Giấy Chứng Nhận": xác nhận Canvas Certificate kết xuất hình ảnh thành công, có nút "Tải Ảnh Chứng Nhận" (PNG).

---

## 6. DANH MỤC ẢNH CHỤP MÀN HÌNH NGHIỆM THU

Toàn bộ ảnh chụp màn hình kiểm thử thực tế được lưu trữ tại thư mục `docs/game-hub/screenshots/`:

| STT | Tên tệp ảnh | Nội dung minh chứng |
|:---:|:---|:---|
| 01 | `01_game_hub_menu.png` | Giao diện Game Hub 2x2 với 4 thẻ trò chơi và huy hiệu trạng thái. |
| 02 | `02_placeholder_modal.png` | Modal thông báo "Tính năng đang phát triển" cho Dino Match. |
| 03 | `03_dino_runner_regression.png` | Dino Exam Runner V2.1 hoạt động ổn định, kèm nút `← Game Khảo thí`. |
| 04 | `04_dino_quest_start_screen.png` | Màn hình khởi động Dino Quest với lời dẫn 10 vùng đất. |
| 05 | `05_dino_quest_world1.png` | Vùng 1 (Đồng cỏ Tri thức): HUD câu hỏi, 4 cánh cửa 2.5D, T-Rex tiền cảnh. |
| 06 | `06_dino_quest_door_b_correct.png` | Chọn đúng Cửa B: Cổng hoàng kim phát sáng rực rỡ, T-Rex tiến vào. |
| 07 | `07_dino_quest_world2.png` | Vùng 2 (Rừng Ma trận đề) với bảng màu và hiệu ứng hạt đặc trưng. |
| 08 | `08_dino_quest_animal_surprise.png` | Chọn sai: Con vật bất ngờ (Cá sấu) lao ra, T-Rex ngã choáng váng. |
| 09 | `09_dino_quest_game_over.png` | GameOverModal: hiển thị đáp án đúng và lời giải thích khoa học chi tiết. |
| 10 | `10_dino_quest_victory_modal.png` | VictoryModal: Chúc mừng chiến thắng 100/100 điểm, vinh danh danh hiệu. |
| 11 | `11_dino_quest_certificate_viewer.png` | Xem trước Giấy chứng nhận tốt nghiệp với nút tải ảnh PNG sắc nét. |

---

## 7. DANH SÁCH TỆP TIN THAY ĐỔI & THÊM MỚI

### 7.1. Thư mục và tệp mới tạo:
- `components/game-hub/GameHub.tsx`: Component Game Hub trung tâm (lưới 2x2, modal placeholder, điều phối game).
- `components/dino-quest/DinoQuestGame.tsx`: Master coordinator của Dino Quest (âm thanh, bàn phím, toàn màn hình).
- `components/dino-quest/DinoQuestCanvas.tsx`: Đồ họa 2.5D Canvas (phối cảnh, 4 cánh cửa, T-Rex sprite, 3 con vật, portal).
- `components/dino-quest/QuestionBanner.tsx`: HUD câu hỏi trên đỉnh màn hình (vùng đất, miền kiến thức, điểm số).
- `components/dino-quest/DoorOptionsBar.tsx`: 4 thanh lựa chọn tương ứng 4 cánh cửa (phím tắt 1-4, A-D).
- `components/dino-quest/GameOverModal.tsx`: Hộp thoại khi chọn sai (con vật bất ngờ, so sánh đáp án, giải thích khoa học).
- `components/dino-quest/VictoryModal.tsx`: Hộp thoại vinh danh khi hoàn thành 10/10 câu hỏi (100 điểm).
- `components/dino-quest/CustomizerModal.tsx`: Hộp thoại đổi tên nhân vật và chọn 6 màu da khủng long.
- `lib/dino-quest/types.ts`: Hệ thống kiểu dữ liệu TypeScript cho Dino Quest.
- `lib/dino-quest/questions.ts`: Ngân hàng 10 câu hỏi nguyên văn phụ lục.
- `lib/dino-quest/worlds.ts`: Dữ liệu thiết kế 10 vùng đất (màu sắc, hạt, chủ đề).
- `lib/dino-quest/audio.ts`: Trình phát âm thanh Web Audio API tổng hợp.
- `lib/dino-quest/certificate.ts`: Trình tạo Giấy chứng nhận bằng HTML5 Canvas và xuất PNG.
- `tests/game-hub/verify-quest-questions.mjs`: Script kiểm thử toàn vẹn câu hỏi.
- `tests/game-hub/test-game-hub-e2e.mjs`: Script E2E kiểm thử Game Hub và hành vi game.
- `tests/game-hub/test-quest-victory.mjs`: Script E2E kiểm thử toàn thắng 10 vùng đất và giấy chứng nhận.
- `docs/game-hub/GAME_HUB_AND_DINO_QUEST_V1.md`: Tài liệu kỹ thuật & nghiệm thu này.

### 7.2. Tệp tin sửa đổi:
- `app/page.tsx`: Thay thế việc gọi trực tiếp `<DinoGame />` bằng `<GameHub />`.
- `components/dino-exam/DinoGame.tsx`: Tiếp nhận thêm prop tùy chọn `onBackToHub?: () => void` và hiển thị nút quay lại sảnh nếu được truyền vào.

---

## 8. HƯỚNG DẪN CHẠY THỬ NGHIỆM TẠI LOCAL

1. Đảm bảo nhánh hiện tại là `feat/game-hub-dino-quest`.
2. Khởi động server phát triển (nếu chưa chạy):
   ```bash
   npm run dev
   ```
3. Mở trình duyệt tại: [http://localhost:3000](http://localhost:3000)
4. Quan sát tại Hero Section (cột bên phải):
   - Nhấp vào **"DINO EXAM RUNNER"**: Thử nghiệm trò chơi chạy vô tận v2.1, bấm `← Game Khảo thí` để quay lại Hub.
   - Nhấp vào **"DINO QUEST: 4 CÁNH CỬA"**: Bấm "Bắt Đầu Thám Hiểm", dùng phím `1, 2, 3, 4` hoặc click chuột vào cánh cửa để trải nghiệm.
   - Nhấp vào **"DINO MATCH"** hoặc **"CAT RUNNER"**: Kiểm tra hộp thoại thông báo tính năng đang phát triển.

---

## 9. QUY TRÌNH ROLLBACK KHẨN CẤP (NẾU CẦN)

Toàn bộ công việc được thực hiện trên nhánh riêng biệt `feat/game-hub-dino-quest`. Nhánh `main` vẫn giữ nguyên trạng thái Production baseline (`997e25a` / `a4b094b`).

Nếu muốn lập tức quay lại phiên bản Dino Exam Runner V2.1 ban đầu:
```bash
git checkout main
```
Toàn bộ mã nguồn sẽ trở về chính xác trạng thái Production đang chạy trên [https://huutaigenz.vercel.app/](https://huutaigenz.vercel.app/) trong 1 giây mà không có bất kỳ rủi ro nào.

---

## 10. CAM KẾT & TRẠNG THÁI HIỆN TẠI

- **Git Remote:** CHƯA push lên origin/main hay bất kỳ remote nào.
- **Production Vercel:** CHƯA deploy lên https://huutaigenz.vercel.app/.
- **Mã nguồn ngoài Game:** Blog, Phần mềm, Admin, SEO, Header, Footer được bảo toàn tuyệt đối 100%.
- **Sẵn sàng:** Đã sẵn sàng để chủ dự án trực tiếp trải nghiệm và phê duyệt trước khi tiến hành các bước tiếp theo.
