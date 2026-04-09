window.ShaderStudy = window.ShaderStudy || {};
window.ShaderStudy.Theory = window.ShaderStudy.Theory || {};
window.ShaderStudy.Theory["ch3-l1"] = `
          <h2 id="3.0.1">3.0.1. Structure of a vertex / fragment shader</h2>
          <p>Để phân tích cấu trúc của nó, chúng ta sẽ tạo một Unlit Shader và gọi nó là "<code>USB_simple_color</code>". Như chúng ta đã biết, loại shader này là một mô hình màu sắc cơ bản và không có sự tối ưu hóa lớn trong mã code của nó, điều này sẽ cho phép chúng ta phân tích chuyên sâu các thuộc tính và chức năng khác nhau của nó.</p>
          <p>Khi chúng ta tạo một shader lần đầu tiên, Unity thêm mã mặc định để tạo điều kiện thuận lợi cho quá trình biên dịch của nó. Bên trong chương trình, chúng ta có thể tìm thấy các khối mã được cấu trúc theo cách mà GPU có thể diễn dịch chúng. Nếu chúng ta mở shader <code>USB_simple_color</code> của mình, cấu trúc của nó sẽ trông như thế này:</p>

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

          <p>Rất có thể ở thời điểm này chúng ta không hiểu những gì đang xảy ra bên trong các khối mã khác nhau của shader mà chúng ta vừa tạo. Tuy nhiên, để bắt đầu, trước tiên chúng ta sẽ tập trung vào cấu trúc tổng quát của nó.</p>

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

          <p>(Cấu trúc là giống nhau cho cả Cg và HLSL, điều duy nhất thay đổi là các khối nơi các chương trình được viết. Cả hai đều biên dịch không có vấn đề trong các phiên bản Unity hiện tại vì mục đích tương thích).</p>
          <p>Ví dụ trước cho thấy cấu trúc chung của một shader. Bất kỳ shader nào cũng bắt đầu bằng một đường dẫn inspector và một cái tên, theo sau là các thuộc tính (properties) (ví dụ: textures, vectors, colors, v.v.), sau đó là SubShader và cuối cùng là Fallback.</p>
          <p>"<code>InspectorPath</code>" đề cập đến vị trí mà chúng ta chọn shader của mình để áp dụng nó cho một material từ Unity inspector.</p>
          <p>Chúng ta phải nhớ rằng chúng ta không thể áp dụng một shader trực tiếp cho một đối tượng đa giác (polygonal object), do đó, chúng ta phải áp dụng nó cho một material. Shader <code>USB_simple_color</code> của chúng ta có một đường dẫn "Unlit" theo mặc định, điều này có nghĩa là từ Unity, chúng ta phải chọn material của mình, di chuyển tới inspector, tìm kiếm Unlit và chọn <code>USB_simple_color</code>.</p>
          <p>Một tham số khác mà chúng ta phải xem xét từ nay về sau là GPU đọc chương trình tuyến tính từ trên xuống dưới; do đó, nếu chúng ta tạo một hàm (function) và đặt nó dưới khối mã nơi nó sẽ được gọi, GPU sẽ không thể đọc được nó và tạo ra các lỗi biên dịch, gán một shader khác cho material trong quá trình Fallback để phần cứng đồ họa có thể tiếp tục với quá trình render.</p>
          <p>Hãy xem một ví dụ bên dưới để hiểu khái niệm này.</p>

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

          <p>Chúng ta có thể chưa hiểu cú pháp hàm một cách hoàn hảo. Chúng ta khái niệm hóa vị trí của nó chỉ cho mục đích làm ví dụ.</p>
          <p>Chúng ta sẽ ôn lại cấu trúc của một hàm một cách chi tiết trong mục 4.0.4. Điều quan trọng về ví dụ trước là hàm "<code>ourFunction</code>" đã được khai báo trước khối mã cần đến nó. Trong quá trình đọc của GPU, nó sẽ tải hàm <code>ourFunction</code> vào bộ nhớ của nó trước và sau đó nó sẽ thực thi giai đoạn fragment "<code>frag</code>".</p>
          <p>Ngược lại, hãy quan sát ví dụ sau:</p>

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

          <p>Cấu trúc này sẽ tạo ra một lỗi vì hàm "<code>ourFunction</code>" đã được viết dưới khối mã cần thuật toán từ nó.</p>
          <h2 id="3.0.2">3.0.2. ShaderLab shader</h2>
          <p>Hầu hết các shader của chúng ta được viết bằng code sẽ bắt đầu bằng việc khai báo Shader, sau đó là đường dẫn của nó trong Unity Inspector và cuối cùng là tên mà chúng ta gán cho nó (ví dụ: Shader "shader inspector path/shader name").</p>
          <p>Cả các properties cũng như thẻ SubShader và Fallback đều được viết bên trong trường "Shader" bằng ngôn ngữ khai báo ShaderLab.</p>

          <pre><code>Shader "InspectorPath/shaderName"
{
    // Viết toàn bộ mã gốc ShaderLab của bạn tại khúc này
}</code></pre>

          <p>Vì <code>USB_simple_color</code> đã được định danh là "<code>Unlit/USB_simple_color</code>" theo mặc định, nếu chúng ta muốn gán nó cho một material, thì chúng ta sẽ phải đi tới Unity Inspector, tìm đường dẫn Unlit và sau đó chọn "<code>USB_simple_color</code>".</p>
          <p>Cả đường dẫn và tên của shader đều có thể được thay đổi theo yêu cầu bởi việc sắp xếp dự án.</p>

          <pre><code>// 1. Phân bổ giá trị ban đầu cấu hình theo Default
Shader "Unlit/USB_simple_color"
{
    // Viết toàn bộ ShaderLab code tại khúc này
}

// 2. Chuyển sang giá trị đường dẫn được tủy chỉnh hóa (ví dụ trỏ về thư mục USB - Unity Shader Bible)
Shader "USB/USB_simple_color"
{
    // Viết toàn bộ ShaderLab code tại cục này
}</code></pre>

          <h2 id="3.0.3">3.0.3. ShaderLab properties</h2>
          <p>Các thuộc tính (properties) tương ứng với một danh sách các tham số (parameters) có thể được thao tác từ trình Unity inspector. Có tám thuộc tính khác nhau cả về giá trị và tính hữu dụng. Chúng ta sử dụng các thuộc tính này liên quan đến shader mà chúng ta muốn tạo hoặc sửa đổi, ở cả dạng động (dynamically) hoặc tại thời điểm chạy (runtime). Cú pháp để khai báo một property như sau:</p>

          <pre><code>PropertyName ("display name", type) = defaultValue</code></pre>

          <p>"<code>PropertyName</code>" đề cập đến tên của property (ví dụ: <code>_MainTex</code>), "<code>display name</code>" tương ứng với tên của property sẽ được hiển thị trong Unity inspector (ví dụ: <code>Texture</code>), "<code>type</code>" chỉ ra kiểu property (ví dụ: Color, Vector, 2D, v.v.) và cuối cùng, đúng như tên gọi của nó, "<code>defaultValue</code>" là giá trị mặc định được gán cho property (ví dụ: nếu property là một "Color" chúng ta có thể thiết lập cho nó thành màu trắng như sau <code>(1, 1, 1, 1)</code>).</p>
          
          <div class="lesson-fig">
            <div class="fig-placeholder">
              <span class="fig-placeholder-icon">🖼️</span>
              <span class="fig-placeholder-text">Yêu cầu ảnh: Fig. 3.0.3a</span>
              <span class="fig-placeholder-path">assets/ch3/fig_3_0_3a.png</span>
            </div>
            <figcaption>Hình 3.0.3a: Các cấu hình liên quan đến ShaderLab properties phô bày giao diện trên mặt Unity Inspector.</figcaption>
          </div>

          <p>Nếu chúng ta nhìn vào các properties của phần shader <code>USB_simple_color</code> của mình, chúng ta sẽ nhận thấy rằng có một texture property đã được khai báo bên trong trường này, chúng ta có thể làm rõ điều này trong dòng code sau.</p>

          <pre><code>Properties
{
    _MainTex ("Texture", 2D) = "white" {}
}</code></pre>

          <p>Một yếu tố cần xem xét là khi chúng ta khai báo một property, nó vẫn duy trì "mở" bên trong trường của các properties, do đó chúng ta phải tránh dấu chấm phẩy (<code>;</code>) ở cuối dòng code, nếu không GPU sẽ không thể đọc được chương trình.</p>

          <h2 id="3.0.4">3.0.4. Number and slider properties</h2>
          <p>Các loại properties này cho phép chúng ta thêm các giá trị số (numerical values) vào shader của mình. Giả sử rằng chúng muốn tạo một shader với các chức năng chiếu sáng (illumination), nơi "không" (zero) bằng 0% sự chiếu sáng và "một" (one) bằng 100% sự chiếu sáng. Chúng ta có thể tạo một phạm vi cho điều này (ví dụ: <code>Range(min, max)</code>) và định cấu hình các giá trị chiếu sáng tối thiểu, tối đa và mặc định.</p>
          <p>Cú pháp sau khai báo các con số và thanh trượt (slider) trong shader của chúng ta:</p>

          <pre><code>// name ("display name", Range(min, max)) = defaultValue
// name ("display name", Float) = defaultValue
// name ("display name", Int) = defaultValue

Shader "InspectorPath/shaderName"
{
    Properties
    {
        _Specular ("Specular", Range(0.0, 1.1)) = 0.3
        _Factor ("Color Factor", Float) = 0.3
        _Cid ("Color id", Int) = 2
    }
}</code></pre>

          <p>Trong ví dụ trước, chúng ta đã khai báo ba properties, một kiểu "phạm vi số thực" (floating range) gọi là <code>_Specular</code>, một kiểu "tỷ lệ số thực" (floating scale) khác gọi là <code>_Factor</code>, và cuối cùng, một kiểu "số nguyên" (integer) gọi là <code>_Cid</code>.</p>

          <h2 id="3.0.5">3.0.5. Color and vector properties</h2>
          <p>Với property này, chúng ta có thể định nghĩa các màu sắc và vector trong shader của mình.</p>
          <p>Chúng ta sẽ giả sử rằng chúng ta muốn tạo một shader có thể thay đổi màu sắc tại thời điểm chạy (execution time), cho điều này chúng ta sẽ phải thêm một color property nơi chúng ta có thể sửa đổi các giá trị RGBA của shader.</p>
          <p>Để khai báo các màu sắc và vector trong shader của chúng ta, hãy dùng cú pháp sau:</p>

          <pre><code>// name ("display name", Color) = (R, G, B, A)
// name ("display name", Vector) = (0, 0, 0, 1)

Shader "InspectorPath/shaderName"
{
    Properties
    {
        _Color ("Tint", Color) = (1, 1, 1, 1)
        _VPos ("Vertex Position", Vector) = (0, 0, 0, 1)
    }
}</code></pre>

          <p>Trong ví dụ trước này, chúng ta đã khai báo hai properties, một kiểu "color" gọi là <code>_Color</code> và một kiểu "vector" được gọi là <code>_VPos</code>.</p>
          <h2 id="3.0.6">3.0.6. Texture properties</h2>
          <p>Những properties này cho phép chúng ta thực thi các texture bên trong shader.</p>
          <p>Nếu chúng ta muốn đặt một texture lên đối tượng của mình (vd: một nhân vật 3D), thì chúng ta sẽ phải tạo một property 2D cho texture của nó và sau đó truyền nó qua một function gọi là "<code>tex2D</code>" cung cấp cho chúng ta hai luồng tham số: tham chiếu texture và tọa độ UV của đối tượng chúng ta.</p>
          <p>Một property mà chúng ta sẽ hay dùng thường xuyên trong các video games của mình là "<code>Cube</code>" đại diện thay thế cho một "Cubemap". Kiểu texture này khá hữu ích cho việc tạo bản đồ phản xạ (reflection maps), ví dụ, những hình ảnh phản chiếu trong áo giáp của nhân vật đồ họa hoặc cho những thành phần thuộc kim loại nói chung.</p>
          <p>Những kiểu texture khác mà chúng ta có thể bắt gặp là loại thể thức hệ <code>3D</code>. Chúng được sử dụng với tần suất ít hơn nhiều so với những loại trên vì lý do chúng có tính chất thể tích (volumetric) và bao hàm một kết cấu tọa độ bổ sung dành cho thao tác tính toán phỏng đoán hình học không gian (spatial calculation) của chúng.</p>
          <p>Cú pháp sau đây khai báo các loại textures trong shader của chúng ta:</p>

          <pre><code>// name ("display name", 2D) = "defaultColorTexture"
// name ("display name", Cube) = "defaultColorTexture"
// name ("display name", 3D) = "defaultColorTexture"

Shader "InspectorPath/shaderName"
{
    Properties
    {
        _MainTex ("Texture", 2D) = "white" {}
        _Reflection ("Reflection", Cube) = "black" {}
        _3DTexture ("3D Texture", 3D) = "white" {}
    }
}</code></pre>

          <p>Khi khai báo một property, rất quan trọng phải xem xét rằng nó sẽ được viết bằng ngôn ngữ khai báo ShaderLab trong khi chương trình của chúng ta sẽ được viết bằng ngôn ngữ Cg hoặc HLSL. Do chúng là hai ngôn ngữ khác nhau, chúng ta phải tạo các "biến kết nối" (connection variables).</p>
          <p>Các variables này được khai báo cục diện (globally) sử dụng từ "<code>uniform</code>", tuy nhiên, bước này có thể được bỏ qua vì chương trình nhận dạng chúng là các biến toàn cục. Vì vậy, để thêm một property vào "<code>.shader</code>", trước tiên chúng ta phải khai báo property trong ShaderLab, sau đó là biến toàn cục sử dụng cùng tên trong Cg hoặc HLSL, và cuối cùng chúng ta có thể sử dụng nó.</p>

          <pre><code>Shader "InspectorPath/shaderName"
{
    Properties
    {
        // 1. Phôi thai nặn định hình (declare) khởi tạo các properties ở đây
        _MainTex ("Texture", 2D) = "white" {}
        _Color ("Color", Color) = (1, 1, 1, 1)
    }
    SubShader
    {
        Pass
        {
            CGPROGRAM
            // ...
            
            // 2. Chèn móc các biến số ngầm làm cầu nối (connection variables) ở đây
            sampler2D _MainTex;
            float4 _Color;
            
            // ...
            
            half4 frag (v2f i) : SV_Target
            {
                // 3. Phép màu bắt đầu: Tự do lôi variables sử dụng nhào nặn trong đây
                half4 col = tex2D(_MainTex, i.uv);
                return col * _Color;
            }
            ENDCG
        }
    }
}</code></pre>

          <p>Trong ví dụ trước, chúng ta đã khai báo hai properties: <code>_MainTex</code> và <code>_Color</code>. Sau đó chúng ta đã tạo hai connection variables bên trong <code>CGPROGRAM</code>, những biến này tương ứng với "<code>sampler2D _MainTex</code>" và "<code>float4 _Color</code>". Cả property và connection variables đều phải có cùng tên để chương trình có thể nhận ra chúng.</p>
          <p>Trong mục 3.2.7, chúng ta sẽ chi tiết hoạt động của một bộ sampler 2D khi lưu trao đổi về các kiểu dữ liệu.</p>

          <h2 id="3.0.7">3.0.7. Material property drawer</h2>
          <p>Một loại property khác mà chúng ta có thể tìm thấy trong ShaderLab là "drawers". Lớp (class) này cho phép chúng ta tạo ra custom properties (các thuộc tính tùy chỉnh) trên Unity Inspector, nhờ đó tạo điều kiện thuận lợi cho việc lập trình rẽ nhánh điều kiện logic trong shader.</p>
          <p>Mặc định thì, thể thức loại property này không được đưa sẵn vào trong shader của chúng ta, thay thế vào đó, chúng ta phải khai báo chúng tùy theo nhu cầu của mình. Tới thời điểm hiện tại, có bảy drawer khác nhau:</p>
          <ul>
            <li><code>Toggle</code>.</li>
            <li><code>Enum</code>.</li>
            <li><code>KeywordEnum</code>.</li>
            <li><code>PowerSlider</code>.</li>
            <li><code>IntRange</code>.</li>
            <li><code>Space</code>.</li>
            <li><code>Header</code>.</li>
          </ul>
          <p>Mỗi cái đều có một hàm cụ thể và được khai báo một cách độc lập (independently).</p>
          <p>Nhờ có các property này, chúng ta có thể tạo ra nhiều trạng thái bên trong chương trình, cho phép tạo ra các hiệu ứng ứng động (dynamic effects) mà không cần phải thay đổi các vật liệu tại thời điểm thực thi (execution time).</p>
          <p>Chúng ta thường sử dụng các drawer này đi kèm với hai loại biến thể shader (shader variants), cụ thể là tham chiếu đến lệnh <code>#pragma multi_compile</code> và <code>#pragma shader_feature</code>.</p>
          
          <div class="lesson-fig">
            <div class="fig-placeholder">
              <span class="fig-placeholder-icon">🖼️</span>
              <span class="fig-placeholder-text">Yêu cầu ảnh: Fig. 3.0.7a</span>
              <span class="fig-placeholder-path">assets/ch3/fig_3_0_7a.png</span>
            </div>
            <figcaption>Hình 3.0.7a: Diện mạo Material property drawer phô bày ra ở khối Inspector.</figcaption>
          </div>

          <h2 id="3.0.8">3.0.8. MPD Toggle</h2>
          <p>Bên trong ShaderLab, chúng ta không thể sử dụng các thuộc tính kiểu boolean, thay vào đó, chúng ta có Toggle thực hiện chức năng tương tự. Nút bật (drawer) này sẽ cho phép chuyển đổi từ trạng thái này sang trạng thái khác bằng cách sử dụng một điều kiện bên trong shader của chúng ta. Để chạy nó, trước tiên chúng ta phải thêm từ <code>Toggle</code> vào trong dấu ngoặc vuông và sau đó khai báo thuộc tính của chúng ta, lưu ý rằng nó phải là kiểu Float. Giá trị mặc định của nó phải là một số nguyên, là 0 hoặc 1, tại sao? Vì 0 tượng trưng cho "Off" (Tắt) và 1 tượng trưng cho "On" (Bật).</p>
          <p>Cú pháp của nó như sau:</p>

          <pre><code>[Toggle] _PropertyName ("Display Name", Float) = 0</code></pre>

          <p>Như chúng ta thấy, chúng ta thêm <code>Toggle</code> trong ngoặc vuông, tiếp theo chúng ta khai báo thuộc tính, sau đó là tên hiển thị, theo sau là kiểu dữ liệu Float, và cuối cùng chúng ta khởi tạo thuộc tính này sang "Off" bằng cách thêm số 0 vào trong giá trị mặc định của nó.</p>
          <p>Một điều mà chúng ta phải cân nhắc khi làm việc với drawer này là, nếu chúng ta muốn thực thi nó trong mã code của mình, chúng ta sẽ phải sử dụng <code>#pragma shader_feature</code>. Điều này thuộc về các biến thể của shader (shader variants) và chức năng của nó là hoạt hóa các điều kiện khác nhau tùy thuộc vào trạng thái hiện tại của nó (được bật hoặc đã tắt). Để hiểu cách nó thực thi, chúng ta sẽ làm thao tác sau:</p>

          <pre><code>Shader "InspectorPath/shaderName"
{
    Properties
    {
        _Color ("Color", Color) = (1, 1, 1, 1)
        // khai báo thẻ Toggle
        [Toggle] _Enable ("Enable ?", Float) = 0
    }
    SubShader
    {
        Pass
        {
            CGPROGRAM
            // ...
            // khai báo pragma
            #pragma shader_feature _ENABLE_ON
            // ...
            float4 _Color;
            // ...
            
            half4 frag (v2f i) : SV_Target
            {
                half4 col = tex2D(_MainTex, i.uv);
                // tạo các điều kiện
                #if _ENABLE_ON
                    return col;
                #else
                    return col * _Color;
                #endif
            }
            ENDCG
        }
    }
}</code></pre>

          <p>Trong ví dụ này, chúng ta đã khai báo một thuộc tính kiểu <code>Toggle</code> có tên là "<code>_Enable</code>". Sau đó chúng ta thêm nó vào <code>shader_feature</code> nằm trong <code>CGPROGRAM</code>, tuy nhiên, trái với thuộc tính trong chương trình của chúng ta, Toggle đã được khai báo thành "<code>_ENABLE_ON</code>", tại sao lại như vậy? Các biến thể được thêm vào trong <code>shader_feature</code> là "các hằng số" (constants) do đó chúng được viết bằng chữ in hoa, có nghĩa là nếu, ví dụ, thuộc tính của chúng ta có tên là <code>_Change</code>, thì khi đưa vào biến thể shader nó nên được thêm dưới dạng "<code>_CHANGE_ON</code>". Từ <code>_ON</code> tương ứng với trạng thái mặc định của Toggle, vì vậy, nếu thuộc tính <code>_Enable</code> hoạt động, chúng ta trả về cấu hình màu texture trong công đoạn fragment shader, ngược lại chúng ta nhân thuộc tính <code>_Color</code> vào chính nó.</p>
          <p>Điều đáng nói là <code>shader_feature</code> không thể biên dịch nhiều biến thể cho một ứng dụng, điều này có nghĩa là như thế nào? Unity sẽ không bao gồm các biến thể mà chúng ta đang không sử dụng vào trong bản dựng kiểm tra cuối (final build), điều đồng nghĩa là chúng ta sẽ không thể chuyển từ trạng thái này sang định dạng trạng thái khác tại thời điểm thực thi (execution time). Để thực hiện việc này, chúng ta sẽ phải sử dụng loại KeywordEnum drawer mà có biến thể shader là "<code>multi_compile</code>".</p>

          <h2 id="3.0.9">3.0.9. MPD KeywordEnum</h2>
          <p>Drawer này tạo ra một dạng menu kiểu cửa sổ nổi (pop-up) trong material inspector. Không giống với Toggle, drawer này cho phép bạn định cấu hình lên tới 9 trạng thái khác nhau cho shader. Để thực thi nó, chúng ta phải ghi từ "<code>KeywordEnum</code>" trong dấu ngoặc vuông và sau đó liệt kê những trạng thái mà chúng ta dự định sẽ sử dụng.</p>

          <pre><code>[KeywordEnum(StateOff, State01, etc...)]
_PropertyName ("Display name", Float) = 0</code></pre>

          <p>Trong ví dụ phần trên, chúng ta thêm ngăn <code>KeywordEnum</code> trong ngoặc vuông, và sau đó chúng ta liệt kê tập trạng thái của nó, nơi mà tham số đầu khớp với cấu hình trạng thái ban đầu mặc định (StateOff). Tiếp tục với quá trình trình khai báo thuộc tính, gắn tên hiển thị trong bộ material inspector, cho kiểu dữ liệu Float của nó và sau cùng, lập tức lấy giá trị này cho giá trị thiết lập ban đầu mặc định.</p>
          <p>Để khai báo thẻ biến Drawer này ở bên trong đoạn code của chúng ta, chúng ta có thể sử dụng cả hai thẻ phương thức lệnh <code>shader_feature</code> hay là <code>multi_compile</code>. Sự thay đổi lựa chọn sẽ tùy vào thông số số lượng biến thể chúng ta định ghép nhét vào trong tập kịch bản cài đặt ứng dụng cuối cùng (final build).</p>
          <p>Như chúng ta đã nói qua, <code>shader_feature</code> sẽ chỉ có hoạt năng chịu xuất (export) qua duy nhất lựa chọn đã được người dùng trỏ vào từ phần material inspector, trong khi đó thuộc tính dạng rẽ <code>multi_compile</code> thì trích xuất ra toàn bộ những variants ngầm thấy trong nội tại bộ shader, chẳng thiết bỏ qua chúng có lấy mang thực thi được ứng dụng dùng làm gì hay có không. Tận dụng tính năng này, <code>multi_compile</code> thật lý tưởng cho việc trích xuất hay biên dịch nhiều nhóm thông số trạng thái sẽ đi tới thay đổi ở thời điểm thực thi execution time (ví dụ: đánh trạng thái nhận sao trong Super Mario).</p>
          <p>Và hiểu sâu áp dụng cho nó, chúng ta nên thực thi hoạt động tương tự sau:</p>

          <pre><code>Shader "InspectorPath/shaderName"
{
    Properties
    {
        // khai lệnh KeywordEnum
        [KeywordEnum(Off, Red, Blue)]
        _Options ("Color Options", Float) = 0
    }
    SubShader
    {
        Pass
        {
            CGPROGRAM
            // ...
            // định danh khai báo pragma và gắn nối điều kiện
            #pragma multi_compile _OPTIONS_OFF _OPTIONS_RED _OPTIONS_BLUE
            // ...
            
            half4 frag (v2f i) : SV_Target
            {
                half4 col = tex2D(_MainTex, i.uv);
                // thực thi các vòng conditions điều kiện
                #if _OPTIONS_OFF
                    return col;
                #elif _OPTIONS_RED
                    return col * float4(1, 0, 0, 1);
                #elif _OPTIONS_BLUE
                    return col * float4(0, 0, 1, 1);
                #endif
            }
            ENDCG
        }
    }
}</code></pre>

          <p>Tại khuôn ví dụ này, chúng ta định nghĩa mảng một thuộc tính thẻ phân khúc KeywordEnum có dạng "<code>_Options</code>" rồi móc đặt lên bộ thông số cấu hình 3 biến trạng thái nhận sẵn (Off, Red và kèm thẻ Blue). Trong một thời điểm trễ hơn, chúng ta dĩ nhiên gắn chúng gá vào cấu trúc nhóm mở <code>multi_compile</code> tìm được trong phạm vị CGPROGRAM kèm khai báo chúng dạng như constant constants.</p>

          <pre><code>#pragma multi_compile _OPTIONS_OFF _OPTIONS_RED _OPTIONS_BLUE</code></pre>

          <p>Kết liễu chốt, sử dụng tiếp mạch móc lặp móc điều kiện, chúng ta định dạng nên ba mảng trạng thái chạy thông vào khuôn shader để trả lời cho chuyển đổi màu mảng bề mặt phủ chính.</p>

          <h2 id="3.1.0">3.1.0. MPD Enum</h2>
          <p>Drawer này cấu thành hết sức giống như cấu hình thẻ dạng KeywordEnum nhưng với sự phân định mấu chốt là nhánh này sở hữu thuộc tính phác họa được chức năng cặp chuyển tham số "giá trị/id (value/id)" trỏ như một tham số truyền biến (argument) và chuyển tiếp property này thẳng qua vào phía cho một câu lệnh (command) có mặt trong shader thực thi hòng cấu trúc đổi hướng sự vận hành thiết kế qua nền tảng trực tiếp (dynamically) nhảy nhận thẳng phản ứng tại màn hình inspector thông số.</p>
          <p>Cú pháp cấu trúc tổng quan nó bày ra như sau:</p>

          <pre><code>[Enum(value, id_00, value, id_01, etc … )]
_PropertyName ("Display Name", Float) = 0</code></pre>

          <p>Lớp biến dạng mã thông số Enums sẽ không khai mở cấu trúc móc bấu vào các đoạn gán dạng móc thẻ shader variants ra mà ngược là hoàn toàn trơ ra tự chúng thông hiểu ghi cấu hình lệnh qua command lệnh và function thôi. Cho quá trình tiếp thu mảng kiến thức implementation thiết lập này, chúng ta thử mảng ví dụ phía chi tiết bên dưới:</p>

          <pre><code>Shader "InspectorPath/shaderName"
{
    Properties
    {
        // khai báo thẻ Enum Drawer
        [Enum(Off, 0, Front, 1, Back, 2)]
        _Face ("Face Culling", Float) = 0
    }
    SubShader
    {
        // Ta cắm thẳng property này luồn làm 1 lệnh gọi cấu thành command
        Cull [_Face]
        
        Pass { /*...*/ }
    }
}</code></pre>

          <p>Chiếu qua hiện trạng ví dụ như phía trên sau đây, mình thực thi xuất khai báo định hình loại property mang nhãn là "<code>Enum</code>" gọi "<code>_Face</code>" và tụi mình truyền đi vào thông qua dạng thuộc thể argument các values: mốc Off nhét 0, Font thả giá 1, nhẫn Back nhận diện thẻ 2. Kế tiếp bẽ góc mảng đó mình ghim đi luồn property mảng này trỏ vào làm tham số lệnh móc cho một hiệu lệnh chữ rạch ròi "<code>Cull</code>" dải lượn có chôn giấu trong khối SubShader; thao tay thông qua mảng này, chúng ta vồ lấy tính linh đảo luân hồi hoán hình cho lật đối tượng object diện giao tiếp render trực diện bung màn trích xuất từ ngay ô chức năng quản diện thuộc tính material inspector. Bước qua mục số 3.2.1 về sau, chúng ta gặp gỡ lại điểm danh lôi kéo cạn kẽ con thuật chớp lệnh <code>Cull</code> này lên sàn soi thấu đáo.</p>
`;
