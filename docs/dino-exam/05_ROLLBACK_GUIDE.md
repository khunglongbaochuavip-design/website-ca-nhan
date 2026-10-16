# DINO EXAM RUNNER — HƯỚNG DẪN HOÀN NGUYÊN (ROLLBACK GUIDE)

Tài liệu này cung cấp các bước khôi phục trạng thái nguyên bản của website cá nhân Hữu Tài Genz trong trường hợp khẩn cấp mà không làm ảnh hưởng đến cơ sở dữ liệu Vercel Blob hay nội dung hiện có.

---

## 1. Hoàn nguyên Nhanh qua Git (1 Câu lệnh)

Vì toàn bộ thay đổi tích hợp giao diện người dùng chỉ nằm trong tệp `app/page.tsx`, bạn chỉ cần chạy câu lệnh Git sau để đưa Hero Section trở về nguyên bản:

```bash
git checkout main -- app/page.tsx
```

Sau đó chạy build lại để kiểm tra:

```bash
npm run build
```

Website sẽ ngay lập tức trở lại giao diện Hero Section ban đầu trước khi nhúng game.

---

## 2. Hoàn nguyên Hoàn toàn (Gỡ bỏ module game độc lập)

Nếu muốn dọn dẹp toàn bộ các tệp liên quan đến Dino Exam Runner:

1. **Khôi phục trang chủ:**
   ```bash
   git checkout main -- app/page.tsx
   ```

2. **Xóa các thư mục độc lập:**
   - Xóa `lib/dino-exam/`
   - Xóa `components/dino-exam/`
   - Xóa `tests/dino-exam/`
   - Xóa `docs/dino-exam/`

3. **Xác nhận tính toàn vẹn:**
   ```bash
   npm run build
   ```
   Hệ thống sẽ biên dịch sạch sẽ mà không còn dấu vết của module trò chơi.

---

## 3. Danh sách Kiểm tra Sau khi Hoàn nguyên (Post-Rollback Checklist)
- [ ] Trang chủ `https://huutaigenz.vercel.app/` tải bình thường.
- [ ] Danh sách phần mềm tải từ Vercel Blob hiển thị đầy đủ 4 phần mềm.
- [ ] Danh sách bài viết blog tải từ Vercel Blob hiển thị đầy đủ.
- [ ] Giao diện Admin `https://huutaigenz.vercel.app/admin` đăng nhập và lưu dữ liệu bình thường.
