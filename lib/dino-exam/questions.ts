import type { DinoQuestionV2, DinoChoice } from './types';

interface RawTrueFalseQuestion {
  id: string;
  domain: string;
  statement: string;
  correctAnswer: boolean;
  explanation: string;
}

const RAW_QUESTIONS: RawTrueFalseQuestion[] = [
  // --- NHÓM A — KHẢO THÍ CƠ BẢN VÀ CTT (Q01 — Q10) ---
  {
    id: 'Q01',
    domain: 'CTT',
    statement: 'CTT là viết tắt của Lý thuyết kiểm tra cổ điển.',
    correctAnswer: true,
    explanation: 'CTT là Classical Test Theory, thường được gọi là Lý thuyết kiểm tra cổ điển.',
  },
  {
    id: 'Q02',
    domain: 'CTT',
    statement: 'Trong CTT, điểm quan sát luôn bằng điểm thực.',
    correctAnswer: false,
    explanation: 'Theo mô hình CTT, điểm quan sát bằng điểm thực cộng sai số đo lường; hai giá trị không nhất thiết bằng nhau.',
  },
  {
    id: 'Q03',
    domain: 'Độ khó câu hỏi',
    statement: 'Trong CTT, chỉ số p của câu hỏi nhị phân thường là tỷ lệ trả lời đúng.',
    correctAnswer: true,
    explanation: 'Với cách tính thông dụng cho câu hỏi chấm điểm 0/1, chỉ số p phản ánh tỷ lệ trả lời đúng của nhóm thí sinh.',
  },
  {
    id: 'Q04',
    domain: 'Độ khó câu hỏi',
    statement: 'Trong CTT, câu hỏi có p = 0,90 thường dễ hơn câu có p = 0,30.',
    correctAnswer: true,
    explanation: 'p cao hơn đồng nghĩa tỷ lệ trả lời đúng cao hơn trong nhóm được phân tích.',
  },
  {
    id: 'Q05',
    domain: 'Độ phân cách',
    statement: 'Chỉ số độ phân cách chỉ dùng để xác định thời gian làm bài.',
    correctAnswer: false,
    explanation: 'Độ phân cách liên quan đến khả năng phân biệt kết quả hoặc mức đặc điểm của người được đo, không phải chỉ số thời gian.',
  },
  {
    id: 'Q06',
    domain: 'Độ tin cậy',
    statement: "Cronbach's Alpha là một chỉ số đo trực tiếp độ khó câu hỏi.",
    correctAnswer: false,
    explanation: "Cronbach's Alpha thường dùng để ước lượng độ nhất quán nội tại của điểm số, không phải độ khó câu hỏi.",
  },
  {
    id: 'Q07',
    domain: 'Độ tin cậy',
    statement: 'Độ tin cậy liên quan đến tính nhất quán của kết quả đo lường.',
    correctAnswer: true,
    explanation: 'Độ tin cậy phản ánh tính nhất quán của điểm số qua các lần hoặc điều kiện đo lường thích hợp.',
  },
  {
    id: 'Q08',
    domain: 'Độ giá trị',
    statement: 'Điểm số có độ tin cậy cao thì tự động có đủ bằng chứng độ giá trị.',
    correctAnswer: false,
    explanation: 'Độ tin cậy cao không tự nó chứng minh các diễn giải và mục đích sử dụng điểm số có đủ bằng chứng độ giá trị.',
  },
  {
    id: 'Q09',
    domain: 'Câu hỏi trắc nghiệm',
    statement: 'Câu trắc nghiệm một đáp án đúng phải xác định được duy nhất một đáp án đúng.',
    correctAnswer: true,
    explanation: 'Với dạng câu hỏi một đáp án đúng, yêu cầu cốt lõi là có một phương án được xác định là đúng.',
  },
  {
    id: 'Q10',
    domain: 'Phương án nhiễu',
    statement: 'Phương án nhiễu là phương án đúng bắt buộc phải chọn.',
    correctAnswer: false,
    explanation: 'Phương án nhiễu là phương án không đúng, được thiết kế để tạo lựa chọn có tính phân biệt.',
  },

  // --- NHÓM B — IRT, RASCH VÀ DIF (Q11 — Q20) ---
  {
    id: 'Q11',
    domain: 'IRT',
    statement: 'IRT là viết tắt của Item Response Theory.',
    correctAnswer: true,
    explanation: 'IRT là Lý thuyết ứng đáp câu hỏi, nghiên cứu mối liên hệ giữa đặc điểm tiềm ẩn và xác suất đáp ứng câu hỏi.',
  },
  {
    id: 'Q12',
    domain: 'IRT',
    statement: 'Trong IRT, theta thường biểu diễn mức độ đặc điểm tiềm ẩn của người được đo.',
    correctAnswer: true,
    explanation: 'Theta thường ký hiệu mức độ của đặc điểm tiềm ẩn, chẳng hạn năng lực.',
  },
  {
    id: 'Q13',
    domain: 'IRT',
    statement: 'Trong mô hình IRT 2PL, chỉ có một tham số câu hỏi.',
    correctAnswer: false,
    explanation: 'Mô hình 2PL có hai tham số câu hỏi: độ khó và độ phân biệt.',
  },
  {
    id: 'Q14',
    domain: 'Rasch',
    statement: 'Mô hình Rasch nhị phân cơ bản sử dụng ba tham số câu hỏi.',
    correctAnswer: false,
    explanation: 'Mô hình Rasch nhị phân cơ bản có một tham số độ khó cho mỗi câu hỏi.',
  },
  {
    id: 'Q15',
    domain: 'IRT 3PL',
    statement: 'Mô hình IRT 3PL có tham số tiệm cận dưới, thường ký hiệu là c.',
    correctAnswer: true,
    explanation: 'Mô hình 3PL bổ sung tham số c bên cạnh tham số độ phân biệt và độ khó.',
  },
  {
    id: 'Q16',
    domain: 'IRT',
    statement: 'Trong IRT, độ khó câu hỏi luôn bằng tỷ lệ thí sinh trả lời đúng.',
    correctAnswer: false,
    explanation: 'Tham số độ khó trong IRT được xác định theo mô hình trên thang đặc điểm tiềm ẩn, không đồng nhất với tỷ lệ trả lời đúng trong CTT.',
  },
  {
    id: 'Q17',
    domain: 'Hàm thông tin',
    statement: 'Hàm thông tin câu hỏi trong IRT phụ thuộc vào mức theta.',
    correctAnswer: true,
    explanation: 'Lượng thông tin câu hỏi cung cấp có thể thay đổi theo mức đặc điểm tiềm ẩn.',
  },
  {
    id: 'Q18',
    domain: 'DIF',
    statement: 'Phát hiện DIF luôn chứng minh câu hỏi có thiên lệch không công bằng.',
    correctAnswer: false,
    explanation: 'DIF là tín hiệu cần xem xét, không tự động chứng minh thiên lệch.',
  },
  {
    id: 'Q19',
    domain: 'DIF',
    statement: 'Phân tích DIF so sánh hoạt động câu hỏi giữa các nhóm sau khi kiểm soát mức đặc điểm được đo.',
    correctAnswer: true,
    explanation: 'DIF xem xét sự khác biệt về hoạt động câu hỏi giữa các nhóm có mức đặc điểm được đo tương đương.',
  },
  {
    id: 'Q20',
    domain: 'Sai số đo lường',
    statement: 'SEM trong CTT là viết tắt của Standard Evaluation Model.',
    correctAnswer: false,
    explanation: 'Trong ngữ cảnh sai số đo lường của CTT, SEM là Standard Error of Measurement.',
  },

  // --- NHÓM C — ĐÁNH GIÁ GIÁO DỤC (Q21 — Q30) ---
  {
    id: 'Q21',
    domain: 'Đánh giá thường xuyên',
    statement: 'Đánh giá thường xuyên có thể cung cấp phản hồi để cải thiện học tập.',
    correctAnswer: true,
    explanation: 'Thông tin đánh giá có thể được sử dụng để điều chỉnh việc dạy và học.',
  },
  {
    id: 'Q22',
    domain: 'Đánh giá tổng kết',
    statement: 'Đánh giá tổng kết chỉ được thực hiện trước khi bắt đầu học tập.',
    correctAnswer: false,
    explanation: 'Đánh giá tổng kết thường được sử dụng để xác định kết quả sau một giai đoạn học tập.',
  },
  {
    id: 'Q23',
    domain: 'Ma trận đề thi',
    statement: 'Ma trận đề thi hỗ trợ kiểm soát phân bố nội dung và mức độ đánh giá.',
    correctAnswer: true,
    explanation: 'Ma trận đề thi thể hiện cấu trúc và sự phân bố câu hỏi theo các chiều đã xác định.',
  },
  {
    id: 'Q24',
    domain: 'Chuẩn đầu ra',
    statement: 'CLO là viết tắt của Program Learning Outcome.',
    correctAnswer: false,
    explanation: 'CLO là Course Learning Outcome, tức chuẩn đầu ra học phần.',
  },
  {
    id: 'Q25',
    domain: 'Chuẩn đầu ra',
    statement: 'PLO là viết tắt của Course Learning Outcome.',
    correctAnswer: false,
    explanation: 'PLO là Program Learning Outcome, tức chuẩn đầu ra chương trình.',
  },
  {
    id: 'Q26',
    domain: 'Bloom',
    statement: 'Trong thang Bloom sửa đổi, Sáng tạo là cấp độ nhận thức cao nhất.',
    correctAnswer: true,
    explanation: 'Create là mức cao nhất trong thang phân loại quá trình nhận thức Bloom sửa đổi.',
  },
  {
    id: 'Q27',
    domain: 'Bloom',
    statement: 'Trong Bloom sửa đổi, nhớ lại thông tin thuộc mức Ghi nhớ.',
    correctAnswer: true,
    explanation: 'Remember bao gồm các hoạt động nhận biết và nhớ lại thông tin.',
  },
  {
    id: 'Q28',
    domain: 'Rubric',
    statement: 'Rubric chỉ là danh sách tên của người học.',
    correctAnswer: false,
    explanation: 'Rubric là công cụ đánh giá mô tả các tiêu chí và mức chất lượng thực hiện.',
  },
  {
    id: 'Q29',
    domain: 'Rubric phân tích',
    statement: 'Rubric phân tích cho phép đánh giá riêng từng tiêu chí.',
    correctAnswer: true,
    explanation: 'Analytic Rubric phân chia đánh giá thành các tiêu chí hoặc thành phần riêng.',
  },
  {
    id: 'Q30',
    domain: 'Rubric tổng thể',
    statement: 'Rubric tổng thể bắt buộc phải cho điểm riêng từng tiêu chí.',
    correctAnswer: false,
    explanation: 'Holistic Rubric đánh giá theo mức chất lượng tổng thể, không bắt buộc chấm riêng từng tiêu chí.',
  },

  // --- NHÓM D — NGÂN HÀNG CÂU HỎI VÀ ĐẢM BẢO CHẤT LƯỢNG (Q31 — Q40) ---
  {
    id: 'Q31',
    domain: 'Ngân hàng câu hỏi',
    statement: 'Ngân hàng câu hỏi có thể lưu nội dung câu hỏi cùng metadata.',
    correctAnswer: true,
    explanation: 'Metadata phục vụ phân loại, quản lý và khai thác câu hỏi.',
  },
  {
    id: 'Q32',
    domain: 'Metadata',
    statement: 'Metadata câu hỏi bắt buộc chỉ gồm tên người ra đề.',
    correctAnswer: false,
    explanation: 'Metadata có thể bao gồm lĩnh vực, chủ đề, mức độ nhận thức, độ khó, trạng thái và nhiều thuộc tính khác.',
  },
  {
    id: 'Q33',
    domain: 'Equating',
    statement: 'Equating nhằm thiết lập sự tương đương của điểm số giữa các dạng đề phù hợp.',
    correctAnswer: true,
    explanation: 'Equating là quá trình thống kê nhằm hỗ trợ khả năng so sánh điểm giữa các dạng đề đáp ứng những điều kiện cần thiết.',
  },
  {
    id: 'Q34',
    domain: 'Standard Setting',
    statement: 'Standard Setting là quá trình chọn ngẫu nhiên điểm đạt.',
    correctAnswer: false,
    explanation: 'Thiết lập chuẩn sử dụng quy trình có căn cứ để xác định ngưỡng điểm theo yêu cầu về mức độ thực hiện.',
  },
  {
    id: 'Q35',
    domain: 'Đánh giá tham chiếu tiêu chí',
    statement: 'Đánh giá tham chiếu tiêu chí so sánh kết quả với chuẩn được xác định trước.',
    correctAnswer: true,
    explanation: 'Criterion-referenced assessment diễn giải kết quả dựa trên các chuẩn hoặc tiêu chí xác định.',
  },
  {
    id: 'Q36',
    domain: 'Đánh giá tham chiếu nhóm',
    statement: 'Đánh giá tham chiếu nhóm chỉ so sánh điểm với một ngưỡng đạt tuyệt đối.',
    correctAnswer: false,
    explanation: 'Norm-referenced assessment diễn giải kết quả thông qua vị trí tương đối so với nhóm tham chiếu.',
  },
  {
    id: 'Q37',
    domain: 'Chất lượng câu hỏi',
    statement: 'Câu hỏi trắc nghiệm càng dài thì luôn càng có chất lượng cao.',
    correctAnswer: false,
    explanation: 'Độ dài không quyết định chất lượng; câu hỏi cần rõ ràng, phù hợp mục tiêu và tránh thông tin không cần thiết.',
  },
  {
    id: 'Q38',
    domain: 'Phân tích CTT',
    statement: 'Với câu hỏi nhị phân, p = 0,80 tương ứng tỷ lệ trả lời đúng là 80%.',
    correctAnswer: true,
    explanation: 'Trong cách tính tỷ lệ đúng thông dụng của CTT, p = 0,80 nghĩa là 80% số lượt trả lời được phân tích là đúng.',
  },
  {
    id: 'Q39',
    domain: 'Độ giá trị',
    statement: 'Độ giá trị chỉ phụ thuộc vào hình thức đẹp của đề thi.',
    correctAnswer: false,
    explanation: 'Độ giá trị liên quan đến bằng chứng và lập luận hỗ trợ diễn giải, sử dụng điểm số, không chỉ hình thức đề thi.',
  },
  {
    id: 'Q40',
    domain: 'DIF và công bằng',
    statement: 'Cần xem xét thêm bằng chứng trước khi kết luận câu hỏi có DIF là thiên lệch.',
    correctAnswer: true,
    explanation: 'Việc phát hiện DIF cần được kết hợp với phân tích nội dung và các bằng chứng khác trước khi đánh giá tính công bằng.',
  },
];

// Map raw true/false questions to DinoQuestionV2 (Single Source of Truth)
// JUMP = TRUE (ĐÚNG), RUN = FALSE (SAI)
export const DINO_QUESTIONS_V2: DinoQuestionV2[] = RAW_QUESTIONS.map((q) => {
  const correctChoice: DinoChoice = q.correctAnswer ? 'JUMP' : 'RUN';
  return {
    id: q.id,
    domain: q.domain,
    statement: q.statement,
    stem: q.statement, // Compatibility alias
    correctAnswer: q.correctAnswer,
    correctChoice,
    explanation: q.explanation,
  };
});

export const DINO_QUESTIONS: DinoQuestionV2[] = DINO_QUESTIONS_V2;

export const TOTAL_QUESTIONS = DINO_QUESTIONS_V2.length; // 40
export const POINTS_PER_QUESTION = 2.5;
export const MAX_SCORE = 100; // 40 * 2.5 = 100
