"use strict";
(() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __esm = (fn, res, err) => function __init() {
    if (err) throw err[0];
    try {
      return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
    } catch (e) {
      throw err = [e], e;
    }
  };
  var __commonJS = (cb, mod) => function __require() {
    try {
      return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
    } catch (e) {
      throw mod = 0, e;
    }
  };
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

  // src/randomHelper.ts
  var RandomHelper;
  var init_randomHelper = __esm({
    "src/randomHelper.ts"() {
      "use strict";
      RandomHelper = class {
        static random() {
          return Math.random();
        }
        static randomInt(max) {
          return Math.floor(Math.random() * max);
        }
        static randomBoolean(p = 0.5) {
          return Math.random() < p;
        }
        static randomIntRange(min, max) {
          return Math.floor(Math.random() * (max - min)) + min;
        }
        static randomDistribution(distribution) {
          const sum = distribution.reduce((acc2, num) => acc2 + num, 0);
          var r = Math.random();
          var acc = 0;
          for (var i = 0; i < distribution.length; i++) {
            acc += distribution[i];
            if (r < acc / sum) {
              return i;
            }
          }
          return distribution.length - 1;
        }
        static randomFrom(array) {
          var r = this.randomInt(array.length);
          return array[r];
        }
      };
    }
  });

  // src/generators/binary.ts
  var BinaryGenerator;
  var init_binary = __esm({
    "src/generators/binary.ts"() {
      "use strict";
      init_randomHelper();
      BinaryGenerator = class {
        constructor() {
          __publicField(this, "str1", "");
          __publicField(this, "str2", "");
          //0: binary, 1: decimal, 2: hex
          __publicField(this, "type1", 0);
          __publicField(this, "type2", 1);
          __publicField(this, "difficulty", 3);
        }
        getFrontBack() {
          const options = [
            [0, 1, [0, 1, 2, 3, 2, 1, 0, 0]],
            [0, 2, [0, 0, 0, 0, 0, 0, 0, 1]],
            [1, 0, [0, 0, 1, 2, 3, 4, 3, 1]],
            [2, 0, [0, 0, 0, 0, 0, 0, 0, 1]],
            [2, 1, [1, 2, 3, 2, 1, 0, 0, 0]],
            [1, 2, [1, 2, 3, 2, 1, 0, 0, 0]]
          ];
          var option = RandomHelper.randomFrom(options);
          this.type1 = option[0];
          this.type2 = option[1];
          this.difficulty = RandomHelper.randomDistribution(option[2]);
          const bits = [
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false
          ];
          if (this.difficulty === 0) {
            for (let i = 0; i < 8; i++) {
              if (Math.random() < 0.5) {
                bits[i] = !bits[i];
              }
            }
          } else {
            for (let i = 0; i < this.difficulty; i++) {
              const index = Math.floor(Math.random() * 8);
              bits[index] = true;
            }
          }
          if (this.type1 === 0) {
            this.str1 = this.toBinary(bits);
          } else if (this.type1 === 1) {
            this.str1 = this.toDecimal(bits);
          } else if (this.type1 === 2) {
            this.str1 = this.toHex(bits);
          }
          var targetType = "";
          if (this.type2 === 0) {
            this.str2 = this.toBinary(bits);
            targetType = "binary";
          } else if (this.type2 === 1) {
            this.str2 = this.toDecimal(bits);
            targetType = "decimal";
          } else if (this.type2 === 2) {
            this.str2 = this.toHex(bits);
            targetType = "hex";
          }
          return ["<h3>" + this.str1 + "</h3><p>in " + targetType + "</p>", "<h3>" + this.str2 + "</h3>"];
        }
        toBinary(bits) {
          let result = "";
          for (let i = 0; i < 4; i++) {
            result += bits[i] ? "1" : "0";
          }
          result += " ";
          for (let i = 4; i < 8; i++) {
            result += bits[i] ? "1" : "0";
          }
          return result;
        }
        toDecimal(bits) {
          let num = 0;
          for (let i = 0; i < 8; i++) {
            if (bits[7 - i]) {
              num += 1 << i;
            }
          }
          return num.toString();
        }
        toHex(bits) {
          const chars = [
            "0",
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "a",
            "b",
            "c",
            "d",
            "e",
            "f"
          ];
          let num1 = 0;
          for (let i = 0; i < 4; i++) {
            if (bits[7 - i]) {
              num1 += 1 << i;
            }
          }
          let num2 = 0;
          for (let i = 4; i < 8; i++) {
            if (bits[7 - i]) {
              num2 += 1 << i - 4;
            }
          }
          return "0x" + chars[num2] + chars[num1];
        }
      };
    }
  });

  // src/generators/capitalDistances.ts
  var CapitalDistances;
  var init_capitalDistances = __esm({
    "src/generators/capitalDistances.ts"() {
      "use strict";
      init_randomHelper();
      CapitalDistances = class {
        constructor() {
          __publicField(this, "capitals", [
            ["Vienna", 48.2082, 16.3738],
            ["Brussels", 50.8503, 4.3517],
            ["Sofia", 42.6977, 23.3219],
            ["Zagreb", 45.815, 15.9819],
            ["Nicosia", 35.1856, 33.3823],
            ["Prague", 50.0755, 14.4378],
            ["Copenhagen", 55.6761, 12.5683],
            ["Tallinn", 59.437, 24.7536],
            ["Helsinki", 60.1699, 24.9384],
            ["Paris", 48.8566, 2.3522],
            ["Berlin", 52.52, 13.405],
            ["Athens", 37.9838, 23.7275],
            ["Budapest", 47.4979, 19.0402],
            ["Reykjavik", 64.1466, -21.9426],
            ["Dublin", 53.3498, -6.2603],
            ["Rome", 41.9028, 12.4964],
            ["Riga", 56.9496, 24.1052],
            ["Vilnius", 54.6872, 25.2797],
            ["Luxembourg", 49.6116, 6.1319],
            ["Valletta", 35.8989, 14.5146],
            ["Chisinau", 47.0105, 28.8638],
            ["Monaco", 43.7384, 7.4246],
            ["Podgorica", 42.4304, 19.2594],
            ["Amsterdam", 52.3676, 4.9041],
            ["Skopje", 41.9973, 21.428],
            ["Oslo", 59.9139, 10.7522],
            ["Warsaw", 52.2297, 21.0122],
            ["Lisbon", 38.7223, -9.1393],
            ["Bucharest", 44.4268, 26.1025],
            ["San Marino", 43.9424, 12.4578],
            ["Belgrade", 44.7866, 20.4489],
            ["Bratislava", 48.1486, 17.1077],
            ["Ljubljana", 46.0569, 14.5058],
            ["Madrid", 40.4168, -3.7038],
            ["Stockholm", 59.3293, 18.0686],
            ["Bern", 46.948, 7.4474],
            ["Ankara", 39.9334, 32.8597],
            ["Kyiv", 50.4501, 30.5234],
            ["London", 51.5074, -0.1278],
            ["Vatican City", 41.9029, 12.4534]
          ]);
        }
        getFrontBack() {
          var i = RandomHelper.randomInt(this.capitals.length);
          var j = RandomHelper.randomInt(this.capitals.length - 1);
          if (j >= i) j += 1;
          var distance = this.distanceKm(
            this.capitals[i][1],
            this.capitals[i][2],
            this.capitals[j][1],
            this.capitals[j][2]
          );
          distance = Math.round(distance / 10) * 10;
          return ["<h3>" + this.capitals[i][0] + ' <span style="font-size: medium;  font-weight: normal;">to</span> ' + this.capitals[j][0] + "</h3><p>How many kilometers?", "<h3>" + distance + "&thinsp;km</h3>"];
        }
        distanceKm(lat1, lon1, lat2, lon2) {
          const R = 6371;
          const toRadians = (degrees) => degrees * Math.PI / 180;
          lat1 = toRadians(lat1);
          lon1 = toRadians(lon1);
          lat2 = toRadians(lat2);
          lon2 = toRadians(lon2);
          const dLat = lat2 - lat1;
          const dLon = lon2 - lon1;
          const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          return R * c;
        }
      };
    }
  });

  // src/generators/equations.ts
  var EquationsGenerator;
  var init_equations = __esm({
    "src/generators/equations.ts"() {
      "use strict";
      init_randomHelper();
      EquationsGenerator = class {
        constructor() {
        }
        getFrontBack() {
          var problem_size = 75;
          var x = 0;
          var x_solution = 0;
          var squaredCase = false;
          var r1 = RandomHelper.randomInt(6);
          if (r1 == 0) {
            x_solution = RandomHelper.randomInt(10) + 1;
            x = x_solution * x_solution;
            squaredCase = true;
          } else {
            x_solution = RandomHelper.randomInt(15) + 1;
            var r11 = RandomHelper.randomInt(4);
            if (r11 == 0) x_solution = -(RandomHelper.randomInt(6) + 1);
            x = x_solution;
          }
          var x_mulipier = RandomHelper.randomInt(problem_size / x_solution) + 1;
          var a = 0;
          var b = 0;
          var c = 0;
          var d = 0;
          var r2 = RandomHelper.randomInt(2);
          var r3 = RandomHelper.randomInt(2);
          if (r2 == 0) {
            var split1 = this.splitIntoTwo(x_mulipier);
            a = split1[0];
            c = split1[1];
            if (r3 == 0 && !squaredCase) {
              var split2 = this.splitIntoTwo(x * x_mulipier);
              d = split2[0];
              b = split2[1];
            } else {
              d = x * x_mulipier;
            }
          } else {
            var split1 = this.splitIntoTwo(x * x_mulipier);
            d = split1[0];
            b = split1[1];
            if (r3 == 0 && !squaredCase) {
              var split2 = this.splitIntoTwo(x_mulipier);
              a = split2[0];
              c = split2[1];
            } else {
              a = x_mulipier;
            }
          }
          var x_string = "x";
          if (squaredCase) x_string = "x<sup>2</sup>";
          var strA = "";
          var strB = "";
          if (a == 0) {
            strA = "" + this.toStringNum(b);
          } else if (b == 0) {
            strA = "" + this.toStringX(a, x_string);
          } else if (a < 0 || b >= 0 && RandomHelper.randomBoolean()) {
            if (a < 0) {
              strA = "" + this.toStringNum(b) + " - " + this.toStringX(a * -1, x_string);
            } else {
              strA = "" + this.toStringNum(b) + " + " + this.toStringX(a, x_string);
            }
          } else {
            if (b < 0) {
              strA = "" + this.toStringX(a, x_string) + " - " + this.toStringNum(b * -1);
            } else {
              strA = "" + this.toStringX(a, x_string) + " + " + this.toStringNum(b);
            }
          }
          if (c == 0) {
            strB = "" + this.toStringNum(d);
          } else if (d == 0) {
            strB = "" + this.toStringX(c, x_string);
          } else if (c < 0 || d >= 0 && RandomHelper.randomBoolean()) {
            if (c < 0) {
              strB = "" + this.toStringNum(d) + " - " + this.toStringX(c * -1, x_string);
            } else {
              strB = "" + this.toStringNum(d) + " + " + this.toStringX(c, x_string);
            }
          } else {
            if (d < 0) {
              strB = "" + this.toStringX(c, x_string) + " - " + this.toStringNum(d * -1);
            } else {
              strB = "" + this.toStringX(c, x_string) + " + " + this.toStringNum(d);
            }
          }
          console.log("x_sol, x_mult" + x_solution + " " + x_mulipier);
          console.log("abcd:" + a + " " + b + " " + c + " " + d);
          var str1 = "";
          if (RandomHelper.randomBoolean()) {
            str1 = strA + " = " + strB;
          } else {
            str1 = strB + " = " + strA;
          }
          return ["<h3>" + str1 + "</h3><p>solve for x</p>", "<h3> x = " + x_solution + "</h3>"];
        }
        splitIntoTwo(n) {
          var sign = n < 0 ? -1 : 1;
          var r = RandomHelper.randomInt(n);
          var r2 = RandomHelper.randomInt(n + r);
          console.log(n + " -> " + (n + r - r2) + " " + (r - r2));
          return [n + r * sign - r2, r * sign - r2];
        }
        toStringNum(n) {
          return "" + n;
        }
        toStringX(n, xString) {
          if (n == 1) return xString;
          if (n == -1) return "-" + xString;
          return "" + n + xString;
        }
      };
    }
  });

  // src/generators/simpleMath.ts
  var SimpleMathGenerator;
  var init_simpleMath = __esm({
    "src/generators/simpleMath.ts"() {
      "use strict";
      SimpleMathGenerator = class {
        constructor() {
          __publicField(this, "result", 0);
          __publicField(this, "string", "");
        }
        getFrontBack() {
          var difficulty = 3;
          var spred = 3;
          const r = Math.random();
          const percentages = [
            [],
            [0.6, 0, 0, 0],
            [0.7, 0.2, 0.1, 0.05],
            [0.65, 0.3, 0.175, 0.05],
            [0.75, 0.5, 0.25, 0.075],
            [0.85, 0.7, 0.4, 0.05],
            [0.9, 0.8, 0.45, 0.1],
            [1, 1, 0.5, 0.15]
          ];
          const p = percentages[spred];
          const diff = difficulty - 1;
          if (r > p[0]) {
            this.nextAddition(diff);
          } else if (r > p[1]) {
            this.nextSubtraction(diff);
          } else if (r > p[2]) {
            this.nextMultiplication(diff);
          } else if (r > p[3]) {
            this.nextDivision(diff);
          } else {
            this.nextPercentage(diff);
          }
          return ["<h3>" + this.string + " =</h3>", "<h3>" + String(this.result) + "</h3>"];
        }
        nextAddition(diff) {
          const maxs1 = [10, 100, 100, 1e3, 1e3];
          const maxs2 = [10, 10, 100, 100, 1e3];
          const a = Math.floor(Math.random() * maxs1[diff]) + 1;
          const b = Math.floor(Math.random() * maxs2[diff]) + 1;
          this.result = a + b;
          this.string = `${a} + ${b}`;
        }
        nextSubtraction(diff) {
          const maxs1 = [10, 100, 100, 1e3, 1e3];
          const fac = [2, 8, 4, 8, 4];
          const a = Math.floor(Math.random() * maxs1[diff]) + 1;
          const b = Math.floor(
            Math.random() * Math.floor(maxs1[diff] / fac[diff])
          ) + 1;
          this.result = a - b;
          this.string = `${a} - ${b}`;
        }
        nextMultiplication(diff) {
          const maxs1 = [8, 13, 16, 30, 40];
          const maxs2 = [8, 9, 11, 12, 40];
          const a = Math.floor(Math.random() * maxs1[diff]) + 2;
          const b = Math.floor(Math.random() * maxs2[diff]) + 2;
          this.result = a * b;
          this.string = `${a} * ${b}`;
        }
        nextDivision(diff) {
          const maxs1 = [10, 15, 60, 100, 100];
          const maxs2 = [5, 8, 10, 30, 40];
          const a = Math.floor(Math.random() * maxs1[diff]);
          const b = Math.floor(Math.random() * maxs2[diff]) + 2;
          this.result = a;
          this.string = `${a * b} / ${b}`;
        }
        nextPercentage(diff) {
          const maxs1 = [5, 10, 50, 100, 100];
          const a = (Math.floor(Math.random() * maxs1[diff]) + 2) * 10;
          const b = Math.floor(Math.random() * 14) + 2;
          this.result = Math.floor(a * b / 10);
          this.string = `${b * 10}% of ${a}`;
        }
      };
    }
  });

  // src/generators/sincos.ts
  var SinCosGenerator;
  var init_sincos = __esm({
    "src/generators/sincos.ts"() {
      "use strict";
      init_randomHelper();
      SinCosGenerator = class {
        constructor() {
          __publicField(this, "j", 0);
          //<mo>-</mo><mfrac><mn>3<mi>π</mi></mn><mn>2</mn></mfrac>
          __publicField(this, "anglesA", ["-90\xB0", "-60\xB0", "-45\xB0", "-30\xB0", "0\xB0", "30\xB0", "45\xB0", "60\xB0", "90\xB0", "120\xB0", "135\xB0", "150\xB0", "180\xB0", "210\xB0", "225\xB0", "240\xB0", "270\xB0", "300\xB0", "315\xB0", "330\xB0", "360\xB0"]);
          __publicField(this, "anglesB", [
            "<mo>-</mo><mfrac><mi>\u03C0</mi><mn>2</mn></mfrac>",
            "<mo>-</mo><mfrac><mi>\u03C0</mi><mn>3</mn></mfrac>",
            "<mo>-</mo><mfrac><mi>\u03C0</mi><mn>4</mn></mfrac>",
            "<mo>-</mo><mfrac><mi>\u03C0</mi><mn>6</mn></mfrac>",
            "<mn>0</mn>",
            "<mfrac><mi>\u03C0</mi><mn>6</mn></mfrac>",
            "<mfrac><mi>\u03C0</mi><mn>4</mn></mfrac>",
            "<mfrac><mi>\u03C0</mi><mn>3</mn></mfrac>",
            "<mfrac><mi>\u03C0</mi><mn>2</mn></mfrac>",
            "<mfrac><mn>2<mi>\u03C0</mi></mn><mn>3</mn></mfrac>",
            "<mfrac><mn>3<mi>\u03C0</mi></mn><mn>4</mn></mfrac>",
            "<mfrac><mn>5<mi>\u03C0</mi></mn><mn>6</mn></mfrac>",
            "<mi>\u03C0</mi>",
            "<mfrac><mn>7<mi>\u03C0</mi></mn><mn>6</mn></mfrac>",
            "<mfrac><mn>5<mi>\u03C0</mi></mn><mn>4</mn></mfrac>",
            "<mfrac><mn>4<mi>\u03C0</mi></mn><mn>3</mn></mfrac>",
            "<mfrac><mn>3<mi>\u03C0</mi></mn><mn>2</mn></mfrac>",
            "<mfrac><mn>5<mi>\u03C0</mi></mn><mn>3</mn></mfrac>",
            "<mfrac><mn>7<mi>\u03C0</mi></mn><mn>4</mn></mfrac>",
            "<mfrac><mn>11<mi>\u03C0</mi></mn><mn>6</mn></mfrac>",
            "<mn>2</mn><mi>\u03C0</mi>"
          ]);
          //private solutions = ["0","1/2","1/√2","√3/2","1"]
          __publicField(this, "solutions", [
            "<mn>0</mn>",
            "<mfrac><mn>1</mn><mn>2</mn></mfrac>",
            "<mfrac><mn>1</mn><msqrt><mn>2</mn></msqrt></mfrac>",
            "<mfrac><msqrt><mn>3</mn></msqrt><mn>2</mn></mfrac>",
            "<mn>1</mn>"
          ]);
        }
        getFrontBack() {
          var _a, _b, _c, _d, _e;
          var front = "";
          var back = "";
          var i = 0;
          if (RandomHelper.randomBoolean()) {
            i = RandomHelper.randomInt(5) + 4;
          } else {
            i = RandomHelper.randomInt(this.anglesA.length);
          }
          if (RandomHelper.randomBoolean()) {
            if (RandomHelper.randomBoolean()) {
              front = `<math xmlns="http://www.w3.org/1998/Math/MathML"> <mi>cos</mi><mo>(</mo><mn>${(_a = this.anglesA[i]) != null ? _a : ""}</mn><mo>)</mo></math>`;
            } else {
              front = `<math xmlns="http://www.w3.org/1998/Math/MathML">
                    <mi>cos</mi><mo>(</mo>${(_b = this.anglesB[i]) != null ? _b : ""}<mo>)</mo>
                    </math>`;
            }
            var sol_index = i % 8;
            if (sol_index >= 5) sol_index = 8 - sol_index;
            var is_negative = Math.floor(i / 8) % 2 == 1;
            if (i % 8 == 0) is_negative = false;
          } else {
            if (RandomHelper.randomBoolean()) {
              front = `<math xmlns="http://www.w3.org/1998/Math/MathML"> <mi>sin</mi><mo>(</mo><mn>${(_c = this.anglesA[i]) != null ? _c : ""}</mn><mo>)</mo></math>`;
            } else {
              front = `<math xmlns="http://www.w3.org/1998/Math/MathML">
                <mi>sin</mi><mo>(</mo>${(_d = this.anglesB[i]) != null ? _d : ""}<mo>)</mo>
                </math>`;
            }
            var sol_index = (i + 12) % 8;
            if (sol_index >= 5) sol_index = 8 - sol_index;
            var is_negative = Math.floor((i + 12) / 8) % 2 == 1;
            if ((i + 12) % 8 == 0) is_negative = false;
          }
          var sign = "";
          if (is_negative) sign = `<mo>-</mo>`;
          back = `<math xmlns="http://www.w3.org/1998/Math/MathML">
            ${sign}${(_e = this.solutions[sol_index]) != null ? _e : ""}
                </math>`;
          return ["<h3>" + front + " =</h3>", "<br><h2>" + back + "</h2>"];
        }
        //
      };
    }
  });

  // src/generators/velocity.ts
  var VelocityGenerator;
  var init_velocity = __esm({
    "src/generators/velocity.ts"() {
      "use strict";
      init_randomHelper();
      VelocityGenerator = class {
        constructor() {
        }
        getFrontBack() {
          var targetType = "bla";
          var str1 = "";
          var str2 = "";
          var v = (RandomHelper.randomInt(20) + 1) * 10;
          var d = 0;
          var distanceType = RandomHelper.randomInt(3);
          if (distanceType == 0) {
            d = (RandomHelper.randomInt(100) + 1) * 10;
          }
          if (distanceType == 1) {
            d = RandomHelper.randomInt(10) + 1;
          }
          if (distanceType == 2) {
            d = v * RandomHelper.randomInt(12 * 10) / 12;
            d = Math.floor(d * 100) / 100;
          }
          var t = d / v;
          return ["<h3>" + v + "&thinsp;km/h for " + d + "&thinsp;km </h3><p>how long?</p>", "<h3>" + this.convertTime(t) + "</h3>"];
        }
        convertTime(t) {
          if (t > 1 / 6) {
            var minutes = Math.round(t % 1 * 60);
            var hour = Math.floor(t);
            return hour + "&thinsp;h " + minutes + "&thinsp;m";
          } else {
            var minutesTotal = t * 60;
            var seconds = Math.round(minutesTotal % 1 * 60);
            var minutes = Math.floor(minutesTotal);
            return minutes + "&thinsp;m " + seconds + "&thinsp;s";
          }
        }
      };
    }
  });

  // src/index.ts
  var require_index = __commonJS({
    "src/index.ts"() {
      init_binary();
      init_capitalDistances();
      init_equations();
      init_simpleMath();
      init_sincos();
      init_velocity();
      var generators = [
        new SimpleMathGenerator(),
        new BinaryGenerator(),
        new VelocityGenerator(),
        new EquationsGenerator(),
        new CapitalDistances(),
        new SinCosGenerator()
      ];
      var backSide = "";
      var backVisible = true;
      function setup() {
        var element = document.getElementById("main-button");
        if (element instanceof HTMLButtonElement) {
          element.onclick = mainButtonPressed;
        }
      }
      function generateNewProblems() {
        var i = Math.floor(Math.random() * generators.length);
        var generator = generators[i];
        var frontBack = generator == null ? void 0 : generator.getFrontBack();
        var front = frontBack[0];
        var back = frontBack[1];
        document.getElementById("front-card").innerHTML = front != null ? front : "";
        document.getElementById("back-card").innerHTML = "";
        backSide = back != null ? back : "";
        backVisible = false;
      }
      function mainButtonPressed() {
        console.log("Button Pressed");
        if (backVisible == false) {
          backVisible = true;
          document.getElementById("back-card").innerHTML = backSide;
        } else {
          generateNewProblems();
        }
      }
      setup();
      console.log("hi?");
    }
  });
  require_index();
})();
//# sourceMappingURL=bundle.js.map
