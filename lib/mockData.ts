import type { Software, BlogPost } from './supabase'

export const INITIAL_SOFTWARE: Software[] = [
  {
    id: '1',
    name: 'QBank Studio Pro 2026',
    slug: 'qbank-studio-pro-2026',
    version: '3.2.0',
    description: 'Hệ thống xây dựng và quản lý ngân hàng câu hỏi, ma trận đề thi chuẩn hóa theo Bloom và chuẩn đầu ra học phần (CLO/PLO). Tự động sinh đề thi chống trùng lặp tuyệt đối.',
    features: [
      'Tự động sinh đề thi theo ma trận chuẩn xác 100% với thuật toán cân bằng độ khó',
      'Phân tích độ khó (p-value) và độ phân cách (D-index) chuẩn khảo thí quốc tế',
      'Xuất đề thi định dạng Word / PDF có mã trộn thông minh, chống xáo trộn công thức',
      'Phân quyền quản lý ngân hàng câu hỏi đa cấp theo Bộ môn, Khoa và Trung tâm Khảo thí'
    ],
    content: `
      <h3>Tổng quan phần mềm QBank Studio Pro</h3>
      <p><strong>QBank Studio Pro 2026</strong> là giải pháp chuyên dụng được thiết kế riêng cho các trường Đại học, Cao đẳng và Trung tâm Đánh giá năng lực. Phần mềm giải quyết triệt để bài toán xây dựng ngân hàng câu hỏi đạt chuẩn kiểm định MOET và AUN-QA.</p>
      
      <h4>Tính năng đột phá:</h4>
      <ul>
        <li><strong>Soạn thảo trực quan:</strong> Hỗ trợ nhập liệu từ Word giữ nguyên 100% định dạng, hình ảnh, bảng biểu và công thức toán học LaTeX/MathType.</li>
        <li><strong>Ma trận đề thi động:</strong> Thiết lập cấu trúc đề thi theo 4 mức độ nhận thức (Nhận biết, Thông hiểu, Vận dụng, Vận dụng cao) gắn trực tiếp với mục tiêu học phần.</li>
        <li><strong>Rút trích đề thi song song:</strong> Sinh 10 - 50 mã đề thi có độ tương đương cao về độ khó chỉ trong vài giây.</li>
        <li><strong>Bảo mật cấp độ phòng thi:</strong> Mã hóa dữ liệu đề thi với chuẩn AES-256, kiểm soát chặt chẽ lịch sử chỉnh sửa và trích xuất.</li>
      </ul>

      <h4>Yêu cầu hệ thống:</h4>
      <p>Hệ điều hành Windows 10/11 (64-bit), RAM tối thiểu 4GB, dung lượng ổ đĩa trống 1GB. Hỗ trợ tích hợp với hệ thống Quản lý đào tạo (SIS) qua REST API.</p>
    `,
    image_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop',
    file_url: 'https://github.com/khunglongbaochuavip-design',
    file_name: 'QBank_Studio_Pro_2026_Setup_v3.2.0.zip',
    file_size: 194200000,
    download_count: 1420,
    created_at: '2026-08-15T09:00:00Z',
    updated_at: '2026-09-01T14:30:00Z'
  },
  {
    id: '2',
    name: 'EduMetric Analytics Pro',
    slug: 'edumetric-analytics-pro',
    version: '2.5.1',
    description: 'Bộ công cụ phân tích đo lường kiểm định chất lượng bài thi, độ tin cậy Cronbach Alpha và hiệu chuẩn câu hỏi theo mô hình CTT và IRT Rasch hiện đại.',
    features: [
      'Đo lường độ tin cậy bài thi (Cronbach’s Alpha, KR-20) và sai số chuẩn phép đo (SEM)',
      'Phân tích chất lượng từng phương án nhiễu (Distractor Analysis) tự động',
      'Tự động vẽ phổ điểm chuẩn hóa, kiểm định phân phối chuẩn và phát hiện bất thường',
      'Xuất báo cáo đối sánh mức độ đáp ứng chuẩn đầu ra CLO/PLO trực quan phục vụ kiểm định'
    ],
    content: `
      <h3>Đo lường & Phân tích chất lượng khảo thí chuyên sâu</h3>
      <p><strong>EduMetric Analytics Pro</strong> là công cụ không thể thiếu của các chuyên gia khảo thí và nhà nghiên cứu đo lường giáo dục. Phần mềm tự động hóa toàn bộ quy trình tính toán thống kê sau mỗi kỳ thi.</p>

      <h4>Khả năng xử lý số liệu:</h4>
      <ul>
        <li>Nhập trực tiếp file kết quả thi từ mọi hệ thống thi trắc nghiệm trực tuyến hoặc file quét máy chấm thi.</li>
        <li>Báo cáo chi tiết từng câu hỏi: câu nào quá dễ, câu nào quá khó, câu nào phương án gây nhiễu không hoạt động hiệu quả.</li>
        <li>Hỗ trợ phân tích mô hình Rasch một tham số để chuẩn hóa thang đo năng lực thí sinh.</li>
        <li>Tự động lập biểu đồ cột, biểu đồ phân phối chuẩn (Gaussian curve) chất lượng cao sẵn sàng đưa vào báo cáo kiểm định.</li>
      </ul>
    `,
    image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
    file_url: 'https://github.com/khunglongbaochuavip-design',
    file_name: 'EduMetric_Analytics_v2.5.1_Full.zip',
    file_size: 335500000,
    download_count: 980,
    created_at: '2026-07-20T10:00:00Z',
    updated_at: '2026-08-28T16:00:00Z'
  },
  {
    id: '3',
    name: 'AutoGrader & Exam Scanner',
    slug: 'autograder-exam-scanner',
    version: '4.0.2',
    description: 'Phần mềm chấm thi trắc nghiệm tốc độ cao qua máy scan tài liệu thông thường hoặc máy quét chuyên dụng. Xử lý chính xác 99.9% phiếu thi chuẩn quốc gia.',
    features: [
      'Nhận diện các mẫu phiếu thi 40, 60, 100, 120 câu chuẩn Bộ Giáo Dục & Đào Tạo',
      'Thuật toán AI tự động bù góc xoay, chống nhăn giấy và nhận diện dấu tô bút chì mờ',
      'Tốc độ quét và chấm lên tới 100 - 150 bài thi/phút với độ chính xác tuyệt đối',
      'Đồng bộ bảng điểm trực tiếp vào cơ sở dữ liệu đào tạo, xuất biên bản chấm thi tự động'
    ],
    content: `
      <h3>Giải pháp chấm thi trắc nghiệm thông minh, tiết kiệm</h3>
      <p>Không cần đầu tư các máy chấm thi đắt đỏ hàng trăm triệu đồng, <strong>AutoGrader & Exam Scanner</strong> biến mọi máy scan văn phòng hoặc máy scan khay cuốn (ADF) thông thường thành hệ thống chấm thi tự động chuyên nghiệp.</p>

      <h4>Ưu điểm vượt trội:</h4>
      <ul>
        <li>Tương thích 100% với các dòng máy scan phổ biến (Canon, HP, Epson, Brother, Fujitsu).</li>
        <li>Giao diện xem lại các bài thi nghi vấn (tô 2 đáp án, tẩy xóa không sạch) với ảnh zoom lớn trực tiếp, giúp giám khảo đối chiếu tức thì.</li>
        <li>Hỗ trợ quản lý nhiều ca thi, nhiều môn thi đồng thời, kiểm tra trùng lặp mã đề và số báo danh.</li>
      </ul>
    `,
    image_url: 'https://images.unsplash.com/photo-1588702547923-7093a6c3ba33?q=80&w=1200&auto=format&fit=crop',
    file_url: 'https://github.com/khunglongbaochuavip-design',
    file_name: 'AutoGrader_Scanner_v4.0.2_Ultimate.rar',
    file_size: 488000000,
    download_count: 2350,
    created_at: '2026-06-10T08:30:00Z',
    updated_at: '2026-08-10T11:20:00Z'
  },
  {
    id: '4',
    name: 'CTDT Outcome Assessor',
    slug: 'ctdt-outcome-assessor',
    version: '1.8.0',
    description: 'Nền tảng đánh giá mức độ đạt chuẩn đầu ra Chương trình đào tạo (CTĐT) và quản lý kỳ thi kiểm tra đầu vào, đầu ra sinh viên theo chu trình cải tiến liên tục (CQI).',
    features: [
      'Bản đồ ánh xạ ma trận chuẩn đầu ra (Curriculum Mapping Matrix CLO - PLO - PE)',
      'Tổ chức đánh giá năng lực đầu vào và phân loại đối tượng sinh viên nhập học',
      'Báo cáo đo lường định kỳ theo học kỳ và toàn khóa học phục vụ kiểm định chất lượng',
      'Theo dõi chỉ số cải tiến chất lượng đào tạo liên tục (Continuous Quality Improvement)'
    ],
    content: `
      <h3>Quản lý & Đánh giá Chuẩn đầu ra CTĐT toàn diện</h3>
      <p>Đáp ứng các tiêu chuẩn khắt khe của kiểm định chất lượng giáo dục trong nước và quốc tế, <strong>CTDT Outcome Assessor</strong> cung cấp bức tranh số liệu minh bạch về mức độ người học đáp ứng các năng lực đầu ra được cam kết.</p>

      <h4>Chức năng chính:</h4>
      <ul>
        <li>Tích hợp các phương pháp đánh giá trực tiếp (Direct Assessment qua điểm kiểm tra, đồ án) và gián tiếp (Indirect Assessment qua khảo sát doanh nghiệp, cựu sinh viên).</li>
        <li>Phát hiện các học phần hoặc tiêu chí chưa đạt ngưỡng chuẩn để khoa/bộ môn kịp thời điều chỉnh đề cương và phương pháp giảng dạy.</li>
        <li>Xuất trọn bộ minh chứng chuẩn bị báo cáo tự đánh giá SAR (Self-Assessment Report) chỉ bằng 1 cú nhấp chuột.</li>
      </ul>
    `,
    image_url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1200&auto=format&fit=crop',
    file_url: 'https://github.com/khunglongbaochuavip-design',
    file_name: 'CTDT_Outcome_Assessor_v1.8.0.zip',
    file_size: 215000000,
    download_count: 890,
    created_at: '2026-05-18T14:00:00Z',
    updated_at: '2026-07-22T09:15:00Z'
  }
]

export const INITIAL_BLOGS: BlogPost[] = [
  {
    id: '1',
    title: 'Phương pháp xây dựng ma trận đề thi chuẩn hóa đánh giá chuẩn đầu ra học phần (CLO)',
    slug: 'phuong-phap-xay-dung-ma-tran-de-thi-chuan-hoa-clo',
    cover_image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&auto=format&fit=crop',
    published: true,
    created_at: '2026-09-08T08:00:00Z',
    updated_at: '2026-09-08T08:00:00Z',
    content: `
      <h2>1. Tầm quan trọng của ma trận đề thi chuẩn hóa</h2>
      <p>Trong khảo thí hiện đại, một đề thi tốt không phải là đề thi đánh đố được nhiều thí sinh nhất, mà là đề thi đo lường chính xác nhất mức độ đạt được các mục tiêu học tập (Course Learning Outcomes - CLO) đã được công bố trong đề cương chi tiết học phần.</p>
      
      <h2>2. Khung ma trận 4 mức độ nhận thức theo Bloom</h2>
      <p>Việc xây dựng ma trận đề thi cần phân định rành mạch giữa các cấp độ tư duy:</p>
      <ul>
        <li><strong>Nhận biết (Remembering):</strong> Tái hiện các định nghĩa, quy tắc, công thức cơ bản.</li>
        <li><strong>Thông hiểu (Understanding):</strong> Giải thích, suy luận, so sánh và phân biệt các khái niệm.</li>
        <li><strong>Vận dụng (Applying):</strong> Áp dụng kiến thức, quy trình vào giải quyết các tình huống cụ thể.</li>
        <li><strong>Vận dụng cao (Analyzing & Evaluating):</strong> Phân tích tình huống phức tạp, tổng hợp giải pháp và đánh giá đa chiều.</li>
      </ul>

      <h2>3. Quy trình 5 bước thiết kế ma trận kiểm tra</h2>
      <ol>
        <li>Xác định thời lượng bài thi và hình thức kiểm tra (tự luận, trắc nghiệm hoặc kết hợp).</li>
        <li>Liệt kê các chuẩn đầu ra (CLO) cần đo lường trong bài thi.</li>
        <li>Phân bổ trọng số phần trăm cho từng nội dung kiến thức và từng mức độ nhận thức.</li>
        <li>Xác định số lượng câu hỏi và điểm số tương ứng cho mỗi ô ma trận.</li>
        <li>Thẩm định ma trận đề thi qua hội đồng chuyên môn khoa/bộ môn trước khi đưa vào ngân hàng đề.</li>
      </ol>

      <blockquote>
        "Đo lường trong giáo dục không nhằm xếp loại con người, mà nhằm cung cấp thông tin phản hồi có giá trị để cải tiến liên tục chất lượng dạy và học." — Hữu Tài Genz
      </blockquote>
    `
  },
  {
    id: '2',
    title: 'Ứng dụng mô hình đo lường CTT và IRT Rasch trong đánh giá chất lượng câu hỏi thi',
    slug: 'ung-dung-mo-hinh-ctt-va-irt-rasch-trong-khao-thi',
    cover_image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=1200&auto=format&fit=crop',
    published: true,
    created_at: '2026-09-03T10:30:00Z',
    updated_at: '2026-09-03T10:30:00Z',
    content: `
      <h2>1. Giới hạn của lý thuyết đo lường cổ điển (Classical Test Theory - CTT)</h2>
      <p>CTT từ lâu là nền tảng phổ biến trong phân tích kết quả thi với hai chỉ số cơ bản: Độ khó (p-value: tỷ lệ thí sinh làm đúng) và Độ phân biệt (D-index: sự chênh lệch giữa nhóm điểm cao và nhóm điểm thấp). Tuy nhiên, nhược điểm lớn nhất của CTT là độ khó của câu hỏi phụ thuộc hoàn toàn vào năng lực của nhóm thí sinh làm bài thi đó.</p>

      <h2>2. Bước tiến đột phá với mô hình Rasch (Item Response Theory)</h2>
      <p>Mô hình Rasch (mô hình IRT 1 tham số) đặt năng lực của thí sinh (Ability - $\\theta$) và độ khó của câu hỏi (Difficulty - $b$) lên cùng một thang đo liên tục (Logit scale). Điều này mang lại các lợi ích vượt bậc:</p>
      <ul>
        <li><strong>Độc lập mẫu:</strong> Đo lường độ khó của câu hỏi không bị sai lệch bởi việc thí sinh giỏi hay yếu tham gia kỳ thi.</li>
        <li><strong>Ngân hàng câu hỏi chuẩn hóa:</strong> Có thể so sánh điểm số giữa các kỳ thi khác nhau, các năm học khác nhau một cách khoa học.</li>
        <li><strong>Phát hiện dị biệt:</strong> Tìm ra các câu hỏi có độ tin cậy kém hoặc có dấu hiệu rò rỉ đề qua chỉ số Fit statistics (Infit và Outfit MNSQ).</li>
      </ul>

      <h2>3. Khuyến nghị áp dụng cho các trường Đại học tại Việt Nam</h2>
      <p>Để nâng cao chất lượng khảo thí, các cơ sở giáo dục cần từng bước áp dụng phân tích thống kê định lượng sau mỗi đợt thi học kỳ để thanh lọc và hiệu chuẩn ngân hàng câu hỏi định kỳ 6 tháng một lần.</p>
    `
  },
  {
    id: '3',
    title: 'Kinh nghiệm tổ chức kỳ thi chuyên biệt: Kiểm tra đầu vào và chuẩn đầu ra sinh viên',
    slug: 'kinh-nghiem-to-chuc-ky-thi-chuyen-biet-dau-vao-dau-ra',
    cover_image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop',
    published: true,
    created_at: '2026-08-28T14:15:00Z',
    updated_at: '2026-08-28T14:15:00Z',
    content: `
      <h2>1. Đặc thù của các kỳ thi chuyên biệt</h2>
      <p>Khác với kỳ thi kết thúc học phần thông thường, các kỳ thi kiểm tra đầu vào (phân loại trình độ) và kiểm tra chuẩn đầu ra (ngoại ngữ, tin học, năng lực nghề nghiệp) đòi hỏi tính bảo mật, quy mô tổ chức và độ tin cậy cao hơn rất nhiều.</p>

      <h2>2. Ba yếu tố cốt lõi quyết định sự thành công</h2>
      <ul>
        <li><strong>Ngân hàng đề thi đủ lớn và tương đương:</strong> Mỗi kỳ thi cần hàng chục phiên bản đề khác nhau nhưng phải được cân bằng chặt chẽ về thang đo độ khó.</li>
        <li><strong>Quy trình số hóa và chống gian lận:</strong> Tích hợp camera giám sát, nhận diện khuôn mặt hoặc phần mềm khóa màn hình phòng thi (Lockdown Browser) khi thi trên máy tính.</li>
        <li><strong>Quy chế chấm thi và công bố điểm minh bạch:</strong> Quy định rõ ràng về thời hạn công bố kết quả, biên bản chấm phúc khảo và quy trình cấp chứng chỉ.</li>
      </ul>

      <h2>4. Lời kết</h2>
      <p>Việc chuẩn hóa công tác khảo thí là xương sống đảm bảo uy tín và chất lượng đầu ra của mọi cơ sở đào tạo trong kỷ nguyên số hóa giáo dục.</p>
    `
  }
]