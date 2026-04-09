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
            question: "Mục đích chính của giai đoạn Rasterization (Quét lưới) là gì?",
            options: ["Thiết lập bề mặt ánh sáng của đối tượng", "Tìm kiếm và đồng bộ hóa các pixels bị chiếm dụng bởi một đối tượng trên màn hình (2D coordinates)", "Tính toán màu sắc của điểm ảnh", "Biến đổi tọa độ từ 3D sang 2D"],
            correct: 1,
            explanation: "Rasterization giúp dò quy chiếu và tìm ra tất cả các điểm ảnh (pixels) mà hình chiếu của đối tượng đang che phủ trên màn hình cứng."
          },
          {
            question: "Hai tiến trình lõi mà trình Rasterizer luôn thực hiện đối với mỗi đối tượng là gì?",
            options: ["Vertex shading và Pixel shading", "Triangle setup và Triangle traversal", "Model matrix và View matrix", "Forward rendering và Deferred shading"],
            correct: 1,
            explanation: "Quy trình này luôn bắt đầu bằng việc thiết lập phương trình cạnh tam giác (Triangle setup) và duyệt toàn bộ pixels bao phủ bên trong tam giác đó (Triangle traversal)."
          },
          {
            question: "Giai đoạn nào trong Render Pipeline giữ trọng trách tính màu sắc cuối cùng của điểm ảnh và tống nó vào bộ đệm màu (Color Buffer)?",
            options: ["Application Stage", "Geometry Processing", "Vertex Shader", "Fragment Shader (Pixel Processing)"],
            correct: 3,
            explanation: "Fragment/Pixel shader xử lý yếu tố hiển thị ở cấp độ điểm ảnh và xuất kết quả mã màu cuối cùng vào Color Buffer để được vẽ ra màn hình."
          },
          {
            question: "Ba định lý cơ bản cấu thành nên một Lighting Model (Mô hình chiếu sáng) tiêu chuẩn là gì?",
            options: ["Forward, Deferred, Vertex", "Built-in, Universal, High Definition", "Ambient color, Diffuse reflection, Specular reflection", "Point, Directional, Spot light"],
            correct: 2,
            explanation: "Mô hình ánh sáng cơ sở tính toán dựa trên tổng hợp của màu môi trường (Ambient), phản xạ khuếch tán (Diffuse) và phản xạ gương (Specular)."
          },
          {
            question: "Đặc điểm nhận diện lớn nhất gây hao tổn tài nguyên của luồng Forward Rendering khi xử lý nhiều nguồn sáng là gì?",
            options: ["Nó bỏ qua hoàn toàn các nguồn sáng bổ sung", "Nó đòi hỏi sức mạnh CPU quá lớn thay vì GPU", "Với mỗi nguồn sáng bổ sung chiếu vào vật thể, nó sinh ra thêm 1 Draw Call riêng biệt tương ứng (Additional Pass)", "Nó không có khả năng tạo bóng (shadows)"],
            correct: 2,
            explanation: "Mỗi đối tượng phải được vẽ lại một lần cho mỗi ánh sáng trực tiếp tác động lên nó. 4 hình Cầu bị 1 đèn rọi vào sẽ chịu tổng cộng 8 Draw Calls (4 Base + 4 Add)."
          },
          {
            question: "Khác với Forward Rendering, điểm mạnh nổi trội tuyệt đối của chuẩn Deferred Shading là gì?",
            options: ["Hỗ trợ tốt nhất cho mọi thiết bị di động", "Rất nhẹ về xử lý RAM và Memory", "Chỉ tốn duy nhất 1 Lighting Pass để tính toán toàn bộ số lượng nguồn sáng trong không gian", "Dễ viết code hlsl hơn"],
            correct: 2,
            explanation: "Do Deferred có khả năng xé lẻ khâu render Geometry và Lighting ra, nên nó có thể xử lý lượng nguồn sáng khổng lồ cùng lúc mà không lo bị đội số Draw Call quá đà."
          },
          {
            question: "Hạn chế mang tính 'chí mạng' rủi ro cao nhất khi bạn dùng Shader Graph (kéo thả) thay vì code HLSL truyền thống?",
            options: ["Shader Graph cắn quá nhiều RAM máy tính", "Shader Graph không thể tạo được tính năng phức tạp", "Mã shader rất dễ bị vỡ hỏng, không biên dịch biên dịch được nếu nâng cấp phiên bản định kỳ của Unity Project", "Shader Graph không chạy được trên URP"],
            correct: 2,
            explanation: "Shader Graph là một Packages độc lập, vì vậy mỗi khi Unity nâng cấp bản nội bộ, graph có thể xung đột và đứt gãy node."
          },
          {
            question: "Quy tắc bắt buộc khi tiến hành phép Nhân 2 Ma Trận (Matrix Multiplication) lại với nhau là gì?",
            options: ["Cả 2 ma trận đều phải có cỡ 4x4", "Số Cột (columns) trong ma trận thứ 1 phải BẰNG số Hàng (rows) trong ma trận thứ 2", "Hai ma trận cộng lại bằng 0", "Chỉ Nhân được ma trận 4x1 với nhau"],
            correct: 1,
            explanation: "Đây là nguyên tắc toán học cơ bản. Nhờ vậy ma trận Transformation 4x4 mới có thể nhân với Vertex vị trí 4x1 để cho ra 1 Vertex vị trí 4x1 tọa độ mới."
          },
          {
            question: "Kênh 'W' (trục không gian thứ tư) trong hệ tọa độ Vector đồng nhất XYZW, nếu có giá trị bằng KHÔNG (0), nó đang ám chỉ điều gì?",
            options: ["Nó là một Điểm (Point) trên không gian", "Nó là một Lệnh Gọi (Draw call)", "Vị trí không tồn tại", "Nó là một Hướng (Direction) trong không gian"],
            correct: 3,
            explanation: "Trong toán học đồng nhất, W=1 sẽ quy chiếu là Point, còn W=0 sẽ quy chiếu thành một vector Hướng (Direction)."
          },
          {
            question: "Tổ hợp siêu Ma trận nổi tiếng UNITY_MATRIX_MVP dùng trong Vertex Shader là viết tắt đại diện cho ba ma trận nào dưới đây?",
            options: ["Master, View, Pixel", "Model, Vertex, Pipeline", "Model, View, Projection", "Morph, Velocity, Position"],
            correct: 2,
            explanation: "M: Model Matrix, V: View Matrix, P: Projection Matrix. Cụm ma trận tổng hợp chuyển hóa điểm từ vị trí vật thể (object-space) sang vị trí ảnh xạ (clip-space)."
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
            options: ["GPU xử lý song song với hàng ngàn lõi", "GPU tiết kiệm điện hơn", "CPU thiết kế để xử lý song song", "Tốc độ xung nhịp CPU quá thấp"],
            correct: 0,
            explanation: "GPU có thiết kế kiến trúc song song với hàng ngàn lõi nhỏ xíu nhưng hiệu quả để giải quyết các tính toán đồng thời trên từng pixel."
          },
          {
            question: "Phần mở rộng định dạng chuẩn của một tệp shader trong Unity là gì?",
            options: [".mat", ".cginc", ".shader", ".hlsl"],
            correct: 2,
            explanation: "Mặc dù code có thể viết bằng HLSL hay Cg, tệp gốc mang định dạng .shader chứa ngôn ngữ bao bọc ShaderLab."
          },
          {
            question: "Bạn nên tạo một dự án Unity với cấu hình Template nào để dễ đối chiếu thông tin nhất khi bắt đầu học viết Shader cốt lõi (Theo giáo trình)?",
            options: ["2D Core", "3D with Built-in RP", "High Definition RP", "Universal RP"],
            correct: 1,
            explanation: "3D template tích hợp Build-in Render Pipeline cung cấp môi trường cơ sở đơn giản nhất để thấu hiểu đồ họa lập trình ShaderLab."
          },
          {
            question: "Image Effect Shader thường được ứng dụng để thực thi mục đích nào trong Unity?",
            options: ["Tạo hình bóng (shadow) của một lưới tọa độ", "Đổ màu lên bề mặt model 3D không bị ảnh hưởng bởi ánh sáng môi trường", "Các thao tác tính toán vật lý không cần xử lý hình ảnh", "Thay đổi hình ảnh đầu ra (Post-processing effect) đối với hình ảnh tạo ra bởi một Camera"],
            correct: 3,
            explanation: "Image Effect Shader lấy output frame của Camera làm input texture để nhào nặn thành các hiệu ứng Bloom, Blur, Color Grading."
          },
          {
            question: "Loại Shader nào dưới đây tương tác với kiến trúc dựa trên nền tảng tính toán vật lý mô phỏng ánh sáng thật (PBR)?",
            options: ["Unlit Shader", "Compute Shader", "Standard Surface Shader", "Image Effect Shader"],
            correct: 2,
            explanation: "Shader Bề mặt Chuẩn (Standard Surface Shader) tối ưu hóa việc viết shader bằng cách tự động xử lý hệ thống tính toán khối lượng ánh sáng đồ sộ tự động ẩn bên dưới."
          },
          {
            question: "Đặc tính 'Đơn giản nhất, không tương tác với ánh sáng, màu sắc phẳng cứng' là để mô tả loại Shader nào?",
            options: ["Standard Surface Shader", "Compute Shader", "Unlit Shader", "Ray Tracing Shader"],
            correct: 2,
            explanation: "Unlit (Không được chiếu sáng) là loại shader cơ bản nhất trả về đúng nguyên bản màu của nó (base color/texture) mà không cần bận tâm hệ thống ánh sáng."
          },
          {
            question: "Loại Shader nào không phục vụ cho mục đích render điểm ảnh mà thường được sử dụng nhằm mục đích tận dụng lợi thế CPU-song-song (ví dụ: bầy đàn Boids, tính mô phỏng nước)?",
            options: ["Ray Tracing Shader", "Compute Shader", "Unlit Shader", "Geometry Shader"],
            correct: 1,
            explanation: "Compute Shader (kiểu tài nguyên lõi tính toán) đọc và ghi vào buffer nhưng không có vai trò xuất kết xuất điểm ảnh trên màn hình như Graphics Pipeline thường thấy."
          },
          {
            question: "Đường dẫn thao tác nào cho phép bạn khởi tạo một tệp lệnh Shader trên cửa sổ Projects Tool trong Unity?",
            options: ["Window / Create / Shader", "Ctr + 5 (mở Projects Window) > Chuột phải > Create > Shader", "Component / Add / Shader", "Game Object / Create 3D Object / Shader"],
            correct: 1,
            explanation: "Ta luôn phải tạo File Shader như một 'Asset' thuộc quản lý của cửa sổ điều hướng Project."
          },
          {
            question: "Cấu hình CPU được định nghĩa và tạo ra tập trung nhằm xử lý loại quy trình tác vụ máy tính nào chuyên biệt?",
            options: ["Tác vụ có hàng triệu tiến trình nhỏ giống y chang nhau", "Các tiến trình xử lý đồ họa chuyên sâu", "Mô phỏng vật lý đồng thời nhiều vật thể", "Những xử lý tính toán tiến trình mang yếu tố tuần tự nối tiếp nhau (Sequential serial processing)"],
            correct: 3,
            explanation: "CPU có ít lõi nhạy bén cực mạnh để xử lý logic phức tạp, chạy luồng một mạch theo trật tự lớp lang (tuần tự tuần tự), trái ngược hoàn toàn GPU."
          },
          {
            question: "Mục tiêu tối thượng của việc viết code trong môi trường Shader là nhằm mục đích gì đối với vùng màn hình của chúng ta?",
            options: ["Thiết lập hệ đa giác trên model", "Tối ưu hóa file chứa các model .fbx", "Điều chỉnh màu sắc cho từng pixel bên trong khu vực mà object đang choán lấy điểm ảnh", "Lập trình logic nhân vật trong Game"],
            correct: 2,
            explanation: "Code shader về bản chất điều phối các biểu thức toán học chi tiết đặng ra lệnh quyết định màu sắc mỗi từng chấm đen trắng hoặc RGB (pixel) hình dáng vật thể đó in dập lên màn hình."
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
            question: "Trong khối Properties, lỗi nào sẽ khiến GPU chết đứng và không thể tiếp tục đọc biên dịch cả chương trình?",
            options: ["Sử dụng dấu ngoặc vuông []", "Quên đặt khối Properties lên đỉnh", "Sử dụng dấu chấm phẩy (;) ở cuối đoạn khai báo cấu trúc", "Sử dụng dấu / bình luận"],
            correct: 2,
            explanation: "Khi ta khai báo property, trạng thái vẫn 'mở' trong không gian của nó, nếu dùng ; ở cuối dòng lập tức làm chặn hỏng kết hạn code ShaderLab."
          },
          {
            question: "Thành phần <code>InspectorPath</code> ở đầu mục khai báo Shader có tác dụng gì?",
            options: ["Đường dẫn ổ đĩa C lưu file .shader", "Tên thư mục ảo để tìm chọn file shader này áp vào Material", "Quy định Material đó áp vào Game Object nào", "Lưu đường dẫn URL tới tài liệu online"],
            correct: 1,
            explanation: "Path ảo này thể hiện cấu trúc thu gọn Menu đổ dọc trên bảng Material Inspector, giúp ta tùy ý quy hoạch khu cắm file dễ nhìn ngắm thuận mắt."
          },
          {
            question: "Cấu trúc một file Shader chuẩn trong Unity tuân theo trình tự tổng quan nào sau đây từ trên xuống dưới?",
            options: ["SubShader, Fallback, Shader, Properties", "ShaderName, SubShader, Properties, Fallback", "ShaderName, Properties, SubShader, Fallback", "ShaderName, Properties, Fallback, SubShader"],
            correct: 2,
            explanation: "Bất kì shader nào cũng mở đầu bởi đường dẫn Inspector, tiếp đến là mục khai Properties, ôm hết lõi trong SubShader, và mót nhặt phòng ngừa bằng khối Fallback cuối."
          },
          {
            question: "GPU dịch mã theo chiều tuyến tính từ trên xuống dưới. Điều gì sẽ xảy ra nếu ta khai báo định nghĩa một Function thấp dưới dòng gọi Function đó trong khối CGPROGRAM?",
            options: ["Shader tự sửa lấp lỗi và chạy tiếp", "Hàm sẽ không được Load vào bộ nhớ sinh ra Error Compile", "Sẽ Render ra màu Tím (Pink shader) nhưng không báo lỗi Console", "Biến tự động nhảy thành Cg Global parameter"],
            correct: 1,
            explanation: "Do tính tuyến tính, GPU không hiểu hàm bạn gọi là gì sinh ra Error (lỗi), bắt Fallback hoạt động nhảy file. Nên Hàm bổ trợ phải khai ngóc đầu trên khối gọi nó."
          },
          {
            question: "Lệnh khai báo kiểu <code>Range(0.0, 1.1)</code> trong dòng Property được sử dụng khi nào trong ShaderLab?",
            options: ["Chọn màu RGB thủ công", "Tạo trực quan ngàm thanh trượt chứa khoảng giá trị số Float", "Tạo tùy chọn 1 ô đánh dấu True/False", "Quản lý dải số Nguyên mảng lớn"],
            correct: 1,
            explanation: "Range mang quyền tạo hình ảnh UI thanh Slider trên Inspector, tiện lợi việc điều hòa nhồi giá trị số Float kẹp giới hạn."
          },
          {
            question: "Kiểu Texture property <code>Cube</code> trong cấu trúc ShaderLab thường đóng vai trò chuyên gánh vác việc gì?",
            options: ["Tính toán thể tích khối trong tọa độ hộp sọ", "Mapping đồ thị hình lập phương của Pixel", "Là nền móng tạo các bản đồ phản xạ môi trường (Skybox/Metallic reflection maps)", "Bôi vân texture lên vật thể trụ Cube Unity chuẩn"],
            correct: 2,
            explanation: "'Cubemap' gồm 6 mặt kết hợp, ôm bọc lấy không gian 3 chiều chực đợi mô phỏng ảnh đổ bóng ảo phản xạ lên bề mặt vật làm bằng kim loại (metallic)."
          },
          {
            question: "Connection variable (Biến số kết nối đồng bộ) là gì?",
            options: ["Là kết nối dây cáp giữa CPU và GPU", "Là biến tạo ra trong khối Cg/HLSL ôm trùng y chang tên với Property của khối ShaderLab nhằm thấu hiểu nhau", "Là link đường dẫn mạng vào Server của dự án", "Là các node kéo thả kết dính trong giao diện Shader Graph"],
            correct: 1,
            explanation: "ShaderLab và Cg là 2 dòng máu ngôn ngữ biệt lập. Để Cg gọi dùng đúng Property do ShaderLab đẻ ra, nó phải mang một Variable đồng phục bảng tên không xê xích chút nào."
          },
          {
            question: "Tại sao KHÔNG THỂ áp trực tiếp một Shader trơn lủi lên thẳng khung đa giác Polygonal object trống không trên màn hình 3D Scene?",
            options: ["Lưới Mesh có thể bị xóa lệch trục tọa độ UV xé hình", "Cần một cầu nối cổng có tên Material ôm ấp cái Shader đó mới truyền thụ giá trị lên Object được", "Object thiếu Component Collider", "Bị chặn bởi Render Pass"],
            correct: 1,
            explanation: "Shader là lõi mã lệnh. Material thực chất là bệ phóng chứa giá trị data thực gán cho các Properties của file Shader đó. Object bắt buộc bám víu vào Material."
          },
          {
            question: "Khối lệnh định dạng <code>[Toggle]</code>, <code>[Enum]</code> hoặc <code>[KeywordEnum]</code> trong thiết lập Property được biết chính xác với tên phân cấp chuyên ngành kỹ thuật gì?",
            options: ["Connection Variable", "Fallback Component", "Material property Drawer", "Fragment Macro"],
            correct: 2,
            explanation: "Cuộc chơi Drawers làm ra custom properties hiển hiện trên thẻ Unity Inspector cởi bỏ gánh nặng quy chiếu vòng logic điều kiện (Conditional) dài dòng."
          },
          {
            question: "Mệnh đề nào sau đây đúng khi áp dụng drawer <code>[Toggle]</code> cho một Field giá trị bằng ShaderLab?",
            options: ["[Toggle] ép kiểu biến thành Boolean Native trong Shader Cg", "Tương ứng nó trả cho Property cấu hình Float một số có giá trị 0 hoặc 1 tựa như công tắc ON/OFF", "Dùng Toggle là giảm luôn số lần Draw Calls của dự án", "Drawer Toggle đòi hỏi bạn điền chữ 'True' ở DefaultValue"],
            correct: 1,
            explanation: "Trong Cg không tồn tại loại Boolean đúng nghĩa cho Drawer, ta vay mượn hàm hệ thống truyền qua float '0 tượng trưng OFF' và '1 tương đương ON'."
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
