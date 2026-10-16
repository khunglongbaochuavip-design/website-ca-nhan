# DINO EXAM RUNNER V2.0 — IMPLEMENTATION LOG
## Nhật Ký Kỹ Thuật & Quản Lý Thay Đổi Mã Nguồn

**Dự án:** Website cá nhân Hữu Tài Genz (`https://huutaigenz.vercel.app/`)  
**Commit HEAD Cơ sở:** `4525b1e1d9f5abd9e390db07e3a6546c7e1e9976`  
**Ngày thực hiện:** 16/10/2026

---

## 1. DANH SÁCH FILE VÀ PHẠM VI CAN THIỆP

### 1.1. File Tạo Mới
1. `components/dino-exam/InGameQuestionBanner.tsx`: HUD hiển thị câu hỏi, lĩnh vực, thanh tiến trình 7s đọc đề ngay trên Canvas.
2. `tests/dino-exam/verify-questions.mjs`: Bộ kiểm thử Node.js độc lập xác thực tính toàn vẹn 40 câu hỏi.
3. `tests/dino-exam/browser-audit-v2.mjs`: Kịch bản kiểm thử trình duyệt CDP Headless tự động cho V2.0.
4. `docs/dino-exam/questions_v2.json`: Bản trích xuất JSON toàn diện 40 câu hỏi phục vụ audit độc lập.
5. `docs/dino-exam/questions_v2.csv`: Bản trích xuất CSV định dạng UTF-8 with BOM chuẩn hóa.
6. `docs/dino-exam/V2_GAMEPLAY_SPEC.md`: Tài liệu thiết kế kỹ thuật và vật lý gameplay V2.0.
7. `docs/dino-exam/V2_QUESTION_BANK_REVIEW.md`: Báo cáo thẩm định 40 câu hỏi chuyên môn Khảo thí.
8. `docs/dino-exam/V2_IMPLEMENTATION_LOG.md`: Nhật ký triển khai chi tiết này.
9. `docs/dino-exam/V2_TEST_REPORT.md`: Báo cáo kết quả kiểm thử thực tế.
10. `docs/dino-exam/V2_AUDIT_EVIDENCE.md`: Bằng chứng nghiệm thu và đối chiếu ảnh chụp màn hình.

### 1.2. File Chỉnh Sửa
1. `lib/dino-exam/types.ts`: Cập nhật `DinoChoice` (`'JUMP' | 'RUN'`), `DinoQuestionV2`, `AnswerCluster`, `GameStateV2`.
2. `lib/dino-exam/questions.ts`: Mở rộng lên 40 câu hỏi chính xác từ phụ lục, cấu trúc phân nhánh `jump` và `run`, 2.5 điểm/câu.
3. `lib/dino-exam/constants.ts`: Điều chỉnh thời gian đọc đề `READING_DURATION_MS = 7000`.
4. `lib/dino-exam/certificate.ts`: Đồng bộ hóa bộ tạo chứng nhận Canvas 1600x1100 px cho 40 câu / 100 điểm, bảo toàn tuyên bố miễn trừ pháp lý và bỏ mọi con dấu giả mạo.
5. `components/dino-exam/DinoCanvas.tsx`: Tái cấu trúc toàn diện thành Continuous Runner Engine, loại bỏ dependency reset trong `useEffect`, thiết lập 2 cổng đáp án, cơ chế va chạm không sát thương vật lý ngẫu nhiên.
6. `components/dino-exam/DinoGame.tsx`: Quản lý luồng FSM V2.0 (`READY` -> `READING` -> `APPROACHING` -> `DECISION` -> `RESOLUTION` -> `VICTORY` / `GAME_OVER`), kết nối banner HUD, bắt phím `Space`/`ArrowUp` chống cuộn trang.
7. `components/dino-exam/GameOverModal.tsx`: Hiển thị phân tích lựa chọn của người chơi vs đáp án chính xác, điểm tích lũy và giải thích chuyên môn.
8. `components/dino-exam/VictoryModal.tsx`: Cập nhật vinh danh 40/40 câu hỏi, 100/100 điểm tối đa, tích hợp nút tải PNG chứng nhận trò chơi.

### 1.3. File Đã Loại Bỏ
1. `components/dino-exam/QuestionOverlay.tsx`: Panel 3 nút bấm V1.0 bên ngoài canvas, đã được thay thế triệt để bởi `InGameQuestionBanner.tsx`.

### 1.4. Danh Mục File ĐƯỢC BẢO VỆ TUYỆT ĐỐI (Không can thiệp)
- `app/admin/**`: Toàn bộ hệ thống quản trị CMS.
- `app/api/**`: Toàn bộ các API route (Supabase, Auth, R2 presign, Software, Blog).
- `app/blog/**`: Giao diện danh sách và chi tiết Blog.
- `app/phan-mem/**`: Giao diện danh mục phần mềm và chi tiết.
- `app/layout.tsx`: Root layout website.
- `components/ui/**`, `components/Navbar.tsx`, `components/Footer.tsx`, `components/AdminSidebar.tsx`: Các component cốt lõi website.
- `supabase/**`: Database schema và migrations.
- `tailwind.config.ts`, `next.config.ts`: Cấu hình hệ thống.

---

## 2. QUÁ TRÌNH TRIỂN KHAI QUA CÁC GIAI ĐOẠN

### Phase 0: Baseline Inspection
- Kiểm tra `git status`, lưu lại commit cơ sở. Xác nhận hệ thống Next.js 16.3.4 (Turbopack) và Tailwind CSS.
- Đánh giá nguyên nhân gốc rễ lỗi giật/reset ở V1.0: `DinoCanvas` có `[currentQuestionIndex]` trong dependency array của `useEffect`, khiến mỗi câu hỏi mới lại hủy animation frame cũ, xóa state và khởi tạo lại `groundOffset = 0`.
- Giải pháp: Đưa toàn bộ game loop vào 1 instance `useEffect` duy nhất chạy khi mount (`[]`), truy xuất state động qua `stateRef.current`.

### Phase 1 & 2: New Gameplay Contract & Continuous World
- Bỏ cơ chế 3 lựa chọn (Đi thẳng / Nhảy / Cúi). Chuyển sang cơ chế Binary Choice: Nhảy (JUMP) hoặc Không nhảy (RUN).
- Cụm cổng đáp án gồm 2 hitbox nổi:
  - Cổng trên: $y = 190\text{px}$ (ứng với đỉnh bước nhảy T-Rex).
  - Cổng dưới: $y = 280\text{px}$ (ứng với mặt đất khi T-Rex chạy thẳng).
- Tách rời vật lý va chạm: Cả hai cổng đều cho phép khủng long đi xuyên qua. Thua cuộc chỉ xảy ra nếu người chơi chọn sai cổng so với `correctChoice`.

### Phase 3 & 4: In-Game HUD & 40-Question Expansion
- Thiết kế `InGameQuestionBanner.tsx` bán trong suốt (`backdrop-blur-md bg-neutral-950/85`) đặt ngay nóc Canvas.
- Tích hợp thanh đếm ngược 7 giây đọc đề. Khi đọc đề, không có cổng chướng ngại xuất hiện.
- Mở rộng ngân hàng câu hỏi từ 20 lên 40 câu chính xác nguyên văn từ phụ lục, kiểm soát cân bằng chính xác 20 câu Nhảy và 20 câu Không nhảy.

### Phase 5 & 6: Audio Polish & Certificate Compliance
- Giữ nguyên hiệu ứng âm thanh 8-bit và nhạc nền retro từ SoundManager.
- Nâng cấp `certificate.ts`: Giữ nguyên canvas độ phân giải cao $1600 \times 1100\text{px}$, bố cục trang nhã, viền vàng kim hoàng gia.
- Đảm bảo tuân thủ 100% yêu cầu pháp lý:
  - Bỏ toàn bộ con dấu bên ngoài (MOET, AUN-QA).
  - Bỏ chữ ký mô phỏng của chủ website.
  - Bỏ mã xác thực ảo.
  - Ghi rõ dòng chữ cảnh báo nổi bật: `★ CHỨNG NHẬN HOÀN THÀNH TRÒ CHƠI — KHÔNG PHẢI CHỨNG CHỈ CHUYÊN MÔN ★`.

### Phase 7 & 8: Build, Acceptance Test & Documentation
- Chạy `npx tsc --noEmit`: 0 lỗi type.
- Chạy `npm run build`: Tạo production build thành công 100% trong 3.0s.
- Chạy `node tests/dino-exam/browser-audit-v2.mjs`: Kiểm thử tự động trên Chrome Headless, chụp ảnh 4 độ phân giải (1920x1080, 1366x768, 390x844, 360x800), kiểm chứng thành công Jump, Run, GameOverModal và xuất mẫu Certificate PNG.
