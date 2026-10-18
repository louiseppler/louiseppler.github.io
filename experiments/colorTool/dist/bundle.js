"use strict";
(() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

  // src/color.ts
  var Color;
  var init_color = __esm({
    "src/color.ts"() {
      "use strict";
      Color = class _Color {
        constructor() {
          __publicField(this, "r", 0);
          __publicField(this, "g", 0);
          __publicField(this, "b", 0);
        }
        // RGB
        getRgb() {
          return { r: this.r, g: this.g, b: this.b };
        }
        setRgb(r, g, b) {
          this.r = r;
          this.g = g;
          this.b = b;
        }
        // HSV
        getHsv() {
          return _Color.rgb_to_hsv(this.r, this.g, this.b);
        }
        setHsv(h, s, v) {
          var rgb = _Color.hsv_to_rgb(h, s, v);
          this.r = rgb.r;
          this.g = rgb.g;
          this.b = rgb.b;
        }
        // other
        setRandom() {
          this.r = Math.floor(Math.random() * 256);
          this.g = Math.floor(Math.random() * 256);
          this.b = Math.floor(Math.random() * 256);
        }
        getHex() {
          var c = this.getRgb();
          return _Color.rgb_to_hex(c.r, c.g, c.b);
        }
        // Static Converters
        static rgb_to_hex(r, g, b) {
          const clamp = (val) => Math.max(0, Math.min(255, val));
          const toHex = (val) => clamp(val).toString(16).padStart(2, "0");
          return `#${toHex(Math.round(r))}${toHex(Math.round(g))}${toHex(Math.round(b))}`;
        }
        static parse_hex(text) {
          const r = parseInt(text.slice(1, 3), 16);
          const g = parseInt(text.slice(3, 5), 16);
          const b = parseInt(text.slice(5, 7), 16);
          return { r, g, b };
        }
        static rgb_to_hsv(r_in, g_in, b_in) {
          let rdif;
          let gdif;
          let bdif;
          let h = 0;
          let s;
          const r = r_in / 255;
          const g = g_in / 255;
          const b = b_in / 255;
          const v = Math.max(r, g, b);
          const diff = v - Math.min(r, g, b);
          const diffc = function(c) {
            return (v - c) / 6 / diff + 1 / 2;
          };
          if (diff === 0) {
            h = 0;
            s = 0;
          } else {
            s = diff / v;
            rdif = diffc(r);
            gdif = diffc(g);
            bdif = diffc(b);
            switch (v) {
              case r: {
                h = bdif - gdif;
                break;
              }
              case g: {
                h = 1 / 3 + rdif - bdif;
                break;
              }
              case b: {
                h = 2 / 3 + gdif - rdif;
                break;
              }
            }
            if (h < 0) {
              h += 1;
            } else if (h > 1) {
              h -= 1;
            }
          }
          return {
            h: h * 360,
            s: s * 100,
            v: v * 100
          };
        }
        static hsv_to_rgb(h_in, s_in, v_in) {
          const h = h_in / 60;
          const s = s_in / 100;
          let v = v_in / 100;
          const hi = Math.floor(h) % 6;
          const f = h - Math.floor(h);
          const p = 255 * v * (1 - s);
          const q = 255 * v * (1 - s * f);
          const t = 255 * v * (1 - s * (1 - f));
          v *= 255;
          switch (hi) {
            case 0: {
              return { r: v, g: t, b: p };
            }
            case 1: {
              return { r: q, g: v, b: p };
            }
            case 2: {
              return { r: p, g: v, b: t };
            }
            case 3: {
              return { r: p, g: q, b: v };
            }
            case 4: {
              return { r: t, g: p, b: v };
            }
            case 5: {
              return { r: v, g: p, b: q };
            }
          }
          return { r: 0, g: 0, b: 0 };
        }
      };
    }
  });

  // src/colorHistory.ts
  var ColorHistory;
  var init_colorHistory = __esm({
    "src/colorHistory.ts"() {
      "use strict";
      ColorHistory = class {
        constructor() {
          __publicField(this, "states", []);
          __publicField(this, "index", -1);
        }
        addState(value) {
          console.log("Adding State");
          if (this.states.length - 1 != this.index) {
            this.states = this.states.slice(0, this.index + 1);
          }
          this.states.push(value);
          this.index += 1;
          this.logState();
          return;
          if (this.states.length == 0 || this.states[this.states.length - 1] != value) {
            this.states.push(value);
            this.index += 1;
          }
        }
        undo() {
          console.log("Undo Called");
          if (this.index > 0) {
            this.index -= 1;
          }
          console.log("at index " + this.index);
          this.logState();
          return this.states[this.index];
        }
        redo() {
          console.log("Redo Called");
          if (this.index < this.states.length - 1) {
            this.index += 1;
          }
          console.log("at index " + this.index);
          this.logState();
          return this.states[this.index];
        }
        logState() {
        }
      };
    }
  });

  // src/appData.ts
  var AppData;
  var init_appData = __esm({
    "src/appData.ts"() {
      "use strict";
      init_color();
      init_colorHistory();
      AppData = class {
        constructor() {
          __publicField(this, "history", new ColorHistory());
          __publicField(this, "updateTextFieldCallback", () => {
          });
          __publicField(this, "colors", []);
          __publicField(this, "selectedColorIndex", 0);
          var color1 = new Color();
          var color2 = new Color();
          color1.setRandom();
          color2.setRandom();
          this.colors.push(color1, color2);
        }
        getSelectedColor() {
          return this.colors[this.selectedColorIndex];
        }
        undo() {
          var colorStrings = this.history.undo();
          if (colorStrings) this.setColorStrings(colorStrings);
          this.updateTextFieldCallback();
        }
        redo() {
          var colorStrings = this.history.redo();
          if (colorStrings) this.setColorStrings(colorStrings);
          this.updateTextFieldCallback();
        }
        setColorStrings(colorStrings) {
          var newColors = colorStrings.map((c, i, _) => {
            var parsed_color = Color.parse_hex(c);
            var color = new Color();
            color.setRgb(parsed_color.r, parsed_color.g, parsed_color.b);
            return color;
          });
          this.colors = newColors;
        }
        saveColorState() {
          var colorStrings = this.colors.map((c) => c.getHex());
          this.history.addState(colorStrings);
          this.updateTextFieldCallback();
        }
      };
    }
  });

  // src/canvas-helper.ts
  function getSquaredDist(x1, y1, x2, y2) {
    return (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);
  }
  var CanvasHelper;
  var init_canvas_helper = __esm({
    "src/canvas-helper.ts"() {
      "use strict";
      CanvasHelper = class {
        constructor(id, width, height, mouseUp, mouseDown, draw, limitedRefresh = false) {
          __publicField(this, "count");
          __publicField(this, "limitedRefresh");
          __publicField(this, "width");
          __publicField(this, "height");
          __publicField(this, "mouseX");
          __publicField(this, "mouseY");
          __publicField(this, "mouseIsPressed");
          __publicField(this, "ctx");
          __publicField(this, "draw");
          this.limitedRefresh = limitedRefresh;
          this.count = 0;
          this.mouseX = 0;
          this.mouseY = 0;
          this.mouseIsPressed = false;
          this.width = width;
          this.height = height;
          console.log("setting up");
          this.draw = draw;
          var scaleFactor = 2;
          var canvas = document.getElementById(id);
          const element = document.getElementById(id);
          element.style.width = width + "px";
          element.style.height = height + "px";
          this.ctx = canvas.getContext("2d");
          canvas.width = Math.ceil(width * scaleFactor);
          canvas.height = Math.ceil(height * scaleFactor);
          this.ctx.scale(scaleFactor, scaleFactor);
          window.requestAnimationFrame(() => {
            this.drawHandler();
          });
          var helper = this;
          canvas.addEventListener("mousemove", function(event) {
            helper.mouseX = event.offsetX;
            helper.mouseY = event.offsetY;
          });
          canvas.addEventListener("mouseup", function(event) {
            helper.mouseIsPressed = false;
            mouseUp();
          });
          canvas.addEventListener("mousedown", function(event) {
            helper.mouseIsPressed = true;
            mouseDown();
          });
          this.clearCanvas();
        }
        drawHandler() {
          if (!this.limitedRefresh) {
            this.draw();
          } else {
            this.count += 1;
            if (this.mouseIsPressed || this.count % 20 == 0) {
              this.draw();
            }
          }
          window.requestAnimationFrame(() => {
            this.drawHandler();
          });
        }
        drawDot(x, y, r, start = 0, end = 2 * Math.PI) {
          this.ctx.beginPath();
          this.ctx.arc(x, y, r, start, end);
          this.ctx.fill();
        }
        drawCircle(x, y, r, start = 0, end = 2 * Math.PI) {
          this.ctx.beginPath();
          this.ctx.arc(x, y, r, start, end);
          this.ctx.stroke();
        }
        drawLine(x1, y1, x2, y2) {
          this.ctx.beginPath();
          this.ctx.moveTo(x1, y1);
          this.ctx.lineTo(x2, y2);
          this.ctx.stroke();
        }
        drawTriangle(x1, y1, x2, y2, x3, y3) {
          this.ctx.beginPath();
          this.ctx.moveTo(x1, y1);
          this.ctx.lineTo(x2, y2);
          this.ctx.lineTo(x3, y3);
          this.ctx.fill();
        }
        drawRingArc(cx, cy, innerR, outerR, start, end) {
          this.ctx.beginPath();
          this.ctx.arc(cx, cy, outerR, start, end, false);
          this.ctx.arc(cx, cy, innerR, end, start, true);
          this.ctx.closePath();
          this.ctx.fill();
        }
        drawLeftArrow(x, y, width, height) {
          const padding = height * 0.3;
          const midY = y + height / 2;
          const headSize = height * 0.2;
          this.ctx.beginPath();
          this.ctx.moveTo(x + padding, midY);
          this.ctx.lineTo(x + width - padding, midY);
          this.ctx.moveTo(x + padding + headSize, midY - headSize);
          this.ctx.lineTo(x + padding, midY);
          this.ctx.lineTo(x + padding + headSize, midY + headSize);
          this.ctx.stroke();
        }
        drawRightArrow(x, y, width, height) {
          const padding = height * 0.3;
          const midY = y + height / 2;
          const headSize = height * 0.2;
          this.ctx.beginPath();
          this.ctx.moveTo(x + padding, midY);
          this.ctx.lineTo(x + width - padding, midY);
          this.ctx.moveTo(x + width - padding - headSize, midY - headSize);
          this.ctx.lineTo(x + width - padding, midY);
          this.ctx.lineTo(x + width - padding - headSize, midY + headSize);
          this.ctx.stroke();
        }
        fillTextLeft(str, x, y) {
          this.ctx.fillText("" + str, x, y);
        }
        fillTextCenter(str, x, y) {
          var textWidth = this.ctx.measureText(str).width;
          this.ctx.fillText("" + str, x - textWidth / 2, y);
        }
        fillTextRight(str, x, y) {
          var textWidth = this.ctx.measureText(str).width;
          this.ctx.fillText("" + str, x - textWidth, y);
        }
        clearCanvas() {
          this.ctx.fillStyle = "lightgray";
          this.ctx.fillRect(0, 0, this.width, this.height);
        }
        clearCanvasWhite() {
          this.ctx.fillStyle = "#eee";
          this.ctx.fillRect(0, 0, this.width, this.height);
        }
        logLive(text) {
          this.ctx.fillStyle = "#fff";
          this.ctx.textAlign = "left";
          this.ctx.fillRect(0, 0, 200, 20);
          this.ctx.fillStyle = "#000";
          this.ctx.fillText(text, 15, 15);
        }
        static getDist(x1, y1, x2, y2) {
          return Math.sqrt(getSquaredDist(x1, y1, x2, y2));
        }
        static getSquaredDist(x1, y1, x2, y2) {
          return (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);
        }
      };
    }
  });

  // src/textFieldInputHelper.ts
  var TextFieldInputHelper;
  var init_textFieldInputHelper = __esm({
    "src/textFieldInputHelper.ts"() {
      "use strict";
      init_color();
      TextFieldInputHelper = class {
        constructor(appData, colorView) {
          __publicField(this, "appData");
          __publicField(this, "colorView");
          this.appData = appData;
          this.colorView = colorView;
        }
        setString() {
          console.log("setting string");
          var string = "";
          for (const color of this.appData.colors) {
            string += color.getHex() + "\n";
          }
          var textField = document.getElementById("text-color-input");
          textField.value = string;
        }
        readStringInput() {
          var textField = document.getElementById("text-color-input");
          var hexStrings = this.findHexColors(textField.value);
          console.log("reading text input");
          console.log(hexStrings);
          this.appData.colors = [];
          for (const text of hexStrings) {
            var rgb = Color.parse_hex(text);
            var color = new Color();
            color.setRgb(rgb.r, rgb.g, rgb.b);
            console.log("Adding color ");
            console.log(rgb);
            this.appData.colors.push(color);
          }
          this.colorView.colorsChanged();
        }
        findHexColors(text) {
          const regex = /#[0-9abcdefABCDEF]{6}/g;
          const matches = text.match(regex);
          return matches || [];
        }
      };
    }
  });

  // src/ui-elements.ts
  function loadUiElements(colorModeChanged, undoCallback, redoCallback) {
    const buttons = document.querySelectorAll(".segment button");
    buttons.forEach((btn) => {
      btn.onclick = () => {
        buttons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        if (btn.dataset.value) {
          colorModeChanged(btn.dataset.value);
        }
      };
    });
    document.getElementById("undo-button").onclick = () => {
      undoCallback();
    };
    document.getElementById("redo-button").onclick = () => {
      redoCallback();
    };
  }
  var init_ui_elements = __esm({
    "src/ui-elements.ts"() {
      "use strict";
    }
  });

  // src/slider.ts
  var Slider;
  var init_slider = __esm({
    "src/slider.ts"() {
      "use strict";
      Slider = class {
        constructor(canvas, name, x, y, w, h, value, min, max, sliderUpdated) {
          this.canvas = canvas;
          this.name = name;
          this.x = x;
          this.y = y;
          this.w = w;
          this.h = h;
          this.value = value;
          this.min = min;
          this.max = max;
          this.sliderUpdated = sliderUpdated;
          __publicField(this, "isSelected", false);
          __publicField(this, "triggeredUpdate", true);
          console.assert(max >= min);
        }
        draw() {
          this.canvas.ctx.font = `${Math.round(this.h) * 0.8}px Arial`;
          this.canvas.ctx.fillStyle = "#cac9c9";
          this.canvas.ctx.fillRect(this.x, this.y, this.w, this.h);
          this.canvas.ctx.fillStyle = "#000";
          var t = (this.value - this.min) / (this.max - this.min) * this.w;
          this.canvas.ctx.fillRect(this.x + t - 2, this.y, 4, this.h);
          this.canvas.ctx.textAlign = "left";
          this.canvas.ctx.fillText(this.name, this.x + 5, this.y + this.h * 0.8);
          this.canvas.ctx.textAlign = "right";
          this.canvas.ctx.fillText("" + Math.round(this.value), this.x + this.w - 5, this.y + this.h * 0.8);
          if (this.canvas.mouseIsPressed) {
            if (this.isSelected) {
              this.triggeredUpdate = false;
              var t = (this.canvas.mouseX - this.x) / this.w * (this.max - this.min);
              t = Math.min(this.max, t);
              t = Math.max(this.min, t);
              this.value = t;
            }
          } else {
            this.isSelected = false;
            if (!this.triggeredUpdate) {
              this.triggeredUpdate = true;
              this.sliderUpdated();
            }
          }
        }
        mouseDown() {
          if (this.x < this.canvas.mouseX && this.canvas.mouseX < this.x + this.w && this.y < this.canvas.mouseY && this.canvas.mouseY < this.y + this.h) {
            this.isSelected = true;
          }
        }
      };
    }
  });

  // src/views/circleView.ts
  var CircleColorView;
  var init_circleView = __esm({
    "src/views/circleView.ts"() {
      "use strict";
      init_color();
      init_slider();
      CircleColorView = class {
        constructor(canvas, appData) {
          __publicField(this, "sliders", []);
          __publicField(this, "didSelectCircle", false);
          __publicField(this, "didTriggerCircleUpdate", true);
          __publicField(this, "cx");
          __publicField(this, "cy");
          __publicField(this, "r");
          __publicField(this, "canvas");
          __publicField(this, "appData");
          this.canvas = canvas;
          this.appData = appData;
          this.cx = this.canvas.width * 0.5;
          this.cy = this.canvas.height * 0.4;
          this.r = this.canvas.height * 0.2;
          this.sliders = [];
          this.sliders.push(new Slider(canvas, "saturation", canvas.width * 0.2, canvas.height * 0.75, canvas.width * 0.6, 20, 0, 0, 100, () => {
            this.appData.saveColorState();
          }));
          this.sliders.push(new Slider(canvas, "value", canvas.width * 0.2, canvas.height * 0.85, canvas.width * 0.6, 20, 0, 0, 100, () => {
            this.appData.saveColorState();
          }));
          this.colorsChanged();
        }
        mouseDown() {
          for (const slider of this.sliders) {
            slider.mouseDown();
          }
        }
        draw() {
          const selectedColor = this.appData.getSelectedColor();
          const hsv = selectedColor == null ? void 0 : selectedColor.getHsv();
          if (!hsv) return;
          this.canvas.clearCanvasWhite();
          this.drawColorCircle(hsv);
          this.drawColorDots();
          for (const slider of this.sliders) {
            slider.draw();
          }
          const newColor = this.getNewColor(hsv);
          selectedColor == null ? void 0 : selectedColor.setHsv(newColor.h, newColor.s, newColor.v);
        }
        mouseUp() {
        }
        drawColorCircle(color_hsv) {
          const steps = 96;
          for (let i = 0; i < steps; i++) {
            const rgb = Color.hsv_to_rgb(360 / steps * i, color_hsv.s, color_hsv.v);
            this.canvas.ctx.fillStyle = Color.rgb_to_hex(rgb.r, rgb.g, rgb.b);
            this.canvas.drawRingArc(
              this.cx,
              this.cy,
              this.r * 1.15,
              this.r * 0.85,
              2 * Math.PI / steps * i - Math.PI * 0.5,
              2 * Math.PI / steps * (i + 1) - Math.PI * 0.5
            );
          }
        }
        drawColorDots() {
          var selectedColor = this.appData.getSelectedColor();
          var selectedColor_hsv = selectedColor == null ? void 0 : selectedColor.getHsv();
          for (var i = 0; i < this.appData.colors.length; i++) {
            var color_hsv = this.appData.colors[i].getHsv();
            this.canvas.ctx.fillStyle = selectedColor_hsv.v < 50 ? "#FFF" : "#000";
            const angle = color_hsv.h / 360 * (Math.PI * 2) - Math.PI * 0.5;
            var radius = 3;
            const dx = this.canvas.mouseX - this.cx;
            const dy = this.canvas.mouseY - this.cy;
            if (i == this.appData.selectedColorIndex) {
              radius = 5;
              if (this.isWithinSelection(dx, dy, color_hsv.h)) {
                radius = 7;
              }
            }
            this.canvas.drawDot(
              this.cx + Math.cos(angle) * this.r,
              this.cy + Math.sin(angle) * this.r,
              radius
            );
          }
        }
        isWithinSelection(dx, dy, hue) {
          var angle = Math.atan2(dy, dx) / Math.PI * 180 + 90;
          const mouse_r = dx * dx + dy * dy;
          if (mouse_r < this.r * 1.15 * (this.r * 1.15)) {
          } else {
            return false;
          }
          angle = (angle + 360) % 360;
          if (angle * 0.9 < hue && hue < angle * 1.1) {
            return true;
          } else {
            return false;
          }
        }
        getNewColor(color_hsv) {
          let hue = color_hsv.h;
          let sat = this.sliders[0].value;
          let val = this.sliders[1].value;
          const dx = this.canvas.mouseX - this.cx;
          const dy = this.canvas.mouseY - this.cy;
          if (this.canvas.mouseIsPressed) {
            if (!this.didSelectCircle) {
              if (this.isWithinSelection(dx, dy, hue)) {
                this.didSelectCircle = true;
                this.didTriggerCircleUpdate = false;
              }
            }
            if (this.didSelectCircle) {
              const angle = Math.atan2(dy, dx);
              let new_hue = angle / (Math.PI * 2) * 360 + 90 + 360;
              new_hue = new_hue % 360;
              hue = new_hue;
            }
          } else {
            this.didSelectCircle = false;
            if (!this.didTriggerCircleUpdate) {
              this.didTriggerCircleUpdate = true;
              this.appData.saveColorState();
            }
          }
          return { h: hue, s: sat, v: val };
        }
        colorsChanged() {
          const selectedColor = this.appData.getSelectedColor();
          const hsv = selectedColor == null ? void 0 : selectedColor.getHsv();
          if (hsv) {
            this.sliders[0].value = hsv.s;
            this.sliders[1].value = hsv.v;
          }
        }
      };
    }
  });

  // src/views/hsvView.ts
  var HSVView;
  var init_hsvView = __esm({
    "src/views/hsvView.ts"() {
      "use strict";
      init_slider();
      HSVView = class {
        constructor(canvas, appData) {
          __publicField(this, "sliders");
          __publicField(this, "canvas");
          __publicField(this, "appData");
          this.canvas = canvas;
          this.appData = appData;
          this.sliders = [];
          this.sliders.push(new Slider(canvas, "hue", canvas.width * 0.2, canvas.height * 0.4, canvas.width * 0.6, 20, 0, 0, 360, () => {
            this.appData.saveColorState();
          }));
          this.sliders.push(new Slider(canvas, "saturation", canvas.width * 0.2, canvas.height * 0.5, canvas.width * 0.6, 20, 0, 0, 100, () => {
            this.appData.saveColorState();
          }));
          this.sliders.push(new Slider(canvas, "lightness", canvas.width * 0.2, canvas.height * 0.6, canvas.width * 0.6, 20, 0, 0, 100, () => {
            this.appData.saveColorState();
          }));
          this.colorsChanged();
        }
        mouseDown() {
          for (var slider of this.sliders) {
            slider.mouseDown();
          }
        }
        draw() {
          var _a;
          var selectedColor = this.appData.getSelectedColor();
          this.canvas.clearCanvasWhite();
          this.canvas.ctx.fillStyle = (_a = selectedColor == null ? void 0 : selectedColor.getHex()) != null ? _a : "#888";
          const factor = 0.15;
          this.canvas.ctx.fillRect(this.canvas.width * factor / 2, this.canvas.height * factor / 2, this.canvas.width * (1 - factor), this.canvas.height * (1 - factor));
          for (var slider of this.sliders) {
            slider.draw();
          }
          selectedColor == null ? void 0 : selectedColor.setHsv(
            this.sliders[0].value,
            this.sliders[1].value,
            this.sliders[2].value
          );
        }
        colorsChanged() {
          var selectedColor = this.appData.getSelectedColor();
          var color = selectedColor == null ? void 0 : selectedColor.getHsv();
          if (color) {
            this.sliders[0].value = color.h;
            this.sliders[1].value = color.s;
            this.sliders[2].value = color.v;
          }
        }
      };
    }
  });

  // src/views/monoView.ts
  var MonoColorView;
  var init_monoView = __esm({
    "src/views/monoView.ts"() {
      "use strict";
      init_color();
      init_slider();
      MonoColorView = class {
        constructor(canvas, appData) {
          __publicField(this, "sliders");
          __publicField(this, "didSelectCircle", false);
          __publicField(this, "size");
          __publicField(this, "offset_y");
          __publicField(this, "offset_x");
          __publicField(this, "canvas");
          __publicField(this, "appData");
          this.canvas = canvas;
          this.appData = appData;
          this.sliders = [];
          this.sliders.push(new Slider(canvas, "hue", canvas.width * 0.2, canvas.height * 0.9, canvas.width * 0.6, 20, 0, 0, 360, () => {
          }));
          this.size = this.canvas.height * 0.7;
          this.offset_y = this.canvas.height * 0.15;
          this.offset_x = (this.canvas.width - this.size) / 2;
          this.colorsChanged();
        }
        mouseDown() {
          for (var slider of this.sliders) {
            slider.mouseDown();
          }
        }
        draw() {
          var selectedColor = this.appData.getSelectedColor();
          var color_hsv = selectedColor == null ? void 0 : selectedColor.getHsv();
          this.canvas.clearCanvasWhite();
          if (color_hsv == void 0) return;
          this.drawColorSquare(color_hsv);
          this.drawColorDots();
          for (var slider of this.sliders) {
            slider.draw();
          }
          var newColor = this.getNewColor(color_hsv);
          selectedColor == null ? void 0 : selectedColor.setHsv(newColor.h, newColor.s, newColor.v);
        }
        drawColorSquare(color_hsv) {
          var steps = 64;
          var s = this.size / steps;
          for (var i = 0; i < steps; i++) {
            for (var j = 0; j < steps; j++) {
              var color_rgb = Color.hsv_to_rgb(color_hsv.h, i / steps * 100, 100 - j / steps * 100);
              this.canvas.ctx.fillStyle = Color.rgb_to_hex(color_rgb.r, color_rgb.g, color_rgb.b);
              this.canvas.ctx.fillRect(this.offset_x + i * s, this.offset_y + j * s, s + 1, s + 1);
            }
          }
        }
        drawColorDots() {
          for (var i = 0; i < this.appData.colors.length; i++) {
            var color_hsv = this.appData.colors[i].getHsv();
            if (color_hsv.v < 50) {
              this.canvas.ctx.fillStyle = "#FFF";
            } else {
              this.canvas.ctx.fillStyle = "#000";
            }
            this.canvas.drawDot(
              this.offset_x + color_hsv.s / 100 * this.size,
              this.offset_y + (100 - color_hsv.v) / 100 * this.size,
              this.appData.selectedColorIndex == i ? 5 : 3
            );
          }
        }
        getNewColor(color_hsv) {
          var hue = color_hsv.h;
          var sat = color_hsv.s;
          var val = color_hsv.v;
          if (this.canvas.mouseIsPressed) {
            if (this.offset_x <= this.canvas.mouseX && this.canvas.mouseX <= this.offset_x + this.size && this.offset_y <= this.canvas.mouseY && this.canvas.mouseY <= this.offset_y + this.size) {
              this.didSelectCircle = true;
            }
            if (this.didSelectCircle == true) {
              var new_sat = (this.canvas.mouseX - this.offset_x) / this.size * 100;
              var new_val = (this.canvas.mouseY - this.offset_y) / this.size * 100;
              new_sat = Math.min(Math.max(0, new_sat), 100);
              new_val = 100 - Math.min(Math.max(0, new_val), 100);
              sat = new_sat;
              val = new_val;
            }
          } else {
            this.didSelectCircle = false;
          }
          hue = this.sliders[0].value;
          return { h: hue, s: sat, v: val };
        }
        colorsChanged() {
          var selectedColor = this.appData.getSelectedColor();
          var color = selectedColor == null ? void 0 : selectedColor.getHsv();
          if (color) {
            this.sliders[0].value = color.h;
          }
        }
      };
    }
  });

  // src/views/rgbView.ts
  var RGBView;
  var init_rgbView = __esm({
    "src/views/rgbView.ts"() {
      "use strict";
      init_slider();
      RGBView = class {
        constructor(canvas, appData) {
          __publicField(this, "sliders");
          __publicField(this, "canvas");
          __publicField(this, "appData");
          this.canvas = canvas;
          this.appData = appData;
          this.sliders = [];
          this.sliders.push(new Slider(canvas, "red", canvas.width * 0.2, canvas.height * 0.4, canvas.width * 0.6, 20, 0, 0, 255, () => {
            this.appData.saveColorState();
          }));
          this.sliders.push(new Slider(canvas, "green", canvas.width * 0.2, canvas.height * 0.5, canvas.width * 0.6, 20, 0, 0, 255, () => {
            this.appData.saveColorState();
          }));
          this.sliders.push(new Slider(canvas, "blue", canvas.width * 0.2, canvas.height * 0.6, canvas.width * 0.6, 20, 0, 0, 255, () => {
            this.appData.saveColorState();
          }));
          this.colorsChanged();
        }
        mouseDown() {
          for (var slider of this.sliders) {
            slider.mouseDown();
          }
        }
        draw() {
          var _a;
          var selectedColor = this.appData.getSelectedColor();
          this.canvas.clearCanvasWhite();
          this.canvas.ctx.fillStyle = (_a = selectedColor == null ? void 0 : selectedColor.getHex()) != null ? _a : "#888";
          const factor = 0.15;
          this.canvas.ctx.fillRect(this.canvas.width * factor / 2, this.canvas.height * factor / 2, this.canvas.width * (1 - factor), this.canvas.height * (1 - factor));
          for (var slider of this.sliders) {
            slider.draw();
          }
          selectedColor == null ? void 0 : selectedColor.setRgb(
            this.sliders[0].value,
            this.sliders[1].value,
            this.sliders[2].value
          );
        }
        colorsChanged() {
          var selectedColor = this.appData.getSelectedColor();
          var color = selectedColor == null ? void 0 : selectedColor.getRgb();
          if (color) {
            this.sliders[0].value = color.r;
            this.sliders[1].value = color.g;
            this.sliders[2].value = color.b;
          }
        }
      };
    }
  });

  // src/views/undoButtonsView.ts
  var UndoButtonView;
  var init_undoButtonsView = __esm({
    "src/views/undoButtonsView.ts"() {
      "use strict";
      UndoButtonView = class {
        constructor(canvas, undoCallback, redoCallback) {
          __publicField(this, "buttonHeight", 30);
          __publicField(this, "buttonWidth", 40);
          __publicField(this, "yoffset", 50 + 2);
          __publicField(this, "canvas");
          __publicField(this, "undoCallback");
          __publicField(this, "redoCallback");
          this.canvas = canvas;
          this.undoCallback = undoCallback;
          this.redoCallback = redoCallback;
        }
        mouseClick() {
          if (this.yoffset + 2 < this.canvas.mouseY && this.canvas.mouseY < this.yoffset + 2 + this.buttonHeight) {
            if (0 < this.canvas.mouseX && this.canvas.mouseX < this.buttonWidth) {
              console.log("Fooo 1");
              this.undoCallback();
            }
          }
          if (this.yoffset + 2 < this.canvas.mouseY && this.canvas.mouseY < this.yoffset + 2 + this.buttonHeight) {
            if (this.buttonWidth < this.canvas.mouseX && this.canvas.mouseX < 2 * this.buttonWidth) {
              console.log("Fooo 2");
              this.redoCallback();
            }
          }
        }
        draw() {
          this.canvas.ctx.fillStyle = "#888";
          this.canvas.ctx.fillRect(0, this.yoffset + 2, this.buttonWidth * 2, this.buttonHeight);
          if (this.yoffset + 2 < this.canvas.mouseY && this.canvas.mouseY < this.yoffset + 2 + this.buttonHeight) {
            if (0 < this.canvas.mouseX && this.canvas.mouseX < this.buttonWidth) {
              this.canvas.ctx.lineWidth = 3;
            }
          }
          this.canvas.drawLeftArrow(0, this.yoffset + 2, this.buttonWidth, this.buttonHeight);
          this.canvas.ctx.lineWidth = 1;
          if (this.yoffset + 2 < this.canvas.mouseY && this.canvas.mouseY < this.yoffset + 2 + this.buttonHeight) {
            if (this.buttonWidth < this.canvas.mouseX && this.canvas.mouseX < 2 * this.buttonWidth) {
              this.canvas.ctx.lineWidth = 3;
            }
          }
          this.canvas.drawRightArrow(this.buttonWidth, this.yoffset + 2, this.buttonWidth, this.buttonHeight);
          this.canvas.ctx.lineWidth = 1;
        }
      };
    }
  });

  // src/index.ts
  var require_index = __commonJS({
    "src/index.ts"() {
      init_appData();
      init_canvas_helper();
      init_color();
      init_textFieldInputHelper();
      init_ui_elements();
      init_circleView();
      init_hsvView();
      init_monoView();
      init_rgbView();
      init_undoButtonsView();
      console.log("Hello World");
      var mainCanvas;
      var colorView;
      var undoButtonsView;
      var appData = new AppData();
      var textfieldInputHelper;
      function setup() {
        setupCanvases();
        textfieldInputHelper = new TextFieldInputHelper(appData, colorView);
        appData.updateTextFieldCallback = () => {
          textfieldInputHelper.setString();
        };
        loadUiElements(
          colorModeChanged,
          () => {
            appData.undo();
            colorView.colorsChanged();
          },
          () => {
            appData.redo();
            colorView.colorsChanged();
          }
        );
        document.getElementById("add-color-btn").onclick = addColor;
        var button = document.getElementById("update-color-textinput");
        button.onclick = () => textfieldInputHelper.readStringInput();
        appData.saveColorState();
      }
      setup();
      function setupCanvases() {
        mainCanvas = new CanvasHelper("canvas", 700, 500, () => {
          mouseClick();
        }, () => {
          mouseDown();
        }, () => {
          draw();
        });
        mainCanvas.clearCanvas();
        colorView = new CircleColorView(mainCanvas, appData);
        undoButtonsView = new UndoButtonView(mainCanvas, () => {
          appData.undo();
          colorView.colorsChanged();
        }, () => {
          appData.redo();
          colorView.colorsChanged();
        });
        console.log("Setting up Canvas");
        console.log(appData.colors);
      }
      function colorModeChanged(value) {
        console.log("Changing color mode to " + value);
        switch (value) {
          case "rgb":
            colorView = new RGBView(mainCanvas, appData);
            break;
          case "hsv":
            colorView = new HSVView(mainCanvas, appData);
            break;
          case "mono":
            colorView = new MonoColorView(mainCanvas, appData);
            break;
          case "circle":
            colorView = new CircleColorView(mainCanvas, appData);
            break;
        }
      }
      function addColor() {
        var c = new Color();
        c.setRandom();
        appData.colors.push(c);
        colorView.colorsChanged();
      }
      function mouseClick() {
        undoButtonsView.mouseClick();
      }
      function mouseDown() {
        colorView.mouseDown();
      }
      var savedColorHeight = 50;
      function draw() {
        colorView.draw();
        drawSavedColors();
      }
      function drawSavedColors() {
        var _a, _b;
        var n = appData.colors.length;
        var s = mainCanvas.width / n;
        for (var i = 0; i < n; i++) {
          mainCanvas.ctx.fillStyle = (_b = (_a = appData.colors[i]) == null ? void 0 : _a.getHex()) != null ? _b : "#000";
          if (i == appData.selectedColorIndex) {
            mainCanvas.ctx.fillRect(i * s, 0, s, savedColorHeight);
          } else {
            mainCanvas.ctx.fillRect(i * s, savedColorHeight * 0.125, s, savedColorHeight * 0.75);
          }
        }
        mainCanvas.ctx.lineWidth = 3;
        mainCanvas.ctx.lineWidth = 1;
        if (mainCanvas.mouseIsPressed && mainCanvas.mouseY < savedColorHeight) {
          var prevIndex = appData.selectedColorIndex;
          appData.selectedColorIndex = Math.floor(mainCanvas.mouseX / s);
          if (appData.selectedColorIndex != prevIndex) {
            colorView.colorsChanged();
          }
        }
      }
    }
  });
  require_index();
})();
//# sourceMappingURL=bundle.js.map
