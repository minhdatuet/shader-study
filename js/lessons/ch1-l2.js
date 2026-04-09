window.ShaderStudy = window.ShaderStudy || {};
window.ShaderStudy.Theory = window.ShaderStudy.Theory || {};
window.ShaderStudy.Theory["ch1-l2"] = `
          <h2 id="1.1.0">1.1.0. Rasterization stage</h2>
          <p>Giai đoạn thứ ba của chúng ta tương ứng với quy trình <strong>rasterization</strong> (quét lưới). Tại thời điểm này, các đối tượng của chúng ta đã có tọa độ màn hình (screen coordinates hay 2D coordinates), và bây giờ chúng ta phải tìm kiếm các pixels nằm trong vùng chiếu (projection area).</p>
          <p>Quá trình tìm kiếm tất cả các pixels bị chiếm dụng bởi một đối tượng trên màn hình được gọi là <strong>rasterization</strong>. Quá trình này có thể được xem như một bước đồng bộ hóa giữa các đối tượng trong scene và các pixels trên màn hình.</p>
          <p>Đối với mỗi đối tượng, trình <strong>rasterizer</strong> thực hiện hai quy trình:</p>
          <ol>
            <li>Triangle setup (Thiết lập tam giác).</li>
            <li>Triangle traversal (Duyệt tam giác).</li>
          </ol>
          <p><strong>Triangle setup</strong> chịu trách nhiệm tạo ra dữ liệu sẽ được gửi tới <strong>triangle traversal</strong>. Nó bao gồm các phương trình cho các cạnh của một đối tượng trên màn hình. <strong>Triangle traversal</strong> liệt kê các pixels bị bao phủ bởi diện tích của đối tượng polygon. Bằng cách này, một nhóm các pixels được gọi là "fragments" sẽ được tạo ra. Tuy nhiên, từ này cũng nhiều lần được sử dụng để chỉ một pixel riêng lẻ.</p>

          <h2 id="1.1.1">1.1.1. Pixel processing stage</h2>
          <p>Sử dụng các giá trị đã được nội suy (interpolated values) từ các quy trình trước đó, giai đoạn cuối cùng này bắt đầu khi tất cả các pixels đã sẵn sàng để được chiếu lên màn hình. Tại thời điểm này, <strong>fragment shader stage</strong> (còn được gọi là <strong>pixel shader stage</strong>) bắt đầu và chịu trách nhiệm xác định mức độ hiển thị (visibility) của từng pixel.</p>
          <p>Về cơ bản, những gì nó làm là tính toán màu sắc cuối cùng của một pixel và sau đó gửi nó vào bộ nhớ đệm màu (color buffer).</p>

          <div class="lesson-fig">
            <div class="fig-placeholder">
              <span class="fig-placeholder-icon">🖼️</span>
              <span class="fig-placeholder-text">Yêu cầu ảnh: Fig. 1.1.1a</span>
              <span class="fig-placeholder-path">assets/ch1/fig_1_1_1a.png</span>
            </div>
            <figcaption>Hình 1.1.1a: Vùng diện tích bị che phủ bởi hình học (geometry) sẽ được chuyển đổi thành điểm ảnh (pixels) trên màn hình.</figcaption>
          </div>

          <h2 id="1.1.2">1.1.2. Types of render pipeline</h2>
          <p>Như chúng ta đã biết, có ba loại render pipelines trong Unity. Theo mặc định, chúng ta có <strong>Built-in RP</strong>, loại engine lâu đời nhất thuộc về phần mềm. Mặt khác, <strong>Universal RP</strong> và <strong>High Definition RP</strong> thuộc về một loại render pipeline được gọi là <strong>Scriptable RP</strong>, bản cập nhật hiện đại và đã được tối ưu hóa sẵn từ đầu để có hiệu suất đồ họa tốt hơn.</p>
          
          <div class="lesson-fig">
            <div class="fig-placeholder">
              <span class="fig-placeholder-icon">🖼️</span>
              <span class="fig-placeholder-text">Yêu cầu ảnh: Fig. 1.1.2a</span>
              <span class="fig-placeholder-path">assets/ch1/fig_1_1_2a.png</span>
            </div>
            <figcaption>Hình 1.1.2a: Khi tạo một dự án mới trong Unity, chúng ta có thể chọn giữa ba rendering engines này. Sự lựa chọn phụ thuộc vào nhu cầu của dự án hiện tại.</figcaption>
          </div>

          <p>Bất kể loại rendering pipeline nào, nếu chúng ta muốn tạo ra một hình ảnh trên màn hình, chúng ta phải đi dọc theo "pipeline".</p>
          <p>Một pipeline có thể có các đường dẫn xử lý khác nhau. Chúng được biết đến là <strong>render paths</strong>; giống như đường ống Mario lấy ví dụ ở phần 1.0.7 có nhiều hơn một cách để đến đích.</p>
          <p>Một <strong>rendering path</strong> tương ứng với một chuỗi các thao tác liên quan đến việc chiếu sáng (lighting) và đổ bóng (shading) cho các đối tượng. Điều này cho phép chúng ta xử lý đồ họa cho một scene được chiếu sáng (ví dụ: một scene có ánh sáng định hướng directional light và một hình Cầu).</p>
          <p>Các ví dụ về những paths này là <strong>forward rendering, deferred shading, legacy deferred</strong> và <strong>legacy vertex lit</strong>. Mỗi loại có khả năng và đặc điểm hiệu năng khác nhau.</p>
          <p>Trong Unity, rendering path mặc định tương ứng với <strong>forward rendering</strong>; đây là con đường ban đầu chung cho cả ba loại pipeline render được đưa vào Unity. Đó là vì nó có khả năng tương thích card đồ họa lớn hơn và có giới hạn tính toán ánh sáng, làm cho quy trình này tối ưu hơn.</p>
          <p>Lưu ý rằng trong <strong>Universal RP</strong>, chúng ta chỉ có thể sử dụng <strong>forward</strong> làm rendering path, trong khi đó <strong>High Definition RP</strong> lại cho phép render các vật liệu được rọi sáng bằng cách sử dụng cả <strong>forward</strong> hoặc <strong>deferred shading</strong>.</p>

          <div class="lesson-fig">
            <div class="fig-placeholder">
              <span class="fig-placeholder-icon">🖼️</span>
              <span class="fig-placeholder-text">Yêu cầu ảnh: Fig. 1.1.2b</span>
              <span class="fig-placeholder-path">assets/ch1/fig_1_1_2b.png</span>
            </div>
            <figcaption>Hình 1.1.2b: Để chọn một rendering path trong Built-in Render Pipeline, chúng ta vào thẻ Hierarchy, chọn camera chính và nhìn vào thuộc tính "Rendering Path" để thay đổi.</figcaption>
          </div>

          <p>Để dễ hiểu khái niệm này, chúng ta giả sử trong scene đang có một đối tượng ("object") và một ánh sáng trực tiếp ("direct light"). Sự tương tác giữa ánh sáng và đối tượng căn cứ trên hai yếu tố:</p>
          <ol>
            <li>Đặc tính ánh sáng (Lighting characteristics).</li>
            <li>Đặc tính vật liệu (Material characteristics).</li>
          </ol>
          <p>Sự tương tác giữa hai yếu tố này được gọi là <strong>lighting model</strong> (mô hình chiếu sáng).</p>
          <p>Lighting model cơ bản tương ứng với tổng cộng của ba thuộc tính khác nhau, bao gồm: <strong>ambient color</strong> (màu môi trường), <strong>diffuse reflection</strong> (phản xạ khuếch tán) và <strong>specular reflection</strong> (phản xạ gương).</p>
          <p>Việc tính toán ánh sáng (lighting calculation) được thực hiện bên trong shader, có thể thông qua hình thức gọi là per-vertex hoặc qua per-fragment. Khi ánh sáng được tính toán trên điểm đỉnh nó được gọi là <strong>per-vertex lighting</strong> và thực hiện trong <strong>vertex shader stage</strong>. Tương tự, nếu tính toán trên từng vùng đoạn nó được gọi là <strong>per-fragment</strong> hoặc <strong>per-pixel shader</strong> và được thực thi tại <strong>fragment shader stage</strong>.</p>

          <h2 id="1.1.3">1.1.3. Forward rendering</h2>
          <p><strong>Forward</strong> là rendering path mặc định và hỗ trợ tất cả các tính năng điển hình của một vật liệu (ví dụ: normal maps, pixel lighting, bóng đổ - shadows, v.v.). Rendering path này có hai passes mã code riêng biệt mà chúng ta có thể sử dụng trong shader của mình: đầu tiên là <strong>base pass</strong> (pass cơ sở) và thứ hai là <strong>additional pass</strong> (pass bổ sung).</p>
          <p>Trong <strong>base pass</strong>, chúng ta có thể định nghĩa light mode là <strong>ForwardBase</strong> và trong <strong>additional pass</strong>, chúng ta có thể định nghĩa light mode là <strong>ForwardAdd</strong>. Cả hai đều là các functions đặc trưng của một shader có tính toán ánh sáng (lighting calculation). Base pass có thể xử lý ánh sáng định hướng (directional light) theo từng pixel (per-pixel) và sẽ sử dụng ánh sáng sáng nhất nếu có nhiều directional lights trong scene. Ngoài ra, base pass có thể xử lý light probes, global illumination (chiếu sáng toàn cục) và ambient illumination (ánh sáng môi trường - skylight).</p>
          <p>Đúng như tên gọi của nó, <strong>additional pass</strong> có thể xử lý các "ánh sáng bổ sung" (additional lights) theo từng pixel hoặc cả bóng đổ (shadows) tác động lên đối tượng. Điều này có nghĩa là gì? Nếu chúng ta có hai nguồn sáng trong scene, đối tượng của chúng ta sẽ chỉ bị ảnh hưởng bởi MỘT trong số chúng, tuy nhiên, nếu chúng ta đã định nghĩa một additional pass cho cấu hình này, thì nó sẽ bị ảnh hưởng bởi CẢ HAI.</p>
          <p>Một điểm mà chúng ta phải cân nhắc là mỗi pass được chiếu sáng sẽ tạo ra một <strong>draw call</strong> riêng biệt. Một <strong>draw call</strong> là một lệnh gọi đồ họa (call graphic) được thực hiện trong GPU mỗi khi chúng ta muốn vẽ một phần tử lên màn hình máy tính. Những lời gọi này là các tiến trình yêu cầu một lượng lớn tính toán, vì vậy chúng cần được giữ ở mức tối thiểu có thể, thậm chí còn cần hạn chế hơn nữa nếu chúng ta đang làm việc trên các dự án dành cho thiết bị di động (mobile devices).</p>
          <p>Để hiểu khái niệm này, chúng ta sẽ giả sử có 4 hình Cầu (Spheres) và 1 đèn trực tiếp (directional light) trong scene. Bản chất của mỗi hình Cầu sẽ tạo ra một lệnh gọi tới GPU, điều này có nghĩa mỗi hình Cầu sẽ tạo ra một draw call độc lập theo mặc định.</p>
          <p>Tương tự, directional light tác động lên tất cả hình Cầu có mặt trong scene, do đó, nó sẽ tạo ra thêm một draw call bổ sung cho mỗi hình Cầu. Điều này chủ yếu là do một pass thứ hai đã được đưa vào shader để tính toán việc chiếu bóng (shadow projection). Vì vậy, 4 hình Cầu cộng với 1 nguồn sáng directional light sẽ tạo ra tổng cộng 8 draw calls.</p>

          <div class="lesson-fig">
            <div class="fig-placeholder">
              <span class="fig-placeholder-icon">🖼️</span>
              <span class="fig-placeholder-text">Yêu cầu ảnh: Fig. 1.1.3a</span>
              <span class="fig-placeholder-path">assets/ch1/fig_1_1_3a.png</span>
            </div>
            <figcaption>Hình 1.1.3a: Ở ảnh trên, chúng ta có thể thấy sự gia tăng các draw calls khi có sự xuất hiện của nguồn sáng. Phép tính bao gồm màu môi trường (ambient color) và nguồn sáng làm đối tượng.</figcaption>
          </div>

          <p>Sau khi đã xác định base pass, nếu chúng ta thêm một pass khác vào shader của mình, thì chúng ta sẽ thêm một draw call mới cho mỗi đối tượng, và kết quả là tải đồ họa (graphic load) sẽ tăng lên đáng kể.</p>
          <p>Có một số cách để tối ưu hóa quá trình này, mà chúng ta sẽ nói về nó sau trong cuốn sách. Còn bây giờ, chúng ta sẽ tiếp tục với khái niệm rendering path.</p>

          <h2 id="1.1.4">1.1.4. Deferred shading</h2>
          <p>Rendering path này đảm bảo rằng chỉ có MỘT lighting pass duy nhất để tính toán mỗi nguồn sáng (light source) trong scene của chúng ta, và chỉ tính trên những pixels thực sự bị ảnh hưởng bởi nguồn sáng đó, tất cả thông qua việc tách rạch ròi giữa phần hình học (geometry) và ánh sáng (lighting). Đây là một ưu thế, vì chúng ta có thể tạo ra một khối lượng ánh sáng đáng kể tác động lên nhiều vật thể khác nhau, qua đó cải thiện độ chân thực của thẻ render cuối cùng, nhưng bù lại phải đánh đổi bằng cách gia tăng tính toán (per-pixel calculation) trên GPU.</p>
          <p>Mặc dù <strong>Deferred Shading</strong> vượt trội hơn hẳn so với <strong>Forward</strong> khi tính toán trên môi trường nhiều nguồn sáng, nó lại mang theo một số hạn chế về khả năng tương thích phần cứng và sự cố (hardware compatibility restrictions and issues).</p>

          <h2 id="1.1.5">1.1.5. What rendering engine should I use?</h2>
          <p>Đây là một câu hỏi rất phổ biến và lặp đi lặp lại trong thời gian gần đây.</p>
          <p>Trước đây, chỉ có sự tồn tại của <strong>Built-in RP</strong>, vì vậy rất dễ dàng để bắt đầu một dự án, dù là 2D hay 3D. Tuy nhiên, ngày nay, chúng ta phải khởi tạo video game của mình tùy theo nhu cầu của nó, vì vậy chúng ta có thể tự hỏi, làm sao để biết dự án của mình cần gì? Để trả lời câu hỏi này, chúng ta phải xem xét các yếu tố sau:</p>
          <ol>
            <li>Nếu chúng ta định phát triển một video game cho PC, chúng ta có thể sử dụng bất kỳ render pipeline nào trong ba loại có sẵn của Unity vì thông thường, PC có sức mạnh tính toán lớn hơn so với thiết bị di động (mobile device) hay thậm chí là giao diện điều khiển (console). Do đó, nếu video game của chúng ta dành cho PC, chúng ta có cần nó được hiển thị đồ họa ở độ sắc nét cao (high definition) hay trung bình (medium definition) không? Trong trường hợp chúng ta yêu cầu video game hiển thị độ nét siêu cao, chúng ta có thể tạo nó trên cả <strong>High Definition RP</strong> và <strong>Built-in RP</strong>.</li>
            <li>Nếu chúng ta muốn video game của mình đạt hình ảnh đồ họa ở mức trung bình, chúng ta có thể sử dụng <strong>Universal RP</strong> hoặc như trường hợp trước; <strong>Built-in RP</strong>. Vậy, tại sao <strong>Built-in RP</strong> lại là một tùy chọn tối ưu trong cả hai trường hợp?</li>
          </ol>
          <p>Không giống như các pipelines khác, rendering pipeline <strong>Built-in RP</strong> hiện diện linh hoạt hơn rất nhiều, do đó, nó mang nặng tính kỹ thuật và không được "tối ưu hóa sẵn" (pre-optimization). <strong>High Definition RP</strong> đã được thiết lập sẵn quy chuẩn để tạo ra đồ họa cấu hình cao (high-end graphics) và <strong>Universal RP</strong> được định hướng tối ưu cho đồ họa tầm trung.</p>
          <p>Một yếu tố quan trọng khác khi chọn render pipeline của chúng ta chính là các shaders. Nói chung, trong cả <strong>High Definition RP</strong> và <strong>Universal RP</strong>, các shaders được tạo ra thông qua <strong>Shader Graph</strong>. Đây là một gói dịch vụ bao gồm một giao diện cho phép chúng ta thiết lập shader bằng việc nối các chuỗi nodes, điều này có cả mặt tích cực lẫn tiêu cực. Về mặt tích cực, chúng ta có thể tạo shaders một cách trực quan, thoải mái thông qua các nodes mà không cần viết mã (code) bằng ngôn ngữ HLSL. Tuy nhiên, mặt khác, nếu chúng ta cập nhật file dự án Unity của mình lên phiên bản mới hơn trên khâu sản xuất (ví dụ: từ 2019 lên 2020), các shaders đó rất có thể sẽ không thể biên dịch (compile) được nữa vì Shader Graph sở hữu các phiên bản cập nhật hoàn toàn độc lập với phiên bản gốc của Unity.</p>
          <p>Cách tốt nhất để tạo ra shaders trong Unity là thông qua ngôn ngữ <strong>HLSL</strong>, vì bằng phương pháp thủ công này, chúng ta có thể bảo đảm rằng chương trình của mình biên dịch mượt mà không phân biệt loại render pipelines đồng thời tiếp tục hoạt động bất chấp Unity có nâng cấp lên thế nào đi chăng nữa. Về sau bài này, chúng ta sẽ đi sâu vào việc tìm hiểu cấu trúc hệ thống của một chương trình lập trình gốc bằng <strong>HLSL</strong>.</p>

          <h2 id="1.1.6">1.1.6. Matrices & Coordinate Systems</h2>
          <p>Trong Unity, chúng ta thường dùng ma trận <strong>4x4</strong>. Biến <strong>W</strong> trong vector XYZW có ý nghĩa: 1 là điểm (Point), 0 là hướng (Direction).</p>
`;
