/**
 * Rich, prominent background illustrations dedicated to:
 * Khảo thí • Đo lường • Đánh giá • Kì thi chuyên biệt • Kiểm định chất lượng
 * Beautiful SVG artwork styled with subtle slate, warm amber, and gold accents.
 */
export default function EduBackground() {
  return (
    <div
      className="fixed inset-0 -z-20 overflow-hidden pointer-events-none select-none"
      aria-hidden="true"
    >
      {/* ── Soft Ambient Glows (Warm ivory, amber and slate atmosphere) ── */}
      <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-amber-200/25 rounded-full blur-3xl" />
      <div className="absolute top-1/3 -right-40 w-[650px] h-[650px] bg-sky-200/25 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 left-1/4 w-[700px] h-[600px] bg-orange-100/30 rounded-full blur-3xl" />

      {/* ── 1. ĐƯỜNG CONG PHÂN PHỐI CHUẨN GAUSS (Khảo thí & Thống kê đo lường CTT / IRT) ── */}
      {/* Top Center-Left */}
      <svg
        className="absolute top-8 left-[2%] opacity-[0.22] text-slate-700"
        width="460"
        height="220"
        viewBox="0 0 460 220"
      >
        <g stroke="currentColor" fill="none">
          {/* Base coordinate axis */}
          <line x1="20" y1="180" x2="440" y2="180" strokeWidth="2.5" stroke="currentColor" />
          <line x1="230" y1="20" x2="230" y2="195" strokeWidth="2" strokeDasharray="5,4" stroke="#d97706" />

          {/* Normal bell curve */}
          <path
            d="M 30 180 C 110 180, 160 170, 190 100 C 210 55, 220 30, 230 30 C 240 30, 250 55, 270 100 C 300 170, 350 180, 430 180"
            strokeWidth="3.5"
            stroke="#b45309"
            fill="url(#gaussGradient)"
          />

          {/* Standard deviation grid lines (-3σ, -2σ, -1σ, μ, +1σ, +2σ, +3σ) */}
          <line x1="120" y1="175" x2="120" y2="185" strokeWidth="2" stroke="currentColor" />
          <line x1="175" y1="175" x2="175" y2="185" strokeWidth="2" stroke="currentColor" />
          <line x1="285" y1="175" x2="285" y2="185" strokeWidth="2" stroke="currentColor" />
          <line x1="340" y1="175" x2="340" y2="185" strokeWidth="2" stroke="currentColor" />

          {/* Text labels */}
          <text x="224" y="210" fill="#b45309" fontSize="13" fontWeight="bold" fontFamily="sans-serif">μ</text>
          <text x="163" y="208" fill="currentColor" fontSize="11" fontFamily="sans-serif">-1σ</text>
          <text x="110" y="208" fill="currentColor" fontSize="11" fontFamily="sans-serif">-2σ</text>
          <text x="277" y="208" fill="currentColor" fontSize="11" fontFamily="sans-serif">+1σ</text>
          <text x="330" y="208" fill="currentColor" fontSize="11" fontFamily="sans-serif">+2σ</text>
          <text x="30" y="25" fill="#78716c" fontSize="11" fontStyle="italic" fontFamily="serif">f(x) = Gaussian Curve</text>
        </g>
        <defs>
          <linearGradient id="gaussGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
          </linearGradient>
        </defs>
      </svg>

      {/* ── 2. CÁN CÂN ĐO LƯỜNG & ĐÁNH GIÁ CÔNG BẰNG (Assessment Balance Scale) ── */}
      {/* Top-Right */}
      <svg
        className="absolute top-12 -right-6 opacity-[0.24] text-neutral-800"
        width="340"
        height="360"
        viewBox="0 0 340 360"
      >
        <g stroke="currentColor" strokeWidth="2.5" fill="none">
          {/* Main pillar */}
          <line x1="170" y1="60" x2="170" y2="310" strokeWidth="7" strokeLinecap="round" />
          {/* Base */}
          <rect x="90" y="310" width="160" height="20" rx="8" fill="currentColor" fillOpacity="0.1" />
          <line x1="70" y1="330" x2="270" y2="330" strokeWidth="4" strokeLinecap="round" />

          {/* Top pivot & decorative finial */}
          <circle cx="170" y="45" r="10" fill="#d97706" fillOpacity="0.8" stroke="#b45309" strokeWidth="2" />
          <polygon points="170,15 177,35 163,35" fill="#d97706" />

          {/* Calibrated beam */}
          <line x1="40" y1="60" x2="300" y2="60" strokeWidth="6" strokeLinecap="round" />
          {/* Beam tick marks */}
          {[60, 85, 110, 135, 205, 230, 255, 280].map((x) => (
            <line key={x} x1={x} y1="56" x2={x} y2="64" strokeWidth="2" stroke="#b45309" />
          ))}

          {/* Left pan assembly */}
          <line x1="50" y1="60" x2="20" y2="190" strokeWidth="1.8" />
          <line x1="50" y1="60" x2="80" y2="190" strokeWidth="1.8" />
          <path d="M 10 190 Q 50 215 90 190 Z" fill="#d97706" fillOpacity="0.2" strokeWidth="2.5" />
          {/* Weight on left pan */}
          <rect x="38" y="170" width="24" height="20" rx="3" fill="#78716c" fillOpacity="0.4" strokeWidth="1.5" />

          {/* Right pan assembly */}
          <line x1="290" y1="60" x2="260" y2="190" strokeWidth="1.8" />
          <line x1="290" y1="60" x2="320" y2="190" strokeWidth="1.8" />
          <path d="M 250 190 Q 290 215 330 190 Z" fill="#d97706" fillOpacity="0.2" strokeWidth="2.5" />
          {/* Assessment document / sheet on right pan */}
          <rect x="278" y="165" width="24" height="25" rx="2" fill="white" strokeWidth="1.5" />
          <line x1="282" y1="172" x2="298" y2="172" strokeWidth="1" />
          <line x1="282" y1="177" x2="298" y2="177" strokeWidth="1" />
          <line x1="282" y1="182" x2="294" y2="182" strokeWidth="1" />
        </g>
      </svg>

      {/* ── 3. PHIẾU THI TRẮC NGHIỆM CHUẨN HOÁ OMR (Exam Answer Bubble Sheet) ── */}
      {/* Middle-Right */}
      <svg
        className="absolute top-[38%] -right-8 opacity-[0.25] text-slate-700"
        width="340"
        height="440"
        viewBox="0 0 340 440"
      >
        <g stroke="currentColor" fill="none">
          {/* Sheet paper outline */}
          <rect
            x="20"
            y="20"
            width="290"
            height="390"
            rx="14"
            fill="white"
            fillOpacity="0.4"
            strokeWidth="3"
            stroke="#64748b"
          />

          {/* Barcode at top */}
          <line x1="50" y1="45" x2="50" y2="75" strokeWidth="3" stroke="#0f172a" />
          <line x1="56" y1="45" x2="56" y2="75" strokeWidth="1.5" stroke="#0f172a" />
          <line x1="62" y1="45" x2="62" y2="75" strokeWidth="4" stroke="#0f172a" />
          <line x1="70" y1="45" x2="70" y2="75" strokeWidth="2" stroke="#0f172a" />
          <line x1="76" y1="45" x2="76" y2="75" strokeWidth="5" stroke="#0f172a" />
          <line x1="86" y1="45" x2="86" y2="75" strokeWidth="2" stroke="#0f172a" />

          {/* Title header */}
          <rect x="110" y="45" width="180" height="14" rx="3" fill="#cbd5e1" />
          <rect x="110" y="65" width="130" height="10" rx="3" fill="#e2e8f0" />

          <line x1="35" y1="95" x2="295" y2="95" strokeWidth="1.5" stroke="#94a3b8" />

          {/* Bubble questions rows */}
          {[115, 150, 185, 220, 255, 290, 325, 360].map((y, rowIdx) => {
            const shadedIndex = (rowIdx * 2 + 1) % 4
            return (
              <g key={y}>
                {/* Question number */}
                <text x="45" y={y + 11} fontSize="12" fontWeight="bold" fill="#334155" fontFamily="sans-serif">
                  {rowIdx + 1 < 10 ? `0${rowIdx + 1}` : rowIdx + 1}
                </text>

                {/* Bubbles A, B, C, D */}
                {['A', 'B', 'C', 'D'].map((opt, i) => {
                  const cx = 95 + i * 40
                  const isShaded = i === shadedIndex
                  return (
                    <g key={opt}>
                      <circle
                        cx={cx}
                        cy={y + 7}
                        r="11"
                        strokeWidth="1.8"
                        stroke={isShaded ? '#0f172a' : '#64748b'}
                        fill={isShaded ? '#1e293b' : 'white'}
                      />
                      <text
                        x={cx - 4}
                        y={y + 11}
                        fontSize="9"
                        fontWeight="bold"
                        fill={isShaded ? 'white' : '#64748b'}
                        fontFamily="sans-serif"
                      >
                        {opt}
                      </text>
                    </g>
                  )
                })}

                {/* Green grading checkmark on correct answers */}
                {rowIdx % 2 === 0 && (
                  <path
                    d={`M 260 ${y + 8} L 268 ${y + 15} L 285 ${y}`}
                    stroke="#16a34a"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}
              </g>
            )
          })}
        </g>
      </svg>

      {/* ── 4. THƯỚC KỸ THUẬT & EKE 45 ĐỘ (Precision Technical Ruler & Square) ── */}
      {/* Middle-Left */}
      <svg
        className="absolute top-[42%] -left-8 opacity-[0.24] rotate-6 text-neutral-800"
        width="460"
        height="180"
        viewBox="0 0 460 180"
      >
        <g stroke="currentColor" fill="none">
          {/* Main ruler */}
          <rect
            x="20"
            y="40"
            width="420"
            height="65"
            rx="6"
            fill="#fef3c7"
            fillOpacity="0.45"
            strokeWidth="3"
            stroke="#78716c"
          />

          {/* Centimeter marks */}
          {Array.from({ length: 21 }).map((_, i) => (
            <g key={i}>
              <line x1={40 + i * 19} y1="40" x2={40 + i * 19} y2="66" strokeWidth="2.2" stroke="#44403c" />
              {i % 2 === 0 && (
                <text
                  x={36 + i * 19}
                  y="82"
                  fontSize="11"
                  fontWeight="bold"
                  fill="#78350f"
                  fontFamily="sans-serif"
                >
                  {i}
                </text>
              )}
            </g>
          ))}

          {/* Millimeter ticks */}
          {Array.from({ length: 80 }).map((_, i) => (
            <line
              key={i}
              x1={40 + i * 4.75}
              y1="40"
              x2={40 + i * 4.75}
              y2={i % 5 === 0 ? '56' : '49'}
              strokeWidth="1.2"
              stroke="#78716c"
            />
          ))}

          {/* Technical drafting square overlay */}
          <polygon
            points="70,120 220,120 70,20"
            fill="#dbeafe"
            fillOpacity="0.35"
            stroke="#2563eb"
            strokeWidth="2.5"
          />
          <circle cx="105" cy="95" r="14" fill="white" stroke="#2563eb" strokeWidth="1.8" />
        </g>
      </svg>

      {/* ── 5. COMPA KỸ THUẬT ĐO LƯỜNG & KHẢO THÍ (Drafting Compass) ── */}
      {/* Top Left-Center */}
      <svg
        className="absolute top-[18%] left-[18%] opacity-[0.20] text-amber-800 rotate-12"
        width="220"
        height="260"
        viewBox="0 0 220 260"
      >
        <g stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none">
          {/* Compass knob */}
          <rect x="105" y="10" width="10" height="25" rx="3" fill="#b45309" />
          <circle cx="110" cy="38" r="12" fill="#d97706" fillOpacity="0.7" />

          {/* Left leg (needle point) */}
          <line x1="104" y1="45" x2="45" y2="220" strokeWidth="4" stroke="#78350f" />
          <line x1="45" y1="220" x2="35" y2="245" strokeWidth="2.5" stroke="#1c1917" />

          {/* Right leg (pencil lead holder) */}
          <line x1="116" y1="45" x2="175" y2="220" strokeWidth="4" stroke="#78350f" />
          <rect x="170" y="210" width="12" height="28" rx="2" fill="#d97706" />
          <polygon points="170,238 182,238 176,252" fill="#1c1917" />

          {/* Calibrated angle arc */}
          <path d="M 68 150 Q 110 170 152 150" strokeWidth="2" strokeDasharray="3,3" stroke="#b45309" />
          {/* Drawn circle arc */}
          <path d="M 35 245 A 140 140 0 0 1 176 252" strokeWidth="2" strokeDasharray="4,4" stroke="#d97706" />
        </g>
      </svg>

      {/* ── 6. MA TRẬN BLOOM 4 MỨC ĐỘ NHẬN THỨC (Cognitive Taxonomy Pyramid) ── */}
      {/* Bottom-Center / Left */}
      <svg
        className="absolute bottom-16 left-[6%] opacity-[0.22] text-slate-800"
        width="380"
        height="260"
        viewBox="0 0 380 260"
      >
        <g stroke="currentColor" fill="none">
          {/* Level 4: Vận dụng cao (Top) */}
          <polygon
            points="190,20 235,70 145,70"
            fill="#f59e0b"
            fillOpacity="0.35"
            stroke="#b45309"
            strokeWidth="2.5"
          />
          <text x="160" y="52" fontSize="10" fontWeight="bold" fill="#78350f" fontFamily="sans-serif">
            VẬN DỤNG CAO
          </text>

          {/* Level 3: Vận dụng */}
          <polygon
            points="143,74 237,74 275,124 105,124"
            fill="#fbbf24"
            fillOpacity="0.3"
            stroke="#b45309"
            strokeWidth="2.5"
          />
          <text x="162" y="105" fontSize="11" fontWeight="bold" fill="#78350f" fontFamily="sans-serif">
            VẬN DỤNG
          </text>

          {/* Level 2: Thông hiểu */}
          <polygon
            points="103,128 277,128 315,178 65,178"
            fill="#93c5fd"
            fillOpacity="0.3"
            stroke="#2563eb"
            strokeWidth="2.5"
          />
          <text x="156" y="159" fontSize="12" fontWeight="bold" fill="#1e3a8a" fontFamily="sans-serif">
            THÔNG HIỂU
          </text>

          {/* Level 1: Nhận biết (Base) */}
          <polygon
            points="63,182 317,182 355,235 25,235"
            fill="#e2e8f0"
            fillOpacity="0.5"
            stroke="#64748b"
            strokeWidth="2.5"
          />
          <text x="157" y="215" fontSize="13" fontWeight="bold" fill="#0f172a" fontFamily="sans-serif">
            NHẬN BIẾT
          </text>

          <text x="90" y="255" fontSize="11" fontWeight="bold" fill="#b45309" fontStyle="italic" fontFamily="serif">
            ★ Khung Ma Trận Chuẩn Đầu Ra (CLO/PLO)
          </text>
        </g>
      </svg>

      {/* ── 7. SÁCH CHUYÊN KHẢO & BÚT CHÌ 2B (Open Exam Textbook & 2B Pencil) ── */}
      {/* Bottom-Right */}
      <svg
        className="absolute bottom-8 right-[5%] opacity-[0.25] text-slate-800"
        width="420"
        height="260"
        viewBox="0 0 420 260"
      >
        <g stroke="currentColor" fill="none">
          {/* Book left page */}
          <path
            d="M 40 40 Q 110 30 190 45 L 190 215 Q 110 200 40 215 Z"
            fill="#fff"
            fillOpacity="0.65"
            strokeWidth="3"
            stroke="#57534e"
          />
          {/* Book right page */}
          <path
            d="M 230 45 Q 310 30 380 40 L 380 215 Q 310 200 230 215 Z"
            fill="#fff"
            fillOpacity="0.65"
            strokeWidth="3"
            stroke="#57534e"
          />
          {/* Book center spine */}
          <path d="M 190 45 Q 210 50 230 45 L 230 215 Q 210 220 190 215 Z" fill="#d6d3d1" strokeWidth="2" />

          {/* Left page text & formulas */}
          <line x1="65" y1="75" x2="165" y2="75" strokeWidth="3" stroke="#b45309" strokeLinecap="round" />
          <line x1="65" y1="95" x2="165" y2="95" strokeWidth="2" stroke="#78716c" />
          <line x1="65" y1="115" x2="150" y2="115" strokeWidth="2" stroke="#78716c" />
          <line x1="65" y1="135" x2="160" y2="135" strokeWidth="2" stroke="#78716c" />
          <line x1="65" y1="155" x2="140" y2="155" strokeWidth="2" stroke="#78716c" />
          <line x1="65" y1="175" x2="155" y2="175" strokeWidth="2" stroke="#78716c" />

          {/* Right page item statistics formula: α = [K/(K-1)] * [1 - Σs²/S²] */}
          <rect x="250" y="70" width="105" height="24" rx="4" fill="#fef3c7" stroke="#d97706" strokeWidth="1.5" />
          <text x="258" y="86" fontSize="11" fontWeight="bold" fill="#92400e" fontFamily="serif">Cronbach&apos;s α</text>
          <line x1="250" y1="115" x2="355" y2="115" strokeWidth="2" stroke="#78716c" />
          <line x1="250" y1="135" x2="340" y2="135" strokeWidth="2" stroke="#78716c" />
          <line x1="250" y1="155" x2="350" y2="155" strokeWidth="2" stroke="#78716c" />
          <line x1="250" y1="175" x2="330" y2="175" strokeWidth="2" stroke="#78716c" />

          {/* 2B Exam Pencil resting diagonally */}
          <g transform="rotate(-32 280 180)">
            <rect x="240" y="170" width="180" height="18" rx="2" fill="#f59e0b" stroke="#b45309" strokeWidth="2" />
            <line x1="240" y1="176" x2="420" y2="176" strokeWidth="1.5" stroke="#d97706" />
            <line x1="240" y1="182" x2="420" y2="182" strokeWidth="1.5" stroke="#d97706" />
            {/* Eraser */}
            <rect x="220" y="170" width="20" height="18" rx="3" fill="#f43f5e" stroke="#be123c" strokeWidth="2" />
            <rect x="236" y="170" width="8" height="18" fill="#cbd5e1" stroke="#64748b" strokeWidth="1" />
            {/* Pencil Tip */}
            <polygon points="420,170 445,179 420,188" fill="#fed7aa" stroke="#b45309" strokeWidth="1.5" />
            <polygon points="436,175 445,179 436,183" fill="#0f172a" />
            <text x="265" y="183" fontSize="9" fontWeight="bold" fill="#78350f" fontFamily="sans-serif">2B EXAM</text>
          </g>
        </g>
      </svg>

      {/* ── 8. MŨ CỬ NHÂN & CUỘN VĂN BẰNG (Graduation Cap & Diploma Scroll) ── */}
      {/* Center Background Ambient */}
      <svg
        className="absolute top-[68%] left-[46%] -translate-x-1/2 opacity-[0.18] text-neutral-800"
        width="300"
        height="220"
        viewBox="0 0 300 220"
      >
        <g stroke="currentColor" fill="none">
          {/* Mortarboard cap diamond */}
          <polygon
            points="150,20 280,75 150,130 20,75"
            fill="#1e293b"
            fillOpacity="0.4"
            stroke="#0f172a"
            strokeWidth="3.5"
          />
          <polygon points="150,30 260,75 150,120 40,75" stroke="#d97706" strokeWidth="1.5" />

          {/* Skull cap */}
          <path d="M 90 98 Q 150 160 210 98" fill="#1e293b" fillOpacity="0.3" strokeWidth="3" />

          {/* Button & Tassel */}
          <circle cx="150" cy="75" r="7" fill="#d97706" />
          <path
            d="M 150 75 C 210 80, 240 120, 240 160"
            stroke="#b45309"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <polygon points="233,160 247,160 240,185" fill="#d97706" />

          {/* Diploma scroll below */}
          <rect x="70" y="165" width="160" height="24" rx="12" fill="#fffbeb" stroke="#b45309" strokeWidth="2.5" />
          <rect x="138" y="163" width="24" height="28" rx="3" fill="#dc2626" />
        </g>
      </svg>

      {/* ── 9. DẤU BẢO CHỨNG KIỂM ĐỊNH CHẤT LƯỢNG (Quality Assurance Seal) ── */}
      {/* Top Center-Right */}
      <svg
        className="absolute top-[2%] right-[28%] opacity-[0.20] text-amber-700 rotate-6"
        width="160"
        height="160"
        viewBox="0 0 160 160"
      >
        <g stroke="currentColor" fill="none">
          <circle cx="80" cy="80" r="70" strokeWidth="3" stroke="#b45309" strokeDasharray="6,3" />
          <circle cx="80" cy="80" r="60" strokeWidth="2" stroke="#b45309" />
          <polygon
            points="80,30 89,52 112,52 93,66 100,88 80,75 60,88 67,66 48,52 71,52"
            fill="#f59e0b"
            fillOpacity="0.6"
            stroke="#b45309"
            strokeWidth="1.5"
          />
          <text x="36" y="112" fontSize="10" fontWeight="bold" fill="#78350f" fontFamily="sans-serif">
            KIỂM ĐỊNH CHUẨN
          </text>
          <text x="50" y="127" fontSize="8" fontWeight="bold" fill="#b45309" fontFamily="sans-serif">
            AUN-QA &bull; MOET
          </text>
        </g>
      </svg>
    </div>
  )
}
