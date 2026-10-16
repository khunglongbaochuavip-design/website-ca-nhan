import type { DinoQuestQuestion } from './types';

export const TOTAL_WORLDS = 10;
export const POINTS_PER_WORLD = 10;
export const MAX_QUEST_SCORE = 100;

export const DINO_QUEST_QUESTIONS: DinoQuestQuestion[] = [
  {
    id: 'Q01',
    worldId: 'world-1',
    domain: 'Ma trận đề thi',
    stem: 'Khi đề thi bỏ sót một chuẩn đầu ra quan trọng đã quy định trong chương trình, hệ quả nghiêm trọng nhất đối với chất lượng đo lường là gì?',
    options: {
      A: 'Làm suy giảm độ đồng nhất nội tại (internal consistency) của toàn bài thi',
      B: 'Gây ra sự thiếu hụt đại diện cấu trúc (construct underrepresentation) và làm giảm độ giá trị nội dung',
      C: 'Làm tăng sai số đo lường ngẫu nhiên đối với nhóm thí sinh có năng lực cao',
      D: 'Khiến chỉ số độ phân biệt của các câu hỏi còn lại trong đề chuyển sang giá trị âm',
    },
    correctOption: 'B',
    explanation:
      'Theo lý thuyết độ giá trị hiện đại, việc bỏ sót chuẩn đầu ra cốt lõi làm cho công cụ đo không bao phủ hết miền nội dung cần đánh giá, dẫn đến lỗi thiếu hụt đại diện cấu trúc (construct underrepresentation) và trực tiếp làm suy yếu bằng chứng về độ giá trị nội dung.',
  },
  {
    id: 'Q02',
    worldId: 'world-2',
    domain: 'CTT',
    stem: 'Trong Lý thuyết khảo thí cổ điển (CTT), một câu hỏi có chỉ số độ dễ p = 0,90 và hệ số tương quan câu–tổng hiệu chỉnh (r_it) xấp xỉ 0,00. Nhận định nào sau đây là phù hợp nhất?',
    options: {
      A: 'Câu hỏi bị sai đáp án chuẩn (keyed-wrong) và bắt buộc phải loại bỏ ngay khỏi ngân hàng câu hỏi',
      B: 'Câu hỏi có mức độ rất khó nhưng lại có khả năng phân loại xuất sắc nhóm thí sinh giỏi',
      C: 'Câu hỏi chỉ phù hợp cho kỳ thi tuyển chọn có tính cạnh tranh cao (norm-referenced test)',
      D: 'Câu hỏi rất dễ và hầu như không có khả năng phân biệt thí sinh theo tổng điểm bài thi',
    },
    correctOption: 'D',
    explanation:
      'Chỉ số p = 0,90 cho thấy 90% thí sinh trả lời đúng (câu hỏi dễ, biên độ phương sai câu hỏi hẹp); hệ số tương quan câu–tổng hiệu chỉnh gần 0,00 phản ánh câu hỏi này không đóng góp vào việc phân hóa mức độ năng lực của thí sinh theo tổng điểm phần còn lại (tuy nhiên vẫn có thể giữ lại trong bài thi đánh giá theo chuẩn - criterion-referenced nếu đo lường kiến thức nền tảng bắt buộc).',
  },
  {
    id: 'Q03',
    worldId: 'world-3',
    domain: 'Độ tin cậy',
    stem: "Nhận định nào sau đây phản ánh đúng bản chất của hệ số Cronbach's Alpha đối với tính đơn hướng (unidimensionality) của bài kiểm tra?",
    options: {
      A: 'Alpha cao không tự chứng minh được tính đơn hướng; cần kiểm định thêm bằng chứng cấu trúc như phân tích nhân tố',
      B: 'Alpha đạt từ 0,80 trở lên là điều kiện đủ để kết luận bài kiểm tra chỉ đo lường một năng lực duy nhất',
      C: 'Alpha đo lường trực tiếp cấu trúc không gian tiềm ẩn của đề thi nên hoàn toàn thay thế được phân tích nhân tố',
      D: 'Alpha luôn tỷ lệ nghịch với số lượng câu hỏi nên chỉ phản ánh tính đơn hướng ở các bài thi ngắn',
    },
    correctOption: 'A',
    explanation:
      "Cronbach's Alpha chỉ phản ánh mức độ đồng nhất nội tại (internal consistency) và chịu ảnh hưởng lớn bởi số lượng câu hỏi trong đề; một bài thi đa hướng vẫn có thể đạt Alpha rất cao, do đó cần các kỹ thuật như phân tích nhân tố khám phá (EFA) hoặc khẳng định (CFA) để xác nhận tính đơn hướng.",
  },
  {
    id: 'Q04',
    worldId: 'world-4',
    domain: 'IRT 2PL',
    stem: 'Trong mô hình IRT 2 tham số (2PL), tham số nào trực tiếp quyết định độ dốc cực đại tại điểm uốn của đường cong đặc trưng câu hỏi (ICC)?',
    options: {
      A: 'Tham số độ khó b',
      B: 'Tham số đoán mò giả c',
      C: 'Tham số độ phân biệt a',
      D: 'Tham số năng lực tiềm ẩn θ (theta)',
    },
    correctOption: 'C',
    explanation:
      'Trong mô hình logistic 2 tham số (2PL), tham số phân biệt a tỷ lệ thuận với độ dốc của đường cong đặc trưng câu hỏi (ICC) tại điểm uốn (nơi năng lực θ = b), phản ánh khả năng câu hỏi phân tách các thí sinh có mức năng lực nằm lân cận độ khó b.',
  },
  {
    id: 'Q05',
    worldId: 'world-5',
    domain: 'Rasch',
    stem: 'Trong mô hình Rasch nhị phân (1PL với hệ số phân biệt cố định bằng 1), khi mức năng lực θ (theta) của người học bằng đúng độ khó b của câu hỏi, xác suất trả lời đúng câu hỏi đó là bao nhiêu?',
    options: {
      A: '25%',
      B: '50%',
      C: '75%',
      D: '100%',
    },
    correctOption: 'B',
    explanation:
      'Theo hàm logistic của mô hình Rasch nhị phân P(X=1 | θ, b) = e^(θ - b) / (1 + e^(θ - b)), khi θ = b thì θ - b = 0, dẫn đến xác suất trả lời đúng là e^0 / (1 + e^0) = 1 / 2 = 0,50 (hay 50%).',
  },
  {
    id: 'Q06',
    worldId: 'world-6',
    domain: 'DIF',
    stem: 'Khi phân tích dữ liệu khảo thí, phát hiện hai nhóm nhân khẩu học có tỷ lệ trả lời đúng (p) chênh lệch đáng kể ở một câu hỏi. Điều kiện nào là bắt buộc trước khi kết luận câu hỏi đó có hiện tượng hoạt động chệch (DIF)?',
    options: {
      A: 'Kiểm định xem kích thước mẫu của cả hai nhóm có vượt ngưỡng 500 thí sinh hay không',
      B: 'Xác nhận câu hỏi đó có chỉ số độ khó tổng thể nằm ngoài khoảng từ 0,20 đến 0,80',
      C: 'Chứng minh độ tin cậy của bài thi ở nhóm tham chiếu cao hơn nhóm tiêu điểm',
      D: 'So sánh xác suất trả lời đúng giữa hai nhóm sau khi đã kiểm soát cùng một mức năng lực được đo',
    },
    correctOption: 'D',
    explanation:
      'Sự khác biệt về tỷ lệ đúng thô giữa hai nhóm có thể phản ánh sự chênh lệch thực sự về năng lực (item impact) chứ không phải sự thiên lệch của câu hỏi; DIF chỉ tồn tại khi các thí sinh có cùng mức năng lực tiềm ẩn (θ) nhưng thuộc hai nhóm khác nhau lại có xác suất trả lời đúng khác nhau.',
  },
  {
    id: 'Q07',
    worldId: 'world-7',
    domain: 'Độ giá trị',
    stem: 'Khi một trường đại học sử dụng điểm thi tuyển sinh đầu vào để dự báo kết quả học tập năm thứ nhất của sinh viên, nguồn bằng chứng độ giá trị nào đóng vai trò trực tiếp và quan trọng nhất?',
    options: {
      A: 'Bằng chứng dựa trên mối quan hệ giữa điểm thi với biến tiêu chí bên ngoài trong tương lai (kết quả học tập về sau)',
      B: 'Bằng chứng dựa trên sự đồng thuận của hội đồng chuyên gia về ma trận nội dung đề thi tuyển sinh',
      C: 'Bằng chứng dựa trên phỏng vấn sâu về quá trình tư duy của thí sinh khi làm bài thi',
      D: 'Bằng chứng dựa trên độ ổn định của điểm số khi tổ chức thi lặp lại (test-retest reliability)',
    },
    correctOption: 'A',
    explanation:
      'Theo chuẩn AERA/APA/NCME, khi mục đích sử dụng điểm số là để dự đoán một kết quả trong tương lai, bằng chứng độ giá trị liên quan trực tiếp nhất là mối tương quan thực nghiệm giữa điểm bài thi và biến tiêu chí (criterion variable) được thu thập về sau (predictive validity evidence).',
  },
  {
    id: 'Q08',
    worldId: 'world-8',
    domain: 'Equating',
    stem: 'Theo lý thuyết quy tương đương điểm số (Test Equating), điều kiện tiên quyết nào sau đây phải được thỏa mãn để hai dạng đề thi có thể quy tương đương theo nghĩa chặt chẽ?',
    options: {
      A: 'Hai dạng đề phải có cùng số lượng câu hỏi, cùng bố cục trình bày và thời gian làm bài nhưng đo các môn học khác nhau',
      B: 'Hai dạng đề phải do cùng một tổ ra đề biên soạn và có điểm trung bình thô của hai nhóm thí sinh bằng nhau tuyệt đối',
      C: 'Hai dạng đề phải được xây dựng từ cùng một đặc tả, đo lường cùng một cấu trúc năng lực và có độ tin cậy tương đương',
      D: 'Hai dạng đề phải chứa tối thiểu 80% câu hỏi trùng nhau hoàn toàn và chỉ thay đổi thứ tự xáo trộn phương án',
    },
    correctOption: 'C',
    explanation:
      'Để thực hiện equating hợp lệ (đảm bảo tính bất biến quần thể, tính đối xứng và tính công bằng), hai dạng đề bắt buộc phải đo lường cùng một cấu trúc tiềm ẩn (same construct) và được thiết kế theo cùng một bảng đặc tả kỹ thuật với độ khó và độ tin cậy tương đương.',
  },
  {
    id: 'Q09',
    worldId: 'world-9',
    domain: 'Standard Setting',
    stem: 'Trong quy trình thiết lập ngưỡng điểm đạt (Standard Setting) bằng phương pháp Angoff điều chỉnh, các chuyên gia trong hội đồng được yêu cầu thực hiện thao tác cốt lõi nào?',
    options: {
      A: 'Xác định số lượng phương án nhiễu mà một thí sinh trung bình có thể loại trừ được ở mỗi câu hỏi',
      B: 'Ước lượng xác suất (hoặc tỷ lệ) mà một thí sinh ở ngưỡng năng lực đạt tối thiểu (borderline candidate) sẽ trả lời đúng từng câu hỏi',
      C: 'Phân loại trực tiếp từng thí sinh thực tế vào hai nhóm "Đạt" và "Không đạt" trước khi chấm điểm bài thi',
      D: 'Tính toán giá trị trung bình cộng của điểm số thuộc nhóm 27% thí sinh có kết quả cao nhất kỳ thi',
    },
    correctOption: 'B',
    explanation:
      'Bản chất của phương pháp Angoff là định tâm vào câu hỏi (item-centered), trong đó các chuyên gia hình dung chân dung "thí sinh vừa đủ đạt chuẩn tối thiểu" (minimally competent candidate) và ước lượng xác suất người đó trả lời đúng từng câu hỏi, sau đó cộng tổng các xác suất này để xác định điểm cắt (cut-score).',
  },
  {
    id: 'Q10',
    worldId: 'world-10',
    domain: 'Đảm bảo chất lượng',
    stem: 'Trong quản lý chất lượng đào tạo, khi kết quả đánh giá cho thấy tỷ lệ người học đạt một chuẩn đầu ra (PLO/CLO) thấp hơn nhiều so với mục tiêu, hành động nào là phù hợp nhất trước khi quyết định sửa đổi chương trình đào tạo?',
    options: {
      A: 'Hạ ngay mức điểm cắt (cut-score) của chuẩn đầu ra đó để đảm bảo tỷ lệ tốt nghiệp theo kế hoạch',
      B: 'Thay thế toàn bộ đội ngũ giảng viên phụ trách học phần liên quan trong học kỳ tiếp theo',
      C: 'Loại bỏ chuẩn đầu ra đó khỏi bản mô tả chương trình đào tạo vì vượt quá khả năng của người học',
      D: 'Rà soát độ giá trị, độ tin cậy của công cụ đánh giá, quy trình chấm và phân tích nguyên nhân gốc rễ từ dữ liệu',
    },
    correctOption: 'D',
    explanation:
      'Theo nguyên tắc cải tiến chất lượng dựa trên bằng chứng (Evidence-based QA), điểm số thấp có thể bắt nguồn từ lỗi của công cụ đo (đề thi quá khó, lệch chuẩn đầu ra, rubric không rõ) hoặc lỗi triển khai dạy học; do đó phải kiểm định chất lượng của chính dữ liệu và công cụ đánh giá trước khi can thiệp vào cấu trúc chương trình.',
  },
];
