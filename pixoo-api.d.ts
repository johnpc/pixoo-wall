// Docs located at https://www.npmjs.com/package/pixoo-api
declare module "pixoo-api" {
  export class PixooAPI {
    initialize: () => undefined;
    clear: () => undefined;
    fill: (color: Color) => undefined;
    drawPixel: (x: number, y: number, color: Color) => undefined;
    drawChar: (
      char: string,
      position: Position,
      color: Color,
      font?
    ) => undefined;
    drawText: (
      text: string,
      position: Position,
      color: Color,
      font?
    ) => undefined;
    drawTextCenter: (text: string, y, color: Color, font?) => undefined;
    drawTextLeft: (text: string, y, color: Color, padding, font?) => undefined;
    drawTextRight: (text: string, y, color: Color, padding, font?) => undefined;
    drawRect: (
      start: Position,
      end: Position,
      color: Color,
      fill = false
    ) => undefined;
    drawLine: (start: Position, end: Position, color: Color) => undefined;
    drawImage: (path, pos: Position, size) => undefined;
    push: () => undefined;
    buffer: Buffer;
    pushCount: Number;
    pushAvgElapsed: Number;
    constructor(pixooIpAddress: string, canvasSizeInPixels = 64) {}
  }
  export type Position = Number[];
  export enum Color {
    Black = [0, 0, 0],
    White = [255, 255, 255],
    Red = [255, 0, 0],
    Green = [0, 255, 0],
    Blue = [0, 0, 255],
    Yellow = [255, 255, 0],
    Cyan = [0, 255, 255],
    Magenta = [255, 0, 255],
    Orange = [255, 165, 0],
    Purple = [128, 0, 128],
    Lime = [0, 255, 0],
    Maroon = [128, 0, 0],
    Navy = [0, 0, 128],
    Teal = [0, 128, 128],
    Olive = [128, 128, 0],
    Gray = [128, 128, 128],
    Silver = [192, 192, 192],
    Pink = [255, 192, 203],
    Brown = [165, 42, 42],
    Beige = [245, 245, 220],
    Mint = [189, 252, 201],
    Lavender = [230, 230, 250],
    Coral = [255, 127, 80],
    Turquoise = [64, 224, 208],
    Violet = [238, 130, 238],
    Peach = [255, 218, 185],
    Apricot = [251, 206, 177],
    Aqua = [150, 250, 150],
    Salmon = [250, 128, 114],
    Gold = [255, 215, 0],
    Khaki = [240, 230, 140],
    Crimson = [220, 20, 60],
    Azure = [240, 255, 255],
    MintCream = [245, 255, 250],
    AliceBlue = [240, 248, 255],
    LavenderBlush = [255, 240, 245],
    Seashell = [255, 245, 238],
    Honeydew = [240, 255, 240],
    MintCream = [245, 255, 250],
    GhostWhite = [248, 248, 255],
    WhiteSmoke = [245, 245, 245],
    FloralWhite = [255, 250, 240],
    AntiqueWhite = [250, 235, 215],
    Linen = [250, 240, 230],
    OldLace = [253, 245, 230],
    Ivory = [255, 255, 240],
    Cornsilk = [255, 248, 220],
    LemonChiffon = [255, 250, 205],
    LightYellow = [255, 255, 224],
    LightGoldenrodYellow = [250, 250, 210],
    PapayaWhip = [255, 239, 213],
  }
}
