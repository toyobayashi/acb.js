export declare type TableRow = { [key: string]: any }[]
export declare type TableColumn = ([string, string] | [string, string, any])[]
export declare type AcbHeader = {
  u1: number
  tableDataOffset: number
  stringDataOffset: number
  binaryDataOffset: number
  tableNameStringOffset: number
  columnLength: number
  rowTotalByte: number
  rowLength: number
}
export declare type AwbHeader = {
  offsetSize: number
  fileCount: number
  alignment: number
  ids: number[]
  fileEndPoints: number[]
}

export declare class Reader {
  buf: Buffer
  pos: number
  length: number
  constructor(buf: Buffer)

  read (size?: number): Buffer
  tell (): number
  seek (at: number, where?: number): void
  readInt8 (): number
  readUInt8 (): number
  readInt16BE (): number
  readUInt16BE (): number
  readInt16LE (): number
  readUInt16LE (): number
  readInt32BE (): number
  readUInt32BE (): number
  readInt32LE (): number
  readUInt32LE (): number
  readInt64BE (): number
  readUInt64BE (): number
  readInt64LE (): number
  readUInt64LE (): number
  readDoubleBE (): number
  readDoubleLE (): number
  readFloatBE (): number
  readFloatLE (): number
  readUIntBE (byteLength: number): number
  readUIntLE (byteLength: number): number
}

export declare class UTFTable {
  r: Reader
  length: number
  header: AcbHeader
  name: string
  columns: TableColumn
  rows: TableRow

  readHeader (): AcbHeader
  readString (offset: number): string
  readData (offset: number, type: number): any
  readBinary (offset: number, length: number): Buffer
  readColumns (): TableColumn
  readRows (): TableRow
  static dataType: [
    'UInt8',
    'Int8',
    'UInt16',
    'Int16',
    'UInt32',
    'Int32',
    'UInt64',
    'Int64',
    'Float',
    'Double',
    'String',
    'Binary'
  ]
  static columnType: {
    ZERO: 0x10,
    CONSTANT: 0x30,
    PERROW: 0x50,
    CONSTANT2: 0x70
  }
  static dataLength: {
    [0x00]: 1,
    [0x01]: 1,
    [0x02]: 2,
    [0x03]: 2,
    [0x04]: 4,
    [0x05]: 4,
    [0x06]: 8,
    [0x07]: 8,
    [0x08]: 4,
    [0x09]: 8,
    [0x0a]: 4,
    [0x0b]: 8
  }
}

export declare class AFSArchive {
  r: Reader
  length: number
  header: AwbHeader
  files: { [x: string]: Buffer }
  constructor (awb: Buffer)

  readHeader (): AwbHeader
  getFiles (): { [x: string]: Buffer }
}

export declare interface Track {
  cueId: number
  cueName: string
  wavId: number
  encodeType: number
  streaming: number
}

export declare class TrackList {
  cueTable: UTFTable
  cueNameTable: UTFTable
  waveformTable: UTFTable
  synthTable: UTFTable
  tracks: Track[]
}

export declare interface Entry {
  id: number
  name: string
  buffer: Buffer
}

export declare class Acb {
  path: string
  headerTable: UTFTable
  trackList: TrackList
  awbFile: AFSArchive
  constructor (acbFile: string | Buffer, awbFile?: string | Buffer)

  extract (targetDir?: string | null): Promise<void[]>
  extract (callback: () => void): void
  extract (targetDir: string | undefined | null, callback: () => void): void
  extractSync (targetDir?: string | null): void

  getHeaderTable (): TableRow
  getCueTable (): TableRow
  getCueNameTable (): TableRow
  getWaveformTable (): TableRow
  getSynthTable (): TableRow
  getFileList (): Entry[]

  static encodeType: {
    0: '.adx',
    2: '.hca',
    7: '.at3',
    8: '.vag',
    9: '.bcwav',
    13: '.dsp'
  }

  static extract (acbFile: string, targetDir?: string | null): Promise<void[]>
  static extract (acbFile: string, callback: () => void): void
  static extract (acbFile: string, targetDir: string | undefined | null, callback: () => void): void
  static extractSync (acbFile: string, targetDir?: string | null): void
}
