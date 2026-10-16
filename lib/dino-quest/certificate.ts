// Certificate generator for Dino Quest: Bí Ẩn Tứ Đại Cánh Cửa

export function generateQuestCertificate(playerName: string, dateStr: string = new Date().toLocaleDateString('vi-VN')): string {
  if (typeof document === 'undefined') return '';

  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 800;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // 1. Parchment / Royal Academic Background
  const bgGrad = ctx.createLinearGradient(0, 0, 1200, 800);
  bgGrad.addColorStop(0, '#0f172a');
  bgGrad.addColorStop(0.5, '#1e1b4b');
  bgGrad.addColorStop(1, '#0f172a');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1200, 800);

  // 2. Ornate Border with Gold Accents
  ctx.strokeStyle = '#eab308';
  ctx.lineWidth = 6;
  ctx.strokeRect(30, 30, 1140, 740);

  ctx.strokeStyle = '#fde047';
  ctx.lineWidth = 2;
  ctx.strokeRect(42, 42, 1116, 716);

  // Corner decorations
  const corners = [
    [42, 42],
    [1158, 42],
    [42, 758],
    [1158, 758],
  ];
  corners.forEach(([cx, cy]) => {
    ctx.fillStyle = '#eab308';
    ctx.beginPath();
    ctx.arc(cx, cy, 10, 0, Math.PI * 2);
    ctx.fill();
  });

  // 3. Header Ribbon / Badge
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Subtitle
  ctx.font = 'bold 15px "Courier New", monospace';
  ctx.fillStyle = '#fbbf24';
  ctx.fillText('★ HỆ SINH THÁI GAME KHẢO THÍ HỮU TÀI GENZ ★', 600, 100);

  // Main Certificate Title
  ctx.font = '900 38px Georgia, serif';
  ctx.fillStyle = '#f8fafc';
  ctx.fillText('GIẤY CHỨNG NHẬN HOÀN THÀNH TRÒ CHƠI', 600, 155);

  ctx.font = 'bold 22px Georgia, serif';
  ctx.fillStyle = '#facc15';
  ctx.fillText('DINO QUEST — BÍ ẨN TỨ ĐẠI CÁNH CỬA', 600, 205);

  // Decorative divider
  ctx.strokeStyle = '#ca8a04';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(350, 235);
  ctx.lineTo(850, 235);
  ctx.stroke();

  // 4. Awardee Section
  ctx.font = 'italic 18px Georgia, serif';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('Chứng nhận người chơi', 600, 285);

  ctx.font = 'bold 44px Georgia, serif';
  ctx.fillStyle = '#38bdf8';
  ctx.fillText(playerName || 'Nhà Thám Hiểm Tri Thức', 600, 345);

  ctx.font = '18px Georgia, serif';
  ctx.fillStyle = '#cbd5e1';
  ctx.fillText('Đã xuất sắc vượt qua toàn bộ 10 Vùng đất Khảo thí, giải mã chính xác Tứ đại cánh cửa', 600, 410);
  ctx.fillText('và hoàn thành trọn vẹn hành trình với điểm số tuyệt đối:', 600, 440);

  // 5. Score Banner
  ctx.fillStyle = '#0284c7';
  ctx.beginPath();
  ctx.roundRect(460, 475, 280, 70, 16);
  ctx.fill();
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.font = '900 34px "Courier New", monospace';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('100 / 100 ĐIỂM', 600, 510);

  // Title achieved
  ctx.font = 'bold 20px Georgia, serif';
  ctx.fillStyle = '#fde047';
  ctx.fillText('Danh hiệu: « NHÀ THÁM HIỂM TRI THỨC »', 600, 580);

  // 6. Disclaimer & Metadata (Strict compliance: No fake seal, no fake signature)
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(200, 630);
  ctx.lineTo(1000, 630);
  ctx.stroke();

  ctx.font = 'italic 14px "Segoe UI", sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('Ghi chú: Giấy chứng nhận này ghi nhận thành tích hoàn thành trò chơi tương tác giáo dục,', 600, 660);
  ctx.fillText('không phải văn bằng, chứng chỉ hoặc giấy phép chuyên môn.', 600, 685);

  ctx.font = '13px "Courier New", monospace';
  ctx.fillStyle = '#64748b';
  ctx.fillText(`Ngày cấp: ${dateStr} • Website: https://huutaigenz.vercel.app/`, 600, 725);

  return canvas.toDataURL('image/png');
}
