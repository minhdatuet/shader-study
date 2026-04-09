window.ShaderStudy = window.ShaderStudy || {};
window.ShaderStudy.Theory = window.ShaderStudy.Theory || {};
window.ShaderStudy.Theory["ch3-l2"] = `
          <h2 id="3.1.0">3.1.0. MPD Enum</h2>
          <p>Dùng <code>[Enum]</code> để gán giá trị ID cụ thể cho mỗi lựa chọn, có thể truyền trực tiếp vào lệnh như <code>Cull [_Face]</code>.</p>
          
          <h2 id="3.1.1">3.1.1. MPD PowerSlider & IntRange</h2>
          <ul>
            <li><strong>PowerSlider:</strong> Tạo non-linear slider. <code>[PowerSlider(3.0)] _PropertyName ("Name", Range(0.01, 1)) = 0.08</code>.</li>
            <li><strong>IntRange:</strong> Giới hạn dải số nguyên. <code>[IntRange] _PropertyName ("Name", Range(0, 255)) = 100</code>.</li>
          </ul>

          <h2 id="3.1.2">3.1.2. MPD Space & Header</h2>
          <p>Dùng để tổ chức giao diện Inspector:</p>
          <ul>
            <li><strong>Header:</strong> Tạo nhãn tiêu đề. <code>[Header(Specular properties)]</code>.</li>
            <li><strong>Space:</strong> Tạo khoảng trống. <code>[Space(20)]</code>.</li>
          </ul>

          <h2 id="3.1.3">3.1.3. ShaderLab SubShader</h2>
          <p>Mỗi Shader có ít nhất một SubShader. Unity chọn SubShader phù hợp nhất với Hardware.</p>

          <h2 id="3.1.4">3.1.4. SubShader Tags</h2>
          <p>Tags xác định cách thức và thời điểm Shader được xử lý.</p>

          <h2 id="3.1.5">3.1.5. Queue Tag (Render Queue)</h2>
          <p>GPU vẽ các vật thể dựa trên Z-axis. Queue Tag cho phép thay đổi thứ tự này. Các nhóm mặc định:</p>
          <ul>
            <li><strong>Background (0-1499):</strong> (Skybox).</li>
            <li><strong>Geometry (1500-2399):</strong> Mặc định cho Opaque objects.</li>
            <li><strong>AlphaTest (2400-2699):</strong> Semi-transparent (Cỏ, cây).</li>
            <li><strong>Transparent (2700-3599):</strong> Transparent objects.</li>
            <li><strong>Overlay (3600-5000):</strong> Vẽ sau cùng (UI).</li>
          </ul>

          <h2 id="3.1.6">3.1.6. RenderType Tag</h2>
          <p>Dùng để phân loại hành vi của Shader, phục vụ kỹ thuật <strong>Shader Replacement</strong> (SetReplacementShader).</p>

          <h2 id="3.1.7">3.1.7. SubShader Blending</h2>
          <p>Blending là quá trình pha trộn hai pixels thành một ở giai đoạn Merging Stage.</p>
          <p>Công thức: <strong>Final Color = (Src * SrcFactor) [OP] (Dst * DstFactor)</strong>.</p>
          <ul>
            <li><strong>SrcValue (Source):</strong> Output của Fragment Shader.</li>
            <li><strong>DstValue (Destination):</strong> Màu trong Render Target (SV_Target).</li>
          </ul>
          <p>Các chế độ phổ biến:</p>
          <ul>
            <li><code>Blend SrcAlpha OneMinusSrcAlpha</code>: Standard Transparent.</li>
            <li><code>Blend One One</code>: Additive Blending.</li>
            <li><code>Blend DstColor Zero</code>: Multiplicative Blending.</li>
          </ul>

          <h2 id="3.1.8">3.1.8. AlphaToMask</h2>
          <p>Áp dụng mask lên Alpha channel. Chỉ tạo giá trị 0 hoặc 1 (hard transparency). Rất hữu ích cho Vegetation.</p>

          <h2 id="3.1.9">3.1.9. ColorMask</h2>
          <p>Giới hạn GPU ghi dữ liệu lên các channel R, G, B, A nhất định.</p>
`;
