import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-neutral-50/50 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Bio */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-black text-white flex items-center justify-center font-serif font-bold text-sm">
                HT
              </div>
              <span className="font-serif font-bold text-xl tracking-tight text-neutral-900">
                Hữu Tài Genz
              </span>
            </div>
            <p className="text-sm text-neutral-600 leading-relaxed max-w-lg">
              Chuyên gia về Khảo thí • Đo lường • Đánh giá • Kì thi chuyên biệt • Kiểm tra đầu vào, đầu ra học phần và Chương trình đào tạo (CTĐT). Giải pháp số hóa khảo thí chuẩn hóa cho cơ sở giáo dục đại học và nghề nghiệp.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="tel:0902155906"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-neutral-200 text-xs font-semibold text-neutral-800 hover:border-black transition-colors shadow-2xl"
              >
                <span>📞 Hotline: 0902 155 906</span>
              </a>
              <a
                href="https://zalo.me/0902155906"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors shadow-sm"
              >
                <span>💬 Zalo Tư Vấn</span>
              </a>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-xs uppercase tracking-widest font-bold text-neutral-400 mb-4">Điều Hướng</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/" className="text-neutral-600 hover:text-black transition-colors">Trang Chủ</Link></li>
              <li><Link href="/phan-mem" className="text-neutral-600 hover:text-black transition-colors">Bộ Phần Mềm Khảo Thí</Link></li>
              <li><Link href="/blog" className="text-neutral-600 hover:text-black transition-colors">Blog & Khảo Thí Học</Link></li>
            </ul>
          </div>

          {/* Col 3: Areas of Expertise */}
          <div>
            <h4 className="text-xs uppercase tracking-widest font-bold text-neutral-400 mb-4">Lĩnh Vực Chuyên Môn</h4>
            <ul className="space-y-2 text-xs text-neutral-600 leading-relaxed">
              <li>✦ Khảo thí & Đo lường giáo dục</li>
              <li>✦ Xây dựng ma trận & Ngân hàng đề thi</li>
              <li>✦ Kỳ thi chuyên biệt (Đầu vào / Đầu ra)</li>
              <li>✦ Đánh giá mức độ đạt Chuẩn đầu ra CTĐT</li>
              <li>✦ Kiểm định chất lượng MOET / AUN-QA</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-neutral-500">
            &copy; {new Date().getFullYear()} Hữu Tài Genz (0902.155.906). All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/admin/login"
              className="text-[11px] text-neutral-400 hover:text-neutral-700 transition-colors px-3 py-1 rounded-md hover:bg-neutral-100"
            >
              Cổng Quản Trị (Admin)
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}