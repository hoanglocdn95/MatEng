(() => {
  const L = (id, title, enTitle, minutes, words, sentence, vi, visual, check) => ({
    id, title, enTitle, minutes, words, sentence, vi, visual, check
  });
  const U = (id, title, enTitle, emoji, description, lessons) => ({
    id, title, enTitle, emoji, description, lessons
  });
  const G = (id, note, units) => ({ id, label: `Lớp ${id}`, note, units });

  window.MATENG_CURRICULUM = [
    G(1, "Làm quen với câu Toán tiếng Anh thật ngắn", [
      U("g1-count", "Đếm và trả lời", "Count & answer", "●●●", "Nhìn, đếm và nói số lượng.", [
        L("g1-count-1", "Có bao nhiêu?", "How many?", 5,
          [{ en: "how many", vi: "bao nhiêu" }, { en: "count", vi: "đếm" }],
          "How many stars?", "Có bao nhiêu ngôi sao?",
          { type: "objects", symbol: "★", count: 5, color: "mango" },
          { display: "★★★★★", prompt: "How many stars?", vi: "Có bao nhiêu ngôi sao?", choices: ["Three", "Four", "Five"], answer: "Five" }),
        L("g1-count-2", "Nói số lượng", "Say the number", 5,
          [{ en: "there are", vi: "có" }, { en: "five", vi: "năm" }],
          "There are five stars.", "Có năm ngôi sao.",
          { type: "objects", symbol: "★", count: 5, color: "mango" },
          { display: "● ● ● ● ●", prompt: "Complete: There are ___ dots.", vi: "Điền số còn thiếu.", choices: ["three", "four", "five"], answer: "five" })
      ]),
      U("g1-add", "Cộng trong phạm vi 10", "Add within 10", "3＋2", "Nghe và nói một phép cộng.", [
        L("g1-add-1", "Plus và equals", "Plus & equals", 6,
          [{ en: "plus", vi: "cộng" }, { en: "equals", vi: "bằng" }],
          "Three plus two equals five.", "Ba cộng hai bằng năm.",
          { type: "equation", left: 3, operator: "+", right: 2, result: 5 },
          { display: "3 + 2 = ?", prompt: "What is three plus two?", vi: "Ba cộng hai bằng mấy?", choices: ["four", "five", "six"], answer: "five" }),
        L("g1-add-2", "Tất cả có bao nhiêu?", "How many altogether?", 6,
          [{ en: "altogether", vi: "tất cả" }, { en: "six", vi: "sáu" }],
          "There are six altogether.", "Có tất cả sáu.",
          { type: "groups", a: 4, b: 2, symbol: "●" },
          { display: "●●●●  +  ●●", prompt: "How many altogether?", vi: "Có tất cả bao nhiêu?", choices: ["five", "six", "seven"], answer: "six" })
      ]),
      U("g1-shapes", "Hình quen thuộc", "Friendly shapes", "△○□", "Gọi tên và mô tả hình.", [
        L("g1-shape-1", "Gọi tên hình", "Name the shape", 5,
          [{ en: "triangle", vi: "hình tam giác" }, { en: "shape", vi: "hình" }],
          "It is a triangle.", "Đó là một hình tam giác.",
          { type: "shape", shape: "triangle" },
          { display: "△", prompt: "What shape is it?", vi: "Đây là hình gì?", choices: ["a circle", "a triangle", "a square"], answer: "a triangle" }),
        L("g1-shape-2", "Đếm cạnh", "Count the sides", 6,
          [{ en: "side", vi: "cạnh" }, { en: "three", vi: "ba" }],
          "It has three sides.", "Hình có ba cạnh.",
          { type: "shape", shape: "triangle", marks: true },
          { display: "△", prompt: "How many sides?", vi: "Có bao nhiêu cạnh?", choices: ["two", "three", "four"], answer: "three" })
      ]),
      U("g1-position", "Vị trí", "Where is it?", "↑ ↓", "Dùng từ chỉ vị trí rất cơ bản.", [
        L("g1-position-1", "Trên và dưới", "Above & below", 5,
          [{ en: "above", vi: "ở trên" }, { en: "below", vi: "ở dưới" }],
          "The circle is above the square.", "Hình tròn ở trên hình vuông.",
          { type: "position", top: "●", bottom: "■" },
          { display: "●\n■", prompt: "Where is the circle?", vi: "Hình tròn ở đâu?", choices: ["above the square", "below the square", "in the square"], answer: "above the square" }),
        L("g1-position-2", "Trái và phải", "Left & right", 5,
          [{ en: "left", vi: "bên trái" }, { en: "right", vi: "bên phải" }],
          "The triangle is on the left.", "Hình tam giác ở bên trái.",
          { type: "position-row", left: "▲", right: "●" },
          { display: "▲     ●", prompt: "Where is the triangle?", vi: "Hình tam giác ở đâu?", choices: ["on the left", "on the right", "above"], answer: "on the left" })
      ])
    ]),

    G(2, "Dùng câu ngắn với số, độ dài và thời gian", [
      U("g2-place", "Chục và đơn vị", "Tens & ones", "10＋1", "Nhìn số theo chục và đơn vị.", [
        L("g2-place-1", "Hai chục", "Two tens", 6,
          [{ en: "tens", vi: "hàng chục" }, { en: "ones", vi: "hàng đơn vị" }],
          "Twenty-four has two tens and four ones.", "Số 24 có hai chục và bốn đơn vị.",
          { type: "base-ten", tens: 2, ones: 4 },
          { display: "24", prompt: "How many tens?", vi: "Có bao nhiêu chục?", choices: ["one ten", "two tens", "four tens"], answer: "two tens" }),
        L("g2-place-2", "Đọc số", "Read the number", 5,
          [{ en: "twenty", vi: "hai mươi" }, { en: "four", vi: "bốn" }],
          "This number is twenty-four.", "Số này là hai mươi bốn.",
          { type: "number", value: "24" },
          { display: "24", prompt: "Read the number.", vi: "Đọc số này.", choices: ["fourteen", "twenty-four", "forty-two"], answer: "twenty-four" })
      ]),
      U("g2-calculate", "Cộng và trừ", "Add & subtract", "35−12", "Nói phép tính hai chữ số.", [
        L("g2-calc-1", "Cộng hai số", "Add two numbers", 6,
          [{ en: "add", vi: "cộng" }, { en: "sum", vi: "tổng" }],
          "Twenty plus fifteen equals thirty-five.", "Hai mươi cộng mười lăm bằng ba mươi lăm.",
          { type: "equation-text", value: "20 + 15 = 35" },
          { display: "20 + 15 = ?", prompt: "What is the sum?", vi: "Tổng là bao nhiêu?", choices: ["twenty-five", "thirty-five", "forty-five"], answer: "thirty-five" }),
        L("g2-calc-2", "Còn lại", "How many are left?", 6,
          [{ en: "minus", vi: "trừ" }, { en: "left", vi: "còn lại" }],
          "Fifteen minus six equals nine.", "Mười lăm trừ sáu bằng chín.",
          { type: "equation-text", value: "15 − 6 = 9" },
          { display: "15 − 6 = ?", prompt: "How many are left?", vi: "Còn lại bao nhiêu?", choices: ["eight", "nine", "ten"], answer: "nine" })
      ]),
      U("g2-measure", "Đo độ dài", "Measure length", "↔ cm", "Đọc số đo quen thuộc.", [
        L("g2-measure-1", "Dài bao nhiêu?", "How long?", 5,
          [{ en: "long", vi: "dài" }, { en: "centimetres", vi: "xăng-ti-mét" }],
          "The pencil is ten centimetres long.", "Bút chì dài mười xăng-ti-mét.",
          { type: "ruler", value: 10 },
          { display: "✏️  10 cm", prompt: "How long is the pencil?", vi: "Bút chì dài bao nhiêu?", choices: ["eight centimetres", "ten centimetres", "twelve centimetres"], answer: "ten centimetres" }),
        L("g2-measure-2", "Dài hơn", "Longer than", 5,
          [{ en: "longer", vi: "dài hơn" }, { en: "shorter", vi: "ngắn hơn" }],
          "The blue line is longer.", "Đường màu xanh dài hơn.",
          { type: "lines", a: 80, b: 150 },
          { display: "red ━━━\nblue ━━━━━━━", prompt: "Which line is longer?", vi: "Đường nào dài hơn?", choices: ["the red line", "the blue line", "they are the same"], answer: "the blue line" })
      ]),
      U("g2-time", "Xem giờ", "Tell the time", "◷", "Nói giờ đúng và nửa giờ.", [
        L("g2-time-1", "Giờ đúng", "O’clock", 5,
          [{ en: "o’clock", vi: "giờ đúng" }, { en: "time", vi: "giờ" }],
          "It is three o’clock.", "Bây giờ là ba giờ.",
          { type: "clock", hour: 3, minute: 0 },
          { display: "🕒", prompt: "What time is it?", vi: "Mấy giờ rồi?", choices: ["two o’clock", "three o’clock", "four o’clock"], answer: "three o’clock" }),
        L("g2-time-2", "Nửa giờ", "Half past", 6,
          [{ en: "half past", vi: "giờ rưỡi" }, { en: "four", vi: "bốn" }],
          "It is half past four.", "Bây giờ là bốn giờ rưỡi.",
          { type: "clock", hour: 4, minute: 30 },
          { display: "🕟", prompt: "What time is it?", vi: "Mấy giờ rồi?", choices: ["half past three", "half past four", "five o’clock"], answer: "half past four" })
      ])
    ]),

    G(3, "Nói về nhóm, chia đều và phân số quen thuộc", [
      U("g3-times", "Nhân theo nhóm", "Groups & times", "3×4", "Nhìn các nhóm và nói phép nhân.", [
        L("g3-times-1", "Các nhóm bằng nhau", "Equal groups", 6,
          [{ en: "groups", vi: "các nhóm" }, { en: "each", vi: "mỗi nhóm" }],
          "There are four groups of three.", "Có bốn nhóm, mỗi nhóm ba.",
          { type: "array", rows: 4, cols: 3 },
          { display: "●●●  ●●●  ●●●  ●●●", prompt: "How many groups?", vi: "Có bao nhiêu nhóm?", choices: ["three groups", "four groups", "twelve groups"], answer: "four groups" }),
        L("g3-times-2", "Phép nhân", "Times", 6,
          [{ en: "times", vi: "nhân" }, { en: "twelve", vi: "mười hai" }],
          "Four times three equals twelve.", "Bốn nhân ba bằng mười hai.",
          { type: "equation-text", value: "4 × 3 = 12" },
          { display: "4 × 3 = ?", prompt: "What is four times three?", vi: "Bốn nhân ba bằng mấy?", choices: ["seven", "twelve", "sixteen"], answer: "twelve" })
      ]),
      U("g3-divide", "Chia đều", "Share equally", "12÷3", "Chia đồ vật thành các nhóm bằng nhau.", [
        L("g3-divide-1", "Chia thành nhóm", "Share into groups", 6,
          [{ en: "share", vi: "chia" }, { en: "equally", vi: "đều" }],
          "Share twelve sweets equally.", "Chia đều mười hai viên kẹo.",
          { type: "array", rows: 3, cols: 4 },
          { display: "12 sweets → 3 groups", prompt: "How many in each group?", vi: "Mỗi nhóm có bao nhiêu?", choices: ["three", "four", "six"], answer: "four" }),
        L("g3-divide-2", "Phép chia", "Divided by", 6,
          [{ en: "divided by", vi: "chia cho" }, { en: "equals", vi: "bằng" }],
          "Twelve divided by three equals four.", "Mười hai chia ba bằng bốn.",
          { type: "equation-text", value: "12 ÷ 3 = 4" },
          { display: "12 ÷ 3 = ?", prompt: "Choose the answer.", vi: "Chọn đáp án.", choices: ["three", "four", "nine"], answer: "four" })
      ]),
      U("g3-fractions", "Một nửa và một phần tư", "Halves & quarters", "½ ¼", "Nhận biết phân số bằng hình.", [
        L("g3-fraction-1", "Một nửa", "One half", 5,
          [{ en: "half", vi: "một nửa" }, { en: "equal parts", vi: "các phần bằng nhau" }],
          "One half is shaded.", "Một nửa được tô màu.",
          { type: "fraction", parts: 2, shaded: 1 },
          { display: "◐", prompt: "How much is shaded?", vi: "Bao nhiêu phần được tô?", choices: ["one half", "one quarter", "one whole"], answer: "one half" }),
        L("g3-fraction-2", "Một phần tư", "One quarter", 5,
          [{ en: "quarter", vi: "một phần tư" }, { en: "four parts", vi: "bốn phần" }],
          "The square has four equal parts.", "Hình vuông có bốn phần bằng nhau.",
          { type: "fraction", parts: 4, shaded: 1 },
          { display: "▰", prompt: "One part out of four is…", vi: "Một phần trong bốn phần là…", choices: ["one half", "one quarter", "one third"], answer: "one quarter" })
      ]),
      U("g3-data", "Đọc biểu đồ", "Read a chart", "▥", "Trả lời câu hỏi từ biểu đồ đơn giản.", [
        L("g3-data-1", "Nhiều nhất", "The most", 6,
          [{ en: "the most", vi: "nhiều nhất" }, { en: "votes", vi: "lượt chọn" }],
          "Blue has the most votes.", "Màu xanh có nhiều lượt chọn nhất.",
          { type: "bars", values: [3, 6, 4] },
          { display: "red 3 · blue 6 · green 4", prompt: "Which has the most votes?", vi: "Màu nào có nhiều lượt chọn nhất?", choices: ["red", "blue", "green"], answer: "blue" }),
        L("g3-data-2", "Ít nhất", "The fewest", 6,
          [{ en: "the fewest", vi: "ít nhất" }, { en: "chart", vi: "biểu đồ" }],
          "Red has the fewest votes.", "Màu đỏ có ít lượt chọn nhất.",
          { type: "bars", values: [2, 5, 4] },
          { display: "red 2 · blue 5 · green 4", prompt: "Which has the fewest votes?", vi: "Màu nào có ít lượt chọn nhất?", choices: ["red", "blue", "green"], answer: "red" })
      ])
    ]),

    G(4, "Giải thích bằng câu quen thuộc, không dùng ngữ pháp khó", [
      U("g4-numbers", "Số lớn", "Large numbers", "1,000", "Đọc và so sánh số.", [
        L("g4-number-1", "Một nghìn", "One thousand", 5,
          [{ en: "thousand", vi: "nghìn" }, { en: "hundred", vi: "trăm" }],
          "The number is one thousand two hundred.", "Số này là một nghìn hai trăm.",
          { type: "number", value: "1,200" },
          { display: "1,200", prompt: "Read the number.", vi: "Đọc số này.", choices: ["one thousand two hundred", "twelve thousand", "one hundred and two"], answer: "one thousand two hundred" }),
        L("g4-number-2", "Lớn hơn", "Greater than", 6,
          [{ en: "greater than", vi: "lớn hơn" }, { en: "less than", vi: "bé hơn" }],
          "One thousand is greater than nine hundred.", "Một nghìn lớn hơn chín trăm.",
          { type: "compare", left: "1,000", right: "900", sign: ">" },
          { display: "1,000 ___ 900", prompt: "Choose the sign.", vi: "Chọn dấu thích hợp.", choices: ["greater than", "less than", "equal to"], answer: "greater than" })
      ]),
      U("g4-angles", "Góc", "Angles", "∟", "Nhận biết các loại góc cơ bản.", [
        L("g4-angle-1", "Góc vuông", "Right angle", 5,
          [{ en: "angle", vi: "góc" }, { en: "right angle", vi: "góc vuông" }],
          "This is a right angle.", "Đây là một góc vuông.",
          { type: "angle", kind: "right" },
          { display: "∟", prompt: "What angle is this?", vi: "Đây là góc gì?", choices: ["a right angle", "an acute angle", "an obtuse angle"], answer: "a right angle" }),
        L("g4-angle-2", "Góc nhọn", "Acute angle", 5,
          [{ en: "acute", vi: "nhọn" }, { en: "smaller", vi: "nhỏ hơn" }],
          "An acute angle is smaller than a right angle.", "Góc nhọn nhỏ hơn góc vuông.",
          { type: "angle", kind: "acute" },
          { display: "∠", prompt: "This angle is smaller than a right angle. It is…", vi: "Góc này nhỏ hơn góc vuông. Đây là…", choices: ["acute", "right", "straight"], answer: "acute" })
      ]),
      U("g4-area", "Chu vi và diện tích", "Perimeter & area", "▭", "Dùng hai công thức quen thuộc.", [
        L("g4-area-1", "Chu vi", "Perimeter", 6,
          [{ en: "perimeter", vi: "chu vi" }, { en: "around", vi: "xung quanh" }],
          "Perimeter is the distance around a shape.", "Chu vi là độ dài xung quanh một hình.",
          { type: "rectangle", width: 4, height: 2, outline: true },
          { display: "rectangle: 4 cm by 2 cm", prompt: "What is the perimeter?", vi: "Chu vi bằng bao nhiêu?", choices: ["6 centimetres", "8 centimetres", "12 centimetres"], answer: "12 centimetres" }),
        L("g4-area-2", "Diện tích", "Area", 6,
          [{ en: "area", vi: "diện tích" }, { en: "square units", vi: "đơn vị vuông" }],
          "The area is length times width.", "Diện tích bằng chiều dài nhân chiều rộng.",
          { type: "grid", rows: 2, cols: 4 },
          { display: "4 × 2 squares", prompt: "What is the area?", vi: "Diện tích bằng bao nhiêu?", choices: ["six square units", "eight square units", "twelve square units"], answer: "eight square units" })
      ]),
      U("g4-fractions", "So sánh phân số", "Compare fractions", "½ > ¼", "So sánh bằng hình và câu ngắn.", [
        L("g4-fraction-1", "Phân số lớn hơn", "A larger fraction", 6,
          [{ en: "greater", vi: "lớn hơn" }, { en: "fraction", vi: "phân số" }],
          "One half is greater than one quarter.", "Một phần hai lớn hơn một phần tư.",
          { type: "compare", left: "½", right: "¼", sign: ">" },
          { display: "½ ___ ¼", prompt: "Complete the sentence.", vi: "Hoàn thành câu.", choices: ["is greater than", "is less than", "is equal to"], answer: "is greater than" }),
        L("g4-fraction-2", "Phân số bằng nhau", "Equal fractions", 6,
          [{ en: "equal fractions", vi: "các phân số bằng nhau" }, { en: "same amount", vi: "cùng một lượng" }],
          "One half and two quarters are equal.", "Một phần hai và hai phần tư bằng nhau.",
          { type: "compare", left: "½", right: "²⁄₄", sign: "=" },
          { display: "½ ___ ²⁄₄", prompt: "Choose the sign.", vi: "Chọn dấu.", choices: ["greater than", "less than", "equal to"], answer: "equal to" })
      ])
    ]),

    G(5, "Dùng tiếng Anh cơ bản với số thập phân, phần trăm và thể tích", [
      U("g5-decimals", "Số thập phân", "Decimals", "2.5", "Đọc và so sánh số thập phân.", [
        L("g5-decimal-1", "Dấu chấm", "Point", 5,
          [{ en: "point", vi: "phẩy" }, { en: "decimal", vi: "số thập phân" }],
          "Two point five is a decimal number.", "Hai phẩy năm là một số thập phân.",
          { type: "number", value: "2.5" },
          { display: "2.5", prompt: "Read the number.", vi: "Đọc số này.", choices: ["two five", "two point five", "twenty-five"], answer: "two point five" }),
        L("g5-decimal-2", "So sánh", "Compare decimals", 6,
          [{ en: "larger", vi: "lớn hơn" }, { en: "smaller", vi: "nhỏ hơn" }],
          "Three point two is larger than two point nine.", "Ba phẩy hai lớn hơn hai phẩy chín.",
          { type: "compare", left: "3.2", right: "2.9", sign: ">" },
          { display: "3.2 ___ 2.9", prompt: "Choose the words.", vi: "Chọn cụm từ.", choices: ["is larger than", "is smaller than", "is equal to"], answer: "is larger than" })
      ]),
      U("g5-percent", "Phần trăm", "Percent", "50%", "Kết nối phần trăm với phân số quen thuộc.", [
        L("g5-percent-1", "Năm mươi phần trăm", "Fifty percent", 5,
          [{ en: "percent", vi: "phần trăm" }, { en: "half", vi: "một nửa" }],
          "Fifty percent means one half.", "Năm mươi phần trăm có nghĩa là một nửa.",
          { type: "percent", value: 50 },
          { display: "50% = ?", prompt: "Choose the fraction.", vi: "Chọn phân số.", choices: ["one half", "one quarter", "one tenth"], answer: "one half" }),
        L("g5-percent-2", "Hai mươi lăm phần trăm", "Twenty-five percent", 6,
          [{ en: "twenty-five percent", vi: "hai mươi lăm phần trăm" }, { en: "quarter", vi: "một phần tư" }],
          "Twenty-five percent means one quarter.", "Hai mươi lăm phần trăm có nghĩa là một phần tư.",
          { type: "percent", value: 25 },
          { display: "25% = ?", prompt: "Choose the fraction.", vi: "Chọn phân số.", choices: ["one half", "one quarter", "one fifth"], answer: "one quarter" })
      ]),
      U("g5-volume", "Thể tích", "Volume", "▦", "Đếm khối lập phương đơn vị.", [
        L("g5-volume-1", "Khối lập phương", "Cubes", 6,
          [{ en: "cube", vi: "khối lập phương" }, { en: "volume", vi: "thể tích" }],
          "The shape has eight cubes.", "Hình có tám khối lập phương.",
          { type: "cubes", count: 8 },
          { display: "2 × 2 × 2", prompt: "How many cubes?", vi: "Có bao nhiêu khối?", choices: ["six", "eight", "twelve"], answer: "eight" }),
        L("g5-volume-2", "Đơn vị khối", "Cubic units", 6,
          [{ en: "cubic units", vi: "đơn vị khối" }, { en: "length", vi: "chiều dài" }],
          "Volume is length times width times height.", "Thể tích bằng chiều dài nhân chiều rộng nhân chiều cao.",
          { type: "equation-text", value: "2 × 3 × 4 = 24" },
          { display: "2 × 3 × 4", prompt: "What is the volume?", vi: "Thể tích bằng bao nhiêu?", choices: ["nine cubic units", "twenty-four cubic units", "thirty-six cubic units"], answer: "twenty-four cubic units" })
      ]),
      U("g5-units", "Đổi đơn vị", "Convert units", "1 m", "Nói các quan hệ đơn vị quen thuộc.", [
        L("g5-units-1", "Mét và xăng-ti-mét", "Metres & centimetres", 5,
          [{ en: "metre", vi: "mét" }, { en: "centimetres", vi: "xăng-ti-mét" }],
          "One metre equals one hundred centimetres.", "Một mét bằng một trăm xăng-ti-mét.",
          { type: "conversion", from: "1 m", to: "100 cm" },
          { display: "1 m = ? cm", prompt: "Complete the conversion.", vi: "Hoàn thành phép đổi.", choices: ["10", "100", "1,000"], answer: "100" }),
        L("g5-units-2", "Ki-lô-gam và gam", "Kilograms & grams", 5,
          [{ en: "kilogram", vi: "ki-lô-gam" }, { en: "grams", vi: "gam" }],
          "One kilogram equals one thousand grams.", "Một ki-lô-gam bằng một nghìn gam.",
          { type: "conversion", from: "1 kg", to: "1,000 g" },
          { display: "1 kg = ? g", prompt: "Complete the conversion.", vi: "Hoàn thành phép đổi.", choices: ["100", "500", "1,000"], answer: "1,000" })
      ])
    ])
  ];
})();
