# DINO EXAM RUNNER V2.0 — AUDIT EVIDENCE & COMPLIANCE VERIFICATION
## Bằng Chứng Nghiệm Thu & Thẩm Định Pháp Lý / Thiết Kế

**Dự án:** Website cá nhân Hữu Tài Genz (`https://huutaigenz.vercel.app/`)  
**Ngày nghiệm thu:** 16/10/2026  
**Thư mục lưu trữ bằng chứng:** [`docs/dino-exam/screenshots/`](file:///d:/PhanMem/Ph%E1%BA%A7n%20m%E1%BB%81m%20c%E1%BB%A7a%20T%C3%A0i/Website%20c%C3%A1%20nh%C3%A2n/docs/dino-exam/screenshots)

---

## 1. DANH MỤC ẢNH CHỤP MÀN HÌNH THỰC TẾ (SCREENSHOT EVIDENCE)

Toàn bộ ảnh chụp màn hình được sinh ra tự động từ Chrome DevTools Protocol (CDP) trong phiên kiểm thử `browser-audit-v2.mjs`:

| Tên Tệp Ảnh | Độ Phân Giải | Kích Thước | Nội Dung & Trạng Thái Ghi Nhận |
| :--- | :---: | :---: | :--- |
| `desktop_1920x1080_ready.png` | 1920 × 1080 | 782 KB | **Màn hình Chờ Desktop Full HD:** Bố cục 2 cột, Hero Section thương hiệu bên trái, Console game v2.0 bên phải. |
| `desktop_1366x768_ready.png` | 1366 × 768 | 462 KB | **Màn hình Chờ Desktop Laptop:** Tỷ lệ hiển thị cân đối, không tràn màn hình, nút "Bắt Đầu Chơi Ngay" nổi bật. |
| `mobile_390x844_ready.png` | 390 × 844 | 553 KB | **Màn hình Chờ Mobile (iPhone 12/13/14):** Giao diện xếp chồng dọc mượt mà, canvas 2:1 vừa vặn khung hình. |
| `mobile_360x800_ready.png` | 360 × 800 | 521 KB | **Màn hình Chờ Mobile (Android phổ thông):** Font chữ sắc nét, căn lề an toàn chuẩn responsive. |
| `desktop_1920x1080_reading.png` | 1920 × 1080 | 742 KB | **Giai đoạn Đọc Đề (Desktop):** Banner HUD bán trong suốt nằm trên nóc Canvas, thanh đếm ngược 7s đang thu hẹp dần, T-Rex chạy liên tục. |
| `mobile_390x844_reading.png` | 390 × 844 | 537 KB | **Giai đoạn Đọc Đề (Mobile):** HUD đọc đề gọn gàng, nút bấm `[ ⬆️ NHẢY ]` nổi ở góc dưới bên phải. |
| `desktop_1920x1080_approaching.png` | 1920 × 1080 | 750 KB | **Cụm Cổng Đáp Án Bay Vào:** Hết 7s, cụm 2 cổng (`NHẢY ↑` ở trên, `ĐI THẲNG →` ở dưới) bay từ phải sang trái. |
| `desktop_1920x1080_jump.png` | 1920 × 1080 | 212 KB | **Khủng Long Bật Nhảy (Spacebar):** T-Rex bay bổng lên độ cao $y=205\text{px}$, tiến vào cổng trên để chọn đáp án JUMP. |
| `desktop_1920x1080_game_over.png` | 1920 × 1080 | 212 KB | **Modal Thua Cuộc Desktop:** Thẻ review chi tiết câu hỏi, hiển thị rõ lựa chọn của bạn vs đáp án đúng kèm phân tích chuyên môn. |
| `mobile_390x844_game_over.png` | 390 × 844 | 208 KB | **Modal Thua Cuộc Mobile:** Hiển thị trực quan, hỗ trợ cuộn mượt và nút "Thử Lại Ngay" dễ bấm ngón tay. |
| `desktop_1920x1080_customizer.png` | 1920 × 1080 | 203 KB | **Modal Tùy Biến Khủng Long:** Cho phép đổi tên, chọn 6 bảng màu Pixel Art (Lục bảo, Hổ phách, Lam ngọc, Tím, Hồng ngọc, Hắc diện thạch). |
| `certificate_v2_sample.png` | 1600 × 1100 | 1.44 MB | **Mẫu Giấy Chứng Nhận Độ Phân Giải Cao:** Thiết kế viền vàng kim trang trọng, biểu tượng trò chơi, tuyên bố miễn trừ trách nhiệm pháp lý. |

---

## 2. BẢNG KIỂM TRA TUÂN THỦ PHÁP LÝ & BẢO MẬT (COMPLIANCE AUDIT)

| Tiêu Chí Thẩm Định | Yêu Cầu Của Người Dùng | Trạng Thái Thực Tế | Bằng Chứng Xác Nhận |
| :--- | :--- | :---: | :--- |
| **Loại bỏ con dấu bên ngoài** | Bắt buộc loại bỏ mọi con dấu Bộ GD&ĐT (MOET), AUN-QA hoặc các tổ chức giáo dục khi chưa có ủy quyền. | **ĐẠT (PASS)** | `certificate.ts` và ảnh mẫu hoàn toàn không có bất kỳ con dấu MOET/AUN-QA nào. |
| **Không mô phỏng chữ ký** | Không được tạo chữ ký điện tử giả lập hoặc mô phỏng chữ ký tay của chủ website. | **ĐẠT (PASS)** | Góc dưới chứng nhận sử dụng chữ in trang nhã (Typography) ghi rõ: *Website Hữu Tài Genz — huutaigenz.vercel.app*. |
| **Không dùng mã xác thực ảo** | Không dùng mã hash, serial hoặc QR code nếu không có hệ thống backend xác thực thực tế. | **ĐẠT (PASS)** | Đã loại bỏ hoàn toàn các mã serial giả lập. |
| **Tuyên bố miễn trừ trách nhiệm** | Phải ghi rõ đây là giấy chứng nhận hoàn thành trò chơi giải trí, không phải chứng chỉ chuyên môn. | **ĐẠT (PASS)** | Ghi rõ ràng bằng chữ hoa màu đỏ: `★ CHỨNG NHẬN HOÀN THÀNH TRÒ CHƠI — KHÔNG PHẢI CHỨNG CHỈ CHUYÊN MÔN ★` và điều khoản chi tiết ở footer. |
| **Giữ nguyên nội dung website** | Không làm ảnh hưởng đến Hero, thông tin cá nhân, danh mục phần mềm, blog hay admin. | **ĐẠT (PASS)** | Toàn bộ các section ngoài game đều nguyên vẹn 100%. |
| **Kiểm soát triển khai** | Dừng lại ở môi trường máy cục bộ (Local), KHÔNG tự ý push Git remote hay deploy Production. | **ĐẠT (PASS)** | Toàn bộ mã nguồn và báo cáo được nghiệm thu cục bộ tại `http://localhost:3000`. Không có lệnh `git push` hay `vercel deploy` nào được kích hoạt. |
