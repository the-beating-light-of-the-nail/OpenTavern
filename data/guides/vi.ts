import type { GuideSeo } from '~/types/seo';

/**
 * 原创教程（SEO 静态数据）。
 * 正文以结构化 sections 渲染为 HTML，不引入 markdown 依赖。
 */
export const guides: GuideSeo[] = [
  {
    slug: 'how-to-start-ai-roleplay',
    title: 'Cách bắt đầu AI Roleplay cho người mới',
    datePublished: '2026-07-15',
    description:
      'Hướng dẫn đầy đủ cho người mới để bắt đầu cuộc AI roleplay đầu tiên trên RoleChat AI. Chọn một nhân vật, thêm AI key của bạn và gửi tin nhắn đầu tiên trong chưa tới năm phút.',
    sections: [
      {
        heading: 'AI roleplay là gì?',
        paragraphs: [
          'AI roleplay là một cuộc trò chuyện giữa bạn và một AI đang vào vai một nhân vật hư cấu. Bạn nhập vai chính mình — hay bất kỳ ai bạn muốn — và AI sẽ đáp lại theo đúng nhân vật, theo thời gian thực, cùng nhau dệt nên một câu chuyện qua từng tin nhắn.',
          'Khác với chatbot chỉ để trả lời câu hỏi, một nhân vật roleplay có tính cách, có quá khứ, có giọng điệu riêng và một mối quan hệ với bạn. Mục đích không phải là để lấy thông tin, mà là để được sống bên trong một câu chuyện cùng một người cảm giác như thật.',
          'Trên RoleChat AI, mỗi nhân vật đều mang tính nguyên bản — không sao chép từ trò chơi hay phim ảnh — và mọi cuộc trò chuyện đều hoàn toàn riêng tư, chạy ngay trong trình duyệt của bạn bằng chính AI key của bạn.',
        ],
      },
      {
        heading: 'Bước 1: Chọn một nhân vật',
        paragraphs: [
          'Truy cập trang Characters và lướt qua thư viện. Mỗi nhân vật đều có tên, dòng giới thiệu ngắn, mô tả súc tích và các thẻ tính cách để bạn biết rõ mình sắp bước vào điều gì trước khi bắt đầu.',
          'Mới làm quen với roleplay tình cảm? Hãy bắt đầu bằng một nhân vật kiểu "comfort" hoặc "slow burn". Họ dịu dàng và bao dung hơn — rất phù hợp để bạn tìm nhịp. Bạn luôn có thể thử những nhân vật mãnh liệt hơn sau.',
          'Khi đã tìm được người vừa ý, hãy nhấp vào thẻ nhân vật để mở trang của họ. Đọc mô tả và tin nhắn mở đầu — tin nhắn mở đầu chính xác là cách cuộc trò chuyện của bạn sẽ bắt đầu.',
        ],
      },
      {
        heading: 'Bước 2: Mở app và thêm AI key của bạn',
        paragraphs: [
          'Nhấp vào nút "Start Private Chat" trên bất kỳ trang nhân vật nào để mở app. Trước tin nhắn đầu tiên, bạn cần thêm một AI key — một chuỗi bí mật ngắn giúp app kết nối với nhà cung cấp AI.',
          'Chưa có key? Xem hướng dẫn lấy AI key của chúng tôi — chỉ mất khoảng hai phút. Key của bạn chỉ được lưu trong trình duyệt; chúng tôi không bao giờ nhìn thấy hay lưu trữ nó trên máy chủ.',
          'Sau khi nhập key xong, app đã sẵn sàng. Bạn sẽ không cần làm lại bước này trừ khi đổi thiết bị hoặc xoá dữ liệu trình duyệt.',
        ],
      },
      {
        heading: 'Bước 3: Gửi tin nhắn đầu tiên',
        paragraphs: [
          'Nhân vật đã gửi cho bạn một tin nhắn mở đầu — đó chính là phần dựng cảnh. Việc của bạn đơn giản là đáp lại. Bạn không cần phải là một nhà văn. Bạn không cần phải lanh lẹ. Chỉ cần gõ những gì bạn thực sự sẽ nói.',
          'Một tin nhắn đầu tiên tuyệt vời thường ngắn gọn và rất con người: một phản ứng, một câu hỏi, một cử chỉ mô tả trong dấu sao. Chẳng hạn, nếu một bác sĩ lạnh lùng đưa cho bạn ly cà phê, bạn có thể chỉ cần nói "Cảm ơn" rồi xem chuyện gì xảy ra.',
          'AI sẽ đáp lại đúng theo nhân vật, và câu chuyện cứ thế mở ra. Không có cách chơi nào là sai — cứ để sự tò mò dẫn lối, nhân vật sẽ đón bạn ở đó.',
        ],
      },
      {
        heading: 'Mẹo cho buổi đầu tiên của bạn',
        paragraphs: [
          'Nếu được, hãy giữ đúng vai của mình — điều đó giúp thế giới trở nên thật hơn. Nhưng thỉnh thoảng lùi lại và tận hưởng câu chuyện cũng không sao.',
          'Nếu một câu trả lời thấy không ổn, bạn có thể tạo lại hoặc chỉnh sửa tin nhắn cuối cùng của mình. Roleplay là sự hợp tác; bạn hoàn toàn có quyền điều hướng.',
          'Và trên hết: đừng vội. Những buổi roleplay hay nhất thường mở ra chậm rãi. Hãy để mối quan hệ có khoảng thở.',
        ],
      },
    ],
    internalLinks: [
      { label: 'Duyệt nhân vật', to: '/characters' },
      { label: 'Mở app', to: '/app' },
      { label: 'Cách lấy AI key', to: '/guides/how-to-get-an-api-key' },
      { label: 'Mẹo để roleplay tốt hơn', to: '/guides/tips-for-better-roleplay' },
    ],
  },
  {
    slug: 'how-to-get-an-api-key',
    title: 'Cách lấy AI Key cho RoleChat AI',
    datePublished: '2026-07-15',
    description:
      'Hướng dẫn từng bước để lấy một API key tương thích OpenAI và thêm vào RoleChat AI. Không cần kiến thức kỹ thuật — chỉ mất khoảng hai phút.',
    sections: [
      {
        heading: 'API key là gì?',
        paragraphs: [
          'API key là một chuỗi bí mật ngắn — thường bắt đầu bằng "sk-" — giúp RoleChat AI kết nối với nhà cung cấp AI thay cho bạn. Đó là cách app biết rằng bạn được phép sử dụng AI.',
          'Bạn tự mang key của riêng mình, nghĩa là bạn chọn nhà cung cấp, chỉ trả tiền cho đúng phần mình dùng, và cuộc trò chuyện đi thẳng từ trình duyệt của bạn tới nhà cung cấp đó. Không có bên trung gian nào cả.',
        ],
      },
      {
        heading: 'Bước 1: Chọn nhà cung cấp',
        paragraphs: [
          'RoleChat AI hoạt động với bất kỳ nhà cung cấp nào có API tương thích OpenAI. Những lựa chọn phổ biến gồm các phòng thí nghiệm tên tuổi và các nhà cung cấp chi phí thấp mới nổi. Hãy chọn một nơi khả dụng tại khu vực của bạn và phù hợp với ngân sách.',
          'Chưa biết bắt đầu từ đâu? Tìm một nhà cung cấp có bản dùng thử hào phóng hoặc mức giá thấp cho từng tin nhắn. Bạn luôn có thể đổi sau bằng cách dán một key mới vào Settings.',
        ],
      },
      {
        heading: 'Bước 2: Tạo tài khoản và sinh key',
        paragraphs: [
          'Đăng ký tại website của nhà cung cấp bạn chọn, sau đó tìm mục "API keys" hoặc "Access tokens" trong bảng điều khiển. Nhấp "Create new key", đặt cho nó một cái tên dễ nhớ và sao chép chuỗi mà hệ thống hiển thị.',
          'Lưu ý quan trọng: phần lớn nhà cung cấp chỉ hiển thị đầy đủ key đúng một lần. Hãy lưu nó vào nơi an toàn ngay lập tức — nếu mất, bạn sẽ phải sinh key mới.',
        ],
      },
      {
        heading: 'Bước 3: Thêm vào RoleChat AI',
        paragraphs: [
          'Mở app RoleChat AI, nhấp Settings và dán key vào trường "API Key". Thêm URL endpoint của nhà cung cấp vào trường "API Endpoint" (thường được hiển thị trên cùng trang bảng điều khiển với key của bạn).',
          'Tuỳ chọn, bạn có thể chọn một model từ danh sách thả xuống. Nếu chưa chắc, hãy chọn mục mặc định được nhà cung cấp đề xuất — nó được cân bằng giữa chất lượng và chi phí.',
          'Vậy là xong. Bạn đã sẵn sàng để trò chuyện. Key của bạn vẫn nằm trong trình duyệt và không bao giờ được gửi cho chúng tôi.',
        ],
      },
      {
        heading: 'Giữ cho key của bạn an toàn',
        paragraphs: [
          'Đừng bao giờ chia sẻ API key công khai — nó giống như mật khẩu của tài khoản AI vậy. Nếu nghi ngờ đã bị lộ, hãy sinh lại key tại nhà cung cấp và cập nhật trong Settings.',
          'Trên thiết bị dùng chung hoặc công cộng, đừng bật "save key to this browser". Trên thiết bị riêng của bạn, cứ yên tâm lưu lại để tiện sử dụng.',
        ],
      },
    ],
    internalLinks: [
      { label: 'Mở app để thêm key', to: '/app' },
      { label: 'Duyệt nhân vật', to: '/characters' },
      { label: 'Bắt đầu roleplay đầu tiên', to: '/guides/how-to-start-ai-roleplay' },
    ],
  },
  {
    slug: 'tips-for-better-roleplay',
    title: 'Mẹo để AI Roleplay hay hơn',
    datePublished: '2026-07-15',
    description:
      'Những thói quen nhỏ giúp nhân vật AI sống động hơn — giọng điệu, nhịp độ, và cách khẽ điều hướng câu chuyện mà không làm đứt mạch nhập vai.',
    sections: [
      {
        heading: 'Đáp lại như một con người, chứ không phải một câu lệnh',
        paragraphs: [
          'Sai lầm lớn nhất của người mới là viết cho AI thay vì viết cho nhân vật. Đừng mô tả những gì bạn muốn xảy ra — chỉ cần nói những gì bạn thực sự sẽ nói. AI đang nhập vai trong cảnh rồi; việc của bạn là ở trong đó cùng họ.',
          'Những câu trả lời ngắn, chân thật gần như luôn hiệu quả hơn những đoạn dài la liệt. Một câu "Tôi không biết phải nói gì" đích thực có thể đẩy một cảnh tiến xa hơn cả một đoạn tường thuật dài dòng.',
        ],
      },
      {
        heading: 'Dùng hành động trong dấu sao',
        paragraphs: [
          'Bọc một hành động nhỏ trong dấu sao — như *looks away* hay *hands him the cup* — sẽ cho nhân vật một điều gì đó thuộc về thể chất để phản ứng lại. Đó là cách dễ nhất để thêm lớp chi tiết mà không phải viết cả một cuốn tiểu thuyết.',
          'Đừng dùng quá tay. Một hoặc hai hành động mỗi tin nhắn là đủ rồi. Nhiều quá sẽ bắt đầu giống chỉ dẫn sân khấu hơn là một cuộc trò chuyện.',
        ],
      },
      {
        heading: 'Hãy để mối quan hệ có khoảng thở',
        paragraphs: [
          'Roleplay tình cảm hay nhất là loại chậm rãi. Nếu bạn vội vã đến một lời tỏ tình trong ba tin nhắn đầu, nhân vật sẽ không còn chỗ để phát triển. Hãy để sự tin tưởng lớn dần, để căng thẳng âm ỉ, để những khoảnh khắc nhỏ thực sự có ý nghĩa.',
          'Các nhân vật được viết với một nhịp cảm xúc nhất định — đẩy quá nhanh, quá mạnh có thể khiến họ trở nên ngoài nhân vật. Cứ theo sự dẫn dắt của họ, và phần kết quả sẽ hoàn toàn xứng đáng.',
        ],
      },
      {
        heading: 'Điều hướng khi cần thiết',
        paragraphs: [
          'Roleplay là sự hợp tác. Nếu một câu trả lời không khớp với câu chuyện bạn muốn, bạn có thể chỉnh sửa tin nhắn cuối của mình rồi thử lại, hoặc tạo lại câu trả lời của nhân vật. Bạn không hề bị mắc kẹt với phiên bản đầu tiên.',
          'Bạn cũng có thể khẽ chuyển hướng ngay trong vai: đổi chủ đề, rời khỏi phòng, đặt một câu hỏi. Nhân vật thường sẽ theo dẫn dắt của bạn mà không làm đứt mạch cảnh.',
        ],
      },
      {
        heading: 'Biết lúc nào nên dừng',
        paragraphs: [
          'Một buổi roleplay tuyệt vời giống như một chương hay — kết thúc tại một điểm nghỉ tự nhiên. Khi bạn mệt, hãy dừng lại. Cuộc trò chuyện sẽ vẫn ở đây khi bạn quay lại, và nhân vật sẽ nhớ bạn đã dừng ở đâu.',
          'Không có phần thưởng nào cho những buổi kéo dài miên man đâu. Câu chuyện sẽ hay hơn khi bạn tỉnh táo.',
        ],
      },
    ],
    internalLinks: [
      { label: 'Duyệt nhân vật', to: '/characters' },
      { label: 'Mở app', to: '/app' },
      { label: 'Mới làm quen roleplay? Bắt đầu từ đây', to: '/guides/how-to-start-ai-roleplay' },
    ],
  },
  {
    slug: 'how-to-use-openrouter-for-roleplay',
    title: 'Cách dùng OpenRouter cho AI roleplay nhân vật',
    datePublished: '2026-07-15',
    description:
      'Hướng dẫn từng bước dành cho người mới bắt đầu dùng OpenRouter cùng RoleChat AI. Đăng ký tài khoản, lấy API key, chọn model và bắt đầu trò chuyện cùng các nhân vật romance gốc chỉ trong vài phút.',
    sections: [
      {
        heading: 'OpenRouter là gì?',
        paragraphs: [
          'OpenRouter là dịch vụ cho phép bạn truy cập hàng chục model AI từ nhiều nhà cung cấp khác nhau qua cùng một API. Thay vì đăng ký riêng lẻ cho OpenAI, Anthropic, Google hay các nền tảng khác, bạn chỉ cần tạo một tài khoản OpenRouter là có thể dùng bất kỳ model nào họ cung cấp.',
          'Đối với AI roleplay, điều này tiện lợi đến mức khó tin. Bạn có thể thử nhiều model, so sánh phong cách viết của từng cái và chuyển đổi bất cứ lúc nào — tất cả mà không cần thay API key hay rời khỏi ứng dụng.',
        ],
      },
      {
        heading: 'Vì sao OpenRouter hợp với roleplay',
        paragraphs: [
          'Roleplay cần những model giỏi sáng tác, giữ đúng nhân vật và cho ra các câu trả lời dài, cuốn hút. OpenRouter cho phép bạn tiếp cận rất nhiều model như vậy, trong đó có cả những lựa chọn cực kỳ rẻ.',
          'Vì bạn chỉ trả tiền cho phần mình dùng, tha hồ thử nghiệm. Hãy bắt đầu với một model rẻ hơn; nếu văn phong nhạt nhẽo, cứ chuyển sang model mạnh hơn — thao tác đổi chỉ tủa vài giây.',
        ],
      },
      {
        heading: 'Bước 1: Tạo tài khoản OpenRouter',
        paragraphs: [
          'Truy cập openrouter.ai và đăng ký. Quá trình rất đơn giản — bạn cần một địa chỉ email và một phương thức để nạp một ít credit (OpenRouter hỗ trợ nhiều hình thức thanh toán).',
          'Bạn không cần nạp nhiều. Vài USD là đủ cho hàng trăm tin nhắn roleplay với hầu hết các model. Lúc nào cần thì nạp thêm cũng chưa muộn.',
        ],
      },
      {
        heading: 'Bước 2: Lấy API key của bạn',
        paragraphs: [
          'Sau khi đăng nhập, vào mục Keys trên bảng điều khiển OpenRouter của bạn. Bấm "Create Key", đặt một cái tên dễ nhớ rồi sao chép chuỗi được hiển thị.',
          'Lưu ý quan trọng: OpenRouter chỉ hiển thị đầy đủ key đúng một lần. Hãy lưu ngay vào nơi an toàn — nếu đánh mất, bạn sẽ phải tạo key mới.',
        ],
      },
      {
        heading: 'Bước 3: Thêm key vào RoleChat AI',
        paragraphs: [
          'Mở ứng dụng RoleChat AI và bấm "Connect AI" trên thanh trên cùng. Trong bảng Settings, bấm nút điền nhanh "OpenRouter" — endpoint URL đúng sẽ được tự động điền vào.',
          'Dán API key OpenRouter vào trường API Key. Sau đó nhập tên model vào trường Model (ví dụ, một lựa chọn khởi đầu tốt là một model chat giá rẻ). Bấm lưu là bạn đã kết nối xong.',
        ],
      },
      {
        heading: 'Bước 4: Chọn nhân vật và bắt đầu trò chuyện',
        paragraphs: [
          'Sau khi key đã được thiết lập, hãy duyệt thư viện nhân vật và chọn một người bạn ưng ý. Bấm "Start Chat", nhân vật sẽ gửi cho bạn lời mở đầu của họ.',
          'Gõ câu trả lời, chỉ vài giây sau bạn sẽ nhận được phản hồi đúng chất nhân vật. Vậy là xong — bạn đang roleplay. Nếu văn phong chưa hợp ý, thử một model khác trên OpenRouter và xem sự khác biệt.',
        ],
      },
      {
        heading: 'Mẹo chọn model trên OpenRouter',
        paragraphs: [
          'Với roleplay romance, hãy ưu tiên các model nổi trội về sáng tác và cho ra văn bản dài. Nhìn chung, model lớn hơn sẽ viết phong phú hơn nhưng tốn kém hơn mỗi tin nhắn; model nhỏ rẻ hơn nhưng có thể cho phản hồi ngắn hoặc ít sắc thái.',
          'Hãy bắt đầu với một lựa chọn vừa túi tiền, làm quen với nhịp điệu, rồi nâng cấp nếu bạn muốn văn phong đậm đà hơn. Không có lựa chọn "sai" đâu — model tốt nhất chính là cái mà bạn thích văn phong của nó nhất.',
        ],
      },
    ],
    internalLinks: [
      { label: 'Duyệt nhân vật', to: '/characters' },
      { label: 'Mở ứng dụng', to: '/app' },
      { label: 'Cách bắt đầu AI roleplay', to: '/guides/how-to-start-ai-roleplay' },
      { label: 'Mẹo để roleplay hay hơn', to: '/guides/tips-for-better-roleplay' },
    ],
  },
  {
    slug: 'what-is-a-character-card',
    title: 'Character Card AI là gì?',
    datePublished: '2026-07-15',
    description:
      'Giải thích dễ hiểu cho người mới về character card AI: chúng là gì, hoạt động ra sao và cách dùng trong RoleChat AI cho roleplay romance riêng tư.',
    sections: [
      {
        heading: 'Character card là gì?',
        paragraphs: [
          'Character card là tệp định nghĩa tính cách, nguồn gốc câu chuyện và cách hành xử của một nhân vật AI. Hãy coi đó như một hồ sơ chi tiết, chỉ cho AI biết nó phải hóa thân thành ai — tên gì, nói chuyện kiểu nào, quan tâm đến điều gì và có mối quan hệ thế nào với bạn.',
          'Khi bạn bắt đầu trò chuyện, ứng dụng sẽ đọc character card và dùng nó để định hướng mọi câu trả lời. Kết quả là một cuộc hội thoại giống như đang nói chuyện với một con người thật có giọng điệu riêng, chứ không phải một chatbot đại trà.',
        ],
      },
      {
        heading: 'Bên trong character card có gì?',
        paragraphs: [
          'Một character card tiêu chuẩn thường chứa vài thông tin chủ chốt: tên nhân vật, phần mô tả (họ là ai và backstory của họ), tính cách (cách họ hành xử và nói năng), kịch bản (bối cảnh và cách hai người gặp nhau), cùng lời mở đầu (câu đầu tiên khởi động cuộc trò chuyện).',
          'Một số card còn kèm theo các đoạn hội thoại mẫu, cho AI thấy nhân vật nói chuyện thế nào trong thực tế. Điều này giúp AI nắm bắt giọng điệu đặc trưng — cách chọn từ, nhịp điệu, cùng những thói quen nhỏ của nhân vật.',
        ],
      },
      {
        heading: 'Định dạng character card: V1, V2, V3 giải thích đơn giản',
        paragraphs: [
          'Theo thời gian, cộng đồng đã phát triển nhiều phiên bản khác nhau của định dạng character card. V1 đơn giản nhất — chỉ chứa phần cơ bản. V2 bổ sung thêm các trường như lời chào thay thế và ghi chú của người tạo. V3 chi tiết nhất, chừa chỗ cho các tiện ích mở rộng và metadata phong phú hơn.',
          'Bạn không cần bận tâm phiên bản nào là phiên bản nào. RoleChat AI tự động hỗ trợ cả ba. Khi bạn chọn hoặc nhập một card, ứng dụng sẽ tự nhận diện định dạng và xử lý giúp bạn.',
        ],
      },
      {
        heading: 'Character card hoạt động ra sao trong RoleChat AI',
        paragraphs: [
          'RoleChat AI đi kèm một thư viện nhân vật gốc ngay trong ứng dụng — mỗi nhân vật được định nghĩa bằng một character card. Bạn chẳng cần phải đi tìm hay tải gì cả. Chỉ việc duyệt thư viện, chọn một nhân vật và bắt đầu trò chuyện.',
          'Nếu bạn đã có sẵn character card từ công cụ khác (chẳng hạn SillyTavern), bạn có thể nhập vào. RoleChat AI đọc được cả card JSON chuẩn lẫn card PNG có nhúng dữ liệu, nên bộ sưu tập sẵn có của bạn vẫn dùng tốt ở đây.',
        ],
      },
      {
        heading: 'Nhân vật có sẵn so với tự nhập card',
        paragraphs: [
          'Với đa số người mới, bắt đầu từ thư viện nhân vật có sẵn là con đường dễ nhất. Mỗi nhân vật đều là bản gốc, được viết riêng cho roleplay romance và sẵn sàng trò chuyện ngay mà không cần thiết lập gì thêm ngoài việc nhập AI key.',
          'Nếu bạn đã có kinh nghiệm và có sẵn một bộ sưu tập card, tính năng nhập card cho phép bạn mang theo toàn bộ. Cả hai cách đều dùng được — thư viện có sẵn chỉ là cách khởi động nhanh hơn thôi.',
        ],
      },
      {
        heading: 'Character card có an toàn không?',
        paragraphs: [
          'Có. Character card chỉ là dữ liệu văn bản — không chứa mã hay script nào. Nó không thể gây hại cho thiết bị hay truy cập thông tin cá nhân của bạn. Tệ nhất mà một card viết dở có thể làm cũng chỉ là tạo ra một cuộc trò chuyện lan man.',
          'Trên RoleChat AI, các cuộc trò chuyện nằm ngay trong trình duyệt của bạn, còn dữ liệu nhân vật được xử lý bởi nhà cung cấp AI mà bạn chọn. Không ai khác có thể xem được đoạn chat của bạn.',
        ],
      },
    ],
    internalLinks: [
      { label: 'Duyệt nhân vật', to: '/characters' },
      { label: 'Mở ứng dụng', to: '/app' },
      { label: 'Cách bắt đầu AI roleplay', to: '/guides/how-to-start-ai-roleplay' },
    ],
  },
  {
    slug: 'sillytavern-vs-web-tavern',
    title: 'SillyTavern và Web Tavern: Cái nào dễ dùng hơn?',
    datePublished: '2026-07-15',
    description:
      'So sánh thân thiện giữa SillyTavern và RoleChat AI (tên cũ là Web Tavern) dành cho người mới. Về cài đặt, thiết lập, quyền riêng tư và character card — lựa chọn nào phù hợp với bạn?',
    sections: [
      {
        heading: 'SillyTavern là gì?',
        paragraphs: [
          'SillyTavern là một frontend mã nguồn mở, phổ biến và mạnh mẽ cho AI roleplay. Ứng dụng đã có mặt nhiều năm và sở hữu một cộng đồng đầy nhiệt huyết. Nó hỗ trợ một dải cực kỳ rộng các thiết lập, preset, tiện ích mở rộng và định dạng character card.',
          'Cái giá phải trả là sự phức tạp. SillyTavern cần cài đặt — bạn phải chạy nó trên máy tính của mình, cấu hình kết nối tới các nhà cung cấp AI và dò dẫm trong một giao diện dày đặc tham số nâng cao. Với người rành kỹ thuật, sức mạnh đó chính là một điểm cộng. Với đa số người mới, nó là một bức tường.',
        ],
      },
      {
        heading: 'RoleChat AI (tên cũ Web Tavern) là gì?',
        paragraphs: [
          'RoleChat AI — vốn ra mắt dưới tên Web Tavern — là ứng dụng AI roleplay chạy trên trình duyệt, được thiết kế để dễ sử dụng. Không có gì phải cài đặt. Bạn mở một trang web, chọn nhân vật, nhập AI key và bắt đầu trò chuyện.',
          'Ứng dụng giữ nguyên nguyên tắc riêng tư khiến SillyTavern hấp dẫn (tự mang key của mình, không bên thứ ba nào đọc được đoạn chat) nhưng lược bỏ phần thiết lập đáng sợ. Mục tiêu rất đơn giản: AI roleplay riêng tư dễ dùng nhất có thể.',
        ],
      },
      {
        heading: 'Cài đặt: phức tạp so với bằng không',
        paragraphs: [
          'SillyTavern yêu cầu tải ứng dụng, cài Node.js, chạy các script dòng lệnh và duy trì tiến trình server xuyên suốt lúc trò chuyện. Muốn dùng trên điện thoại còn cần thêm các bước thiết lập từ xa.',
          'RoleChat AI chạy hoàn toàn trong trình duyệt. Không tải, không terminal, không server. Ứng dụng chạy trên máy bàn, laptop, máy tính bảng và điện thoại — chỉ cần mở trang là dùng được.',
        ],
      },
      {
        heading: 'Thiết lập: tham số chuyên sâu so với thân thiện với người mới',
        paragraphs: [
          'SillyTavern bày ra temperature, top-p, độ dài context, phương pháp sampling, prompt template, world info và hàng chục thiết lập khác ngay trên màn hình chính. Với những người dùng nâng cao muốn tinh chỉnh từng chi tiết, đây là sức mạnh thực sự.',
          'RoleChat AI giấu sạch các thứ đó vào một khu vực Advanced. Màn hình mặc định chỉ cho bạn thấy nhân vật, tin nhắn và ô nhập. Nếu bạn muốn mò sâu vào các tham số sau này, chúng vẫn nằm đó — nhưng bạn không bao giờ bắt buộc phải đụng vào.',
        ],
      },
      {
        heading: 'Quyền riêng tư: cả hai đều tôn trọng dữ liệu của bạn',
        paragraphs: [
          'Cả SillyTavern lẫn RoleChat AI đều dùng mô hình "tự mang key". Bạn tự kết nối tài khoản nhà cung cấp AI của mình, và tin nhắn đi thẳng từ thiết bị của bạn tới nhà cung cấp đó. Không bên nào chạy một server trung gian đọc cuộc trò chuyện của bạn.',
          'Đây là ưu thế riêng tư cốt lõi so với nhiều ứng dụng roleplay thương mại, vốn định tuyến đoạn chat qua chính server của họ. Với cả SillyTavern và RoleChat AI, đoạn chat là của riêng bạn.',
        ],
      },
      {
        heading: 'Character card: tương thích hoàn toàn',
        paragraphs: [
          'Cả hai công cụ đều hỗ trợ chung các định dạng character card (JSON và PNG theo V1, V2, V3). Nếu bạn có sẵn bộ sưu tập card từ SillyTavern, bạn có thể nhập trực tiếp các card đó vào RoleChat AI.',
          'RoleChat AI còn cung cấp một thư viện nhân vật romance gốc, nên dù bạn chưa có card nào, vẫn có thể bắt đầu trò chuyện ngay lập tức.',
        ],
      },
      {
        heading: 'Nên chọn cái nào?',
        paragraphs: [
          'Nếu bạn thích vọc vạch, muốn kiểm soát tối đa từng tham số và không ngại một thiết lập kỹ thuật, SillyTavern là lựa chọn tuyệt vời với một cộng đồng vững mạnh.',
          'Nếu bạn chỉ muốn mở một trang và roleplay trong chưa đầy một phút — không cần cài đặt gì, cũng chẳng cần biết "top-p" nghĩa là gì — RoleChat AI được thiết kế cho bạn. Lúc nào muốn nâng cấp lên SillyTavern cũng được, và các character card của bạn sẽ đi theo cùng.',
        ],
      },
    ],
    internalLinks: [
      { label: 'Duyệt nhân vật', to: '/characters' },
      { label: 'Mở ứng dụng', to: '/app' },
      { label: 'Character card là gì?', to: '/guides/what-is-a-character-card' },
      { label: 'Cách bắt đầu AI roleplay', to: '/guides/how-to-start-ai-roleplay' },
    ],
  },
  {
    slug: 'best-ai-roleplay-prompts',
    title: 'Các mẫu prompt AI roleplay hay nhất cho người mới bắt đầu',
    datePublished: '2026-07-15',
    description:
      'Tổng hợp các mẫu prompt và kỹ thuật AI roleplay đơn giản, hiệu quả cho người mới. Học cách dựng bối cảnh, đẩy cảm xúc và khiến nhân vật sống động thật — không cần kinh nghiệm sẵn.',
    sections: [
      {
        heading: 'Điều gì làm nên một prompt roleplay tốt?',
        paragraphs: [
          'Trong AI roleplay, "prompt" không phải là một lệnh kỹ thuật — nó chỉ đơn giản là cách bạn viết tin nhắn của mình. Tin nhắn càng sinh động và cụ thể, phản hồi của nhân vật càng phong phú. Một prompt tốt cho AI thêm chất liệu để phát huy: một tâm trạng, một bối cảnh, một cảm xúc, hay một hành động nhỏ.',
          'Bạn không cần phải là một nhà văn xuất sắc. Bạn chỉ cần cho nhân vật một thứ gì đó thật để phản ứng. Dưới đây là năm kỹ thuật đơn giản áp dụng được cho bất kỳ nhân vật nào.',
        ],
      },
      {
        heading: 'Mẫu 1: Dựng bối cảnh',
        paragraphs: [
          'Thay vì lao ngay vào hội thoại, hãy phác qua nơi bạn đang ở. Chỉ một câu dựng cảnh cũng đủ neo cuộc trò chuyện và cho nhân vật thêm thứ để phản hồi.',
          'Ví dụ: "*Cơn mưa không hề dứt suốt nhiều tiếng đồng hồ. Tôi đẩy mở cửa quán cà phê, ướt sũng, và lướt nhìn quanh tìm một chỗ trống." Việc này cho nhân vật một bối cảnh, một tâm trạng và lý do để chú ý tới bạn. Phản hồi của họ sẽ sinh động hơn nhiều so với khi bạn chỉ thản nhiên nói "Chào."',
        ],
      },
      {
        heading: 'Mẫu 2: Xác định mối quan hệ từ sớm',
        paragraphs: [
          'AI cần ngữ cảnh về việc bạn là ai đối với nhân vật. Hai người là người lạ? Bạn cũ? Đối thủ? Chỉ một câu ngắn trong tin nhắn đầu tiên đã có thể định hình toàn bộ cuộc trò chuyện.',
          'Ví dụ: "Chúng mình chẳng nói chuyện với nhau từ ngày tốt nghiệp, và tôi hồi hộp khi bước đến bàn của bạn." Câu này cho nhân vật thấy có quá khứ, có căng thẳng, và có lý do khiến khoảnh khắc này quan trọng. AI sẽ khai thác triệt để sự năng động đó.',
        ],
      },
      {
        heading: 'Mẫu 3: Thêm chiều sâu cảm xúc',
        paragraphs: [
          'Nhân vật sẽ sống động hơn khi bạn cho thấy mình đang cảm thấy gì, chứ không chỉ đang làm gì. Một chút cảm xúc chân thật trong tin nhắn sẽ mời gọi nhân vật đáp lại bằng cảm xúc của chính họ.',
          'Ví dụ: "*Tôi cố giữ giọng bình tĩnh, nhưng hai tay đang run.* Tôi không nghĩ mình sẽ còn được gặp bạn nữa." Sự yếu đuối ở đây cho nhân vật "quyền" được yếu đuối theo — và đó chính là nơi những khoảnh khắc roleplay tuyệt vời nhất xuất hiện.',
        ],
      },
      {
        heading: 'Mẫu 4: Tạo một chút căng thẳng nhẹ nhàng',
        paragraphs: [
          'Một cuộc trò chuyện quá dễ dãi sẽ nhanh chóng trở nên nhàm chán. Hãy đưa vào một trở ngại nhỏ — một hiểu lầm, một bí mật, một khoảnh khắc chần chừ — và xem nhân vật tương tác sâu hơn.',
          'Ví dụ: "Tôi muốn nói cho bạn sự thật, nhưng mỗi lần mở lời, những chữ ấy cứ mắc kẹt nơi cổ họng." Điều này cho nhân vật lý do để gặng hỏi, để chờ đợi, để thắc mắc. Nó biến một trao đổi phẳng lặng thành một cảnh có sức nặng.',
        ],
      },
      {
        heading: 'Mẫu 5: Tự nhập vai thật sự',
        paragraphs: [
          'Bạn càng giữ vai, AI càng giữ vai theo. Hãy dùng dấu sao cho hành động, dấu nháy cho lời thoại, và giữ các bình luận ngoài vai ngắn gọn. Bạn không cần hoàn hảo — chỉ cần nhất quán.',
          'Ví dụ: "*Tôi cẩn thận đặt chiếc cốc xuống.* \'Cậu lúc nào cũng biết khi nào tôi nói dối.\'" Chú ý cách hành động và lời thoại phối hợp với nhau. Giờ nhân vật đã có một cử chỉ, một giọng điệu và một lời buộc tội để đáp lại.',
        ],
      },
      {
        heading: 'Kết hợp tất cả lại',
        paragraphs: [
          'Bạn không cần dùng cả năm kỹ thuật trong mỗi tin nhắn. Hãy chọn một hoặc hai cái phù hợp với khoảnh khắc đó, rồi để cuộc trò chuyện tuôn chảy tự nhiên. Roleplay hay nhất giống như tấu hài ứng biến — hai bên xây dựng tiếp nối nhau, từng tin nhắn một.',
          'Nhớ rằng: nhân vật được dẫn dắt bởi thẻ của họ và đầu vào của bạn. Nếu một phản hồi có vẻ lệch, hãy thử diễn đạt lại tin nhắn với nhiều chi tiết hoặc cảm xúc hơn. Chỉ một thay đổi nhỏ trong cách viết cũng có thể biến đổi hoàn toàn phản hồi của nhân vật.',
        ],
      },
    ],
    internalLinks: [
      { label: 'Khám phá nhân vật', to: '/characters' },
      { label: 'Mở ứng dụng', to: '/app' },
      { label: 'Mẹo để roleplay tốt hơn', to: '/guides/tips-for-better-roleplay' },
      { label: 'Cách bắt đầu AI roleplay', to: '/guides/how-to-start-ai-roleplay' },
    ],
  },
];
