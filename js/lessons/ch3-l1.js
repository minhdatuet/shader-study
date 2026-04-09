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
          <p>Chúng ta phải nằm lòng thuộc ghi nhớ rằng chúng ta KHÔNG THỂ áp dụng trực tiếp một tệp shader lên thẳng bề mặt một polygonal object, thay vì thế, tiến trình này buộc phải được thông quan qua ngõ của một vật liệu (material) đã được tạo lập từ trước. Trở lại file <code>USB_simple_color</code> shader của chúng ta, nó mang một đường dẫn "<code>Unlit</code>" theo như mặc định, điều này nôm na là: từ cửa sổ chính Unity, chúng ta bắt buộc phải chọn lấy material của mình, di chuyển ánh nhìn sang bảng inspector, lướt tìm đường menu gốc <code>Unlit</code> và nhấp nhả áp dụng shader có cái tên <code>USB_simple_color</code>.</p>
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
          <h2 id="3.0.2">3.0.2. ShaderLab shader</h2>
          <p>Phần lớn các shaders của chúng ta một khi được viết vào thành một mã code thì chúng luôn luôn phải ưu tiên xuất phát điểm bằng sự khai báo thành phần <strong>Shader</strong> đầu tiên, tiếp theo sau đó mới là thông số <strong>đường dẫn</strong> (path) ảo của nó trên thanh Unity Inspector và chốt sổ bằng cái tên (name) cuối cùng mà chúng ta tùy chọn gán ghép cho nó (ví dụ cấu trúc: <code>Shader "đường dẫn ảo trên thanh inspector/cặp tên shader"</code>).</p>
          <p>Cả những thứ như là cụm properties, khối đồ sộ SubShader và cả tảng Fallback cũng đều sẽ được nhồi nhét nằm lọt thỏm chung bên trong duy nhất một giới hạn trường không gian "Shader" thiết lập thông qua ngôn ngữ khai báo độc quyền ShaderLab.</p>

          <pre><code>Shader "InspectorPath/shaderName"
{
    // Viết toàn bộ mã gốc ShaderLab của bạn tại khúc này
}</code></pre>

          <p>Bởi vì file shader mẫu <code>USB_simple_color</code> của chúng ta đã được khai báo cài đặt sẵn tự động lấy đường dẫn tên gọi là "<code>Unlit/USB_simple_color</code>" theo như thiết lập mặc định, nay nếu chúng ta khởi phát ham muốn muốn dán áp dụng dính nó lên một khối vật liệu material nào đấy, thì khi đó chúng ta sẽ bắt buộc phải mò mẫm mở tới thanh Inspector, căng mắt tìm lùng sục nhánh đường dẫn tên là <code>Unlit</code> và cuối cùng click chọn vào đúng mục tiêu "<code>USB_simple_color</code>".</p>
          <p>Nói tóm lại, cả cái cụm đường dẫn ảo (path) lẫn cái tên hiển thị (name) của một tên shader đều hoàn toàn có thể bị thay đổi tự do biến dạng nhằm mục đích phục vụ chạy theo nhu cầu cơ cấu tổ chức thư mục thiết kế của bất kỳ dự án nào.</p>

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
          <p>Các <strong>properties</strong> (thuộc tính) thực chất tương ứng trỏ tới một danh sách trải dài điểm mặt các <strong>parameters</strong> (tham số) cấu hình mà chúng ta có toàn quyền can thiệp thao tác nhào nặn (manipulated) cấu hình trực tiếp từ bên ngoài thanh Unity inspector đồ họa. Tồn tại ngót nghét tới tận 8 kiểu loại properties không đụng hàng nhau chuyên được đặc trách phân bổ mang theo loại giá trị và tính hữu dụng riêng biệt. Chúng ta đè đầu lôi những properties ra vận dụng xoay quanh những shader mà chúng ta thèm muốn tạo khởi tạo hoặc tinh chỉnh, quá trình nhào nặn biến hóa này có thể áp dụng động (dynamically) ngay lập tức hoặc thậm chí diễn ra trực tuyến ngay khi trò chơi đang khởi chạy (runtime). Để phôi thai cú pháp (syntax) một thẻ property chúng ta tuân thủ nguyên lý ngữ pháp nền tảng như sau:</p>

          <pre><code>PropertyName ("display name", type) = defaultValue</code></pre>

          <p>Trong đó, "<code>PropertyName</code>" mang ý nghĩa đại diện để ám chỉ thẳng cái tên bí danh lập trình định tính (ví dụ: <code>_MainTex</code>). Dòng thành phần "<code>display name</code>" thì khớp rịt với cái tên nhãn dán thuộc tính trần trụi sẽ phô bày hiển thị ra trên mục bảng Unity inspector (ví dụ: <code>Texture</code>). Quay lại, thông số "<code>type</code>" giơ tay làm nhiệm vụ chỉ điểm mặt chủng loại kết cấu của cái property đó sẽ mang hình hài giống gì (ví dụ: là chuỗi màu sắc Color, hay tọa độ Vector, đồ họa 2D, v.v.). Và chốt trạm kết lại tại khúc đuôi, y boong như sự phản hồi ngay trong cái tên thân gọi của mình, thông điệp "<code>defaultValue</code>" được ngầm hiểu ngấm ngầm là khối giá trị được ấn định cấu hình mặc định (default value) dùng để gán cho hệ property đó (đơn cử ví dụ nhỏ: nếu kiểu mẫu property này được set là định dạng dải màu "Color" thì chúng ta có thể ấn định thiết lập quét cho nó một thanh trắng bóc trắng phau phau thông qua dải giá trị đồng điệu vầy <code>(1, 1, 1, 1)</code>).</p>
          
          <div class="lesson-fig">
            <div class="fig-placeholder">
              <span class="fig-placeholder-icon">🖼️</span>
              <span class="fig-placeholder-text">Yêu cầu ảnh: Fig. 3.0.3a</span>
              <span class="fig-placeholder-path">assets/ch3/fig_3_0_3a.png</span>
            </div>
            <figcaption>Hình 3.0.3a: Các cấu hình liên quan đến ShaderLab properties phô bày giao diện trên mặt Unity Inspector.</figcaption>
          </div>

          <p>Nếu chúng ta trừng mắt xẻ dọc soi xét cấu trúc biểu đồ các khối properties của con shader <code>USB_simple_color</code> cũ kỹ của chúng mình thì chúng ta sẽ nhìn tinh tường ra ngay rằng hiện diện đang nằm trong đó có chứa hẳn hoi một property gánh mảng texture vốn dĩ đã được bí mật khai báo từ đời thuở nào phía bên trong của khoảng không gian Properties, chúng ta dư sức gọi bằng chứng ra để chứng thực điều rành rành này ở block dòng mã code chường mặt ngay bên dưới.</p>

          <pre><code>Properties
{
    _MainTex ("Texture", 2D) = "white" {}
}</code></pre>

          <p>Kể tận cùng có một mệnh đề tối cao cấp thiết cần phải luôn luôn thấu đáo cân nhắc tạc nhớ đó là một khi chúng ta đẻ khai báo ra một loại mảng property, trạng thái của nó sẽ vĩnh viễn duy trì ở chu trình "cởi mở" (open) lơ lửng ngay bên phía trong mạn sườn trường tính năng thuộc tính của ShaderLab, hệ quả kéo theo sau cùng của sự thật ngang trái này là chúng ta buộc phải tìm cách lẩn trốn, cách ly <strong>TUYỆT ĐỐI TRÁNH SỬ DỤNG</strong> dấu chấm phẩy (<code>;</code>) nhằm mục đích chặn ngang kết hạn của dòng mã code trong phạm vi thuộc địa vùng code Block này, nếu chống chế làm ngược lại, hệ phần cứng phân tích GPU sẽ tức khắc chết đứng máy và hoàn toàn khước từ rũ bỏ không thể biên dịch xử lý đọc nổi cả khối chương trình shader đó.</p>

          <h2 id="3.0.4">3.0.4. Number and slider properties</h2>
          <p>Các kiểu loại thuộc tính (properties) thông dụng này có sứ mệnh ban quyền cho phép chúng ta nhồi nhét móc nối thêm các dải giá trị số học (numerical values) vào ngay bên trong não bộ shader. Thử đặt một sự giả định là chúng ta đang đau đáu tạo ra một shader nhúng chức năng ngậm phơi sáng (illumination), nơi quy ước hệ số "không" (zero) thì tương đương sức mạnh ánh sáng xập xệ ở mức 0% và hệ số trần "một" (one) thì vót tới đỉnh vinh quang sáng lóa 100%. Đáp lại, chúng ta được phép vẽ tạo ra một thanh trượt giá trị khống chế dao động biểu thị cho cái mảng này bằng mảng cú pháp <code>Range(min, max)</code> và dĩ nhiên toàn quyền cài đặt cấu trúc cho nó các mức giá trị từ nhỏ xíu tối thiểu (minimum), đến khổng lồ kịch kim (maximum) và cả sức gánh đệm lót ban đầu (default).</p>
          <p>Cú pháp cốt tủy dưới đây minh họa việc khai phá dữ liệu khai báo nhóm chữ số và thiết lập thanh trượt (slider) trong kết cấu shader:</p>

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

          <p>Ở ngay ví dụ trực quan bên trên thì cá nhân chúng ta đã điểm danh trớt lọt khai báo 3 properties cồm cộm: một tham số thuộc định dạng "thanh trượt giá trị thực" (floating range) với bí danh là <code>_Specular</code>, tham số thứ yếu tiếp theo lại mang dáng dấp là một "tỷ lệ số thực" (floating scale) gắn tên mã <code>_Factor</code>, và rốt cuộc ở phút cuối cùng là sự chào sân của chủng loại kiểu số "nguyên" (integer) đội nón bí danh <code>_Cid</code>.</p>

          <h2 id="3.0.5">3.0.5. Color and vector properties</h2>
          <p>Dựa đâm nhờ vào sức mạnh của nhóm property này, việc định nghĩa ấn định cấu hình màu sắc (colors) và tọa độ hướng (vectors) trong vòng vây lõi shader trở nên luôn trong tầm tay.</p>
          <p>Chúng ta lại lôi góc nhìn lên diễn đàn đem ra giả định rằng chúng ta có tham vọng sáng tạo bằng được một shader tự vỗ kích năng lực thiên biến vạn hóa tự thay đổi các dải màu sắc biến ảo trong quá trình trò chơi đang nhào nặn thực thi hiển thị (execution time), nhằm đạt tới viễn cảnh đó là chúng ta bắt buộc ép mình phải thiết lập móc một con color property cắm thẳng ra bản đồ mặt tiền để nơi đó thao tác bóp nắn, biến đổi nhào trộn thay số cho các vạch giá trị hệ màu RGBA của con shader kia.</p>
          <p>Đơn giản chỉ việc dùng khối cấu trúc lệnh sau để móc ngoặc rào đón thành phần hệ Colors và Vectors tham chiến vào mặt trận shader:</p>

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

          <p>Nhìn chớp qua trong cái ví dụ phía trên này, chúng ta đã lôi ra khai báo trót lọt hai thành phần properties mới toanh, một ả mang hệ "color" sắc đẹp che phủ với bí danh là <code>_Color</code> và mặt mảng gồ ghề cứng cỏi còn lại chính là kiểu tham số đồ họa "tọa độ vector" nắm đầu tên xưng danh <code>_VPos</code>.</p>
          <h2 id="3.0.6">3.0.6. Texture properties</h2>
          <p>Nhóm properties thú vị này cấp quyền cho phép chúng ta cài cắm áp dụng các loại bề mặt ảnh vân (textures) vào cấu trúc shader của mình.</p>
          <p>Thuận theo lẽ thường nếu chúng ta có khao khát đặt ốp dán một lớp ảnh bề mặt texture lên mặt đối tượng của mình (đơn cử ví dụ đối tượng là một character nhân vật 3D), thì khi đó chúng ta sẽ bắt buộc khởi tạo ra một property hệ <code>2D</code> cho mặt texture đó và rồi sau cùng thông quan luân chuyển nó chui lọt qua một function có danh xưng là "<code>tex2D</code>", thứ hàm khắt khe mà sẽ vòi vĩnh bắt chúng ta khai báo đủ bộ hai parameters (tham số): thứ nhất là bộ khung tham chiếu texture và thứ hai là chuỗi tọa độ định vị UV (UV coordinates) của vật thể đích.</p>
          <p>Một loại property khác mang hệ số tương đương mà chúng ta vô tình sẽ lôi ra sử dụng như ăn cơm bữa trong các dự án trò chơi video chính là "<code>Cube</code>" thứ tự đại diện trỏ thẳng đến khái niệm kết tạo "Cubemap" (bản đồ hộp không gian). Loại hình hoa văn texture dạng này tỏ ra đặc biệt bùng nổ độ hữu dụng mạnh mẽ khi được dùng khởi tạo các mảng bản đồ phản xạ (reflection maps), ví dụ điển hình: hiện tượng phản chiếu ánh sáng chói lóa lập lòe trên bộ áo giáp của nhân vật hay nới rộng ra là đổ bóng trên bất kỳ thành phần vật liệu kim loại (metallic) nào nói chung.</p>
          <p>Ngoài lề, có một vài chủng loại textures lai căng khác mà chúng ta có thể bới móc tìm thấy như loại hình hệ <code>3D</code> type. Tuy nhiên thành thật mà nói chúng rớt hạng, bị đẩy xuống sử dụng với tần suất ít ỏi hơn hẳn khi đặt lên bàn cân với những kẻ tiền bối vừa điểm mặt ở trên, chung quy do bản tính sinh ra là để chuyên trách cấu trúc biểu diễn dữ liệu thể tích tích tụ (volumetric) và vì lẽ đó chúng luôn luôn đè đầu đòi hỏi phải nướng thêm thông số hệ tọa độ bổ sung (additional coordinate) chỉ để gánh vác cho quá trình tính toán phỏng đoán hình học không gian (spatial calculation) tốn kém của chúng.</p>
          <p>Dưới đây là sơ đồ bộ cú pháp chuẩn (syntax) chuyên trách thực thi khai báo tiêm textures vào shader của chúng ta:</p>

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

          <p>Phải đặc biệt cực kỳ để tâm nhét vào đầu rằng mỗi bận khai báo định nghĩa một mặt property, vòng lưu ý sống còn nằm ở chỗ bản danh tính property đó thực chất sẽ chỉ được hiểu và viết độc quyền thuần túy bằng ngôn ngữ khai báo declarative <strong>ShaderLab</strong>, trong kho đó tàn khốc thay thứ lõi chương trình (program) đồ họa thực sự của chúng ta chạy bên trong nó lại bị ràng buộc phải được chắp bút viết bằng ngôn ngữ <strong>Cg</strong> hoặc là <strong>HLSL</strong>. Chấp nhận sự thật phũ phàng rằng do chúng thuộc hai phân loài ngôn ngữ lai căng bất đồng hoàn toàn tách biệt, hệ quả là chúng ta bị ép rào vội xây dựng nên các "biến số kết nối liên lạc" (<strong>connection variables</strong>).</p>
          <p>Các variables kiều này xưa nay được mặc định khai báo phủi bay phạm vi thông qua các từ khóa toàn cục như "<code>uniform</code>", thế tuy nhiên, bước rườm rà này thực ra hoàn toàn có thể bị gạch bỏ nhảy cóc qua đi lẹ vì chương trình thông dịch ngầm dĩ nhiên thừa não lôi tự động nhận dạng xếp chúng vào thành mảng "global variables" ngay tắp lự. Vì thế, tóm lại nôm na để bơm cấp thành công một property vào trong một file định dạng mở rộng "<code>.shader</code>", lọt tai thì đầu tiên chúng ta buộc phải khai báo (declare) cái mảng property ấy ngoài vùng thềm sân ShaderLab, rồi lạch bạch tạo ra khối "global variable" (trong lòng phân đoạn Cg/HLSL) khoác y lệnh cái bảng tên y xì đúc đồng bộ nhau như hình với bóng, và sau cuối của sự trầy trật đó, chúng ta mới được cấp quyền tự do lôi nó ra mà ứng dụng sử dụng trải nghiệm (used).</p>

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

          <p>Săm soi lại trong cái góc ví dụ demo phía trên, cá nhân chúng ta đã thành công xướng tên khai báo ra hai properties mang định danh: <code>_MainTex</code> và <code>_Color</code>. Mạch tiếp theo liển mạch chúng ta nắn gân nhồi luôn hai dải "biến liên kết" (connection variables) nằm chìm an toàn nấp trong khối <code>CGPROGRAM</code>, điểm mặt gọi tên ngầm định tưng ứng chúng mang dáng dấp cấu trúc lần lượt là "<code>sampler2D _MainTex</code>" đi đôi nhịp nhàng với "<code>float4 _Color</code>". Một điểm chốt sống còn là cả hai đối tượng (mảng property nguyên thủy và cái mảng biến connection variable) bắt buộc như hình với bóng <strong>PHẢI KHOÁC CHUNG MỘT CÁI TÊN GỌI KHÔNG LỆCH NHAU DẤU PHẨY MẢY MAY</strong>, chỉ bằng chìa khóa đó nền tảng phía trong khu vườn chương trình mới mở cửa có khả năng chắp vá ghi nhận (recognize) truy xuất được chúng.</p>
          <p>Trong khuôn khổ của chuyên mục 3.2.7 lùi lại phía sau, chúng ta sẽ gài số lùi phanh khui bóc tách ra cặn kẽ chân tơ kẽ tóc ngọn nguồn quy trình cách thức hoạt động lọt khe của một mảng <code>2D sampler</code> đúng chuẩn thời điểm chúng ta vác nhau qua thảo luận chủ đề xoay quanh định dạng dữ liệu (data types).</p>

          <h2 id="3.0.7">3.0.7. Material property drawer</h2>
          <p>Kể thêm câu chuyện thì có một thứ nhánh properties lai căng siêu đặc biệt khác mà chúng ta có diễm phúc tóm được trong cái kho ngôn ngữ ShaderLab được biết đến rộng rãi với cái tên là "<strong>drawers</strong>" (ngăn kéo). Lớp cấp (class) thú vị này đặc quyền ban cho chúng ta năng lực đẻ hoang khai sinh phôi thai ra vô số các custom properties dị biệt móc thẳng ra trên panel ngai vàng Unity Inspector, từ đó trực tiếp tạo ra bệ phóng tuyệt phẩm biến quá trình phôi thai code lập trình định hình hệ thống điều kiện logic rẽ nhánh (conditionals logic) cắm rễ trong lòng bộ ruột của shader trở thành thứ vô cùng dễ thở thoang thoảng mượt mà hơn.</p>
          <p>Thực tế thuận theo mặc định gốc tự nhiên, cái mảng hệ dòng property trơn trượt này vốn dĩ chẳng bao giờ mặc định được nhồi nhét nêm nếm có mặt sẵn trong ruột bộ khung khởi tạo file shader lúc phôi thai đâu, thay vì chờ đợi, chúng ta vác trách nhiệm nhọc thân tự tay thủ công khai báo cắm rễ chúng sao cho hợp lý và đi khớp cùng cái nhu cầu tùy chỉnh. Ngược dòng điểm mặt cho đến tận thời đại ngày nay, ngót nghét tổng hợp đã có tròn 7 hình hài phân nhánh mảng ngăn kéo "drawers" lừng lẫy như sau:</p>
          <ul>
            <li><code>Toggle</code>.</li>
            <li><code>Enum</code>.</li>
            <li><code>KeywordEnum</code>.</li>
            <li><code>PowerSlider</code>.</li>
            <li><code>IntRange</code>.</li>
            <li><code>Space</code>.</li>
            <li><code>Header</code>.</li>
          </ul>
          <p>Dĩ nhiên mỗi cá thể ngưng đọng trong tập hợp chúng thầm ôm ấp riêng đong đo phân phát cho một sứ mệnh cụ thể đặc sắc phơi phới chuyên trách thực thi một chùm function nhất định định hình cá nhân và cũng đi kèm quyền năng khai báo thao tác cắm lệnh hoàn toàn độc lập (independently).</p>
          <p>Phải nói cám ơn nồng hậu đến rổ nhánh properties này, qua đó chúng ta có nền tảng dễ dàng sản sinh ra vô lượng số trạng thái (states) biến ảo bên trong não bộ chương trình khối code, trực tiếp bật xanh đèn cho phép tạo ra các hiệu ứng hình ảnh sống động liên hoàn mang khuynh hướng ứng động (dynamic effects) – ngạc nhiên nhất là thoát khỏi nhu cầu phải thay cả khối vật liệu (materials) trực tiếp vào lúc hiển thị đang vận hành (execution time).</p>
          <p>Thông lệ chúng ta thường đi gộp nhét đóng gói vận hành hệ thống drawers này đi thành cặp bài chung với 2 thứ công cụ hệ phái biến thể shader variants (dạng các lớp biến thể), nôm na uy dũng gọi đích tên là những cú click lệnh: <code>#pragma multi_compile</code> và lệnh <code>#pragma shader_feature</code>.</p>
          
          <div class="lesson-fig">
            <div class="fig-placeholder">
              <span class="fig-placeholder-icon">🖼️</span>
              <span class="fig-placeholder-text">Yêu cầu ảnh: Fig. 3.0.7a</span>
              <span class="fig-placeholder-path">assets/ch3/fig_3_0_7a.png</span>
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
