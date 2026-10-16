// High-resolution Canvas Certificate Generator (1600x1100 px)
// Strict compliance: Game completion certificate ONLY, no simulated signatures,
// no unauthorized institutional seals (MOET/AUN-QA), no fake authentication codes.

export interface CertificateData {
  playerName: string;
  score: number;
  totalQuestions: number;
  dateStr?: string;
}

export function generateCertificateCanvas(data: CertificateData): HTMLCanvasElement {
  const width = 1600;
  const height = 1100;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  // 1. Background Parchment Texture
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#ffffff');
  bgGrad.addColorStop(0.5, '#fbf8f2');
  bgGrad.addColorStop(1, '#f5eee1');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Subtle geometric grid pattern
  ctx.strokeStyle = 'rgba(217, 119, 6, 0.04)';
  ctx.lineWidth = 1;
  for (let x = 40; x < width; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 40; y < height; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // 2. Ornate Outer & Inner Borders
  ctx.strokeStyle = '#b45309';
  ctx.lineWidth = 6;
  ctx.strokeRect(40, 40, width - 80, height - 80);

  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = 2;
  ctx.strokeRect(52, 52, width - 104, height - 104);

  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 3;
  ctx.strokeRect(62, 62, width - 124, height - 124);

  // Corner ornaments
  const drawCornerOrnament = (cx: number, cy: number, flipX: number, flipY: number) => {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(flipX, flipY);
    ctx.fillStyle = '#b45309';
    ctx.beginPath();
    ctx.arc(0, 0, 12, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(36, 0);
    ctx.moveTo(0, 0);
    ctx.lineTo(0, 36);
    ctx.stroke();
    ctx.restore();
  };

  drawCornerOrnament(70, 70, 1, 1);
  drawCornerOrnament(width - 70, 70, -1, 1);
  drawCornerOrnament(70, height - 70, 1, -1);
  drawCornerOrnament(width - 70, height - 70, -1, -1);

  // 3. Top Header Branding
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'center';
  ctx.letterSpacing = '3px';
  ctx.fillText('WEBSITE CÁ NHÂN HỮU TÀI GENZ — TRÒ CHƠI TƯƠNG TÁC GIÁO DỤC', width / 2, 120);

  // Divider
  const divGrad = ctx.createLinearGradient(width / 2 - 250, 0, width / 2 + 250, 0);
  divGrad.addColorStop(0, 'rgba(217, 119, 6, 0)');
  divGrad.addColorStop(0.5, 'rgba(217, 119, 6, 1)');
  divGrad.addColorStop(1, 'rgba(217, 119, 6, 0)');
  ctx.strokeStyle = divGrad;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 250, 140);
  ctx.lineTo(width / 2 + 250, 140);
  ctx.stroke();

  // 4. Main Title
  ctx.fillStyle = '#92400e';
  ctx.font = 'bold 48px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Times New Roman", serif';
  ctx.letterSpacing = '1px';
  ctx.fillText('GIẤY CHỨNG NHẬN HOÀN THÀNH TRÒ CHƠI', width / 2, 220);

  // 5. MANDATORY DISCLAIMER (Prominent Subtitle)
  ctx.fillStyle = '#b91c1c';
  ctx.font = 'bold 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.letterSpacing = '0.5px';
  ctx.fillText('★ CHỨNG NHẬN HOÀN THÀNH TRÒ CHƠI — KHÔNG PHẢI CHỨNG CHỈ CHUYÊN MÔN ★', width / 2, 260);

  ctx.fillStyle = '#475569';
  ctx.font = 'italic 22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, serif';
  ctx.fillText('Chứng nhận người chơi đã xuất sắc vượt qua các câu đố kiến thức trong trò chơi:', width / 2, 305);

  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 30px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Times New Roman", serif';
  ctx.fillText('“DINO EXAM RUNNER — HÀNH TRÌNH CHINH PHỤC KHẢO THÍ”', width / 2, 350);

  // 6. Player Name Box
  ctx.fillStyle = '#1e293b';
  ctx.font = '18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('Trao tặng cho nhân vật Khủng Long:', width / 2, 420);

  ctx.fillStyle = '#09090b';
  ctx.font = 'bold 56px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Times New Roman", serif';
  const name = data.playerName.trim() || 'Dino Tân Binh';
  ctx.fillText(name, width / 2, 485);

  // Underline under player name
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 280, 510);
  ctx.lineTo(width / 2 + 280, 510);
  ctx.stroke();

  // 7. Score Badge Card (Gold Embossed)
  const cardX = width / 2 - 270;
  const cardY = 550;
  const cardW = 540;
  const cardH = 110;

  ctx.fillStyle = '#fef3c7';
  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(cardX, cardY, cardW, cardH, 16);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#92400e';
  ctx.font = 'bold 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('KẾT QUẢ ĐẠT ĐƯỢC', width / 2, cardY + 34);

  ctx.fillStyle = '#15803d';
  ctx.font = 'bold 40px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(`${data.score}/100 ĐIỂM (${data.totalQuestions}/${data.totalQuestions} CÂU HỎI)`, width / 2, cardY + 80);

  // 8. Game Emblem / Trophy Crest (Left) - Game related only! No external institutional seals
  const emblemX = 320;
  const emblemY = 800;

  ctx.save();
  ctx.translate(emblemX, emblemY);
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.arc(0, 0, 70, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#b45309';
  ctx.beginPath();
  ctx.arc(0, 0, 62, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#fef3c7';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(0, 0, 56, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = '#fef3c7';
  ctx.font = 'bold 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('★ DINO RUNNER ★', 0, -18);
  ctx.font = 'bold 26px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('VICTORY', 0, 10);
  ctx.font = 'bold 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('100 / 100 ĐIỂM', 0, 30);
  ctx.restore();

  // 9. Website Information & Acknowledgement (Right) - Clean printed typography, NO simulated signature
  const infoX = width - 360;
  const infoY = 770;

  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(infoX - 160, infoY + 20);
  ctx.lineTo(infoX + 160, infoY + 20);
  ctx.stroke();

  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Times New Roman", serif';
  ctx.textAlign = 'center';
  ctx.fillText('WEBSITE HỮU TÀI GENZ', infoX, infoY + 50);

  ctx.fillStyle = '#475569';
  ctx.font = '15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('Chuyên Gia Khảo Thí & Đo Lường Giáo Dục', infoX, infoY + 76);
  ctx.fillText('Địa chỉ: huutaigenz.vercel.app', infoX, infoY + 98);

  // 10. Date & Disclaimer Footer (Bottom)
  const dateStr = data.dateStr || new Date().toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  ctx.fillStyle = '#64748b';
  ctx.font = '14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`NGÀY THỰC HIỆN: ${dateStr}  |  TRÒ CHƠI ĐƯỢC PHÁT HÀNH TRÊN HUUTAIGENZ.VERCEL.APP`, width / 2, height - 80);

  ctx.fillStyle = '#94a3b8';
  ctx.font = 'italic 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('Lưu ý: Giấy chứng nhận này ghi nhận kết quả giải trí trong trò chơi tương tác giáo dục trực tuyến và không thay thế cho bất kỳ văn bằng hay chứng chỉ pháp lý nào.', width / 2, height - 58);

  return canvas;
}

export function downloadCertificate(canvas: HTMLCanvasElement, playerName: string) {
  const cleanName = (playerName || 'Dino').trim().replace(/[^a-zA-Z0-9\u00C0-\u024F\u1EA0-\u1EF9]/g, '_');
  const filename = `Chung_Nhan_Tro_Choi_Dino_${cleanName}.png`;

  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png', 1.0);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
