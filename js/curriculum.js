/**
 * ShaderStudy – Curriculum Data (non-module, global)
 * ============================================================
 */

window.ShaderStudy = window.ShaderStudy || {};

ShaderStudy.curriculum = [
  {
    id: "ch1",
    title: "Chương I: Giới thiệu về ngôn ngữ lập trình Shader",
    lessons: [
      {
        id: "ch1-l1",
        title: "Bài 1: Mục 1.0 - Polygon Properties & Render Pipeline Stage 1",
        readingTime: 15,
        quiz: [
          {
            question: "Một Primitive (Sphere, Cube, Cylinder...) là một đối tượng 3 chiều, toàn bộ thông tin về đỉnh, không gian, tọa độ của nó được nhóm lại trong một cấu trúc dữ liệu gọi là gì?",
            options: ["Vector", "Material", "Texture", "Mesh"],
            correct: 3,
            explanation: "Mesh là nơi lưu trữ tập hợp tất cả các vertices, tangents, normals, UV coordinates và color của đối tượng."
          },
          {
            question: "Trong phần mềm 3D (như Maya), Node nào quản lý vị trí các Vertices cụ thể so với tổng thể tích của vật thể?",
            options: ["Transform Node", "Shape Node", "Material Node", "Camera Node"],
            correct: 1,
            explanation: "Shape Node (con của Transform) chứa các thuộc tính hình học bao gồm sự phân bổ vị trí các Vertices theo tỉ lệ riêng của đối tượng."
          },
          {
            question: "Chức năng cốt lõi của Normals (Pháp tuyến) trong quá trình Render là gì?",
            options: ["Xác định màu sắc chất liệu trên một bề mặt", "Điều khiển kích thước của vật thể trong không gian", "Xác định mặt trước/hướng của một mặt (face) hoặc đỉnh (vertex) trong không gian", "Kiểm soát độ phân giải của texture"],
            correct: 2,
            explanation: "Normal là một vector vuông góc từ bề mặt, nhờ nó engine có thể biết một mặt đang quay về hướng nào trong không gian 3 chiều."
          },
          {
            question: "Về mặt khái niệm, Tangents (Tiếp tuyến) là vector chạy dọc theo hướng nào của đối tượng trên mặt hình học?",
            options: ["Theo trục Z của thế giới (World Space)", "Theo tọa độ V của UV", "Dọc theo vector pháp tuyến (Normals)", "Theo tọa độ U của hệ UV (UV coordinates)"],
            correct: 3,
            explanation: "Vector Tangents luôn di chuyển dọc theo phương ngang (U) của hệ UV để giúp tính toán hiệu ứng bề mặt sáng/tối."
          },
          {
            question: "Vùng giá trị tọa độ tiêu chuẩn của hệ UV Coordinates nằm trong khoảng nào?",
            options: ["-1.0f đến 1.0f", "0.0f đến 1.0f", "0 đến 255", "-255 đến 255"],
            correct: 1,
            explanation: "Tọa độ UV được biểu diễn trong một hệ không gian Descartes tỷ lệ, giới hạn từ 0.0f (Gốc) đến 1.0f (Cực đại)."
          },
          {
            question: "Unity chia kiến trúc Render Pipeline tiêu chuẩn ra làm 4 giai đoạn chính diễn ra theo thứ tự nào?",
            options: ["Geometry -> Application -> Pixel -> Rasterization", "Application -> Geometry -> Rasterization -> Pixel", "Rasterization -> Geometry -> Application -> Pixel", "Application -> Rasterization -> Geometry -> Pixel"],
            correct: 1,
            explanation: "Thứ tự chính xác: Bắt đầu từ Ứng dụng (Application), Phân tích Hình học (Geometry), Quét lưới (Rasterization), và cuối cùng là xử lý Điểm ảnh (Pixel)."
          },
          {
            question: "Giai đoạn Application (Application Stage) được xử lý hoàn toàn bởi linh kiện nào trên máy tính?",
            options: ["GPU", "CPU", "RAM", "Monitor"],
            correct: 1,
            explanation: "Giai đoạn Application Stage hoạt động trực tiếp qua CPU, giúp xử lý Collision, Animation, Keyboard/Mouse input trước khi ném dữ liệu polygon cho GPU."
          },
          {
            question: "Đâu KHÔNG PHẢI là một giai đoạn con (Subprocess) của Geometry Processing Phase?",
            options: ["Vertex shading", "Rasterization", "Clipping", "Screen mapping"],
            correct: 1,
            explanation: "Rasterization là một trong 4 giai đoạn lớn của Render Pipeline, không phải là quy trình con bên trong Geometry Processing."
          },
          {
            question: "Khi một vật thể chỉ có một nửa nằm trong tầm nhìn của Camera (Frustum), quá trình engine loại bỏ đi một nửa vật thể nằm ngoài tầm nhìn nhằm tiết kiệm tài nguyên được gọi là gì?",
            options: ["Projection", "Clipping", "Rasterization", "Screen mapping"],
            correct: 1,
            explanation: "Clipping (cắt rỉa) là quá trình tự động chỉ lấy và vẽ phần giao diện nằm trong view-space (frustum) của người dùng."
          },
          {
            question: "Tiến trình nào trong bộ máy GPU chịu trách nhiệm chuyển đổi đối tượng 3 chiều thành tọa độ cửa sổ màn hình (Window coordinates)?",
            options: ["Screen mapping", "Vertex shading", "Application stage", "Clipping"],
            correct: 0,
            explanation: "Screen mapping nhận những vật thể 3D sau khi đã cắt xén và map toàn bộ tọa độ logic đó xuống các pixel 2D tương ứng của màn hình thiết bị."
          }
        ]
      },
      {
        id: "ch1-l2",
        title: "Bài 2: Mục 1.1 - Rasterization & Advanced Rendering",
        readingTime: 20,
        quiz: [
          {
            question: "Trong hệ tọa độ đồng nhất, giá trị W = 0 đại diện cho điều gì?",
            options: ["Một điểm", "Một hướng", "Một ma trận", "Một màu sắc"],
            correct: 1,
            explanation: "W=1 là một point, W=0 là một direction."
          }
        ]
      }
    ]
  },
  {
    id: "ch2",
    title: "Chương II: Shaders in Unity",
    lessons: [
      {
        id: "ch2-l1",
        title: "Bài 1: Mục 2.0 - Định nghĩa & Classification",
        readingTime: 15,
        quiz: [
          {
            question: "Tại sao Shader lại được thực thi bởi GPU thay vì CPU?",
            options: ["GPU xử lý song song với hàng ngàn lõi", "GPU tiết kiệm điện hơn"],
            correct: 0,
            explanation: "GPU thiết kế để xử lý hàng triệu pixel cùng lúc."
          }
        ]
      }
    ]
  },
  {
    id: "ch3",
    title: "Chương III: Properties, Commands và Functions",
    lessons: [
      {
        id: "ch3-l1",
        title: "Bài 1: Mục 3.0 - Shader Structure & ShaderLab Properties",
        readingTime: 25,
        quiz: [
          {
            question: "Trong khối Properties, lỗi nào khiến GPU không đọc được chương trình?",
            options: ["Dùng dấu chấm phẩy (;) ở cuối dòng", "Dùng dấu ngoặc đơn"],
            correct: 0,
            explanation: "ShaderLab Properties không sử dụng dấu chấm phẩy."
          }
        ]
      },
      {
        id: "ch3-l2",
        title: "Bài 2: Mục 3.1 - Advanced Drawers, SubShader & Tags",
        readingTime: 40,
        quiz: [
          {
            question: "Lợi ích của Enum drawer khi kết hợp với lệnh Cull là gì?",
            options: ["Thay đổi cấu hình mặt được vẽ (vẽ mặt trước/sau) từ Inspector", "Tăng tốc độ Render"],
            correct: 0,
            explanation: "Nó cho phép thay đổi tham số lệnh mà không cần sửa code."
          },
          {
            question: "Trong công thức Blending, 'Dst' (Destination) đại diện cho điều gì?",
            options: ["Output của Fragment Shader", "Màu đã có sẵn trên màn hình (Render Target)"],
            correct: 1,
            explanation: "Dst là màu mục tiêu đã được vẽ trên màn hình trước đó."
          },
          {
            question: "Nhóm Queue nào được vẽ sau cùng trên màn hình?",
            options: ["Background", "Geometry", "Overlay", "Transparent"],
            correct: 2,
            explanation: "Overlay (3600-5000) được vẽ cuối cùng."
          }
        ]
      }
    ]
  }
];

// ── Helpers ──────────────────────────────────────────────────

ShaderStudy.getTotalLessons = function() {
  return ShaderStudy.curriculum.reduce((acc, ch) => acc + ch.lessons.length, 0);
};

ShaderStudy.getLessonById = function(lessonId) {
  for (const chapter of ShaderStudy.curriculum) {
    for (const lesson of chapter.lessons) {
      if (lesson.id === lessonId) return { lesson, chapter };
    }
  }
  return null;
};

ShaderStudy.getAdjacentLessons = function(lessonId) {
  const flat = ShaderStudy.curriculum.flatMap(ch =>
    ch.lessons.map(l => ({ lesson: l, chapter: ch }))
  );
  const idx = flat.findIndex(item => item.lesson.id === lessonId);
  return {
    prev: idx > 0 ? flat[idx - 1] : null,
    next: idx < flat.length - 1 ? flat[idx + 1] : null,
  };
};
