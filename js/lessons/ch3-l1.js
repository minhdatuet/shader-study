window.ShaderStudy = window.ShaderStudy || {};
window.ShaderStudy.Theory = window.ShaderStudy.Theory || {};
window.ShaderStudy.Theory["ch3-l1"] = `
          <h2 id="3.0.1">3.0.1. Structure of a vertex / fragment shader</h2>
          <p>Để phân tích cấu trúc của nó, chúng ta sẽ tạo ra một Unlit Shader và đặt tên cho nó là "<code>USB_simple_color</code>". Như chúng ta đã biết, loại shader này là một mô hình màu sắc cơ bản (basic color model) và không có sự tối ưu hóa sâu trong mã code của nó, chính điều này sẽ cho phép chúng ta phân tích chuyên sâu các thuộc tính và chức năng đa dạng của nó.</p>
          <p>Khi chúng ta khởi tạo một shader lần đầu tiên, Unity tự động thêm một đoạn code mặc định để tạo điều kiện thuận lợi cho quá trình biên dịch của nó. Bên trong chương trình, chúng ta có thể tìm thấy các khối block mã code được cấu trúc theo một phương thức nhất định sao cho GPU có thể diễn dịch hiểu được chúng. Nếu chúng ta mở file shader <code>USB_simple_color</code> của mình, cấu trúc của nó sẽ trông như thế này:</p>

          <pre><code>Shader "Unlit/USB_simple_color"
{
  Properties
  {
      _MainTex ("Texture", 2D) = "white" {}
  }
  SubShader
  {
      Tags {"RenderType"="Opaque"}
      LOD 100
      Pass
      {
          CGPROGRAM
          #pragma vertex vert
          #pragma fragment frag
          // make fog work
          #pragma multi_compile_fog
          #include "UnityCG.cginc"
          
          struct appdata
          {
              float4 vertex : POSITION;
              float2 uv : TEXCOORD0;
          };

          struct v2f
          {
              float2 uv : TEXCOORD0;
              UNITY_FOG_COORDS(1)
              float4 vertex : SV_POSITION;
          };

          sampler2D _MainTex;
          float4 _MainTex_ST; // [Chú thích từ AI: Bổ sung biến _ST bị thiếu trong nguyên gốc để macro TRANSFORM_TEX hoạt động]

          v2f vert (appdata v)
          {
              v2f o;
              o.vertex = UnityObjectToClipPos(v.vertex);
              o.uv = TRANSFORM_TEX(v.uv, _MainTex);
              UNITY_TRANSFER_FOG(o, o.vertex);
              return o;
          }

          fixed4 frag (v2f i) : SV_Target
          {
              // sample the texture
              fixed4 col = tex2D(_MainTex, i.uv);
              // apply fog
              UNITY_APPLY_FOG(i.fogCoord, col);
              return col;
          }
          ENDCG
      }
  }
}</code></pre>

          <p>Có khả năng cao là ở thời điểm này, chúng ta chưa thể hiểu trọn vẹn những gì đang diễn ra trong các blocks code khác nhau cất giấu từ file shader mà ta vừa tạo. Tuy nhiên, để bắt đầu hành trình học tập, trước tiên chúng ta sẽ chỉ tập trung vào ngắm nhìn cấu trúc tổng quát của nó.</p>

          <pre><code>Shader "InspectorPath/shaderName"
{
  Properties
  {
      // properties in this field
  }
  SubShader
  {
      // SubShader configuration in this field
      Pass
      {
          CGPROGRAM
          // chương trình Cg - HLSL nhồi vào khoảng không này
          ENDCG
      }
  }
  Fallback "ExampleOtherShader"
}</code></pre>

          <p>(Cấu trúc dàn ý shader là y hệt nhau cho cả Cg và HLSL, thứ duy nhất thay đổi là các khối programs ở trong Cg và HLSL. Cả hai đều biên dịch trơn tru trong các phiên bản phần mềm hiện hành của Unity vì mục đích tương thích qua lại)</p>
          <p>Ví dụ phía trên cho thấy cấu trúc lõi móng cốt của một shader. Bất kỳ Shader nào cũng khai mạc bằng một đường dẫn hiển thị ảo trên thanh inspector (<code>InspectorPath</code>) và một cái tên (<code>shaderName</code>), ngay sau đó là khối properties (ví dụ: chứa các textures, vectors, colors, v.v.), kế tiếp chính là ngai vàng của SubShader và tọa lạc sâu thẳm dưới đáy cùng ở cuối của tất cả mọi thứ là sự xuất hiện tùy chọn của cụm <strong>Fallback</strong>.</p>
          <p>"<code>InspectorPath</code>" ám chỉ vị trí cấu trúc thư mục ảo nơi mà chúng ta nhấp chuột chọn file shader của mình để áp dụng nó dính sát vào một vật liệu (material) nào đó. Việc lựa chọn này được thực thi thông qua bảng Unity Inspector.</p>
          <p>Chúng ta phải nằm lòng thuộc ghi nhớ rằng chúng ta KHÔNG THỂ áp dụng trực tiếp một tệp shader lên thẳng bề mặt một polygonal object, thay vì thế, tiến trình này buộc phải được thông quan qua ngõ của một vật liệu (material) đã được tạo lập từ trước. Trở lại file <code>USB_simple_color</code> shader của chúng ta, nó mang một đường dẫn "<code>Unlit</code>" theo như mặc định, điều này nôm na là: từ cửa sổ chính Unity, chúng ta bắt buộc phải chọn lấy material của mình, di chuyển ánh nhìn sang bảng inspector, lướt tìm đường menu gốc <code>Unlit</code> và nhấp nhả áp dụng shader có cái tên `USB_simple_color`.</p>
          <p>Một tham số cấu trúc mang tính bản lề khác mà chúng ta vô cùng cần khắc cốt ghi tâm về sau đó là GPU sẽ đọc thông chương trình theo chiều <strong>từ trên xuống dưới một cách tuyến tính (linearly)</strong>; vì hệ quả đó, nếu một ngày đẹp trời chúng ta tự tạo ra một function và xui xẻo đặt lọt thỏm vị trí của nó ngay bên thấp dưới khối code block nơi mà nó dự kiến được gọi lên sử dụng, GPU sẽ tối tăm mặt mũi hoàn toàn không thể đọc hiểu được nó, sinh ra muôn vàn lỗi biên dịch (error) trong quá trình xử lý shader (shader processing), buộc lòng Fallback sẽ phải gán vội một file shader khác (nếu có) để nền tảng phần cứng đồ họa tiếp tục được quá trình render giả lập của mình.</p>
          <p>Hãy cùng chiêm nghiệm thử qua bài tập sau dưới đây để thấu hiểu rõ tính chất khái niệm khắc nghiệt này.</p>

          <pre><code>// 1. Khai báo (Declare) function của chúng ta trước
float4 ourFunction()
{
    // Các logic mã nguồn (your code) đặt tại đây...
}

// 2. Chúng ta MỚI GỌI sử dụng function này sau
fixed4 frag (v2f i) : SV_Target
{
    // Chúng ta gọi xài function ngay tại đây
    float4 f = ourFunction();
    return f;
}</code></pre>

          <p>Ngữ pháp (syntax) của các khối functions ở bên trên có thể chưa được bạn hiểu thấu hoàn toàn lúc này. Chúng chỉ được vẽ ra thuần túy với mục đích nhằm khái niệm hóa (conceptualize) vị trí sinh tử chiến thuật của một loại function đứng lên trên cái lệnh khác trọn đời phục tùng nó.</p>
          <p>Trong mục 4.0.4 sắp tới chúng ta sẽ lại gặp nhau nói cặn kẽ về cấu trúc xương sườn chi tiết đằng sau một function. Còn hiện tại, bài học xương máu quan trọng nhất là phải hiểu ví dụ phía trên có cấu trúc cú pháp xếp hạng logic hoàn hảo chuẩn xác, vì lẽ function "<code>ourFunction</code>" đã ngoan ngoãn được lôi ra chắp bút đệm trước định hướng sẵn nơi mà khối block code phía dưới cần tới sự phục vụ của nó. Trong quá trình GPU càn quét, nó sẽ luôn luôn tiên phong đọc nạp bộ não function "<code>ourFunction</code>" vô thanh RAM trước sau đó nó mới nối gót đi xuống thâm nhập tiếp vào giai đoạn càn vùng fragment mang danh tên gọi là "<code>frag</code>".</p>
          <p>Mặt khác giáp mặt lá cà, hãy thử cùng nghía qua lăng kính đối lập vào một trường hợp bốc mùi thảm họa sau.</p>

          <pre><code>// 2. Lấy gọi ra sử dụng function NGAY LIỀN và ĐỊA LÝ DÒNG TRÊN TỚI
fixed4 frag (v2f i) : SV_Target
{
    // Chúng ta lôi function của ta ra đây để xài
    float4 f = ourFunction();
    return f;
}

// 1. Nhưng Khai báo bản thể function thì lại CHẬM CHẠP NẰM DƯỚI ĐÂY
float4 ourFunction()
{
    // Code logic bị vứt ở đây...
}</code></pre>

          <p>Trái ngược mồn một, hệ cấu trúc đi ngược với lẽ tạo hóa này hứa hẹn chắc ăn sẽ phun trả về ngay tắp lự một dòng báo "lỗi" (error), ngỡ ngàng chỉ vì mảng function đại diện bằng cái tên "<code>ourFunction</code>" bất thình lình đã bị bạn đè ấn viết chui thấp dưới ranh giới trần của cụm code block dòng thứ nguồn cội nơi mới là kẻ sinh mệnh phán xét có lôi và lấy máu định dùng đến gọi năng lực từ nó.</p>
          <h2 id="3.0.3">3.0.3. ShaderLab Properties</h2>
          <p>Cú pháp: <code>_Name ("Display Name", Type) = DefaultValue</code>. KHÔNG dùng dấu chấm phẩy (;) trong khối này.</p>
          <h2 id="3.0.8">3.0.8. MPD Toggle</h2>
          <p>Dùng <code>[Toggle]</code> với <code>#pragma shader_feature</code>. Hằng số trong code sẽ có hậu tố <code>_ON</code>.</p>
`;
