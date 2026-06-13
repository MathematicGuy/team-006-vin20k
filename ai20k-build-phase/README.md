# AI20K Build Phase Guide

Kho lưu trữ này là trung tâm tài liệu theo định hướng coaching, dành cho sinh viên trong giai đoạn AI20K Build Phase.

## Mục tiêu

Mục tiêu của dự án là cung cấp hướng dẫn thực tiễn và tài nguyên hữu ích để sinh viên hoàn thành Build Phase một cách có hệ thống, hiệu quả và đúng chuẩn chất lượng.

Nội dung tập trung vào:
- Quy trình rõ ràng cho lập kế hoạch, phát triển, review và bàn giao
- Thực hành quản lý dự án trực tiếp bằng GitHub Projects
- Quy tắc cộng tác nhóm theo tinh thần vận hành startup thật
- Checklist và tiêu chuẩn giúp giảm mơ hồ, hạn chế làm lại

## Đối tượng sử dụng

- Sinh viên tham gia AI20K Build Phase
- Team lead, mentor và coach đồng hành cùng đội nhóm

## Vai trò Coach trong giai đoạn này

Với vai trò Coach, kho tài liệu này giúp bạn:
- Đồng bộ kỳ vọng, nhịp làm việc và tiêu chuẩn chất lượng giữa các đội
- Duy trì một nguồn thông tin thống nhất cho toàn bộ quá trình thực thi
- Theo dõi tiến độ theo cùng một khung làm việc xuyên suốt
- Hướng dẫn sinh viên xây tư duy làm sản phẩm thực tế, không chỉ dừng ở viết code

## Tài liệu

| Guide | Mô tả |
|-------|-------|
| [Roadmap kỹ năng](guide/roadmap-ky-nang.md) | Bản đồ kỹ năng theo tuần — self-assessment, rubric alignment, tài nguyên gợi ý |
| [Hướng dẫn A20](guide/a20-huong-dan.md) | Hướng dẫn tổng quan cho nhóm A20 |
| [Kích hoạt GitHub Projects](guide/huong-dan-kich-hoat-github-project.md) | Setup và sử dụng GitHub Projects để quản lý sprint |

## Cách sử dụng khuyến nghị

1. Bắt đầu mỗi tuần bằng việc rà soát tài liệu và ưu tiên sprint.
2. Sử dụng GitHub Project board làm bảng điều phối thực thi duy nhất.
3. Liên kết xuyên suốt luồng công việc Issue -> PR -> Done.
4. Duy trì kỷ luật daily standup và báo cáo mentor.
5. Mỗi tuần đều có demo tiến triển, dù là phiên bản tăng dần.

## Đóng góp

Khuyến khích mentor và sinh viên cùng đóng góp:
- Bổ sung tài liệu mới trong thư mục `guide/`
- Viết ngắn gọn, có tính hành động và bám sát mục tiêu Build Phase
- Ưu tiên định dạng checklist và ví dụ thực tế khi phù hợp

## buildflow — quy trình build từ ý tưởng đến URL chạy thật

Thư mục [`buildflow/`](buildflow/) là template của quy trình 11 stage có gate (idea → research → scope → PRD → ADR → contract → cards → build → review → deploy → verify-live → retro), kèm skill `/flow` chạy trong Claude Code. Mỗi stage có một checklist chặn — chưa đạt thì chưa đi tiếp; "done" nghĩa là có bằng chứng chạy thật trên URL public, không phải "tests pass".

- **Landing page:** https://vibery-studio.github.io/ai20k-build-phase/
- **Bắt đầu:** copy thư mục `buildflow/` thành project của bạn, mở Claude Code trong đó, gõ `/flow next`.
- **Tác giả:** Tony — [arealisticdreamer.com](http://arealisticdreamer.com/)
