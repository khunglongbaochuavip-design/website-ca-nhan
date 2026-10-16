# DINO EXAM RUNNER V2.1 — FINAL RELEASE DOCUMENTATION

## 1. Thông Tin Phiên Bản & Phát Hành
- **Tên trò chơi:** DINO EXAM RUNNER — Hành trình chinh phục Khảo thí
- **Phiên bản:** v2.1
- **Ngày phát hành:** 16/10/2026
- **Git Branch:** `main`
- **Mã nguồn Remote:** `https://github.com/khunglongbaochuavip-design/website-ca-nhan.git`
- **Production URL:** `https://huutaigenz.vercel.app/`
- **Điểm mốc Rollback (Baseline Commit):** `4525b1e1d9f5abd9e390db07e3a6546c7e1e9976`

---

## 2. Tóm Tắt Các Thay Đổi Trong V2.1

### Task 1: Cải thiện hiển thị đáp án trên đường chạy
- Thiết kế lại hoàn toàn các cổng nhận định (Gate / Target Box) trên `DinoCanvas.tsx`:
  - Cổng trên: `[ ↑ NHẢY ] ĐÚNG` (Viền xanh lục bảo neon rực rỡ, nền bán trong suốt tương phản cao, chữ trắng đậm rõ nét).
  - Cổng dưới: `[ KHÔNG NHẢY ] SAI` (Viền đỏ san hô/cam rực rỡ, nền bán trong suốt tương phản cao, chữ trắng đậm rõ nét).
- Xóa bỏ việc nhồi nhét nội dung câu dài vào chướng ngại vật; toàn bộ nhận định hiển thị sắc nét trên HUD Banner `InGameQuestionBanner.tsx` kèm thanh đếm ngược 7 giây.
- Khắc phục triệt để hiện tượng chữ mờ, vỡ hạt canvas hoặc bị cắt rìa (sử dụng tỉ lệ font chuẩn, tự động căn giữa và đệm an toàn).
- Cơ chế `clusterJumpTriggered` lưu lại cú nhảy trong vùng cổng, loại bỏ hoàn toàn độ trễ mili-giây giúp người chơi không bị phán đoán sai.

### Task 2: Nút Chơi Toàn Màn Hình (Fullscreen)
- Tích hợp nút `⛶ Toàn màn hình` / `🗗 Thoát toàn màn hình` chuẩn Fullscreen API trên giao diện chính của `DinoGame.tsx`.
- Hỗ trợ đầy đủ phím tắt `F` hoặc phím `Escape` để chuyển đổi trạng thái toàn màn hình.
- Tự động lắng nghe sự kiện `fullscreenchange` để đồng bộ UI và tỷ lệ co giãn canvas trên mọi độ phân giải màn hình.

### Task 3: Cập nhật Ngân hàng 40 câu hỏi ĐÚNG / SAI
- Thay thế toàn bộ ngân hàng câu hỏi bằng 40 nhận định khảo thí và đo lường giáo dục chuẩn xác (20 ĐÚNG, 20 SAI).
- Quy tắc điều khiển:
  - **Nhận định ĐÚNG:** Người chơi phải **NHẢY** qua cổng trên (`JUMP`).
  - **Nhận định SAI:** Người chơi giữ nguyên **KHÔNG NHẢY** đi qua cổng dưới (`RUN`).
- Cơ chế tính điểm: Mỗi câu trả lời đúng được cộng 2.5 điểm, tối đa 100 điểm khi hoàn thành 40 câu.
- Cập nhật modal GameOver và Victory hiển thị đầy đủ: Lựa chọn của bạn, Đáp án đúng, Giải thích chi tiết và Điểm số đạt được.

---

## 3. Kết Quả Kiểm Thử Trước Triển Khai (Pre-Deployment Audit)
1. **TypeScript Type Check:**
   - Lệnh: `npx tsc --noEmit`
   - Kết quả: **PASS** (0 errors).
2. **Next.js Production Build:**
   - Lệnh: `npm run build`
   - Kết quả: **PASS** (12/12 static & dynamic routes build thành công trong 2.1s).
3. **Question Bank Verification:**
   - Kịch bản kiểm thử: `tests/dino-exam/verify-questions.mjs`
   - Kết quả: **PASS 40/40 câu hỏi (100%)** — đúng từng từ ngữ, mapping `JUMP = TRUE`, `RUN = FALSE`, giải thích và độ khó.
4. **End-to-End Automated Browser Smoke Test:**
   - Kịch bản kiểm thử: `tests/dino-exam/test-v21.mjs`
   - Kết quả: **PASS** — Kiểm thử thành công nút Fullscreen, banner câu hỏi nhận định, cụm cổng ĐÚNG/SAI, hành vi nhảy vượt cổng và hiển thị modal GameOver/Victory.

---

## 4. Hướng Dẫn Rollback Khẩn Cấp (Emergency Rollback)
Nếu cần quay về phiên bản trước Dino Exam Runner:
```bash
# Cách 1: Revert commit release
git revert HEAD --no-edit
git push origin main

# Cách 2: Reset về mốc an toàn đã lưu
git reset --hard 4525b1e1d9f5abd9e390db07e3a6546c7e1e9976
git push --force-with-lease origin main
```
Sau khi push, Vercel sẽ tự động build lại commit tương ứng và khôi phục website trong vòng 1-2 phút.
