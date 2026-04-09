window.ShaderStudy = window.ShaderStudy || {};
window.ShaderStudy.Theory = window.ShaderStudy.Theory || {};
window.ShaderStudy.Theory["ch1-l1"] = `
          <p>Để hiểu rõ Shader, chúng ta cần nắm vững 4 nền tảng: Polygon properties, Render Pipeline, Matrices và Coordinate Systems.</p>
          <h2 id="1.0.1">1.0.1. Thuộc tính của một polygonal object</h2>
          <p>Từ <strong>polygon</strong> bắt nguồn từ tiếng Hy Lạp, được cấu tạo từ <strong>poly</strong> (nhiều) và <strong>gnow</strong> (góc). Theo định nghĩa, một <strong>polygon</strong> là một hình phẳng khép kín được giới hạn bởi các đoạn thẳng.</p>
          
          <div class="lesson-fig">
            <div class="fig-placeholder">
              <span class="fig-placeholder-icon">🖼️</span>
              <span class="fig-placeholder-text">Yêu cầu ảnh: Fig. 1.0.1a</span>
              <span class="fig-placeholder-path">assets/ch1/fig_1_0_1a.png</span>
            </div>
            <figcaption>Hình 1.0.1a: Thuộc tính của một polygonal object</figcaption>
          </div>

          <p>Một <strong>primitive</strong> là một đối tượng hình học ba chiều được tạo thành từ các <strong>polygons</strong> và được sử dụng như một đối tượng định nghĩa sẵn trong các phần mềm phát triển khác nhau. Trong Unity, Maya hay Blender, chúng ta có thể tìm thấy các <strong>primitives</strong> khác. Phổ biến nhất là: <strong>Spheres, Boxes, Quads, Cylinders</strong> và <strong>Capsules</strong>.</p>
          
          <p>Các đối tượng này khác nhau về hình dạng nhưng có các thuộc tính tương tự; tất cả đều có <strong>vertices, tangents, normals, UV coordinates</strong> và <strong>color</strong>. Các dữ liệu này được lưu trữ trong một kiểu dữ liệu gọi là <strong>"mesh"</strong>.</p>
          
          <p>Chúng ta có thể truy cập độc lập tất cả các thuộc tính này bên trong một shader và lưu chúng vào các vector (ví dụ: <code>float4 pos : POSITION[n]</code>). Điều này rất hữu ích vì chúng ta có thể sửa đổi giá trị của chúng để tạo ra các hiệu ứng thú vị. Để hiểu rõ hơn khái niệm này, chúng ta sẽ xem qua định nghĩa chi tiết của các thuộc tính trong một <strong>polygonal object</strong>.</p>

          <div class="lesson-fig">
            <div class="fig-placeholder">
              <span class="fig-placeholder-icon">🖼️</span>
              <span class="fig-placeholder-text">Yêu cầu ảnh: Fig. 1.0.1b</span>
              <span class="fig-placeholder-path">assets/ch1/fig_1_0_1b.png</span>
            </div>
            <figcaption>Hình 1.0.1b: Thuộc tính của một polygonal object</figcaption>
          </div>

          <h2 id="1.0.2">1.0.2. Vertices (Đỉnh)</h2>
          <p>Các <strong>vertices</strong> của một đối tượng tương ứng với tập hợp các điểm xác định diện tích của một bề mặt trong không gian 2D hoặc 3D. Trong Maya và Blender, các <strong>vertices</strong> được biểu diễn dưới dạng các điểm giao nhau của <strong>mesh</strong> và đối tượng.</p>
          
          <p>Có hai đặc điểm chính định nghĩa các điểm này:</p>
          <ol>
            <li>Chúng là con (children) của thành phần <strong>transform</strong>.</li>
            <li>Chúng có một vị trí xác định dựa trên tâm của tổng thể tích (total volume) của đối tượng.</li>
          </ol>

          <p>Điều này có nghĩa là gì? Giả sử trong Maya 3D, có hai node mặc định liên kết với một đối tượng là: <strong>transform</strong> và <strong>shape</strong>.</p>
          <ul>
            <li>Node <strong>transform</strong> (giống như trong Unity) định nghĩa vị trí (position), hướng xoay (rotation) và tỷ lệ (scale) của một đối tượng xoay quanh điểm xoay (pivot) của nó.</li>
            <li>Ngược lại, node <strong>shape</strong> (là con của transform node) chứa các thuộc tính hình học (geometry attributes), tức là vị trí của các <strong>vertices</strong> đối tượng so với thể tích của nó.</li>
          </ul>
          <p>Nghĩa là chúng ta có thể di chuyển, xoay hoặc thu phóng tập hợp các <strong>vertices</strong> của một đối tượng, nhưng đồng thời còn có thể thay đổi vị trí của một <strong>vertex</strong> cụ thể.</p>

          <p>Ngữ nghĩa <code>POSITION[n]</code> đã ví dụ ở trên chính là thứ cho phép truy cập vào vị trí của các <strong>vertices</strong> liên quan đến thể tích của chính nó, tức là cấu hình được xuất ra từ <strong>shape node</strong> của Maya.</p>

          <div class="lesson-fig">
            <div class="fig-placeholder">
              <span class="fig-placeholder-icon">🖼️</span>
              <span class="fig-placeholder-text">Yêu cầu ảnh: Fig. 1.0.2a</span>
              <span class="fig-placeholder-path">assets/ch1/fig_1_0_2a.png</span>
            </div>
            <figcaption>Hình 1.0.2a: Bên trái là Transform node từ Maya, bên phải là Shape node.</figcaption>
          </div>

          <h2 id="1.0.3">1.0.3. Normals (Pháp tuyến)</h2>
          <p>Hãy tưởng tượng chúng ta có một tờ giấy trắng và yêu cầu một người bạn vẽ lên mặt trước của tờ giấy đó. Làm thế nào để xác định đâu là mặt trước nếu cả hai mặt đều giống hệt nhau? Đây là lý do tại sao <strong>normals</strong> tồn tại. Một <strong>normal</strong> tương ứng với một vector vuông góc với bề mặt của một <strong>polygon</strong>, được sử dụng để xác định hướng hoặc định hướng của một <strong>face</strong> (mặt) hoặc <strong>vertex</strong> (đỉnh).</p>
          <p>Trong Maya, chúng ta có thể trực quan hóa các <strong>normals</strong> của một đối tượng bằng cách chọn thuộc tính <strong>vertex normals</strong>. Nó cho phép chúng ta thấy một <strong>vertex</strong> hướng vào đâu trong không gian và xác định mức độ sắc nét (hardness level) giữa các <strong>faces</strong> khác nhau của một đối tượng.</p>
          
          <div class="lesson-fig">
            <div class="fig-placeholder">
              <span class="fig-placeholder-icon">🖼️</span>
              <span class="fig-placeholder-text">Yêu cầu ảnh: Fig. 1.0.3a</span>
              <span class="fig-placeholder-path">assets/ch1/fig_1_0_3a.png</span>
            </div>
            <figcaption>Hình 1.0.3a: Biểu diễn đồ họa của các normals trên mỗi vertex</figcaption>
          </div>

          <h2 id="1.0.4">1.0.4. Tangents (Tiếp tuyến)</h2>
          <p>Theo tài liệu chính thức của Unity: <em>"Một <strong>tangent</strong> là một vector có độ dài đơn vị chạy theo bề mặt của <strong>mesh</strong> dọc theo hướng của texture ngang."</em></p>
          <p>Điều này có nghĩa là gì? Các <strong>tangents</strong> đi theo tọa độ U của <strong>UV</strong> trên mỗi mặt hình học (geometry face).</p>

          <div class="lesson-fig">
            <div class="fig-placeholder">
              <span class="fig-placeholder-icon">🖼️</span>
              <span class="fig-placeholder-text">Yêu cầu ảnh: Fig. 1.0.4a</span>
              <span class="fig-placeholder-path">assets/ch1/fig_1_0_4a.png</span>
            </div>
            <figcaption>Hình 1.0.4a: Theo mặc định, chúng ta không thể truy cập Binormals trong shader. Thay vào đó, chúng ta phải tính toán dựa trên normals và tangents.</figcaption>
          </div>
          <p>Sau này trong Chương II, mục 6.0.1, chúng ta sẽ xem xét chi tiết thuộc tính này và bao gồm cả các <strong>binormals</strong> để triển khai <strong>normal map</strong> trên một đối tượng.</p>

          <h2 id="1.0.5">1.0.5. UV coordinates (Tọa độ UV)</h2>
          <p>Tất cả chúng ta đều đã từng thay đổi trang phục (skin) cho nhân vật yêu thích của mình. <strong>UV coordinates</strong> liên quan trực tiếp đến khái niệm này, vì chúng cho phép chúng ta định vị một texture hai chiều trên bề mặt của một đối tượng ba chiều. Các tọa độ này đóng vai trò là các điểm tham chiếu, kiểm soát việc các <strong>texels</strong> trong texture map tương ứng với mỗi <strong>vertex</strong> trong <strong>mesh</strong>.</p>
          
          <p>Quá trình định vị các <strong>vertices</strong> trên <strong>UV coordinates</strong> được gọi là <strong>"UV mapping"</strong>. Đây là một quy trình mà qua đó <strong>UV</strong> (hình ảnh biểu diễn hai chiều phẳng của mesh) được tạo ra, chỉnh sửa và sắp xếp. Bên trong shader, chúng ta có thể truy cập thuộc tính này để định vị một texture trên mô hình 3D hoặc để lưu trữ thông tin vào đó.</p>

          <div class="lesson-fig">
            <div class="fig-placeholder">
              <span class="fig-placeholder-icon">🖼️</span>
              <span class="fig-placeholder-text">Yêu cầu ảnh: Fig. 1.0.5a</span>
              <span class="fig-placeholder-path">assets/ch1/fig_1_0_5a.png</span>
            </div>
            <figcaption>Hình 1.0.5a: Các vertices có thể được sắp xếp theo nhiều cách khác nhau trong một UV map.</figcaption>
          </div>

          <p>Diện tích của <strong>UV coordinates</strong> tương đương với một phạm vi từ 0.0f đến 1.0f, trong đó "không" nghĩa là điểm bắt đầu và "một" là điểm kết thúc.</p>

          <div class="lesson-fig">
            <div class="fig-placeholder">
              <span class="fig-placeholder-icon">🖼️</span>
              <span class="fig-placeholder-text">Yêu cầu ảnh: Fig. 1.0.5b</span>
              <span class="fig-placeholder-path">assets/ch1/fig_1_0_5b.png</span>
            </div>
            <figcaption>Hình 1.0.5b: Tham chiếu đồ họa cho UV coordinates trong hệ tọa độ Descartes</figcaption>
          </div>

          <h2 id="1.0.6">1.0.6. Vertex color</h2>
          <p>Khi chúng ta xuất (export) một đối tượng từ phần mềm 3D, phần mềm đó sẽ gán một màu sắc cho đối tượng để bị tác động, thông qua chiếu sáng hoặc nhân bản (replicating) một màu khác. Màu sắc này được biết đến là <strong>vertex color</strong> và tương ứng với màu trắng (white) theo mặc định, có các giá trị là "một" (1) trong tất cả các kênh RGBA. Sau này, chúng ta sẽ được xem khái niệm này trên thực tế.</p>

          <h2 id="1.0.7">1.0.7. Render pipeline architecture</h2>
          <p>Trong các phiên bản hiện tại của Unity, có ba loại rendering pipeline: <strong>Built-in RP, Universal RP</strong> (gọi là Lightweight trong các phiên bản trước) và <strong>High Definition RP</strong>.</p>
          <p>Chúng ta có thể tự hỏi, render pipeline là gì? Để trả lời điều này, điều đầu tiên chúng ta phải hiểu là khái niệm "pipeline".</p>
          <p>Một pipeline (đường ống) là một chuỗi các giai đoạn thực hiện một hoạt động tác vụ quan trọng hơn. Vậy rendering pipeline đề cập đến điều gì? Hãy tưởng tượng khái niệm này như toàn bộ quá trình mà một polygonal object (ví dụ: đối tượng có đuôi .fbx) phải trải qua để được hiển thị (render) trên màn hình máy tính của chúng ta; nó giống như một đối tượng đi qua các đường ống Super Mario cho đến khi đạt đến đích cuối cùng.</p>
          <p>Vì vậy, mỗi rendering pipeline có các đặc điểm riêng và tùy thuộc vào loại chúng ta đang sử dụng: material properties, nguồn sáng, textures, và tất cả các functions đang diễn ra nội bộ trong shader, sẽ ảnh hưởng đến phần hiển thị và mức độ tối ưu hóa của đối tượng trên màn hình.</p>
          <p>Bây giờ, quá trình này diễn ra như thế nào? Đối với điều này, chúng ta phải nói về kiến trúc cơ bản của rendering pipeline. Unity chia kiến trúc này thành 4 giai đoạn: <strong>application, geometry processing, rasterization</strong>, và <strong>pixel processing</strong>.</p>
          <p>Xin lưu ý rằng điều kiện này tương ứng với mô hình cơ bản của một render pipeline đối với các real-time rendering engines. Mỗi giai đoạn được đề cập có các luồng (threads) mà chúng ta sẽ tìm hiểu tiếp theo.</p>

          <div class="lesson-fig">
            <div class="fig-placeholder">
              <span class="fig-placeholder-icon">🖼️</span>
              <span class="fig-placeholder-text">Yêu cầu ảnh: Fig. 1.0.7a</span>
              <span class="fig-placeholder-path">assets/ch1/fig_1_0_7a.png</span>
            </div>
            <figcaption>Hình 1.0.7a: Logic Render Pipeline</figcaption>
          </div>

          <h2 id="1.0.8">1.0.8. Application Stage</h2>
          <p>Giai đoạn <strong>application</strong> bắt đầu tại <strong>CPU</strong> và chịu trách nhiệm cho nhiều hoạt động diễn ra trong một scene, ví dụ:</p>
          <ul>
            <li>Collision detection (Phát hiện va chạm).</li>
            <li>Texture animation.</li>
            <li>Keyboard input (Nhập từ bàn phím).</li>
            <li>Mouse input, và nhiều hơn nữa.</li>
          </ul>
          <p>Chức năng của nó là đọc dữ liệu được lưu trữ trong bộ nhớ để tạo ra các primitives sau đó (ví dụ: triangles, lines, vertices). Cuối giai đoạn application, tất cả thông tin này được gửi đến giai đoạn <strong>geometry processing</strong> để tạo ra các phép biến đổi của các vertices thông qua phép nhân ma trận (matrix multiplication).</p>

          <div class="lesson-fig">
            <div class="fig-placeholder">
              <span class="fig-placeholder-icon">🖼️</span>
              <span class="fig-placeholder-text">Yêu cầu ảnh: Fig. 1.0.8a</span>
              <span class="fig-placeholder-path">assets/ch1/fig_1_0_8a.png</span>
            </div>
            <figcaption>Hình 1.0.8a: Application Stage</figcaption>
          </div>

          <h2 id="1.0.9">1.0.9. Geometry processing phase</h2>
          <p>CPU yêu cầu các hình ảnh mà chúng ta thấy trên màn hình máy tính từ GPU. Những yêu cầu này được thực hiện trong hai bước chính:</p>
          <ol>
            <li>Trạng thái render (render state) được cấu hình, tương ứng với chuỗi các giai đoạn từ geometry processing cho tới pixel processing.</li>
            <li>Sau đó, đối tượng được vẽ trên màn hình.</li>
          </ol>
          <p>Giai đoạn <strong>geometry processing</strong> (xử lý hình học) diễn ra trên <strong>GPU</strong> và chịu trách nhiệm xử lý các vertices của đối tượng. Giai đoạn này được chia thành bốn tiến trình nhỏ (subprocesses) đó là: <strong>vertex shading, projection, clipping</strong> và <strong>screen mapping</strong>.</p>

          <div class="lesson-fig">
            <div class="fig-placeholder">
              <span class="fig-placeholder-icon">🖼️</span>
              <span class="fig-placeholder-text">Yêu cầu ảnh: Fig. 1.0.9a</span>
              <span class="fig-placeholder-path">assets/ch1/fig_1_0_9a.png</span>
            </div>
            <figcaption>Hình 1.0.9a: Geometry processing phase</figcaption>
          </div>

          <p>Khi các primitives đã được lắp ráp trong giai đoạn application, quá trình <strong>vertex shading</strong> (thường được biết đến với tên gọi là vertex shader stage) xử lý hai nhiệm vụ chính:</p>
          <ol>
            <li>Nó tính toán vị trí của các vertices của đối tượng.</li>
            <li>Chuyển đổi vị trí của chúng sang các tọa độ không gian (space coordinates) khác nhau để chúng có thể được chiếu lên màn hình máy tính.</li>
          </ol>
          <p>Ngoài ra, bên trong tiến trình này, chúng ta có thể chọn các thuộc tính mà chúng ta muốn truyền qua các giai đoạn tiếp theo. Có nghĩa là bên trong vertex shader stage, chúng ta có thể bao gồm normals, tangents, UV coordinates v.v.</p>
          
          <p><strong>Projection</strong> (Phép chiếu) và <strong>clipping</strong> (Cắt xén) xảy ra như một phần của quá trình, thay đổi tùy theo các thuộc tính của camera trong scene. Cần nhắc lại rằng toàn bộ quá trình rendering chỉ xảy ra đối với những phần tử nằm trong <strong>camera frustum</strong> (còn được gọi là view-space).</p>
          <p>Projection và clipping sẽ phụ thuộc vào camera của chúng ta, nếu nó được thiết lập ở dạng <strong>perspective</strong> (phối cảnh) hoặc <strong>orthographic</strong> (trực giao/song song). Để hiểu quá trình này, chúng ta sẽ giả sử có một Sphere trong scene, trong đó một nửa nằm ngoài camera frustum, vì vậy chỉ vùng của Sphere nằm bên trong frustum mới được chiếu rọi và sau đó bị cắt xén (clipped) trên màn hình, nghĩa là, vùng của Sphere bị khuất tầm nhìn sẽ bị loại bỏ trong quá trình rendering.</p>

          <div class="lesson-fig">
            <div class="fig-placeholder">
              <span class="fig-placeholder-icon">🖼️</span>
              <span class="fig-placeholder-text">Yêu cầu ảnh: Fig. 1.0.9b</span>
              <span class="fig-placeholder-path">assets/ch1/fig_1_0_9b.png</span>
            </div>
            <figcaption>Hình 1.0.9b: Geometry processing phase</figcaption>
          </div>

          <p>Một khi những clipped objects của chúng ta nằm gọn trong bộ nhớ, chúng sẽ lần lượt được gửi tới <strong>screen mapping</strong> (bản đồ màn hình). Tại giai đoạn này, các đối tượng ba chiều mà chúng ta có trong scene được chuyển đổi thành <strong>screen coordinates</strong> (tọa độ màn hình), còn được biết đến với tên gọi là <strong>window coordinates</strong>.</p>
`;
