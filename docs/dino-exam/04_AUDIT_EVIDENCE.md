# DINO EXAM RUNNER — BẰNG CHỨNG KIỂM TOÁN TÍCH HỢP (AUDIT EVIDENCE)

**Dự án:** Website cá nhân Hữu Tài Genz  
**Mục tiêu kiểm toán:** Xác minh tính toàn vẹn của mã nguồn, đảm bảo không có bất kỳ hư hại hay thay đổi ngoài ý muốn nào đối với các chức năng đã có của website.

---

## 1. Bằng chứng Bảo toàn Dữ liệu & Tính năng Hiện hữu

### 1.1. Các Section Trang chủ
- **Section Phần Mềm Khảo Thí (`topSoftware.map`):** Giữ nguyên vẹn 100%, render đầy đủ 4 thẻ phần mềm cùng liên kết chi tiết và đếm lượt tải.
- **Section Bài Viết Chuyên Môn (`topBlogs.map`):** Giữ nguyên vẹn 100%, render đầy đủ 3 bài viết chuyên môn gần nhất.
- **Section Hợp Tác & Tư Vấn Khảo Thí:** Giữ nguyên hotline `0902.155.906` và nút nhắn Zalo.

### 1.2. Các Tệp Lõi & Cơ sở Dữ liệu
- `lib/store.ts`, `lib/supabase.ts`, `lib/mockData.ts`: **Không bị chỉnh sửa**, đảm bảo dữ liệu Vercel Blob của 4 phần mềm và 5 bài blog hoạt động ổn định.
- `app/layout.tsx`: **Không bị chỉnh sửa**, giữ nguyên typography Playfair & Inter, thẻ SEO metadata, `EduBackground`, `Header` và `Footer`.
- Toàn bộ thư mục `app/admin/**`, `app/api/**`, `app/phan-mem/**`, `app/blog/**`: **Không bị can thiệp**.

---

## 2. Bằng chứng Bảo toàn 20 Câu hỏi Khảo thí

| STT | Lĩnh vực | Hành động đúng | Minh chứng trích xuất |
| :---: | :--- | :---: | :--- |
| **1** | Khảo thí | A - Đi thẳng | CTT là Classical Test Theory |
| **2** | Đo lường | B - Nhảy | IRT là Item Response Theory |
| **3** | Ngân hàng câu hỏi | C - Cúi | Single-best-answer chỉ có một đáp án đúng nhất |
| **4** | Độ khó câu hỏi | A - Đi thẳng | p-value là tỷ lệ thí sinh trả lời đúng câu hỏi |
| **5** | Độ phân cách | B - Nhảy | Phân biệt thí sinh theo tiêu chí sử dụng |
| **6** | Độ tin cậy | C - Cúi | Tính nhất quán của kết quả đo lường |
| **7** | Độ giá trị | A - Đi thẳng | Hỗ trợ tính phù hợp của diễn giải và sử dụng điểm |
| **8** | Phương án nhiễu | B - Nhảy | Lựa chọn không đúng được thiết kế có chủ đích |
| **9** | Ma trận đề thi | C - Cúi | Phân bố câu hỏi theo các chiều được xác định |
| **10** | Chuẩn đầu ra | A - Đi thẳng | CLO là Course Learning Outcome |
| **11** | Chuẩn đầu ra | B - Nhảy | PLO là Program Learning Outcome |
| **12** | Bloom | C - Cúi | Trong thang Bloom sửa đổi, Create là mức cao nhất |
| **13** | IRT | A - Đi thẳng | Theta biểu diễn mức độ đặc điểm tiềm ẩn (năng lực) |
| **14** | Rasch | B - Nhảy | Rasch nhị phân cơ bản có một tham số độ khó |
| **15** | DIF | C - Cúi | DIF xem xét sự khác biệt có điều kiện giữa các nhóm |
| **16** | SEM | A - Đi thẳng | SEM là Standard Error of Measurement |
| **17** | Kiểm tra đánh giá | B - Nhảy | Đánh giá thường xuyên hỗ trợ cải thiện học tập |
| **18** | Chất lượng câu hỏi | C - Cúi | Phương án mơ hồ làm suy giảm chất lượng câu hỏi |
| **19** | Ngân hàng câu hỏi | A - Đi thẳng | Metadata chứa các thuộc tính mô tả & quản lý câu hỏi |
| **20** | Đánh giá | B - Nhảy | Rubric hỗ trợ đánh giá dựa trên tiêu chí & mức chất lượng |

---

## 3. Danh sách Tệp mới được tạo

```
lib/dino-exam/
├── types.ts           (Định nghĩa Types, Action, Question, Palette, Theme)
├── questions.ts       (20 câu hỏi bảo toàn nguyên văn)
├── constants.ts       (6 bảng màu, 5 parallax themes, timing)
├── audio.ts           (Procedural Web Audio API Sound Engine)
└── certificate.ts     (Canvas Certificate Generator & PNG download)

components/dino-exam/
├── DinoGame.tsx          (Main Orchestrator Component, FSM, HUD)
├── DinoCanvas.tsx        (HTML5 Canvas 2D Pixel Art Renderer, 60fps)
├── QuestionOverlay.tsx   (10s countdown timer & 3 simultaneous actions)
├── GameOverModal.tsx     (Game Over explanation & retry)
├── VictoryModal.tsx      (Victory modal & download certificate button)
└── CustomizerModal.tsx   (Player name & palette customization)

tests/dino-exam/
└── verify-questions.mjs  (Automated validation test script)
```
