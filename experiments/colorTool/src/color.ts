import { ColorHistory } from "./colorHistory";

export class Color {

    private r: number = 0;
    private g: number = 0;
    private b: number = 0;

    // RGB

    getRgb() {
        return {r: this.r, g:this.g, b: this.b};
    }

    setRgb(r: number, g: number, b: number) {
        this.r = r;
        this.g = g;
        this.b = b;
    }

    // HSV

    getHsv() {
        return Color.rgb_to_hsv(this.r, this.g, this.b);
    }

    setHsv(h: number, s: number, v: number) {
        var rgb = Color.hsv_to_rgb(h,s,v);
        this.r = rgb.r;
        this.g = rgb.g;
        this.b = rgb.b
    }

    // other

    setRandom() {
        this.r = Math.floor(Math.random()*256);
        this.g = Math.floor(Math.random()*256);
        this.b = Math.floor(Math.random()*256);
    }

    getHex() {
        var c = this.getRgb();
        return Color.rgb_to_hex(c.r, c.g, c.b);
    }

    // Static Converters

    public static rgb_to_hex(r: number, g: number, b: number) {
    // Ensure values are in range 0-255
        const clamp = (val: number) => Math.max(0, Math.min(255, val));

        // Convert to hex and pad with leading zeros if needed
        const toHex = (val: number) => clamp(val).toString(16).padStart(2, "0");

        return `#${toHex(Math.round(r))}${toHex(Math.round(g))}${toHex(Math.round(b))}`;
    }

    public static parse_hex(text: string) {

        const r = parseInt(text.slice(1, 3), 16);
        const g = parseInt(text.slice(3, 5), 16);
        const b = parseInt(text.slice(5, 7), 16);

        return { r, g, b };
    }

    public static rgb_to_hsv(r_in: number, g_in: number, b_in: number) {

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
        const diffc = function (c: number) {
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
                    h = (1 / 3) + rdif - bdif;

                    break;
                }

                case b: {
                    h = (2 / 3) + gdif - rdif;

                    break;
                }
            // No default
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
            v: v * 100,
        };
    };

    public static hsv_to_rgb(h_in: number, s_in: number, v_in: number) {
        const h = h_in / 60;
        const s = s_in / 100;
        let v = v_in / 100;
        const hi = Math.floor(h) % 6;

        const f = h - Math.floor(h);
        const p = 255 * v * (1 - s);
        const q = 255 * v * (1 - (s * f));
        const t = 255 * v * (1 - (s * (1 - f)));
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
        return {r: 0, g:0, b: 0};
    }; 
}