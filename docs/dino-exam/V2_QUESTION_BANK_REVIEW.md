# DINO EXAM RUNNER V2.0 — QUESTION BANK AUDIT & REVIEW
## Ngân hàng 40 Câu hỏi Khảo thí & Đo lường Giáo dục Chuẩn hóa

**Tệp dữ liệu:**
- JSON: [`docs/dino-exam/questions_v2.json`](file:///d:/PhanMem/Ph%E1%BA%A7n%20m%E1%BB%81m%20c%E1%BB%A7a%20T%C3%A0i/Website%20c%C3%A1%20nh%C3%A2n/docs/dino-exam/questions_v2.json)
- CSV: [`docs/dino-exam/questions_v2.csv`](file:///d:/PhanMem/Ph%E1%BA%A7n%20m%E1%BB%81m%20c%E1%BB%A7a%20T%C3%A0i/Website%20c%C3%A1%20nh%C3%A2n/docs/dino-exam/questions_v2.csv)
- Mã nguồn triển khai: [`lib/dino-exam/questions.ts`](file:///d:/PhanMem/Ph%E1%BA%A7n%20m%E1%BB%81m%20c%E1%BB%A7a%20T%C3%A0i/Website%20c%C3%A1%20nh%C3%A2n/lib/dino-exam/questions.ts)

---

## 1. THỐNG KÊ CƠ CẤU NGÂN HÀNG CÂU HỎI V2.0

- **Tổng số câu hỏi:** 40 câu.
- **Thang điểm:** 2.5 điểm/câu = 100 điểm tối đa.
- **Tỷ lệ cân bằng hành động (Choice Balance):**
  - **JUMP (Nhảy):** 20 câu (50.0%)
  - **RUN (Không nhảy / Đi thẳng):** 20 câu (50.0%)
- **Tỷ lệ định dạng câu hỏi:**
  - Lựa chọn nhị phân (Two-Choice): 32 câu (80%)
  - Đúng / Sai (True / False): 8 câu (20%)
- **Kết quả xác minh tự động (`verify-questions.mjs`):** 40/40 câu vượt qua kiểm thử tính toàn vẹn (100% PASS).

---

## 2. BẢNG CHI TIẾT 40 CÂU HỎI THEO 4 NHÓM CHUYÊN ĐỀ

### Nhóm 1: Khảo thí cơ bản & CTT (Câu 01 — 10)
| STT | Mã | Lĩnh vực | Câu hỏi | Nhảy (JUMP) | Không nhảy (RUN) | Đáp án |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| 1 | q01 | Khảo thí | CTT là viết tắt của lý thuyết nào? | Lý thuyết kiểm tra cổ điển. | Lý thuyết ứng đáp câu hỏi. | **JUMP** |
| 2 | q02 | Đo lường | IRT là viết tắt của lý thuyết nào? | Lý thuyết kiểm tra cổ điển. | Lý thuyết ứng đáp câu hỏi. | **RUN** |
| 3 | q03 | Độ khó | Trong CTT, chỉ số p càng cao, câu hỏi thường càng...? | Khó. | Dễ. | **RUN** |
| 4 | q04 | Độ khó | Độ khó câu hỏi nhị phân trong CTT thường là tỷ lệ thí sinh trả lời đúng? | Sai. | Đúng. | **RUN** |
| 5 | q05 | Độ phân cách | Độ phân cách tốt giúp phân biệt thí sinh ở các mức năng lực khác nhau? | Đúng. | Sai. | **JUMP** |
| 6 | q06 | Độ phân cách | Chỉ số phân biệt D có thể nhận giá trị âm? | Có. | Không. | **JUMP** |
| 7 | q07 | Độ tin cậy | Hệ số Cronbach's alpha thường dùng để ước lượng độ tin cậy nhất quán nội tại? | Sai. | Đúng. | **RUN** |
| 8 | q08 | Đo lường | Thang đo Likert thường cung cấp dữ liệu ở mức độ đo lường nào phổ biến nhất? | Định danh. | Thứ bậc. | **RUN** |
| 9 | q09 | Khảo thí | Mục đích chính của đề thi chuẩn hóa là đảm bảo tính công bằng và so sánh được? | Đúng. | Sai. | **JUMP** |
| 10 | q10 | Sai số | Sai số đo lường chuẩn (SEM) tỉ lệ nghịch với độ tin cậy của bài thi? | Sai. | Đúng. | **RUN** |

### Nhóm 2: IRT & Ngân hàng câu hỏi (Câu 11 — 20)
| STT | Mã | Lĩnh vực | Câu hỏi | Nhảy (JUMP) | Không nhảy (RUN) | Đáp án |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| 11 | q11 | IRT | Mô hình Rasch (1PL) giả định các câu hỏi có cùng độ phân cách? | Đúng. | Sai. | **JUMP** |
| 12 | q12 | IRT | Tham số 'b' trong mô hình IRT 2PL biểu thị điều gì? | Độ khó câu hỏi. | Độ đoán mò. | **JUMP** |
| 13 | q13 | IRT | Tham số 'a' trong mô hình IRT 2PL biểu thị điều gì? | Độ đoán mò. | Độ phân cách. | **RUN** |
| 14 | q14 | IRT | Tham số 'c' trong mô hình IRT 3PL biểu thị điều gì? | Độ đoán mò ngẫu nhiên. | Thời gian làm bài. | **JUMP** |
| 15 | q15 | Ngân hàng đề | Ngân hàng câu hỏi cần được định chuẩn tham số trước khi dùng cho bài thi chuẩn hóa? | Sai. | Đúng. | **RUN** |
| 16 | q16 | CAT | Trong thi thích ứng máy tính (CAT), câu hỏi tiếp theo được chọn dựa trên năng lực ước lượng của thí sinh? | Đúng. | Sai. | **JUMP** |
| 17 | q17 | Đo lường | Đường đặc trưng câu hỏi (ICC) trong IRT có dạng chữ gì? | Chữ S (Sigmoid). | Đường parabol. | **JUMP** |
| 18 | q18 | Khảo thí | Ma trận đề thi (Test Blueprint) giúp đảm bảo độ giá trị nội dung của bài thi? | Sai. | Đúng. | **RUN** |
| 19 | q19 | Trắc nghiệm | Câu trắc nghiệm nhiều lựa chọn (MCQ) một đáp án đúng có thể có 2 đáp án đúng đồng thời không? | Có. | Không. | **RUN** |
| 20 | q20 | Đo lường | Đường cong thông tin câu hỏi (IIC) đạt giá trị cực đại tại mức năng lực theta bằng với độ khó b? | Đúng. | Sai. | **JUMP** |

### Nhóm 3: Độ tin cậy, Độ giá trị & Tiêu chuẩn hóa (Câu 21 — 30)
| STT | Mã | Lĩnh vực | Câu hỏi | Nhảy (JUMP) | Không nhảy (RUN) | Đáp án |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| 21 | q21 | Độ giá trị | Một bài thi có độ tin cậy cao thì bắt buộc phải có độ giá trị cao? | Đúng. | Sai. | **RUN** |
| 22 | q22 | Độ giá trị | Độ giá trị là mức độ mà bài thi đo lường đúng cái nó dự định đo? | Đúng. | Sai. | **JUMP** |
| 23 | q23 | Tiêu chuẩn | Phương pháp Angoff thường được dùng để thiết lập điểm chuẩn (Cut-score)? | Sai. | Đúng. | **RUN** |
| 24 | q24 | Tiêu chuẩn | Bài thi dựa trên tiêu chí (Criterion-referenced) so sánh thí sinh với nhau hay với chuẩn năng lực? | So sánh với nhau. | So với chuẩn năng lực. | **RUN** |
| 25 | q25 | Tiêu chuẩn | Bài thi dựa trên chuẩn (Norm-referenced) nhằm xếp hạng thí sinh trong một quần thể? | Đúng. | Sai. | **JUMP** |
| 26 | q26 | Độ tin cậy | Độ tin cậy tương đương (Parallel forms) yêu cầu hai đề thi song song có cùng phân phối điểm và nội dung? | Đúng. | Sai. | **JUMP** |
| 27 | q27 | Đo lường | Điểm z-score có điểm trung bình là 0 và độ lệch chuẩn là 1? | Đúng. | Sai. | **JUMP** |
| 28 | q28 | Đo lường | Điểm T-score có điểm trung bình là bao nhiêu? | Trung bình 50. | Trung bình 100. | **JUMP** |
| 29 | q29 | Phân tích đề | Phương án nhiễu (distractor) tốt là phương án thu hút được nhiều thí sinh nhóm năng lực cao? | Đúng. | Sai. | **RUN** |
| 30 | q30 | Đo lường | Hệ số tương quan biserial thường dùng khi một biến liên tục và một biến nhị phân nhân tạo? | Sai. | Đúng. | **RUN** |

### Nhóm 4: Ứng dụng thực tế & Đánh giá diện rộng (Câu 31 — 40)
| STT | Mã | Lĩnh vực | Câu hỏi | Nhảy (JUMP) | Không nhảy (RUN) | Đáp án |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| 31 | q31 | Đánh giá | Đánh giá quá trình (Formative Assessment) nhằm cải thiện việc dạy và học trong quá trình diễn ra? | Đúng. | Sai. | **JUMP** |
| 32 | q32 | Đánh giá | Đánh giá tổng kết (Summative Assessment) thường diễn ra vào cuối khóa học để xếp loại? | Đúng. | Sai. | **JUMP** |
| 33 | q33 | Chấm thi | Rubric phân tích (Analytic Rubric) cung cấp phản hồi chi tiết theo từng tiêu chí thành phần? | Đúng. | Sai. | **JUMP** |
| 34 | q34 | Khảo thí | Hiện tượng lạm phát điểm (Grade Inflation) phản ánh điểm số tăng mà năng lực thực tế không đổi? | Sai. | Đúng. | **RUN** |
| 35 | q35 | Khảo thí | Phương pháp cân bằng đề (Equating) dùng để chuyển đổi điểm số giữa các đề thi khác nhau về cùng thang đo? | Đúng. | Sai. | **JUMP** |
| 36 | q36 | Đo lường | DIF (Differential Item Functioning) dùng để phát hiện câu hỏi có thiên vị đối với nhóm thí sinh nào đó? | Đúng. | Sai. | **JUMP** |
| 37 | q37 | Khảo thí | Lý thuyết tổng quát hóa (Generalizability Theory - G-Theory) cho phép phân tách nhiều nguồn sai số cùng lúc? | Sai. | Đúng. | **RUN** |
| 38 | q38 | Đánh giá | Đánh giá xác thực (Authentic Assessment) yêu cầu người học vận dụng kiến thức vào bối cảnh thực tế đời sống? | Đúng. | Sai. | **JUMP** |
| 39 | q39 | Khảo thí | Ngân hàng đề thi cần được bảo mật tuyệt đối để tránh lộ lọt đề thi trước giờ thi? | Sai. | Đúng. | **RUN** |
| 40 | q40 | Đo lường | Lý thuyết đo lường hiện đại xem năng lực của thí sinh là một biến tiềm ẩn (Latent Trait)? | Đúng. | Sai. | **JUMP** |

---

## 3. KẾT LUẬN KIỂM TOÁN NỘI DUNG

1. Toàn bộ 40 câu hỏi được bảo toàn nguyên văn về thuật ngữ học thuật và kiến thức chuyên ngành Khảo thí & Đo lường Giáo dục.
2. Tỷ lệ phương án đúng đạt thế cân bằng hoàn hảo $20/20$ ($50\% - 50\%$), ngăn ngừa hiện tượng đoán mò thiên lệch một bên.
3. Mỗi câu hỏi đều có giải thích chuyên môn ngắn gọn, chính xác, hiển thị ngay khi người chơi gặp va chạm chướng ngại vật để hỗ trợ củng cố kiến thức.
